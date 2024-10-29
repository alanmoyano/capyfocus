/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useRef, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  formatDateSlash,
} from '../../constants/supportFunctions'
import { supabase } from '../supabase/client'
import { useSession } from '../contexts/SessionContext'
import ChartGrafico from './ChartGrafico'
import { subMonths, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale'
import html2canvas from 'html2canvas'
import { Button } from '@components/ui/button'
import { ImageDown } from 'lucide-react'

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

type ChartData =
  | { month: string; cumplidos: number; pendientes: number; date: Date }
  | { sem: string; cumplidos: number; pendientes: number; date: Date }
  | { day: string; cumplidos: number; pendientes: number; date: Date }

type sessionToRecover = {
  uuid: string
  horaInicioSesion: string
  fecha: string
  horaFinSesion: string
  tecnicaEstudio: number
  tipoMotivacion: number
  cantidadObjetivosCumplidos: number
  cantidadObjetivos: number
  tiempoEstudio: number
}

//Los meses de las sesiones aparecen desde aquí, cuando traemos todas las sesiones de estudio a partir de una fecha determinada, los mismos se guardan en el atributo
//fecha, las cuales vienen en formato YYYY-MM-DD, y si queremos usarlo, podes hacerlo de 2 maneras.
// 1) Hacer un split sobre el valor de fecha a partir de los guiones (-) y obtener el valor del segundo miembro, asi te da el valor del mes en las escala de enero = 1 y diciembre = 12
// 2) Convertir ese string a una fecha con la funcion convertirAFecha() y luego a la fecha obtenida pedirle que te devuelva su mes con la función getMonth() en la escala de enero = 0 y diciembre = 11
async function getPeriodSessions(period: Date, uuid: string) {
  const periodFormatted = formatDateDash(period)
  const { data } = await supabase
    .from('SesionesDeEstudio')
    .select()
    .eq('idUsuario', uuid)
    .gte('fecha', periodFormatted)

  if (data) return data as sessionToRecover[]
  else return
}

function generateDataOfChart(period: Period, matrizDatos: unknown) {
  const dataToChart: ChartData[] = []
  const diasSemana = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ]
  const Meses = [
    'Enero',
    'Feberero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  switch (period) {
    case 'semanal':
      //Se cargan los datos de la semana en el chart
      //@ts-expect-error no jodas ts
      for (const fila of matrizDatos) {
        const fecha = new Date(fila[0])
        const dayIndex = (fecha.getDay() + 6) % 7 // Ajusta que Lunes sea 0
        const dataToPutInChart: ChartData = {
          day: diasSemana[dayIndex],
          cumplidos: fila[1] as number,
          pendientes: fila[2] as number,
          date: fecha,
        }
        dataToChart.push(dataToPutInChart)
      }
      break
    case 'mensual':
      //Lo copie y pegue lo de arriba.
      //@ts-expect-error no jodas ts
      for (const fila of matrizDatos) {
        const fecha = new Date(fila[0])
        const dataToPutInChart: ChartData = {
          month: Meses[fecha.getMonth()],
          cumplidos: fila[1] as number,
          pendientes: fila[2] as number,
          date: fecha,
        }

        dataToChart.push(dataToPutInChart)
      }
      break
    case 'bimestral': {
      let banderaControl = true
      let objetivosCumplidos = 0
      let pendientes = 0
      //@ts-expect-error no te preocupes ts, anda perfecto
      for (const fila of matrizDatos) {
        const fecha = new Date(fila[0])
        if (banderaControl) {
          banderaControl = false
          objetivosCumplidos = fila[1] as number
          pendientes = fila[2] as number
        } else {
          const dateToSave = new Date(fila[0])
          const dataToPutInChart: ChartData = {
            month: Meses[fecha.getMonth()],
            cumplidos: objetivosCumplidos + (fila[1] as number),
            pendientes: pendientes + (fila[2] as number),
            date: dateToSave,
          }

          dataToChart.push(dataToPutInChart)
          banderaControl = true
        }
      }
      if (!banderaControl) {
        const dateToSave = new Date()
        const dataToPutInChart: ChartData = {
          month: Meses[dateToSave.getMonth()],
          cumplidos: objetivosCumplidos,
          pendientes: pendientes,
          date: dateToSave,
        }

        dataToChart.push(dataToPutInChart)
      }

      break
    }
    case 'semestre': {
      let contadorControl = 0
      let objetivosCumplidos = 0
      let objetivosPendientes = 0

      //@ts-expect-error no te preocupes ts, anda perfecto
      for (const fila of matrizDatos) {
        const fecha = new Date(fila[0])
        if (contadorControl < 7) {
          contadorControl++
          objetivosCumplidos += fila[1] as number
          objetivosPendientes += fila[2] as number
        } else {
          const dateToSave = new Date(fila[0])
          const dataToPutInChart: ChartData = {
            month: Meses[fecha.getMonth()],
            cumplidos: objetivosCumplidos + (fila[1] as number),
            pendientes: objetivosPendientes + (fila[2] as number),
            date: dateToSave,
          }

          dataToChart.push(dataToPutInChart)
          contadorControl = 0
          objetivosCumplidos = 0
          objetivosPendientes = 0
        }
      }
      if (contadorControl < 7) {
        const dateToSave = new Date()
        const dataToPutInChart: ChartData = {
          month: Meses[dateToSave.getMonth()],
          cumplidos: objetivosCumplidos,
          pendientes: objetivosPendientes,
          date: dateToSave,
        }

        dataToChart.push(dataToPutInChart)
      }
    }
  }
  return dataToChart
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

function getDistanceOfPeriod(period: Period) {
  let numToReturn = 0
  switch (period) {
    case 'semanal':
      numToReturn += 7
      break
    case 'mensual':
      numToReturn += 30
      break
    case 'bimestral':
      numToReturn += 60
      break
    case 'semestre':
      numToReturn += 186
      break
    default:
      break
  }
  return numToReturn
}

export default function EstadisticasPeriodo({ period }: { period: Period }) {
  const cardRefs = {
    sesion: useRef(null),
    semanal: useRef(null),
    mensual: useRef(null),
    bimestral: useRef(null),
    semestre: useRef(null),
    evento: useRef(null),
  }

  const captureScreenshot = async (period: Period) => {
    const canvas = await html2canvas(
      cardRefs[period].current as unknown as HTMLElement
    )
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `capyestadisticas_${period}.png`
    link.click()
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

  const setStatisticsValues = (
    sessionsRecovered: sessionToRecover[],
    period: Period
  ) => {
    let studyTimeAcum = 0
    let objectiveCount = 0
    let objectiveAcomplishedCount = 0
    const setFechas = new Set()
    const today = new Date()

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

    const matrizFechas = []
    for (let i = 0; i < getDistanceOfPeriod(period); i++) {
      const fechaAuxiliar = new Date(today)
      matrizFechas.push([
        new Date(fechaAuxiliar.setDate(today.getDate() - i)),
        0,
        0,
      ])
    }
    const sessionesResumidas: sessionInfo[] = []

    for (const particularSession of sessionsRecovered) {
      //Este particularSession es una y cada una de las sesiones que recuperó la función de arriba y para acceder a la fecha lo podes hacer como particularSession.fecha
      console.log(particularSession)

      studyTimeAcum += particularSession.tiempoEstudio
      objectiveCount += parseInt(
        particularSession.cantidadObjetivos as unknown as string
      )
      objectiveAcomplishedCount += parseInt(
        particularSession.cantidadObjetivosCumplidos as unknown as string
      )
      const valorActualMotivaciones = mapaMotivaciones.get(
        particularSession.tipoMotivacion.toString()
      )!
      mapaMotivaciones.set(
        particularSession.tipoMotivacion.toString(),
        valorActualMotivaciones + 1
      )
      const valorActualMusica = mapaMusicas.get(
        //@ts-expect-error no joda typescript, anda bien
        particularSession.musicaSeleccionada.toString()
      )!
      mapaMusicas.set(
        //@ts-expect-error no joda typescript, anda bien
        particularSession.musicaSeleccionada.toString(),
        valorActualMusica + 1
      )
      const valorActualTecnicaEstudio = mapaTecnicaEstudio.get(
        particularSession.tecnicaEstudio.toString()
      )!
      mapaTecnicaEstudio.set(
        particularSession.tecnicaEstudio.toString(),
        valorActualTecnicaEstudio + 1
      )
      setFechas.add(particularSession.fecha)
      const arrayEncontrado = matrizFechas.find(
        e =>
          formatDateDash(e[0] as Date) === (particularSession.fecha as unknown)
      )
      if (arrayEncontrado) {
        //@ts-expect-error no tengo ganas de pelear ts, dejalo asi
        arrayEncontrado[1] += particularSession.cantidadObjetivosCumplidos
        //@ts-expect-error no tengo ganas de pelear ts, dejalo asi
        arrayEncontrado[2] +=
          particularSession.cantidadObjetivos -
          particularSession.cantidadObjetivosCumplidos
      }
      const sesionResumida: sessionInfo = {
        fecha: particularSession.fecha,
        objetivosCumplidos: particularSession.cantidadObjetivosCumplidos,
        objetivosTotales: particularSession.cantidadObjetivos,
        tiempoEstudio: particularSession.tiempoEstudio,
      }

      sessionesResumidas.push(sesionResumida)
    }

    console.log('sesiones resumidas', sessionesResumidas)

    const fechasOrdenadas = Array.from(setFechas).sort((a, b) => {
      //@ts-expect-error no jodas ts, funca bien
      const dateA = new Date(a)
      //@ts-expect-error no jodas ts, funca bien
      const dateB = new Date(b)
      return dateA.getTime() - dateB.getTime()
    })

    getRachaPorPeriodo(fechasOrdenadas as string[])
    setFechasOrdenadas(fechasOrdenadas as string[])

    setTiempoEstudio(studyTimeAcum)
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

    //Aca de ordena por fecha de forma ascendente
    const sortedData = matrizFechas.sort(
      //@ts-expect-error no hay problema ts
      (a, b) => a[0].getTime() - b[0].getTime()
    )

    //@ts-expect-error no jodas despues se arregla
    setChartData(generateDataOfChart(period, matrizFechas))
    setSessionInfoAcumuladas(accumulateSessions(sessionesResumidas))
  }

  const accumulateSessions = (sessionInfo: sessionInfo[]) => {
    const acumulados: Record<
      string,
      {
        objetivosTotales: number
        objetivosCumplidos: number
        tiempoEstudio: number
      }
    > = {}

    for (const session of sessionInfo) {
      const { fecha, objetivosTotales, objetivosCumplidos, tiempoEstudio } =
        session

      // Si la fecha ya está en el objeto acumulados, sumamos los valores
      if (acumulados[fecha]) {
        acumulados[fecha].objetivosTotales += objetivosTotales
        acumulados[fecha].objetivosCumplidos += objetivosCumplidos
        acumulados[fecha].tiempoEstudio += tiempoEstudio // Asegúrate de que tiempoEstudio esté definido en session
      } else {
        // Si la fecha no está, la agregamos
        acumulados[fecha] = {
          objetivosTotales,

          objetivosCumplidos,
          tiempoEstudio, // Asegúrate de que tiempoEstudio esté definido en session
        }
      }
    }

    return Object.entries(acumulados).map(([fecha, datos]) => ({
      fecha,
      ...datos,
    }))
  }

  type sessionInfo = {
    fecha: string
    objetivosTotales: number
    objetivosCumplidos: number
    tiempoEstudio: number
  }

  const [sessionInfoAcumuladas, setSessionInfoAcumuladas] =
    useState<sessionInfo[]>()
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
  const [fechasOrdenadas, setFechasOrdenadas] = useState<string[]>()
  const [chartData, setChartData] = useState([])

  //Esto es para el calendario, cuando inicia y cuando termina de mostrar
  const dateRange = (() => {
    switch (period) {
      case 'semanal':
        return {
          fromDate: subWeeks(new Date(), 1),
          toDate: new Date(),
        }
      case 'mensual':
        return {
          fromDate: subMonths(new Date(), 1),
          toDate: new Date(),
        }
      case 'bimestral':
        return {
          fromDate: subMonths(new Date(), 2),
          toDate: new Date(),
        }
      case 'semestre':
        return {
          fromDate: subMonths(new Date(), 6),
          toDate: new Date(),
        }
      default:
        return {}
    }
  })()

  useEffect(() => {
    const dateToRecover = getDateOfPeriod(period)
    if (session) {
      getPeriodSessions(dateToRecover, session.user.id)
        .then(data => {
          if (data) {
            console.log(data)
            setStatisticsValues(data, period)
          }
        })
        .catch((error: unknown) => {
          console.log('Ocurrio un error recuperando las sesiones', error)
        })
    }
  }, [period, getDateOfPeriod, session])
  //Calendario:
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  console.log('sesiones acumuladas', sessionInfoAcumuladas)

  return (
    <>
      {/* Boton Screen */}
      <div className='mr-12 flex w-full justify-end'>
        <Button variant='ghost' onClick={() => captureScreenshot(period)}>
          <ImageDown className='mr-2 h-4 w-4' />
          Capturar
        </Button>
      </div>
      <Card
        ref={cardRefs[period]}
        className='container mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg md:flex-row dark:from-gray-800 dark:to-gray-900 dark:shadow-gray-800'
      >
        <CardHeader>
          <CardTitle className='text-left text-3xl font-bold'>
            Resumen {period} de Sesiones de Estudio
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
            <ChartGrafico periodo={period} chartData={chartData} />

            {/* Calendario */}
            <Card className='overflow-hidden rounded-lg shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-3'>
                <CardTitle className='text-lg font-bold text-gray-900'>
                  Días Conectado
                </CardTitle>
              </CardHeader>
              <CardContent className='p-2'>
                <div className='flex flex-col md:flex-row'>
                  {/* Calendario */}
                  <Calendar
                    showOutsideDays={period !== 'semanal'} // Ocultar días fuera del rango
                    {...dateRange} //Aplica solo si es semanal
                    mode='single'
                    locale={es}
                    //@ts-expect-error no se que es este error pero no creo que vaya a pasar ts
                    onSelect={date => {
                      setSelectedDate(date)
                    }}
                    className='rounded-md border text-sm shadow-sm'
                    modifiers={{
                      //@ts-expect-error shhh ts, esto funciona as expected
                      eventDay: fechasOrdenadas?.map(fecha =>
                        convertirAFecha(fecha)
                      ),
                    }}
                    modifiersClassNames={{
                      eventDay: 'bg-primary/50 ',
                    }}
                  />
                  {
                    <div className='pl-4 md:w-1/2'>
                      <h1 className='mb-2 text-lg font-bold'>
                        Información del día:{' '}
                        {selectedDate?.toLocaleDateString()}
                      </h1>
                      <ul className='space-y-2'>
                        {selectedDate ? (
                          <li>
                            <h2 className='mb-2 text-lg font-semibold'>
                              Resumen de sesiones de estudio:
                              <hr className='border-gray-400'></hr>
                            </h2>
                            <div>
                              {sessionInfoAcumuladas
                                ?.filter(session => {
                                  // Filtramos las sesiones por la fecha seleccionada
                                  const fechaFormateada = formatDateSlash(
                                    session.fecha
                                  )
                                  return (
                                    new Date(
                                      fechaFormateada
                                    ).toLocaleDateString() ===
                                    selectedDate.toLocaleDateString()
                                  )
                                })
                                .map((session, index) => (
                                  <div key={index + 1}>
                                    <span className='flex gap-2'>
                                      <p className='font-semibold'>
                                        Objetivos Totales:{' '}
                                      </p>
                                      <p>{session.objetivosTotales}</p>
                                    </span>
                                    <span className='flex gap-2'>
                                      <p className='font-semibold'>
                                        Objetivos Cumplidos:{' '}
                                      </p>
                                      <p>{session.objetivosCumplidos}</p>
                                    </span>
                                    <span className='flex gap-2'>
                                      <p className='font-semibold'>
                                        Tiempo de Estudio:{' '}
                                      </p>
                                      <p>
                                        {formatTime(session.tiempoEstudio)}{' '}
                                      </p>
                                    </span>
                                    <span className='flex gap-2'>
                                      <p className='font-semibold'>
                                        Cantidad de sesiones:{' '}
                                      </p>
                                      <p>{sessionInfoAcumuladas.length}</p>
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
