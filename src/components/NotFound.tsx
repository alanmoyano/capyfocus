import { Button } from '@/components/ui/button'
import Reproductor from './ComponentesEspecifico/Reproductor'
import { useLocation } from 'wouter'

export default function NotFound() {
  const [, setLocation] = useLocation()
  return (
    <>
      <h1 className='mt-4 text-4xl font-semibold'>
        Lo sentimos la página no ha sido encontrada
      </h1>
      <Reproductor src='/Chicho/CapyDesilucionado.webm' />
      <div className='w-1/2 content-center justify-center rounded-lg bg-red-600 p-8 text-white shadow-lg dark:bg-red-500'>
        <p>
          Lo sentimos! La pagina que buscas no existe. Por favor, verifica la
          URL o regresa a la pagina principal.Para regresar a la pagina
          principal
          <Button
            variant={'link'}
            className='text-white'
            onClick={() => setLocation('/')}
          >
            click aquí
          </Button>
        </p>
      </div>
    </>
  )
}
