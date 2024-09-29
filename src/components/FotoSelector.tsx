import React, { useState } from 'react';

const FotoSelector: React.FC<{ onSelect: (picture: string) => void }> = ({ onSelect }) => {
  const profilePictures = [
    '../../public/FotoPerfil/CapyCute.jpg',
    '../../public/FotoPerfil/Capyntor.jpg',
    '../../public/FotoPerfil/CapyCientifico.jpg',
    '../../public/FotoPerfil/CapyBoss.jpg',
    '../../public/FotoPerfil/CapyGraduado.jpg',
    '../../public/FotoPerfil/CapyC.jpg',
    '../../public/FotoPerfil/CapyFit.jpg',
    '../../public/FotoPerfil/CapyLimon.jpg',
    '../../public/FotoPerfil/CapyMaid.jpg',
    '../../public/FotoPerfil/CapyTomate.jpg',
    '../../public/FotoPerfil/CapyMoney.jpg',
    '../../public/FotoPerfil/CapyCow.jpg',
  ]

  const [selectedPicture, setSelectedPicture] = useState<string | null>(null)

  const handleSelectPicture = (picture: string) => {
    setSelectedPicture(picture)
    onSelect(picture)
  }

  return (
    <div className="grid grid-cols-3 gap-1 max-h-64">
      {profilePictures.map((picture, index) => (
        <img
          key={index}
          src={picture}
          alt={`Foto ${index}`}
          className={`rounded-full w-24 h-24 object-cover cursor-pointer ${selectedPicture === picture ? 'border-4 border-green-500' : ''}`}
          onClick={() => handleSelectPicture(picture)}
        />
      ))}
    </div>
  )
}

export default FotoSelector
