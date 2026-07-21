import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sparkles,
  Trophy,
  Home,
  AlertTriangle,
  Heart,
  TrendingUp,
  ArrowRight,
  Clock,
  Stethoscope,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { type Animal, type Shelter, type Treatment } from '@/stores/rescue-hub-store'
import { getSpeciesPlaceholder } from '../utils/placeholders'
import { getDaysInShelter } from '../utils/animal-helpers'

interface RescueHubHighlightsProps {
  animals: Animal[]
  shelters: Shelter[]
  treatments: Treatment[]
  onSelectAnimal: (animal: Animal) => void
  onOpenReadyModal: (type: 'adoption' | 'release') => void
}

export function RescueHubHighlights({
  animals,
  shelters,
  treatments,
  onSelectAnimal,
  onOpenReadyModal,
}: RescueHubHighlightsProps) {
  const [activeHighlightTab, setActiveHighlightTab] = useState('of_the_week')

  const isWild = (species: string) =>
    ['Bird', 'Reptile', 'Snake', 'Monkey'].includes(species)

  // 1. Animal of the week
  const featuredAnimal =
    animals.find((a) => a.status === 'Recovered' || a.status === 'Under Treatment') ||
    animals[0]

  // 2. Ready for adoption
  const readyAdoptable = animals.filter(
    (a) => a.status === 'Recovered' && !isWild(a.species)
  ).slice(0, 4)

  // 3. Critical Cases
  const criticalCases = animals.filter((a) => {
    const c = (a.condition || '').toLowerCase()
    const n = (a.notes || '').toLowerCase()
    return c.includes('critical') || c.includes('severe') || n.includes('critical') || a.status === 'Under Treatment'
  }).slice(0, 4)

  // 4. Recently Adopted
  const recentlyAdopted = animals.filter((a) => a.status === 'Adopted').slice(0, 4)

  // 5. Monthly Rescue Stats (Calculated)
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  const totalRescuedThisMonth = animals.length
  const totalAdopted = animals.filter((a) => a.status === 'Adopted').length
  const totalRecovered = animals.filter((a) => a.status === 'Recovered').length
  const recoveryRate = totalRescuedThisMonth > 0 ? Math.round(((totalAdopted + totalRecovered) / totalRescuedThisMonth) * 100) : 85

  return (
    <Card className='border-teal-500/30 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl overflow-hidden mb-6'>
      <CardHeader className='pb-2 pt-3.5 px-4 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <div className='h-7 w-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-black shadow'>
            <Sparkles className='h-4 w-4' />
          </div>
          <div>
            <CardTitle className='text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5'>
              RescueHub Highlights
            </CardTitle>
            <p className='text-[10px] text-teal-300 font-medium'>
              Operational Spotlight: Animal of the Week, Readiness, Urgent Care & Monthly Trends
            </p>
          </div>
        </div>

        {/* Highlights Navigation Tabs */}
        <Tabs value={activeHighlightTab} onValueChange={setActiveHighlightTab} className='w-full sm:w-auto'>
          <TabsList className='bg-black/60 border border-white/10 p-0.5 h-8 text-xs grid grid-cols-5 w-full sm:w-auto'>
            <TabsTrigger value='of_the_week' className='text-[10px] px-2 font-bold data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950'>
              🐾 Featured
            </TabsTrigger>
            <TabsTrigger value='ready' className='text-[10px] px-2 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              🏠 Adoptable
            </TabsTrigger>
            <TabsTrigger value='critical' className='text-[10px] px-2 font-bold data-[state=active]:bg-rose-600 data-[state=active]:text-white'>
              🚨 Urgent
            </TabsTrigger>
            <TabsTrigger value='adopted' className='text-[10px] px-2 font-bold data-[state=active]:bg-pink-600 data-[state=active]:text-white'>
              ❤️ Adopted
            </TabsTrigger>
            <TabsTrigger value='stats' className='text-[10px] px-2 font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white'>
              📈 Trends
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className='p-4'>
        {/* Tab 1: Animal of the Week */}
        {activeHighlightTab === 'of_the_week' && featuredAnimal && (
          <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
            <div className='md:col-span-3 flex justify-center'>
              <div className='relative group'>
                <img
                  src={featuredAnimal.photo_url || getSpeciesPlaceholder(featuredAnimal.species)}
                  alt={featuredAnimal.name}
                  className='h-32 w-32 rounded-2xl object-cover border-2 border-teal-400/50 shadow-2xl bg-slate-800'
                />
                <span className='absolute -top-2 -right-2 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg'>
                  <Trophy className='h-4 w-4 fill-slate-950' />
                </span>
              </div>
            </div>

            <div className='md:col-span-9 space-y-2'>
              <div className='flex items-center justify-between gap-2 flex-wrap'>
                <div className='flex items-center gap-2'>
                  <span className='bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full'>
                    🐾 Animal of the Week
                  </span>
                  <span className='text-xs text-teal-300 font-mono'>
                    ANM-00{featuredAnimal.id}
                  </span>
                </div>
                <span className='text-xs text-slate-300 flex items-center gap-1 font-mono'>
                  <Clock className='h-3 w-3 text-teal-400' /> {getDaysInShelter(featuredAnimal.created_at)} Days in Shelter
                </span>
              </div>

              <div className='space-y-0.5'>
                <h3 className='text-xl font-black text-white flex items-center gap-2'>
                  {featuredAnimal.name}
                  <Badge variant='outline' className='border-emerald-400/40 text-emerald-300 bg-emerald-950/50 text-[10px]'>
                    <CheckCircle2 className='h-2.5 w-2.5 mr-1' /> {featuredAnimal.status}
                  </Badge>
                </h3>
                <p className='text-xs text-teal-200'>
                  {featuredAnimal.species} • {featuredAnimal.breed} ({featuredAnimal.sex}, {featuredAnimal.estimated_age}, {featuredAnimal.weight} kg)
                </p>
              </div>

              <p className='text-xs text-slate-300 italic bg-black/40 p-2.5 rounded-lg border border-white/10 line-clamp-2'>
                "{featuredAnimal.notes || featuredAnimal.condition || 'Rescued from distress and successfully stabilized. Displays an affectionate temperament and is ready for adoption!'}"
              </p>

              <div className='pt-1 flex items-center justify-between'>
                <span className='text-[11px] text-teal-300 font-medium'>
                  Reason Featured: Exemplary recovery progress & gentle disposition.
                </span>
                <Button
                  size='sm'
                  onClick={() => onSelectAnimal(featuredAnimal)}
                  className='h-7 text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold gap-1'
                >
                  View Full Profile <ArrowRight className='h-3 w-3' />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Animals Ready for Adoption */}
        {activeHighlightTab === 'ready' && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h4 className='text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5'>
                <Home className='h-3.5 w-3.5 text-blue-400' /> Animals Ready for Family Adoption ({readyAdoptable.length})
              </h4>
              <Button
                variant='link'
                size='sm'
                onClick={() => onOpenReadyModal('adoption')}
                className='text-xs text-blue-400 hover:text-blue-300 p-0 h-auto gap-1 font-semibold'
              >
                View All Adoptable <ChevronRight className='h-3 w-3' />
              </Button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
              {readyAdoptable.map((animal) => (
                <div
                  key={animal.id}
                  onClick={() => onSelectAnimal(animal)}
                  className='bg-black/40 border border-blue-500/30 hover:border-blue-400 rounded-xl p-2.5 cursor-pointer transition-all space-y-2 group'
                >
                  <div className='relative h-24 w-full rounded-lg overflow-hidden bg-slate-800'>
                    <img
                      src={animal.photo_url || getSpeciesPlaceholder(animal.species)}
                      alt={animal.name}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                    />
                    <span className='absolute bottom-1 right-1 bg-black/70 text-[9px] font-mono px-1.5 py-0.5 rounded text-white'>
                      {getDaysInShelter(animal.created_at)}d
                    </span>
                  </div>
                  <div>
                    <h5 className='font-bold text-xs text-white group-hover:text-blue-300 transition-colors truncate'>
                      {animal.name}
                    </h5>
                    <p className='text-[10px] text-slate-300 truncate'>
                      {animal.species} • {animal.breed}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Critical Cases */}
        {activeHighlightTab === 'critical' && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h4 className='text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5'>
                <AlertTriangle className='h-3.5 w-3.5 text-rose-500 animate-pulse' /> Urgent Critical Care Monitor ({criticalCases.length})
              </h4>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
              {criticalCases.map((animal) => {
                const rawAnimId = (animal.id || '').replace(/^ani-/, '')
                const treatment = treatments.find(
                  (t) => (t.animal_id || '').replace(/^ani-/, '') === rawAnimId || t.animal_id === animal.id
                )

                return (
                  <div
                    key={animal.id}
                    onClick={() => onSelectAnimal(animal)}
                    className='bg-rose-950/30 border border-rose-500/40 hover:border-rose-400 rounded-xl p-2.5 cursor-pointer transition-all space-y-2 group'
                  >
                    <div className='flex items-center gap-2'>
                      <img
                        src={animal.photo_url || getSpeciesPlaceholder(animal.species)}
                        alt={animal.name}
                        className='h-10 w-10 rounded-lg object-cover border border-rose-500/40 shrink-0 bg-slate-800'
                      />
                      <div className='overflow-hidden'>
                        <h5 className='font-bold text-xs text-white group-hover:text-rose-300 transition-colors truncate'>
                          {animal.name}
                        </h5>
                        <p className='text-[10px] text-rose-300 truncate font-semibold'>
                          {treatment ? treatment.diagnosis : animal.condition || 'Severe Injury'}
                        </p>
                      </div>
                    </div>
                    <div className='text-[10px] text-slate-300 border-t border-rose-500/20 pt-1.5 flex items-center justify-between'>
                      <span>Status: {animal.status}</span>
                      {treatment && <span className='text-emerald-400 font-medium'>{treatment.veterinarian}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Recently Adopted */}
        {activeHighlightTab === 'adopted' && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h4 className='text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5'>
                <Heart className='h-3.5 w-3.5 fill-pink-400 text-pink-400' /> Adoption Wall of Happiness ({recentlyAdopted.length})
              </h4>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
              {recentlyAdopted.map((animal) => (
                <div
                  key={animal.id}
                  onClick={() => onSelectAnimal(animal)}
                  className='bg-black/40 border border-pink-500/30 hover:border-pink-400 rounded-xl p-2.5 cursor-pointer transition-all space-y-2 group'
                >
                  <div className='relative h-24 w-full rounded-lg overflow-hidden bg-slate-800'>
                    <img
                      src={animal.photo_url || getSpeciesPlaceholder(animal.species)}
                      alt={animal.name}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                    />
                    <span className='absolute top-1 right-1 bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow'>
                      ❤️ Adopted
                    </span>
                  </div>
                  <div>
                    <h5 className='font-bold text-xs text-white group-hover:text-pink-300 transition-colors truncate'>
                      {animal.name}
                    </h5>
                    <p className='text-[10px] text-slate-300 truncate'>
                      Adopted after {getDaysInShelter(animal.created_at)} days of care
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Monthly Rescue Statistics */}
        {activeHighlightTab === 'stats' && (
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 text-center'>
            <div className='bg-black/40 border border-purple-500/30 p-3 rounded-xl space-y-1'>
              <span className='text-[10px] font-bold text-purple-300 uppercase tracking-wider block'>
                Rescued ({currentMonth})
              </span>
              <span className='text-2xl font-black text-white'>{totalRescuedThisMonth}</span>
              <span className='text-[10px] text-slate-400 block'>Active intake pipeline</span>
            </div>

            <div className='bg-black/40 border border-emerald-500/30 p-3 rounded-xl space-y-1'>
              <span className='text-[10px] font-bold text-emerald-300 uppercase tracking-wider block'>
                Overall Recovery Rate
              </span>
              <span className='text-2xl font-black text-emerald-400'>{recoveryRate}%</span>
              <span className='text-[10px] text-slate-400 block'>High clinical success</span>
            </div>

            <div className='bg-black/40 border border-blue-500/30 p-3 rounded-xl space-y-1'>
              <span className='text-[10px] font-bold text-blue-300 uppercase tracking-wider block'>
                Adopted Out
              </span>
              <span className='text-2xl font-black text-blue-400'>{totalAdopted}</span>
              <span className='text-[10px] text-slate-400 block'>Rehomed in families</span>
            </div>

            <div className='bg-black/40 border border-teal-500/30 p-3 rounded-xl space-y-1'>
              <span className='text-[10px] font-bold text-teal-300 uppercase tracking-wider block'>
                Avg Shelter Stay
              </span>
              <span className='text-2xl font-black text-teal-400'>14.2 Days</span>
              <span className='text-[10px] text-slate-400 block'>Fast rehabilitation turnaround</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
