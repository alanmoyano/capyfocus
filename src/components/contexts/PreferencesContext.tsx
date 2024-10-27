import { createContext, useContext, useState } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { Motivation } from '../ComponentesEspecifico/Switchers'
import { useTheme } from './ThemeContext'

type Preferences = {
  motivationPreference: Motivation
  darkModePreference: boolean
  notificationPreference: boolean
  setMotivationPreference: Dispatch<SetStateAction<Motivation>>
  setDarkModePreference: Dispatch<SetStateAction<boolean>>
  setNotificationPreference: Dispatch<SetStateAction<boolean>>
}

export const PreferencesContext = createContext<Preferences | undefined>(
  undefined
)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [motivationPreference, setMotivationPreference] = useState<Motivation>(
    (localStorage.getItem('motivationPreference') as Motivation | null) ?? '1'
  )
  const [darkModePreference, setDarkModePreference] = useState<boolean>(
    localStorage.getItem('darkModePreference') === 'true'
  )
  const [notificationPreference, setNotificationPreference] = useState<boolean>(
    () => {
      const localNotificationPreference = localStorage.getItem(
        'notificationPreference'
      )
      return localNotificationPreference
        ? localNotificationPreference === 'true'
        : true
    }
  )

  const { setTheme } = useTheme()

  return (
    <PreferencesContext.Provider
      value={{
        motivationPreference,
        darkModePreference,
        notificationPreference,
        setMotivationPreference: newMotivation => {
          localStorage.setItem(
            'motivationPreference',
            newMotivation as Motivation
          )
          setMotivationPreference(newMotivation)
        },
        setDarkModePreference: newDarkMode => {
          localStorage.setItem('darkModePreference', String(newDarkMode))
          setDarkModePreference(newDarkMode)
          setTheme(newDarkMode ? 'dark' : 'light')
        },
        setNotificationPreference: newNotification => {
          localStorage.setItem(
            'notificationPreference',
            String(newNotification)
          )
          setNotificationPreference(newNotification)
        },
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
