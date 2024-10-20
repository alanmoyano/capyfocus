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

export { dateToTimetz }
