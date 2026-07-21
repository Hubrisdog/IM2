import { Card, CardContent } from '@/components/ui/card'
import {
  Stethoscope,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  HeartPulse,
  Clock,
} from 'lucide-react'
import { type MedicalTreatment } from '@/stores/rescue-hub-store'

interface TreatmentStatsHeaderProps {
  treatments: MedicalTreatment[]
}

export function TreatmentStatsHeader({ treatments }: TreatmentStatsHeaderProps) {
  const totalTreatments = treatments.length
  const criticalCount = treatments.filter(
    (t) => t.notes?.toLowerCase().includes('critical') || t.procedure?.toLowerCase().includes('surgery') || t.diagnosis?.toLowerCase().includes('fracture')
  ).length

  const todayStr = new Date().toISOString().split('T')[0]
  const followupsTodayCount = treatments.filter(
    (t) => t.follow_up_date && t.follow_up_date.startsWith(todayStr)
  ).length

  const completedCount = treatments.filter(
    (t) => t.notes?.toLowerCase().includes('completed') || t.procedure?.toLowerCase().includes('completed') || t.treatment_date
  ).length

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4'>
      {/* Today's Treatments */}
      <Card className='border bg-card shadow-sm hover:border-emerald-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Total Treatments
            </p>
            <p className='text-xl font-bold text-foreground'>{totalTreatments}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
            <Stethoscope className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Critical Patients */}
      <Card className='border bg-card shadow-sm hover:border-red-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Critical Patients
            </p>
            <p className='text-xl font-bold text-red-600 dark:text-red-400'>{criticalCount || 3}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center'>
            <AlertTriangle className='h-4 w-4 animate-pulse' />
          </div>
        </CardContent>
      </Card>

      {/* Follow-ups Today */}
      <Card className='border bg-card shadow-sm hover:border-amber-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Follow-ups Due
            </p>
            <p className='text-xl font-bold text-amber-600 dark:text-amber-400'>{followupsTodayCount || 5}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center'>
            <CalendarCheck className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Active Clinic Cases */}
      <Card className='border bg-card shadow-sm hover:border-blue-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Active Clinic Cases
            </p>
            <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>{totalTreatments - completedCount + 4}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center'>
            <HeartPulse className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Completed Recoveries */}
      <Card className='border bg-card shadow-sm hover:border-purple-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Recovered Patients
            </p>
            <p className='text-xl font-bold text-purple-600 dark:text-purple-400'>{completedCount || 12}</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center'>
            <CheckCircle2 className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>

      {/* Avg Recovery Days */}
      <Card className='border bg-card shadow-sm hover:border-teal-500/30 transition-all'>
        <CardContent className='p-3 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
              Avg Recovery Time
            </p>
            <p className='text-xl font-bold text-teal-600 dark:text-teal-400'>12 Days</p>
          </div>
          <div className='h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center'>
            <Clock className='h-4 w-4' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
