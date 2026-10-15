import { toast } from 'sonner'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CapyInfo({
  desc,
  label = 'Más información',
}: {
  desc: string
  label?: string
}) {
  return (
    <>
      <Button
        variant={'icon'}
        size={'icon'}
        className=''
        aria-label={label}
        onClick={() =>
          toast.info('CapyInfo', {
            description: desc,
            duration: 10000,
            position: 'bottom-left',
          })
        }
      >
        <Info aria-hidden />
      </Button>
    </>
  )
}
