/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { ImageDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EstadisticasPeriodo from './ComponentesEspecifico/EstadisticasPeriodo'

import { Tooltip as ChartTooltip, Pie, PieChart, Cell } from 'recharts'

import { useSearch } from 'wouter'

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
import { ChartLegend, ChartLegendContent } from '@components/ui/chart'

import { useObjetivos } from '@contexts/ObjetivosContext'
import { useMotivation } from '@contexts/MotivationContext'
import { useMusic } from '@contexts/MusicContext'
import { useSesion } from '@contexts/SesionContext'

import { formatTime } from '@/lib/utils'
import useSearchParams from '@hooks/useSearchParams'
import Reproductor from './ComponentesEspecifico/Reproductor'
import { useSession } from './contexts/SessionContext'
import { useEvents } from './contexts/EventsContext'
import { gatherEventsOfUser } from '@/constants/supportFunctions'
import EstadisticasEvento from './ComponentesEspecifico/EstadisticasEvento'

type Period =
  | 'sesion'
  | 'semanal'
  | 'mensual'
  | 'bimestral'
  | 'semestre'
  | 'evento'

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
  obj1: {
    label: 'Objetivo1',
    color: 'hsl(var(--chart-1))',
  },
  obj2: {
    label: 'Objetivo2',
    color: 'hsl(var(--chart-2))',
  },
  obj3: {
    label: 'Objetivo3',
    color: 'hsl(var(--chart-3))',
  },
  obj4: {
    label: 'Objetivo4',
    color: 'hsl(var(--chart-4))',
  },
  obj5: {
    label: 'Objetivo5',
    color: 'hsl(var(--chart-5))',
  },
  obj6: {
    label: 'Objetivo6',
    color: 'hsl(var(--chart-6))',
  },
  obj7: {
    label: 'Objetivo7',
    color: 'hsl(var(--chart-7))',
  },
  obj8: {
    label: 'Objetivo8',
    color: 'hsl(var(--chart-8))',
  },
  obj9: {
    label: 'Objetivo9',
    color: 'hsl(var(--chart-9))',
  },
  obj10: {
    label: 'Objetivo10',
    color: 'hsl(var(--chart-10))',
  },
}

