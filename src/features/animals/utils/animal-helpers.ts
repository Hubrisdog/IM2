export const getDaysInShelter = (createdAt: string | Date, rescueDate?: string | Date | null): number => {
  const start = new Date(rescueDate || createdAt || Date.now())
  const diffTime = Math.abs(Date.now() - start.getTime())
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

export const getRecoveryProgress = (status: string, condition?: string): number => {
  const c = (condition || '').toLowerCase()
  if (c.includes('critical') || c.includes('severe')) {
    if (status === 'Intake') return 20
    if (status === 'Under Treatment') return 40
  }
  switch (status) {
    case 'Intake':
      return 30
    case 'Under Treatment':
      return 60
    case 'Recovered':
      return 100
    case 'Adopted':
      return 100
    case 'Released':
      return 100
    default:
      return 30
  }
}
