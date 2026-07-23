import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Lock,
  Shield,
  History,
  User,
  Clock,
  Building,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SecurityProfileData {
  profile: {
    id: string
    first_name: string
    last_name: string
    name: string
    email: string
    phone: string
    role: string
    shelter: string
    last_login: string | null
    last_password_change: string
    needs_password_reset: boolean
  }
  securityEvents: Array<{
    id: number
    action: string
    timestamp: string
    user: string
  }>
}

export function AccountForm() {
  const { auth } = useAuthStore()
  const [profileData, setProfileData] = useState<SecurityProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Show/Hide password states
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Fetch security profile data
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/security-profile', {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      })
      if (!res.ok) throw new Error('Failed to load profile')
      const data = await res.json()
      setProfileData(data)
    } catch (e) {
      console.error(e)
      toast.error('Could not fetch security profile data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Dynamic Password Validation Checks
  const hasMinLength = newPassword.length >= 12
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasLowercase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecial = /[!@#$%^&*(),.?\":{}|<>]/.test(newPassword)

  const passedChecksCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial
  ].filter(Boolean).length

  // Calculate Strength Label and color
  const getStrengthConfig = () => {
    if (newPassword.length === 0) return { label: 'None', color: 'bg-muted', textClass: 'text-muted-foreground', width: 'w-0' }
    if (passedChecksCount <= 2) return { label: 'Weak', color: 'bg-red-500', textClass: 'text-red-500', width: 'w-1/3' }
    if (passedChecksCount <= 4) return { label: 'Medium Strength', color: 'bg-amber-500', textClass: 'text-amber-500', width: 'w-2/3' }
    return { label: 'Very Strong', color: 'bg-emerald-500', textClass: 'text-emerald-500', width: 'w-full' }
  }

  const strength = getStrengthConfig()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error('Please enter your current password.')
      return
    }
    if (passedChecksCount < 5) {
      toast.error('Password does not meet all security policy requirements.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to change password')
      }

      toast.success('Password updated successfully! Force logout for session security...')
      
      // Session Security: Force logout after password change
      setTimeout(() => {
        auth.reset()
      }, 2000)

    } catch (e: any) {
      toast.error(e.message || 'Error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 space-y-3 text-sm text-muted-foreground'>
        <div className='h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full' />
        <span>Loading RescueHub Security Center...</span>
      </div>
    )
  }

  const userProfile = profileData?.profile

  return (
    <div className='w-full space-y-6'>
      {/* Forced Reset Banner */}
      {userProfile?.needs_password_reset && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex gap-3 text-xs leading-relaxed animate-pulse'>
          <AlertCircle className='h-5 w-5 shrink-0' />
          <div>
            <strong className='block font-bold text-sm'>Forced Password Reset Active</strong>
            You are currently logged in with a temporary or default credential. You must set a strong, custom password below to secure your operational account.
          </div>
        </div>
      )}

      {/* 1. Account Profile Card */}
      <Card className='border-emerald-500/10 shadow-sm'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-md font-bold flex items-center gap-2'>
            <User className='h-4 w-4 text-emerald-500' /> User Information & Role Profile
          </CardTitle>
          <CardDescription>Official personnel credentials from the system registry.</CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
          <div className='space-y-2.5'>
            <div className='flex items-center gap-2.5'>
              <div className='h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-600 text-sm'>
                {userProfile?.first_name[0]}{userProfile?.last_name[0]}
              </div>
              <div>
                <h4 className='font-bold text-sm text-foreground'>{userProfile?.name}</h4>
                <Badge className='bg-primary/10 text-primary hover:bg-primary/20 text-[10px] py-0 font-bold'>
                  🛡️ {userProfile?.role}
                </Badge>
              </div>
            </div>

            <div className='space-y-1.5 pt-1.5 border-t'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Mail className='h-3.5 w-3.5 text-emerald-500' /> {userProfile?.email}
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Phone className='h-3.5 w-3.5 text-emerald-500' /> {userProfile?.phone}
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Building className='h-3.5 w-3.5 text-emerald-500' /> {userProfile?.shelter}
              </div>
            </div>
          </div>

          <div className='space-y-2 pt-2 md:pt-0 md:border-l md:pl-6 border-t md:border-t-0 flex flex-col justify-center'>
            <div className='flex items-center justify-between py-1 border-b'>
              <span className='text-muted-foreground flex items-center gap-1.5'>
                <Clock className='h-3.5 w-3.5 text-emerald-500' /> Last Login:
              </span>
              <span className='font-mono font-semibold'>
                {userProfile?.last_login ? new Date(userProfile.last_login).toLocaleString() : 'First Session'}
              </span>
            </div>
            <div className='flex items-center justify-between py-1 border-b'>
              <span className='text-muted-foreground flex items-center gap-1.5'>
                <Shield className='h-3.5 w-3.5 text-emerald-500' /> Password Last Changed:
              </span>
              <span className='font-mono font-semibold'>
                {userProfile?.last_password_change ? new Date(userProfile.last_password_change).toLocaleString() : 'Default Credential'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 2. Change Password Form */}
        <Card className='lg:col-span-2 border-emerald-500/10 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-md font-bold flex items-center gap-2'>
              <Lock className='h-4 w-4 text-emerald-500' /> Update Account Password
            </CardTitle>
            <CardDescription>Verify your current credentials and select a strong replacement password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className='space-y-4'>
              <div className='space-y-1.5'>
                <span className='text-xs font-semibold text-foreground'>Current Password</span>
                <div className='relative'>
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder='Verify existing password'
                    className='pr-10 text-xs'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowCurrent(!showCurrent)}
                    className='absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground'
                  >
                    {showCurrent ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <span className='text-xs font-semibold text-foreground'>New Password</span>
                  <div className='relative'>
                    <Input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder='At least 12 characters'
                      className='pr-10 text-xs'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowNew(!showNew)}
                      className='absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground'
                    >
                      {showNew ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                    </button>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <span className='text-xs font-semibold text-foreground'>Confirm New Password</span>
                  <div className='relative'>
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder='Re-type new password'
                      className='pr-10 text-xs'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirm(!showConfirm)}
                      className='absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground'
                    >
                      {showConfirm ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <div className='space-y-1.5 pt-1.5 border-t'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>Password Strength:</span>
                    <strong className={strength.textClass}>{strength.label}</strong>
                  </div>
                  <div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
                    <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                  </div>
                </div>
              )}

              <Button
                type='submit'
                disabled={submitting}
                className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9'
              >
                {submitting ? 'Applying New Password...' : 'Save New Password & Secure Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 3. Password Policy & Security Checklist */}
        <div className='space-y-6'>
          <Card className='border-emerald-500/10 shadow-sm'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-bold flex items-center gap-1.5'>
                🛡️ Password Security Policy
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-xs'>
              <div className='flex items-center gap-2'>
                {hasMinLength ? <CheckCircle2 className='h-4 w-4 text-emerald-500' /> : <XCircle className='h-4 w-4 text-red-500' />}
                <span className={hasMinLength ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>
                  At least 12 characters
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {hasUppercase ? <CheckCircle2 className='h-4 w-4 text-emerald-500' /> : <XCircle className='h-4 w-4 text-red-500' />}
                <span className={hasUppercase ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>
                  One uppercase letter (A-Z)
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {hasLowercase ? <CheckCircle2 className='h-4 w-4 text-emerald-500' /> : <XCircle className='h-4 w-4 text-red-500' />}
                <span className={hasLowercase ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>
                  One lowercase letter (a-z)
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {hasNumber ? <CheckCircle2 className='h-4 w-4 text-emerald-500' /> : <XCircle className='h-4 w-4 text-red-500' />}
                <span className={hasNumber ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>
                  One number (0-9)
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {hasSpecial ? <CheckCircle2 className='h-4 w-4 text-emerald-500' /> : <XCircle className='h-4 w-4 text-red-500' />}
                <span className={hasSpecial ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>
                  One special character (!@#$)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Recent Security Events */}
      <Card className='border-emerald-500/10 shadow-sm'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-bold flex items-center gap-2'>
            <History className='h-4 w-4 text-emerald-500' /> Recent Security Activity Trail
          </CardTitle>
          <CardDescription>Chronological sequence of login validations and credential modifications.</CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='border-t overflow-hidden rounded-b-xl'>
            {profileData?.securityEvents && profileData.securityEvents.length > 0 ? (
              <table className='w-full border-collapse text-left text-xs'>
                <thead>
                  <tr className='bg-muted/50 font-semibold text-muted-foreground border-b'>
                    <th className='p-3'>Event Description</th>
                    <th className='p-3'>Actor</th>
                    <th className='p-3 text-right'>Timestamp</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {profileData.securityEvents.map((e) => (
                    <tr key={e.id} className='hover:bg-muted/30'>
                      <td className='p-3 font-medium text-foreground'>{e.action}</td>
                      <td className='p-3 text-muted-foreground'>{e.user}</td>
                      <td className='p-3 text-right text-muted-foreground font-mono'>
                        {new Date(e.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='p-6 text-center text-muted-foreground text-xs italic border-t'>
                No recent security activity logged.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
