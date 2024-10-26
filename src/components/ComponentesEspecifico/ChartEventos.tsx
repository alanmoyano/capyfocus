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
export const description = 'A bar chart with a custom label'
/* const chartData = [
  { month: 'Objetivo 1', desktop: 186, mobile: 80 },
  { month: 'Objetivo 2', desktop: 305, mobile: 200 },
  { month: 'Objetivo 3', desktop: 237, mobile: 120 },
  { month: 'Objetivo', desktop: 73, mobile: 190 },
  { month: 'Objetivo', desktop: 209, mobile: 130 },
  { month: 'Objetivo', desktop: 214, mobile: 140 },
] */
const chartConfig = {
  desktop: {
    label: 'Objetivo',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig

type chartData = {
  nombreObjetivo: string
  horas: number
}
export default function ChartEventos({chartData} : {chartData: chartData}) {
  return (
    <Card className='overflow-hidden rounded-lg shadow-sm'>
      <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-3'>
        <CardTitle>Cantidad de horas dedicada a cada objetivo</CardTitle>
        <CardDescription>Desde: colocar fecha mas chica</CardDescription>
      </CardHeader>
      <CardContent className=''>
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
              dataKey='month'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey='desktop' type='number' hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Bar
              dataKey='desktop'
              layout='vertical'
              fill='var(--color-desktop)'
              radius={4}
            >
              <LabelList
                dataKey='month'
                position='insideLeft'
                offset={8}
                className='fill-[--color-label]'
                fontSize={12}
              />
              <LabelList
                dataKey='desktop'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
