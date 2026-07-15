import { Request, Response } from 'express'
import prisma from '../config/db'

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      include: { manager: true, shelter: true },
      orderBy: { id: 'asc' }
    })

    const mapped = teams.map(t => ({
      id: t.id.toString(),
      team_name: t.team_name,
      manager_name: t.manager ? `${t.manager.first_name} ${t.manager.last_name}` : 'No Manager',
      manager_agent_id: t.manager_agent_id ? t.manager_agent_id.toString() : null,
      base_shelter: t.shelter.shelter_name,
      base_shelter_id: t.base_shelter_id.toString()
    }))

    res.json(mapped)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createTeam = async (req: Request, res: Response) => {
  const { team_name, manager_agent_id, base_shelter_id } = req.body

  try {
    const team = await prisma.team.create({
      data: {
        team_name: team_name || 'New Team',
        manager_agent_id: manager_agent_id ? parseInt(manager_agent_id) : null,
        base_shelter_id: parseInt(base_shelter_id)
      }
    })

    res.status(201).json({
      id: team.id.toString(),
      team_name: team.team_name,
      manager_agent_id: team.manager_agent_id ? team.manager_agent_id.toString() : null,
      base_shelter_id: team.base_shelter_id.toString()
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params
  const { team_name, manager_agent_id, base_shelter_id } = req.body

  try {
    const updated = await prisma.team.update({
      where: { id: parseInt(id) },
      data: {
        team_name,
        manager_agent_id: manager_agent_id ? parseInt(manager_agent_id) : undefined,
        base_shelter_id: base_shelter_id ? parseInt(base_shelter_id) : undefined
      }
    })

    res.json({ message: 'Team updated successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await prisma.team.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Team deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
