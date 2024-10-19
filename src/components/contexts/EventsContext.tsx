import React, { createContext, ReactNode, useContext, useState } from 'react'
import { Event } from '../ComponentesEspecifico/Eventos'


type EventData = {
  events: Event[]

  setEvents: React.Dispatch<React.SetStateAction<Event[]>>

}

export const EventsContext = createContext<EventData | undefined>(
  undefined
)

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([])

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
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