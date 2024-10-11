import { useRef, useState } from 'react'

import {
  Tooltip as ChartTooltip,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
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
import { Calendar } from '@components/ui/calendar'
import { formatTime } from '@/lib/utils'

//Lo siguiente se va a ir fuertemente cuando este implementada la BD:
import { useObjetivos } from '@contexts/ObjetivosContext'

//Elementos de la gráfica:
const chartData1 = [
  { month: 'Enero', desktop: 186, mobile: 80 },
  { month: 'Febrero', desktop: 305, mobile: 200 },
  { month: 'Marzo', desktop: 237, mobile: 120 },
  { month: 'Abril', desktop: 73, mobile: 190 },
  { month: 'Mayo', desktop: 209, mobile: 130 },
  { month: 'Junio', desktop: 214, mobile: 140 },
]
const chartConfig = {
  desktop: {
    label: 'Cumplidos',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Pendientes',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

type Period =
  | 'sesion'
  | 'semanal'
  | 'mensual'
  | 'bimestral'
  | 'semestre'
  | 'evento'

export default function EstadisticasPeriodo({ period }: { period: Period }) {
  const cardRefs = {
    sesion: useRef(null),
    semanal: useRef(null),
    mensual: useRef(null),
    bimestral: useRef(null),
    semestre: useRef(null),
    evento: useRef(null),
  }

  const { objetivos, tiempo } = useObjetivos()
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <>
      <Card
        ref={cardRefs[period]}
        className='container mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg md:flex-row dark:from-gray-800 dark:to-gray-900 dark:shadow-gray-800'
      >
        <CardHeader>
          <CardTitle>
            <h1 className='text-left text-3xl font-bold'>
              Resumen {period} de Sesiones de Estudio
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
                  value: formatTime(2000),
                },
                { label: 'Total de objetivos', value: 800 },
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
                  Registro de objetivos
                </CardTitle>
              </CardHeader>
              <CardContent className='p-3'>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width='100%' height={250}>
                    <BarChart accessibilityLayer data={chartData1}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey='month'
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value: string) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            formatType='integer'
                            indicator='line'
                          />
                        }
                      />
                      <Bar
                        dataKey='desktop'
                        fill='var(--color-desktop)'
                        radius={4}
                      />
                      <Bar
                        dataKey='mobile'
                        fill='var(--color-mobile)'
                        radius={4}
                      />
                    </BarChart>
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
          <h2 className='mb-4 text-2xl font-bold'>
            Objetivos de las Sesiones {period}
          </h2>
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
