import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

export interface AuthUser {
  id: number
  email: string
  role: string
}

export interface RequestWithUser extends Request {
  user?: AuthUser
}

export const authenticateToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = user as AuthUser
    next()
  })
}

export const requireRole = (roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
    }

    next()
  }
}
