import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

import { useLocation } from 'wouter'

import { toast } from 'sonner'
import Eventos from './ComponentesEspecifico/Eventos'

import { useSession } from './contexts/SessionContext'

import {
  Check,
  ChevronsUpDown,
  Edit3,
  Loader2,
  Hourglass,
  Star,
  StarOff,
  Timer,
  Trash,
  X,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useObjetivos } from './contexts/ObjetivosContext'

import { Button } from './ui/button'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Card, CardContent } from '@/components/ui/card'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useMotivation } from './contexts/MotivationContext'

import { useMusic } from './contexts/MusicContext'

import { useSesion } from '@/components/contexts/SesionContext'

import { Helmet } from 'react-helmet'
import DialogoChicho from './ComponentesEspecifico/DialogoChicho'
import { supabase } from './supabase/client'

import { insigniaQuince } from '@/constants/supportFunctions'
import posthog from 'posthog-js'
import CapyInfo from './ComponentesEspecifico/CapyToast/CapyInfo'
import Reproductor from './ComponentesEspecifico/Reproductor'
import { useEvents } from './contexts/EventsContext'
import {
  MAX_OBJETIVOS,
  buscarEquivalente,
  mensajesErrorObjetivo,
  reconciliarConFavoritos,
  renombrarClave,
  renombrarEnLista,
  validarEdicionObjetivo,
  validarNuevoObjetivo,
} from '@/lib/inicio/objetivos'
import {
  combinarFavoritos,
  combinarTiempoFavorito,
  FavoritosSync,
  type FavoritoRemoto,
  type FavoritosApi,
} from '@/lib/inicio/favoritos'
type CapyMetodos = 'Capydoro' | 'Capymetro'

const playlists = [
  {
    key: 1,
    src: './CapyChill.webp',
    alt: 'CapyChill',
    title: 'CapyChill',
    description: 'Música relajante para estudiar con tranquilidad',
    spotifyUri: '7u6QwhygZJJqqGWMMMINhR',
  },
  {
    key: 2,
    src: './CapyAmbiente.jpg',
    alt: 'CapyAmbiente',
    title: 'CapyAmbiente',
    description: 'Sonidos ambientales para mejorar la concentración',
    spotifyUri: '4Pi6DScPJfg1RTGVZuxTZV',
  },
  {
    key: 3,
    src: './CapySinthwave.jpg',
    alt: 'CapySynthwave',
    title: 'CapySynthwave',
    description: 'Música electrónica retro para un estudio energético',
    spotifyUri: '6xYhxczmfgi6L6knoEHktx',
  },
  {
    key: 4,
    src: './CapyEpic.jpg',
    alt: 'CapyEpic',
    title: 'CapyEpic',
    description: 'Música épica para momentos de máxima concentración',
    spotifyUri: '5GnSqO293GdPWaJhD6iz8E',
  },
]

type Motivacion = {
  id: number
  nombre: string
  descripcion?: string
}

type EstadoFavoritos = 'inactivo' | 'cargando' | 'listo' | 'error'

const columnasFavorito = 'id, descripcion, horasAcumuladas'

