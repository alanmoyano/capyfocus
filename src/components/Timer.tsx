import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
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
      <h2 className='text-xl'>
        Chronometer for <span className='font-semibold'>{mode}</span>
      </h2>

      <p className='text-lg'>Time passed: {formatTime(time)}</p>
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

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl'>CapyMetro!</h1>
        <div className='row flex flex-col items-center justify-center'>
            <ActualTimer mode={'Session'} time={Sessioncountup} />
            <ActualTimer mode={'Break'} time={Breakcountup} />
        </div>

        <Button
          onClick={() => {
            setIsActive(prev => !prev)
          }}
        >
          {isActive ? 'Descansar' : 'Estudiar'}
        </Button>

        <br />

        <div>
          <Button
            className='flex flex-col'
            onClick={() => {
              finalizarSesion()
            }}
          >
            Finalizar Sesion
          </Button>
        </div>

        {/* {pomodoroCount.current >= pomodoroSessions && (
        <Confetti effectCount={1} />
      )} */}
      </div>
    </>
  )
}
