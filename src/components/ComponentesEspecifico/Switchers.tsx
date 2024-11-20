import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { supabase } from '../supabase/client'
import { useSession } from '../contexts/SessionContext'
import { usePreferences } from '../contexts/PreferencesContext'
import { useTheme } from '../contexts/ThemeContext'

//TODO: Cambiar los colores de los switchers en modo oscuro

export type Motivation = '1' | '2'

export default function Switchers() {
  /* Maneja los Switch */

  const {
    motivationPreference,
    darkModePreference,
    notificationPreference,
    setMotivationPreference,
    setDarkModePreference,
    setNotificationPreference,
  } = usePreferences()

  const [motivation, setMotivation] = useState<Motivation>(motivationPreference) // 1 es positiva, 2 es agresiva
  const [isDark, setIsDark] = useState(darkModePreference)
  const [isNotificaction, setIsNotificaction] = useState(notificationPreference)
  const { session } = useSession()
  const { setTheme } = useTheme()

  const handleToggleDark = () => {
    if (!session) return

    supabase
      .from('Usuarios')
      .update({ modoOscuro: !isDark })
      .eq('id', session.user.id)
      .select()
      .then(({ data, error }) => {
        if (error) console.error(error)
        console.log(data)
      })

    setIsDark(prev => !prev)
    setDarkModePreference(prev => !prev)
    setTheme(!isDark ? 'dark' : 'light')
  }

  const handleToggleNotification = () => {
    if (!session) return

    supabase
      .from('Usuarios')
      .update({ notificaciones: !isNotificaction })
      .eq('id', session.user.id)
      .select()
      .then(({ data, error }) => {
        if (error) console.error(error)
        console.log(data)
      })

    setIsNotificaction(prev => !prev)
    setNotificationPreference(prev => !prev)
  }

  function handleSelectMotivation(value: '1' | '2') {
    if (!session) return

    supabase
      .from('Usuarios')
      .update({ motivacionFavorita: value })
      .eq('id', session.user.id)
      .select()
      .then(({ data, error }) => {
        if (error) console.error(error)
        console.log(data)
      })

    setMotivation(value)
    setMotivationPreference(value)
  }

  useEffect(() => {
    if (!session) return

    supabase
      .from('Usuarios')
      .select('motivacionFavorita,modoOscuro,notificaciones')
      .eq('id', session.user.id)
      .then(({ data, error }) => {
        if (error) console.error(error)

        console.log(data)
        if (!data) return

        setMotivation(String(data[0].motivacionFavorita) as Motivation)
        setMotivationPreference(
          String(data[0].motivacionFavorita) as Motivation
        )

        setIsDark(data[0].modoOscuro as boolean)
        setDarkModePreference(data[0].modoOscuro as boolean)

        setIsNotificaction(data[0].notificaciones as boolean)
        setNotificationPreference(data[0].notificaciones as boolean)
      })
  }, [session])

  return (
    <div className='select-none'>
      <div className='mt-2 flex items-center justify-between'>
        <p className='text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
          Modo oscuro predeterminado: {isDark ? 'Sí' : 'No'}
        </p>
        {/* Switch Modo oscuro */}
        <div
          onClick={handleToggleDark}
          className={`${
            isDark ? 'bg-[#ac99eb]' : 'bg-[#433323]'
          } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full`}
        >
          <span
            className={`${
              isDark ? 'translate-x-5' : 'translate-x-1'
            } inline-block h-5 w-5 transform rounded-full bg-[#f0ece9] transition dark:bg-[#110d09]`}
          />
        </div>
      </div>

      {/* Notificaciones */}
      <div className='mt-2 flex items-center justify-between'>
        <p className='text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
          Recibir notificaciones: {isNotificaction ? 'Sí' : 'No'}
        </p>

        <div
          onClick={handleToggleNotification}
          className={`${
            isNotificaction ? 'bg-[#728fe6]' : 'bg-[#433323]'
          } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full`}
        >
          <span
            className={`${
              isNotificaction ? 'translate-x-5' : 'translate-x-1'
            } inline-block h-5 w-5 transform rounded-full bg-[#f0ece9] transition dark:bg-[#110d09]`}
          />
        </div>
      </div>

      {/* Motivación */}
      <div className='mt-2 flex items-center justify-between'>
        <p className='text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
          Motivación favorita:
        </p>

        <Select
          defaultValue={motivation}
          onValueChange={handleSelectMotivation}
        >
          <SelectTrigger className='max-w-40'>
            <SelectValue placeholder='Selecciona tu motivación favorita' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1'>Positiva</SelectItem>
            <SelectItem value='2'>Pasivo agresiva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* <div
        onClick={handleToggle}
        className={`${
          isPositive ? 'bg-[#e78282]' : 'bg-[#433323]'
        } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full`}
      >
        <span
          className={`${
            isPositive ? 'translate-x-5' : 'translate-x-1'
          } inline-block h-5 w-5 transform rounded-full bg-[#f0ece9] transition dark:bg-[#110d09]`}
        />
      </div> */}
    </div>
  )
}
