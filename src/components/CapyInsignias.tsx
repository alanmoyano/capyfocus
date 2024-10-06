import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'

import CapyInsigniasCards from '@/components/ComponentesEspecifico/ComponenteInsignias'
import { useEffect, useState } from 'react'
import { supabase } from './supabase/client'
import { Info } from 'lucide-react'
import { toast } from 'sonner'
import CapyInfo from './ComponentesEspecifico/CapyInfo'

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

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyInsiginias!</h1>
      <div className='mr-8 flex w-full justify-end'>
        <CapyInfo desc='A medida que estudies se desbloquedaran CapyInsignias, estas son un reconocimiento a tu esfuerzo y dedicación. ¡Sigue así!' />
      </div>
      <div className='container grid grid-cols-2 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 md:gap-10 md:p-10 lg:grid-cols-4 xl:grid-cols-5'>
        {insignias.map(insignia => (
          <CapyInsigniasCards
            key={insignia.id}
            UrlImg={`CapyInsigniasImagenes/${insignia.nombre}.webp`}
            descLock={insignia.descripcionBloqueada}
            descUnlock={insignia.descripcionDesbloqueada}
            capyName={insignia.nombre}
            progress={
              Number(insignia.id) % 2 === 0 ? 100 : 50
            } /* versión aleatoria! */
            // progress={100}
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
