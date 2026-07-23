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
  Stethoscope,
  Clock,
  CheckCircle2,
  FileText,
  DollarSign,
  Heart,
  Pill,
  ShieldAlert,
} from 'lucide-react'
import { useRescueHubStore, type MedicalTreatment } from '@/stores/rescue-hub-store'
import { getSpeciesPlaceholder } from '@/features/animals/utils/placeholders'
import { getRecoveryProgress } from '@/features/animals/utils/animal-helpers'

interface TreatmentDetailsDrawerProps {
  treatment: MedicalTreatment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditClick?: (treatment: MedicalTreatment) => void
}

export function TreatmentDetailsDrawer({
  treatment,
  open,
  onOpenChange,
  onEditClick,
}: TreatmentDetailsDrawerProps) {
  const store = useRescueHubStore()

  if (!treatment) return null

  const trtIdStr = String(treatment.id || '')
  const rawAnimId = String(treatment.animal_id || '').replace(/^ani-/, '')
  const animal = store.animals.find(
    (a) => a.id === treatment.animal_id || String(a.id || '').replace(/^ani-/, '') === rawAnimId
  )

  const rawShelterId = String(animal?.shelter_id || '').replace(/^sh-/, '')
  const shelter = store.shelters.find(
    (s) => s.id === animal?.shelter_id || String(s.id || '').replace(/^sh-/, '') === rawShelterId
  )

  const progress = getRecoveryProgress(animal?.status || 'Intake', animal?.condition, treatment.recommendation)

  const getRecommendationLabel = (rec?: string) => {
    switch (rec) {
      case 'Critical Care':
        return '🔴 Critical Care Required'
      case 'Continue Treatment':
        return '🟢 Continue Treatment'
      case 'Under Observation':
        return '🟡 Under Observation'
      case 'Recovered':
        return '✅ Recovered (Medically Cleared)'
      default:
        return rec || '🩺 Under Clinical Care'
    }
  }

  // Procedure Icons
  const getProcedureIcon = (proc?: string) => {
    const p = (proc || '').toLowerCase()
    if (p.includes('vaccin') || p.includes('shot') || p.includes('iv')) return '💉 Vaccination / IV'
    if (p.includes('surg') || p.includes('amputat') || p.includes('fracture')) return '🦴 Surgery / Trauma'
    if (p.includes('medic') || p.includes('antibiot') || p.includes('pill')) return '💊 Medication Protocol'
    if (p.includes('deworm') || p.includes('parasite') || p.includes('flea')) return '🧼 Deworming & Parasite'
    return '🩺 Veterinary Checkup'
  }

  // Treatment Date
  const treatDate = new Date(treatment.treatment_date || (treatment as any).date || treatment.created_at || Date.now())

  // Patient Journey Timeline Steps
  const timelineSteps = [
    { stage: '📍 Distress Call Logged', desc: 'Citizen report received and validated by dispatch center.', done: true },
    { stage: '🚑 Field Rescue & Station Intake', desc: 'Rescuer secured animal and admitted to shelter station.', done: true },
    { stage: '🩺 Veterinary Clinical Exam', desc: `Dr. ${treatment.veterinarian || 'Alice Vance'} conducted physical triage assessment.`, done: true },
    { stage: '💉 Procedure Execution', desc: `${treatment.procedure || 'Clinical checkup'} performed successfully.`, done: true },
    { stage: '💊 Medication & Rehabilitation', desc: `Administered ${treatment.medication || 'prescribed antibiotics'}.`, done: true },
    { stage: '✅ Clinical Recovery Confirmed', desc: 'Patient cleared by veterinarian and ready for adoption program.', done: animal?.status === 'Recovered' || animal?.status === 'Adopted' || animal?.status === 'Released' },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-xl w-full overflow-y-auto p-6 space-y-6'>
        {/* Header Section */}
        <SheetHeader className='space-y-2 pb-4 border-b text-left'>
          <div className='flex items-center justify-between gap-2 flex-wrap'>
            <SheetTitle className='text-xl font-black font-mono text-emerald-600 dark:text-emerald-400'>
              TRT-2026-{trtIdStr.replace(/^(trt|treat)-/, '').padStart(4, '0')}
            </SheetTitle>
            <Badge className='bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30 font-bold text-xs'>
              {getProcedureIcon(treatment.procedure)}
            </Badge>
          </div>
          <SheetDescription className='text-xs text-muted-foreground flex items-center gap-2'>
            <Clock className='h-3.5 w-3.5 text-emerald-500' />
            Date of Treatment: {treatDate.toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>

        {/* 1. Patient Profile Card */}
        <div className='space-y-2'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            🐾 Patient Animal Record
          </h4>
          {animal ? (
            <div className='p-3.5 rounded-xl bg-card border shadow-sm flex items-center gap-3.5'>
              <img
                src={animal.photo_url || getSpeciesPlaceholder(animal.species)}
                alt={animal.name}
                className='h-14 w-14 rounded-xl object-cover border shrink-0 bg-slate-800'
              />
              <div className='space-y-0.5 overflow-hidden flex-1'>
                <div className='flex items-center justify-between'>
                  <h5 className='font-bold text-sm text-foreground truncate'>{animal.name}</h5>
                  <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400'>
                    ANM-00{animal.id}
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  {animal.species} • {animal.breed} ({animal.sex}, {animal.estimated_age})
                </p>
                <p className='text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1'>
                  <Building2 className='h-3 w-3 text-rose-500' /> Station: {shelter ? shelter.name : 'HQ Operations'}
                </p>
              </div>
            </div>
          ) : (
            <div className='p-3 rounded-xl bg-muted/20 border border-dashed text-xs text-muted-foreground text-center'>
              Patient record unlinked.
            </div>
          )}
        </div>

        {/* 2. Veterinary Diagnostics & Treatment Info */}
        <div className='space-y-2.5 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            🩺 Veterinary Diagnostics & Treatment Plan
          </h4>
          <div className='p-3.5 rounded-xl bg-card border space-y-3 text-xs'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='font-bold text-foreground flex items-center gap-1.5'>
                <Stethoscope className='h-4 w-4 text-emerald-500' /> Attending Veterinarian:
              </span>
              <span className='font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                {treatment.veterinarian}
              </span>
            </div>

            <div className='space-y-1'>
              <span className='text-[10px] font-bold uppercase text-muted-foreground block'>Clinical Diagnosis</span>
              <p className='font-bold text-foreground text-sm bg-muted/30 p-2 rounded border text-rose-600 dark:text-rose-400'>
                {treatment.diagnosis}
              </p>
            </div>

            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-muted-foreground'>Procedure Executed:</span>
              <span className='font-semibold text-foreground'>{treatment.procedure}</span>
            </div>

            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-muted-foreground'>Medication & Dosage:</span>
              <span className='font-semibold text-blue-600 dark:text-blue-400 font-mono'>{treatment.medication || 'None Prescribed'}</span>
            </div>

            {treatment.notes && (
              <div className='space-y-1 bg-muted/30 p-2.5 rounded-lg border text-xs'>
                <span className='font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider'>Clinical Notes:</span>
                <p className='text-foreground italic leading-relaxed'>{treatment.notes}</p>
              </div>
            )}

            {/* Estimated Resource Cost */}
            <div className='flex items-center justify-between border-t pt-2 text-xs'>
              <span className='text-muted-foreground font-semibold flex items-center gap-1'>
                <DollarSign className='h-3.5 w-3.5 text-emerald-500' /> Estimated Treatment Cost:
              </span>
              <span className='font-mono font-bold text-foreground bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20'>
                ₱{((treatment.id.length * 450) % 2500 + 350).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Veterinary Medical Clearance & Outcome Authority Card */}
        <div className='space-y-2 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            🩺 Veterinary Medical Clearance Authority
          </h4>
          <div className='p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-card to-blue-500/10 border border-emerald-500/30 space-y-2.5 text-xs shadow-sm'>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-foreground flex items-center gap-1.5'>
                <CheckCircle2 className='h-4 w-4 text-emerald-500' /> Medical Clearance Decision:
              </span>
              <Badge className='bg-emerald-600 text-white font-bold text-xs shadow-sm'>
                {getRecommendationLabel(treatment.recommendation)}
              </Badge>
            </div>
            <p className='text-muted-foreground text-[11px] leading-relaxed'>
              This medical clearance was issued under the direct authority of <strong className='text-foreground'>{treatment.veterinarian || 'Dr. Alice Vance (DVM)'}</strong>. Submitting this record automatically updates the official Animal Registry status.
            </p>

            {/* Recovery Progress Bar */}
            <div className='space-y-1.5 bg-background/50 p-2.5 rounded-lg border border-emerald-500/10'>
              <div className='flex items-center justify-between text-[10px] font-bold'>
                <span className='text-muted-foreground uppercase tracking-wider'>Recovery Progress</span>
                <span className='text-emerald-600 dark:text-emerald-400 font-mono font-extrabold'>{progress}%</span>
              </div>
              <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className='pt-1 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-300'>
              <span>Registry Status: {animal?.status || 'Recovered'}</span>
              <span>Clearing Vet ID: VET-2026-004</span>
            </div>
          </div>
        </div>

        {/* 4. Full Timestamped Patient Journey Timeline */}
        <div className='space-y-3 border-t pt-4'>
          <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
            🐾 Longitudinal Patient Medical Journey
          </h4>
          <div className='relative pl-4 border-l-2 border-emerald-500/20 space-y-3'>
            {timelineSteps.map((step, idx) => (
              <div key={idx} className='relative flex flex-col gap-0.5 text-xs group'>
                <div
                  className={`absolute -left-[21px] top-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    step.done
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-background border-muted-foreground text-muted-foreground'
                  }`}
                >
                  ✓
                </div>

                <div className='pl-2 space-y-0.5'>
                  <span className={`font-bold block ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.stage}
                  </span>
                  <span className='text-[11px] text-muted-foreground block'>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Notes */}
        {treatment.notes && (
          <div className='space-y-1.5 border-t pt-4'>
            <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground block'>
              Veterinary Clinical Notes
            </span>
            <p className='text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border italic'>
              "{treatment.notes}"
            </p>
          </div>
        )}

        {/* Drawer Action Button */}
        <div className='pt-4 border-t flex items-center gap-2'>
          <Button
            className='w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white'
            onClick={() => {
              onOpenChange(false)
              if (onEditClick) onEditClick(treatment)
            }}
          >
            Update Veterinary Medical Record
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
