import { useEffect, useState } from 'react'
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

export default function DialogoChicho({ dialogo }: { dialogo: string }) {
  const [dialogos, setDialogos] = useState<Dialogo[]>([])

  useEffect(() => {
    async function getDialogos() {
      const { data } = await supabase
        .from('Mensajes')
        .select()
        .is('tipoMotivacion', null)

      return data
    }

    getDialogos()
      .then(data => {
        if (!data) return

        console.log(data)
        setDialogos(data)
      })
      .catch((error: unknown) => console.error(error))
  }, [])

  return (
    <>
      {dialogos.length > 0 && (
        <div className='flex w-full justify-end'>
          <div className='relative max-w-xs rounded-xl border-[2px] border-gray-800 bg-gray-100 p-4 text-gray-800 shadow-md'>
            <p>{selectRandomDialogo(dialogos).mensaje}</p>
            <p>{dialogo}</p>
            <div className='absolute bottom-[-10px] translate-x-[240px] transform'>
              <div className='relative'>
                {/* Triángulo con bordes oscuros */}
                <div className='absolute -top-[10px] border-[11px] border-transparent border-t-gray-800'></div>
                {/* Triángulo blanco más pequeño dentro del anterior */}
                <div className='absolute -right-[19px] -top-[10px] border-[8px] border-transparent border-t-gray-100'></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
