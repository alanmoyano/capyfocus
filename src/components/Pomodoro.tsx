import {
  acumulateHoursInFavouriteObj,
  acumulateHoursInSelectedEvent,
  dateToTimetz,
  getSelectedMusic,
  saveSession,
  SesionAGuardar,
} from '@/constants/supportFunctions'
import usePomodoro from '@/hooks/usePomodoro'
import useTimer from '@/hooks/useTimer'
import { formatTime } from '@/lib/utils'
import {
  Pause,
  Play,
  SkipForward,
  Star,
  Volume2,
  VolumeOff,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Confetti from 'react-confetti-boom'
import useSound from 'use-sound'
import { useLocation } from 'wouter'
import CapySound from '../assets/Sonido_de_caripincho.mp3'
import AnimacionChicho from './ComponentesEspecifico/AnimacionChicho'
import CountdownBreak from './ComponentesEspecifico/CountDown/CountdownBreak'
import CountdownStudy from './ComponentesEspecifico/CountDown/CountdownStudy'
import DialogoChicho from './ComponentesEspecifico/DialogoChicho'
import { useEvents } from './contexts/EventsContext'
import { useMotivation } from './contexts/MotivationContext'
import { useMusic } from './contexts/MusicContext'
import { useObjetivos } from './contexts/ObjetivosContext'
import { useSesion } from './contexts/SesionContext'
import { useSession } from './contexts/SessionContext'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'

import { useInsignias } from '@/components/contexts/InsigniasContext'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'

//BUG: No anda bien el contador de tiempo, no cuenta el tiempo de estudio y descanso.
type Mode = 'Estudiando' | 'Descansando'

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
  const { insignias, reloadInsignias } = useInsignias()
  const [sessionSeconds, setSessionSeconds] = useState(25 * 60)
  const [breakSeconds, setBreakSeconds] = useState(5 * 60)
  const [objCumplidos, setObjCumplidos] = useState(0)
  const {
    time,
    startStudy,
    isStudying,
    isPaused,
    pauseStudy,
    resumeStudy,
    skipCurrent,
    stopStudy,
  } = usePomodoro()
  const [isActive, setIsActive] = useState(false) //Aca se cambia el estado de play y pause
  const [isSetted, setIsSetted] = useState(false) //Aca se cambia el estado de si estan los datos cargados
  const [mode, setMode] = useState<Mode>('Estudiando')
  const timer = useRef<NodeJS.Timeout>()
  const pomodoroCount = useRef(0)
  const [pomodorosRealizados, setPomodorosRealizados] = useState<Pomodoro[]>([])
  const [capySound] = useSound(CapySound)
  const { selectedMusic } = useMusic()
  const { motivationType } = useMotivation()
  const [sessionStart, setSessionStart] = useState(false)
  const [volumen, setVolumen] = useState(true)
  const [boom, setBoom] = useState(false)
  const { session } = useSession()
  const [InicioSesion, setInicioSesion] = useState<Date | null>(null)
  const { events, selectedEvent } = useEvents()
  const {
    studyTime: objStudyTime,
    startStudy: startObjTime,
    pauseStudy: pauseObjectiveTime,
    resetTimers: resetObjectiveTime,
  } = useTimer()
  const [timerObjectivesAcum, setTimerObjectivesAcum] = useState(0)

  const {
    objetivos,
    objetivosFav,
    setTiempo,
    tiempo,
    setTiempoSesion,
    setObjetivosPend,
    tiempoFavorito,
    setTiempoFavorito,
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

    let studyTime = 0
    pomodorosRealizados.forEach(
      pomodoro => (studyTime += pomodoro.tiempoEstudio)
    )

    if (time > 0 && mode === 'Estudiando' && isSetted) {
      studyTime -= time
      setTiempoTotal(prev => prev - time)
      setAcumuladorTiempoPausa(prev => prev - breakSeconds)
    } else if (time > 0 && mode === 'Descansando') {
      setAcumuladorTiempoPausa(prev => prev - time)
    }

    if (session) {
      const hoy = new Date()
      const sessionToSave: SesionAGuardar = {
        uuid: session.user.id,
        horaInicioSesion: dateToTimetz(InicioSesion),
        //@ts-expect-error no te preocupes ts
        fecha: InicioSesion,
        horaFinSesion: dateToTimetz(hoy),
        tecnicaEstudio: 1,
        tipoMotivacion: motivationType === 'Positiva' ? 1 : 2,
        cantidadObjetivos: objetivos.length,
        cantidadObjetivosCumplidos: objCumplidos,
        tiempoEstudio: studyTime,
        musicaSeleccionada: getSelectedMusic(
          selectedMusic ? selectedMusic.title : ''
        ),
        eventoSeleccionado: selectedEvent ? selectedEvent.id : null,
      }

      if (!InicioSesion) return

      saveSession(
        sessionToSave,
        {
          objCumplidos,
          hoy,
          InicioSesion,
        },
        {
          session,
          motivationType,
          insignias,
          events,
        }
      )
        .then(() => console.log('Los datos fueron guardados correctamente'))
        .catch((error: unknown) => {
          console.log('Ocurrio un error', error)
        })

      if (selectedEvent) {
        const nuevoTiempo =
          (selectedEvent.hoursAcumulated ? selectedEvent.hoursAcumulated : 0) +
          studyTime
        selectedEvent.hoursAcumulated = nuevoTiempo
        acumulateHoursInSelectedEvent(
          nuevoTiempo,
          session.user.id,
          selectedEvent.title,
          selectedEvent.date
        )
          .then(() => console.log('Datos cargados en evento de manera exitosa'))
          .catch((error: unknown) => console.log('Ocurrio un error', error))
      }
    }

    objetivos.forEach(objetivo => {
      if (!tiempo[objetivo]) {
        setTiempo(prev => ({
          ...prev,
          [objetivo]: 0,
        }))
      }
    })

    reloadInsignias()

    setLocation('/capyEstadisticas?period=sesion')
  }
  const volumenHandler = () => {
    setVolumen(!volumen)
  }

  const handleVolver = () => {
    setLocation('/inicio')
  }

  useEffect(() => {
    if (!isActive) return () => clearInterval(timer.current)

    if (time >= 0 && isStudying) {
      console.log('hola')
    } else {
      if (volumen) {
        capySound()
      }
      if (mode === 'Estudiando') {
        stopStudy()
        setSessionSeconds(
          pomodorosRealizados[pomodorosRealizados.length - 1].tiempoEstudio
        )
        // console.log('holis, si entro')
        pauseObjectiveTime()
        setMode('Descansando')
        setIsActive(false)
        setBoom(false) //para el confetti
        pomodoroCount.current += 0.5
      } else {
        // if (time > 0) return
        // console.log('Me terminé')
        stopStudy()
        setTimerObjectivesAcum(prev => prev + objStudyTime)
        resetObjectiveTime()
        setBreakSeconds(
          pomodorosRealizados[pomodorosRealizados.length - 1].tiempoDescanso
        )
        setMode('Estudiando')
        setIsActive(false)
        setIsSetted(false)
        pomodoroCount.current += 0.5
        setBoom(true)
      }
    }

    if (objetivos.length === objCumplidos && objetivos.length > 0) {
      finalizarSesion()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, sessionSeconds, breakSeconds, mode, objCumplidos, isStudying])

  useEffect(() => {
    setIsActive(isPaused)
  }, [isPaused])

  // useEffect(() => {
  //   setCountdown(mode === 'Estudiando' ? sessionSeconds : breakSeconds)
  // }, [mode, sessionSeconds, breakSeconds, isSetted])
  /* 
  const handleAccept = () => {
    setLocation('/inicio')
    setObjetivos(prevObjetivos =>
      prevObjetivos.filter(obj => !marked.includes(obj))
    )
  } */

  const handleSaltar = () => {
    //clearInterval(timer.current)
    if (mode === 'Estudiando') {
      setTiempoTotal(prev => prev - time)
      skipCurrent(breakSeconds)
      setIsActive(true)
    } else {
      setAcumuladorTiempoPausa(prev => prev - time)
      skipCurrent(-1)
      setIsActive(true)
    }
  }

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
      [objetivo]: objStudyTime + timerObjectivesAcum,
    }))
    setTiempoSesion(prev => ({ ...prev, [objetivo]: tiempoTotal - time }))
    if (objetivosFav.includes(objetivo)) {
      const timeToSave = objStudyTime + timerObjectivesAcum
      if (!tiempoFavorito[objetivo]) {
        setTiempoFavorito(prev => ({ ...prev, [objetivo]: timeToSave }))
        if (session) {
          if (selectedEvent) {
            acumulateHoursInFavouriteObj(
              objetivo,
              timeToSave,
              session.user.id,
              selectedEvent.id
            )
              .then(() =>
                console.log('Datos en objetvios actualizados correctamente')
              )
              .catch((error: unknown) => console.log('Ocurrio un error', error))
          } else {
            acumulateHoursInFavouriteObj(
              objetivo,
              objStudyTime,
              session.user.id
            )
              .then(() =>
                console.log('Datos en objetvios actualizados correctamente')
              )
              .catch((error: unknown) => console.log('Ocurrio un error', error))
          }
        }
      } else {
        const timeToSave =
          objStudyTime + (tiempoFavorito[objetivo] ?? 0) + timerObjectivesAcum
        setTiempoFavorito(prev => ({
          ...prev,
          [objetivo]: timeToSave,
        }))
        if (session) {
          if (selectedEvent) {
            acumulateHoursInFavouriteObj(
              objetivo,
              timeToSave,
              session.user.id,
              selectedEvent.id
            )
              .then(() => {
                console.log('Datos actualizados correctamente')
              })
              .catch((error: unknown) => {
                console.log('Ocurrio un error', error)
              })
          } else {
            acumulateHoursInFavouriteObj(objetivo, timeToSave, session.user.id)
              .then(() => {
                console.log('Datos actualizados correctamente')
              })
              .catch((error: unknown) => {
                console.log('Ocurrio un error', error)
              })
          }
        }
      }
    }

    resetObjectiveTime()
    startObjTime()
    setTimerObjectivesAcum(0)
  }

  const handleSetted = (Sessioncountup: number, Breakcountup: number) => {
    if (!sessionStart) {
      setAcumuladorTiempoPausa(0)
      setTiempoTotal(0)
      setCantidadPausas(0)
      setSessionStart(true)
      setTiempo({})
      setTiempoSesion({})
      setInicioSesion(new Date())
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

    startObjTime()
  }

  const handlePause = () => {
    const value = !isActive

    if (!value) {
      setCantidadPausas(prev => (prev += 1))
      pauseStudy()
      if (mode === 'Estudiando') {
        pauseObjectiveTime()
      }
    } else {
      resumeStudy()
      if (mode === 'Estudiando') {
        startObjTime()
      }

      // resumeStudy()
    }
    // resumeStudy()

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
      <div className='grid grid-cols-1 sm:gap-20 md:grid-cols-2'>
        {/*  Columna 1 */}
        <div className='col-span-1 p-4'>
          <div className='mt-4 px-4'>
            <DialogoChicho motivation={motivationType} />
            <div className='relative flex max-h-[320px] w-full min-w-[250px] max-w-[250px] items-center justify-center overflow-hidden sm:h-full sm:max-h-[450px] sm:min-w-[450px] sm:max-w-[450px]'>
              <AnimacionChicho motivation={motivationType} />
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
          <div className='mb-4 w-7/12 rounded-lg bg-accent p-2 sm:mt-4'>
            Motivación: <span className='font-semibold'>{motivationType}</span>
          </div>
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
                        onClick={() => setSessionSeconds(prev => prev - 60)} //-60
                        disabled={sessionSeconds <= 60 || isActive || isSetted}
                      >
                        -
                      </Button>
                      <p>{sessionSeconds / 60}</p>
                      <Button
                        onMouseDown={() => startAdjustingTime(60)}
                        onClick={() => setSessionSeconds(prev => prev + 60)}
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
                        onClick={() => setBreakSeconds(prev => prev - 60)} //60
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
                <div className='flex justify-center sm:mt-16'>
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
                onClick={() => {
                  handleSetted(sessionSeconds, breakSeconds)
                  startStudy({
                    studyTime: sessionSeconds,
                    breakTime: breakSeconds,
                  })
                }}
              >
                Empezar
              </Button>
            ) : (
              <div className='flex w-3/12 flex-row items-center justify-between px-4'>
                <div className='flex justify-center'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className='flex items-center rounded-full p-6'
                          onClick={() => handlePause()}
                        >
                          {isActive ? <Pause /> : <Play />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side='bottom'
                        className='mt-1 flex rounded-md bg-gray-200 px-4 py-1'
                      >
                        <p>{isActive ? 'Pausar' : 'Reanudar'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className='flex justify-end'>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          className='flex'
                          variant='ghost'
                          type='button'
                          disabled={
                            (mode === 'Estudiando'
                              ? time >= sessionSeconds
                              : time >= breakSeconds) || !isActive
                          }
                          onClick={handleSaltar}
                          // onClick={() =>
                          //   toast.warning('Desabilitado por el momento...')
                          // }
                        >
                          <SkipForward />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side='bottom'
                        className='mt-1 flex rounded-md bg-gray-200 px-4 py-1'
                      >
                        <p>BOTON DE SALTAR</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
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
            <h1 className='mb-2 text-xl font-semibold'>
              Objetivos de la sesión:
            </h1>
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
            {sessionStart ? (
              <Button variant={'destructive'} onClick={finalizarSesion}>
                Finalizar Sesion
              </Button>
            ) : (
              <Button variant={'default'} onClick={handleVolver}>
                Volver
              </Button>
            )}
          </div>
          <div className='container mt-8 w-full'></div>
        </div>
      </div>
    </>
  )
}
