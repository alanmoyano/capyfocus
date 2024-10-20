import React, { createContext, useState, ReactNode, useContext } from 'react'

type ObjetivosContextData = {
  objetivos: string[]
  objetivosPend: string[]
  objetivosFav: string[]
  tiempo: Record<string, number>
  tiempoSesion: Record<string, number>
  tiempoFavorito: Record<string, number>

  // funcion que despacha una accion de tipo state con un string[]
  setObjetivos: React.Dispatch<React.SetStateAction<string[]>>
  setObjetivosPend: React.Dispatch<React.SetStateAction<string[]>>
  setObjetivosFav: React.Dispatch<React.SetStateAction<string[]>>
  setTiempo: React.Dispatch<React.SetStateAction<Record<string, number>>>
  setTiempoSesion: React.Dispatch<React.SetStateAction<Record<string, number>>>
  setTiempoFavorito: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >
}

// datos que va a manejar, valor predeterminado x si no hay provider
export const ObjetivosContext = createContext<ObjetivosContextData | undefined>(
  undefined
)

export const ObjetivosProvider = ({ children }: { children: ReactNode }) => {
  // lo mismo que estaba allá ! ;)
  const [objetivos, setObjetivos] = useState<string[]>([])
  const [objetivosPend, setObjetivosPend] = useState<string[]>([])
  const [objetivosFav, setObjetivosFav] = useState<string[]>(() => {
    const savedFav = localStorage.getItem('objetivosFav')
    if (!savedFav) return []

    return JSON.parse(savedFav) as string[]
  })

  const [tiempo, setTiempo] = useState<Record<string, number>>({})
  const [tiempoSesion, setTiempoSesion] = useState<Record<string, number>>({})
  const [tiempoFavorito, setTiempoFavorito] = useState<Record<string, number>>(
    {}
  )

  return (
    <ObjetivosContext.Provider
      value={{
        tiempo,
        setTiempo,
        objetivos,
        setObjetivos,
        objetivosPend,
        setObjetivosPend,
        objetivosFav,
        setObjetivosFav: newObjetivosFav => {
          localStorage.setItem('objetivosFav', JSON.stringify(newObjetivosFav))
          setObjetivosFav(newObjetivosFav)
        },
        tiempoSesion,
        setTiempoSesion,
        tiempoFavorito,
        setTiempoFavorito,
      }}
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
