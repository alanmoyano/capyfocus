import { AddToCalendarButton } from 'add-to-calendar-button-react'

export default function Alendario() {
  const hoy = new Date()
  const formattedHoy = hoy.toISOString().split('T')[0]

  return (
    <section>
      <h2>Calendario</h2>
      <p>Prueba de calendario</p>
      <AddToCalendarButton
        name='Eventos fáciles!'
        options={['Apple', 'Google']}
        startDate={formattedHoy}
        endDate={formattedHoy}
        startTime='10:15'
        endTime='23:30'
        timeZone='America/Argentina/Cordoba'
        label='Agregar a mi calendario'
      ></AddToCalendarButton>
    </section>
  )
}
