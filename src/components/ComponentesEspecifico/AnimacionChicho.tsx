import { useState, useEffect } from 'react'

import { useRef } from 'react'
const animacionesPositivas = [
  'Bubble',
  'Calabaza',
  'Charco',
  'Cocinero',
  'Compras',
  'Durmiendo',
  'Fire',
  'Te',
  'Futbol',
  'Libro',
  'Music',
  'Pancake',
  'Piano',
  'Plantas',
  'Skate',
  'Sombrilla',
  'Tortuga',
]

const animacionesNegativas = [
  'Cocodrilo',
  'Computadora',
  'Fiaca',
  'Jugando',
  'Skate',
  'Sky',
  'Reloj',
  'Nada',
  'Futbol',
  'Music',
  'Piano',
  'Tortuga',
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

export default function AnimacionChicho({
  motivation,
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
  }, [motivacion])

  function getAnimacion() {
    //Esto si o si va primero!
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current)
    }

    if (motivacion === 1) {
      intervalIdRef.current = window.setInterval(() => {
        setAnimation(animacionesPositivas[getRandomIndex(animacionesPositivas)])
      }, 300000)
    }
    if (motivacion === 2) {
      intervalIdRef.current = window.setInterval(() => {
        setAnimation(animacionesNegativas[getRandomIndex(animacionesNegativas)])
      }, 300000)
    }
    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current)
      }
    }
  }

  return (
    <>
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
