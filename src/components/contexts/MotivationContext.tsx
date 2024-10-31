import { createContext, ReactNode, useContext, useState } from 'react'
import { usePreferences } from './PreferencesContext'

type MotivationData = {
  motivationType: string

  setMotivationType: React.Dispatch<React.SetStateAction<string>>
}

export const MotivationContext = createContext<MotivationData | undefined>(
  undefined
)

export const MotivationProvider = ({ children }: { children: ReactNode }) => {
  const { motivationPreference } = usePreferences()
  const [motivationType, setMotivationType] = useState(
    motivationPreference === '2' ? 'Pasivo Agresiva' : 'Positiva'
  )

  return (
    <MotivationContext.Provider value={{ motivationType, setMotivationType }}>
      {children}
    </MotivationContext.Provider>
  )
}

export const useMotivation = () => {
  const context = useContext(MotivationContext)
  if (context === undefined) {
    throw new Error('Error en el contexto de motivacion')
  }
  return context
}
