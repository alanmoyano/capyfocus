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
  // La preferencia es el default hasta una elección explícita de la sesión.
  // Un cambio de identidad desmonta este provider y vuelve a usar el default.
  const [selection, setSelection] = useState<string | null>(null)
  const motivationType =
    selection ?? (motivationPreference === '2' ? 'Pasivo Agresiva' : 'Positiva')
  const setMotivationType: MotivationData['setMotivationType'] = action => {
    setSelection(previous => {
      const current =
        previous ??
        (motivationPreference === '2' ? 'Pasivo Agresiva' : 'Positiva')
      return typeof action === 'function' ? action(current) : action
    })
  }

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
