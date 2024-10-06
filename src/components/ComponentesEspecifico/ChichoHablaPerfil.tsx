import { useEffect, useState} from 'react'
import { supabase } from '../supabase/client'

type Dialogo = {
  NombreImagen: number
  mensaje: string
}
const dialogosPosibles =[
    'Estas fachero con ese avatar, ¿eh?',
    'Definitivamente vas a conquistar el mundo',
    'Bueno, con este avatar seguro que nadie te olvidará… por decirlo de una manera.',
    'Interesante decisión. Te hace ver… diferente, por decir algo.',
    'Elegiste un avatar que va contra corriente. Muy, muy original.',
    'Supongo que alguien tiene que ser el personaje peculiar del grupo… ¿por qué no tú?',
    'Digno de un auténtico personaje de relleno. ¡Pero alguien tiene que hacerlo!',
    'Interesante elección. Se nota que no sigues las tendencias...',
    'Parece que no tienes miedo de causar una impresión fuerte. Demasiado fuerte, quizás.',
    'No cualquiera elegiría este avatar. De hecho, probablemente nadie más lo haría.',
    'Elegiste este avatar… ¡Eso sí que es confiar en tu propia personalidad para sobresalir!',
    'Bueno, parece que alguien decidió que la originalidad está sobrevalorada. ¡Con este avatar queda claro!',
    'Bueno, este avatar tiene una especie de encanto. Muy peculiar. Muy, muy peculiar',
    'Con este avatar, definitivamente eres el rey o reina del "¿qué estaban pensando?"',
    'Al menos con este avatar, nadie te confundirá con alguien normal. ¡Eso es un logro!',
    'Te veo con este avatar y me pregunto: ¿te encanta la atención o es solo una coincidencia?',
    'Es tan peculiar que parece que lo elegiste al azar. ¡Aplausos por ser tan audaz!',

]
function selectRandomDialogo() {
  const randomIndex = Math.floor(Math.random() * dialogosPosibles.length)
  return dialogosPosibles[randomIndex]
}



export default function ChichoHablaPerfil({img} : {img: string}) {
  const [dialogos, setDialogos] = useState<Dialogo[]>([])
  const [dialogo, setDialogo] = useState('¡Hola! ¿Vas a cambiar tus datos? Ya era hora, ¿no?')
  const [cambioImg, setCambioImg] = useState('') 


  useEffect(() => {
    // Cambia el diálogo cuando cambioImg cambie
    setDialogo(selectRandomDialogo())
  }, [cambioImg])

  useEffect(() => {
    function getDialogos() {
      console.log('getDialogos')
    }
  }, [])

  return (
    <>
      {dialogos.length > 0 && (
        <div className='flex w-full justify-end'>
          <div className='relative max-w-xs rounded-xl border-[2px] border-gray-800 bg-gray-100 p-6 text-gray-800 shadow-md'>
            <p>{dialogo}</p>
            <div className='absolute bottom-[-10px] translate-x-[150px] transform'>
              <div className='absolute'>
                {/* Triángulo con bordes oscuros */}
                <div className='absolute -top-[10px] border-[11px] border-transparent border-t-gray-800'></div>
                {/* Triángulo blanco más pequeño dentro del anterior */}
                <div className='absolute -right-[18.5px] -top-[10px] border-[8px] border-transparent border-t-gray-100'></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
