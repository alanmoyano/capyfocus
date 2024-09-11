import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { useLocation } from 'wouter'
import { useObjetivos } from './ObjetivosContext'
import { Star, NotebookPen, Moon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
//import { navigationMenuTriggerStyle } from './ui/navigit pull gation-menu'

//import Confetti from 'react-confetti-boom'

type Mode = 'Sesión' | 'Descanso'
type Accion = 'Estudiar' | 'Descansar'

function addZeroIfNeeded(value: number) {
  return value.toString().padStart(2, '0')
}

function formatTime(time: number) {
  const hours = Math.floor(time / 3600); // Calcula las horas
  const minutes = Math.floor((time % 3600) / 60); // Calcula los minutos restantes
  const remainingSeconds = time % 60; // Calcula los segundos restantes

  if (hours > 0) {
    return `${addZeroIfNeeded(hours)}:${addZeroIfNeeded(minutes)}:${addZeroIfNeeded(remainingSeconds)}`;
  } else {
    return `${addZeroIfNeeded(minutes)}:${addZeroIfNeeded(remainingSeconds)}`;
  }
}

export function ActualTimer({ time, mode }: { time: number; mode: Mode }) {
  return (
    <>
      <h2 className='text-xl font-semibold'>{mode}</h2>

      <span className='text-lg'>Tiempo: {formatTime(time)}</span>
    </>
  )
}

export default function Timer() {
  const [Sessioncountup, setSessionCountup] = useState(0)
  const [Breakcountup, setBreakCountup] = useState(0)
  const [isActive, setIsActive] = useState<boolean | null>(true)
  const [mode, setMode] = useState<Mode>('Sesión')
  const timer = useRef<NodeJS.Timeout>()

  function finalizarSesion() {
    clearInterval(timer.current)
    console.log(`Has estudiado durante ${formatTime(Sessioncountup)} `)
    console.log(`Has descansado durante ${formatTime(Breakcountup)}`)
    setBreakCountup(0)
    setSessionCountup(0)
  }

  // @ts-expect-error vamos a usar la descripción después, no te enojes typescript!!! 🥺
  const [description, setDescription] = useState<Accion>('Estudiar')

  useEffect(() => {
    if (!isActive) {
      setMode('Descanso')
      clearInterval(timer.current)
      timer.current = setInterval(() => {
        setBreakCountup(prev => prev + 1)
      }, 1000)
    } else {
      setMode('Sesión')
      timer.current = setInterval(() => {
        setSessionCountup(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer.current)
  }, [isActive, mode])

  /* Esto es para que los botones si los tocas mas de una vez no hagan nada */
  const handleToggle = (value: boolean) => {
    if (isActive !== value) {
      setIsActive(value) // Cambia el estado si no está ya activo
    }
  }

  // useEffect(() => {
  //   setCountdown(mode === 'Session' ? sessionSeconds : breakSeconds)
  // }, [mode, sessionSeconds, breakSeconds])

  const [, setLocation] = useLocation()

  const [lastCheckedObj, setLastCheckedObj] = useState<number | null>(null)
  const { objetivos, setObjetivos, objetivosFav, setTiempo, tiempo } =
    useObjetivos()
  const [marked, setMarked] = useState<string[]>([])

  const handleAccept = () => {
    setLocation('/')
    setObjetivos(prevObjetivos =>
      prevObjetivos.filter(obj => !marked.includes(obj))
    )
  }

  const handleCheckbox = (objetivo: string, key: number) => {
    if (marked.includes(objetivo)) {
      // Esto sirve para no poder desmarcar los objetivos
      return
    }
    setMarked([...marked, objetivo])
    /*console.log('Checkbox activado para objetivo:', objetivo, ', Key:', key, 'Tiempo:', Sessioncountup)
    if (lastCheckedObj !==null) {console.log('lastCheckedKey:', lastCheckedObj, 'tiempo: ',  Math.abs(tiempo[objetivos[lastCheckedObj]]), 'Resta:', Sessioncountup - tiempo[objetivos[lastCheckedObj]])}
    */
    if (lastCheckedObj === null) {
      setTiempo(prev => ({ ...prev, [objetivo]: Sessioncountup }))
    } else {
      const tiempoObjAnterior = tiempo[objetivos[lastCheckedObj]]
      if (tiempoObjAnterior) {
        setTiempo(prev => ({
          ...prev,
          [objetivo]: Sessioncountup - tiempoObjAnterior
        }))
      }
    }
    setLastCheckedObj(key)
  }

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyMetro!</h1>

      <div className='grid grid-cols-2 gap-4'>
        {/* Columna 1:  */}
        <div className='col-span-1 p-4'>
          <img src='/idle.gif' />
        </div>

        {/* Columna 2:*/}
        <div className='col-span-1 mt-32 grid grid-cols-2 gap-4'>
          <div className='text-black'>
            <div className='rounded-xl bg-accent/90 p-4'>
              <ActualTimer mode={'Sesión'} time={Sessioncountup} />
            </div>

            <div className='mt-16'>
              <ToggleGroup
                type='single'
                className='rounded-xl bg-primary/90 p-2'
                onValueChange={value => setDescription(value as Accion)}
              >
                <ToggleGroupItem
                  value='Estudiar'
                  className={`flex items-center justify-center gap-1 ${isActive ? 'bg-muted text-muted-foreground' : 'bg-primary/90'}`}
                  onClick={() => handleToggle(true)}
                >
                  <NotebookPen />
                  Estudiar
                </ToggleGroupItem>
                <ToggleGroupItem
                  value='Descansar'
                  className={`flex items-center justify-center gap-1 ${isActive ? 'bg-primary/90' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => {
                    handleToggle(false)
                  }}
                >
                  <Moon />
                  Descansar
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className='text-black'>
            <div className='rounded-xl bg-accent/90 p-4'>
              <ActualTimer mode={'Descanso'} time={Breakcountup} />
            </div>
            <div className='mt-16 rounded-xl bg-primary/90 p-4'>
              <h1 className='text-xl'>Objetivos de la sesión</h1>
              <ul className='list-inside list-disc space-y-2 text-black'>
                {objetivos.map((objetivo, key) => (
                  <li key={key} className='flex items-center space-x-2'>
                    <span>
                      <Checkbox
                        checked={marked.includes(objetivo)}
                        onClick={() => handleCheckbox(objetivo, key)}
                        className='mr-2'
                      />
                      {objetivo}
                    </span>
                    {objetivosFav.includes(objetivo) && (
                      <Star size={20} style={{ color: '#ffbc05' }} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex w-full justify-end'>
              <Button
                className='mt-6'
                variant={'destructive'}
                onClick={() => {
                  finalizarSesion()
                }}
              >
                Finalizar Sesion
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='ml-32'>
        <Button className='flex flex-col' onClick={handleAccept}>
          Volver
        </Button>
      </div>

      {/* {pomodoroCount.current >= pomodoroSessions && (
        <Confetti effectCount={1} />
        )} */}
    </>
  )
}
