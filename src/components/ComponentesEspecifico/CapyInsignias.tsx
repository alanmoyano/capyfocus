import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type CapyInsiginiasProps = {
  img: string
  desc: string
}

function CapyInsiginias({ img, desc }: CapyInsiginiasProps) {
  const [progress, setProgress] = useState(13)
  const [isUnlocked, setIsUnlocked] = useState(false)

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className='card-squere cursor-pointer bg-primary/80 hover:scale-105'>
            <div className='card-squere-inner'>
              <div className='card-squere-content'>
                <div className=''>
                  <div className='mx-auto aspect-[3/4] w-11/12'>
                    {isUnlocked ? (
                      <CapyInsiginias img={img} desc={desc} />
                    ) : (
                      <CapyInsiginias
                        img='./CapyInsigniasImagenes/CapySherlock.png'
                        desc='Bloqueada'
                      />
                    )}
                  </div>
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
    </>
  )
}

export default CapyInsiginias
