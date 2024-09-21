import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { Bar, BarChart, LabelList } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import * as React from 'react'
import { Pie, PieChart, CartesianGrid, XAxis, Cell } from 'recharts'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { useObjetivos } from './ObjetivosContext'

import { ChartLegend, ChartLegendContent } from '@/components/ui/chart'

import { ResponsiveContainer } from 'recharts'

import { useMotivation } from './MotivationContext'
import { useMusic } from './MusicContext'

const chartData = [
  { browser: 'ParcialDSI', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'BasedeDatos', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'AnalisisNumerico', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'ParcialASI', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'FisicaII', visitors: 190, fill: 'var(--color-other)' }
]

const chartConfig1: ChartConfig = {
  visitors: {
    label: 'Objetivos'
  },
  chrome: {
    label: 'Objetivo1',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Objetivo2',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Objetivo3',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'Objetivo4',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'Objetivo5',
    color: 'hsl(var(--chart-5))'
  }
}

const chartData1 = [
  { month: 'Enero', desktop: 186, mobile: 80 },
  { month: 'Febrero', desktop: 305, mobile: 200 },
  { month: 'Marzo', desktop: 237, mobile: 120 },
  { month: 'Abril', desktop: 73, mobile: 190 },
  { month: 'Mayo', desktop: 209, mobile: 130 },
  { month: 'Junio', desktop: 214, mobile: 140 }
]

