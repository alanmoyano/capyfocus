/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useEffect, useRef, useState } from 'react'

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
import {
  formatDateDash,
  obtenerClaveMayorValor,
  getElementNameById,
  convertirAFecha,
  recoverObjectiveFromId,
  formatDateDashARG,
} from '../../constants/supportFunctions'
import { supabase } from '../supabase/client'
import { useSession } from '../contexts/SessionContext'
import ChartGrafico from './ChartGrafico'
import { useEvents } from '../contexts/EventsContext'
import { Event } from './Eventos'
//TODO: Grafico segun el periodo de tiempo seleccionado

type Period =
  | 'sesion'
  | 'semanal'
  | 'mensual'
  | 'bimestral'
  | 'semestre'
  | 'evento'

type Motivation =
  | {
      id: 1
      name: 'Positiva'
    }
  | { id: 2; name: 'Pasivo Agresiva' }

type StudyTechnique =
  | {
      id: 1
      name: 'CapyDoro'
    }
  | {
      id: 2
      name: 'CapyMetro'
    }

/*     const chartConfig = {
      cumplidos: {
        label: 'Cumplidos',
        color: 'hsl(var(--chart-1))',
      },
      pendientes: {
        label: 'Pendientes',
        color: 'hsl(var(--chart-2))',
      },
    } satisfies ChartConfig */

type Music =
  | { id: 0; name: 'Sin música' }
  | { id: 1; name: 'CapyEpic' }
  | { id: 2; name: 'CapySynthwave' }
  | { id: 3; name: 'CapyChill' }
  | { id: 4; name: 'CapyAmbiente' }

const motivations: Motivation[] = [
  { id: 1, name: 'Positiva' },
  { id: 2, name: 'Pasivo Agresiva' },
]

const musicList: Music[] = [
  { id: 0, name: 'Sin música' },
  { id: 1, name: 'CapyEpic' },
  { id: 2, name: 'CapySynthwave' },
  { id: 3, name: 'CapyChill' },
  { id: 4, name: 'CapyAmbiente' },
]

const StudyTechniqueList: StudyTechnique[] = [
  { id: 1, name: 'CapyDoro' },
  { id: 2, name: 'CapyMetro' },
]

type Graficos = 'chartDataMeses' | 'chartDataSemana' | 'chartDataMes'

type sessionToRecover = {
  uuid: string
  horaInicioSesion: string
  fecha: Date
  horaFinSesion: string
  tecnicaEstudio: number
  tipoMotivacion: number
  cantidadObjetivosCumplidos: number
  cantidadObjetivos: number
  tiempoEstudio: number
}

type RowToRecover = {
  id: number
  idEvento: number
  idObjetivoFavorito: number
}

type dataChart = {
  day: string
  cumplidos: number
  pendiente: number
  date: Date
}

type ObjectiveToRecover = {
  id: number
  created_at: string
  idUsuario: string
  descripcion: string
  idEstado: number
  horasAcumuladas: number
}

const ObjectiveStates = ['Pendiente', 'Cumplido']

async function getEventOfUser(period: Date, uuid: string) {
  const periodFormatted = formatDateDash(period)
  const { data } = await supabase
    .from('SesionesDeEstudio')
    .select()
    .eq('idUsuario', uuid)
    .gt('fecha', periodFormatted)

  if (data) return data as sessionToRecover[]
  else return
}

function getDateOfPeriod(period: Period) {
  const dateToReturn = new Date()
  switch (period) {
    case 'semanal':
      dateToReturn.setDate(dateToReturn.getDate() - 7)
      break
    case 'mensual':
      dateToReturn.setMonth(dateToReturn.getMonth() - 1)
      break
    case 'bimestral':
      dateToReturn.setMonth(dateToReturn.getMonth() - 2)
      break
    case 'semestre':
      dateToReturn.setMonth(dateToReturn.getMonth() - 6)
      break
    default:
      break
  }
  return dateToReturn
}

