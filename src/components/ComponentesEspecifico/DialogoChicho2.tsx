import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabase/client'

type Dialogo = {
  id: number
  tipoMotivacion: number
  mensaje: string
}

function selectRandomDialogo(dialogos: Dialogo[]) {
  const randomIndex = Math.floor(Math.random() * dialogos.length)
  return dialogos[randomIndex]
}

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

export default function DialogoChicho2({
  motivation,
  animacion
}: {
  motivation?: string
  animacion: string
}) {
  const [dialogos, setDialogos] = useState<Dialogo[]>([])
  const [dialogo, setDialogo] = useState('') // Usamos useState para actualizar el diálogo
  const intervalIdRef = useRef<number | null>(null) // Referencia para almacenar el ID del intervalo
  const motivacion = parseMotivation(motivation)

  useEffect(() => {
    async function getDialogos() {
      const res =
        motivacion === null
          ? await supabase
              .from('Mensajes')
              .select()
              .is('tipoMotivacion', motivacion)
          : await supabase
              .from('Mensajes')
              .select()
              .eq('tipoMotivacion', motivacion)

      return res.data
    }

    getDialogos()
      .then((data: Dialogo[] | null) => {
        if (!data) return
        setDialogos(data)
        setDialogo(selectRandomDialogo(data).mensaje)

        // Limpiamos cualquier intervalo existente antes de configurar uno nuevo
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current)
        }
        if (motivacion === null) {
          intervalIdRef.current = window.setInterval(() => {
            setDialogo(selectRandomDialogo(data).mensaje)
          }, 30000)
        } else {
          intervalIdRef.current = window.setInterval(() => {
            setDialogo(selectRandomDialogo(data).mensaje)
          }, 120000)
        }
      })
      .catch((error: unknown) => console.error(error))

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [motivacion])

  return (
    <>
      {animacion === 'Nada' && dialogos.length > 0 && (
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
      {animacion !== 'Nada' && <div className='mt-20'></div>}
    </>
  )
}
