import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { es } from 'date-fns/locale'
import { Loader2, Trash } from 'lucide-react'
import { toast } from 'sonner'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  agregarEventos,
  crearEventoTemporal,
  esEventoTemporal,
  eventoDesdeRemoto,
  fechaLimiteDesdeFecha,
  mensajesErrorEvento,
  validarEvento,
  type EventoLocal,
  type EventoRemoto,
} from '@/lib/inicio/eventos'
import { cn } from '@/lib/utils'
import { Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useLocation } from 'wouter'
import { useEvents } from '../contexts/EventsContext'
import { useSession } from '../contexts/SessionContext'
import { supabase } from '../supabase/client'

export type Event = EventoLocal

// Helpers propios de este módulo: a diferencia de los compartidos en
// supportFunctions, propagan los errores para poder avisar y reintentar.
async function saveEvent(name: string, uuid: string, limitDate: Date) {
  const respuesta = await supabase
    .from('Eventos')
    .insert([
      {
        nombre: name,
        idUsuario: uuid,
        fechaLimite: fechaLimiteDesdeFecha(limitDate),
      },
    ])
    .select()
    .single()

  if (respuesta.error) throw respuesta.error
  return respuesta.data as EventoRemoto
}

// Borra por id remoto (no por nombre y fecha) y confirma que hubo una fila
async function deleteEventById(id: number, uuid: string) {
  const { data, error } = await supabase
    .from('Eventos')
    .delete()
    .eq('idEvento', id)
    .eq('idUsuario', uuid)
    .select('idEvento')

  if (error) throw error
  if (data.length === 0) throw new Error('No se eliminó ningún evento')
}

