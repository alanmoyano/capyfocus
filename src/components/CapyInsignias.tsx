import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

export default function CapyInsignias() {
  const [, setLocation] = useLocation()
  const [progress, setProgress] = useState(13)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [activado, setActivado] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleVolver = () => {
    setLocation('/')
  }

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setIsUnlocked(true)
    }
  }, [progress])

  const handleClick = () => {
    setActivado(true)
  }

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  // la carta hay que clickearla para que se de vuelta y despues, una vez desbloequeda ya no se da mas vuelta. 

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyInsiginias!</h1>

      <div className='cards-grid mt-8 flex justify-center gap-8'>
        <div
          className={`flip-card h-96 w-64 transition-all duration-300 ${isFlipped ? 'is-flipped' : ''}`}
          onClick={handleCardClick}
        >
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <div className='flex h-full flex-col items-center justify-center'>
                <h3
                  className='mt-2 text-3xl text-gray-700'
                  style={{ fontFamily: 'Jomolhari, serif' }}
                >
                  CapyCard!
                </h3>
                <div className='relative mx-auto mt-4 aspect-[3/4] w-11/12 overflow-hidden rounded-b-full rounded-t-full border-2 border-gray-700 bg-accent'>
                  <img
                    src='./CapyInsigniasImagenes/CapySherlock.png'
                    alt='HidenInsignia'
                    className='absolute inset-0 h-full w-full object-contain p-4'
                  />
                </div>
                <h3
                  className='mt-4 rotate-180 text-3xl text-gray-700'
                  style={{ fontFamily: 'Jomolhari, serif' }}
                >
                  CapyCard!
                </h3>
              </div>
            </div>
            <div className='flip-card-back backface-hidden rotate-y-180 absolute flex h-full w-full flex-col items-center justify-center bg-gray-100 p-4'>
              <h3 className='mb-4 text-2xl font-bold'>CapyCard!</h3>

              <p className=''>Prgreso: </p>
              <Progress value={progress} className='w-3/4' />
              <p className='text-center'>
                Selecciona 25 veces estudiar con motivación positiva
              </p>

              <Button>Desbloquear</Button>
            </div>
          </div>
        </div>

        {/* Insignia desbloqueada */}

        <div 
          className='static-card h-96 w-64 transition-all duration-300 cursor-pointer'
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const card = e.currentTarget;
            card.style.transform = card.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
          }}
        >
          <div className='static-card-inner'>
            <div className='static-card-content'>
              <div className='flex h-full flex-col items-center justify-center'>
                <h3
                  className='mt-2 text-3xl text-gray-700'
                  style={{ fontFamily: 'Jomolhari, serif' }}
                >
                  CapyCard!
                </h3>
                <div className='relative mx-auto mt-4 aspect-[3/4] w-11/12 overflow-hidden rounded-b-full rounded-t-full border-2 border-gray-700 bg-accent'>
                  <img
                    src='./CapyInsigniasImagenes/CapyGandalf.png'
                    alt='HidenInsignia'
                    className='absolute inset-0 h-full w-full object-contain p-4'
                  />
                </div>
                <h3
                  className='mt-4 rotate-180 text-3xl text-gray-700'
                  style={{ fontFamily: 'Jomolhari, serif' }}
                >
                  CapyCard!
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container w-screen'>
        <Button className='mt-4' onClick={handleVolver}>
          Volver
        </Button>
      </div>
    </>
  )
}
