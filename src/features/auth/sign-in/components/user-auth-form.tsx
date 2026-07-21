import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useRescueHubStore } from '@/stores/rescue-hub-store'
import { sleep, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(7, 'Password must be at least 7 characters long.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const loginPromise = fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    }).then(async (res) => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Invalid email or password')
      }
      return res.json()
    })

    toast.promise(loginPromise, {
      loading: 'Signing in...',
      success: (payload) => {
        setIsLoading(false)

        // Set user and access token
        auth.setUser(payload.user)
        auth.setAccessToken(payload.accessToken)

        // Trigger initial data load in the background
        useRescueHubStore.getState().fetchInitialData()

        // Redirect to the stored location or default to dashboard
        const targetPath = redirectTo || '/'
        navigate({ to: targetPath, replace: true })

        return `Welcome back, ${data.email}!`
      },
      error: (err: any) => {
        setIsLoading(false)
        return err.message || 'Error occurred during login.'
      },
    })
  }

  const handleRoleDemoLogin = (email: string, pass: string, roleName: string) => {
    form.setValue('email', email)
    form.setValue('password', pass)

    setIsLoading(true)

    const demoPromise = fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password: pass })
    }).then(async (res) => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Invalid credentials')
      }
      return res.json()
    })

    toast.promise(demoPromise, {
      loading: `Logging in as ${roleName}...`,
      success: (payload) => {
        setIsLoading(false)
        auth.setUser(payload.user)
        auth.setAccessToken(payload.accessToken)
        useRescueHubStore.getState().fetchInitialData()
        navigate({ to: redirectTo || '/', replace: true })
        return `Signed in as ${roleName}!`
      },
      error: (err: any) => {
        setIsLoading(false)
        return err.message || 'Error occurred during login.'
      }
    })
  }

  const handleDemoLogin = () => handleRoleDemoLogin('admin@rescuehub.org', 'admin123', 'Admin')

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    toast.promise(sleep(1200), {
      loading: 'Connecting to Google...',
      success: () => {
        setIsLoading(false)
        const mockUser = {
          accountNo: 'ACC002',
          email: 'google-user@rescuehub.org',
          role: ['user'],
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }
        auth.setUser(mockUser)
        auth.setAccessToken('mock-access-token')
        navigate({ to: redirectTo || '/', replace: true })
        return 'Signed in successfully with Google!'
      },
      error: 'Error'
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>

        <div className='mt-2 space-y-1.5'>
          <p className='text-xs font-semibold text-muted-foreground text-center'>Quick Demo Logins (Select Role):</p>
          <div className='grid grid-cols-2 gap-1.5'>
            <Button
              variant='outline'
              type='button'
              size='sm'
              disabled={isLoading}
              className='text-xs bg-purple-500/5 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/10'
              onClick={() => handleRoleDemoLogin('admin@rescuehub.org', 'admin123', 'Admin')}
            >
              👑 Admin
            </Button>
            <Button
              variant='outline'
              type='button'
              size='sm'
              disabled={isLoading}
              className='text-xs bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/10'
              onClick={() => handleRoleDemoLogin('alice.green@rescuehub.org', 'agent123', 'Dispatcher')}
            >
              📋 Dispatcher
            </Button>
            <Button
              variant='outline'
              type='button'
              size='sm'
              disabled={isLoading}
              className='text-xs bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
              onClick={() => handleRoleDemoLogin('alice.vance@rescuehub.org', 'agent123', 'Veterinarian')}
            >
              🩺 Vet
            </Button>
            <Button
              variant='outline'
              type='button'
              size='sm'
              disabled={isLoading}
              className='text-xs bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/10'
              onClick={() => handleRoleDemoLogin('mark.davis@rescuehub.org', 'agent123', 'Rescuer')}
            >
              🚑 Rescuer
            </Button>
          </div>
        </div>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant='outline'
          type='button'
          disabled={isLoading}
          className='w-full flex items-center justify-center gap-2'
          onClick={handleGoogleSignIn}
        >
          <svg className='h-4 w-4' viewBox='0 0 24 24'>
            <path
              fill='#4285F4'
              d='M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.14-.1 2.87-.2 1.34-1 2.47-2.16 3.19v2.66h3.5c2.05-1.88 3.23-4.66 3.23-7.85z'
            />
            <path
              fill='#34A853'
              d='M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.5-2.66c-.97.65-2.22 1.04-3.53 1.04-2.72 0-5.02-1.83-5.85-4.3H3.45v2.76C5.43 21.03 8.48 24 12 24z'
            />
            <path
              fill='#FBBC05'
              d='M6.15 15.17c-.22-.66-.35-1.37-.35-2.1s.13-1.44.35-2.1V8.21H3.45A11.966 11.966 0 002.3 12c0 1.32.22 2.6.65 3.79l3.2-2.62z'
            />
            <path
              fill='#EA4335'
              d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 8.48 0 5.43 2.97 3.45 6.07l3.2 2.62c.83-2.47 3.13-4.3 5.85-4.3z'
            />
          </svg>
          Sign in with Google
        </Button>
      </form>
    </Form>
  )
}
