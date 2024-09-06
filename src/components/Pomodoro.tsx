import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { useLocation } from 'wouter'
import { useObjetivos } from './ObjetivosContext'
import { Star } from 'lucide-react'
import Confetti from 'react-confetti-boom'


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
      <h2 className='text-xl'>
        Mode: <span className='font-semibold'>{mode}</span>
      </h2>
      {mode === 'Break' && <p>A descansar!</p>}
      <p className='text-lg'>Time left: {formatTime(time)}</p>
    </>
  )
}

export default function Pomodoro({
  pomodoroSessions = 1
}: {
  pomodoroSessions?: number
}) {
  const [sessionSeconds, setSessionSeconds] = useState(25 * 60)
  const [breakSeconds, setBreakSeconds] = useState(5 * 60)
  const [countdown, setCountdown] = useState(sessionSeconds)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<Mode>('Session')
  const timer = useRef<NodeJS.Timeout>()
  const pomodoroCount = useRef(0)

  useEffect(() => {
    if (!isActive) return () => clearInterval(timer.current)
    if (pomodoroCount.current >= pomodoroSessions) {
      return () => clearInterval(timer.current)
    }

    if (countdown >= 0) {
      timer.current = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else {
      clearInterval(timer.current)
      setCountdown(mode === 'Session' ? breakSeconds : sessionSeconds)
      setMode(prev => (prev === 'Session' ? 'Break' : 'Session'))
      pomodoroCount.current += 0.5
    }

    return () => clearInterval(timer.current)
  }, [
    isActive,
    countdown,
    sessionSeconds,
    breakSeconds,
    mode,
    pomodoroSessions
  ])

  useEffect(() => {
    setCountdown(mode === 'Session' ? sessionSeconds : breakSeconds)
  }, [mode, sessionSeconds, breakSeconds])

  const [, setLocation] = useLocation()
  const handleAccept = () => {
    setLocation('/')
  }

  const {objetivos, objetivosFav } = useObjetivos()


  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold'>Capydoro</h1>

      <ActualTimer mode={mode} time={countdown} />

      <Button onClick={() => setIsActive(prev => !prev)}>
        {isActive ? 'Desactivar' : 'Activar'}
      </Button>

      <div className='m-4 flex gap-4'>
        <div className='flex items-center justify-center gap-2 rounded-xl bg-secondary/25 p-2'>
          <Button
            onClick={() => setSessionSeconds(prev => prev - 60)}
            disabled={sessionSeconds <= 60}
          >
            -
          </Button>
          <p>Session minutes: {sessionSeconds / 60}</p>
          <Button onClick={() => setSessionSeconds(prev => prev + 60)}>
            +
          </Button>
        </div>

        <div className='flex items-center justify-center gap-2 rounded-xl bg-secondary/25 p-2'>
          <Button
            onClick={() => setBreakSeconds(prev => prev - 60)}
            disabled={breakSeconds <= 60}
          >
            -
          </Button>
          <p>Break minutes: {breakSeconds / 60}</p>
          <Button onClick={() => setBreakSeconds(prev => prev + 60)}>+</Button>
        </div>
      </div>
      
      {pomodoroCount.current >= pomodoroSessions && (
        <Confetti mode='boom' particleCount={150} />
      )}

      {/* <Confetti mode='boom' particleCount={150} /> */}

      <p>Pomodoro count: {Math.floor(pomodoroCount.current)}</p>

      <div className='mt-4 rounded-xl bg-secondary/60 p-4'>
        <h1 className='text-xl '>Objetivos de la sesión</h1>
        <ul className='list-inside list-disc space-y-2 text-black'>
          {objetivos.map((objetivo, key) => (
            <li key={key} className='flex space-x-2 items-center'>
              <input type='checkbox' id={`checkbox-${key}`} className='mr-2'/>
              <label htmlFor={`checkbox-${key}`} className='flex-1'>{objetivo}</label>
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
    </div>

    
    
  )
}
