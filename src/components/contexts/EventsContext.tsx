import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { Event } from '../ComponentesEspecifico/Eventos'

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
