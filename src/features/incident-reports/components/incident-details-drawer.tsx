import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Clock,
  Phone,
  UserCheck,
  UserX,
  FileText,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldCheck,
  Camera,
} from 'lucide-react'
import { useRescueHubStore, type IncidentReport } from '@/stores/rescue-hub-store'
import { MockMapView } from '@/components/mock-map-view'
import { useNavigate } from '@tanstack/react-router'

interface IncidentDetailsDrawerProps {
  incident: IncidentReport | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPromoteClick?: (incident: IncidentReport) => void
}

export function IncidentDetailsDrawer({
  incident,
  open,
  onOpenChange,
  onPromoteClick,
}: IncidentDetailsDrawerProps) {
  const store = useRescueHubStore()
  const navigate = useNavigate()

  if (!incident) return null

  const rawIncId = incident.id.replace(/^inc-/, '')

  // Find linked rescue case
  const linkedCase = store.cases.find(
    (c) =>
      c.incident_id === incident.id ||
      (c.incident_id && c.incident_id.replace(/^inc-/, '') === rawIncId)
  )

  // Species Emoji Mapping
  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case 'Dog':
        return '🐶'
      case 'Cat':
        return '🐱'
      case 'Bird':
        return '🐦'
      case 'Rabbit':
        return '🐰'
      case 'Reptile':
      case 'Snake':
        return '🐍'
      default:
        return '🐾'
    }
  }

  // Reporter Type Derivation
  const isAnon = incident.is_anonymous || !incident.reporter_name
  const reporterType = isAnon
    ? '🕵 Anonymous Reporter'
    : incident.reporter_name?.toLowerCase().includes('officer') || incident.reporter_name?.toLowerCase().includes('patrol')
    ? '🚓 Government Partner'
    : '👤 Citizen Reporter'

  // Severity Badges (Clean UI without circle emojis)
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <Badge className='bg-red-500 text-white font-bold'>Critical Priority</Badge>
      case 'High':
        return <Badge className='bg-amber-500 text-slate-950 font-bold'>High Priority</Badge>
      case 'Medium':
        return <Badge className='bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold'>Medium</Badge>
      case 'Low':
      default:
        return <Badge className='bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold'>Low</Badge>
    }
  }

  // Timestamped Timeline steps
  const reportDate = new Date(incident.created_at || Date.now())
  const formatTime = (minutesOffset: number) => {
    const d = new Date(reportDate.getTime() + minutesOffset * 60 * 1000)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isPromoted = incident.status === 'Approved' || incident.status === 'Validated' || incident.status === 'Promoted' || !!linkedCase

  const timelineSteps = [
    { label: 'Incident Submitted by Citizen', time: formatTime(0), done: true, icon: FileText },
    { label: 'Dispatcher Reviewed Report', time: formatTime(2), done: true, icon: UserCheck },
    { label: 'Severity Priority Assigned', time: formatTime(4), done: true, icon: ShieldCheck },
    { label: 'Location Coordinates Validated', time: formatTime(5), done: true, icon: MapPin },
    { label: 'Approved & Converted to Rescue Case', time: formatTime(6), done: isPromoted, icon: Share2 },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-xl w-full overflow-y-auto p-6 space-y-6'>
        {/* Header Section */}
        <SheetHeader className='space-y-2 pb-4 border-b text-left'>
          <div className='flex items-center justify-between gap-2 flex-wrap'>
            <SheetTitle className='text-xl font-black font-mono text-emerald-600 dark:text-emerald-400'>
              INC-2026-{rawIncId.padStart(4, '0')}
            </SheetTitle>
            {getPriorityBadge(incident.severity)}
          </div>
          <SheetDescription className='text-xs text-muted-foreground flex items-center gap-2'>
            <Clock className='h-3.5 w-3.5 text-emerald-500' />
            Submitted: {reportDate.toLocaleString()}
          </SheetDescription>
        </SheetHeader>

        {/* 1. Linked Rescue Case Card (If Promoted) */}
        {linkedCase ? (
          <div className='p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs'>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5'>
                <CheckCircle2 className='h-4 w-4 text-emerald-500' /> Linked Rescue Case
              </span>
              <span className='font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                {linkedCase.case_number}
              </span>
            </div>
            <Button
              size='sm'
              onClick={() => {
                onOpenChange(false)
                navigate({ to: '/rescue-cases' })
              }}
              className='w-full text-xs h-7 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
            >
              Open Case in Dispatch Dashboard <ExternalLink className='h-3 w-3' />
            </Button>
          </div>
        ) : (
          <div className='p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs'>
            <span className='font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5'>
              <Clock className='h-4 w-4 text-amber-500' /> Status: Pending Triage Validation
            </span>
            {onPromoteClick && (
              <Button
                size='sm'
                onClick={() => {
                  onOpenChange(false)
                  onPromoteClick(incident)
                }}
                className='text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
              >
                Approve & Create Case
              </Button>
            )}
          </div>
        )}

        {/* 2. Reporter Directory Info */}
        <div className='space-y-2'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            👤 Citizen Reporter Information
          </h4>
          <div className='p-3.5 rounded-xl bg-card border space-y-2 text-xs'>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-foreground'>{incident.reporter_name || 'Anonymous Citizen'}</span>
              <Badge variant='outline' className='text-[10px] font-semibold'>
                {reporterType}
              </Badge>
            </div>
            <div className='flex items-center justify-between text-muted-foreground border-t pt-2'>
              <span className='flex items-center gap-1'>
                <Phone className='h-3.5 w-3.5 text-emerald-500' /> Contact:
              </span>
              <span className='font-mono font-semibold text-foreground'>
                {incident.contact_number || 'No contact provided'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Animal & Distress Details */}
        <div className='space-y-2.5 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            🐾 Animal Distress Details
          </h4>
          <div className='p-3.5 rounded-xl bg-card border space-y-3 text-xs'>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>{getSpeciesIcon(incident.species)}</span>
              <div>
                <h5 className='font-bold text-sm text-foreground'>{incident.species} in Distress</h5>
                <span className='text-[11px] text-muted-foreground'>Severity: {incident.severity}</span>
              </div>
            </div>

            <div className='space-y-1 bg-muted/20 p-2.5 rounded-lg border'>
              <span className='text-[10px] font-bold text-muted-foreground uppercase block'>Situation Report</span>
              <p className='text-xs text-foreground italic'>"{incident.description}"</p>
            </div>

            {/* Photo Preview */}
            {incident.photo && (
              <div className='space-y-1 pt-1'>
                <span className='text-[11px] font-semibold text-muted-foreground flex items-center gap-1'>
                  <Camera className='h-3.5 w-3.5 text-emerald-500' /> Visual Evidence Photo:
                </span>
                <div className='h-40 w-full rounded-xl overflow-hidden border bg-slate-900'>
                  <img
                    src={incident.photo}
                    alt='Incident evidence'
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Full Timestamped Triage Timeline */}
        <div className='space-y-3 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            📄 Incident Triage Progression Timeline
          </h4>
          <div className='relative pl-4 border-l-2 border-emerald-500/20 space-y-3'>
            {timelineSteps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={idx} className='relative flex items-center justify-between text-xs group'>
                  <div
                    className={`absolute -left-[21px] h-4 w-4 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                      step.done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-background border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    ✓
                  </div>

                  <div className='pl-2 space-y-0.5'>
                    <span className={`font-semibold flex items-center gap-1.5 ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                      <Icon className={`h-3.5 w-3.5 ${step.done ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                      {step.label}
                    </span>
                  </div>

                  <span className='font-mono text-[10px] text-muted-foreground shrink-0 bg-muted px-1.5 py-0.5 rounded'>
                    {step.time}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 5. Location & Mock Map Preview */}
        <div className='space-y-2 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            📍 GPS Incident Location
          </h4>
          <p className='text-xs font-medium text-foreground flex items-center gap-1'>
            <MapPin className='h-3.5 w-3.5 text-rose-500 shrink-0' /> {incident.location}
          </p>
          <div className='h-40 rounded-xl overflow-hidden border shadow-sm'>
            <MockMapView
              latitude={incident.latitude || 14.5995}
              longitude={incident.longitude || 120.9842}
              locationName={incident.location}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
