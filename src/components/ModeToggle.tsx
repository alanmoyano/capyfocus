import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/contexts/ThemeContext'
import { useState } from 'react'

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  const [isChecked, setIsChecked] = useState(theme === 'light')

  const handleToggle = () => {
    setIsChecked(!isChecked)
    toggleTheme(!isChecked)
  }

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className=''>
        <div className='relative'>
          <input
            type='checkbox'
            id='toggle'
            className='sr-only'
            checked={isChecked}
            onChange={handleToggle}
          />
          <label
            htmlFor='toggle'
            className='flex h-7 w-14 cursor-pointer items-center rounded-full bg-gray-200 p-1'
          >
            <div className='toggle-dot flex h-6 w-6 translate-x-0 items-center justify-center rounded-full bg-primary/60 shadow-md duration-300 ease-in-out dark:translate-x-full dark:bg-black'>
              <span className='dark:hidden'>
                <Sun />
              </span>
              <span className='hidden dark:inline'>
                <Moon />
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