// Variantes de los helpers de favoritos que propagan los errores de Supabase
// en lugar de absorberlos, para poder mostrar error y reintentar.
const favoritosApi: FavoritosApi = {
  async listar(uuid) {
    const { data, error } = await supabase
      .from('ObjetivosFavoritos')
      .select(columnasFavorito)
      .eq('idUsuario', uuid)
      .eq('idEstado', 1)
    if (error) throw error
    const favoritos: FavoritoRemoto[] = data
    return favoritos
  },
  async insertar(descripcion, uuid) {
    // Si ya existe uno activo equivalente (p. ej. la carga inicial falló o se
    // guardó con otros espacios), se reutiliza con sus horas
    const existentes = await supabase
      .from('ObjetivosFavoritos')
      .select(columnasFavorito)
      .eq('idUsuario', uuid)
      .eq('idEstado', 1)
    if (existentes.error) throw existentes.error
    const activos = existentes.data as FavoritoRemoto[]
    const texto = buscarEquivalente(
      descripcion,
      activos.map(favorito => favorito.descripcion)
    )
    const favoritoExistente = activos.find(f => f.descripcion === texto)
    if (favoritoExistente) return favoritoExistente

    const { data, error } = await supabase
      .from('ObjetivosFavoritos')
      .insert([
        {
          descripcion,
          created_at: new Date().toISOString(),
          idUsuario: uuid,
          idEstado: 1,
        },
      ])
      .select(columnasFavorito)
      .single()
    if (error) throw error
    const favorito: FavoritoRemoto = data
    return favorito
  },
  async archivar({ id, descripcion }, uuid) {
    const consulta = supabase
      .from('ObjetivosFavoritos')
      .update({ idEstado: 2 })
      .eq('idUsuario', uuid)
    if (id === undefined) {
      // Sin id conocido: archiva las filas activas con ese texto
      const { data, error } = await consulta
        .eq('descripcion', descripcion)
        .eq('idEstado', 1)
        .select('id')
      if (error) throw error
      if (data.length > 0) return
      // Cero filas sólo es éxito si se confirma que no queda ninguna activa
      const activas = await supabase
        .from('ObjetivosFavoritos')
        .select('id')
        .eq('idUsuario', uuid)
        .eq('descripcion', descripcion)
        .eq('idEstado', 1)
        .limit(1)
      if (activas.error) throw activas.error
      if (activas.data.length > 0) throw new Error('No se archivó el favorito')
      return
    }
    // Con id, cero filas afectadas significa que el cambio no se confirmó
    const { data, error } = await consulta.eq('id', id).select('id')
    if (error) throw error
    if (data.length === 0) throw new Error('No se archivó el favorito')
  },
}

