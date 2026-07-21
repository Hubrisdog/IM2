import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  PawPrint,
  Stethoscope,
  Home,
  Trees,
  Heart,
  Sparkles,
  Trophy,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { type Animal } from '@/stores/rescue-hub-store'
import { getSpeciesPlaceholder } from '../utils/placeholders'
import { getDaysInShelter } from '../utils/animal-helpers'

interface AnimalStatsHeaderProps {
  animals: Animal[]
  onSelectAnimal: (animal: Animal) => void
}

export function AnimalStatsHeader({ animals, onSelectAnimal }: AnimalStatsHeaderProps) {
  const totalCount = animals.length
  const underTreatmentCount = animals.filter((a) => a.status === 'Under Treatment').length

  const isWild = (species: string) =>
    ['Bird', 'Reptile', 'Snake', 'Monkey'].includes(species)

  const readyForAdoptionCount = animals.filter(
    (a) => a.status === 'Recovered' && !isWild(a.species)
  ).length

  const readyForReleaseCount = animals.filter(
    (a) => a.status === 'Recovered' && isWild(a.species)
  ).length

  const adoptedCount = animals.filter((a) => a.status === 'Adopted').length
  const releasedCount = animals.filter((a) => a.status === 'Released').length

  // Auto-select Animal of the Week (newest adoptable or recovered animal)
  const featuredAnimal =
    animals.find((a) => a.status === 'Recovered' || a.status === 'Under Treatment') ||
    animals[0]

  return (
    <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4'>
      {/* 6 Quick Stats Grid (Left 7 Cols) */}
      <div className='lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3'>
        <Card className='border-teal-500/20 bg-card/60 backdrop-blur shadow-sm hover:shadow-teal-500/5 transition-all'>
          <CardContent className='p-3.5 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>
                Total Registered
              </p>
              <p className='text-2xl font-black text-foreground'>{totalCount}</p>
            </div>
            <div className='h-10 w-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center'>
              <PawPrint className='h-5 w-5' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-emerald-500/20 bg-card/60 backdrop-blur shadow-sm hover:shadow-emerald-500/5 transition-all'>
          <CardContent className='p-3.5 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>
                Under Care
              </p>
              <p className='text-2xl font-black text-emerald-600 dark:text-emerald-400'>
                {underTreatmentCount}
              </p>
            </div>
            <div className='h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center'>
              <Stethoscope className='h-5 w-5' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-blue-500/20 bg-card/60 backdrop-blur shadow-sm hover:shadow-blue-500/5 transition-all'>
          <CardContent className='p-3.5 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>
                Ready to Adopt
              </p>
              <p className='text-2xl font-black text-blue-600 dark:text-blue-400'>
                {readyForAdoptionCount}
              </p>
            </div>
            <div className='h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center'>
              <Home className='h-5 w-5' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-teal-500/20 bg-card/60 backdrop-blur shadow-sm hover:shadow-teal-500/5 transition-all'>
          <CardContent className='p-3.5 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>
                Ready to Release
              </p>
              <p className='text-2xl font-black text-teal-600 dark:text-teal-400'>
                {readyForReleaseCount}
              </p>
            </div>
            <div className='h-10 w-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center'>
              <Trees className='h-5 w-5' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-rose-500/20 bg-card/60 backdrop-blur shadow-sm hover:shadow-rose-500/5 transition-all'>
          <CardContent className='p-3.5 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>
                Adopted Out
              </p>
              <p className='text-2xl font-black text-rose-600 dark:text-rose-400'>
                {adoptedCount}
              </p>
            </div>
            <div className='h-10 w-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center'>
              <Heart className='h-5 w-5 fill-rose-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-purple-500/20 bg-card/60 backdrop-blur shadow-sm hover:shadow-purple-500/5 transition-all'>
          <CardContent className='p-3.5 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>
                Released Wild
              </p>
              <p className='text-2xl font-black text-purple-600 dark:text-purple-400'>
                {releasedCount}
              </p>
            </div>
            <div className='h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center'>
              <Sparkles className='h-5 w-5' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animal of the Week Hero Card (Right 5 Cols) */}
      <div className='lg:col-span-5'>
        {featuredAnimal && (
          <Card className='relative overflow-hidden border-teal-500/30 bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white shadow-xl h-full flex flex-col justify-between'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none' />

            <CardContent className='p-4 space-y-3 relative z-10'>
              <div className='flex items-center justify-between'>
                <span className='inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow'>
                  <Trophy className='h-3 w-3 fill-slate-950' /> Animal of the Week
                </span>
                <span className='text-[11px] text-teal-300 font-mono flex items-center gap-1'>
                  <Clock className='h-3 w-3' /> {getDaysInShelter(featuredAnimal.created_at)} Days in Shelter
                </span>
              </div>

              <div className='flex items-center gap-3.5'>
                <img
                  src={featuredAnimal.photo_url || getSpeciesPlaceholder(featuredAnimal.species)}
                  alt={featuredAnimal.name}
                  className='h-16 w-16 rounded-xl object-cover border-2 border-teal-400/40 shadow-lg bg-slate-800 shrink-0'
                />
                <div className='space-y-0.5 overflow-hidden'>
                  <h3 className='font-black text-lg text-white truncate'>
                    {featuredAnimal.name}
                  </h3>
                  <p className='text-xs text-teal-200 truncate'>
                    {featuredAnimal.species} • {featuredAnimal.breed} ({featuredAnimal.sex}, {featuredAnimal.estimated_age})
                  </p>
                  <div className='pt-0.5 flex items-center gap-1.5'>
                    <Badge variant='outline' className='border-emerald-400/40 text-emerald-300 bg-emerald-950/50 text-[10px] py-0'>
                      <CheckCircle2 className='h-2.5 w-2.5 mr-1' /> {featuredAnimal.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className='text-[11px] text-slate-300 line-clamp-2 italic bg-black/30 p-2 rounded border border-white/10'>
                "{featuredAnimal.notes || featuredAnimal.condition || 'Rescued and fully stabilized. Showing remarkable spirit and readiness for adoption!'}"
              </p>
            </CardContent>

            <div className='p-3 bg-black/40 border-t border-white/10 flex items-center justify-between relative z-10'>
              <span className='text-[10px] text-teal-300 font-semibold'>
                Featured for resilience & recovery!
              </span>
              <Button
                size='sm'
                onClick={() => onSelectAnimal(featuredAnimal)}
                className='h-7 text-xs gap-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold'
              >
                View Profile <ArrowRight className='h-3 w-3' />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
