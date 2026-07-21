import { Card, CardContent } from '@/components/ui/card'
import {
  Activity,
  AlertTriangle,
  Clock,
  Stethoscope,
  CheckCircle2,
  Car,
  FileText,
} from 'lucide-react'
import { type RescueCase } from '@/stores/rescue-hub-store'

interface CaseStatsHeaderProps {
  cases: RescueCase[]
  pendingIncidentsCount: number
}

export function CaseStatsHeader({ cases, pendingIncidentsCount }: CaseStatsHeaderProps) {
  const activeCases = cases.filter((c) => c.status !== 'CLOSED')
  const criticalCasesCount = cases.filter(
    (c) => c.status !== 'CLOSED' && (c.severity === 'Critical' || c.severity === 'High')
  ).length
  const enRouteCount = cases.filter((c) => c.status === 'EN_ROUTE').length
  const underTreatmentCount = cases.filter(
    (c) => c.status === 'UNDER_TREATMENT' || c.status === 'SHELTER_INTAKE'
  ).length
  const resolvedCount = cases.filter(
    (c) => c.status === 'CLOSED' || c.status === 'RECOVERED' || c.status === 'ADOPTED' || c.status === 'RELEASED'
  ).length

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4'>
      {/* Active Cases */}
      <Card className='border bg-card shadow-sm hover:border-emerald-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Active Cases
            </p>
            <p className='text-xl font-bold text-foreground'>{activeCases.length}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
            <Activity className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Pending Reports */}
      <Card className='border bg-card shadow-sm hover:border-amber-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Pending Reports
            </p>
            <p className='text-xl font-bold text-amber-600 dark:text-amber-400'>
              {pendingIncidentsCount}
            </p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center'>
            <FileText className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* En Route */}
      <Card className='border bg-card shadow-sm hover:border-blue-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              En Route
            </p>
            <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>{enRouteCount}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center'>
            <Car className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Under Treatment */}
      <Card className='border bg-card shadow-sm hover:border-rose-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Under Treatment
            </p>
            <p className='text-xl font-bold text-rose-600 dark:text-rose-400'>
              {underTreatmentCount}
            </p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center'>
            <Stethoscope className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Resolved Today */}
      <Card className='border bg-card shadow-sm hover:border-purple-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Resolved Cases
            </p>
            <p className='text-xl font-bold text-purple-600 dark:text-purple-400'>
              {resolvedCount}
            </p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center'>
            <CheckCircle2 className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Critical Cases */}
      <Card className='border bg-card shadow-sm hover:border-red-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Critical Urgent
            </p>
            <p className='text-xl font-bold text-red-600 dark:text-red-400'>
              {criticalCasesCount}
            </p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center'>
            <AlertTriangle className='h-4 w-4 animate-pulse' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
