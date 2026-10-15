import {
  acumulateHoursInFavouriteObj,
  buildSaveSessionJob,
  dateToTimetz,
  getSelectedMusic,
  runSaveSession,
  type SaveSessionJob,
  type SesionAGuardar,
} from '@/constants/supportFunctions'
import usePomodoro from '@/hooks/usePomodoro'
import {
  ajustarSegundos,
  MAXIMO_SEGUNDOS,
  MINIMO_SEGUNDOS,
  PASO_SEGUNDOS,
} from '@/lib/timer/ajusteMinutos'
import type { CapydoroSnapshot } from '@/lib/timer/capydoroEngine'
import { formatTime } from '@/lib/utils'
import {
  Pause,
  Play,
  SkipForward,
  Star,
  Volume2,
  VolumeOff,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Confetti from 'react-confetti-boom'
import { toast } from 'sonner'
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

export default function Pomodoro() {
  const { insignias, reloadInsignias } = useInsignias()
  const [sessionSeconds, setSessionSeconds] = useState(25 * 60)
  const [breakSeconds, setBreakSeconds] = useState(5 * 60)
  const [objCumplidos, setObjCumplidos] = useState(0)
  // Fase, tiempo restante y acumulados efectivos salen del motor del worker
  const {
    time,
    phase,
    isRunning,
    studySeconds,
    completedStudies,
    completedBreaks,
    segmentId,
    startStudy,
    pauseStudy,
    resumeStudy,
    skipCurrent,
    finalize,
  } = usePomodoro()
  const isActive = isRunning
  const isSetted = phase === 'study' || phase === 'break'
  const mode: Mode = phase === 'break' ? 'Descansando' : 'Estudiando'
  const [capySound] = useSound(CapySound)
  const { selectedMusic } = useMusic()
  const { motivationType } = useMotivation()
  const [volumen, setVolumen] = useState(true)
  const [boom, setBoom] = useState(false)
  const { session } = useSession()
  const [InicioSesion, setInicioSesion] = useState<Date | null>(null)
  const sessionStart = InicioSesion !== null
  const { events, selectedEvent } = useEvents()
  // Estudio efectivo acumulado cuando se marcó el último objetivo
  const estudioAlUltimoObjetivo = useRef(0)

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
  const { setTiempoTotal, setAcumuladorTiempoPausa, setCantidadPausas } =
    useSesion()

  // Resumen congelado al finalizar y job de guardado, reutilizados en los reintentos
  const resumenFinalRef = useRef<CapydoroSnapshot | null>(null)
  const saveJobRef = useRef<SaveSessionJob | null>(null)
  const guardandoRef = useRef(false)
  const [guardando, setGuardando] = useState(false)
  // Se activa al pedir el cierre, antes de que el worker confirme
  const [cerrando, setCerrando] = useState(false)
  const finalizada = cerrando || phase === 'finished'

  const finalizarSesion = async () => {
    if (guardandoRef.current) return
    guardandoRef.current = true
    // Desde acá no se pueden marcar objetivos ni usar los controles
    setCerrando(true)
    setGuardando(true)

    try {
      resumenFinalRef.current ??= await finalize()
    } catch (error: unknown) {
      console.error('No se pudo detener el temporizador', error)
      toast.error('No pudimos cerrar la sesión. Volvé a intentarlo.')
      guardandoRef.current = false
      setGuardando(false)
      return
    }
    const { studySeconds: tiempoEstudio, breakSeconds: tiempoDescanso } =
      resumenFinalRef.current

    if (session && InicioSesion) {
      if (!saveJobRef.current) {
        const hoy = new Date()
        const sessionToSave: SesionAGuardar = {
          uuid: session.user.id,
          horaInicioSesion: dateToTimetz(InicioSesion),
          fecha: InicioSesion,
          horaFinSesion: dateToTimetz(hoy),
          tecnicaEstudio: 1,
          tipoMotivacion: motivationType === 'Positiva' ? 1 : 2,
          cantidadObjetivos: objetivos.length,
          cantidadObjetivosCumplidos: objCumplidos,
          tiempoEstudio,
          musicaSeleccionada: getSelectedMusic(
            selectedMusic ? selectedMusic.title : ''
          ),
          eventoSeleccionado: selectedEvent ? selectedEvent.id : null,
        }
        saveJobRef.current = buildSaveSessionJob(sessionToSave, {
          motivationType,
          insignias,
          events,
          selectedEvent,
        })
      }

      try {
        const job = await runSaveSession(saveJobRef.current)
        if (selectedEvent && job.horasEvento !== null) {
          selectedEvent.hoursAcumulated = job.horasEvento
        }
      } catch (error: unknown) {
        console.error('No se pudo guardar la sesión', error)
        toast.error(
          'No pudimos guardar tu sesión. Revisá tu conexión y volvé a intentarlo.'
        )
        guardandoRef.current = false
        setGuardando(false)
        return
      }
    }

    setTiempoTotal(tiempoEstudio)
    setAcumuladorTiempoPausa(tiempoDescanso)
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

  // Sonido al terminar cada fase y confetti al completar un ciclo
  const fasesCompletadas = useRef({ estudios: 0, descansos: 0 })
  useEffect(() => {
    const previas = fasesCompletadas.current
    fasesCompletadas.current = {
      estudios: completedStudies,
      descansos: completedBreaks,
    }
    const terminoEstudio = completedStudies > previas.estudios
    const terminoDescanso = completedBreaks > previas.descansos
    if (!terminoEstudio && !terminoDescanso) return

    if (volumen) capySound()
    setBoom(terminoDescanso)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedStudies, completedBreaks])

  useEffect(() => {
    if (objetivos.length === objCumplidos && objetivos.length > 0) {
      void finalizarSesion()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objCumplidos])

  const handleSaltar = () => {
    skipCurrent()
  }

  const handleCheckbox = (objetivo: string) => {
    if (finalizada || guardandoRef.current) return
    if (marked.includes(objetivo)) {
      return
    }
    setMarked([...marked, objetivo])
    setObjCumplidos(prev => prev + 1)
    setObjetivosPend(prevObjetivosPend =>
      prevObjetivosPend.filter(item => item !== objetivo)
    )

    // Tiempo efectivo estudiado desde el último objetivo marcado
    const tiempoObjetivo = studySeconds - estudioAlUltimoObjetivo.current
    estudioAlUltimoObjetivo.current = studySeconds

    setTiempo(prev => ({
      ...prev,
      [objetivo]: tiempoObjetivo,
    }))
    setTiempoSesion(prev => ({ ...prev, [objetivo]: studySeconds }))
    if (objetivosFav.includes(objetivo)) {
      const timeToSave = tiempoObjetivo + (tiempoFavorito[objetivo] ?? 0)
      setTiempoFavorito(prev => ({ ...prev, [objetivo]: timeToSave }))
      if (session) {
        acumulateHoursInFavouriteObj(
          objetivo,
          timeToSave,
          session.user.id,
          selectedEvent?.id
        )
          .then(() => {
            console.log('Datos en objetivos actualizados correctamente')
          })
          .catch((error: unknown) => {
            console.log('Ocurrio un error', error)
          })
      }
    }
  }

  const handleEmpezar = () => {
    if (!sessionStart) {
      setAcumuladorTiempoPausa(0)
      setTiempoTotal(0)
      setCantidadPausas(0)
      setTiempo({})
      setTiempoSesion({})
      setInicioSesion(new Date())
    }
    setBoom(false)
    startStudy({ studyTime: sessionSeconds, breakTime: breakSeconds })
  }

  const handlePause = () => {
    if (isActive) {
      setCantidadPausas(prev => prev + 1)
      pauseStudy()
    } else {
      resumeStudy()
    }
  }

  useEffect(() => {
    setObjetivosPend(objetivos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mantener presionado el botón ajusta los minutos de estudio de forma continua.
  // Con pointer events funciona igual con mouse y touch; el teclado usa onClick.
  // Los minutos de descanso se ajustan de a uno.
  const ajusteRef = useRef<{
    timeout?: ReturnType<typeof setTimeout>
    interval?: ReturnType<typeof setInterval>
  }>({})

  const stopAdjustingTime = useCallback(() => {
    clearTimeout(ajusteRef.current.timeout)
    clearInterval(ajusteRef.current.interval)
    ajusteRef.current = {}
  }, [])

  const startAdjustingTime = (change: number) => {
    stopAdjustingTime()
    setSessionSeconds(prev => ajustarSegundos(prev, change))
    ajusteRef.current.timeout = setTimeout(() => {
      ajusteRef.current.interval = setInterval(() => {
        setSessionSeconds(prev => ajustarSegundos(prev, change))
      }, 150) //Es lo rapido que cambia
    }, 400)
  }

  // Un botón deshabilitado puede no recibir pointerup: cortar al llegar a un límite
  useEffect(() => {
    if (
      sessionSeconds <= MINIMO_SEGUNDOS ||
      sessionSeconds >= MAXIMO_SEGUNDOS
    ) {
      stopAdjustingTime()
    }
  }, [sessionSeconds, stopAdjustingTime])

  useEffect(() => stopAdjustingTime, [stopAdjustingTime])

  const ajusteSostenido = (change: number) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return
      startAdjustingTime(change)
    },
    onPointerUp: stopAdjustingTime,
    onPointerLeave: stopAdjustingTime,
    onPointerCancel: stopAdjustingTime,
    // detail === 0: activación por teclado (Enter o Espacio)
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) {
        setSessionSeconds(prev => ajustarSegundos(prev, change))
      }
    },
  })

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
          {!isSetted && !finalizada && (
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
                        {...ajusteSostenido(-PASO_SEGUNDOS)}
                        className='touch-none select-none'
                        aria-label='Restar un minuto de estudio'
                        disabled={
                          sessionSeconds <= MINIMO_SEGUNDOS ||
                          isActive ||
                          isSetted
                        }
                      >
                        -
                      </Button>
                      <p>{sessionSeconds / 60}</p>
                      <Button
                        {...ajusteSostenido(PASO_SEGUNDOS)}
                        className='touch-none select-none'
                        aria-label='Sumar un minuto de estudio'
                        disabled={
                          sessionSeconds >= MAXIMO_SEGUNDOS ||
                          isActive ||
                          isSetted
                        }
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
                        onClick={() =>
                          setBreakSeconds(prev =>
                            ajustarSegundos(prev, -PASO_SEGUNDOS)
                          )
                        }
                        aria-label='Restar un minuto de descanso'
                        disabled={
                          breakSeconds <= MINIMO_SEGUNDOS ||
                          isActive ||
                          isSetted
                        }
                      >
                        -
                      </Button>
                      <p>{breakSeconds / 60}</p>
                      <Button
                        onClick={() =>
                          setBreakSeconds(prev =>
                            ajustarSegundos(prev, PASO_SEGUNDOS)
                          )
                        }
                        aria-label='Sumar un minuto de descanso'
                        disabled={
                          breakSeconds >= MAXIMO_SEGUNDOS ||
                          isActive ||
                          isSetted
                        }
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
                        key={segmentId}
                        studyTime={sessionSeconds}
                        remainingTime={time}
                        play={isActive}
                        num={completedBreaks}
                      />
                    </div>
                  ) : (
                    <div>
                      <CountdownBreak
                        key={segmentId}
                        breakTime={breakSeconds}
                        remainingTime={time}
                        play={isActive}
                        num={completedBreaks}
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
            {finalizada ? (
              <p className='text-center text-xl font-semibold'>
                Sesión finalizada
              </p>
            ) : !isSetted ? (
              <Button onClick={handleEmpezar}>Empezar</Button>
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
                    disabled={mode === 'Descansando' || !isActive || finalizada}
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
              <Button
                variant={'destructive'}
                disabled={guardando}
                onClick={() => void finalizarSesion()}
              >
                {guardando
                  ? 'Guardando...'
                  : finalizada
                    ? 'Reintentar guardado'
                    : 'Finalizar Sesion'}
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
