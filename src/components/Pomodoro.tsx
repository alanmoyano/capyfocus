import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
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

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-4xl'>Timer!</h1>

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
        <Confetti effectCount={1} />
      )}

      <p>Pomodoro count: {Math.floor(pomodoroCount.current)}</p>
    </div>
  )
}
