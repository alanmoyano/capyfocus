/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { ImageDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EstadisticasPeriodo from './ComponentesEspecifico/EstadisticasPeriodo'

import {
  Tooltip as ChartTooltip,
  Bar,
  BarChart,
  Pie,
  PieChart,
  CartesianGrid,
  XAxis,
  Cell,
  ResponsiveContainer,
} from 'recharts'

import { useSearch } from 'wouter'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Calendar } from '@components/ui/calendar'
import { ChartLegend, ChartLegendContent } from '@components/ui/chart'

import { useObjetivos } from '@contexts/ObjetivosContext'
import { useMotivation } from '@contexts/MotivationContext'
import { useMusic } from '@contexts/MusicContext'
import { useSesion } from '@contexts/SesionContext'

import { formatTime } from '@/lib/utils'
import useSearchParams from '@hooks/useSearchParams'
import Reproductor from './ComponentesEspecifico/Reproductor'

// const chartData = [
//   { browser: 'ParcialDSI', visitors: 275, fill: 'var(--color-chrome)' },
//   { browser: 'BasedeDatos', visitors: 200, fill: 'var(--color-safari)' },
//   { browser: 'AnalisisNumerico', visitors: 187, fill: 'var(--color-firefox)' },
//   { browser: 'ParcialASI', visitors: 173, fill: 'var(--color-edge)' },
//   { browser: 'FisicaII', visitors: 190, fill: 'var(--color-other)' }
// ]

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

const chartData1 = [
  { month: 'Enero', desktop: 186, mobile: 80 },
  { month: 'Febrero', desktop: 305, mobile: 200 },
  { month: 'Marzo', desktop: 237, mobile: 120 },
  { month: 'Abril', desktop: 73, mobile: 190 },
  { month: 'Mayo', desktop: 209, mobile: 130 },
  { month: 'Junio', desktop: 214, mobile: 140 },
]