async function gatherEvents(uuid: string) {
  const { data, error } = await supabase
    .from('Eventos')
    .select()
    .eq('idUsuario', uuid)

  if (error) throw error
  return data as EventoRemoto[]
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}${month}${day}`
}

const createGoogleCalendarLink = (name: string, date: Date) => {
  const formattedStartDate = formatDate(date)

  const endDate = new Date(date)
  endDate.setDate(date.getDate() + 1)
  const formattedEndDate = formatDate(endDate)

  const baseUrl = 'https://www.google.com/calendar/render'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: name,
    dates: `${formattedStartDate}/${formattedEndDate}`,
    details: 'Evento creado por la pagina web de CapyFocus',
  })

  return `${baseUrl}?${params.toString()}`
}

const formatoLargo = (date: Date) =>
  date.toLocaleDateString('es-ES', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
  })

export default function Eventos() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [, setLocation] = useLocation()
  const { events, setEvents, selectedEvent, setSelectedEvent } = useEvents() //todos los eventos
  const [eventTitle, setEventTitle] = useState<string>('') //el titulos del evento
  const [errorEvento, setErrorEvento] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState<number[]>([])
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)
  const { session } = useSession()
  const uuid = session?.user.id ?? null

  const [cargaEventos, setCargaEventos] = useState<
    'inactiva' | 'cargando' | 'lista' | 'error'
  >('inactiva')
  // Ids borrados con confirmación: una lectura anterior no los reincorpora
  const borrados = useRef(new Set<number>())
  // Sólo se aplica la lectura más reciente: una anterior que llegue tarde
  // pisaría horas acumuladas más nuevas
  const ultimaLectura = useRef(0)

  // Cambia con cada identidad y al desmontar: las respuestas de una
  // generación anterior (incluso A → B → A) no se aplican
  const generacion = useRef({ valor: 0 })
  useEffect(() => {
    const contador = generacion.current
    contador.valor++
    setCargaEventos('inactiva')
    return () => {
      contador.valor++
    }
  }, [uuid])

  // Un evento temporal no existe en el backend: no puede quedar seleccionado
  // para una sesión que se va a guardar con usuario
  useEffect(() => {
    if (uuid && selectedEvent && esEventoTemporal(selectedEvent)) {
      setSelectedEvent(null)
    }
  }, [uuid, selectedEvent, setSelectedEvent])

  const handleVolver = () => {
    setLocation('/inicio')
  }

  const guardarEvento = (
    titulo: string,
    fecha: Date,
    googleCalendar: boolean
  ) => {
    if (!uuid) return
    const gen = generacion.current.valor
    // La pestaña se abre durante el click para que no la bloquee el navegador,
    // y sólo se navega a Calendar si el evento se guardó
    const ventanaCalendar = googleCalendar ? window.open('', '_blank') : null
    if (ventanaCalendar) ventanaCalendar.opener = null
    const toastId = toast.loading('Guardando evento…', {
      description: `"${titulo}" el ${formatoLargo(fecha)}`,
      position: 'bottom-center',
    })
    setGuardando(true)
    setErrorEvento(null)

    saveEvent(titulo, uuid, fecha)
      .then(data => {
        if (generacion.current.valor !== gen) {
          ventanaCalendar?.close()
          toast.dismiss(toastId)
          return
        }
        setEvents(prev =>
          agregarEventos(prev, [
            { ...eventoDesdeRemoto(data), date: fecha, title: titulo },
          ])
        )
        setEventTitle(prev => (prev.trim() === titulo ? '' : prev))
        toast.success('Se ha creado el evento:', {
          id: toastId,
          description: `"${titulo}" en el día: ${formatoLargo(fecha)}`,
          duration: 4000,
          position: 'bottom-center',
        })
        if (googleCalendar) {
          const link = createGoogleCalendarLink(titulo, fecha)
          if (ventanaCalendar) ventanaCalendar.location.href = link
          else window.open(link, '_blank', 'noopener')
        }
      })
      .catch((error: unknown) => {
        console.error('No se pudo guardar el evento', error)
        ventanaCalendar?.close()
        if (generacion.current.valor !== gen) {
          toast.dismiss(toastId)
          return
        }
        // El reintento es inline: con el Sheet abierto (modal) no se puede
        // interactuar con las acciones de los toasts
        setErrorEvento(
          `No se pudo guardar "${titulo}". Revisá tu conexión y volvé a presionar "${googleCalendar ? 'Crear en Calendar' : 'Agregar'}".`
        )
        toast.error('No se pudo crear el evento', {
          id: toastId,
          description: `"${titulo}". Revisá tu conexión e intentá de nuevo.`,
          position: 'bottom-center',
        })
      })
      .finally(() => {
        setGuardando(false)
      })
  }

  const addEvent = (googleCalendar: boolean) => {
    if (guardando) return
    // Los duplicados se validan contra la lista completa (también con Enter)
    if (cargaEventos === 'cargando') {
      setErrorEvento('Esperá a que terminen de cargar tus eventos.')
      return
    }
    const resultado = validarEvento(eventTitle, date, events)
    if (!resultado.ok) {
      setErrorEvento(mensajesErrorEvento[resultado.error])
      toast.error('No se ha podido crear el evento:', {
        description: mensajesErrorEvento[resultado.error],
      })
      return
    }
    const { titulo, fecha } = resultado

    if (uuid) {
      guardarEvento(titulo, fecha, googleCalendar)
      return
    }

    // Invitado: el evento vive sólo en memoria hasta recargar o iniciar sesión
    setEvents(prev => [...prev, crearEventoTemporal(titulo, fecha)])
    setEventTitle('')
    setErrorEvento(null)
    toast.warning('Evento temporal creado', {
      description: `"${titulo}" no se guardó porque no iniciaste sesión. Se perderá al recargar la página o al iniciar sesión.`,
      duration: 8000,
    })
    if (googleCalendar) {
      window.open(createGoogleCalendarLink(titulo, fecha), '_blank', 'noopener')
    }
  }

  const quitarEventoLocal = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id))
    setSelectedEvent(prev => (prev?.id === id ? null : prev))
  }

  const handleDelete = (event: Event) => {
    if (esEventoTemporal(event)) {
      quitarEventoLocal(event.id)
      return
    }
    if (!uuid || eliminando.includes(event.id)) return

    // Se quita de la lista sólo cuando el backend confirma el borrado
    const gen = generacion.current.valor
    setEliminando(prev => [...prev, event.id])
    setErrorEliminar(null)
    deleteEventById(event.id, uuid)
      .then(() => {
        if (generacion.current.valor !== gen) return
        borrados.current.add(event.id)
        quitarEventoLocal(event.id)
        toast.success('Evento eliminado', {
          description: `"${event.title}"`,
          position: 'bottom-center',
        })
      })
      .catch((error: unknown) => {
        console.error('No se pudo eliminar el evento', error)
        if (generacion.current.valor !== gen) return
        setErrorEliminar(
          `No se pudo eliminar "${event.title}"; sigue guardado. Podés volver a intentarlo.`
        )
        toast.error('No se pudo eliminar el evento', {
          description: `"${event.title}" sigue guardado.`,
          position: 'bottom-center',
        })
      })
      .finally(() => {
        setEliminando(prev => prev.filter(id => id !== event.id))
      })
  }

  // Se relee al abrir el panel: la validación de duplicados necesita la
  // lista completa y no alcanza con que haya algún evento en memoria
  const handleRecover = () => {
    if (!uuid) return
    const gen = generacion.current.valor
    const lectura = ++ultimaLectura.current
    const vigente = () =>
      generacion.current.valor === gen && ultimaLectura.current === lectura
    setCargaEventos('cargando')
    gatherEvents(uuid)
      .then(data => {
        if (!vigente()) return
        const recuperados = data
          .map(eventoDesdeRemoto)
          .filter(evento => !borrados.current.has(evento.id))
        setEvents(prev => agregarEventos(prev, recuperados))
        // El evento seleccionado también toma las horas actualizadas
        setSelectedEvent(prev => {
          const actualizado = prev && recuperados.find(e => e.id === prev.id)
          return actualizado ? { ...prev, ...actualizado } : prev
        })
        setCargaEventos('lista')
      })
      .catch((error: unknown) => {
        console.error('No se pudieron recuperar los eventos', error)
        if (vigente()) setCargaEventos('error')
      })
  }

  const handleAdd = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      addEvent(false)
    }
  }

  const hoy = new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='secondary'
          className='mt-6 w-full bg-secondary sm:w-auto'
          onClick={handleRecover}
        >
          Eventos
        </Button>
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='flex items-center justify-between text-xl font-bold sm:text-2xl'>
            Agregar evento
          </SheetTitle>
          <SheetDescription>
            Ingresa un nombre y selecciona una fecha para el evento.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className='h-[80vh] pr-4'>
          {!session && (
            <p
              role='note'
              className='mb-2 rounded-md border border-accent bg-accent/20 p-2 text-sm'
            >
              No iniciaste sesión: los eventos que crees serán temporales. Sólo
              existen en esta pestaña y se pierden al recargar o al iniciar
              sesión.
            </p>
          )}
          <div className='mt-1 grid gap-4'>
            <div className='grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4'>
              <Label
                htmlFor='evento-nombre'
                className='text-sm font-bold sm:text-right sm:text-base'
              >
                Nombre
              </Label>
              <Input
                id='evento-nombre'
                type='text'
                value={eventTitle}
                onChange={e => {
                  setEventTitle(e.target.value)
                  setErrorEvento(null)
                }}
                onKeyDown={handleAdd}
                placeholder='Nuevo evento'
                aria-invalid={errorEvento !== null}
                aria-describedby='evento-error'
                className='col-span-1 sm:col-span-3 dark:placeholder:text-gray-500'
              />
            </div>
            {cargaEventos === 'cargando' && (
              <p
                role='status'
                className='flex items-center gap-2 text-sm text-muted-foreground'
              >
                <Loader2 className='h-4 w-4 animate-spin' aria-hidden />
                Cargando tus eventos…
              </p>
            )}
            {cargaEventos === 'error' && (
              <div
                role='alert'
                className='flex items-center justify-between gap-2 text-sm'
              >
                No se pudieron cargar tus eventos; puede haber duplicados.
                <Button size='sm' variant='outline' onClick={handleRecover}>
                  Reintentar
                </Button>
              </div>
            )}
            <p
              id='evento-error'
              role='alert'
              className='text-sm text-red-600 empty:hidden'
            >
              {errorEvento}
            </p>
            <p
              id='evento-calendario'
              className='text-sm font-bold sm:text-base'
            >
              Calendario
            </p>
            {/* Calendario */}

            <div className='w-full sm:w-auto'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={selectedDate => {
                  if (selectedDate && selectedDate >= hoy) {
                    setDate(selectedDate)
                    setErrorEvento(null)
                  }
                }}
                className='flex w-full justify-center rounded-md border sm:w-auto'
                modifiers={{
                  eventDay: events.map(event => event.date),
                  disabled: date => date < hoy,
                }}
                modifiersClassNames={{
                  eventDay: 'bg-secondary',
                  disabled: 'opacity-50 cursor-not-allowed',
                }}
                locale={es}
                onDayClick={(day: Date) => {
                  const clickedEvent = events.find(
                    event => event.date.toDateString() === day.toDateString()
                  )
                  setSelectedEvent(clickedEvent ?? null)
                }}
                components={{
                  DayContent: ({ date }) => {
                    const event = events.find(
                      e => e.date.toDateString() === date.toDateString()
                    )
                    return (
                      <div>
                        <TooltipProvider delayDuration={50}>
                          <Tooltip delayDuration={50}>
                            <TooltipTrigger asChild>
                              <div>{date.getDate()}</div>
                            </TooltipTrigger>
                            {event && (
                              <TooltipContent>
                                <p>{event.title}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )
                  },
                }}
              />

              <div className='mt-4 flex flex-row items-center justify-center gap-2'>
                <Button
                  onClick={() => {
                    addEvent(false)
                  }}
                  variant={'accent'}
                  className='w-full sm:w-auto'
                  disabled={guardando || cargaEventos === 'cargando'}
                  aria-busy={guardando}
                >
                  {guardando && (
                    <Loader2
                      className='mr-2 h-4 w-4 animate-spin'
                      aria-hidden
                    />
                  )}
                  {guardando ? 'Guardando…' : 'Agregar'}
                </Button>
                <Button
                  onClick={() => {
                    addEvent(true)
                  }}
                  variant={'accent'}
                  className='ml-2 w-full sm:w-auto'
                  disabled={guardando || cargaEventos === 'cargando'}
                >
                  Crear en Calendar
                </Button>
              </div>
              <hr className='my-4' />
              <div className='mt-4'>
                <p className='text-sm text-muted-foreground'>
                  Selecciona el evento para agregar objetivos de sesión:
                </p>
                <h1 className='mt-2 border-b-2 text-xl font-bold text-[#678287] sm:text-2xl'>
                  Información de eventos:
                </h1>
                <h2 className='text-lg font-bold sm:text-xl'>
                  Eventos programados:
                </h2>
                <ul className='list-inside list-disc space-y-2 text-sm text-black sm:text-base dark:text-white'>
                  {events.map(event => {
                    const seleccionado = selectedEvent?.id === event.id
                    const borrando = eliminando.includes(event.id)
                    const temporal = esEventoTemporal(event)
                    return (
                      <Fragment key={event.id}>
                        {event.date >= hoy && (
                          <li className='flex items-center justify-between'>
                            <button
                              type='button'
                              aria-pressed={seleccionado}
                              onClick={() => setSelectedEvent(event)}
                              className={cn(
                                'rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                seleccionado
                                  ? 'font-semibold text-accent'
                                  : 'hover:text-accent'
                              )}
                            >
                              {event.date.toLocaleDateString('es-ES', {
                                weekday: 'short',
                                month: 'numeric',
                                day: 'numeric',
                              })}{' '}
                              - {event.title}
                              {temporal && (
                                <span className='ml-1 text-xs text-muted-foreground'>
                                  (temporal)
                                </span>
                              )}
                            </button>
                            <Button
                              variant='ghost'
                              size='sm'
                              aria-label={`Eliminar evento: ${event.title}`}
                              aria-busy={borrando}
                              disabled={borrando}
                              onClick={() => {
                                handleDelete(event)
                              }}
                            >
                              {borrando ? (
                                <Loader2
                                  size={16}
                                  className='animate-spin'
                                  aria-hidden
                                />
                              ) : (
                                <Trash size={16} aria-hidden />
                              )}
                            </Button>
                          </li>
                        )}
                      </Fragment>
                    )
                  })}
                </ul>
                <p role='alert' className='text-sm text-red-600 empty:hidden'>
                  {errorEliminar}
                </p>
                <h2 className='mt-4 text-lg font-bold sm:text-xl'>
                  Evento seleccionado:
                </h2>
                {selectedEvent ? (
                  <div className='mt-2'>
                    <p className='font-bold'>
                      Evento:{' '}
                      <span className='font-normal'>
                        {selectedEvent.title}
                        {esEventoTemporal(selectedEvent) && ' (temporal)'}
                      </span>
                    </p>
                    <p>
                      Fecha:{' '}
                      {selectedEvent.date.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                ) : (
                  <p>Ningún evento seleccionado</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className='flex w-full justify-between'>
          <SheetClose asChild>
            <div className='flex w-full items-center justify-between gap-2'>
              <Button
                variant={'secondary'}
                className='w-full sm:ml-2 sm:w-auto'
                onClick={() => {
                  handleVolver()
                }}
              >
                Aceptar
              </Button>
              <Button
                variant={'accent'}
                className='w-full sm:mr-2 sm:w-auto'
                onClick={() => {
                  handleVolver()
                  setSelectedEvent(null)
                }}
              >
                Cancelar
              </Button>
            </div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
