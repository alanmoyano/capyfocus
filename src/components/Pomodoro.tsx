import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { useLocation } from 'wouter'
import { useObjetivos } from './contexts/ObjetivosContext'
import { Star, Play, Pause } from 'lucide-react'
import CapySound from '../assets/Sonido_de_caripincho.mp3'
import Confetti from 'react-confetti-boom'
import useSound from 'use-sound'
import { useMusic } from './contexts/MusicContext'
import { useMotivation } from './contexts/MotivationContext'
import { useSesion } from './contexts/SesionContext'
import DialogoChicho from './ComponentesEspecifico/DialogoChicho'
import AnimacionChicho from './ComponentesEspecifico/AnimacionChicho'
import { Volume2, VolumeOff } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import CountdownStudy from './ComponentesEspecifico/CountDown/CountdownStudy'
import CountdownBreak from './ComponentesEspecifico/CountDown/CountdownBreak'

type Mode = 'Estudiando' | 'Descansando'

function addZeroIfNeeded(value: number) {
  return value.toString().padStart(2, '0')
}

export function ActualTimer({ time, mode }: { time: number; mode: Mode }) {
  return (
    <>
      <h2 className='flex justify-center text-xl'>
        <span className='font-semibold'>{mode}</span>
      </h2>
      <p className='text-lg'> </p>
      <span className='flex items-center justify-center text-3xl font-bold'>
        {formatTime(time)}
      </span>
    </>
  )
}

type Pomodoro = {
  tiempoEstudio: number
  tiempoDescanso: number
}

