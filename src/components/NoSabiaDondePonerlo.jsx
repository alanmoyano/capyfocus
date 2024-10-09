function me() {
  //Puse mal el archivo para que no me moleste con los import.
  return (
    <>
      <div className='mr-12 flex w-full justify-end'>
        <Button
          variant='ghost'
          onClick={() => captureScreenshot('semanal')}
          className=''
        >
          <ImageDown className='mr-2 h-4 w-4' />
          Capturar
        </Button>
      </div>
      <Card
        ref={cardRefs.semanal}
        className='container mx-auto mt-4 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 shadow-lg'
      >
        <CardHeader>
          <CardTitle>
            <h1 className='text-left text-3xl font-bold'>
              Resumen Semanal de Sesiones de Estudio
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col justify-between gap-8 md:flex-row'>
          <div className='md:w-1/2'>
            <div className='grid grid-cols-2 gap-6'>
              {[
                {
                  label: 'Tiempo total de estudio',
                  value: formatTime(tiempoTotal ?? 0),
                },
                { label: 'Total de objetivos', value: objetivos.length },
                {
                  label: 'Objetivos cumplidos',
                  value: objetivos.length - objetivosPend.length,
                },
                {
                  label: 'Objetivos pendientes',
                  value: objetivosPend.length,
                },
                {
                  label: 'Tipo de motivación preferida',
                  value: motivationType,
                },
                {
                  label: 'Música preferida',
                  value: selectedMusic?.title ?? 'Sin música',
                },
                {
                  label: 'Técnica de estudio más frecuente',
                  value: tecnicaEstudio,
                },
                {
                  label: 'Mayor racha de días',
                  value: objetivosPend.length,
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

          <div className='space-y-6 md:w-1/2'>
            <Card className='overflow-hidden rounded-lg shadow-md'>
              <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-2'>
                <CardTitle className='text-lg font-bold text-gray-900'>
                  Objetivos Favoritos
                </CardTitle>
              </CardHeader>
              <CardContent className='p-3'>
                <ChartContainer config={chartConfig1}>
                  <ResponsiveContainer width='100%' height={250}>
                    <PieChart>
                      <Pie
                        data={objetivos
                          .filter(objetivo => tiempo[objetivo] > 0)
                          .map(objetivo => ({
                            name: objetivo,
                            value: tiempo[objetivo] ?? 0,
                          }))}
                        labelLine={false}
                        outerRadius='70%'
                        dataKey='value'
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {objetivos
                          .filter(objetivo => tiempo[objetivo] > 0)
                          .map((objetivo, index) => (
                            <Cell
                              key={`cell-${index}`}
                              /* Lo cambié porque hacia conflicto con los colores definidos en el css para el dark mode. Funciona igual! <3  */
                              fill={`hsl(var(--color-obj${index + 1}))`}
                              name={objetivo}
                            />
                          ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            indicator='dot'
                            formatType='time'
                          />
                        }
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className='overflow-hidden rounded-lg shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-orange-200 to-blue-200 p-3'>
                <CardTitle className='text-lg font-bold text-gray-900'>
                  Días Conectado
                </CardTitle>
              </CardHeader>
              <CardContent className='p-2'>
                <div className='flex flex-col md:flex-row'>
                  <div className='md:w-1/2'>
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={setDate}
                      className='rounded-md border text-sm shadow-sm'
                    />
                  </div>
                  <div className='pl-4 md:w-1/2'>
                    <h1 className='mb-2 text-lg font-semibold'>Eventos</h1>
                    {/* Lista de eventos */}
                    <p>11/07 Brenda conquista el mundo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>

        <div className='px-6 pb-6'>
          <h2 className='mb-4 text-2xl font-bold'>Objetivos de las Sesiones</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creado</TableHead>
                <TableHead className='text-right'>Tiempo Acumulado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objetivos.map((objetivo, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>{objetivo}</TableCell>
                  <TableCell>{objetivo}</TableCell>
                  <TableCell>
                    {tiempo[objetivo] === 0 ? (
                      <span className='rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800'>
                        Pendiente
                      </span>
                    ) : (
                      <span className='rounded-full bg-green-200 px-2 py-1 text-xs font-semibold text-green-800'>
                        Cumplido
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className='text-blue-700'>Activo</span>
                  </TableCell>
                  <TableCell className='text-right font-medium'>
                    {formatTime(tiempo[objetivo] || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  )
}
