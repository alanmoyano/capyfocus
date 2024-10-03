import { useState, useEffect } from 'react'

import { useRef } from 'react'
import DialogoChicho2 from './DialogoChicho2'
const animacionesPositivas = [
  'Bubble',
  'Calabaza',
  'Charco',
  'Cocinero',
  'Compras',
  'Durmiendo',
  'Fire',
  'Te'
]

const animacionesNegativas = [
  'Cocodrilo',
  'Computadora',
  'Fiaca',
  'Jugando',
  'Skate',
  'Sky',
  'Reloj'
]

function parseMotivation(motivation?: string) {
  switch (motivation) {
    case 'Positiva':
      return 1
    case 'Pasivo Agresiva':
      return 2
    default:
      return null
  }
}

export default function AnimacionChicho2({
  motivation
}: {
  motivation?: string
}) {
  const intervalIdRef = useRef<number | null>(null)
  const motivacion = parseMotivation(motivation)
  const [animation, setAnimation] = useState<string>('Nada')
  //Agarro un numero random
  function getRandomIndex(array: string[]): number {
    return Math.floor(Math.random() * array.length)
  }

  useEffect(() => {
    getAnimacion()
    return () => {
      // Cleanup al desmontar o cambiar motivación
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [motivacion])

  function getAnimacion() {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current)
    }

    if (motivacion === 1) {
      intervalIdRef.current = window.setInterval(() => {
        setAnimation(prev => (prev === 'Nada' ? animacionesPositivas[getRandomIndex(animacionesPositivas)] : 'Nada'))
      }, 5000)
    } else if (motivacion === 2) {
      intervalIdRef.current = window.setInterval(() => {
        setAnimation(animacionesNegativas[getRandomIndex(animacionesNegativas)])
      }, 10000)
    }
  }

  console.log(`./Chicho/Negativo/Capy${animation}.gif`)

  return (
    <>
    <DialogoChicho2 motivation={motivation} animacion={animation} />
      <div className='h-auto w-full'>
        {motivacion === 1 && (
          <img src={`./Chicho/Positivo/Capy${animation}.gif`} alt='' />
        )}
        {motivacion === 2 && (
          <img src={`./Chicho/Negativo/Capy${animation}.gif`} alt='' />
        )}
      </div>
    </>
  )
}
