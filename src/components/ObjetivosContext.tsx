import React, { createContext, useState, ReactNode, useContext } from 'react'

interface ObjetivosContextData {
  objetivos: string[]
  objetivosFav: string[]
  // funcion que despacha una accion de tipo state con un string[]
  setObjetivos: React.Dispatch<React.SetStateAction<string[]>>
  setObjetivosFav: React.Dispatch<React.SetStateAction<string[]>>
}

// datos que va a manejar, valor predeterminado x si no hay provider
export const ObjetivosContext = createContext<ObjetivosContextData | undefined>(
  undefined
)

export const ObjetivosProvider = ({ children }: { children: ReactNode }) => {
  // lo mismo que estaba alla ! ;)
  const [objetivos, setObjetivos] = useState<string[]>([])
  const [objetivosFav, setObjetivosFav] = useState<string[]>([])

  return (
    <ObjetivosContext.Provider
      value={{ objetivos, setObjetivos, objetivosFav, setObjetivosFav }}
    >
      {children}
    </ObjetivosContext.Provider>
  )
}

export const useObjetivos = () => {
  const context = useContext(ObjetivosContext)
  if (context === undefined) {
    throw new Error('error en contexto')
  }
  return context
}