export default function Pomodoro() {
  const [sessionSeconds, setSessionSeconds] = useState(25 * 60)
  const [breakSeconds, setBreakSeconds] = useState(5 * 60)
  const [objCumplidos, setObjCumplidos] = useState(0)
  const [countdown, setCountdown] = useState(sessionSeconds)
  const [isActive, setIsActive] = useState(false) //Aca se cambia el estado de play y pause
  const [isSetted, setIsSetted] = useState(false) //Aca se cambia el estado de si estan los datos cargados
  const [mode, setMode] = useState<Mode>('Estudiando')
  const timer = useRef<NodeJS.Timeout>()
  const pomodoroCount = useRef(0)
  const [pomodorosRealizados, setPomodorosRealizados] = useState<Pomodoro[]>([])
  const [capySound] = useSound(CapySound)
  const [ObjStudyTime, setObjStudyTime] = useState(0)
  const { selectedMusic } = useMusic()
  const { motivationType } = useMotivation()
  const [sessionStart, setSessionStart] = useState(false)
  const [volumen, setVolumen] = useState(true)
  const [boom, setBoom] = useState(false)
  const {
    objetivos,
    setObjetivos,
    objetivosFav,
    setTiempo,
    tiempo,
    setTiempoSesion,
    setObjetivosPend,
  } = useObjetivos()
  const [marked, setMarked] = useState<string[]>([])
  const [, setLocation] = useLocation()
  const {
    setTiempoTotal,
    setAcumuladorTiempoPausa,
    setCantidadPausas,
    tiempoTotal,
  } = useSesion()

  const finalizarSesion = () => {
    clearInterval(timer.current)

    if (countdown > 0 && mode === 'Estudiando') {
      setTiempoTotal(prev => (prev -= countdown))
      setAcumuladorTiempoPausa(prev => (prev -= breakSeconds))
    } else if (countdown > 0 && mode === 'Descansando') {
      setAcumuladorTiempoPausa(prev => (prev -= countdown))
    }

    objetivos.forEach(objetivo => {
      if (!tiempo[objetivo]) {
        setTiempo(prev => ({
          ...prev,
          [objetivo]: 0,
        }))
      }
    })
    setLocation('/capyEstadisticas?period=sesion')
  }
  const volumenHandler = () => {
    setVolumen(!volumen)
  }
  //Revisar el funcionamiento de esta cosa!!!

  // useEffect(() => {
  //   const worker = new Worker('worker.js')

  //   worker.postMessage('start')
  //   worker.onmessage = () => console.log('hola!')

  //   return () => worker.terminate()
  // }, [])

  useEffect(() => {
    if (!isActive) return () => clearInterval(timer.current)

    if (countdown >= 0) {
      timer.current = setInterval(() => {
        //console.log(`Hola! actualizando, tiempo: ${formatTime(countdown)}`)
        setCountdown(prev => prev - 1)
        if (mode === 'Estudiando') {
          setObjStudyTime(prev => prev + 1)
        }
      }, 1000)
    } else {
      if (volumen) {
        capySound()
      }
      clearInterval(timer.current)
      if (mode === 'Estudiando') {
        setCountdown(breakSeconds)
        setSessionSeconds(
          pomodorosRealizados[pomodorosRealizados.length - 1].tiempoEstudio
        )
        setMode('Descansando')
        setIsActive(false)
        setBoom(false) //para el confetti
        pomodoroCount.current += 0.5
      } else {
        setBreakSeconds(
          pomodorosRealizados[pomodorosRealizados.length - 1].tiempoDescanso
        )
        setMode('Estudiando')
        setIsActive(prev => !prev)
        setIsSetted(prev => !prev)
        pomodoroCount.current += 0.5
        setBoom(true)
      }
    }

    if (objetivos.length === objCumplidos && objetivos.length > 0) {
      finalizarSesion()
    }

    return () => clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isActive,
    countdown,
    sessionSeconds,
    breakSeconds,
    mode,
    capySound,
    objCumplidos,
  ])

  useEffect(() => {
    setCountdown(mode === 'Estudiando' ? sessionSeconds : breakSeconds)
  }, [mode, sessionSeconds, breakSeconds, isSetted])
  /* 
  const handleAccept = () => {
    setLocation('/')
    setObjetivos(prevObjetivos =>
      prevObjetivos.filter(obj => !marked.includes(obj))
    )
  } */

  const handleCheckbox = (objetivo: string) => {
    if (marked.includes(objetivo)) {
      return
    }
    setMarked([...marked, objetivo])
    setObjCumplidos(prev => prev + 1)
    setObjetivosPend(prevObjetivosPend =>
      prevObjetivosPend.filter(item => item !== objetivo)
    )

    setTiempo(prev => ({
      ...prev,
      [objetivo]: ObjStudyTime,
    }))
    setTiempoSesion(prev => ({ ...prev, [objetivo]: tiempoTotal - countdown }))

    setObjStudyTime(0)
  }

  const handleSetted = (Sessioncountup: number, Breakcountup: number) => {
    if (!sessionStart) {
      setAcumuladorTiempoPausa(0)
      setTiempoTotal(0)
      setCantidadPausas(0)
      setSessionStart(true)
    }

    setIsSetted(prev => !prev)
    setIsActive(prev => !prev)

    const tiempoEstudio = Sessioncountup
    const tiempoDescanso = Breakcountup

    const pomodoro: Pomodoro = {
      tiempoEstudio: tiempoEstudio,
      tiempoDescanso: tiempoDescanso,
    }
    if (pomodorosRealizados.length === 0) {
      setPomodorosRealizados([pomodoro])
    } else {
      setPomodorosRealizados([...pomodorosRealizados, pomodoro])
    }
    setTiempoTotal(prev => (prev += tiempoEstudio))
    setAcumuladorTiempoPausa(prev => (prev += tiempoDescanso))
  }

  const handlePause = (value: boolean) => {
    if (!value) {
      setCantidadPausas(prev => (prev += 1))
    }
    setIsActive(value)
  }

  useEffect(() => {
    setObjetivosPend(objetivos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Esto es para subir y bajar rapido los minutos de estudio, lo hice con la maldad de subir y bajar rapido
  //los minutos de estudio, y los minutos de descanso se suben de a uno wuajajajaj.
  const [intervalId, setIntervalId] = useState(null) // Para guardar el intervalo

  const startAdjustingTime = (change: number) => {
    // Inicia el ajuste de tiempo al mantener presionado
    const id = setInterval(() => {
      setSessionSeconds(prev => {
        const newValue = prev + change
        return newValue > 3 ? newValue : 3 // Evita bajar de 60 segundos
      })
    }, 150) //Es lo rapido que cambia
    //@ts-expect-error 2345 Aca no hace falta typescript
    setIntervalId(id)
  }

  const stopAdjustingTime = () => {
    //@ts-expect-error 2769 Aca no hace falta typescript
    clearInterval(intervalId)
    setIntervalId(null)
  }

  return (
    <>
      <h1 className='mt-4 text-center text-4xl font-bold'>Capydoro!</h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/*  Columna 1 */}
        <div className='col-span-1 p-4'>
          <div className='mt-4 px-4'>
            <DialogoChicho motivation={motivationType} />
            <AnimacionChicho motivation={motivationType} />
            <div className='mb-4 rounded-lg bg-primary p-2 text-center'>
              Tu tipo de motivación es:{' '}
              <span className='font-semibold'>{motivationType}</span>
            </div>
          </div>
          <div className='w-full'>
            {selectedMusic && (
              <iframe
                className='h-40 w-full rounded-lg'
                src={`https://open.spotify.com/embed/playlist/${selectedMusic.spotifyUri}?utm_source=generator`}
                frameBorder='0'
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='eager'
              ></iframe>
            )}
          </div>
        </div>
        {/* Columna 2  */}
        <div className='col-span-1'>
          {/* Seteadores de tiempo */}
          {!isSetted && (
            <>
              <p className='mt-8 text-center text-xl font-semibold'>
                Coloca el tiempo a estudiar y descansar
              </p>
              <div className='flex flex-col justify-between gap-4 md:flex-row'>
                <div className='w-full p-4 text-center md:w-1/2'>
                  <div className='mt-2 items-center justify-center gap-2 rounded-xl bg-secondary/60 p-2 font-semibold'>
                    <h3>Minutos de Estudio</h3>
                    <div className='flex items-center justify-center gap-4 text-lg'>
                      <Button
                        onMouseDown={() => startAdjustingTime(-60)} //-60
                        onMouseUp={stopAdjustingTime}
                        onMouseLeave={stopAdjustingTime}
                        onClick={() => setSessionSeconds(prev => prev - 1497)} //-60
                        disabled={sessionSeconds <= 60 || isActive || isSetted}
                      >
                        -
                      </Button>
                      <p>{sessionSeconds / 60}</p>
                      <Button
                        onMouseDown={() => startAdjustingTime(60)}
                        onClick={() => setSessionSeconds(prev => prev - 60)}
                        onMouseUp={stopAdjustingTime}
                        onMouseLeave={stopAdjustingTime}
                        disabled={isActive || isSetted}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='w-full p-4 text-center md:w-1/2'>
                  <div className='mt-2 items-center justify-center gap-2 rounded-xl bg-secondary/60 p-2 font-semibold'>
                    <h3>Minutos de descanso</h3>
                    <div className='flex items-center justify-center gap-4 text-lg'>
                      <Button
                        onClick={() => setBreakSeconds(prev => prev - 298)} //60
                        disabled={breakSeconds <= 60 || isActive || isSetted}
                      >
                        -
                      </Button>
                      <p>{breakSeconds / 60}</p>
                      <Button
                        onClick={() => setBreakSeconds(prev => prev + 60)}
                        disabled={isActive || isSetted}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}


          {isSetted && (
            <>
              <div className='px-4'>
                <div className='mt-16 flex justify-center'>
                  {mode === 'Estudiando' ? (
                    <div>
                      <CountdownStudy
                        studyTime={sessionSeconds}
                        play={isActive}
                        num={pomodoroCount.current}
                      />
                    </div>
                  ) : (
                    <div>
                      <CountdownBreak
                        breakTime={breakSeconds}
                        play={isActive}
                        num={pomodoroCount.current}
                      />
                    </div>
                  )}

                  {/*                   <span className='rounded-xl bg-secondary/90 px-12 py-4 text-center text-black'>
                    <ActualTimer mode={mode} time={countdown} />
                    <p className='text-2xl font-bold text-black'>
                    Capydoros: {Math.floor(pomodoroCount.current)}
                    </p>
                    </span> */}
                </div>
              </div>
            </>
          )}

          {boom && (
            <div className='w-1/2 justify-start'>
              <Confetti mode='boom' particleCount={250} />
            </div>
          )}

          {/* Boton de inicio */}
          <div className='mt-4 flex justify-center'>
            {!isSetted ? (
              <Button
                onClick={() => handleSetted(sessionSeconds, breakSeconds)}
              >
                Empezar
              </Button>
            ) : (
              <Button
                className='flex items-center justify-center rounded-full p-6'
                onClick={() => handlePause(!isActive)}
              >
                {isActive ? <Pause /> : <Play />}
              </Button>
            )}
          </div>
          {/* Volumen */}
          <div className='w-full'>
            <div className='flex justify-end'>
              <Button onClick={volumenHandler} variant={'ghost'} size={'icon'}>
                {volumen ? <Volume2 /> : <VolumeOff />}
              </Button>
            </div>
          </div>
          {/* Objetivos: */}
          <div className='mt-4 rounded-xl bg-accent/90 p-4'>
            <h1 className='text-xl'>Objetivos de la sesión:</h1>
            <ul className='list-inside list-disc space-y-2 text-black'>
              {objetivos.map((objetivo, key) => (
                <li key={key} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={marked.includes(objetivo)}
                    disabled={mode === 'Descansando' || !isActive}
                    onClick={() => handleCheckbox(objetivo)}
                    className='mr-2'
                  />
                  <span>{objetivo}</span>
                  {objetivosFav.includes(objetivo) && (
                    <Star size={20} style={{ color: '#ffbc05' }} />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className='container mt-4 flex flex-col justify-end md:flex-row'>
            <Button variant={'destructive'} onClick={finalizarSesion}>
              Finalizar Sesion
            </Button>
          </div>
          <div className='container mt-8 w-full'></div>
        </div>
      </div>
    </>
  )
}
