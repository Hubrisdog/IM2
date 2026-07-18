import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useRescueHubStore } from '@/stores/rescue-hub-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, Info, Calendar, User, Tag, MapPin, Activity, FileText, ClipboardList } from 'lucide-react'
import { getSpeciesPlaceholder } from '@/features/animals/utils/placeholders'

export const Route = createFileRoute('/_authenticated/audit-logs')({
  component: AuditLogsPage,
})

function AuditLogsPage() {
  const store = useRescueHubStore()
  const activityLogs = store.activityLogs

  // Search/Filters State
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')

  // Dialog State
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleLogClick = (log: any) => {
    setSelectedLog(log)
    setIsOpen(true)
  }

  const getInitials = (user: string) => {
    if (!user) return 'SYS'
    return user
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getEntityBadge = (type: string) => {
    switch (type) {
      case 'IncidentReport':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
      case 'RescueCase':
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
      case 'Animal':
        return 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
      case 'Treatment':
        return 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
      case 'Rescuer':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
      default:
        return 'bg-slate-100 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
    }
  }

  // Filter logs based on search and type select
  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(search.toLowerCase())

    const matchesType = selectedType === 'All' || log.entity_type === selectedType

    return matchesSearch && matchesType
  })

  // Helper to fetch referenced entity details dynamically from store
  const getEntityDetails = (log: any) => {
    if (!log) return null
    const { entity_type, entity_id } = log

    switch (entity_type) {
      case 'IncidentReport': {
        const item = store.incidents.find((i) => i.id === entity_id)
        if (!item) return null
        return (
          <div className='space-y-3 mt-4 p-4 bg-muted/30 rounded-lg border border-teal-500/10 text-sm'>
            <div className='flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400'>
              <FileText className='h-4 w-4' /> Incident Report Details
            </div>
            <div><span className='font-medium text-muted-foreground'>Reporter Name:</span> {item.reporter_name}</div>
            <div><span className='font-medium text-muted-foreground'>Location:</span> {item.location}</div>
            <div><span className='font-medium text-muted-foreground'>Severity:</span> <Badge className='ml-1' variant='outline'>{item.severity}</Badge></div>
            <div><span className='font-medium text-muted-foreground'>Description:</span> {item.description}</div>
            {item.photo && (
              <div className='mt-2'>
                <img src={item.photo} alt='Incident' className='max-h-40 rounded-md object-cover border border-teal-500/10' />
              </div>
            )}
          </div>
        )
      }
      case 'Animal': {
        const item = store.animals.find((a) => a.id === entity_id)
        if (!item) return null
        return (
          <div className='space-y-3 mt-4 p-4 bg-muted/30 rounded-lg border border-teal-500/10 text-sm'>
            <div className='flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400'>
              <Activity className='h-4 w-4' /> Animal Profile Details
            </div>
            <div><span className='font-medium text-muted-foreground'>Name:</span> {item.name}</div>
            <div><span className='font-medium text-muted-foreground'>Species/Breed:</span> {item.species} ({item.breed})</div>
            <div><span className='font-medium text-muted-foreground'>Sex:</span> {item.sex}</div>
            <div><span className='font-medium text-muted-foreground'>Estimated Age:</span> {item.estimated_age}</div>
            <div><span className='font-medium text-muted-foreground'>Condition:</span> {item.condition}</div>
            <div><span className='font-medium text-muted-foreground'>Current Status:</span> <Badge className='ml-1' variant='outline'>{item.status}</Badge></div>
            <div className='mt-2'>
              <img src={item.photo_url || getSpeciesPlaceholder(item.species)} alt='Animal' className='max-h-40 rounded-md object-cover border border-teal-500/10' />
            </div>
          </div>
        )
      }
      case 'RescueCase': {
        const item = store.cases.find((c) => c.id === entity_id)
        if (!item) return null
        const team = store.rescuers.find((r) => r.id === item.rescuer_id)
        return (
          <div className='space-y-3 mt-4 p-4 bg-muted/30 rounded-lg border border-teal-500/10 text-sm'>
            <div className='flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400'>
              <MapPin className='h-4 w-4' /> Rescue Ticket Details
            </div>
            <div><span className='font-medium text-muted-foreground'>Case ID:</span> {item.id}</div>
            <div><span className='font-medium text-muted-foreground'>Case Number:</span> {item.case_number}</div>
            <div><span className='font-medium text-muted-foreground'>Severity:</span> <Badge className='ml-1' variant='outline'>{item.severity}</Badge></div>
            <div><span className='font-medium text-muted-foreground'>Status:</span> <Badge className='ml-1'>{item.status}</Badge></div>
            <div><span className='font-medium text-muted-foreground'>Assigned Team:</span> {team ? team.name : 'Unassigned'}</div>
            <div><span className='font-medium text-muted-foreground'>Rescue Notes:</span> {item.notes}</div>
          </div>
        )
      }
      case 'Treatment': {
        const item = store.treatments.find((t) => t.id === entity_id)
        if (!item) return null
        return (
          <div className='space-y-3 mt-4 p-4 bg-muted/30 rounded-lg border border-teal-500/10 text-sm'>
            <div className='flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400'>
              <Info className='h-4 w-4' /> Treatment Log Details
            </div>
            <div><span className='font-medium text-muted-foreground'>Veterinarian:</span> {item.veterinarian}</div>
            <div><span className='font-medium text-muted-foreground'>Diagnosis:</span> {item.diagnosis}</div>
            <div><span className='font-medium text-muted-foreground'>Medication:</span> {item.medication}</div>
            <div><span className='font-medium text-muted-foreground'>Procedure:</span> {item.procedure}</div>
            <div><span className='font-medium text-muted-foreground'>Follow-Up Date:</span> {item.follow_up_date || 'None'}</div>
          </div>
        )
      }
      case 'Shelter': {
        const item = store.shelters.find((s) => s.id === entity_id)
        if (!item) return null
        return (
          <div className='space-y-3 mt-4 p-4 bg-muted/30 rounded-lg border border-teal-500/10 text-sm'>
            <div className='flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400'>
              <MapPin className='h-4 w-4' /> Shelter Details
            </div>
            <div><span className='font-medium text-muted-foreground'>Name:</span> {item.name}</div>
            <div><span className='font-medium text-muted-foreground'>Address:</span> {item.address}</div>
            <div><span className='font-medium text-muted-foreground'>Max Capacity:</span> {item.capacity} beds</div>
            <div><span className='font-medium text-muted-foreground'>Contact:</span> {item.contact_person}</div>
          </div>
        )
      }
      default:
        return null
    }
  }

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>System Audit Logs</h2>
          <p className='text-muted-foreground'>
            Track chronological operations, status promotions, and database updates across RescueHub.
          </p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/40 p-4 rounded-xl border border-teal-500/5'>
        {/* Search */}
        <div className='relative w-full md:max-w-xs shrink-0'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search logs...'
            className='pl-8 bg-background border-teal-500/10'
          />
        </div>

        {/* Entity Type Filter */}
        <div className='flex items-center gap-2 w-full md:w-auto'>
          <span className='text-xs font-semibold text-muted-foreground shrink-0'>Filter Entity:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className='flex h-9 w-full md:w-48 rounded-md border border-teal-500/10 bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          >
            <option value='All'>All Entities</option>
            <option value='IncidentReport'>Incident Report</option>
            <option value='RescueCase'>Rescue Case</option>
            <option value='Animal'>Animal Profile</option>
            <option value='Treatment'>Medical Treatment</option>
            <option value='Shelter'>Shelters</option>
          </select>
        </div>
      </div>

      <Card className='border-teal-500/10 shadow-lg bg-card/60 backdrop-blur-md'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xl font-bold flex items-center gap-2'>
            <ClipboardList className='h-5 w-5 text-teal-500' />
            Activity Log Stream
          </CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} events logged in this session.
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent border-teal-500/10'>
                  <TableHead className='w-12'></TableHead>
                  <TableHead>User / Identity</TableHead>
                  <TableHead>Action Logged</TableHead>
                  <TableHead>Target Entity</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                      No matching audit logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    let timeAgo: string
                    try {
                      timeAgo = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })
                    } catch {
                      timeAgo = log.timestamp.split('T')[0]
                    }

                    return (
                      <TableRow
                        key={log.id}
                        onClick={() => handleLogClick(log)}
                        className='cursor-pointer hover:bg-teal-500/5 transition-colors border-teal-500/10'
                      >
                        <TableCell>
                          <Avatar className='h-8 w-8 border flex items-center justify-center font-bold text-xs'>
                            <AvatarFallback className={getEntityBadge(log.entity_type)}>
                              {getInitials(log.user)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className='font-semibold text-foreground'>{log.user}</TableCell>
                        <TableCell className='text-sm text-foreground max-w-sm break-words'>{log.action}</TableCell>
                        <TableCell>
                          <Badge className={getEntityBadge(log.entity_type)} variant='outline'>
                            {log.entity_type}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-xs text-muted-foreground'>
                          {new Date(log.timestamp).toLocaleString()} ({timeAgo})
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Details Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='max-w-md w-full border-teal-500/10 shadow-2xl bg-card/85 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 !top-[40%] sm:!top-[40%] !translate-y-[-40%] sm:!translate-y-[-40%]'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold flex items-center gap-2 text-foreground'>
              <span className='p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400'>
                <Info className='h-5 w-5' />
              </span>
              Audit Log Details
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground mt-1'>
              Detailed record of operations in the database registry.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className='space-y-4 py-3'>
              {/* Event Metadata */}
              <div className='grid grid-cols-2 gap-3 text-xs border-b border-teal-500/10 pb-4'>
                <div className='flex items-center gap-1 text-muted-foreground'>
                  <Tag className='h-3.5 w-3.5' /> Entity: {selectedLog.entity_type}
                </div>
                <div className='flex items-center gap-1 text-muted-foreground'>
                  <User className='h-3.5 w-3.5' /> User: {selectedLog.user}
                </div>
                <div className='flex items-center gap-1 text-muted-foreground col-span-2'>
                  <Calendar className='h-3.5 w-3.5' /> Date: {new Date(selectedLog.timestamp).toLocaleString()}
                </div>
              </div>

              {/* Event Message */}
              <div className='text-sm bg-teal-500/5 border border-teal-500/10 rounded-lg p-3 text-foreground leading-relaxed'>
                <strong>Action:</strong> {selectedLog.action}
              </div>

              {/* Referenced Entity Details */}
              {getEntityDetails(selectedLog)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
