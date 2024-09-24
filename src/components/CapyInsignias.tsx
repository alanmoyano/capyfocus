import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CapyInsignias() {
  const [, setLocation] = useLocation()
  const [progress, setProgress] = useState(13)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [activado, setActivado] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleVolver = () => {
    setLocation('/')
  }

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setIsUnlocked(true)
    }
  }, [progress])

  const handleClick = () => {
    setActivado(true)
  }

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  // la carta hay que clickearla para que se de vuelta y despues, una vez desbloequeda ya no se da mas vuelta.

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyInsiginias!</h1>


      <div className='flex justify-center gap-4 space-x-4 mt-4'>
        <Dialog>
          <DialogTrigger asChild>
            <div className='card-squere cursor-pointer bg-primary/80 hover:scale-105'>
              <div className='card-squere-inner'>
                <div className='card-squere-content'>
                  <div className=''>
                    <div className='mx-auto aspect-[3/4] w-11/12'>
                      <img
                        src='./CapyInsigniasImagenes/CapyGandalf.png'
                        alt='HidenInsignia'
                        className='absolute inset-0 h-full w-full object-contain p-4'
                      />
                    </div>
                    <p
                      className='mt-8 text-xl font-bold text-gray-700'
                      style={{ fontFamily: 'Jomolhari, serif' }}
                    >
                      CapyGandalf
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>CapyGandalf</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className='flex flex-col items-center'>
              <div className='relative h-80 w-full overflow-hidden rounded-lg bg-accent'>
                <img
                  src='./CapyInsigniasImagenes/CapyGandalf.png'
                  alt='HidenInsignia'
                  className='absolute inset-0 h-full w-full object-contain p-4'
                />
              </div>
              <div className='mt-4 text-center'>
                <h2 className='text-2xl font-bold'>Desbloqueada </h2>
                <p>Completa 10 objetivos</p>
              </div>
              <Progress value={100} className='w-3/4' />
            </div>
            <DialogFooter>
              <Button type='submit'>Salir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <div className='card-squere cursor-pointer bg-primary/80 hover:scale-105'>
              <div className='card-squere-inner'>
                <div className='card-squere-content'>
                  <div className=''>
                    <div className='mx-auto aspect-[3/4] w-11/12'>
                      <img
                        src='./CapyInsigniasImagenes/CapySherlock.png'
                        alt='HidenInsignia'
                        className='absolute inset-0 h-full w-full object-contain p-4'
                      />
                    </div>
                    <p
                      className='mt-16 text-xl font-bold text-gray-700'
                      style={{ fontFamily: 'Jomolhari, serif' }}
                    >
                      Bloqueada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Bloqueada</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className='flex flex-col items-center'>
              <div className='relative h-80 w-full overflow-hidden rounded-lg bg-accent'>
                <img
                  src='./CapyInsigniasImagenes/CapySherlock.png'
                  alt='HidenInsignia'
                  className='absolute inset-0 h-full w-full object-contain p-4'
                />
              </div>
              <div className='mt-4 text-center'>
                <h2 className='text-2xl font-bold'>Desbloquear: </h2>
                <p>Completa 25 objetivos</p>
              </div>
              <Progress value={progress} className='w-3/4' />
            </div>
            <DialogFooter>
              <Button type='submit'>Salir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='container w-screen'>
        <Button className='mt-4' onClick={handleVolver}>
          Volver
        </Button>
      </div>

      <span className='relative inline-flex'>
        <Button type='button' className=''>
          Transactions
        </Button>
        <span className='absolute right-0 top-0 -mr-1 -mt-1 flex h-3 w-3'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75'></span>
          <span className='relative inline-flex h-3 w-3 rounded-full bg-secondary'></span>
        </span>
      </span>
    </>
  )
}