const chartConfig4 = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export default function CapyEstadisticas() {
  const queryParams = useSearch()
  const { period } = useSearchParams()
  const [selectedPeriod, setSelectedPeriod] = useState(period ?? '')

  console.log(queryParams)

  const handleSelect = (value: string) => {
    setSelectedPeriod(value)
  }

  const { objetivos, objetivosPend, tiempo, tiempoSesion } = useObjetivos()
  const { motivationType } = useMotivation()
  const { selectedMusic } = useMusic()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { tecnicaEstudio, tiempoTotal, acumuladorTiempoPausa, cantidadPausas } =
    useSesion()

  const cardRefs = {
    sesion: useRef(null),
    semanal: useRef(null),
    mensual: useRef(null),
    bimestral: useRef(null),
    semestral: useRef(null),
  }

  const captureScreenshot = async (period: string) => {
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
  //Va a quedar lo de las estadisticas de sesion
  //Pero vamos a colocar el tema del mapeo de los eventos
  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyEstadisticas!</h1>
      {/* Seleccion de tiempo */}
      <div className='mt-4 flex flex-col justify-center px-2 md:flex-row'>
        <p className='flex items-center'>
          Ingresa el intervalo de tiempo para visualizar las estadisticas:{' '}
        </p>
        <Select
          onValueChange={value => handleSelect(value)}
          defaultValue={selectedPeriod}
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
                      <p>Sesión</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-40'>
                      <p>Estadísticas de la sesión actual</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={1} value='semanal'>
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

              <SelectItem key={2} value='mensual'>
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

              <SelectItem key={3} value='bimestral'>
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

              <SelectItem key={4} value='semestral'>
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

              <SelectItem key={5} value='evento'>
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

      {/* Pagina en blanco */}
      {selectedPeriod === '' && tiempoTotal === 0 && (
        <Reproductor src='/auto.webm' />
      )}
      {/* Pagina de sesion */}
      {selectedPeriod === 'sesion' && tiempoTotal === 0 && (
        <>
          <Reproductor src='/Chicho/CapyDesilucionado.webm' />
          <div className='flex w-1/2 content-center justify-center rounded-lg bg-red-700 p-8 text-white shadow-lg'>
            <p>
              Primero inicia una sesión para tener estadísticas de la sesión!!
            </p>
          </div>
        </>
      )}

      {/* Pagina se sesion */}
      {tiempoTotal > 0 && selectedPeriod === 'sesion' && (
        <>
          <div className='mr-12 flex w-full justify-end'>
            <Button
              variant='ghost'
              onClick={() => captureScreenshot('sesion')}
              className=''
            >
              <ImageDown className='mr-2 h-4 w-4' />
              Capturar
            </Button>
          </div>

          <Card
            ref={cardRefs.sesion}
            className='container mx-auto mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg dark:from-gray-800 dark:to-gray-900 dark:shadow-gray-800'
          >
            <CardHeader>
              <CardTitle className=''>
                <h1 className='text-left text-3xl font-bold'>
                  Resumen de la Sesión
                </h1>
              </CardTitle>
            </CardHeader>
            <CardContent className='flex justify-between gap-4'>
              <div className='w-1/2'>
                <div className='grid grid-cols-2 gap-6'>
                  {[
                    {
                      label: 'Tiempo total de estudio',
                      value: formatTime(tiempoTotal ?? 0),
                    },
                    {
                      label: 'Tiempo total de descanso',
                      value: formatTime(acumuladorTiempoPausa ?? 0),
                    },
                    { label: 'Total de objetivos', value: objetivos.length },
                    {
                      label: 'Objetivos cumplidos',
                      value: objetivos.length - objetivosPend.length,
                    },
                    {
                      label: 'Objetivos pendientes',
                      value: objetivosPend.length,
                    },
                    {
                      label: 'Cantidad de pausas',
                      value: cantidadPausas,
                    },
                    {
                      label: 'Tipo de motivación',
                      value: motivationType,
                    },
                    {
                      label: 'Música',
                      value: selectedMusic?.title ?? 'Sin música',
                    },
                    {
                      label: 'Técnica de estudio',
                      value: tecnicaEstudio,
                    },
                  ].map(({ label, value }, index) => (
                    <div
                      key={index}
                      className='rounded-lg bg-white p-2 shadow-md'
                    >
                      <p className='mb-2 rounded-lg bg-primary p-2 text-sm font-semibold text-gray-800'>
                        {label}
                      </p>
                      <p className='text-lg font-bold text-gray-800'>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <Card className='h-1/2 overflow-hidden rounded-lg shadow-lg'>
                <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 text-gray-900'>
                  <CardTitle className='text-xl font-bold'>
                    Tiempo dedicado a objetivos en la sesión actual
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                  {objetivos.length === 0 && (
                    <div className='h-[270px] w-full flex items-center justify-center'>
                      <p className='text-center'>
                        Para tener el gráfico de los objetivos de la sesión,
                        coloque objetivos antes de empezar la sesión.
                      </p>
                    </div>
                  )}

                  {objetivos.length > 0 && (
                    <div>
                      <ChartContainer config={chartConfig1}>
                        <ResponsiveContainer width='100%' height={400}>
                          <PieChart>
                            {/* Agregue un filtro para que no se muestren los objetivos que no se han cumplido */}
                            <Pie
                              data={objetivos
                                .filter(objetivo => tiempo[objetivo] > 0)
                                .map(objetivo => ({
                                  name: objetivo,
                                  value: tiempo[objetivo] ?? 0,
                                }))}
                              labelLine={false}
                              outerRadius='80%'
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
            {/* Tabla de objetivos de la sesión */}
            <h2 className='ml-4 flex w-full justify-start text-2xl font-bold'>
              Objetivos de la sesión
            </h2>
            {/* Aca estaria bueno agregar el nombre del evento si se estudio para uno  */}
            <Table className=''>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>Objetivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Tiempo</TableHead>
                  <TableHead className='text-right'>Tiempo acumulado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {objetivos.map((objetivo, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>{objetivo}</TableCell>
                    <TableCell>
                      {tiempo[objetivo] === 0 ? (
                        <span className='rounded-full bg-orange-200 px-2 py-1 text-xs font-semibold text-yellow-800'>
                          Pendiente
                        </span>
                      ) : (
                        <span className='rounded-full bg-green-200 px-2 py-1 text-xs font-semibold text-green-800'>
                          Cumplido
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatTime(tiempo[objetivo] || 0)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatTime(tiempoSesion[objetivo] || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <hr />
          <hr />
        </>
      )}

      {selectedPeriod === 'semanal' && (
        <>
          <div className='mr-12 flex w-full justify-end'>
            <Button
              variant='ghost'
              onClick={() => captureScreenshot('semanal')}
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
                  {[
                    {
                      label: 'Tiempo total de estudio',
                      value: formatTime(tiempoTotal ?? 0),
                    },
                    { label: 'Total de objetivos', value: objetivos.length },
                    {
                      label: 'Objetivos cumplidos',
                      value: objetivos.length - objetivosPend.length,
                    },
                    {
                      label: 'Objetivos pendientes',
                      value: objetivosPend.length,
                    },
                    {
                      label: 'Tipo de motivación preferida',
                      value: motivationType,
                    },
                    {
                      label: 'Música preferida',
                      value: selectedMusic?.title ?? 'Sin música',
                    },
                    {
                      label: 'Técnica de estudio más frecuente',
                      value: tecnicaEstudio,
                    },
                    {
                      label: 'Mayor racha de días',
                      value: objetivosPend.length,
                    },
                  ].map(({ label, value }, index) => (
                    <div
                      key={index}
                      className='rounded-lg bg-white p-2 shadow-md'
                    >
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
              <h2 className='mb-4 text-2xl font-bold'>
                Objetivos de las Sesiones
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creado</TableHead>
                    <TableHead className='text-right'>
                      Tiempo Acumulado
                    </TableHead>
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
      )}

      {selectedPeriod === 'mensual' && (
        <>
          <div className='mr-12 flex w-full justify-end'>
            <Button
              variant='ghost'
              onClick={() => captureScreenshot('mensual')}
              className=''
            >
              <ImageDown className='mr-2 h-4 w-4' />
              Capturar
            </Button>
          </div>
          <Card
            ref={cardRefs.mensual}
            className='container mx-auto mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg'
          >
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

      {selectedPeriod === 'bimestral' && (
        <>
          <div className='mr-12 flex w-full justify-end'>
            <Button
              variant='ghost'
              onClick={() => captureScreenshot('bimestral')}
              className=''
            >
              <ImageDown className='mr-2 h-4 w-4' />
              Capturar
            </Button>
          </div>
          <Card
            ref={cardRefs.bimestral}
            className='container mx-auto mt-4 flex-col overflow-y-auto rounded-lg bg-orange-100 p-6 shadow-lg'
          >
            <CardHeader>
              <CardTitle className='mb-4 py-4 text-left text-3xl font-bold'>
                Tu progreso en los últimos dos meses
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col justify-between gap-4 md:flex-row'>
              <div className='md:w-1/2 md:pl-4'>
                <div className='grid grid-cols-2 gap-14'>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Tiempo total de estudio:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {formatTime(tiempoTotal || 0)}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Tiempo total de descanso:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {formatTime(acumuladorTiempoPausa || 0)}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Cantidad de pausas:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {cantidadPausas}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Tipo de motivación:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {motivationType}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Música:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {selectedMusic?.title ?? 'sin música'}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Técnica de estudio:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {tecnicaEstudio}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Cantidad total de objetivos:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {objetivos.length}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Objetivos cumplidos:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {objetivos.length - objetivosPend.length}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Objetivos pendientes:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {objetivosPend.length}
                    </p>
                  </div>
                </div>
                <div className='mt-8 w-auto'>
                  <p>
                    Hola soy Agus y opino que acá pódria spawnear un Chicho
                    salvaje!!!
                  </p>
                </div>
              </div>
              <div className='md:w-1/3 md:pr-4'>
                <div className='text-center'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    className='inline-block rounded-lg border bg-background p-4 shadow-sm'
                  />
                </div>
                <Card className='mt-8 w-full rounded-lg shadow-md'>
                  <CardHeader>
                    <CardTitle className='p-2 text-center'>
                      Objetivos Cumplidos vs Pendientes
                    </CardTitle>
                    <CardDescription className='text-center'>
                      Últimos dos meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig4}>
                      {/*Obviamente ver la logica de los meses */}
                      <BarChart accessibilityLayer data={chartData1.slice(-2)}>
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
                        <Bar
                          dataKey='mobile'
                          fill='var(--color-mobile)'
                          radius={4}
                        />
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
              </div>
            </CardContent>
            {/* <h2 className='ml-4 flex w-full justify-start text-2xl font-bold'>
              Objetivos favoritos
            </h2>
            <Table className='mt-4'>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>Evento</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Fecha creado</TableHead>
                  <TableHead className='text-right'>
                    Evento relacionado
                  </TableHead>
                  <TableHead className='text-right'>Tiempo acumulado</TableHead>
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
                      {formatTime(tiempo[objetivo] || 0)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatTime(tiempoSesion[objetivo] || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
          </Card>
        </>
      )}

      {selectedPeriod === 'semestral' && (
        <>
          <div className='mr-12 flex w-full justify-end'>
            <Button
              variant='ghost'
              onClick={() => captureScreenshot('semestral')}
              className=''
            >
              <ImageDown className='mr-2 h-4 w-4' />
              Capturar
            </Button>
          </div>
          <Card
            ref={cardRefs.semestral}
            className='container mx-auto mt-4 flex flex-col overflow-y-auto rounded-lg bg-orange-100 p-6 shadow-lg'
          >
            <CardHeader>
              <CardTitle className='mb-4 py-4 text-left text-3xl font-bold'>
                Tu progreso en los últimos seis meses
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col justify-between gap-4 md:flex-row'>
              <div className='md:w-1/2 md:pl-4'>
                <div className='grid grid-cols-2 gap-14'>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Tiempo total de estudio:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {(() => {
                        const time = tiempoTotal || 0
                        const hours = Math.floor(time / 3600)
                        const minutes = Math.floor((time % 3600) / 60)
                        const seconds = time % 60

                        return hours > 0
                          ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                          : `${minutes}:${seconds.toString().padStart(2, '0')}`
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Tiempo total de descanso:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {(() => {
                        const time = acumuladorTiempoPausa || 0
                        const hours = Math.floor(time / 3600)
                        const minutes = Math.floor((time % 3600) / 60)
                        const seconds = time % 60

                        return hours > 0
                          ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                          : `${minutes}:${seconds.toString().padStart(2, '0')}`
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Cantidad de pausas:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {cantidadPausas}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Tipo de motivación:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {motivationType}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Música:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {selectedMusic?.title ?? 'sin música'}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Técnica de estudio:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {tecnicaEstudio}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Cantidad total de objetivos:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {objetivos.length}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Objetivos cumplidos:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {objetivos.length - objetivosPend.length}
                    </p>
                  </div>
                  <div>
                    <p className='text-md rounded-lg bg-primary p-1 text-center font-semibold shadow-md'>
                      Objetivos pendientes:
                    </p>
                    <p className='mt-2 text-center text-lg font-normal'>
                      {objetivosPend.length}
                    </p>
                  </div>
                </div>
                <div className='mt-8 w-auto'>
                  <p>
                    Hola soy Agus y opino que acá pódria spawnear un Chicho
                    salvaje!!!
                  </p>
                </div>
              </div>
              <div className='flex flex-col gap-4 md:w-1/3 md:pr-4'>
                <Card className='w-full'>
                  {/* Si bien es redundante considerando los titulos, esta bueno tener algo visual tambien!! ver <3 */}
                  <CardHeader>
                    <CardTitle className='p-2 text-center'>
                      Objetivos Cumplidos vs Pendientes
                    </CardTitle>
                    <CardDescription className='text-center'>
                      Últimos seis meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig4}>
                      {/*Obviamente ver la logica de los meses */}
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
                        <Bar
                          dataKey='mobile'
                          fill='var(--color-mobile)'
                          radius={4}
                        />
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
                <div className='text-center'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    className='inline-block rounded-md border bg-background p-4'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Ver fin de tarjeta, para que se termine antes y no con la pagina*/}
        </>
      )}

      {selectedPeriod === 'evento' && (
        <>
          <p>Funciona?</p>
          <EstadisticasPeriodo period='evento'></EstadisticasPeriodo>
        </>
      )}
    </>
  )
}
