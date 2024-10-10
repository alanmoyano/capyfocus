/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button } from 'react-day-picker'

const eventillo = {
  summary: 'Pruebitas',
  start: {
    date: '2024-10-10',
  },
  end: {
    date: '2024-10-11',
  },

  description: 'Gonza pudo hacer un evento',
}

export default function GoogleTest() {
  // @ts-expect-error no seas molesto typescript
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const gapi = window.gapi

  const handleTest = () => {
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        // gonza esto no anda
        // 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        scope: 'https://www.googleapis.com/auth/calendar',
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: eventillo,
          })
        })
    })
  }

  return (
    <>
      <Button onClick={handleTest}>Test</Button>
    </>
  )
}
