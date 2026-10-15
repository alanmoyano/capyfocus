export const formatDateDash = (date: Date) => {
  // Función que nos permite pasar de un objeto tipo date a uno de tipo string en formato YYYY-MM-DD
  // Usa el día local del navegador, no el de UTC
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
