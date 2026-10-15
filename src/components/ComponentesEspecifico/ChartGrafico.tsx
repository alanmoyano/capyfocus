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
import { ChartColumn } from 'lucide-react'
import type {
  BucketPeriodo,
  PeriodoEstadisticas,
} from './estadisticasPeriodoDatos'

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

export default function ChartGrafico({
  periodo,
  chartData,
  sinSesiones,
}: {
  periodo: PeriodoEstadisticas
  chartData: BucketPeriodo[]
  sinSesiones: boolean
}) {
  return (
    <div>
      <Card className='overflow-hidden rounded-lg shadow-md'>
        <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-4 dark:from-slate-800 dark:to-yellow-900'>
          <CardTitle className='text-lg font-bold text-gray-900 dark:text-zinc-200'>
            Registro de objetivos{' '}
            {periodo === 'semanal'
              ? 'de los últimos 7 días'
              : periodo === 'mensual'
                ? 'del mes actual'
                : periodo === 'bimestral'
                  ? 'del mes anterior y el actual'
                  : 'de los últimos 6 meses calendario'}
          </CardTitle>
        </CardHeader>
        <CardContent className='dark:bg-neutral-850 p-3'>
          {sinSesiones || chartData.length === 0 ? (
            <p role='status'>
              <ChartColumn aria-hidden='true' />
              No hay sesiones en este período.
            </p>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='label'
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
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
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          {periodo === 'bimestral' && (
            <div className='flex gap-2 font-medium leading-none'>
              Objetivos agrupados en intervalos de hasta 2 días.
            </div>
          )}
          {periodo === 'semestre' && (
            <div className='flex gap-2 font-medium leading-none'>
              Objetivos agrupados en intervalos de hasta 7 días.
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
