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

  const userId = session?.user.id
  useEffect(() => {
    if (!userId) return
    let active = true
    void gatherEventsOfUser(userId)
      .then(data => {
        if (!active) return
        const recoveredEvents = data.map(
          evento =>
            ({
              date: new Date(evento.fechaLimite.replaceAll('-', '/')),
              title: evento.nombre,
              hoursAcumulated: evento.horasAcumuladas,
              id: evento.idEvento,
            }) as Event
        )
        setEvents(current => {
          const currentIds = new Set(current.map(event => event.id))
          return [
            ...current,
            ...recoveredEvents.filter(event => !currentIds.has(event.id)),
          ]
        })
      })
      .catch((error: unknown) => {
        if (active) console.error(error)
      })
    return () => {
      active = false
    }
  }, [userId])

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
