import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

/* 
  UrlImg: string,
  descLock: string,
  descUnlock: string,
  capyName: string,
  progress: number

 */

export default function CapyInsiginiasCards({
  UrlImg,
  descLock,
  descUnlock,
  capyName,
  progress
}: {
  UrlImg: string
  descLock: string
  descUnlock: string
  capyName: string
  progress: number
}) {
  const bloqueada = './CapyInsigniasImagenes/CapySherlock.png'
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
          <div className='card-squere cursor-pointer bg-primary/80 hover:scale-105'>
            <div className='card-squere-inner'>
              <div className='card-squere-content'>
                <div className=''>
                  <div className='mx-auto aspect-[3/4] w-11/12'>
                    {isUnlocked && (
                      <>
                        <div className=''>
                          <div className='mx-auto aspect-[3/4] w-11/12'>
                            <div className='imagen'>
                              <img
                                src={UrlImg}
                                alt='HidenInsignia'
                                className='absolute inset-0 h-full w-full object-contain p-4'
                              />
                              <p
                                className='absolute left-0 top-2 w-full bg-transparent text-center text-xl font-semibold text-gray-700'
                                style={{ fontFamily: 'Jomolhari, serif' }}
                              >
                                {capyName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {!isUnlocked && (
                      <>
                        <div>
                          <div className='container flex h-full w-full justify-center text-center'>
                            <img
                              src={bloqueada}
                              alt='HidenInsignia'
                              className='absolute inset-0 h-full w-full object-contain p-4'
                            />
                            <p
                              className='bottom mt-4 flex text-center text-xl font-bold text-gray-700'
                              style={{ fontFamily: 'Jomolhari, serif' }}
                            >
                              CapyBloqueada
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <Button className=''>Salir</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
