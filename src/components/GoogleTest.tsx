import { Button } from "react-day-picker";

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
  
  const gapi = window.gapi

  const handleTest = () => {
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey:'AIzaSyCi1OgmfS7oJ-Ebin6GU7ASy2zNX-xDCCs',
        clientId: '530796160525-slc3f0td20il4jb052knhqvh0347nu4i.apps.googleusercontent.com',
        discoveryDocs: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        scope: 'https://www.googleapis.com/auth/calendar'
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))


      gapi.auth2.getAuthInstance().signIn()
      .then(
        () => {
          gapi.client.calendar.events.insert({'calendarId': 'primary', 'resource': eventillo})
        }
      )
    })

  }
  
  return (
    <>
    <Button onClick={handleTest}>
      Test
    </Button>
    </>
  )
}