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
        <div className='flip-card h-96 w-64'>
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
              <h5 className='mb-4 text-xl font-bold'>
                Para desbloquear esta insignia
              </h5>
              <p className='text-center'>
                Selecciona 25 veces estudiar con motivación positiva
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
