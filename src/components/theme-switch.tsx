import { useEffect } from 'react'
import { Check, Moon, Sun, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    let themeColor = '#fff'
    if (theme === 'dark') themeColor = '#020817'
    else if (theme === 'warm') themeColor = '#f9f6f0'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full relative flex items-center justify-center'>
          {theme === 'light' && <Sun className='size-[1.2rem] transition-all scale-100 rotate-0' />}
          {theme === 'dark' && <Moon className='size-[1.2rem] transition-all scale-100 rotate-0' />}
          {theme === 'warm' && <Coffee className='size-[1.2rem] transition-all scale-100 rotate-0 text-amber-700' />}
          {theme === 'system' && <Sun className='size-[1.2rem] transition-all scale-100 rotate-0' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light{' '}
          <Check
            size={14}
            className={cn('ms-auto', theme !== 'light' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
          <Check
            size={14}
            className={cn('ms-auto', theme !== 'dark' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('warm')}>
          Cream
          <Check
            size={14}
            className={cn('ms-auto', theme !== 'warm' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
          <Check
            size={14}
            className={cn('ms-auto', theme !== 'system' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
