import React, { useState } from 'react'

const FotoSelector: React.FC<{ onSelect: (picture: string) => void }> = ({ onSelect }) => {
  const profilePictures = [
    './FotoPerfil/CapyCute.jpg',
    './FotoPerfil/Capyntor.jpg',
    './FotoPerfil/CapyCientifico.jpg',
    './FotoPerfil/CapyBoss.jpg',
    './FotoPerfil/CapyGraduado.jpg',
    './FotoPerfil/CapyC.jpg',
    './FotoPerfil/CapyFit.jpg',
    './FotoPerfil/CapyLimon.jpg',
    './FotoPerfil/CapyMaid.jpg',
    './FotoPerfil/CapyTomate.jpg',
    './FotoPerfil/CapyMoney.jpg',
    './FotoPerfil/CapyCow.jpg',
  ]

  const [selectedPicture, setSelectedPicture] = useState<string | null>(null)

  const handleSelectPicture = (picture: string) => {
    setSelectedPicture(picture)
    onSelect(picture)
  }

  return (
    <div className='grid grid-cols-3 gap-1 max-h-64'>
      {profilePictures.map((picture, index) => (
        <img
          key={index}
          src={picture}
          alt={`Foto ${index}`}
          className={`rounded-full w-24 h-24 object-cover cursor-pointer ${selectedPicture === picture ? 'border-4 shadow-lg border-orange-300' : ''}`}
          onClick={() => handleSelectPicture(picture)}
        />
      ))}
    </div>
  )
}

export default FotoSelector
