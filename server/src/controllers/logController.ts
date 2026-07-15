import { Request, Response } from 'express'
import prisma from '../config/db'

export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' }
    })

    const mapped = logs.map(l => {
      let entityPrefix = ''
      if (l.entity_type === 'IncidentReport') entityPrefix = 'inc-'
      else if (l.entity_type === 'RescueCase') entityPrefix = 'case-'
      else if (l.entity_type === 'Animal') entityPrefix = 'ani-'
      else if (l.entity_type === 'Rescuer') entityPrefix = 'res-'
      else if (l.entity_type === 'Shelter') entityPrefix = 'sh-'
      else if (l.entity_type === 'Treatment') entityPrefix = 'treat-'

      return {
        id: `log-${l.id}`,
        entity_type: l.entity_type as any,
        entity_id: `${entityPrefix}${l.entity_id}`,
        action: l.action,
        timestamp: l.timestamp.toISOString(),
        user: l.user
      }
    })

    res.json(mapped)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
