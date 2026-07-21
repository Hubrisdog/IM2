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
  const { animal_id, veterinarian, diagnosis, medication, procedure, follow_up_date, notes } = req.body

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
      // Find first veterinarian role agent
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

    const treatment = await prisma.animal_Treatment.create({
      data: {
        animal_id: parsedAnimalId,
        vet_agent_id: vet.id,
        followup_date: follow_up_date ? new Date(follow_up_date) : null,
        diagnosis: diagnosis || '',
        treatment: procedure || '',
        medication: medication || '',
        notes: notes || '',
        ticket_id: animal?.ticket_id || null
      }
    })

    // Log action
    await prisma.activityLog.create({
      data: {
        entity_type: 'Treatment',
        entity_id: treatment.id,
        action: `Treatment logged for ${animal ? animal.name : 'Unknown'}: ${treatment.diagnosis}`,
        user: `${vet.first_name} ${vet.last_name}`
      }
    })

    res.status(201).json({
      id: `treat-${treatment.id}`,
      animal_id: `ani-${treatment.animal_id}`,
      date: treatment.created_at.toISOString(),
      veterinarian: `${vet.first_name} ${vet.last_name}`,
      diagnosis: treatment.diagnosis,
      medication: treatment.medication,
      procedure: treatment.treatment,
      follow_up_date: treatment.followup_date ? treatment.followup_date.toISOString().split('T')[0] : null,
      notes: treatment.notes,
      created_at: treatment.created_at.toISOString()
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateTreatment = async (req: Request, res: Response) => {
  const { id } = req.params
  const { diagnosis, medication, procedure, follow_up_date, notes } = req.body

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

    const updated = await prisma.animal_Treatment.update({
      where: { id: parsedId },
      data: {
        diagnosis,
        medication,
        treatment: procedure,
        followup_date: follow_up_date ? new Date(follow_up_date) : undefined,
        notes
      },
      include: { vet: true }
    })

    // Log action
    await prisma.activityLog.create({
      data: {
        entity_type: 'Treatment',
        entity_id: updated.id,
        action: `Treatment record updated for ${currentTreatment.animal.name}`,
        user: `${updated.vet.first_name} ${updated.vet.last_name}`
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
