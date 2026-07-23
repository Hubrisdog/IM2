import { Request, Response } from 'express'
import prisma from '../config/db'
import { parseId } from '../utils/parser'

export const getTreatments = async (req: Request, res: Response) => {
  try {
    const treatments = await prisma.animal_Treatment.findMany({
      include: { vet: true },
      orderBy: { created_at: 'desc' }
    })

    const mapped = treatments.map(t => ({
      id: `trt-${t.id}`,
      animal_id: `ani-${t.animal_id}`,
      date: t.created_at.toISOString(),
      treatment_date: t.created_at.toISOString().split('T')[0],
      veterinarian: t.vet ? `${t.vet.first_name} ${t.vet.last_name}` : 'Dr. Alice Vance',
      diagnosis: t.diagnosis || 'General Triage Exam',
      medication: t.medication || 'None',
      procedure: t.treatment || 'Checkup',
      follow_up_date: t.followup_date ? t.followup_date.toISOString().split('T')[0] : null,
      notes: t.notes || '',
      created_at: t.created_at.toISOString()
    }))

    res.json(mapped)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createTreatment = async (req: Request, res: Response) => {
  const { animal_id, veterinarian, diagnosis, medication, procedure, follow_up_date, notes, recommendation } = req.body

  try {
    const parsedAnimalId = parseId(animal_id)
    if (!parsedAnimalId) {
      return res.status(400).json({ message: 'Invalid animal ID' })
    }

    // Resolve veterinarian agent ID from name
    const names = (veterinarian || 'Dr. Alice Vance').split(' ')
    const first_name = names[0]
    const last_name = names.slice(1).join(' ') || ''

    let vet = await prisma.agent.findFirst({
      where: {
        first_name: { contains: first_name },
        last_name: { contains: last_name }
      }
    })

    if (!vet) {
      const vetRole = await prisma.role.findFirst({ where: { role_name: 'Veterinarian' } })
      vet = await prisma.agent.findFirst({
        where: { role_id: vetRole?.id || 3 }
      })
    }

    if (!vet) {
      return res.status(400).json({ message: 'No registered Veterinarian found to log treatment' })
    }

    const animal = await prisma.animal.findUnique({
      where: { id: parsedAnimalId }
    })

    // Automatic Animal Status Update based on Veterinary Assessment Recommendation
    let updatedAnimalStatus: string | undefined = undefined
    if (recommendation === 'Ready for Adoption' || recommendation === 'Ready for Release') {
      updatedAnimalStatus = 'Recovered'
    } else if (recommendation === 'Continue Treatment' || recommendation === 'Critical Care' || recommendation === 'Under Observation') {
      updatedAnimalStatus = 'Under Treatment'
    }

    const treatmentNotes = recommendation 
      ? `[Medical Recommendation: ${recommendation}] ${notes || ''}`.trim()
      : (notes || '')

    const vetId = vet.id
    const vetName = `${vet.first_name} ${vet.last_name}`

    // Execute multi-query operation atomically inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      if (updatedAnimalStatus && animal) {
        await tx.animal.update({
          where: { id: parsedAnimalId },
          data: { status: updatedAnimalStatus }
        })
      }

      const treatment = await tx.animal_Treatment.create({
        data: {
          animal_id: parsedAnimalId,
          vet_agent_id: vetId,
          followup_date: follow_up_date ? new Date(follow_up_date) : null,
          diagnosis: diagnosis || '',
          treatment: procedure || '',
          medication: medication || '',
          notes: treatmentNotes,
          ticket_id: animal?.ticket_id || null
        }
      })

      const actionLog = recommendation
        ? `Veterinary Assessment by ${vetName} for ${animal ? animal.name : 'Patient'}: Medical Clearance -> ${recommendation}`
        : `Treatment logged for ${animal ? animal.name : 'Unknown'}: ${treatment.diagnosis}`

      await tx.activityLog.create({
        data: {
          entity_type: 'Treatment',
          entity_id: treatment.id,
          action: actionLog,
          user: vetName
        }
      })

      return treatment
    })

    res.status(201).json({
      id: `trt-${result.id}`,
      animal_id: `ani-${result.animal_id}`,
      date: result.created_at.toISOString(),
      treatment_date: result.created_at.toISOString().split('T')[0],
      veterinarian: vetName,
      diagnosis: result.diagnosis,
      medication: result.medication,
      procedure: result.treatment,
      follow_up_date: result.followup_date ? result.followup_date.toISOString().split('T')[0] : null,
      notes: result.notes,
      recommendation: recommendation || 'Continue Treatment',
      created_at: result.created_at.toISOString()
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateTreatment = async (req: Request, res: Response) => {
  const { id } = req.params
  const { diagnosis, medication, procedure, follow_up_date, notes, recommendation } = req.body

  try {
    const parsedId = parseId(id)
    if (!parsedId) return res.status(400).json({ message: 'Invalid treatment ID' })

    const currentTreatment = await prisma.animal_Treatment.findUnique({
      where: { id: parsedId },
      include: { animal: true }
    })

    if (!currentTreatment) {
      return res.status(404).json({ message: 'Treatment record not found' })
    }

    // Automatic Animal Status Update based on Veterinary Assessment Recommendation
    let updatedAnimalStatus: string | undefined = undefined
    if (recommendation === 'Ready for Adoption' || recommendation === 'Ready for Release') {
      updatedAnimalStatus = 'Recovered'
    } else if (recommendation === 'Continue Treatment' || recommendation === 'Critical Care' || recommendation === 'Under Observation') {
      updatedAnimalStatus = 'Under Treatment'
    }

    if (updatedAnimalStatus && currentTreatment.animal) {
      await prisma.animal.update({
        where: { id: currentTreatment.animal_id },
        data: { status: updatedAnimalStatus }
      })
    }

    const treatmentNotes = recommendation 
      ? `[Medical Recommendation: ${recommendation}] ${notes || ''}`.trim()
      : (notes || '')

    const updated = await prisma.animal_Treatment.update({
      where: { id: parsedId },
      data: {
        diagnosis,
        medication,
        treatment: procedure,
        followup_date: follow_up_date ? new Date(follow_up_date) : undefined,
        notes: treatmentNotes
      },
      include: { vet: true }
    })

    const vetName = `${updated.vet.first_name} ${updated.vet.last_name}`
    const actionLog = recommendation
      ? `Veterinary Assessment updated by ${vetName} for ${currentTreatment.animal.name}: Medical Clearance -> ${recommendation}`
      : `Treatment record updated for ${currentTreatment.animal.name}`

    // Log action
    await prisma.activityLog.create({
      data: {
        entity_type: 'Treatment',
        entity_id: updated.id,
        action: actionLog,
        user: vetName
      }
    })

    res.json({ message: 'Treatment updated successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteTreatment = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const parsedId = parseId(id)
    if (!parsedId) return res.status(400).json({ message: 'Invalid treatment ID' })

    await prisma.animal_Treatment.delete({
      where: { id: parsedId }
    })

    // Log action
    await prisma.activityLog.create({
      data: {
        entity_type: 'Treatment',
        entity_id: parsedId,
        action: `Treatment record deleted`,
        user: 'Veterinarian'
      }
    })

    res.json({ message: 'Treatment deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
