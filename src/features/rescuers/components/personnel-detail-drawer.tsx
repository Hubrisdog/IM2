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
  Building2,
  Users,
  Phone,
  Mail,
  Award,
  Clock,
  ShieldCheck,
  Stethoscope,
  Briefcase,
  AlertCircle,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'
import { useRescueHubStore, type Rescuer } from '@/stores/rescue-hub-store'

interface PersonnelDetailDrawerProps {
  rescuer: Rescuer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewCaseClick?: (caseId: string) => void
}

export function PersonnelDetailDrawer({
  rescuer,
  open,
  onOpenChange,
  onViewCaseClick,
}: PersonnelDetailDrawerProps) {
  const store = useRescueHubStore()

  if (!rescuer) return null

  // Linked shelter lookup
  const rawShelterId = (rescuer.shelter_id || '').replace(/^sh-/, '')
  const shelter = store.shelters.find(
    (s) => s.id === rescuer.shelter_id || s.id.replace(/^sh-/, '') === rawShelterId
  )

  // Linked team lookup
  const rawTeamId = (rescuer.team_id || '').replace(/^team-/, '')
  const teamName =
    rescuer.role === 'Veterinarian'
      ? 'Medical Care Team'
      : rescuer.role === 'Dispatcher'
      ? 'Dispatch Operations Center'
      : rawTeamId === '1'
      ? 'Rescue Team Alpha'
      : 'Field Unit Bravo'

  // Linked active case lookup (Ticket integration)
  const rawAgentId = (rescuer.id || '').replace(/^res-/, '')
  const activeCase = store.cases.find((c) => {
    const rawRescuerId = (c.rescuer_id || '').replace(/^res-/, '')
    return (c.rescuer_id === rescuer.id || rawRescuerId === rawAgentId) && c.status !== 'CLOSED'
  })

  // Linked animal for active case
  const activeAnimal = activeCase?.animal_id
    ? store.animals.find((a) => a.id === activeCase.animal_id || a.id.replace(/^ani-/, '') === activeCase.animal_id?.replace(/^ani-/, ''))
    : null

  // Count handled metrics
  const completedRescuesCount = store.cases.filter((c) => {
    const rawRescuerId = (c.rescuer_id || '').replace(/^res-/, '')
    return (c.rescuer_id === rescuer.id || rawRescuerId === rawAgentId) && c.status === 'CLOSED'
  }).length

  const animalsHandledCount = store.treatments.filter((t) =>
    t.veterinarian.toLowerCase().includes(rescuer.name.toLowerCase())
  ).length || completedRescuesCount + 3

  const getStatusBadge = () => {
    switch (rescuer.status) {
      case 'Available':
        return (
          <Badge className='bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-xs font-bold'>
            <CheckCircle2 className='h-3 w-3' /> Available
          </Badge>
        )
      case 'Responding':
      case 'On Rescue':
        return (
          <Badge className='bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 text-xs font-bold animate-pulse'>
            <AlertCircle className='h-3 w-3' /> On Rescue Mission
          </Badge>
        )
      case 'Treating Animal':
        return (
          <Badge className='bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-1 text-xs font-bold'>
            <Stethoscope className='h-3 w-3' /> Treating Patient
          </Badge>
        )
      case 'Off Duty':
      default:
        return (
          <Badge variant='outline' className='text-muted-foreground gap-1 text-xs font-medium'>
            <Clock className='h-3 w-3' /> Off Duty
          </Badge>
        )
    }
  }

  const getRoleBadge = () => {
    switch (rescuer.role) {
      case 'Admin':
        return <Badge className='bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'>Administrator</Badge>
      case 'Dispatcher':
        return <Badge className='bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'>Dispatcher</Badge>
      case 'Veterinarian':
        return <Badge className='bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'>Veterinarian (DVM)</Badge>
      case 'Shelter Staff':
        return <Badge className='bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30'>Shelter Coordinator</Badge>
      case 'Rescuer':
      default:
        return <Badge className='bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'>Field Rescuer</Badge>
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-md w-full overflow-y-auto p-6 space-y-6'>
        {/* Header Profile Section */}
        <SheetHeader className='space-y-3 pb-4 border-b text-left'>
          <div className='flex items-center gap-3.5'>
            <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xl flex items-center justify-center shadow-lg shrink-0'>
              {rescuer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className='space-y-1 overflow-hidden'>
              <SheetTitle className='text-lg font-black text-foreground truncate'>
                {rescuer.name}
              </SheetTitle>
              <div className='flex items-center gap-1.5 flex-wrap'>
                {getRoleBadge()}
                {getStatusBadge()}
              </div>
            </div>
          </div>
          <SheetDescription className='text-xs text-muted-foreground'>
            RescueHub Operations Roster Profile • ID: {rescuer.id}
          </SheetDescription>
        </SheetHeader>

        {/* Operational Metrics Grid */}
        <div className='grid grid-cols-3 gap-2.5 text-center'>
          <div className='bg-muted/30 p-2.5 rounded-xl border border-teal-500/10 space-y-0.5'>
            <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider block'>
              Experience
            </span>
            <span className='text-base font-extrabold text-foreground'>
              {rescuer.experience_years || 4} Yrs
            </span>
          </div>

          <div className='bg-muted/30 p-2.5 rounded-xl border border-teal-500/10 space-y-0.5'>
            <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider block'>
              Rescues
            </span>
            <span className='text-base font-extrabold text-emerald-600 dark:text-emerald-400'>
              {completedRescuesCount}
            </span>
          </div>

          <div className='bg-muted/30 p-2.5 rounded-xl border border-teal-500/10 space-y-0.5'>
            <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider block'>
              Handled
            </span>
            <span className='text-base font-extrabold text-blue-600 dark:text-blue-400'>
              {animalsHandledCount}
            </span>
          </div>
        </div>

        {/* Current Active Assignment Card (Ticket Integration) */}
        <div className='space-y-2'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            <Briefcase className='h-3.5 w-3.5 text-teal-500' /> Active Mission Assignment
          </h4>
          {activeCase ? (
            <div className='p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/30 space-y-2.5 shadow-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-black text-amber-600 dark:text-amber-400 font-mono'>
                  {activeCase.case_number}
                </span>
                <Badge variant='outline' className='border-amber-500/40 text-amber-600 dark:text-amber-400 text-[10px]'>
                  {activeCase.status}
                </Badge>
              </div>

              <div className='text-xs space-y-1'>
                <p className='font-semibold text-foreground'>
                  Target Animal: <span className='text-teal-600 dark:text-teal-400'>{activeAnimal ? activeAnimal.name : 'Unassigned Patient'}</span>
                </p>
                <p className='text-muted-foreground text-[11px] flex items-center gap-1 truncate'>
                  <MapPin className='h-3 w-3 text-rose-500 shrink-0' /> {activeCase.location}
                </p>
              </div>

              {onViewCaseClick && (
                <Button
                  size='sm'
                  onClick={() => onViewCaseClick(activeCase.id)}
                  className='w-full text-xs h-7 gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                >
                  Quick Open Case <ExternalLink className='h-3 w-3' />
                </Button>
              )}
            </div>
          ) : (
            <div className='p-3.5 rounded-xl bg-muted/20 border border-dashed text-center space-y-1'>
              <span className='text-xs font-semibold text-foreground block'>🟢 No Active Field Cases</span>
              <span className='text-[11px] text-muted-foreground block'>Available for immediate dispatch assignment.</span>
            </div>
          )}
        </div>

        {/* Assigned Station & Team */}
        <div className='space-y-2.5 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            <Building2 className='h-3.5 w-3.5 text-teal-500' /> Station & Operational Unit
          </h4>
          <div className='space-y-2 text-xs bg-card p-3 rounded-xl border shadow-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground flex items-center gap-1.5'>
                <MapPin className='h-3.5 w-3.5 text-rose-500' /> Assigned Shelter:
              </span>
              <span className='font-bold text-foreground truncate max-w-[180px]'>
                {shelter ? shelter.name : 'HQ Operations Center'}
              </span>
            </div>

            <div className='flex items-center justify-between border-t pt-2'>
              <span className='text-muted-foreground flex items-center gap-1.5'>
                <Users className='h-3.5 w-3.5 text-blue-500' /> Operational Team:
              </span>
              <span className='font-semibold text-foreground truncate max-w-[180px]'>
                {teamName}
              </span>
            </div>
          </div>
        </div>

        {/* Skills & Certifications */}
        <div className='space-y-2.5 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            <Award className='h-3.5 w-3.5 text-amber-500' /> Qualifications & Skills
          </h4>
          <div className='space-y-2 text-xs'>
            <div className='space-y-1'>
              <span className='text-[11px] text-muted-foreground font-medium block'>Certified Skills:</span>
              <div className='flex flex-wrap gap-1'>
                {rescuer.skills.split(',').map((skill, idx) => (
                  <Badge key={idx} variant='secondary' className='text-[10px] font-semibold bg-muted'>
                    <ShieldCheck className='h-2.5 w-2.5 mr-1 text-teal-500' /> {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            {rescuer.certifications && (
              <div className='space-y-1 pt-1'>
                <span className='text-[11px] text-muted-foreground font-medium block'>Certifications:</span>
                <span className='font-medium text-foreground text-xs block bg-muted/30 p-2 rounded border'>
                  📜 {rescuer.certifications}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className='space-y-2.5 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            <Phone className='h-3.5 w-3.5 text-teal-500' /> Contact Directory
          </h4>
          <div className='space-y-2 text-xs bg-card p-3 rounded-xl border shadow-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground flex items-center gap-1.5'>
                <Phone className='h-3.5 w-3.5 text-muted-foreground' /> Phone:
              </span>
              <span className='font-mono font-semibold text-foreground'>{rescuer.phone}</span>
            </div>

            <div className='flex items-center justify-between border-t pt-2'>
              <span className='text-muted-foreground flex items-center gap-1.5'>
                <Mail className='h-3.5 w-3.5 text-muted-foreground' /> Email:
              </span>
              <span className='font-mono text-foreground truncate max-w-[180px]'>{rescuer.email}</span>
            </div>

            <div className='flex items-center justify-between border-t pt-2 text-rose-600 dark:text-rose-400'>
              <span className='flex items-center gap-1.5 font-medium'>
                <Phone className='h-3.5 w-3.5' /> Emergency Contact:
              </span>
              <span className='font-mono font-bold'>{rescuer.emergency_contact || '555-9000'}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {rescuer.notes && (
          <div className='space-y-1.5 border-t pt-4'>
            <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground block'>
              Operational Notes
            </span>
            <p className='text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border italic'>
              "{rescuer.notes}"
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
