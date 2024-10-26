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
