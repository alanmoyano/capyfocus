import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Event } from '../ComponentesEspecifico/Eventos'
import { useSession } from '@/components/contexts/SessionContext'
import { gatherEventsOfUser } from '@/constants/supportFunctions'

type EventData = {
  events: Event[]
  selectedEvent: Event | null

  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
  setSelectedEvent: Dispatch<SetStateAction<Event | null>>
}

export const EventsContext = createContext<EventData | undefined>(undefined)

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const { session } = useSession()

  useEffect(() => console.log('eventos:', events), [events])
  useEffect(() => {
    recoverEvents()
    return () => setEvents([])
  }, [session])

  function recoverEvents() {
    if (!session) return
    if (events.length > 0) return

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
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

  return (
    <EventsContext.Provider
      value={{ events, setEvents, selectedEvent, setSelectedEvent }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error('Error en el contexto de motivacion')
  }
  return context
}
