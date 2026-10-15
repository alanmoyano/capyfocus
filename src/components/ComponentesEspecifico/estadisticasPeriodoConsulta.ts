import type { SupabaseClient } from '@supabase/supabase-js'
import type { RangoPeriodo, SesionPeriodo } from './estadisticasPeriodoDatos'
import { fechaLocal } from './estadisticasPeriodoDatos.ts'

export async function consultarSesionesPeriodo(
  cliente: SupabaseClient,
  usuario: string,
  rango: RangoPeriodo
): Promise<SesionPeriodo[]> {
  const { data, error } = await cliente
    .from('SesionesDeEstudio')
    .select(
      'fecha,tecnicaEstudio,tipoMotivacion,musicaSeleccionada,cantidadObjetivosCumplidos,cantidadObjetivos,tiempoEstudio'
    )
    .eq('idUsuario', usuario)
    .gte('fecha', fechaLocal(rango.desde))
    .lte('fecha', fechaLocal(rango.hasta))
  if (error) throw error
  return data
}

// El cleanup del efecto invalida tanto el éxito como el error de una consulta
// anterior. No depende de que el transporte pueda abortar el request.
export function iniciarConsultaPeriodo<T>(
  consultar: () => Promise<T>,
  alCompletar: (datos: T) => void,
  alFallar: () => void
): () => void {
  let vigente = true
  void consultar()
    .then(datos => {
      if (vigente) alCompletar(datos)
    })
    .catch(() => {
      if (vigente) alFallar()
    })
  return () => {
    vigente = false
  }
}
