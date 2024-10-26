import { useState } from 'react'
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

//TODO: Cambiar los colores de los switchers en modo oscuro

export default function Switchers() {
  /* Maneja los Switch */
  const [isPositive, setIsPositive] = useState(true)
  const [isDark, setIsDark] = useState(true)
  const [isNotificaction, setIsNotificaction] = useState(true)
  const { session } = useSession()

  const handleToggle = () => {
    setIsPositive(!isPositive)
  }
  const handleToggleDark = () => {
    setIsDark(!isDark)
  }
  const handleToggleNotification = () => {
    setIsNotificaction(!isNotificaction)
  }

  function handleSelectMotivation() {
    // TODO: acá iría lo de la motivación, en la base creé el campo motivacionFavorita
    // sería algo así:
    // supabase
    //   .from('Usuarios')
    //   .update({ motivacionFavorita: '1' }) // 1 es positiva, 2 es agresiva
    //   .eq('id', session?.user.id)

    console.log('Seleccionaste una motivación')
  }

  return (
    <div className='select-none'>
      <div className='mt-2 flex items-center justify-between'>
        <Label className='text-left'>
          Modo oscuro predeterminado: {isDark ? 'Sí' : 'No'}
        </Label>
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
        <Label className='text-left'>
          Recibir notificaciones: {isNotificaction ? 'Sí' : 'No'}
        </Label>

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
        <Label className='text-left'>Motivación favorita:</Label>

        <Select defaultValue='positiva' onValueChange={handleSelectMotivation}>
          <SelectTrigger className='max-w-32'>
            <SelectValue placeholder='Selecciona tu motivación favorita' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='positiva'>Positiva</SelectItem>
            <SelectItem value='agresiva'>Agresiva</SelectItem>
          </SelectContent>
        </Select>

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
    </div>
  )
}
