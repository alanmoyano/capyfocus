import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { ImageDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  Tooltip as ChartTooltip,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from 'recharts'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart'

import Reproductor from './Reproductor'

//Lo siguiente se va a ir fuertemente cuando este implementada la BD:

import { useObjetivos } from '@contexts/ObjetivosContext'

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger
// } from '@/components/ui/tooltip'
import { Calendar } from '@components/ui/calendar'
import { ChartLegend, ChartLegendContent } from '@components/ui/chart'

import { formatTime } from '@/lib/utils'
import useSearchParams from '@hooks/useSearchParams'

const chartConfig1: ChartConfig = {
  visitors: {
    label: 'Objetivos',
  },
  chrome: {
    label: 'Objetivo1',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Objetivo2',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Objetivo3',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Objetivo4',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Objetivo5',
    color: 'hsl(var(--chart-5))',
  },
}
export default function EstadisticasPeriodo({ period }: { period: string }) {
  const cardRefs = {
    sesion: useRef(null),
    semanal: useRef(null),
    mensual: useRef(null),
    bimestral: useRef(null),
    seisMeses: useRef(null),
  }

  const captureScreenshot = async () => {
    // @ts-expect-error 7053 no seas molesto typescript
    if (cardRefs[period].current) {
      // @ts-expect-error 7053 no seas molesto typescript
      const canvas = await html2canvas(cardRefs[period].current as HTMLElement)
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = `capyestadisticas_${period}.png`
      link.click()
    }
  }
  const { objetivos, tiempo } = useObjetivos()
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <>
      <div className='mr-12 flex w-full justify-end'>
        <Button
          variant='ghost'
          onClick={() => captureScreenshot()}
          className=''
        >
          <ImageDown className='mr-2 h-4 w-4' />
          Capturar
        </Button>
      </div>
      <Card
        ref={cardRefs.semanal}
        className='container mx-auto mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg'
      >
        <CardHeader>
          <CardTitle>
            <h1 className='text-left text-3xl font-bold'>
              Resumen Semanal de Sesiones de Estudio
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col justify-between gap-8 md:flex-row'>
          <div className='md:w-1/2'>
            <div className='grid grid-cols-2 gap-6'>
              {/* Aca va a ir lo que se consulte en la BD  */}
              {[
                {
                  label: 'Tiempo total de estudio',
                  value: 20,
                },
                { label: 'Total de objetivos', value: 3 },
                {
                  label: 'Objetivos cumplidos',
                  value: 5 - 2,
                },
                {
                  label: 'Objetivos pendientes',
                  value: 5,
                },
                {
                  label: 'Tipo de motivación preferida',
                  value: 'Positiva',
                },
                {
                  label: 'Música preferida',
                  value: 'CapyChill',
                },
                {
                  label: 'Técnica de estudio más frecuente',
                  value: 'Capydoro',
                },
                {
                  label: 'Mayor racha de días',
                  value: 5,
                },
              ].map(({ label, value }, index) => (
                <div key={index} className='rounded-lg bg-white p-2 shadow-md'>
                  <p className='mb-2 rounded-lg bg-primary p-2 text-sm font-semibold text-gray-800'>
                    {label}
                  </p>
                  <p className='text-lg font-bold text-gray-800'>{value}</p>
                </div>
              ))}
            </div>
            <div className='mt-8 flex justify-center'>
              <Reproductor src='/auto.webm' className='w-1/2' />
            </div>
          </div>

          <div className='space-y-6 md:w-1/2'>
            <Card className='overflow-hidden rounded-lg shadow-md'>
              <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-2'>
                <CardTitle className='text-lg font-bold text-gray-900'>
                  Objetivos Favoritos
                </CardTitle>
              </CardHeader>
              <CardContent className='p-3'>
                <ChartContainer config={chartConfig1}>
                  <ResponsiveContainer width='100%' height={250}>
                    <PieChart>
                      <Pie
                        data={objetivos
                          .filter(objetivo => tiempo[objetivo] > 0)
                          .map(objetivo => ({
                            name: objetivo,
                            value: tiempo[objetivo] ?? 0,
                          }))}
                        labelLine={false}
                        outerRadius='70%'
                        dataKey='value'
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {objetivos
                          .filter(objetivo => tiempo[objetivo] > 0)
                          .map((objetivo, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                chartConfig1[
                                  Object.keys(chartConfig1)[index + 1]
                                ].color ?? `hsl(${index * 90}, 70%, 60%)`
                              }
                              name={objetivo}
                            />
                          ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            indicator='dot'
                            formatType='time'
                          />
                        }
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className='overflow-hidden rounded-lg shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-3'>
                <CardTitle className='text-lg font-bold text-gray-900'>
                  Días Conectado
                </CardTitle>
              </CardHeader>
              <CardContent className='p-2'>
                <div className='flex flex-col md:flex-row'>
                  <div className='md:w-1/2'>
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={setDate}
                      className='rounded-md border text-sm shadow-sm'
                    />
                  </div>
                  <div className='pl-4 md:w-1/2'>
                    <h1 className='mb-2 text-lg font-semibold'>Eventos</h1>
                    {/* Lista de eventos */}
                    <p>11/07 Brenda conquista el mundo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>

        <div className='px-6 pb-6'>
          <h2 className='mb-4 text-2xl font-bold'>Objetivos de las Sesiones</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creado</TableHead>
                <TableHead className='text-right'>Tiempo Acumulado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objetivos.map((objetivo, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>{objetivo}</TableCell>
                  <TableCell>{objetivo}</TableCell>
                  <TableCell>
                    {tiempo[objetivo] === 0 ? (
                      <span className='rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800'>
                        Pendiente
                      </span>
                    ) : (
                      <span className='rounded-full bg-green-200 px-2 py-1 text-xs font-semibold text-green-800'>
                        Cumplido
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className='text-blue-700'>Activo</span>
                  </TableCell>
                  <TableCell className='text-right font-medium'>
                    {formatTime(tiempo[objetivo] || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  )
}
