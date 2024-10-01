import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { DialogClose } from '@radix-ui/react-dialog'

import '@/brenda.css'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card'

export default function CapyInsiginiasCards({
  UrlImg,
  descLock,
  descUnlock,
  capyName,
  progress,
  ImgStyle
}: {
  UrlImg: string
  descLock: string
  descUnlock: string
  capyName: string
  progress: number
  ImgStyle?: React.CSSProperties
}) {
  const bloqueada = './CapyInsigniasImagenes/CapySherlock.webp'
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false)

  useEffect(() => {
    if (progress === 100) {
      setIsUnlocked(true)
    }
  }, [progress])

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Card className='group cursor-pointer overflow-hidden bg-primary transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='text-center text-xl'>{capyName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='relative flex aspect-square items-center justify-center overflow-hidden rounded-md'>
                <img
                  src={isUnlocked ? UrlImg : bloqueada}
                  style={ImgStyle}
                  alt='HidenInsignia'
                  className='object-cover'
                />
              </div>
            </CardContent>
            <CardFooter
              className={`flex justify-center font-medium italic ${!isUnlocked && 'text-muted'}`}
            >
              {isUnlocked ? 'Desbloqueada!' : 'CapyBloqueada'}
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            {isUnlocked && <DialogTitle>{capyName}</DialogTitle>}
            {!isUnlocked && <DialogTitle>CapyBloqueada</DialogTitle>}
          </DialogHeader>
          <div className='flex flex-col items-center'>
            {isUnlocked && (
              <>
                <div className='relative h-80 w-full overflow-hidden rounded-lg bg-accent'>
                  <img
                    src={UrlImg}
                    alt='HidenInsignia'
                    className='absolute inset-0 h-full w-full object-contain p-4'
                  />
                </div>
                <div className='mt-4 text-center'>
                  <p>{descUnlock}</p>
                </div>
                <Progress value={progress} className='w-3/4' />
              </>
            )}
            {!isUnlocked && (
              <>
                <div className='relative h-80 w-full overflow-hidden rounded-lg bg-accent'>
                  <img
                    src={bloqueada}
                    alt='HidenInsignia'
                    className='absolute inset-0 h-full w-full object-contain p-4'
                  />
                </div>
                <div className='mt-4 text-center'>
                  <h2 className='text-lg font-semibold'>Para desbloquear: </h2>
                  <p>{descLock}</p>
                </div>
                <Progress value={progress} className='w-3/4' />
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose>
              <Button className='' variant={'accent'}>
                Salir
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
