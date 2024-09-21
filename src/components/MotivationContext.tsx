import React, { createContext, ReactNode, useContext, useState } from 'react'

type MotivationData = {
  motivationType: string

  setMotivationType: React.Dispatch<React.SetStateAction<string>>
}

export const MotivationContext = createContext<MotivationData | undefined>(
  undefined
)

export const MotivationProvider = ({ children }: { children: ReactNode }) => {
  const [motivationType, setMotivationType] = useState('Positiva')
  
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
