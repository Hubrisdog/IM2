import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Share2,
  UserX,
  Clock,
} from 'lucide-react'
import { type IncidentReport, type RescueCase } from '@/stores/rescue-hub-store'

interface IncidentStatsHeaderProps {
  incidents: IncidentReport[]
  cases: RescueCase[]
}

export function IncidentStatsHeader({ incidents, cases }: IncidentStatsHeaderProps) {
  const pendingCount = incidents.filter((inc) => inc.status === 'Pending').length
  const criticalCount = incidents.filter(
    (inc) => inc.status === 'Pending' && (inc.severity === 'Critical' || inc.severity === 'High')
  ).length
  const validatedCount = incidents.filter(
    (inc) => inc.status === 'Approved' || inc.status === 'Validated' || inc.status === 'Promoted'
  ).length
  const promotedCount = cases.filter((c) => c.incident_id !== null).length
  const anonymousCount = incidents.filter((inc) => inc.is_anonymous || !inc.reporter_name).length

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4'>
      {/* Pending Reports */}
      <Card className='border bg-card shadow-sm hover:border-amber-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Pending Triage
            </p>
            <p className='text-xl font-bold text-amber-600 dark:text-amber-400'>{pendingCount}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center'>
            <FileText className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Critical Reports */}
      <Card className='border bg-card shadow-sm hover:border-red-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Critical Urgent
            </p>
            <p className='text-xl font-bold text-red-600 dark:text-red-400'>{criticalCount}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center'>
            <AlertTriangle className='h-4 w-4 animate-pulse' />
          </div>
        </CardContent>
      </Card>

      {/* Validated Today */}
      <Card className='border bg-card shadow-sm hover:border-emerald-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Validated Today
            </p>
            <p className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>{validatedCount}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center'>
            <CheckCircle2 className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Promoted Cases */}
      <Card className='border bg-card shadow-sm hover:border-blue-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Promoted Cases
            </p>
            <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>{promotedCount}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center'>
            <Share2 className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Anonymous Reports */}
      <Card className='border bg-card shadow-sm hover:border-purple-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Anonymous Calls
            </p>
            <p className='text-xl font-bold text-purple-600 dark:text-purple-400'>{anonymousCount}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center'>
            <UserX className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Avg Response Time */}
      <Card className='border bg-card shadow-sm hover:border-teal-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Avg Triage Time
            </p>
            <p className='text-xl font-bold text-teal-600 dark:text-teal-400'>14 mins</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center'>
            <Clock className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
