import { Calendar } from '@/components/ui/calendar'
import { es } from 'date-fns/locale'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from '@/components/ui/tooltip'
  import { useState } from 'react'

// Este calendario va a ser para mostrarlo en las estadisticas. 
export default function Calendario(events: { date: Date, title: string }[]) {
    const [, setSelectedEvent] = useState<{
        date: Date
        title: string
    } | null>(null)
    
    return(

    <Calendar
    mode='single'
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

    )
}