import { createContext, useContext, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

type ProfilePicData = {
  profilePic: string

  setProfilePic: Dispatch<SetStateAction<string>>
}

export const ProfilePicContext = createContext<ProfilePicData | undefined>(
  undefined
)

export const ProfilePicProvider = ({ children }: { children: ReactNode }) => {
  const [profilePic, setProfilePic] = useState('Positiva')

  return (
    <ProfilePicContext.Provider
      value={{
        profilePic,
        setProfilePic: newProfilePic => {
          localStorage.setItem('fotoPerfil', JSON.stringify(newProfilePic))
          setProfilePic(newProfilePic)
        },
      }}
    >
      {children}
    </ProfilePicContext.Provider>
  )
}

export const useProfilePic = () => {
  const context = useContext(ProfilePicContext)
  if (context === undefined) {
    throw new Error('useProfilePic must be used within a ProfilePicProvider')
  }
  return context
}
