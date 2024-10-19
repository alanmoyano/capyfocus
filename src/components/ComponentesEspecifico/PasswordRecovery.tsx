import { useEffect, useState } from 'react'
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
/* import { ArrowBigLeft } from 'lucide-react'
 */
import { DialogClose } from '@radix-ui/react-dialog'
import Reproductor from './Reproductor'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

//TODO agregar Form a recuperar contraseña

const formSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export default function PasswordRecovery() {
  const [step, setStep] = useState(1)
  const [isLast, setIsLast] = useState(false)
  const [nuevaContraseñaSeteada] = useState(true)

  /*   const handleNuevaContraseñaSeteada = () => {
    setNuevaContraseñaSeteada(true)
  }
 */
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  /*   const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  } */
  const StepIndicator = ({
    step,
    currentStep,
    label,
  }: {
    step: number
    currentStep: number
    label: string
  }) => {
    const isActive = currentStep === step
    const isCompleted = currentStep > step

    useEffect(() => {
      if (currentStep === 3) {
        setIsLast(true)
      }
    }, [currentStep])

    return (
      <div className='flex flex-col items-center'>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-200'} text-white`}
        >
          {isCompleted ? '✓' : step}
        </div>
        <p className='mt-2 text-sm'>{label}</p>
      </div>
    )
  }
  //Formulario de recuperar contraseña:
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  function onSubmit(){
    console.log('submit') //TODO agregar validacion de mail
  }

  const Step1 = () => {
    return (
      <div>
        <div className='grid gap-4 py-4'>
          <Form {...form}>
            <form
              // eslint-disable-next-line
              onSubmit={form.handleSubmit(onSubmit)}
              id='login'
              className='flex flex-col gap-2'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='chicho@capymail.com'
                        className='dark:placeholder:text-gray-500'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className='w-full'>
          <div className='flex justify-end'></div>
        </div>
      </div>
    )
  }

  const Step2 = () => {
    return (
      <div>
        <h2 className='mb-4 text-xl font-bold'>Verifica tu mail</h2>
        <Label className='mb-4'>
          Te hemos enviado un CapyMail con un link para recuperar tu contraseña.
        </Label>
        <div className='flex justify-between'>
          {/*         <Button
            onClick={handleBack}
            className='rounded bg-gray-500 px-4 py-2 text-white'
            variant={'ghost'}
          >
            <ArrowBigLeft />
          </Button>
 */}
        </div>
      </div>
    )
  }

  const Step3 = () => {
    return (
      <div>
        {nuevaContraseñaSeteada ? (
          <div>
            <h2 className='mb-4 text-xl font-bold'>Completado!</h2>
            <p className='mb-4'>Tu contraseña se reestableció con exito.</p>
            <div className='h-1/2'>
              <img
                className='mx-auto h-[100px] w-[100px]'
                src='public\Chicho\OtrasAcciones\CapyOk.gif'
                alt=''
              />
            </div>
          </div>
        ) : (
          <div>
            <h2 className='mb-4 text-xl font-bold'>Ups, hubo un error!</h2>
            <p className='mb-4'>
              Tu contraseña no se pudo reestablecerse con éxito, por favor
              vuelve a intentarlo.
            </p>
            <div className='h-1/2'>
              <Reproductor
                src='/Chicho/OtrasAcciones/CapyDesilucionado.webm'
                className='mx-auto h-[100px] w-[100px]'
              />
            </div>
          </div>
        )}
      </div>
    )
  }
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

          <div className='mx-auto mt-8 w-full max-w-md'>
            <div className='mb-8 flex justify-between'>
              <StepIndicator
                step={1}
                currentStep={step}
                label='Ingresa tu mail'
              />
              <StepIndicator step={2} currentStep={step} label='Mail enviado' />
              <StepIndicator step={3} currentStep={step} label='Completedo' />
            </div>

            <div className='rounded-md border p-4'>
              {step === 1 && <Step1 />}
              {step === 2 && <Step2 />}
              {step === 3 && <Step3 />}
            </div>
          </div>

          <DialogFooter>
            {isLast ? (
              <DialogClose>
                <Button type='button'>Cerrar</Button>
              </DialogClose>
            ) : (
              <Button onClick={handleNext} type='button'>
                Siguiente
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
