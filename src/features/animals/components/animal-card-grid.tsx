import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit2, Trash2, Clock, Building2, Heart, Trees, Home, Sparkles, Stethoscope } from 'lucide-react'
import { type Animal, type Shelter } from '@/stores/rescue-hub-store'
import { getSpeciesPlaceholder } from '../utils/placeholders'
import { getDaysInShelter, getRecoveryProgress } from '../utils/animal-helpers'

interface AnimalCardGridProps {
  animals: Animal[]
  shelters: Shelter[]
  userRole: string
  onSelectAnimal: (animal: Animal) => void
  onEditAnimal: (animal: Animal) => void
  onDeleteAnimal: (animal: Animal) => void
}

export function AnimalCardGrid({
  animals,
  shelters,
  userRole,
  onSelectAnimal,
  onEditAnimal,
  onDeleteAnimal,
}: AnimalCardGridProps) {
  if (animals.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-dashed'>
        <div className='h-16 w-16 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mb-3'>
          <Sparkles className='h-8 w-8 animate-bounce' />
        </div>
        <h3 className='text-lg font-bold text-foreground'>No animals match this filter</h3>
        <p className='text-xs text-muted-foreground max-w-sm mt-1'>
          Try selecting a different status chip or species filter, or register a new animal record into the system.
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {animals.map((animal) => {
        const rawAnimShelterId = (animal.shelter_id || '').replace(/^sh-/, '')
        const shelter = shelters.find(
          (s) => s.id === animal.shelter_id || s.id.replace(/^sh-/, '') === rawAnimShelterId
        )

        const days = getDaysInShelter(animal.created_at)
        const progress = getRecoveryProgress(animal.status, animal.condition)

        const getOutcomeBadge = () => {
          switch (animal.status) {
            case 'Intake':
              return (
                <Badge className='bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30 gap-1 text-[11px] font-semibold'>
                  <Clock className='h-3 w-3' /> Intake
                </Badge>
              )
            case 'Under Treatment':
              return (
                <Badge className='bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 text-[11px] font-semibold'>
                  <Stethoscope className='h-3 w-3' /> Under Treatment
                </Badge>
              )
            case 'Recovered':
              const isWild = ['Bird', 'Reptile', 'Snake', 'Monkey'].includes(animal.species)
              return isWild ? (
                <Badge className='bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30 gap-1 text-[11px] font-semibold'>
                  <Trees className='h-3 w-3' /> Ready to Release
                </Badge>
              ) : (
                <Badge className='bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-1 text-[11px] font-semibold'>
                  <Home className='h-3 w-3' /> Ready to Adopt
                </Badge>
              )
            case 'Adopted':
              return (
                <Badge className='bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 gap-1 text-[11px] font-semibold'>
                  <Heart className='h-3 w-3 fill-sky-500' /> Adopted
                </Badge>
              )
            case 'Released':
              return (
                <Badge className='bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 gap-1 text-[11px] font-semibold'>
                  <Sparkles className='h-3 w-3' /> Released
                </Badge>
              )
          }
        }

        return (
          <Card
            key={animal.id}
            className='group overflow-hidden border-teal-500/15 bg-card hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between'
          >
            <div>
              {/* Photo Hero with Badges */}
              <div className='relative h-44 w-full overflow-hidden bg-slate-900'>
                <img
                  src={animal.photo_url || getSpeciesPlaceholder(animal.species)}
                  alt={animal.name}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80' />

                <div className='absolute top-2.5 left-2.5 flex items-center gap-1.5'>
                  <span className='bg-black/60 backdrop-blur text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow border border-white/10'>
                    ANM-00{animal.id}
                  </span>
                  {getOutcomeBadge()}
                </div>

                <div className='absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white'>
                  <div>
                    <h4 className='font-bold text-base tracking-tight leading-none text-white drop-shadow'>
                      {animal.name}
                    </h4>
                    <p className='text-[11px] text-slate-300 font-medium mt-0.5'>
                      {animal.species} • {animal.breed}
                    </p>
                  </div>
                  <span className='text-[10px] bg-white/20 backdrop-blur px-2 py-0.5 rounded text-white font-mono shrink-0'>
                    {days} Days
                  </span>
                </div>
              </div>

              {/* Card Body Details */}
              <CardContent className='p-3.5 space-y-3'>
                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div>
                    <span className='text-muted-foreground block text-[10px]'>Sex & Age</span>
                    <span className='font-medium text-foreground'>{animal.sex}, {animal.estimated_age}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[10px] font-medium'>Weight / Color</span>
                    <span className='font-medium text-foreground'>{animal.weight} kg • {animal.color}</span>
                  </div>
                </div>

                {/* Recovery Progress Bar */}
                <div className='space-y-1 bg-muted/20 p-2 rounded-lg border border-teal-500/10'>
                  <div className='flex items-center justify-between text-[10px] font-semibold'>
                    <span className='text-muted-foreground'>Recovery Progress</span>
                    <span className='text-teal-600 dark:text-teal-400 font-mono font-bold'>{progress}%</span>
                  </div>
                  <div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Shelter Location */}
                <div className='flex items-center justify-between text-xs text-muted-foreground pt-1 border-t'>
                  <span className='flex items-center gap-1 text-[11px] truncate max-w-[170px]'>
                    <Building2 className='h-3 w-3 text-teal-500' />
                    {shelter ? shelter.name : 'Unassigned Shelter'}
                  </span>
                  <span className='text-[10px] italic truncate max-w-[100px]'>
                    {animal.condition || 'Healthy'}
                  </span>
                </div>
              </CardContent>
            </div>

            {/* Card Actions Footer */}
            <div className='p-3 bg-muted/20 border-t flex items-center justify-between gap-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onSelectAnimal(animal)}
                className='w-full text-xs h-8 gap-1.5 border-teal-500/20 hover:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
              >
                <Eye className='h-3.5 w-3.5' /> View Profile
              </Button>

              {(userRole === 'Admin' || userRole === 'Dispatcher' || userRole === 'Veterinarian') && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onEditAnimal(animal)}
                  className='h-8 w-8 text-muted-foreground shrink-0'
                  title='Edit Record'
                >
                  <Edit2 className='h-3.5 w-3.5' />
                </Button>
              )}

              {userRole === 'Admin' && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onDeleteAnimal(animal)}
                  className='h-8 w-8 text-rose-500 hover:bg-rose-500/10 shrink-0'
                  title='Delete Record'
                >
                  <Trash2 className='h-3.5 w-3.5' />
                </Button>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
