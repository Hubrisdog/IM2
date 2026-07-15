import { Response } from 'express'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import prisma from '../config/db'
import { RequestWithUser } from '../middlewares/auth'

export const login = async (req: any, res: Response) => {
  const { email, password } = req.body

  try {
    const agent = await prisma.agent.findUnique({
      where: { email },
      include: { role: true }
    })

    if (!agent) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isValidPassword = await bcrypt.compare(password, agent.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      {
        id: agent.id,
        email: agent.email,
        role: agent.role.role_name
      },
      process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      { expiresIn: '24h' }
    )

    // Match the AuthUser payload expected by useAuthStore in the frontend
    res.json({
      accessToken: token,
      user: {
        accountNo: agent.id.toString(),
        email: agent.email,
        role: [agent.role.role_name], // frontend expects array of strings
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
      }
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const register = async (req: any, res: Response) => {
  const { first_name, last_name, email, password, phone, role_name, team_name } = req.body

  try {
    const existingAgent = await prisma.agent.findUnique({ where: { email } })
    if (existingAgent) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const role = await prisma.role.findUnique({ where: { role_name: role_name || 'Rescuer' } })
    if (!role) {
      return res.status(400).json({ message: 'Role does not exist' })
    }

    let teamId = null
    if (team_name) {
      const team = await prisma.team.findFirst({ where: { team_name } })
      if (team) teamId = team.id
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newAgent = await prisma.agent.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone,
        role_id: role.id,
        team_id: teamId,
        status: 'Active'
      },
      include: { role: true }
    })

    res.status(201).json({
      message: 'Agent registered successfully',
      agent: {
        id: newAgent.id,
        email: newAgent.email,
        role: newAgent.role.role_name
      }
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMe = async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthenticated' })
  }

  try {
    const agent = await prisma.agent.findUnique({
      where: { id: req.user.id },
      include: { role: true }
    })

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' })
    }

    res.json({
      accountNo: agent.id.toString(),
      email: agent.email,
      role: [agent.role.role_name]
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
