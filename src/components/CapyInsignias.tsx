import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'

import CapyInsigniasCards from '@/components/ComponentesEspecifico/ComponenteInsignias'

export default function CapyInsignias() {
  const [, setLocation] = useLocation()


  const handleVolver = () => {
    setLocation('/')
  }


  // la carta hay que clickearla para que se de vuelta y despues, una vez desbloequeda ya no se da mas vuelta.

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyInsiginias!</h1>
      <div className='flex p-10 gap-10 col-span-5'>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyMatrix.png'
            descLock='Estudia 25 veces con motivación pasivo/agresivo'
            descUnlock='Estudiaste 25 veces con motivación pasivo/agresivo'
            capyName='CapyMatrix'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyScout.png'
            descLock='Estudia 25 veces con motivación positiva'
            descUnlock='Estudiaste 25 veces con motivación positiva'
            capyName='CapyExplorador'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='/CapyInsigniasImagenes/MontainCapy.png'
            descLock='Alcanza un evento'
            descUnlock='El dia de tu ansiado evento llegó'
            capyName='MountainCapy'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyLoto.png'
            descLock='Estudia durante 2 horas seguidas'
            descUnlock='Estuviste estudiando durante 2 horas seguidas'
            capyName='CapyLoto'
            progress={100}
          />
        </div>        
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyGandalf.png'
            descLock='Acumula 10 horas de estudio para un evento'
            descUnlock='Acumula 10 horas de estudio para un evento'
            capyName='CapyGandalf'
            progress={100}
          />
        </div>
      </div>
      <div className='flex p-10 gap-10 col-span-5'>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyCanchero.png'
            descLock='Finaliza 5 sesiones de estudio'
            descUnlock='Haz realizado 5 sesiones de estudio'
            capyName='CapyCanchero'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='/CapyInsigniasImagenes/CapyLisa.png'
            descLock='Finaliza 15 sesiones de estudio'
            descUnlock='Haz realizado 15 sesiones de estudio'
            capyName='CapyLisa'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyOsado.png'
            descLock='Finaliza 35 sesiones de estudio'
            descUnlock='Haz realizado 35 sesiones de estudio'
            capyName='CapyOsado'
            progress={100}
          />
        </div>        
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/SuperCapy.png'
            descLock='Finaliza 50 sesiones de estudio'
            descUnlock='Haz realizado 50 sesiones de estudio'
            capyName='SuperCapy'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyGod.png'
            descLock='Finaliza 100 sesiones de estudio'
            descUnlock='Haz realizado 100 sesiones de estudio'
            capyName='CapyGod'
            progress={100}
          />
        </div>
      </div>
      <div className='flex p-10 gap-10 col-span-5'>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyTain.png'
            descLock='Cumple todos los objetivos de una sesión de estudio'
            descUnlock='Haz cumplido todos los objetivos de una sesión de estudio'
            capyName='CapyTain'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/ElCapyDeLaPerla.png'
            descLock='Completa 35 objetivos'
            descUnlock='Haz logrado completar 35 objetivos'
            capyName='Capy De La Perla'
            progress={100}
          />
        </div>        
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyAstronauta.png'
            descLock='Completa 75 objetivos'
            descUnlock='Haz logrado completar 75 objetivos'
            capyName='CapyAstronauta'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='/CapyInsigniasImagenes/WWECapy.png'
            descLock='Completa 100 objetivos'
            descUnlock='Haz logrado completar 100 objetivos'
            capyName='CapyWWE'
            progress={100}
          />
        </div>
        <div>
          <CapyInsigniasCards
            UrlImg='./CapyInsigniasImagenes/CapyAbandonado.png'
            descLock="Pasa 30 dias sin realizar ningnuna sesion de estudio (Don't do it)"
            descUnlock='Descansaste por 30 dias seguidos, es hora de volver'
            capyName='CapyAbandonado'
            progress={100}
          />
        </div>
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