async function getEventIdFromName(eventName: string, uuid: string) {
  const { data, error } = await supabase
    .from('Eventos')
    .select()
    .eq('nombre', eventName)
    .eq('idUsuario', uuid)

  if (data) return data[0].idEvento as number
  else console.log(error)
}

async function gatherSessionsOfEventOfUser(uuid: string, eventName: string) {
  const eventId = await getEventIdFromName(eventName, uuid)

  const { data, error } = await supabase
    .from('SesionesDeEstudio')
    .select()
    .eq('idUsuario', uuid)
    .eq('eventoSeleccionado', eventId)

  if (data) {
    //Aca de ordena por fecha de forma ascendente
    const sortedData = data.sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )
    console.log(sortedData)
    return sortedData as sessionToRecover[]
  } else {
    console.log(error)
    return []
  }
}

async function gatherObjectivesOfEvent(eventId: number) {
  const { data, error } = await supabase
    .from('ObjetivosFavoritosXEventos')
    .select()
    .eq('idEvento', eventId)

  if (error) console.error(error)

  if (data) {
    const objectivePromises = (data as RowToRecover[]).map(async row => {
      const data = await recoverObjectiveFromId(row.idObjetivoFavorito)
      return data ? (data[0] as ObjectiveToRecover) : null
    })

    console.log(objectivePromises)
    const objetivos = await Promise.all(objectivePromises)
    console.log(objetivos)

    return objetivos.filter(obj => obj !== null)
    // for (const row of data as RowToRecover[]) {
    //   recoverObjectiveFromId(row.idObjetivoFavorito)
    //     .then(data => {
    //       if (data) {
    //         ObjectivesToRecover.push(data[0])
    //       }
    //     })
    //     .catch((error: unknown) =>
    //       console.log('Ocurrio un error recuperando los objetivos', error)
    //     )
    // }
  }
}

