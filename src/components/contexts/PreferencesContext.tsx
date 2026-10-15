import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'
import type { Motivation } from '../ComponentesEspecifico/Switchers'
import { useTheme } from './ThemeContext'
import { useSession } from './SessionContext'
import { supabase } from '../supabase/client'

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
  const { session } = useSession()
  const userId = session?.user.id
  // No se importan claves globales antiguas: no permiten conocer su dueño.
  const storageKey = useCallback(
    (name: string) =>
      `capyfocus:${userId ? `user:${userId}` : 'guest'}:${name}`,
    [userId]
  )
  const read = (name: string) => {
    try {
      return localStorage.getItem(storageKey(name))
    } catch {
      return null
    }
  }
  const [motivationPreference, setMotivation] = useState<Motivation>(() =>
    read('motivationPreference') === '2' ? '2' : '1'
  )
  const [darkModePreference, setDarkMode] = useState(
    () => read('darkModePreference') === 'true'
  )
  const [notificationPreference, setNotification] = useState(
    () => read('notificationPreference') !== 'false'
  )
  const edited = useRef({
    motivation: false,
    darkMode: false,
    notification: false,
  })
  const { setTheme } = useTheme()

  // Las escrituras ocurren después del commit, nunca dentro de un updater.
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey('motivationPreference'),
        motivationPreference
      )
      localStorage.setItem(
        storageKey('darkModePreference'),
        String(darkModePreference)
      )
      localStorage.setItem(
        storageKey('notificationPreference'),
        String(notificationPreference)
      )
    } catch (error) {
      console.error('No se pudieron guardar las preferencias locales', error)
    }
  }, [
    storageKey,
    motivationPreference,
    darkModePreference,
    notificationPreference,
  ])

  useEffect(() => {
    const preferredTheme = darkModePreference ? 'dark' : 'light'
    setTheme(preferredTheme)
  }, [darkModePreference, setTheme])

  useEffect(() => {
    if (!userId) return
    let active = true
    void supabase
      .from('Usuarios')
      .select('motivacionFavorita,modoOscuro,notificaciones')
      .eq('id', userId)
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          console.error(error)
          return
        }
        const preferences = data.at(0)
        if (!preferences) return
        const motivation = String(preferences.motivacionFavorita)
        if (
          !edited.current.motivation &&
          (motivation === '1' || motivation === '2')
        ) {
          setMotivation(motivation)
        }
        if (
          !edited.current.darkMode &&
          typeof preferences.modoOscuro === 'boolean'
        ) {
          setDarkMode(preferences.modoOscuro)
        }
        if (
          !edited.current.notification &&
          typeof preferences.notificaciones === 'boolean'
        ) {
          setNotification(preferences.notificaciones)
        }
      })
    return () => {
      active = false
    }
  }, [userId])

  return (
    <PreferencesContext.Provider
      value={{
        motivationPreference,
        darkModePreference,
        notificationPreference,
        setMotivationPreference: action => {
          edited.current.motivation = true
          setMotivation(action)
        },
        setDarkModePreference: action => {
          edited.current.darkMode = true
          setDarkMode(action)
        },
        setNotificationPreference: action => {
          edited.current.notification = true
          setNotification(action)
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
