/* import { useState, useEffect } from 'react';
 */
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
  'Desilucionado',
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

export default function AnimacionChicho({
  motivation
}: {
  motivation?: string
}) {

  const motivacion = parseMotivation(motivation)
  //Agarro un numero random
  function getRandomIndex(array: string[]): number {
    return Math.floor(Math.random() * array.length)
  }

  console.log(motivacion)

  console.log(getAnimacion())

  function getAnimacion() {
    if (motivacion === 1) {
      const NumAnimacion = getRandomIndex(animacionesPositivas)
      return animacionesPositivas[NumAnimacion]
    } else {
      const NumAnimacion = getRandomIndex(animacionesNegativas)
      return animacionesNegativas[NumAnimacion]
    }
  }
  console.log(`./Chicho/Negativo/Capy${getAnimacion()}.gif`)

  return (
    <>
      <div>
        {motivacion === 1 && (
          <img
            src={`./Chicho/Negativo/Capy${getAnimacion()}.gif`}
            alt=''
          />
        )
        
        }
        {motivacion === 2  && (
          <img
            src={`./Chicho/Positivo/Capy${getAnimacion()}.gif`}
            alt=''
          />
        )}
      </div>
      {motivacion === 2  && (
        <img src='./Chicho/Negativo/CapySky.gif' alt='' />
      )}
    </>
  )
}
