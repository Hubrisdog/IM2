import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  AlertTriangle,
  Heart,
  Sparkles,
  Stethoscope,
  Building2,
  ArrowRight,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import { type Animal, type Shelter, type Treatment } from '@/stores/rescue-hub-store'
import { getSpeciesPlaceholder } from '../utils/placeholders'
import { getDaysInShelter } from '../utils/animal-helpers'

interface AnimalSidebarWidgetsProps {
  animals: Animal[]
  shelters: Shelter[]
  treatments: Treatment[]
  onSelectAnimal: (animal: Animal) => void
}

export function AnimalSidebarWidgets({
  animals,
  shelters,
  treatments,
  onSelectAnimal,
}: AnimalSidebarWidgetsProps) {
  // Recent 5 arrivals
  const recentArrivals = [...animals]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  // Critical cases (Condition contains critical/severe or Under Treatment with severe notes)
  const criticalCases = animals.filter((a) => {
    const c = (a.condition || '').toLowerCase()
    const n = (a.notes || '').toLowerCase()
    return (
      c.includes('critical') ||
      c.includes('fracture') ||
      c.includes('severe') ||
      n.includes('critical') ||
      a.status === 'Under Treatment'
    )
  }).slice(0, 4)

  // Success Stories (Adopted or Released animals)
  const successStories = animals.filter(
    (a) => a.status === 'Adopted' || a.status === 'Released'
  ).slice(0, 3)

  return (
    <div className='space-y-4'>
      {/* Widget 1: Critical Cases Widget */}
      {criticalCases.length > 0 && (
        <Card className='border-rose-500/30 bg-rose-500/5 shadow-md overflow-hidden'>
          <CardHeader className='pb-2 pt-3.5 px-4 bg-rose-500/10 border-b border-rose-500/20'>
            <CardTitle className='text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5'>
              <AlertTriangle className='h-4 w-4 animate-pulse text-rose-500' /> Critical Care Monitor ({criticalCases.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-3 space-y-2.5'>
            {criticalCases.map((animal) => {
              const rawAnimShelterId = (animal.shelter_id || '').replace(/^sh-/, '')
              const shelter = shelters.find(
                (s) => s.id === animal.shelter_id || s.id.replace(/^sh-/, '') === rawAnimShelterId
              )
              const rawAnimId = (animal.id || '').replace(/^ani-/, '')
              const latestTreatment = treatments.find(
                (t) => (t.animal_id || '').replace(/^ani-/, '') === rawAnimId || t.animal_id === animal.id
              )

              return (
                <div
                  key={animal.id}
                  onClick={() => onSelectAnimal(animal)}
                  className='p-2.5 rounded-lg bg-background border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all flex items-start gap-3 group'
                >
                  <img
                    src={animal.photo_url || getSpeciesPlaceholder(animal.species)}
                    alt={animal.name}
                    className='h-12 w-12 rounded-lg object-cover border border-rose-500/30 shrink-0 bg-slate-800'
                  />
                  <div className='space-y-1 overflow-hidden flex-1'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-bold text-xs text-foreground group-hover:text-rose-500 transition-colors truncate'>
                        {animal.name}
                      </h4>
                      <Badge variant='outline' className='border-rose-500/30 text-rose-500 text-[9px] px-1 py-0'>
                        {animal.status}
                      </Badge>
                    </div>

                    <p className='text-[11px] text-muted-foreground truncate font-medium'>
                      <Stethoscope className='h-3 w-3 inline mr-1 text-rose-500' />
                      {latestTreatment ? latestTreatment.diagnosis : animal.condition || 'Severe Injury'}
                    </p>

                    <p className='text-[10px] text-muted-foreground flex items-center justify-between pt-0.5'>
                      <span className='truncate'>
                        <Building2 className='h-2.5 w-2.5 inline mr-1' />
                        {shelter ? shelter.name : 'Intake Center'}
                      </span>
                      {latestTreatment && (
                        <span className='text-emerald-600 dark:text-emerald-400 font-semibold truncate'>
                          {latestTreatment.veterinarian}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Widget 2: Recent Arrivals */}
      <Card className='border-teal-500/20 bg-card shadow-sm'>
        <CardHeader className='pb-2 pt-3.5 px-4 border-b'>
          <CardTitle className='text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5'>
            <Clock className='h-4 w-4 text-teal-500' /> Recent Arrivals (Last 5)
          </CardTitle>
        </CardHeader>
        <CardContent className='p-3 space-y-2'>
          {recentArrivals.map((animal) => (
            <div
              key={animal.id}
              onClick={() => onSelectAnimal(animal)}
              className='p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-all flex items-center justify-between gap-2 border border-transparent hover:border-teal-500/20'
            >
              <div className='flex items-center gap-2.5 overflow-hidden'>
                <img
                  src={animal.photo_url || getSpeciesPlaceholder(animal.species)}
                  alt={animal.name}
                  className='h-9 w-9 rounded-full object-cover border shrink-0 bg-slate-800'
                />
                <div className='overflow-hidden space-y-0.5'>
                  <h4 className='font-semibold text-xs text-foreground truncate'>
                    {animal.name}
                  </h4>
                  <p className='text-[10px] text-muted-foreground truncate'>
                    {animal.species} • {new Date(animal.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant='secondary' className='text-[10px] shrink-0 font-medium'>
                {animal.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Widget 3: Success Stories Carousel / Showcase */}
      {successStories.length > 0 && (
        <Card className='border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card shadow-sm'>
          <CardHeader className='pb-2 pt-3.5 px-4 border-b border-emerald-500/10'>
            <CardTitle className='text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5'>
              <Heart className='h-4 w-4 fill-emerald-500 text-emerald-500' /> Success Stories ({successStories.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-3 space-y-3'>
            {successStories.map((animal) => {
              const days = getDaysInShelter(animal.created_at)
              return (
                <div key={animal.id} className='bg-background p-2.5 rounded-lg border border-emerald-500/20 space-y-2'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <img
                        src={animal.photo_url || getSpeciesPlaceholder(animal.species)}
                        alt={animal.name}
                        className='h-8 w-8 rounded-full object-cover border border-emerald-500/40'
                      />
                      <div>
                        <h5 className='font-bold text-xs text-foreground'>{animal.name}</h5>
                        <p className='text-[10px] text-muted-foreground'>{animal.species} • {animal.breed}</p>
                      </div>
                    </div>
                    <Badge className='bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px] font-bold'>
                      {animal.status === 'Adopted' ? '❤️ Adopted' : '🕊 Released'}
                    </Badge>
                  </div>

                  {/* Outcome Lifecycle Progression */}
                  <div className='flex items-center justify-between text-[9px] font-semibold text-muted-foreground bg-muted/30 p-1.5 rounded border'>
                    <span>Rescued</span>
                    <ArrowRight className='h-2.5 w-2.5 text-emerald-500' />
                    <span>Recovered</span>
                    <ArrowRight className='h-2.5 w-2.5 text-emerald-500' />
                    <span className='text-emerald-600 dark:text-emerald-400 font-bold'>
                      {animal.status} ({days}d)
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