export default function EstadisticasEvento({ name }: { name: string }) {
  const cardRefs = {
    sesion: useRef(null),
    semanal: useRef(null),
    mensual: useRef(null),
    bimestral: useRef(null),
    semestre: useRef(null),
    evento: useRef(null),
  }

  function getRachaPorPeriodo(fechasSesiones: string[]) {
    let rachaActual = 0
    let ultimaFechaRacha: Date

    for (const fechaActual of fechasSesiones) {
      const fechaAComparar = convertirAFecha(fechaActual)
      //@ts-expect-error No va a ser referenciado antes de ser asignado
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!ultimaFechaRacha) {
        ultimaFechaRacha = fechaAComparar
        rachaActual += 1
      } else {
        const fecha2VecesPosteriorAnterior = new Date(ultimaFechaRacha)
        fecha2VecesPosteriorAnterior.setDate(
          fecha2VecesPosteriorAnterior.getDate() + 2
        )
        if (
          fechaAComparar > ultimaFechaRacha &&
          fechaAComparar < fecha2VecesPosteriorAnterior
        ) {
          ultimaFechaRacha = fechaAComparar
          rachaActual += 1
        } else {
          ultimaFechaRacha = fechaAComparar
          setRacha(rachaActual)
          rachaActual = 1
        }
      }
    }
    setRacha(rachaActual)
  }

  const setStatisticsValues = (data: sessionToRecover[], evento: Event) => {
    if (session) {
      const studyTime = evento.hoursAcumulated ? evento.hoursAcumulated : 0
      let objectiveCount = 0 //contador para saber cuantos
      let objectiveAcomplishedCount = 0
      const setFechas = new Set()

      const mapaMotivaciones = new Map<string, number>([
        ['1', 0],
        ['2', 0],
      ])
      const mapaMusicas = new Map<string, number>([
        ['0', 0],
        ['1', 0],
        ['2', 0],
        ['3', 0],
        ['4', 0],
      ])
      const mapaTecnicaEstudio = new Map<string, number>([
        ['1', 0],
        ['2', 0],
      ])

      for (const particularSession of data) {
        objectiveCount += parseInt(
          particularSession.cantidadObjetivos as unknown as string
        )
        objectiveAcomplishedCount += parseInt(
          particularSession.cantidadObjetivosCumplidos as unknown as string
        )

        const valorActualMotivaciones = mapaMotivaciones.get(
          particularSession.tipoMotivacion.toString()
        )
        mapaMotivaciones.set(
          particularSession.tipoMotivacion.toString(),
          //@ts-expect-error no te preocupes querido ts, esto anda bien
          valorActualMotivaciones + 1
        )
        const valorActualMusica = mapaMusicas.get(
          //@ts-expect-error no joda typescript, anda bien
          particularSession.musicaSeleccionada.toString()
        )
        mapaMusicas.set(
          //@ts-expect-error no joda typescript, anda bien
          particularSession.musicaSeleccionada.toString(),
          //@ts-expect-error no te preocupes querido ts, esto anda bien
          valorActualMusica + 1
        )
        const valorActualTecnicaEstudio = mapaTecnicaEstudio.get(
          particularSession.tecnicaEstudio.toString()
        )
        mapaTecnicaEstudio.set(
          particularSession.tecnicaEstudio.toString(),
          //@ts-expect-error no te preocupes querido ts, esto anda bien
          valorActualTecnicaEstudio + 1
        )
        setFechas.add(particularSession.fecha)
      }

      const fechasOrdenadas = Array.from(setFechas).sort((a, b) => {
        //@ts-expect-error no jodas ts, funca bien
        const dateA = new Date(a)
        //@ts-expect-error no jodas ts, funca bien
        const dateB = new Date(b)
        return dateA.getTime() - dateB.getTime()
      })

      getRachaPorPeriodo(fechasOrdenadas as string[])
      setFechasOdenadas(fechasOrdenadas as string[])

      setTiempoEstudio(studyTime)
      setObjetivosTotales(objectiveCount)
      setObjetivosCumplidos(objectiveAcomplishedCount)
      setObjetivosPendientes(objectiveCount - objectiveAcomplishedCount)
      setMotivacion(
        getElementNameById(
          parseInt(obtenerClaveMayorValor(mapaMotivaciones)),
          motivations
        )
      )
      setMusicaFavorita(
        getElementNameById(
          parseInt(obtenerClaveMayorValor(mapaMusicas)),
          musicList
        )
      )
      setTecnicaEstudio(
        getElementNameById(
          parseInt(obtenerClaveMayorValor(mapaTecnicaEstudio)),
          StudyTechniqueList
        )
      )
    }
  }

  const [eventoSeleccionado, setEventoSeleccionado] = useState<Event>()
  const [eventId, setEventId] = useState(0)
  const { objetivos, tiempo } = useObjetivos()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { session } = useSession()
  const [tiempoEstudio, setTiempoEstudio] = useState(0)
  const [objetivosTotales, setObjetivosTotales] = useState(0)
  const [objetivosCumplidos, setObjetivosCumplidos] = useState(0)
  const [objetivosPendientes, setObjetivosPendientes] = useState(0)
  const [motivacion, setMotivacion] = useState<string>()
  const [musicaFavorita, setMusicaFavorita] = useState<string>()
  const [tecnicaEstudio, setTecnicaEstudio] = useState<string>()
  const [racha, setRacha] = useState(0)
  const { events } = useEvents()
  const [fechasOrdenadas, setFechasOdenadas] = useState<string[]>()
  const [eventObjectives, setEventObjectives] = useState<ObjectiveToRecover[]>(
    []
  )

  useEffect(() => {
    const evento = events.find(e => e.title === name)
    setEventoSeleccionado(evento)
    if (evento && session) {
      gatherObjectivesOfEvent(evento.id)
        .then(data => {
          console.log(data)
          setEventObjectives(data as ObjectiveToRecover[])
        })
        .catch((error: unknown) => {
          console.log(
            'Ocurrio un error a la hora de meter los objetivos al array correspondiente',
            error
          )
        })
      gatherSessionsOfEventOfUser(session.user.id, name)
        .then(data => setStatisticsValues(data, evento))
        .catch((error: unknown) => {
          console.log(error)
        })
    }
  }, [name])

  return (
    <>
      {/* info de periodo */}
      <Card className='container mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg md:flex-row dark:from-gray-800 dark:to-gray-900 dark:shadow-gray-800'>
        <CardHeader>
          <CardTitle className='text-left text-3xl font-bold'>
            Resumen de Sesiones de Estudio para el evento {name}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col justify-between gap-8 md:flex-row'>
          <div className='md:w-1/2'>
            <div className='grid grid-cols-2 gap-6'>
              {/* Aca va a ir lo que se consulte en la BD  */}
              {[
                {
                  label: 'Tiempo total de estudio',
                  value: formatTime(tiempoEstudio),
                },
                { label: 'Total de objetivos', value: objetivosTotales },
                {
                  label: 'Objetivos cumplidos',
                  value: objetivosCumplidos,
                },
                {
                  label: 'Objetivos pendientes',
                  value: objetivosPendientes,
                },
                {
                  label: 'Tipo de motivación preferida',
                  value: motivacion,
                },
                {
                  label: 'Música preferida',
                  value: musicaFavorita,
                },
                {
                  label: 'Técnica de estudio más frecuente',
                  value: tecnicaEstudio,
                },
                {
                  label: 'Mayor racha de días',
                  value: `${racha} ${racha > 1 ? 'días seguidos' : 'dia'}`,
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

          {/* chart */}
          <div className='space-y-6 md:w-1/2'>
            {/* <ChartGrafico periodo={'semanal'} /> */}

            {/*             <Card className='overflow-hidden rounded-lg shadow-md'>
              <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-2'>
                <CardTitle className='text-lg font-bold text-gray-900'>
                  Registro de objetivos
                </CardTitle>
              </CardHeader>
              <CardContent className='p-3'>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width='100%' height={250}>
                    <BarChart accessibilityLayer data={chartDataMeses}>
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
                        dataKey='cumplidos'
                        fill='var(--color-cumplidos)'
                        radius={4}
                      />
                      <Bar
                        dataKey='pendientes '
                        fill='var(--color-pendientes )'
                        radius={4}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card> */}
            {/* Calendario */}
            <Card className='overflow-hidden rounded-lg shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-3'>
                <CardTitle className='text-lg font-bold text-gray-900'>
                  Días Conectado
                </CardTitle>
              </CardHeader>
              <CardContent className='p-2'>
                <div className='flex flex-col md:flex-row'>
                  <Calendar
                    showOutsideDays={false}
                    fromDate={undefined}
                    toDate={new Date()}
                    mode='single'
                    className='rounded-md border text-sm shadow-sm'
                    modifiers={{
                      //@ts-expect-error shhh ts, esto funciona as expected
                      eventDay: fechasOrdenadas?.map(fecha =>
                        convertirAFecha(fecha)
                      ),
                    }}
                    modifiersClassNames={{
                      eventDay: 'bg-primary',
                    }}
                  />{' '}
                  <div className='pl-4 md:w-1/2'>
                    <h1 className='mb-2 text-lg font-semibold'>
                      Horas dedicadas
                    </h1>
                    {/* Lista de eventos */}
                    <p>11/07 2hs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>

        <div className='px-6 pb-6'>
          <h2 className='mb-4 text-2xl font-bold'>
            Objetivos favoritos y de sesión del evento {name}
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className=''>Evento</TableHead> */}
                <TableHead>Objetivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creado</TableHead>
                <TableHead className='text-center'>Tiempo Acumulado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventObjectives.map((objetivo, index) => (
                <TableRow key={index}>
                  {/* <TableCell className='font-medium'>{objetivo}</TableCell> */}
                  <TableCell>
                    <span className='text-blue-700'>
                      {objetivo.descripcion}
                    </span>
                  </TableCell>
                  <TableCell>
                    {objetivo.idEstado === 1 ? (
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
                    {formatDateDashARG(new Date(objetivo.created_at))}
                  </TableCell>
                  <TableCell className='text-center font-medium'>
                    {formatTime(objetivo.horasAcumuladas)}
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
