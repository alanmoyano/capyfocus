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

export default function CapyGandalf(){
    return(
      <>
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
                  <DialogClose>
                    <Button className=''>Salir</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    
      </>
    )
    }