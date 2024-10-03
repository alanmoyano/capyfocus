import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function PruebaTabla() {
  return (
    <Table className='flex w-1/2 flex-col items-center justify-center'>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>Objetivos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Metodo</TableHead>
          <TableHead className='text-right'>Tiempo (Minutos)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className='font-medium'>Objetivo 1</TableCell>
          <TableCell>Cumplido</TableCell>
          <TableCell>CapyDoro</TableCell>
          <TableCell className='text-right'>12:00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>Objetivo 2</TableCell>
          <TableCell>Pospuesto</TableCell>
          <TableCell>CapyDoro</TableCell>
          <TableCell className='text-right'>58:10</TableCell>
        </TableRow>{' '}
        <TableRow>
          <TableCell className='font-medium'>Objetivo 3</TableCell>
          <TableCell>Cumplido</TableCell>
          <TableCell>CapyMetro</TableCell>
          <TableCell className='text-right'>15:03</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
