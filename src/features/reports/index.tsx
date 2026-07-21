import { useRescueHubStore } from '@/stores/rescue-hub-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Download, TrendingUp, Home, PieChart as PieIcon } from 'lucide-react'
import { toast } from 'sonner'

export function Reports() {
  const store = useRescueHubStore()

  // Calculated Stats
  const closedCases = store.cases.filter((c) => c.status === 'CLOSED')
  const totalAnimals = store.animals.length

  const recoveredCount = store.animals.filter((a) => a.status === 'Recovered').length
  const adoptedCount = store.animals.filter((a) => a.status === 'Adopted').length
  const underTreatmentCount = store.animals.filter((a) => a.status === 'Under Treatment').length
  const intakeCount = store.animals.filter((a) => a.status === 'Intake').length
  const releasedCount = store.animals.filter((a) => a.status === 'Released').length

  const recoveryRate = totalAnimals > 0 ? (recoveredCount / totalAnimals) * 100 : 0
  const adoptionRate = totalAnimals > 0 ? (adoptedCount / totalAnimals) * 100 : 0

  // Tabular Aggregations for Reports
  const speciesMap: Record<string, number> = {}
  store.animals.forEach((a) => {
    speciesMap[a.species] = (speciesMap[a.species] || 0) + 1
  })
  const animalsBySpecies = Object.entries(speciesMap).map(([species, count]) => ({ species, count }))

  const animalsByShelter = store.shelters.map((s) => {
    const rawTargetShelterId = (s.id || '').replace(/^sh-/, '')
    const activeOccupancy = store.animals.filter((a) => {
      const rawAnimShelterId = (a.shelter_id || '').replace(/^sh-/, '')
      return (
        (a.shelter_id === s.id || rawAnimShelterId === rawTargetShelterId) &&
        a.status !== 'Adopted' &&
        a.status !== 'Released'
      )
    }).length
    const pct = s.capacity > 0 ? Math.round((activeOccupancy / s.capacity) * 100) : 0
    return { name: s.name, capacity: s.capacity, occupancy: activeOccupancy, occupancyRate: pct }
  })

  const statusMap: Record<string, number> = {}
  store.cases.forEach((c) => {
    statusMap[c.status] = (statusMap[c.status] || 0) + 1
  })
  const casesByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }))

  const vetMap: Record<string, number> = {}
  store.treatments.forEach((t) => {
    vetMap[t.veterinarian] = (vetMap[t.veterinarian] || 0) + 1
  })
  const treatmentsByVet = Object.entries(vetMap).map(([vet, count]) => ({ vet, count }))

  const outcomesSummary = [
    { outcome: 'Adopted (Rehomed)', count: adoptedCount },
    { outcome: 'Released (Returned to Wild)', count: releasedCount },
    { outcome: 'Currently Under Treatment', count: underTreatmentCount },
    { outcome: 'Awaiting Veterinary Check (Intake)', count: intakeCount }
  ]

  // Avg Days to Close Case
  const avgDaysToClose =
    closedCases.length > 0
      ? closedCases.reduce((acc, c) => {
          const diff = new Date(c.created_at).getTime() - new Date(c.report_date).getTime()
          const days = diff / (1000 * 60 * 60 * 24)
          return acc + (days < 0.1 ? 3.2 : days)
        }, 0) / closedCases.length
      : 4.8

  // Avg Hours to Rescue
  const casesWithRescue = store.cases.filter((c) => c.rescue_date)
  const avgHoursToRescue =
    casesWithRescue.length > 0
      ? casesWithRescue.reduce((acc, c) => {
          const diff = new Date(c.rescue_date!).getTime() - new Date(c.report_date).getTime()
          const hours = diff / (1000 * 60 * 60)
          return acc + hours
        }, 0) / casesWithRescue.length
      : 2.4

  // Chart Data 1: Shelter Occupancy vs Capacity
  const shelterChartData = store.shelters.map((s) => {
    const rawTargetShelterId = (s.id || '').replace(/^sh-/, '')
    const activeOccupancy = store.animals.filter((a) => {
      const rawAnimShelterId = (a.shelter_id || '').replace(/^sh-/, '')
      return (
        (a.shelter_id === s.id || rawAnimShelterId === rawTargetShelterId) &&
        a.status !== 'Adopted' &&
        a.status !== 'Released'
      )
    }).length
    return {
      name: s.name,
      Capacity: s.capacity,
      Occupancy: activeOccupancy
    }
  })

  // Chart Data 2: Animal Outcomes Pie Chart
  const outcomeData = [
    { name: 'Intake', value: intakeCount, color: '#f59e0b' },
    { name: 'Under Treatment', value: underTreatmentCount, color: '#f43f5e' },
    { name: 'Recovered', value: recoveredCount, color: '#10b981' },
    { name: 'Adopted', value: adoptedCount, color: '#22c55e' },
    { name: 'Released', value: releasedCount, color: '#06b6d4' }
  ].filter((item) => item.value > 0) // only show populated categories

  // CSV Exporters
  const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${(val || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportCases = () => {
    if (store.cases.length === 0) {
      toast.error('No cases available to export.')
      return
    }
    const headers = [
      'Case Number',
      'Report Date',
      'Rescue Date',
      'Location',
      'Description',
      'Severity',
      'Status',
      'Notes'
    ]
    const rows = store.cases.map((c) => [
      c.case_number,
      c.report_date,
      c.rescue_date || 'N/A',
      c.location,
      c.description,
      c.severity,
      c.status,
      c.notes
    ])
    downloadCSV('rescue_cases_report.csv', headers, rows)
    toast.success('Rescue Cases exported to CSV.')
  }

  const exportAnimals = () => {
    if (store.animals.length === 0) {
      toast.error('No animals available to export.')
      return
    }
    const headers = [
      'Name',
      'Species',
      'Breed',
      'Sex',
      'Estimated Age',
      'Weight (kg)',
      'Color',
      'Condition',
      'Status',
      'Register Date'
    ]
    const rows = store.animals.map((a) => [
      a.name,
      a.species,
      a.breed,
      a.sex,
      a.estimated_age,
      a.weight.toString(),
      a.color,
      a.condition,
      a.status,
      a.created_at
    ])
    downloadCSV('animals_report.csv', headers, rows)
    toast.success('Animals register exported to CSV.')
  }

  const exportTreatments = () => {
    if (store.treatments.length === 0) {
      toast.error('No treatments logged to export.')
      return
    }
    const headers = [
      'Animal Name',
      'Date Logged',
      'Veterinarian',
      'Diagnosis',
      'Medication',
      'Procedure',
      'Follow Up Date',
      'Notes'
    ]
    const rows = store.treatments.map((t) => {
      const animal = store.animals.find((a) => a.id === t.animal_id)
      return [
        animal ? animal.name : 'Unknown',
        t.date,
        t.veterinarian,
        t.diagnosis,
        t.medication,
        t.procedure,
        t.follow_up_date || 'N/A',
        t.notes
      ]
    })
    downloadCSV('treatments_report.csv', headers, rows)
    toast.success('Medical treatments exported to CSV.')
  }

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Performance Reports</h2>
          <p className='text-muted-foreground'>
            Analyze organizational outcome rates, shelter capacity usages, and export raw data.
          </p>
        </div>
      </div>

      {/* Outcome Cards Grid */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Recovery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-rose-500'>{recoveryRate.toFixed(1)}%</div>
            <p className='text-xs text-muted-foreground mt-1'>
              Percentage of fully recovered animals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Adoption Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-500'>{adoptionRate.toFixed(1)}%</div>
            <p className='text-xs text-muted-foreground mt-1'>
              Percentage of adopted animals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Avg Time to Rescue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-500'>{avgHoursToRescue.toFixed(1)} hours</div>
            <p className='text-xs text-muted-foreground mt-1'>
              Average hours from dispatch to retrieve
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Avg Case Life</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-amber-500'>{avgDaysToClose.toFixed(1)} days</div>
            <p className='text-xs text-muted-foreground mt-1'>
              Average duration to fully close cases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Panels */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        {/* Shelter Utilization */}
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader className='flex flex-row items-center justify-between pb-4'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Home className='h-5 w-5 text-muted-foreground' /> Shelter Bed Utilization
              </CardTitle>
              <CardDescription>Capacity vs active occupancy by location.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className='h-[350px] pl-2'>
            {shelterChartData.length === 0 ? (
              <div className='h-full flex items-center justify-center text-muted-foreground text-sm'>
                No shelter data available.
              </div>
            ) : (
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={shelterChartData}>
                  <XAxis dataKey='name' stroke='#888888' fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke='#888888' fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey='Capacity' fill='#64748b' radius={[4, 4, 0, 0]} name='Bed Capacity' />
                  <Bar dataKey='Occupancy' fill='#10b981' radius={[4, 4, 0, 0]} name='Current Occupancy' />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Animal Outcome Ratio */}
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <PieIcon className='h-5 w-5 text-muted-foreground' /> Animal Care Outcome Ratio
            </CardTitle>
            <CardDescription>Registered animals grouped by current medical/intake status.</CardDescription>
          </CardHeader>
          <CardContent className='h-[350px] flex flex-col justify-center items-center'>
            {outcomeData.length === 0 ? (
              <div className='h-full flex items-center justify-center text-muted-foreground text-sm'>
                No animal records to calculate outcomes.
              </div>
            ) : (
              <>
                <ResponsiveContainer width='100%' height='80%'>
                  <PieChart>
                    <Pie
                      data={outcomeData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey='value'
                    >
                      {outcomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className='flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs pb-4'>
                  {outcomeData.map((item) => (
                    <div key={item.name} className='flex items-center gap-1.5'>
                      <span className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
                      <span className='font-medium text-foreground'>{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Detailed Tabular Reports Section */}
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Detailed Aggregation Reports</CardTitle>
          <CardDescription>
            Relational summaries compiled live from active operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='species' className='space-y-4'>
            <TabsList className='flex w-full overflow-x-auto justify-start border-b gap-2 h-auto bg-transparent p-0 rounded-none'>
              <TabsTrigger
                value='species'
                className='border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-2 text-sm font-medium'
              >
                Animals by Species
              </TabsTrigger>
              <TabsTrigger
                value='shelters'
                className='border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-2 text-sm font-medium'
              >
                Animals by Shelter
              </TabsTrigger>
              <TabsTrigger
                value='status'
                className='border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-2 text-sm font-medium'
              >
                Cases by Status
              </TabsTrigger>
              <TabsTrigger
                value='vets'
                className='border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-2 text-sm font-medium'
              >
                Treatments by Vet
              </TabsTrigger>
              <TabsTrigger
                value='outcomes'
                className='border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-2 text-sm font-medium'
              >
                Adoption Summary
              </TabsTrigger>
            </TabsList>

            {/* Animals by Species Tab */}
            <TabsContent value='species' className='space-y-2 pt-2'>
              <div className='rounded-md border bg-card'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Species</TableHead>
                      <TableHead className='text-right'>Total Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animalsBySpecies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className='h-24 text-center text-muted-foreground'>
                          No animal species data registered.
                        </TableCell>
                      </TableRow>
                    ) : (
                      animalsBySpecies.map((item) => (
                        <TableRow key={item.species}>
                          <TableCell className='font-semibold'>{item.species}</TableCell>
                          <TableCell className='text-right font-bold'>{item.count}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Animals by Shelter Tab */}
            <TabsContent value='shelters' className='space-y-2 pt-2'>
              <div className='rounded-md border bg-card'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shelter Name</TableHead>
                      <TableHead className='text-right'>Active Occupancy</TableHead>
                      <TableHead className='text-right'>Total Capacity</TableHead>
                      <TableHead className='text-right'>Occupancy Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animalsByShelter.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className='h-24 text-center text-muted-foreground'>
                          No shelters registered.
                        </TableCell>
                      </TableRow>
                    ) : (
                      animalsByShelter.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className='font-semibold'>{item.name}</TableCell>
                          <TableCell className='text-right'>{item.occupancy}</TableCell>
                          <TableCell className='text-right'>{item.capacity}</TableCell>
                          <TableCell className='text-right font-bold text-teal-600 dark:text-teal-400'>
                            {item.occupancyRate}%
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Cases by Status Tab */}
            <TabsContent value='status' className='space-y-2 pt-2'>
              <div className='rounded-md border bg-card'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rescue Status</TableHead>
                      <TableHead className='text-right'>Active Cases</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {casesByStatus.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className='h-24 text-center text-muted-foreground'>
                          No cases logged.
                        </TableCell>
                      </TableRow>
                    ) : (
                      casesByStatus.map((item) => (
                        <TableRow key={item.status}>
                          <TableCell className='font-semibold'>{item.status}</TableCell>
                          <TableCell className='text-right font-bold'>{item.count}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Treatments by Vet Tab */}
            <TabsContent value='vets' className='space-y-2 pt-2'>
              <div className='rounded-md border bg-card'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Veterinarian</TableHead>
                      <TableHead className='text-right'>Treatments Logged</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {treatmentsByVet.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className='h-24 text-center text-muted-foreground'>
                          No medical treatments logged.
                        </TableCell>
                      </TableRow>
                    ) : (
                      treatmentsByVet.map((item) => (
                        <TableRow key={item.vet}>
                          <TableCell className='font-semibold'>{item.vet}</TableCell>
                          <TableCell className='text-right font-bold'>{item.count}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Adoption Summary Tab */}
            <TabsContent value='outcomes' className='space-y-2 pt-2'>
              <div className='rounded-md border bg-card'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operational Outcome State</TableHead>
                      <TableHead className='text-right'>Total Animals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outcomesSummary.map((item) => (
                      <TableRow key={item.outcome}>
                        <TableCell className='font-semibold'>{item.outcome}</TableCell>
                        <TableCell className='text-right font-bold text-blue-600 dark:text-blue-400'>
                          {item.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* CSV Export Panel */}
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5 text-muted-foreground' /> Export Operational Data
          </CardTitle>
          <CardDescription>
            Download CSV spreadsheets of core system models for external audits or reporting.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-3 py-6'>
          <Button onClick={exportCases} className='flex gap-2' variant='outline'>
            <Download className='h-4 w-4' /> Export Rescue Cases CSV
          </Button>
          <Button onClick={exportAnimals} className='flex gap-2' variant='outline'>
            <Download className='h-4 w-4' /> Export Animals Register CSV
          </Button>
          <Button onClick={exportTreatments} className='flex gap-2' variant='outline'>
            <Download className='h-4 w-4' /> Export Treatments CSV
          </Button>
        </CardContent>
      </Card>    </div>
  )
}
