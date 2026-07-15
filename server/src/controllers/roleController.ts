import { Request, Response } from 'express'
import prisma from '../config/db'

export const getRoles = async (req: Request, res: Response) => {
  try {
    const list = await prisma.role.findMany({
      orderBy: { id: 'asc' }
    })
    res.json(list.map(r => ({
      id: r.id.toString(),
      role_name: r.role_name
    })))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createRole = async (req: Request, res: Response) => {
  const { role_name } = req.body

  try {
    const r = await prisma.role.create({
      data: { role_name }
    })
    res.status(201).json({
      id: r.id.toString(),
      role_name: r.role_name
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
