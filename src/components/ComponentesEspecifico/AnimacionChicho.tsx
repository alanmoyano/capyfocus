const animacionesPositivas = [
  'Bubble',
  'Calabaza',
  'Charco',
  'Cocinero',
  'Compras',
  'Durmiendo',
  'Fire'
]
const animacionesNegativas = ['Cocodrilo', 'Computadora', 'Fiaca']

export default function AnimacionChicho() {
  function getRandomIndex(array: string[]): number {
    return Math.floor(Math.random() * array.length)
  }

  function getRandomElement(array: string[]): string {
    const randomIndex = getRandomIndex(array)
    return array[randomIndex]
  }

  const randomElement = getRandomElement(animacionesNegativas)

  return (
    <>
      <div>   
        <img src={`./Chicho/Negativo/Capy${randomElement}.gif`} alt='' />
      </div>
    </>
  )
}
