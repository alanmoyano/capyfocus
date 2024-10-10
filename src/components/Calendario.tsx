import { AddToCalendarButton, atcb_action, AddToCalendarActionType } from 'add-to-calendar-button-react'
import { Button } from '@/components/ui/button'

// {fecha, }: {fecha: Date}

export default function Calendario() {

  const hoy = new Date()

  const formattedDate = hoy.toISOString().split('T')[0]

  const handleClick = () => {
    console.log('hola')
    atcb_action({})
  }

  return (
    <section>
      <h2>Calendario</h2>
      <p>Prueba de calendario</p>
      <Button onClick={handleClick}>
        Agregar
      </Button>
      <AddToCalendarButton
        name='Eventos fáciles!'
        options={['Apple', 'Google']}
        startDate={formattedDate}
        endDate={formattedDate}
        startTime='00:00'
        endTime='23:30'
        timeZone='America/Argentina/Cordoba'
        label='Agregar a mi calendario'
      ></AddToCalendarButton>
    </section>
  )
}