const chartConfig4 = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export default function CapyEstadisticas() {
  const [selectedPeriod, setSelectedPeriod] = React.useState('sesion')

  const handleSelect = (value: string) => {
    setSelectedPeriod(value)
  }

  const { objetivos, tiempo } = useObjetivos()
  const { motivationType } = useMotivation()
  const { selectedMusic } = useMusic()
  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyEstadisticas!</h1>
      {/* Seleccion de tiempo */}
      <div className='mt-8 flex w-full'>
        <Select
          onValueChange={value => handleSelect(value)}
          defaultValue='sesion'
        >
          <SelectTrigger className='ml-4 w-[280px]'>
            <SelectValue placeholder='Selecciona un periodo' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Periodo de tiempo</SelectLabel>
              <SelectItem key={0} value='sesion'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Sesion</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-40'>
                      <p>Estadísticas de la sesión actual</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={1} value='Semana'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Semana</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-40'>
                      <p>Estadísticas de la última semana</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={2} value='Mensual'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Mensual</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-40'>
                      <p>Estadísticas del último mes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={3} value='Bimestral'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Bimestral</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-40'>
                      <p>Estadísticas de los últimos dos meses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={4} value='6 Meses'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>6 Meses</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-40'>
                      <p>Estadísticas de los últimos seis meses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={5} value='Evento'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Evento</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-40'>
                      <p>Estadísticas de un evento específico</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* Pagina se sesion */}
      {selectedPeriod === 'sesion' && (
        <>
          <Card className='container mx-auto mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 p-6 shadow-lg'>
            <CardHeader>
              <CardTitle className='mb-4 text-left text-3xl font-bold'>
                Información de la Sesión
              </CardTitle>
            </CardHeader>

            <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col space-y-2'>
                <p className='text-lg font-semibold'>
                  Tiempo total: <span className='font-normal'>00:00:00</span>
                </p>
                <p className='text-lg font-semibold'>
                  Tiempo total de descanso:{' '}
                  <span className='font-normal'>00:00:00</span>
                </p>
                <p className='text-lg font-semibold'>
                  Tipo de motivación:{' '}
                  <span className='font-normal'>{motivationType}</span>
                </p>
                <p className='text-lg font-semibold'>
                  Cantidad total de objetivos:{' '}
                  <span className='font-normal'>{objetivos.length}</span>
                </p>
              </div>
              <div className='flex flex-col space-y-2'>
                <p className='text-lg font-semibold'>
                  Objetivos cumplidos:{' '}
                  <span className='font-normal'>{objetivos.length}</span>
                </p>
                <p className='text-lg font-semibold'>
                  Objetivos pendientes:{' '}
                  <span className='font-normal'>{objetivos.length}</span>
                </p>
                <p className='text-lg font-semibold'>
                  Musica:{' '}
                  <span className='font-normal'>
                    {selectedMusic?.title || 'sin musica'}
                  </span>
                </p>
                <p className='text-lg font-semibold'>
                  Cantidad de pausas: <span className='font-normal'>0</span>
                </p>
              </div>
            </CardContent>
            <h2 className='ml-4 mt-4 flex w-full justify-start text-2xl font-bold'>
              Objetivos de la sesion
            </h2>
            <Table className='mt-4'>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>Objetivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Tiempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {objetivos.map((objetivo, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>{objetivo}</TableCell>
                    <TableCell>
                      {tiempo[objetivo] === 0 ? (
                        <span className='font-semibold text-yellow-600'>
                          Pendiente
                        </span>
                      ) : (
                        <span className='font-semibold text-green-600'>
                          Cumplido
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {(() => {
                        const time = tiempo[objetivo] || 0
                        const hours = Math.floor(time / 3600)
                        const minutes = Math.floor((time % 3600) / 60)
                        const seconds = time % 60

                        if (hours > 0) {
                          return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                        } else {
                          return `${minutes}:${seconds.toString().padStart(2, '0')}`
                        }
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          {/* Tabla de objetivos de la sesión */}
          <hr />
          <hr />
          {/* Gráfico de sesión */}
          <Card className='mt-4 overflow-hidden rounded-lg shadow-lg'>
            <CardHeader className='bg-gradient-to-r from-orange-500 to-blue-600 text-white'>
              <CardTitle className='text-2xl font-bold'>
                Tiempo dedicado a objetivos en la sesión actual
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <ChartContainer config={chartConfig1}>
                <ResponsiveContainer width='100%' height={400}>
                  <PieChart>
                    <Pie
                      data={objetivos.map(objetivo => ({
                        name: objetivo,
                        value: tiempo[objetivo] || 0
                      }))}
                      labelLine={false}
                      outerRadius='80%'
                      dataKey='value'
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {objetivos.map((objetivo, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            chartConfig1[Object.keys(chartConfig1)[index + 1]]
                              ?.color || `hsl(${index * 90}, 70%, 60%)`
                          }
                          name={objetivo}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}

      {selectedPeriod === 'Semana' && (
        <>
          {/* Gráfico semanal */}
          <Card className='flex flex-col'>
            <CardHeader className='items-center pb-0'>
              <CardTitle>Eventos de la semana</CardTitle>
            </CardHeader>
            <CardContent className='flex-1 pb-0'>
              <ChartContainer
                config={chartConfig1}
                className='mx-auto aspect-square max-h-[250px]'
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey='visitors' hideLabel />
                    }
                  />
                  <Pie data={chartData} dataKey='visitors'>
                    <LabelList
                      dataKey='browser'
                      className='fill-background'
                      stroke='none'
                      fontSize={12}
                      formatter={(value: keyof typeof chartConfig1) =>
                        chartConfig1[value]?.label
                      }
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Tabla semanal */}
          <Table className='flex w-full flex-col items-center justify-center'>
            <TableCaption>Resumen semanal</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Objetivos</TableHead>
                <TableHead>Estado</TableHead>

                <TableHead className='text-right'>Tiempo (Minutos)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium'>Objetivo 1</TableCell>
                <TableCell>Cumplido</TableCell>

                <TableCell className='text-right'>12:00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Objetivo 2</TableCell>
                <TableCell>Pospuesto</TableCell>

                <TableCell className='text-right'>58:10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Objetivo 3</TableCell>
                <TableCell>Cumplido</TableCell>

                <TableCell className='text-right'>15:03</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}

      {selectedPeriod === 'Mensual' && (
        <>
          {/* Gráfico mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Objetivos Cumplidos VS Pendientes</CardTitle>
              <CardDescription>Último mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig4}>
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
                    content={<ChartTooltipContent indicator='dashed' />}
                  />
                  <Bar
                    dataKey='desktop'
                    fill='var(--color-desktop)'
                    radius={4}
                  />
                  <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
              <div className='flex gap-2 font-medium leading-none'>
                Trending up by 5.2% this month
              </div>
              <div className='leading-none text-muted-foreground'>
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  )
}
