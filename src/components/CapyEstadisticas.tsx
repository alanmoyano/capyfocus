import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, LabelList, YAxis } from 'recharts'
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
import { Pie, PieChart, CartesianGrid, XAxis } from 'recharts'

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

import { RadialBar, RadialBarChart } from 'recharts'

import { useObjetivos } from './ObjetivosContext'



const chartData = [
  { browser: 'ParcialDSI', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'BasedeDatos', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'AnalisisNumerico', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'ParcialASI', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'FisicaII', visitors: 190, fill: 'var(--color-other)' }
]

const chartConfig1: ChartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'ParcialDSI',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Base de Datos',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Analisis Numerico',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'ParcialASI',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'FisicaII',
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

const chartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))'
  },
  label: {
    color: 'hsl(var(--background))'
  }
}

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

const chartConfig3 = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

export default function CapyEstadisticas() {
  const [selectedPeriod, setSelectedPeriod] = React.useState('sesion')

  const handleSelect = (value: string) => {
    setSelectedPeriod(value)
  }

  const { objetivos, tiempo } = useObjetivos()
  
  return (
    <>
      <p className='text-2xl font-bold'>CapyEstadisticas</p>
      {/* Seleccion de tiempo */}
      <div className='flex'>
        <Select onValueChange={value => handleSelect(value)} defaultValue='sesion'>
          <SelectTrigger className='ml-4 w-[280px]' >
            <SelectValue placeholder='Selecciona un periodo'  />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Periodo de tiempo</SelectLabel>
              <SelectItem key={0} value='sesion' >
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

      {selectedPeriod === 'sesion' && (
        <>
          {/* Tabla de objetivos de la sesión */}
          <Table>
            <TableCaption>Información de los objetivos de la sesión</TableCaption>
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
                  <TableCell>{tiempo[objetivo] === 0 ? 'Pendiente' : 'Cumplido'}</TableCell>
                  <TableCell className='text-right'>
                    {(() => {
                      const time = tiempo[objetivo] || 0;
                      const hours = Math.floor(time / 3600);
                      const minutes = Math.floor((time % 3600) / 60);
                      const seconds = time % 60;
                      
                      if (hours > 0) {
                        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                      } else {
                        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                      }
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Gráfico de sesión (por ejemplo, un gráfico de barras) */}
          <Card>
            <CardHeader>
              <CardTitle>Tiempo dedicado a objetivos en la sesión actual</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={objetivos.map(objetivo => ({
                    objetivo,
                    tiempo: tiempo[objetivo] || 0
                  }))}
                  layout='vertical'
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey='objetivo'
                    type='category'
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value: string) => value.slice(0, 3)}
                    hide
                  />
                  <XAxis dataKey='tiempo' type='number' hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator='line' />}
                  />
                  <Bar
                    dataKey='tiempo'
                    layout='vertical'
                    fill='var(--color-desktop)'
                    radius={4}
                  >
                    <LabelList
                      dataKey='objetivo'
                      position='insideLeft'
                      offset={8}
                      className='fill-[--color-label]'
                      fontSize={12}
                    />
                    <LabelList
                      dataKey='tiempo'
                      position='right'
                      offset={8}
                      className='fill-foreground'
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
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
                    content={<ChartTooltipContent nameKey='visitors' hideLabel />}
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
                  <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
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

      {/* Agregar más condiciones para otros períodos (Bimestral, 6 Meses, Evento) */}

      {/* Información general que se muestra siempre */}
      <p>Cantidad de pomodoros realizados: 3</p>
      <p>Cantidad de pausas realizadas: 3</p>
      <p>Tipo de motivo motivacion: positiva</p>
    </>
  )
}
