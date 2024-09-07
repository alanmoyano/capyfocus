import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { useLocation } from 'wouter'
import { useObjetivos } from './ObjetivosContext'
import { Star } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
//import Confetti from 'react-confetti-boom'

type Mode = 'Session' | 'Break'

function addZeroIfNeeded(value: number) {
  return value.toString().padStart(2, '0')
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${addZeroIfNeeded(minutes)}:${addZeroIfNeeded(remainingSeconds)}`
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
  const [isActive, setIsActive] = useState(true)
  const [mode, setMode] = useState<Mode>('Session')
  const timer = useRef<NodeJS.Timeout>()

  function finalizarSesion() {
    clearInterval(timer.current)
    console.log(`Has estudiado durante ${formatTime(Sessioncountup)} `)
    console.log(`Has descansado durante ${formatTime(Breakcountup)}`)
    setBreakCountup(0)
    setSessionCountup(0)
  }

  useEffect(() => {
    if (!isActive) {
      setMode('Break')
      clearInterval(timer.current)
      timer.current = setInterval(() => {
        setBreakCountup(prev => prev + 1)
      }, 1000)
    } else {
      setMode('Session')
      timer.current = setInterval(() => {
        setSessionCountup(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer.current)
  }, [isActive, mode])

  // useEffect(() => {
  //   setCountdown(mode === 'Session' ? sessionSeconds : breakSeconds)
  // }, [mode, sessionSeconds, breakSeconds])
  const { objetivos, objetivosFav } = useObjetivos()

  const [, setLocation] = useLocation()

  const handleAccept = () => {
    setLocation('/')
    // setObjetivos([])
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
              <ActualTimer mode={'Session'} time={Sessioncountup} />
            </div>
            <div className='ml-10 mt-16'>
              <Button
                variant={'accent'}
                className=' '
                onClick={() => {
                  setIsActive(prev => !prev)
                }}
              >
                {isActive ? 'Descansar' : 'Estudiar'}
              </Button>
            </div>
          </div>

          <div className='text-black'>
            <div className='rounded-xl bg-accent/90 p-4'>
              <ActualTimer mode={'Break'} time={Breakcountup} />
            </div>
            <div className='mt-16'>
              <Button
                className='flex flex-col'
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
      <div className='mt-4 rounded-xl bg-secondary/60 p-4'>
        <h1 className='text-xl'>Objetivos de la sesión</h1>
        <ul className='list-inside list-disc space-y-2 text-black'>
          {objetivos.map((objetivo, key) => (
            <li key={key} className='flex items-center space-x-2'>
              <span>
                <Checkbox className='mr-2' />
                {objetivo}
              </span>
              {objetivosFav.includes(objetivo) && (
                <Star size={20} style={{ color: '#ffbc05' }} />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
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
