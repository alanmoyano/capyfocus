import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip as ChartTooltip,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from 'recharts'
import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

const chartConfig = {
  cumplidos: {
    label: 'Cumplidos',
    color: 'hsl(var(--chart-1))',
  },
  pendientes: {
    label: 'Pendientes',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

type periodo =
  | 'sesion'
  | 'semanal'
  | 'mensual'
  | 'bimestral'
  | 'semestre'
  | 'evento'

// Define el tipo para los datos del gráfico
type ChartData =
  | { month: string; cumplidos: number; pendientes: number; date: Date }
  | { sem: string; cumplidos: number; pendientes: number; date: Date }
  | { day: string; cumplidos: number; pendientes: number; date: Date }

export default function ChartGrafico({
  periodo,
  chartData,
}: {
  periodo: periodo
  chartData: ChartData[]
}) {
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
  const [loading, setLoading] = useState(true) // Estado de carga

  useEffect(() => {
    // Simulamos un tiempo de carga. Reemplaza esto con la lógica real de carga.
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000) // Ajusta el tiempo según sea necesario

    return () => clearTimeout(timer)
  }, [])
  return (
    <div>
      <Card className='overflow-hidden rounded-lg shadow-md'>
        <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-2'>
          <CardTitle className='text-lg font-bold text-gray-900'>
            {periodo === 'bimestral' &&
              `Registro de objetivos del bimestre ${Meses[new Date().getMonth() - 1]} - ${Meses[new Date().getMonth()]} `}
            {(periodo === 'semanal' || periodo === 'mensual') &&
              `Registro de objetivos del mes de ${Meses[new Date().getMonth()]}`}
            {periodo === 'semestre' &&
              `Registro de objetivos del mes de ${Meses[new Date().getMonth() - 6]} - ${Meses[new Date().getMonth()]}`}
          </CardTitle>
        </CardHeader>
        <CardContent className='p-3'>
          {loading ? ( // Muestra el icono de carga si está cargando
            <div className='flex items-center justify-center p-16'>
              <Loader className='mr-3 h-10 w-10 animate-spin' />
              Cargando...
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              {!chartData || chartData.length === 0 ? ( //Si se saca crashea el programa
                <div className='h-full w-full'>
                  <p className='flex items-center justify-center text-xl'>
                    No hay datos disponibles para el período seleccionado
                  </p>
                </div>
              ) : (
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey={
                      periodo === 'semanal'
                        ? 'day'
                        : periodo === 'mensual'
                          ? 'month'
                          : 'sem'
                    }
                    tickLine={true}
                    tickMargin={10}
                    axisLine={true}
                    tickFormatter={(value: string | number, index: number) => {
                      if (periodo === 'semanal') {
                        // Si el periodo es semanal, muestra solo el número del día
                        //@ts-expect-error No se puede llamar a slice en un valor de tipo string | number
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
                        return value.slice(0, 3)
                      } else if (periodo === 'mensual') {
                        // Si es mensual, muestra el día y el mes
                        const monthDate = chartData[index].date
                        return `${monthDate.getDate()}`
                      } else if (
                        periodo === 'bimestral' ||
                        periodo === 'semestre'
                      ) {
                        const monthDate = chartData[index].date
                        return `${monthDate.getDate()}`
                      }
                    }}
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
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey='cumplidos'
                    fill='var(--color-cumplidos)'
                    radius={4}
                  />
                  <Bar
                    dataKey='pendientes'
                    fill='var(--color-pendientes)'
                    radius={4}
                  />
                </BarChart>
              )}
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          {periodo === 'bimestral' && (
            <div className='flex gap-2 font-medium leading-none'>
              Los datos presentados son calculados cada 2 días
            </div>
          )}
          {periodo === 'semestre' && (
            <div className='flex gap-2 font-medium leading-none'>
              Los datos presentados son calculados cada 7 días
            </div>
          )}
          {/* <div className='leading-none text-muted-foreground'>
            ssdfsdffdssdsdf
          </div> */}
        </CardFooter>
      </Card>
    </div>
  )
}