export default function CapyEstadisticas() {
  const queryParams = useSearch()
  const { period } = useSearchParams()
  const [selectedPeriod, setSelectedPeriod] = useState(period ?? '')
  const [selectedEvent, setSelectedEvent] = useState('')
  const { session } = useSession()
  const { events, setEvents } = useEvents()
  const periodos = ['sesion', 'semanal', 'mensual', 'bimestral', 'semestral']

  const recoverEvents = () => {
    if (session) {
      if (events.length === 0) {
        gatherEventsOfUser(session.user.id)
          .then(data =>
            data.forEach(evento => {
              // @ts-expect-error no te preocupes type, anda
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              const fechaParsed = evento.fechaLimite.replaceAll(
                '-',
                '/'
              ) as string

              const id = evento.idEvento

              const date = new Date(fechaParsed)

              const title = evento.nombre

              const hours = evento.horasAcumuladas

              console.log(date, title)
              //@ts-expect-error no te preocupes type
              setEvents(prev => [
                ...prev,
                { date, title: title, hoursAcumulated: hours, id: id },
              ])
            })
          )
          .catch((error: unknown) => console.log(error))
      }
      recovered.current = true
    }
  }

  console.log(queryParams)

  const handleSelect = (value: string) => {
    if (periodos.includes(value)) {
      setSelectedPeriod(value)
    } else {
      setSelectedPeriod('')
      setSelectedEvent(value)
    }
  }

  const {
    objetivos,
    objetivosPend,
    tiempo,
    tiempoSesion,
    objetivosFav,
    tiempoFavorito,
  } = useObjetivos()
  const { motivationType } = useMotivation()
  const { selectedMusic } = useMusic()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { tecnicaEstudio, tiempoTotal, acumuladorTiempoPausa, cantidadPausas } =
    useSesion()

  const recovered = useRef(false)

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

  useEffect(() => {
    if (!recovered.current) {
      recoverEvents()
    }
  }, [])
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

              {session && (
                <>
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

                  {events.map(
                    evento =>
                      evento.hoursAcumulated && (
                        <SelectItem key={evento.title} value={evento.title}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p>{evento.title}</p>
                              </TooltipTrigger>
                              <TooltipContent className='ml-40'>
                                <p>Estadísticas del evento: {evento.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </SelectItem>
                      )
                  )}
                  {/* <SelectItem key={5} value='evento'>
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
                  </SelectItem> */}
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Pagina en blanco */}
      {selectedPeriod === '' && tiempoTotal === 0 && !selectedEvent && (
        <Reproductor src='/auto.webm' />
      )}
      {/* Pagina de sesion */}
      {selectedPeriod === 'sesion' && tiempoTotal === 0 && (
        <>
          <Reproductor src='/Chicho/OtrasAcciones/CapyDesilucionado.webm' />
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
          {/* Boton Screen */}
          <div className='mr-12 flex w-full justify-end'>
            <Button variant='ghost' onClick={() => captureScreenshot('sesion')}>
              <ImageDown className='mr-2 h-4 w-4' />
              Capturar
            </Button>
          </div>
          {/* Info sesion */}
          <Card
            ref={cardRefs.sesion}
            className='container mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg md:flex-row dark:from-gray-800 dark:to-gray-600 dark:shadow-gray-700'
          >
            <CardHeader>
              <CardTitle className='text-left text-3xl font-bold'>
                Resumen de la Sesión
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
              <div className='space-y-6 md:w-1/2'>
                <Card className='overflow-hidden rounded-lg shadow-lg'>
                  <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-2 text-gray-900'>
                    <CardTitle className='text-lg font-bold text-gray-900'>
                      Tiempo dedicado a objetivos en la sesión actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-3'>
                    {objetivos.length === 0 && (
                      <div className='flex h-full w-full items-center justify-center'>
                        <p className='rounded-lg bg-accent p-4 text-center'>
                          Para tener el gráfico de los objetivos de la sesión,
                          coloque objetivos antes de empezar la sesión.
                        </p>
                      </div>
                    )}
                    {objetivos.length - objetivosPend.length === 0 &&
                      objetivos.length !== 0 && (
                        <div className='flex h-full w-full items-center justify-center'>
                          <p className='rounded-lg bg-accent p-4 text-center'>
                            Oh, en esta sesion no has completado objetivos,
                            entonces no podremos calcular las CapyEstadísticas.
                          </p>
                        </div>
                      )}

                    {objetivos.length > 0 && (
                      <div>
                        <ChartContainer config={chartConfig1}>
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
                        </ChartContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            {/* Aca estaria bueno agregar el nombre del evento si se estudio para uno  */}
            {/* Tabla de objetivos de la sesión */}
            {objetivos.length > 0 && (
              <div className='px-6 pb-6'>
                <h2 className='mb-4 text-2xl font-bold'>
                  Objetivos de la sesión
                </h2>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[200px]'>Objetivo</TableHead>
                      <TableHead className='text-center'>Estado</TableHead>
                      <TableHead className='text-center'>Tiempo</TableHead>
                      <TableHead className='text-center'>
                        Tiempo Acumulado Favorito
                      </TableHead>
                      <TableHead className='text-center'>
                        Tiempo Cumplido en sesion
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {objetivos.map((objetivo, index) => (
                      <TableRow key={index}>
                        <TableCell className='font-medium'>
                          {objetivo}
                        </TableCell>
                        <TableCell className='text-center'>
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
                        <TableCell className='text-center'>
                          {formatTime(tiempo[objetivo] || 0)}
                        </TableCell>
                        <TableCell className='text-center'>
                          {objetivosFav.includes(objetivo) ? (
                            <>{formatTime(tiempoFavorito[objetivo] || 0)}</>
                          ) : (
                            <>--|--</>
                          )}
                        </TableCell>
                        <TableCell className='text-center'>
                          <>{formatTime(tiempoSesion[objetivo] || 0)}</>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
          <hr />
          <hr />
        </>
      )}

      {selectedPeriod === 'semanal' && (
        <>
          <EstadisticasPeriodo period='semanal'></EstadisticasPeriodo>
        </>
      )}

      {selectedPeriod === 'mensual' && (
        <>
          <EstadisticasPeriodo period='mensual'></EstadisticasPeriodo>
        </>
      )}

      {selectedPeriod === 'bimestral' && (
        <>
          <EstadisticasPeriodo period='bimestral'></EstadisticasPeriodo>
        </>
      )}
      {selectedPeriod === 'semestral' && (
        <>
          <EstadisticasPeriodo period='semestre'></EstadisticasPeriodo>
        </>
      )}
      {selectedPeriod === '' && selectedEvent && (
        <>
          <EstadisticasEvento name={selectedEvent}></EstadisticasEvento>
        </>
      )}
    </>
  )
}
