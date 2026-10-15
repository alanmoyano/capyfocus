import { useRef, useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

export type Motivation = '1' | '2'

export default function Switchers() {
  const {
    motivationPreference,
    darkModePreference,
    notificationPreference,
    setMotivationPreference,
    setDarkModePreference,
  } = usePreferences()
  const { session } = useSession()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const active = useRef(false)
  const pending = useRef(false)

  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])

  async function savePreference(value: boolean | Motivation) {
    if (!session || pending.current) return
    pending.current = true
    setSaving(true)
    setError('')
    try {
      const update =
        typeof value === 'boolean'
          ? { modoOscuro: value }
          : { motivacionFavorita: value }
      const { error } = await supabase
        .from('Usuarios')
        .update(update)
        .eq('id', session.user.id)
      if (error) throw error
      if (!active.current) return
      if (typeof value === 'boolean') setDarkModePreference(value)
      else setMotivationPreference(value)
    } catch {
      if (active.current)
        setError('No se pudo guardar la preferencia. Intenta de nuevo.')
    } finally {
      pending.current = false
      if (active.current) setSaving(false)
    }
  }

  return (
    <div className='flex select-none flex-col gap-2'>
      <div className='flex items-center justify-between gap-2'>
        <Label htmlFor='default-dark-mode'>
          Modo oscuro predeterminado: {darkModePreference ? 'Sí' : 'No'}
        </Label>
        <Switch
          id='default-dark-mode'
          checked={darkModePreference}
          disabled={saving || !session}
          onCheckedChange={value => {
            void savePreference(value)
          }}
        />
      </div>
      <div className='flex items-center justify-between gap-2'>
        <Label htmlFor='notifications'>Recibir notificaciones</Label>
        <Switch
          id='notifications'
          checked={notificationPreference}
          disabled
          aria-describedby='notifications-unavailable'
        />
      </div>
      <p
        id='notifications-unavailable'
        className='text-sm text-muted-foreground'
      >
        No disponible. Capyfocus todavía no envía notificaciones.
      </p>
      <div className='flex items-center justify-between gap-2'>
        <Label htmlFor='favorite-motivation'>Motivación favorita</Label>
        <Select
          value={motivationPreference}
          disabled={saving || !session}
          onValueChange={value => {
            if (value === '1' || value === '2') void savePreference(value)
          }}
        >
          <SelectTrigger id='favorite-motivation' className='max-w-40'>
            <SelectValue placeholder='Selecciona tu motivación favorita' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1'>Positiva</SelectItem>
            <SelectItem value='2'>Pasivo agresiva</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p role='status' className='text-sm'>
        {error}
      </p>
    </div>
  )
}
