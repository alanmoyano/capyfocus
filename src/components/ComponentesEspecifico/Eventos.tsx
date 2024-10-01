import {Trash} from 'lucide-react'
import { es } from 'date-fns/locale'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from '@/components/ui/tooltip'

  import { Button } from '@/components/ui/button'
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
  SheetTrigger
} from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import { useLocation } from 'wouter'


type Event = {
    date: Date
    title: string
  }

export default function Eventos() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [, setLocation] = useLocation()
  const [events, setEvents] = useState<Event[]>([])
  const [eventTitle, setEventTitle] = useState<string>('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  
  
  const handleVolver = () => {
    setLocation('/')
  }

  const addEvent = () => {
    if (date && eventTitle) {
      setEvents([...events, { date, title: eventTitle }])
      setEventTitle('') // Limpiar el título después de añadir el evento
    }
  }


return ( 
    <Sheet>
    <SheetTrigger asChild>
      <Button
        variant='secondary'
        className='mt-6 w-full bg-secondary sm:w-auto'
      >
        Eventos
      </Button>
    </SheetTrigger>
    <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='text-xl font-bold sm:text-2xl'>
            Agregar evento
          </SheetTitle>
          <SheetDescription className='text-lg text-black sm:text-xl'>
            Agrega eventos desde aquí.
          </SheetDescription>
        </SheetHeader>
      <ScrollArea className='h-[80vh] pr-4'>
        <p className='mt-2 text-sm text-muted-foreground'>
          ¿Cual es el evento?
        </p>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-1 items-center gap-4 sm:grid-cols-4'>
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
              placeholder='Evento'
              className='col-span-1 sm:col-span-3'
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
                }
              }}
              modifiersClassNames={{
                eventDay: 'bg-secondary',
                disabled: 'opacity-50 cursor-not-allowed'
              }}
              locale={es}
              onDayClick={(day: Date) => {
                const clickedEvent = events.find(
                  event =>
                    event.date.toDateString() === day.toDateString()
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
                }
              }}
            />

            <div className='mt-4'>
              <Button
                onClick={addEvent}
                variant={'accent'}
                className='w-full sm:w-auto'
              >
                Agregar
              </Button>
            </div>
            <hr className='my-4' />
            <div className='mt-4'>
              <p className='text-sm text-muted-foreground'>
                Selecciona el evento para agregar objetivos de sesión:
              </p>
              <h1 className='mt-2 border-b-2 text-xl font-bold text-sky-800 sm:text-2xl'>
                Información de eventos:
              </h1>
              <h2 className='text-lg font-bold sm:text-xl'>
                Eventos programados:
              </h2>
              <ul className='list-inside list-disc space-y-2 text-sm text-black sm:text-base'>
                {events.map((event, index) => (
                  <li
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <span
                      onClick={() => setSelectedEvent(event)}
                      className={`cursor-pointer ${
                        selectedEvent === event
                          ? 'text-primary'
                          : 'hover:text-primary'
                      }`}
                    >
                      {event.date.toLocaleDateString('es-ES', {
                        weekday: 'short',
                        month: 'numeric',
                        day: 'numeric'
                      })}
                      - {event.title}
                    </span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setEvents(events.filter((_, i) => i !== index))
                        if (selectedEvent === event) {
                          setSelectedEvent(null)
                        }
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
              <h2 className='mt-4 text-lg font-bold sm:text-xl'>
                Evento seleccionado:
              </h2>
              {selectedEvent ? (
                <div className='mt-2'>
                  <p className='font-bold'>
                    Evento:{' '}
                    <span className='font-normal'>
                      {selectedEvent.title}
                    </span>
                  </p>
                  <p>
                    Fecha:{' '}
                    {selectedEvent.date.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
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
          <div className='flex w-full justify-between'>
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
            <Button
              variant={'secondary'}
              className='w-full sm:ml-2 sm:w-auto'
              onClick={() => {
                handleVolver()
              }}
            >
              Aceptar
            </Button>
          </div>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
)

}