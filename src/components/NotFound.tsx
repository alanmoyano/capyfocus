import { Button } from '@/components/ui/button'
import Reproductor from './ComponentesEspecifico/Reproductor'

export default function NotFound() {
  return (
    <>
      <h1 className='text-3xl font-semibold'>Pagina no encontrada</h1>
      <Reproductor src='/Chicho/CapyDesilucionado.webm' />
      <div className='flex w-1/2 content-center justify-center rounded-lg bg-red-700 p-8 text-white shadow-lg'>
        <p>
          Lo sentimos! La pagina que buscas no existe. Por favor, verifica la
          URL o regresa a la pagina principal.
        </p>
        <Button
          className=''
          variant={'outline'}
          onClick={() => (window.location.href = '/')}
        >
          Para regresar a la pagina principal click aquí
        </Button>
      </div>
    </>
  )
}
