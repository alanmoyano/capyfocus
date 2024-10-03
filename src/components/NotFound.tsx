import { Button } from '@/components/ui/button'
import Reproductor from './ComponentesEspecifico/Reproductor'
import { useLocation } from 'wouter'

export default function NotFound() {
  const [, setLocation] = useLocation()
  return (
    <>
      <h1 className='text-3xl font-semibold'>Pagina no encontrada</h1>
      <Reproductor src='/Chicho/CapyDesilucionado.webm' />
      <div className='flex w-1/2 content-center justify-center rounded-lg bg-red-700 p-8 text-white shadow-lg'>
        <p>
          Lo sentimos! La pagina que buscas no existe. Por favor, verifica la
          URL o regresa a la pagina principal.
        </p>
        <Button onClick={() => setLocation('/')}>
          Para regresar a la pagina principal click aquí
        </Button>
      </div>
    </>
  )
}