export default function Inicio() {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [mensajeObjetivo, setMensajeObjetivo] = useState<string | null>(null)
  const [index, setIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const botonesEditar = useRef<(HTMLButtonElement | null)[]>([])
  const focoAlCerrarEdicion = useRef<number | null>(null)
  const buscadorFavoritos = useRef<HTMLInputElement>(null)
  const { session } = useSession()
  const uuid = session?.user.id ?? null
  const { selectedEvent } = useEvents()

  const {
    objetivos,
    setObjetivos,
    objetivosFav,
    setObjetivosFav,
    setTiempoFavorito,
    setTiempo,
    setTiempoSesion,
    setObjetivosPend,
  } = useObjetivos()

  const favoritosSync = useRef<FavoritosSync | null>(null)
  favoritosSync.current ??= new FavoritosSync(favoritosApi, buscarEquivalente)
  const [estadoFavoritos, setEstadoFavoritos] =
    useState<EstadoFavoritos>('inactivo')
  const [favoritosPendientes, setFavoritosPendientes] = useState<string[]>([])

  const [description, setDescription] = useState<CapyMetodos>()

  const [, setLocation] = useLocation()

  const { motivationType, setMotivationType } = useMotivation()

  const { selectedMusic, setSelectedMusic } = useMusic()
  const selectedPlaylist =
    playlists.find(item => item.spotifyUri === selectedMusic?.spotifyUri)
      ?.key ?? -1

  const { setTecnicaEstudio } = useSesion()

  const [motivaciones, setMotivaciones] = useState<Motivacion[]>([])

  // Objetivos vigentes para callbacks asíncronos (reconciliación tras cargar)
  const objetivosActuales = useRef(objetivos)
  useEffect(() => {
    objetivosActuales.current = objetivos
  }, [objetivos])

  // Renombra un objetivo y las claves relacionadas (tiempos y pendientes)
  const renombrarObjetivo = useCallback(
    (anterior: string, nuevo: string) => {
      if (anterior === nuevo) return
      setObjetivos(prev => renombrarEnLista(prev, anterior, nuevo))
      setTiempo(prev => renombrarClave(prev, anterior, nuevo))
      setTiempoSesion(prev => renombrarClave(prev, anterior, nuevo))
      setObjetivosPend(prev => renombrarEnLista(prev, anterior, nuevo))
    },
    [setObjetivos, setTiempo, setTiempoSesion, setObjetivosPend]
  )

  const cargarFavoritos = useCallback(() => {
    const sync = favoritosSync.current
    if (!sync?.identidadActual()) return
    setEstadoFavoritos('cargando')
    sync
      .cargar()
      .then(remotos => {
        // null: respuesta de una identidad o carga anterior
        if (!remotos) return
        setObjetivosFav(prev => combinarFavoritos(remotos, prev, sync))
        setTiempoFavorito(prev => combinarTiempoFavorito(prev, remotos))
        // Objetivos escritos antes de la carga que equivalen a un favorito
        // (los que tienen un alta en vuelo adoptan el texto al confirmarse)
        reconciliarConFavoritos(
          objetivosActuales.current,
          remotos.map(favorito => favorito.descripcion)
        ).forEach(([anterior, nuevo]) => {
          if (!sync.tieneAltaPendiente(anterior))
            renombrarObjetivo(anterior, nuevo)
        })
        setEstadoFavoritos('listo')
      })
      .catch((error: unknown) => {
        console.error('No se pudieron recuperar los favoritos', error)
        setEstadoFavoritos('error')
      })
  }, [setObjetivosFav, setTiempoFavorito, renombrarObjetivo])

  // Los favoritos se cargan por identidad al montar y al cambiar de usuario.
  // Al desmontar o cambiar de usuario se invalidan las operaciones en curso.
  const uuidAnterior = useRef<string | null | undefined>(undefined)
  useEffect(() => {
    const sync = favoritosSync.current
    if (uuidAnterior.current !== undefined && uuidAnterior.current !== uuid) {
      // No mostrar favoritos de otra identidad mientras carga la nueva
      setObjetivosFav([])
      setTiempoFavorito({})
    }
    uuidAnterior.current = uuid
    sync?.setIdentidad(uuid)
    setFavoritosPendientes([])
    if (uuid) cargarFavoritos()
    else setEstadoFavoritos('inactivo')
    return () => sync?.invalidar()
  }, [uuid, cargarFavoritos, setObjetivosFav, setTiempoFavorito])

  const handleAccept = () => {
    // Al desmontar Inicio se invalidan las operaciones de favoritos: esperar a
    // que terminen para que el timer sume sobre las horas guardadas
    if (
      uuid &&
      description &&
      (estadoFavoritos === 'cargando' || favoritosPendientes.length > 0)
    ) {
      toast.info('Guardando tus favoritos', {
        description:
          'Esperá un momento antes de empezar para que el tiempo se sume a tus favoritos.',
      })
      return
    }
    switch (description) {
      case 'Capydoro':
        setLocation('/capydoro')
        setTecnicaEstudio(description)
        posthog.capture('Sesión de Capydoro')
        break
      case 'Capymetro':
        setLocation('capymetro')
        setTecnicaEstudio(description)
        posthog.capture('Sesión de Capymetro')
        break
      case undefined:
        toast.error('CapyError', {
          description: 'Selecciona un método de estudio antes.',
          duration: 5000,
          action: {
            label: 'Aceptar',
            onClick: () => {
              toast.dismiss()
            },
          },
        })
        break
    }
  }

  const handleSelect = (value: string) => {
    setMotivationType(value)
  }

  // Único camino de alta: escritura manual y favoritos validan igual
  const agregarObjetivo = (texto: string) => {
    const resultado = validarNuevoObjetivo(texto, objetivos)
    if (!resultado.ok) {
      setMensajeObjetivo(mensajesErrorObjetivo[resultado.error])
      return false
    }
    // Si equivale a un favorito, se usa su texto exacto: tiempos y helpers
    // compartidos lo identifican por igualdad de descripción
    const valor =
      buscarEquivalente(resultado.valor, objetivosFav) ?? resultado.valor
    setObjetivos(prev =>
      validarNuevoObjetivo(valor, prev).ok ? [...prev, valor] : prev
    )
    setMensajeObjetivo(
      objetivos.length + 1 === MAX_OBJETIVOS
        ? mensajesErrorObjetivo.limite
        : null
    )
    return true
  }

  const handleAdd = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (agregarObjetivo(inputValue)) setInputValue('')
  }

  const handleDelete = (indice: number) => {
    setObjetivos(prev => prev.filter((_, i) => i !== indice))
    setMensajeObjetivo(null)
    if (index === null) return
    if (index === indice) setIndex(null)
    else if (index > indice) setIndex(index - 1)
  }

  const handleEdit = (indice: number) => {
    setIndex(indice)
    setEditValue(objetivos[indice])
    setEditError(null)
  }

  const cerrarEdicion = (indice: number) => {
    focoAlCerrarEdicion.current = indice
    setIndex(null)
    setEditError(null)
  }

  // Devuelve el foco al botón de editar de la fila al salir de la edición
  useEffect(() => {
    if (index !== null || focoAlCerrarEdicion.current === null) return
    botonesEditar.current[focoAlCerrarEdicion.current]?.focus()
    focoAlCerrarEdicion.current = null
  }, [index])

  const guardarEdicion = (indice: number) => {
    const resultado = validarEdicionObjetivo(editValue, objetivos, indice)
    if (!resultado.ok) {
      setEditError(mensajesErrorObjetivo[resultado.error])
      return
    }
    const anterior = objetivos[indice]
    const nuevo =
      buscarEquivalente(resultado.valor, objetivosFav) ?? resultado.valor
    if (nuevo !== anterior) {
      // Los tiempos y pendientes usan el texto como clave
      renombrarObjetivo(anterior, nuevo)
      if (objetivosFav.includes(anterior) && !objetivosFav.includes(nuevo)) {
        toast.info('El favorito anterior sigue guardado', {
          description: `"${anterior}" sigue en tus favoritos. Marcá "${nuevo}" si querés guardarlo también.`,
        })
      }
    }
    cerrarEdicion(indice)
  }

  const handleSaveEdit = (
    e: KeyboardEvent<HTMLInputElement>,
    indice: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      guardarEdicion(indice)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cerrarEdicion(indice)
    }
  }

  const marcarFavoritoPendiente = (objetivo: string, pendiente: boolean) => {
    setFavoritosPendientes(prev =>
      pendiente
        ? [...prev, objetivo]
        : prev.filter(favorito => favorito !== objetivo)
    )
  }

  const cambiarFavorito = (objetivo: string, accion: 'agregar' | 'quitar') => {
    const sync = favoritosSync.current
    const agregar = (prev: string[]) =>
      prev.includes(objetivo) ? prev : [...prev, objetivo]
    const quitar = (prev: string[]) =>
      prev.filter(favorito => favorito !== objetivo)

    // Cambio optimista; si el backend falla se revierte
    setObjetivosFav(accion === 'agregar' ? agregar : quitar)
    // Sin sesión los favoritos sólo viven en memoria
    if (!uuid || !sync) return

    marcarFavoritoPendiente(objetivo, true)
    const generacion = sync.generacion()
    const operacion =
      accion === 'agregar' ? sync.agregar(objetivo) : sync.quitar(objetivo)
    operacion
      .then(resultado => {
        // Si la fila ya existía, conservar sus horas acumuladas
        if (typeof resultado === 'object' && resultado.estado !== 'obsoleto') {
          const { favorito } = resultado
          setTiempoFavorito(prev => combinarTiempoFavorito(prev, [favorito]))
          // Se reutilizó un favorito equivalente: adoptar su texto exacto
          if (favorito.descripcion !== objetivo) {
            setObjetivosFav(prev => [
              ...new Set(
                prev.map(f => (f === objetivo ? favorito.descripcion : f))
              ),
            ])
            renombrarObjetivo(objetivo, favorito.descripcion)
          }
        }
      })
      .catch((error: unknown) => {
        console.error('No se pudo actualizar el favorito', error)
        if (sync.generacion() !== generacion) return
        setObjetivosFav(accion === 'agregar' ? quitar : agregar)
        toast.error(
          accion === 'agregar'
            ? 'No se pudo guardar el favorito'
            : 'No se pudo quitar el favorito',
          {
            description: `"${objetivo}". Revisá tu conexión e intentá de nuevo.`,
            action: {
              label: 'Reintentar',
              onClick: () => {
                if (sync.generacion() === generacion)
                  cambiarFavorito(objetivo, accion)
              },
            },
          }
        )
      })
      .finally(() => {
        // Tras cambiar de identidad los pendientes ya se reiniciaron: no
        // liberar el de una operación nueva con el mismo texto
        if (sync.generacion() === generacion)
          marcarFavoritoPendiente(objetivo, false)
      })
  }

  const handleFav = (objetivo: string) => {
    if (favoritosPendientes.includes(objetivo)) return
    cambiarFavorito(
      objetivo,
      objetivosFav.includes(objetivo) ? 'quitar' : 'agregar'
    )
  }

  // musica

  const handleMusicSelection = (music: {
    title: string
    spotifyUri: string
  }) => {
    if (selectedMusic?.spotifyUri === music.spotifyUri) {
      setSelectedMusic(null)
    } else {
      setSelectedMusic(music)
    }
  }

  useEffect(() => {
    async function getMotivaciones() {
      const { data } = await supabase.from('TiposMotivacion').select('*')
      return data
    }

    getMotivaciones()
      .then(data => {
        if (!data) return

        setMotivaciones(data)
      })

      .catch((error: unknown) => console.error(error))
  }, [])

  useEffect(() => {
    if (!session) return

    insigniaQuince(session)
      .then(data => console.log('insignia 15 ya estaba desbloqueada: ', data))
      .catch((error: unknown) => console.log(error))
  }, [session])

  return (
    <>
      <Helmet>
        <link
          rel='preload'
          fetchPriority='high'
          as='image'
          href='/CapyChill.webp'
          type='image/webp'
        />
      </Helmet>
      <section className='flex flex-col sm:gap-20 sm:p-6 md:flex-row'>
        <div className='mt-4 px-4 sm:px-4'>
          <DialogoChicho />
          <div className='relative flex max-h-[300px] w-full min-w-[290px] max-w-[340px] items-center justify-center overflow-hidden sm:h-full sm:max-h-[450px] sm:min-w-[450px] sm:max-w-[450px]'>
            <Reproductor src='/CapyNada' />
          </div>
        </div>
        {/* columna 2 */}
        <div className='p-2 sm:p-0'>
          <h1 className='text-4xl font-bold'>Hola!</h1>
          <p id='metodo-estudio-label' className='mt-2'>
            Elige tu método de estudio:
          </p>
          <ToggleGroup
            type='single'
            aria-labelledby='metodo-estudio-label'
            className='rounded-xl bg-primary/60 p-2 dark:bg-primary'
            value={description ?? ''}
            onValueChange={value =>
              setDescription(value ? (value as CapyMetodos) : undefined)
            }
          >
            <ToggleGroupItem
              value='Capydoro'
              className='flex items-center justify-center gap-1'
            >
              <Timer size={20} aria-hidden />
              Capydoro
            </ToggleGroupItem>
            <ToggleGroupItem
              value='Capymetro'
              className='flex items-center justify-center gap-1'
            >
              <Hourglass size={20} aria-hidden />
              Capymetro
            </ToggleGroupItem>
          </ToggleGroup>
          {/* Agregar evento  */}
          <div className='flex h-auto w-1/2 items-center space-x-4'>
            <Eventos />
            <div className='mt-6'>
              <CapyInfo
                label='Más información sobre eventos'
                desc='Organiza tus sesiones de estudio con eventos y objetivos. Selecciona el evento, haz clic en "Aceptar", añade los objetivos de la sesión y ¡Controla tu progreso en las CapyEstadísticas!'
              />
            </div>
          </div>

          {/* Objetivos */}
          <div className='mt-4 rounded-xl bg-secondary/70 p-4 dark:bg-secondary/90'>
            {/* Aca si eligio sesion o evento va a ir */}
            <div className='flex items-center justify-between gap-2'>
              <label htmlFor='nuevo-objetivo'>
                {selectedEvent
                  ? `Objetivos del evento: ${selectedEvent.title}`
                  : 'Objetivos de sesión'}
              </label>
              <span id='objetivos-cantidad' className='text-sm'>
                {objetivos.length}/{MAX_OBJETIVOS}
                <span className='sr-only'> objetivos</span>
              </span>
            </div>

            <div className='mt-2 flex items-center gap-2'>
              <Input
                id='nuevo-objetivo'
                type='text'
                placeholder='Ingrese el objetivo'
                value={inputValue}
                onKeyDown={handleAdd}
                onChange={e => {
                  setInputValue(e.target.value)
                  setMensajeObjetivo(null)
                }}
                aria-describedby='objetivos-cantidad objetivos-mensaje'
                aria-invalid={
                  mensajeObjetivo !== null && objetivos.length < MAX_OBJETIVOS
                }
                className='input-placeholder rounded-md p-3'
                style={{
                  backgroundColor: 'hsl(var(--input-bg))',
                  border: `1px solid hsl(var(--input-border))`,
                }}
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    aria-label='Elegir un objetivo favorito'
                    aria-haspopup='dialog'
                    aria-expanded={open}
                    className='justify-between'
                  >
                    <Star aria-hidden />
                    <ChevronsUpDown
                      aria-hidden
                      className='ml-2 h-4 w-4 shrink-0 opacity-50'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='p-0'
                  aria-label='Objetivos favoritos'
                >
                  <Command label='Objetivos favoritos'>
                    <CommandInput
                      ref={buscadorFavoritos}
                      placeholder='Seleccionar objetivo favorito...'
                      aria-label='Buscar objetivo favorito'
                    />
                    {estadoFavoritos === 'cargando' && (
                      <p
                        role='status'
                        className='flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground'
                      >
                        <Loader2 className='h-4 w-4 animate-spin' aria-hidden />
                        Cargando favoritos…
                      </p>
                    )}
                    {estadoFavoritos === 'error' && (
                      <div
                        role='alert'
                        className='flex items-center justify-between gap-2 px-3 py-2 text-sm'
                      >
                        No se pudieron cargar tus favoritos.
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => {
                            // El botón desaparece al reintentar: el foco pasa al buscador
                            buscadorFavoritos.current?.focus()
                            cargarFavoritos()
                          }}
                        >
                          Reintentar
                        </Button>
                      </div>
                    )}
                    <CommandList>
                      <CommandEmpty>
                        {objetivosFav.length === 0
                          ? 'Todavía no tenés objetivos favoritos.'
                          : 'No se encontró el objetivo.'}
                      </CommandEmpty>
                      <CommandGroup>
                        {objetivosFav.map(objetivoFav => {
                          const agregado = objetivos.includes(objetivoFav)
                          return (
                            <CommandItem
                              key={objetivoFav}
                              value={objetivoFav}
                              disabled={agregado}
                              onSelect={() => {
                                setOpen(false)
                                agregarObjetivo(objetivoFav)
                              }}
                            >
                              <Check
                                aria-hidden
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  agregado ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {objetivoFav}
                              {agregado && (
                                <span className='sr-only'> (ya agregado)</span>
                              )}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className='mt-4'>
              <ul className='list-inside list-disc space-y-2 text-base text-black'>
                {objetivos.map((objetivo, key) => {
                  const esFavorito = objetivosFav.includes(objetivo)
                  const favoritoPendiente =
                    favoritosPendientes.includes(objetivo)
                  return (
                    <li
                      key={objetivo}
                      className='flex items-center justify-between'
                    >
                      {index === key ? (
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center gap-2'>
                            <Input
                              type='text'
                              autoFocus
                              value={editValue}
                              onChange={e => {
                                setEditValue(e.target.value)
                                setEditError(null)
                              }}
                              onKeyDown={e => handleSaveEdit(e, key)}
                              aria-label={`Editar objetivo: ${objetivo}`}
                              aria-invalid={editError !== null}
                              aria-describedby='objetivo-edicion-ayuda objetivo-edicion-error'
                              className='rounded-md border border-secondary bg-white p-3 shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2'
                            />
                            <Button
                              variant='icon'
                              size='icon'
                              aria-label='Guardar cambios'
                              onClick={() => guardarEdicion(key)}
                            >
                              <Check size={20} aria-hidden />
                            </Button>
                            <Button
                              variant='icon'
                              size='icon'
                              aria-label='Cancelar edición'
                              onClick={() => cerrarEdicion(key)}
                            >
                              <X size={20} aria-hidden />
                            </Button>
                          </div>
                          <p id='objetivo-edicion-ayuda' className='sr-only'>
                            Enter guarda, Escape cancela.
                          </p>
                          <p
                            id='objetivo-edicion-error'
                            role='alert'
                            className='text-sm text-red-600'
                          >
                            {editError}
                          </p>
                        </div>
                      ) : (
                        <div className='flex w-full items-center justify-between'>
                          <span>{objetivo}</span>
                          <div className='flex items-center'>
                            <TooltipProvider delayDuration={50}>
                              <Tooltip delayDuration={50}>
                                <TooltipTrigger asChild>
                                  <Button
                                    ref={boton => {
                                      botonesEditar.current[key] = boton
                                    }}
                                    variant='icon'
                                    size='icon'
                                    aria-label={`Modificar objetivo: ${objetivo}`}
                                    onClick={() => handleEdit(key)}
                                  >
                                    <Edit3 size={20} aria-hidden />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Modificar</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider delayDuration={50}>
                              <Tooltip delayDuration={50}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='icon'
                                    size='icon'
                                    aria-label={`Eliminar objetivo: ${objetivo}`}
                                    onClick={() => handleDelete(key)}
                                  >
                                    <Trash size={20} aria-hidden />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Eliminar</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider delayDuration={50}>
                              <Tooltip delayDuration={50}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='icon'
                                    size='icon'
                                    aria-label={`Favorito: ${objetivo}`}
                                    aria-pressed={esFavorito}
                                    aria-busy={favoritoPendiente}
                                    aria-disabled={favoritoPendiente}
                                    onClick={() => handleFav(objetivo)}
                                  >
                                    {favoritoPendiente ? (
                                      <Loader2
                                        size={20}
                                        className='animate-spin'
                                        aria-hidden
                                      />
                                    ) : esFavorito ? (
                                      <StarOff
                                        size={20}
                                        style={{ color: '#ffbc05' }}
                                        aria-hidden
                                      />
                                    ) : (
                                      <Star
                                        size={20}
                                        className='text-black-500'
                                        aria-hidden
                                      />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {favoritoPendiente
                                      ? 'Guardando…'
                                      : esFavorito
                                        ? 'Quitar de favoritos'
                                        : 'Agregar a favoritos'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
            <p
              id='objetivos-mensaje'
              role='status'
              className='mt-2 text-red-500 empty:hidden'
            >
              {mensajeObjetivo ??
                (objetivos.length >= MAX_OBJETIVOS
                  ? mensajesErrorObjetivo.limite
                  : '')}
            </p>
          </div>
          <div className='mt-6 flex items-center justify-center'>
            {/* Motivación */}
            <Select
              value={motivationType}
              onValueChange={value => handleSelect(value)}
            >
              <SelectTrigger
                className='ml-4 w-[280px]'
                aria-label='Tipo de motivación'
              >
                {/* Se muestra el estado vigente aunque la lista no haya cargado */}
                <SelectValue placeholder='Selecciona una motivación'>
                  {motivationType}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo de motivación</SelectLabel>
                  {motivaciones.map(motivacion => (
                    <SelectItem key={motivacion.id} value={motivacion.nombre}>
                      {motivacion.nombre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <CapyInfo
              label='Más información sobre la motivación'
              desc='La motivación es un factor clave para el éxito en el estudio. Selecciona el tipo de mensajes que te ayude a mantenerte enfocado y motivado. '
            />
          </div>
          {/* Musica */}
          <div className='mt-4'>
            <div className='flex justify-between'>
              <h2 className='rounded-lg bg-accent p-2' aria-live='polite'>
                Playlist seleccionada:{' '}
                <span className='font-semibold text-accent-foreground'>
                  {selectedPlaylist !== -1
                    ? playlists[selectedPlaylist - 1].title
                    : 'Sin música'}
                </span>
              </h2>
              <CapyInfo
                label='Más información sobre las playlists'
                desc='Haz click en la CapyPlaylist que más te guste para estudiar con música de fondo.
                Recuerde tener su cuenta de Spotify iniciada en el navegador'
              />
            </div>

            <Carousel
              className='w-full max-w-md'
              opts={{ loop: true }}
              aria-label='CapyPlaylists'
            >
              <CarouselContent>
                {playlists.map(item => {
                  const seleccionada = selectedPlaylist === item.key
                  return (
                    <CarouselItem key={item.key}>
                      <div className='p-1'>
                        <button
                          type='button'
                          aria-pressed={seleccionada}
                          aria-label={`${item.title}: ${item.description}`}
                          onClick={() => {
                            handleMusicSelection({
                              title: item.title,
                              spotifyUri: item.spotifyUri,
                            })
                          }}
                          className={cn(
                            'group block w-full rounded-lg text-left ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            seleccionada && 'ring-4 ring-accent'
                          )}
                        >
                          <Card className='relative h-48 w-full overflow-hidden'>
                            <CardContent className='p-0'>
                              <img
                                src={item.src}
                                className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110'
                                alt=''
                              />
                              {seleccionada && (
                                <span className='absolute right-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground'>
                                  <Check size={14} aria-hidden />
                                  Seleccionada
                                </span>
                              )}
                              <span className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100'>
                                <span
                                  className={`mb-2 text-lg font-bold ${seleccionada ? 'text-xl text-accent' : 'text-white'}`}
                                >
                                  {item.title}
                                </span>
                                <span className='px-4 text-center text-sm text-white'>
                                  {item.description}
                                </span>
                              </span>
                            </CardContent>
                          </Card>
                        </button>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious
                className='left-4'
                aria-label='Playlist anterior'
              />
              <CarouselNext
                className='right-4'
                aria-label='Playlist siguiente'
              />
            </Carousel>
          </div>

          <div className='mt-5 flex justify-end space-x-4'>
            <Button
              type='submit'
              className='flex justify-end'
              onClick={handleAccept}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
