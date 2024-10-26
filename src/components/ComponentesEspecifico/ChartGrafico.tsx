import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip as ChartTooltip,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from 'recharts'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'

const chartDataMeses = [
  {
    month: 'Enero',
    cumplidos: 186,
    pendientes: 80,
    date: new Date(2024, 0, 1),
  },
  {
    month: 'Febrero',
    cumplidos: 305,
    pendientes: 200,
    date: new Date(2024, 1, 1),
  },
  {
    month: 'Marzo',
    cumplidos: 237,
    pendientes: 120,
    date: new Date(2024, 2, 1),
  },
  {
    month: 'Abril',
    cumplidos: 73,
    pendientes: 190,
    date: new Date(2024, 3, 1),
  },
  {
    month: 'Mayo',
    cumplidos: 209,
    pendientes: 130,
    date: new Date(2024, 4, 1),
  },
  {
    month: 'Junio',
    cumplidos: 214,
    pendientes: 140,
    date: new Date(2024, 5, 1),
  },
]

const chartDataMes = [
  { sem: 'Sem1', cumplidos: 186, pendientes: 80, date: new Date('2024/ 5/ 1') },
  {
    sem: 'Sem2',
    cumplidos: 305,
    pendientes: 200,
    date: new Date('2024/ 5/ 7'),
  },
  {
    sem: 'Sem3',
    cumplidos: 237,
    pendientes: 120,
    date: new Date('2024/ 5/ 14'),
  },
  {
    sem: 'Sem4',
    cumplidos: 73,
    pendientes: 190,
    date: new Date('2024/ 5/ 21'),
  },
  {
    sem: 'Sem5',
    cumplidos: 209,
    pendientes: 130,
    date: new Date('2024/ 5/ 28'),
  },
]

const chartDataSemana = [
  {
    day: 'Lunes',
    cumplidos: 186,
    pendientes: 80,
    date: new Date('2024/10/17'),
  },
  {
    day: 'Martes',
    cumplidos: 305,
    pendientes: 200,
    date: new Date('2024/10/18'),
  },
  {
    day: 'Miércoles',
    cumplidos: 237,
    pendientes: 120,
    date: new Date('2024/10/19'),
  },
  {
    day: 'Jueves',
    cumplidos: 73,
    pendientes: 190,
    date: new Date('2024/10/20'),
  },
  {
    day: 'Viernes',
    cumplidos: 209,
    pendientes: 130,
    date: new Date('2024/10/21'),
  },
  {
    day: 'Sábado',
    cumplidos: 214,
    pendientes: 140,
    date: new Date('2024/10/22'),
  },
  {
    day: 'Domingo',
    cumplidos: 204,
    pendientes: 40,
    date: new Date('2024/10/23'),
  },
]

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
  const [datosGrafico, setDatosGrafico] = useState<ChartData[]>(chartDataMeses) //Esto es para los gráficos

  function getDateOfperiodo(periodo: periodo) {
    const dateToReturn = new Date()
    switch (periodo) {
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
  // Obtener datos según el período seleccionado
  const obtenerDatosPorperiodo = useCallback(
    (periodo: periodo): ChartData[] => {
      const startDate = getDateOfperiodo(periodo)
      switch (periodo) {
        case 'mensual':
          return chartDataMeses.filter(data => data.date >= startDate)
        case 'semanal':
          return chartDataSemana.filter(data => data.date >= startDate)
        case 'bimestral':
        case 'sesion':
        case 'evento':
          return chartDataMes.filter(data => data.date >= startDate)
        default:
          return []
      }
    },
    [] // No tiene dependencias, ya que es independiente del renderizado
  )

  useEffect(() => {
    try {
      const datos = obtenerDatosPorperiodo(periodo)
      setDatosGrafico(datos)
    } catch (error) {
      console.error('Error al obtener los datos del gráfico:', error)
    }
  }, [periodo, obtenerDatosPorperiodo])
  return (
    <div>
      <Card className='overflow-hidden rounded-lg shadow-md'>
        <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-2'>
          <CardTitle className='text-lg font-bold text-gray-900'>
            Registro de objetivos
          </CardTitle>
        </CardHeader>
        <CardContent className='p-3'>
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
                  dataKey={periodo === 'semanal' ? 'day' : 'month'} // Cambia 'month' a 'day' si se está mostrando la semana
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
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
        </CardContent>
      </Card>
    </div>
  )
}
