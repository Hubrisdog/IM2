import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import prisma from '../config/db'
import { parseId } from '../utils/parser'

export const getAgents = async (req: Request, res: Response) => {
  try {
    const agents = await prisma.agent.findMany({
      include: { role: true },
      orderBy: { id: 'asc' }
    })

    const mapped = agents.map(a => {
      let availability = 'Available'
      if (a.status === 'Offline') availability = 'On Leave'
      else if (a.status === 'Busy') availability = 'Busy'

      return {
        id: `res-${a.id}`,
        name: `${a.first_name} ${a.last_name}`,
        phone: a.phone,
        email: a.email,
        skills: 'Canine Handling, Trapping, Animal Rescue',
        availability: availability as any,
        created_at: new Date().toISOString()
      }
    })

    res.json(mapped)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createAgent = async (req: Request, res: Response) => {
  const { name, phone, email, skills, availability } = req.body

  try {
    const existing = await prisma.agent.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const names = (name || 'New Rescuer').split(' ')
    const first_name = names[0]
    const last_name = names.slice(1).join(' ') || 'User'

    const role = await prisma.role.findFirst({
      where: { role_name: 'Rescuer' }
    })

    let status = 'Active'
    if (availability === 'On Leave') status = 'Offline'
    else if (availability === 'Busy') status = 'Busy'

    const hashedPassword = await bcrypt.hash('agent123', 10)

    const agent = await prisma.agent.create({
      data: {
        first_name,
        last_name,
        email,
        phone: phone || '',
        password: hashedPassword,
        role_id: role ? role.id : 2,
        status
      }
    })

    await prisma.activityLog.create({
      data: {
        entity_type: 'Rescuer',
        entity_id: agent.id,
        action: `New rescuer profile created: ${name}`,
        user: 'Manager'
      }
    })

    res.status(201).json({
      id: `res-${agent.id}`,
      name: `${agent.first_name} ${agent.last_name}`,
      phone: agent.phone,
      email: agent.email,
      skills: skills || 'General Rescue skills',
      availability: availability || 'Available',
      created_at: new Date().toISOString()
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateAgent = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, phone, email, availability } = req.body

  try {
    const parsedId = parseId(id)
    if (!parsedId) return res.status(400).json({ message: 'Invalid agent ID' })

    const currentAgent = await prisma.agent.findUnique({
      where: { id: parsedId }
    })

    if (!currentAgent) {
      return res.status(404).json({ message: 'Agent not found' })
    }

    const data: any = {}
    if (name) {
      const names = name.split(' ')
      data.first_name = names[0]
      data.last_name = names.slice(1).join(' ') || ''
    }
    if (phone !== undefined) data.phone = phone
    if (email !== undefined) data.email = email

    if (availability !== undefined) {
      if (availability === 'Available') data.status = 'Active'
      else if (availability === 'On Leave') data.status = 'Offline'
      else if (availability === 'Busy') data.status = 'Busy'
    }

    const updated = await prisma.agent.update({
      where: { id: parsedId },
      data
    })

    const actionText = availability && availability !== currentAgent.status
      ? `Rescuer ${updated.first_name} ${updated.last_name} availability changed to ${availability}`
      : `Rescuer ${updated.first_name} ${updated.last_name} profile updated`

    await prisma.activityLog.create({
      data: {
        entity_type: 'Rescuer',
        entity_id: updated.id,
        action: actionText,
        user: 'Manager'
      }
    })

    res.json({ message: 'Agent updated successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteAgent = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const parsedId = parseId(id)
    if (!parsedId) return res.status(400).json({ message: 'Invalid agent ID' })

    await prisma.agent.delete({
      where: { id: parsedId }
    })

    await prisma.activityLog.create({
      data: {
        entity_type: 'Rescuer',
        entity_id: parsedId,
        action: `Rescuer profile deleted`,
        user: 'Manager'
      }
    })

    res.json({ message: 'Agent deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
