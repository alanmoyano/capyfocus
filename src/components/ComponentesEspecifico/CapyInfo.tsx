import { toast } from 'sonner'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CapyInfo({ desc }: { desc: string }) {
  return (
    <>
      <Button
        variant={'icon'}
        size={'icon'}
        className=''
        onClick={() =>
          toast.info('CapyInfo', {
            description: desc,
            duration: 10000,
          })
        }
      >
        <Info />
      </Button>
    </>
  )
}
