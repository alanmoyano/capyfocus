import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

//TODO agregar pasos para recuperar contraseña y enviar mail


export default function PasswordRecovery() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button type='button' variant='link'>
            Recuperar
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Recuperar contraseña</DialogTitle>
            <DialogDescription>
              Para recuperar la contraseña sigue los siguientes pasos.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Label htmlFor='name' className=''>
              Mail o usuario registrado
            </Label>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Input
                id='Name'
                type='text'
                className='col-span-3 dark:placeholder:text-gray-500'
                placeholder='Chicho'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Recuperar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
