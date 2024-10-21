import {
    ChartConfig,
    ChartContainer,
    ChartTooltipContent,
  } from '@/components/ui/chart'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import {
    Tooltip as ChartTooltip,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    ResponsiveContainer,
  } from 'recharts'
  import { useEffect, useState } from 'react'
  
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
    { month: 'Sem1', cumplidos: 186, pendientes: 80, date: new Date(2024, 5, 1) },
    {
      month: 'Sem2',
      cumplidos: 305,
      pendientes: 200,
      date: new Date(2024, 5, 7),
    },
    {
      month: 'Sem3',
      cumplidos: 237,
      pendientes: 120,
      date: new Date(2024, 5, 14),
    },
    {
      month: 'Sem4',
      cumplidos: 73,
      pendientes: 190,
      date: new Date(2024, 5, 21),
    },
    {
      month: 'Sem5',
      cumplidos: 209,
      pendientes: 130,
      date: new Date(2024, 5, 28),
    },
  ]
  
  const chartDataSemana = [
    { day: 'Lunes', cumplidos: 186, pendientes: 80, date: new Date(2024, 9, 14) },
    {
      day: 'Martes',
      cumplidos: 305,
      pendientes: 200,
      date: new Date(2024, 9, 15),
    },
    {
      day: 'Miércoles',
      cumplidos: 237,
      pendientes: 120,
      date: new Date(2024, 9, 16),
    },
    {
      day: 'Jueves',
      cumplidos: 73,
      pendientes: 190,
      date: new Date(2024, 9, 17),
    },
    {
      day: 'Viernes',
      cumplidos: 209,
      pendientes: 130,
      date: new Date(2024, 9, 18),
    },
    {
      day: 'Sábado',
      cumplidos: 214,
      pendientes: 140,
      date: new Date(2024, 9, 19),
    },
    {
      day: 'Domingo',
      cumplidos: 204,
      pendientes: 40,
      date: new Date(2024, 9, 20),
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
  
  type Graficos = 'chartDataMeses' | 'chartDataSemana' | 'chartDataMes'
  
  type Period =
    | 'sesion'
    | 'semanal'
    | 'mensual'
    | 'bimestral'
    | 'semestre'
    | 'evento'
  
  // Define el tipo para los datos del gráfico
  type ChartData =
    | { month: string; cumplidos: number; pendientes: number; date: Date }
    | { day: string; cumplidos: number; pendientes: number; date: Date }
  
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
  
  export default function ChartGrafico() {
    const [periodoSeleccionado, setPeriodoSeleccionado] =
      useState<Period>('mensual')
    const [tipoGrafico, setTipoGrafico] = useState<Graficos>('chartDataMeses')
    const [datosGrafico, setDatosGrafico] = useState<ChartData[]>(chartDataMeses)
  
    // Obtener datos según el período seleccionado
    const obtenerDatosPorPeriodo = (period: Period): ChartData[] => {
      const startDate = getDateOfPeriod(period)
      switch (period) {
        case 'mensual':
          setTipoGrafico('chartDataMeses')
          return chartDataMeses.filter(data => data.date >= startDate)
        case 'semanal':
          setTipoGrafico('chartDataSemana')
          return chartDataSemana.filter(data => data.date >= startDate)
        case 'bimestral':
        case 'sesion':
        case 'evento':
          setTipoGrafico('chartDataMes')
          return chartDataMes.filter(data => data.date >= startDate)
        default:
          return []
      }
    }
  
    // Actualizar los datos del gráfico al cambiar el período
    useEffect(() => {
      setDatosGrafico(obtenerDatosPorPeriodo(periodoSeleccionado))
    }, [periodoSeleccionado])
  
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
              <ResponsiveContainer width='100%' height={250}>
                <BarChart accessibilityLayer data={datosGrafico}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey={tipoGrafico === 'chartDataSemana' ? 'day' : 'month'} // Cambia 'month' a 'day' si se está mostrando la semana
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
                    dataKey='pendientes'
                    fill='var(--color-pendientes)'
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    )
  }
  