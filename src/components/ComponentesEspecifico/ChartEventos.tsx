import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatDateDashARG } from '@/constants/supportFunctions'

const chartConfig = {
  horas: {
    label: 'Tiempo',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var())',
  },
} satisfies ChartConfig

type chartData = {
  nombreObjetivo: string
  horas: number
}
export default function ChartEventos({
  chartData,
  minimaFecha,
}: {
  chartData: chartData[]
  minimaFecha: Date
}) {
  function getFechaMinima() {
    const hoy = new Date()
    if (minimaFecha >= hoy) {
      return 'hoy'
    } else {
      return formatDateDashARG(minimaFecha)
    }
  }
  const fecha = getFechaMinima()

  return (
    <Card className='overflow-hidden rounded-lg shadow-sm'>
      <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-4 dark:from-slate-800 dark:to-yellow-900 dark:text-slate-200'>
        <CardTitle>Cantidad de horas dedicada a cada objetivo</CardTitle>
        <CardDescription>Desde: {fecha}</CardDescription>
      </CardHeader>
      <CardContent className='dark:bg-neutral-850'>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='nombreObjetivo'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              tickFormatter={value => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey='horas' type='number' hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Bar
              dataKey='horas'
              layout='vertical'
              fill='var(--color-horas)'
              radius={4}
            >
              <LabelList
                dataKey='nombreObjetivo'
                position='insideLeft'
                offset={8}
                className='fill-[--color-label]'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
