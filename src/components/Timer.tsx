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
      <h2 className='text-xl font-semibold'>
        {mode}
      </h2>

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

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyMetro!</h1>
      <section className='flex flex-col  md:flex-row'>
        <div className='m-auto'>
        <img src='/idle.gif' />
        </div>
      <div className='container'>

        <section className='flex  p-10  mt-20'>
          <div className='container'>
            <ActualTimer mode={'Session'} time={Sessioncountup} />
            <div className='mb-32'></div>
        <Button
          onClick={() => {
            setIsActive(prev => !prev)
          }}
          >
          {isActive ? 'Descansar' : 'Estudiar'}
        </Button>
          </div>
          <div className='container d-flex '>
            <ActualTimer mode={'Break'} time={Breakcountup} />
            <div className='mb-32'></div>
          <Button
            className='flex flex-col'
            onClick={() => {
              finalizarSesion()
            }}
            >
            Finalizar Sesion
          </Button>
          </div>
        </section>
            </div>

      </section>
        <div className='row flex flex-col items-center justify-center'></div>

     

      {/* {pomodoroCount.current >= pomodoroSessions && (
        <Confetti effectCount={1} />
        )} */}
    </>
  )
}
