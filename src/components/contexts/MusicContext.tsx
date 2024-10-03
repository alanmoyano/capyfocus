import React, { createContext, useState, useContext, ReactNode } from 'react'

type Music = {
  title: string
  spotifyUri: string
}

type MusicContextType = {
  selectedMusic: Music | null
  setSelectedMusic: (music: Music | null) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export const MusicProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null)

  return (
    <MusicContext.Provider value={{ selectedMusic, setSelectedMusic }}>
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}
