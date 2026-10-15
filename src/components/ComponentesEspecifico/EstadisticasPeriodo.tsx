import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Reproductor from './Reproductor'
import { Calendar } from '@components/ui/calendar'
import { formatTime } from '@/lib/utils'
import { supabase } from '../supabase/client'
import { useSession } from '../contexts/SessionContext'
import ChartGrafico from './ChartGrafico'
import { es } from 'date-fns/locale'
import html2canvas from 'html2canvas'
import { Button } from '@components/ui/button'
import { ImageDown } from 'lucide-react'
import {
  fechaLocal,
  parsearFechaLocal,
  rangoPeriodo,
  resumirPeriodo,
} from './estadisticasPeriodoDatos'
import type { PeriodoEstadisticas } from './estadisticasPeriodoDatos'

import {
  consultarSesionesPeriodo,
  iniciarConsultaPeriodo,
} from './estadisticasPeriodoConsulta'

type Resumen = ReturnType<typeof resumirPeriodo>
type Carga = {
  clave: string
  estado: 'loading' | 'error' | 'success'
  resumen?: Resumen
}

export default function EstadisticasPeriodo({
  period,
}: {
  period: PeriodoEstadisticas
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { session } = useSession()
  const userId = session?.user.id
  const hoy = fechaLocal(new Date())
  const rango = useMemo(
    () => rangoPeriodo(period, parsearFechaLocal(hoy)),
    [period, hoy]
  )
  const clave = `${userId ?? ''}:${period}:${hoy}`
  const [carga, setCarga] = useState<Carga>({ clave: '', estado: 'loading' })
  const [reintento, setReintento] = useState(0)
  const [seleccion, setSeleccion] = useState<{ clave: string; date: Date }>()
  const selectedDate = seleccion?.clave === clave ? seleccion.date : undefined
  const resumen =
    carga.clave === clave && carga.estado === 'success'
      ? carga.resumen
      : undefined
  const {
    tiempoEstudio,
    objetivosTotales,
    objetivosCumplidos,
    objetivosPendientes,
    motivacion,
    musicaFavorita,
    tecnicaEstudio,
    racha,
    fechasOrdenadas,
    chartData,
    sessionInfoAcumuladas,
  } = resumen ?? resumirPeriodo([], rango, period)
  const dateRange = { fromDate: rango.desde, toDate: rango.hasta }

  useEffect(() => {
    setCarga({ clave, estado: 'loading' })
    if (!userId) return
    return iniciarConsultaPeriodo(
      () => consultarSesionesPeriodo(supabase, userId, rango),
      data =>
        setCarga({
          clave,
          estado: 'success',
          resumen: resumirPeriodo(data, rango, period),
        }),
      () => setCarga({ clave, estado: 'error' })
    )
  }, [clave, userId, rango, period, reintento])

  const captureScreenshot = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current)
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `capyestadisticas_${period}.png`
    link.click()
  }

  if (!userId)
    return <p role='status'>Iniciá sesión para ver tus estadísticas.</p>
  if (carga.clave !== clave || carga.estado === 'loading')
    return <p role='status'>Cargando estadísticas...</p>
  if (carga.estado === 'error')
    return (
      <div role='alert'>
        No se pudieron cargar las estadísticas.{' '}
        <Button onClick={() => setReintento(valor => valor + 1)}>
          Reintentar
        </Button>
      </div>
    )

  return (
    <>
      {/* Boton Screen */}
      <div className='mr-12 flex w-full justify-end'>
        <Button
          variant='ghost'
          onClick={() => {
            void captureScreenshot()
          }}
        >
          <ImageDown className='mr-2 h-4 w-4' />
          Capturar
        </Button>
      </div>
      <Card
        ref={cardRef}
        className='container mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg md:flex-row dark:from-slate-900 dark:to-yellow-950 dark:shadow-gray-800'
      >
        <CardHeader>
          <CardTitle className='text-left text-3xl font-bold dark:text-white'>
            Resumen {period} de Sesiones de Estudio
          </CardTitle>
        </CardHeader>
        <p>
          Del {rango.desde.toLocaleDateString('es-AR')} al{' '}
          {rango.hasta.toLocaleDateString('es-AR')}, inclusive.
        </p>
        {resumen?.cantidadSesiones === 0 && (
          <p role='status'>No hay sesiones en este período.</p>
        )}
        <CardContent className='flex flex-col justify-between gap-8 md:flex-row'>
          <div className='md:w-1/2'>
            <div className='grid grid-cols-2 gap-6'>
              {/* Aca va a ir lo que se consulte en la BD  */}
              {[
                {
                  label: 'Tiempo total de estudio (HH:MM:SS)',
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
                  label: 'Mayor racha de días del período',
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
              <Reproductor src='/auto' className='w-1/2' />
            </div>
          </div>

          {/* chart */}
          <div className='space-y-6 md:w-1/2'>
            <ChartGrafico
              periodo={period}
              chartData={chartData}
              sinSesiones={resumen?.cantidadSesiones === 0}
            />

            {/* Calendario */}
            <Card className='dark:bg-neutral-850 overflow-hidden rounded-lg shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-3 dark:from-slate-800 dark:to-yellow-900'>
                <CardTitle className='text-lg font-bold text-gray-900 dark:text-zinc-200'>
                  Días Conectado
                </CardTitle>
              </CardHeader>
              <CardContent className='p-2'>
                <div className='flex flex-col md:flex-row'>
                  {/* Calendario */}
                  <Calendar
                    showOutsideDays={period !== 'semanal'} // Ocultar días fuera del rango
                    {...dateRange}
                    disabled={[{ before: rango.desde }, { after: rango.hasta }]}
                    mode='single'
                    locale={es}
                    onSelect={date => {
                      setSeleccion(date ? { clave, date } : undefined)
                    }}
                    className='rounded-md border text-sm shadow-sm'
                    modifiers={{
                      eventDay: fechasOrdenadas.map(fecha =>
                        parsearFechaLocal(fecha)
                      ),
                    }}
                    modifiersClassNames={{
                      eventDay: 'bg-primary/50 dark:bg-primary',
                      today: 'bg-accent/70 dark:bg-accent/90',
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
                                .filter(session => {
                                  return (
                                    session.fecha === fechaLocal(selectedDate)
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
                                      <p>{session.cantidadSesiones}</p>
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
