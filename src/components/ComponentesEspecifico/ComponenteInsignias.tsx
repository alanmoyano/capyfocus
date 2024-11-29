import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { DialogClose } from '@radix-ui/react-dialog'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

export default function CapyInsiginiasCards({
  UrlImg,
  descLock,
  descUnlock,
  capyName,
  progress,
  ImgStyle,
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
    setIsUnlocked(progress === 100)
  }, [progress])

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Card
            className={`group cursor-pointer overflow-hidden border-0 drop-shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg ${
              progress === 100 ? 'bg-primary' : 'bg-gray-400'
            } `}
          >
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
              className={`flex justify-center font-medium italic ${!isUnlocked && 'text-muted dark:text-slate-100'} `}
            >
              {isUnlocked ? 'Desbloqueada!' : 'CapyBloqueada'}
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{isUnlocked ? capyName : 'CapyBloqueada'}</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col items-center gap-4'>
            <div className='relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-accent'>
              <img
                src={isUnlocked ? UrlImg : bloqueada}
                alt='HidenInsignia'
                className='object-cover'
              />
            </div>
            <div className='text-center'>
              {!isUnlocked && (
                <h2 className='text-lg font-semibold'>Para desbloquear: </h2>
              )}
              <p>{isUnlocked ? descUnlock : descLock}</p>
            </div>
            <Progress value={progress} className='w-3/4' />
            {
              progress
            }%
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant='accent'>Salir</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
