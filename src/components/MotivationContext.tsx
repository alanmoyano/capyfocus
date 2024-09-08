import { createContext, ReactNode, useState } from 'react'

type MotivationData = {
  motivationId: number
  type: string
}

export const MotivationContext = createContext<MotivationData | undefined>(
  undefined
)

export const MotivationProvider = ({ children }: { children: ReactNode }) => {
  const [motivationId, setMotivationId] = useState(0)
  const [motivationType, setMotivationType] = useState('Positiva')

  return (
    <MotivationContext.Provider
      value={{motivationId, setMotivationId, motivationType, setMotivationType}}
    >
      {children}
    </MotivationContext.Provider>
  )
}
