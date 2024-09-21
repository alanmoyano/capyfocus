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
        <div className='flip-card'>
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <div className='flex flex-col items-center justify-center'>
                <h3
                  className='mt-2 text-3xl text-gray-700'
                  style={{ fontFamily: 'Jomolhari, serif' }}
                >
                  CapyCard!
                </h3>
              </div>
              <div className='relative mx-auto mt-4 aspect-[3/4] w-11/12 overflow-hidden rounded-b-full rounded-t-full border-2 border-gray-700 bg-accent'>
                <img
                  src='./CapyInsigniasImagenes/CapySherlock.png'
                  alt='Insignia'
                  className='absolute inset-0 h-full w-full object-contain p-4'
                />
              </div>
              <div className='flex flex-col items-center justify-center'>
                <h3
                  className='mt-4 rotate-180 text-3xl text-gray-700'
                  style={{ fontFamily: 'Jomolhari, serif' }}
                >
                  CapyCard!
                </h3>
              </div>
              <div className='flip-card-back'></div>
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
