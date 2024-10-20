function dateToTimetz(date: Date | null): string {
  // Obtiene la parte de la hora y la zona horaria
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC', // Cambia esto a la zona horaria que necesites
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }
  //@ts-expect-error anda, no te preocupes
  return date.toLocaleString('en-US', options)
}

const formatDateSlash = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

const formatDateDash = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export { dateToTimetz, formatDateDash, formatDateSlash }
