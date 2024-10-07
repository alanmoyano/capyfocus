import React, { useState } from 'react'

const FotoSelector: React.FC<{ onSelect: (picture: string) => void }> = ({
  onSelect,
}) => {
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
    './FotoPerfil/CapyAlan.jpg',
    './FotoPerfil/CapyAventurero.jpg',
    './FotoPerfil/CapyBarista.jpg',
    './FotoPerfil/CapyCaballo.jpg',
    './FotoPerfil/CapyCop.jpg',
    './FotoPerfil/CapyCuca.jpg',
    './FotoPerfil/CapyDetective.jpg',
    './FotoPerfil/CapyDibujante.jpg',
    './FotoPerfil/CapyEnfermero.jpg',
    './FotoPerfil/CapyGimnasta.jpg',
    './FotoPerfil/CapyEstudiante.jpg',
    './FotoPerfil/CapyHelado.jpg',
    './FotoPerfil/CapyIngeniero.jpg',
    './FotoPerfil/CapyMedico.jpg',
    './FotoPerfil/CapyPensante.jpg',
    './FotoPerfil/CapyPerro.jpg',
    './FotoPerfil/CapyPresentador.jpg',
    './FotoPerfil/CapyProfe.jpg',
    './FotoPerfil/CapyReparador.jpg',
    './FotoPerfil/CapyRepostero.jpg',
    './FotoPerfil/CapySandia.jpg',
    './FotoPerfil/CapyTenista.jpg',
    './FotoPerfil/CapyWorker.jpg',
    './FotoPerfil/CapyZorro.jpg',
  ]

  const [selectedPicture, setSelectedPicture] = useState<string | null>(null)

  const handleSelectPicture = (picture: string) => {
    setSelectedPicture(picture)
    onSelect(picture)
  }

  return (
    <div className='grid max-h-64 grid-cols-3 gap-1'>
      {profilePictures.map((picture, index) => (
        <img
          key={index}
          src={picture}
          alt={`Foto ${index}`}
          className={`h-24 w-24 cursor-pointer rounded-full object-cover ${selectedPicture === picture ? 'border-4 border-orange-300 shadow-lg' : ''}`}
          onClick={() => handleSelectPicture(picture)}
        />
      ))}
    </div>
  )
}

export default FotoSelector
