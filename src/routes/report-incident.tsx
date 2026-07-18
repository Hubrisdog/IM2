import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle2, AlertTriangle, Send } from 'lucide-react'
import { AuthLayout } from '@/features/auth/auth-layout'

export const Route = createFileRoute('/report-incident')({
  component: PublicReportIncident,
})

function PublicReportIncident() {
  const [reporterName, setReporterName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [species, setSpecies] = useState('Dog')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('Medium')
  const [photoUrl, setPhotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAnonymous && !reporterName) {
      toast.error('Reporter name is required unless anonymous is checked.')
      return
    }
    if (!location || !description) {
      toast.error('Location and description are required.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reporter_name: isAnonymous ? 'Anonymous' : reporterName,
          contact_number: contactNumber || '',
          is_anonymous: isAnonymous,
          species,
          location,
          description,
          severity,
          photo: photoUrl || null,
          latitude: 10.315, // Cebu City default coordinates
          longitude: 123.902,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to submit report')
      }

      setIsSuccess(true)
      toast.success('Incident report submitted successfully!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error occurred while submitting.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <Card className='max-w-md w-full gap-4 border-teal-500/20 shadow-2xl bg-card/85 backdrop-blur-md relative overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-300'>
          <div className='flex justify-center mb-4'>
            <CheckCircle2 className='h-16 w-16 text-emerald-500 animate-bounce' />
          </div>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Report Submitted Successfully!
          </CardTitle>
          <CardDescription className='text-sm mt-2 text-muted-foreground'>
            Thank you for reporting this incident. Our dispatchers will review the details immediately and coordinate a response.
          </CardDescription>
          <CardFooter className='pt-6 flex justify-center'>
            <Link to='/sign-in'>
              <Button className='bg-teal-600 hover:bg-teal-500 text-white flex gap-2 items-center justify-center font-medium'>
                <ArrowLeft className='h-4 w-4' /> Back to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Card className='max-w-md w-full gap-4 border-teal-500/10 shadow-2xl bg-card/80 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-teal-500/20 my-8'>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-2 mb-1'>
            <Link to='/sign-in' className='text-muted-foreground hover:text-foreground transition-colors'>
              <ArrowLeft className='h-5 w-5' />
            </Link>
            <CardTitle className='text-2xl font-bold tracking-tight text-foreground'>
              Report Animal Incident
            </CardTitle>
          </div>
          <CardDescription className='text-sm text-muted-foreground mt-1'>
            Provide incident details below. No account or login required.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Anonymous Toggle */}
            <div className='flex items-center space-x-2 bg-muted/40 p-3 rounded-lg border border-teal-500/5'>
              <input
                type='checkbox'
                id='anonymous'
                checked={isAnonymous}
                onChange={(e) => {
                  setIsAnonymous(e.target.checked)
                  if (e.target.checked) setReporterName('Anonymous')
                  else setReporterName('')
                }}
                className='h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500'
              />
              <label htmlFor='anonymous' className='text-sm font-medium text-foreground cursor-pointer select-none'>
                Submit anonymously (hide your identity)
              </label>
            </div>

            {/* Reporter Name (Hidden if anonymous) */}
            {!isAnonymous && (
              <div className='space-y-1 animate-in slide-in-from-top-2 duration-200'>
                <label className='text-sm font-semibold text-foreground'>Your Name</label>
                <Input
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder='Enter your full name'
                  required={!isAnonymous}
                />
              </div>
            )}

            {/* Contact Number */}
            <div className='space-y-1'>
              <label className='text-sm font-semibold text-foreground'>Contact Number</label>
              <Input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder='e.g., 0917-123-4567'
              />
            </div>

            {/* Species Selection */}
            <div className='space-y-1'>
              <label className='text-sm font-semibold text-foreground'>Animal Species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              >
                <option value='Dog'>Dog</option>
                <option value='Cat'>Cat</option>
                <option value='Bird'>Bird</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            {/* Location */}
            <div className='space-y-1'>
              <label className='text-sm font-semibold text-foreground'>Incident Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder='e.g., 123 Gorordo Ave (near convenience store)'
                required
              />
            </div>

            {/* Description */}
            <div className='space-y-1'>
              <label className='text-sm font-semibold text-foreground'>Description & Details</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Provide animal size, color, injury details, or behavior...'
                required
              />
            </div>

            {/* Severity */}
            <div className='space-y-1'>
              <label className='text-sm font-semibold text-foreground'>Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              >
                <option value='Low'>Low (Non-urgent stray, safe area)</option>
                <option value='Medium'>Medium (Unsafe area, needs attention)</option>
                <option value='High'>High (Injured or sick)</option>
                <option value='Critical'>Critical (Immediate life threat/trapped)</option>
              </select>
            </div>

            {/* Photo URL */}
            <div className='space-y-1'>
              <label className='text-sm font-semibold text-foreground'>Photo URL (Optional)</label>
              <Input
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder='e.g. https://example.com/animal.jpg'
              />
            </div>

            <Button type='submit' className='w-full mt-2 bg-teal-600 hover:bg-teal-500 text-white flex gap-2 justify-center items-center font-semibold' disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : (
                <>
                  <Send className='h-4 w-4' /> Submit Report
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
