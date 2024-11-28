import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
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
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Fragment, KeyboardEvent, useState } from 'react'
import { useLocation } from 'wouter'
import {
  deleteEvent,
  gatherEventsOfUser,
} from '../../constants/supportFunctions'
import { useEvents } from '../contexts/EventsContext'
import { useSession } from '../contexts/SessionContext'
import { supabase } from '../supabase/client'

export type Event = {
  id: number
  date: Date
  title: string
  hoursAcumulated?: number
}

type EventToSave = {
  nombre: string
  uuid: string
  fechaLimite: Date
}

type EventToRecover = {
  idEvento: number
  nombre: string
  idUsuario: string
  fechaLimite: string
  horasAcumuladas: number | null
}

type EventAddContext = 'New' | 'Existing'

async function saveEvent(name: string, uuid: string, limitDate: Date) {
  const eventToSave: EventToSave = {
    nombre: name,
    uuid: uuid,
    fechaLimite: limitDate,
  }
  const { data, error } = await supabase
    .from('Eventos')
    .insert([
      {
        nombre: eventToSave.nombre,
        idUsuario: eventToSave.uuid,
        fechaLimite: eventToSave.fechaLimite,
      },
    ])
    .select()

  if (data) return data[0] as EventToRecover
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

export default function Eventos() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [, setLocation] = useLocation()
  const { events, setEvents, selectedEvent, setSelectedEvent } = useEvents() //todos los eventos
  const [eventTitle, setEventTitle] = useState<string>('') //el titulos del evento
  const { session } = useSession()

  const handleVolver = () => {
    setLocation('/inicio')
  }

  const addEvent = (googleCalendar: boolean, context: EventAddContext) => {
    if (date && eventTitle) {
      const dateString = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        month: 'numeric',
        day: 'numeric',
      })

      if (context === 'New') {
        toast.success('Se ha creado el evento:', {
          description: '"' + eventTitle + '"' + ' en el dia: ' + dateString,
          duration: 4000,
          position: 'bottom-center',
        })
        if (googleCalendar) {
          window.open(createGoogleCalendarLink(eventTitle, date))
        }
        if (session) {
          console.log(date)
          const mañana = new Date('2024/11/2')
          console.log(mañana)
          saveEvent(eventTitle, session.user.id, date)
            .then(data => {
              if (data) {
                setEvents([
                  ...events,
                  { date, title: eventTitle, id: data.idEvento },
                ])
              }
            })
            .catch((error: unknown) => console.log(error))
        } else {
          toast.error('ADVERTENCIA', {
            description:
              'Si no tienes sesion iniciada tu evento se borrará de la pagina',
          })
        }
        // setEvents([...events, { date, title: eventTitle }])
        setEventTitle('') // Limpiar el título después de añadir el evento
        console.log(events)
      }
    } else {
      toast.error('No se ha podido crear el evento:', {
        description: 'Por favor, ingresa un título para el evento.',
      })
    }
  }

  const handleDelete = (event: Event, index: number) => {
    setEvents(events.filter((_, i) => i !== index))
    if (selectedEvent === event) {
      setSelectedEvent(null)
    }
    if (session) {
      deleteEvent(event.date, event.title, session.user.id)
        .then(() => console.log('Evento borrado con exito'))
        .catch((error: unknown) => console.log('Ocurrio un error', error))
    }
  }

  const handleRecover = () => {
    if (!session || events.length > 0) return
    gatherEventsOfUser(session.user.id)
      .then(data => {
        console.log('Datos: ', data)
        data.forEach(evento => {
          // @ts-expect-error no te preocupes type, anda
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const fechaParsed = evento.fechaLimite.replaceAll('-', '/') as string

          const id = evento.idEvento

          const date = new Date(fechaParsed)

          const title = evento.nombre

          const hours = evento.horasAcumuladas

          setEvents(prev => {
            const index = prev.findIndex(event => event.id === id)

            if (index === -1)
              return [
                ...prev,
                { date, title, hoursAcumulated: hours, id } as Event,
              ]
            else return prev
          })
        })
      })
      .catch((error: unknown) => console.log(error))
  }

  const handleAdd = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter' && eventTitle.trim() != '' && date) {
      addEvent(false, 'New')
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='secondary'
          className='mt-6 w-full bg-secondary sm:w-auto'
          onClick={handleRecover}
        >
          Eventos re cabrones
        </Button>
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='flex items-center justify-between text-xl font-bold sm:text-2xl'>
            Agregar evento
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className='h-[80vh] pr-4'>
          <p className='text-sm text-muted-foreground'>
            Selecciona una fecha para el evento.
          </p>
          <div className='mt-1 grid gap-4'>
            <div className='grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4'>
              <Label
                htmlFor='name'
                className='text-sm font-bold sm:text-right sm:text-base'
              >
                Nombre
              </Label>
              <Input
                id='name'
                type='text'
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                onKeyDown={handleAdd}
                placeholder='Nuevo evento'
                className='col-span-1 sm:col-span-3 dark:placeholder:text-gray-500'
              />
            </div>
            <p className='text-sm text-muted-foreground'>
              Selecciona una fecha para el evento.
            </p>
            <div className='grid grid-cols-1 items-center gap-4 sm:grid-cols-4'>
              <Label className='text-sm font-bold sm:text-right sm:text-base'>
                Calendario
              </Label>
            </div>
            {/* Calendario */}

            <div className='w-full sm:w-auto'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={selectedDate => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  if (selectedDate && selectedDate >= today) {
                    setDate(selectedDate)
                  }
                }}
                className='flex w-full justify-center rounded-md border sm:w-auto'
                modifiers={{
                  eventDay: events.map(event => event.date),
                  disabled: date => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  },
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
                    addEvent(false, 'New')
                  }}
                  variant={'accent'}
                  className='w-full sm:w-auto'
                >
                  Agregar
                </Button>
                <Button
                  onClick={() => {
                    addEvent(true, 'New')
                  }}
                  variant={'accent'}
                  className='ml-2 w-full sm:w-auto'
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
                  {events.map((event, index) => (
                    <Fragment key={event.id}>
                      {event.date >=
                        new Date(new Date().setHours(0, 0, 0, 0)) && (
                        <li className='flex items-center justify-between'>
                          <span
                            onClick={() => setSelectedEvent(event)}
                            className={`cursor-pointer ${
                              selectedEvent === event
                                ? 'text-accent'
                                : 'opacity-100 hover:text-accent'
                            }`}
                          >
                            {event.date.toLocaleDateString('es-ES', {
                              weekday: 'short',
                              month: 'numeric',
                              day: 'numeric',
                            })}
                            - {event.title}
                          </span>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              handleDelete(event, index)
                            }}
                          >
                            <Trash size={16} />
                          </Button>
                        </li>
                      )}
                    </Fragment>
                  ))}
                </ul>
                <h2 className='mt-4 text-lg font-bold sm:text-xl'>
                  Evento seleccionado:
                </h2>
                {selectedEvent ? (
                  <div className='mt-2'>
                    <p className='font-bold'>
                      Evento:{' '}
                      <span className='font-normal'>{selectedEvent.title}</span>
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
