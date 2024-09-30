import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'

import CapyInsigniasCards from '@/components/ComponentesEspecifico/ComponenteInsignias'
import { useEffect, useState } from 'react'
import { supabase } from './supabase/client'

type Insignia = {
  id: string
  nombre: string
  descripcionBloqueada: string
  descripcionDesbloqueada: string
}

export default function CapyInsignias() {
  const [insignias, setInsignias] = useState<Insignia[]>([])
  const [, setLocation] = useLocation()

  useEffect(() => {
    async function getInsingias() {
      const insignias = await supabase.from('CapyInsignias').select('*')
      return insignias.data
    }

    getInsingias()
      .then(data => {
        if (!data) return

        console.log(data)
        setInsignias(data)
      })
      .catch((error: unknown) => console.error(error))
  }, [])

  const handleVolver = () => {
    setLocation('/')
  }

  // la carta hay que clickearla para que se de vuelta y despues, una vez desbloequeda ya no se da mas vuelta.

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyInsiginias!</h1>
      <div className='grid grid-cols-1 gap-10 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {insignias.map(insignia => (
          <CapyInsigniasCards
            key={insignia.id}
            UrlImg={`CapyInsigniasImagenes/${insignia.nombre}.webp`}
            descLock={insignia.descripcionBloqueada}
            descUnlock={insignia.descripcionDesbloqueada}
            capyName={insignia.nombre}
            progress={100}
          />
        ))}
      </div>
      <div className='container w-screen'>
        <Button className='mt-4' onClick={handleVolver}>
          Volver
        </Button>
      </div>

      {/*       <span className='relative inline-flex'>
        <Button type='button' className=''>
          Transactions
        </Button>
        <span className='absolute right-0 top-0 -mr-1 -mt-1 flex h-3 w-3'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75'></span>
          <span className='relative inline-flex h-3 w-3 rounded-full bg-secondary'></span>
        </span>
      </span> */}
    </>
  )
}
