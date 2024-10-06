import React, { createContext, ReactNode, useContext, useState } from 'react'

type SesionData = {
  tiempoTotal: number
  setTiempoTotal: React.Dispatch<React.SetStateAction<number>>
  cantidadPausas: number
  setCantidadPausas: React.Dispatch<React.SetStateAction<number>>
  acumuladorTiempoPausa: number
  setAcumuladorTiempoPausa: React.Dispatch<React.SetStateAction<number>>
  tecnicaEstudio: string
  setTecnicaEstudio: React.Dispatch<React.SetStateAction<string>>
}

export const SesionContext = createContext<SesionData | undefined>(undefined)

export const SesionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tiempoTotal, setTiempoTotal] = useState<number>(0)
  const [cantidadPausas, setCantidadPausas] = useState<number>(0)
  const [acumuladorTiempoPausa, setAcumuladorTiempoPausa] = useState<number>(0)
  const [tecnicaEstudio, setTecnicaEstudio] = useState<string>('Pomodoro')
  return (
    <SesionContext.Provider
      value={{
        tiempoTotal,
        setTiempoTotal,
        cantidadPausas,
        setCantidadPausas,
        acumuladorTiempoPausa,
        setAcumuladorTiempoPausa,
        tecnicaEstudio,
        setTecnicaEstudio,
      }}
    >
      {children}
    </SesionContext.Provider>
  )
}

export const useSesion = () => {
  const context = useContext(SesionContext)
  if (context === undefined) {
    throw new Error('useSesion must be used within a SesionProvider')
  }
  return context
}
