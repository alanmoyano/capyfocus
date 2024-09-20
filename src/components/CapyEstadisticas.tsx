import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TrendingUp, TrendingUpDown } from 'lucide-react'
import { Bar, BarChart,  LabelList, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import * as React from 'react'
import { Label, Pie, PieChart, CartesianGrid, XAxis } from 'recharts'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'


import { RadialBar, RadialBarChart } from "recharts"

const chartData = [
  { browser: 'ParcialDSI', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'BasedeDatos', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'AnalisisNumerico', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'ParcialASI', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'FisicaII', visitors: 190, fill: 'var(--color-other)' }
]

const chartConfig1: ChartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'ParcialDSI',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Base de Datos',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Analisis Numerico',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'ParcialASI',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'FisicaII',
    color: 'hsl(var(--chart-5))'
  }
}

const chartData1 = [
  { month: 'Enero', desktop: 186, mobile: 80 },
  { month: 'Febrero', desktop: 305, mobile: 200 },
  { month: 'Marzo', desktop: 237, mobile: 120 },
  { month: 'Abril', desktop: 73, mobile: 190 },
  { month: 'Mayo', desktop: 209, mobile: 130 },
  { month: 'Junio', desktop: 214, mobile: 140 }
]

const chartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))'
  },
  label: {
    color: 'hsl(var(--background))'
  }
}


const chartConfig4 = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const chartConfig3 = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function CapyEstadisticas() {
  const totalVisitors = React.useMemo(() => {
    return chartData1.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  const handleSelect = (value: string) => {
    console.log(value)
  }

  return (
    <>
      <p className='text-2xl font-bold'>CapyEstadisticas</p>
      {/* Seleccion de tiempo */}
      <div className='flex'>
        <Select onValueChange={value => handleSelect(value)}>
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
                      <p>Sesion</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-16'>
                      <p>hola</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={1} value='Semana'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Semana</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-16'>
                      <p></p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={2} value='Mensual'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Mensual</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-16'>
                      <p></p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={3} value='Bimestral'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Bimestral</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-16'>
                      <p></p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={3} value='Bimestral'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>6 Meses</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-16'>
                      <p></p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>

              <SelectItem key={4} value='Evento'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>Evento</p>
                    </TooltipTrigger>
                    <TooltipContent className='ml-16'>
                      <p></p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    {/* Eventos el último mes esto se podría mostrar en mes o semana o bimestre */}
      <Card className='flex flex-col'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>Eventos</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          <ChartContainer
            config={chartConfig1}
            className='mx-auto aspect-square max-h-[250px]'
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey='visitors' hideLabel />}
              />
              <Pie data={chartData} dataKey='visitors'>
                <LabelList
                  dataKey='browser'
                  className='fill-background'
                  stroke='none'
                  fontSize={12}
<<<<<<< HEAD
                  formatter={(value: keyof typeof chartConfig1) =>
                    chartConfig1[value]?.label
                  }
=======
                  formatter={(value: keyof typeof chartConfig1) => {
                    // eslint-disable-next-line
                    return chartConfig1[value]?.label
                  }}
>>>>>>> ab33426032afcd12a9279730f748924033593c06
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className='flex-col gap-2 text-sm'>
          <div className='flex items-center gap-2 font-medium leading-none'>
            Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
          </div>
          <div className='leading-none text-muted-foreground'>
            Mostrando cantidad de tiempo dedicado a los eventos del último mes
          </div>
        </CardFooter>
      </Card>

      {/* Top 5 de objetivos frecuentes se mostraria como sesión diaria */}
<hr />
<Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cantidad de tiempo dedicado a los objetivos</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig3}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>

<<<<<<< HEAD
=======
      <Card>
        <CardHeader>
          <CardTitle>Objetivos Cumplidos VS Pendientes</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig4}>
            <BarChart accessibilityLayer data={chartData1}>
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
                content={<ChartTooltipContent indicator='dashed' />}
              />
              <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
              <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          <div className='flex gap-2 font-medium leading-none'>
            Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
          </div>
          <div className='leading-none text-muted-foreground'>
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
>>>>>>> ab33426032afcd12a9279730f748924033593c06

{/* Objetivos Cumplidos VS Pendientes cada 6 meses */}
    <Card>
      <CardHeader>
        <CardTitle>Objetivos Cumplidos VS Pendientes</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig4}>
          <BarChart accessibilityLayer data={chartData1}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month 
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
{/* De tres a 6 meses */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiones de estudio realizadas</CardTitle>
          <CardDescription>Enero - Junio 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData1}
              layout='vertical'
              margin={{
                right: 16
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey='month'
                type='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => value.slice(0, 3)}
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
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          <div className='flex gap-2 font-medium leading-none'>
            Te has conectado 5.2% veces este mes{' '}
            <TrendingUp className='h-4 w-4' />
          </div>
        </CardFooter>
      </Card>
{/* Esta tabla va a estar es sesión y semanal */}
      <Table className='flex w-1/2 flex-col items-center justify-center'>
        <TableCaption>Tiempo total de estudio: 1:25:13</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Objetivos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Metodo</TableHead>
            <TableHead className='text-right'>Tiempo (Minutos)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='font-medium'>Objetivo 1</TableCell>
            <TableCell>Cumplido</TableCell>
            <TableCell>CapyDoro</TableCell>
            <TableCell className='text-right'>12:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Objetivo 2</TableCell>
            <TableCell>Pospuesto</TableCell>
            <TableCell>CapyDoro</TableCell>
            <TableCell className='text-right'>58:10</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Objetivo 3</TableCell>
            <TableCell>Cumplido</TableCell>
            <TableCell>CapyMetro</TableCell>
            <TableCell className='text-right'>15:03</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}
