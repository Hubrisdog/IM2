import { Request, Response } from 'express'
import prisma from '../config/db'

export const getSpecies = async (req: Request, res: Response) => {
  try {
    const list = await prisma.species.findMany({
      orderBy: { species_name: 'asc' }
    })
    res.json(list.map(s => ({
      id: s.id.toString(),
      species_name: s.species_name
    })))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createSpecies = async (req: Request, res: Response) => {
  const { species_name } = req.body

  try {
    const s = await prisma.species.create({
      data: { species_name }
    })
    res.status(201).json({
      id: s.id.toString(),
      species_name: s.species_name
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteSpecies = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.species.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: 'Species deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
