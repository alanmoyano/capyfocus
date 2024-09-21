import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'

export default function CapyInsignias() {
  const [, setLocation] = useLocation()

  const handleVolver = () => {
    setLocation('/')
  }
  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyInsiginias!</h1>
      <div className='cards-grid mt-8'>
        <div className='flip-card w-64 h-96'>
          <div className='flip-card-inner w-full h-full transition-transform duration-1000 transform-style-preserve-3d hover:rotate-y-180'>
            <div className='flip-card-front absolute w-full h-full backface-hidden'>
              <div className='flex flex-col items-center justify-center h-full'>
                <h3
                  className='mt-2 text-3xl text-gray-700'
                  style={{ fontFamily: 'Jomolhari, serif' }}
                >
                  CapyCard!
                </h3>
                <div className='relative mx-auto mt-4 aspect-[3/4] w-11/12 overflow-hidden rounded-b-full rounded-t-full border-2 border-gray-700 bg-accent'>
                  <img
                    src='./CapyInsigniasImagenes/CapySherlock.png'
                    alt='Insignia'
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
            <div className='flip-card-back absolute w-full h-full backface-hidden rotate-y-180 bg-gray-100 flex flex-col items-center justify-center p-4'>
              <h3 className='text-2xl font-bold mb-4'>CapyCard!</h3>
              <p className='text-center'>
                Haz seleccionado 25 veces estudiar con motivación positiva
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=''>
        <Button className='mt-4' onClick={handleVolver}>
          Volver
        </Button>
        <Button variant='secondary'> Desbloquear Insignia</Button>
      </div>
    </>
  )
}
