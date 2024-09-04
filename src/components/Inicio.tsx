import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function Inicio() {
  return (
    <>
      <section className='flex flex-col gap-20 p-10 md:flex-row'>
        <div className='m-auto'>
          <img src='/idle.gif' />
        </div>

        <div className='m-auto'>
          <h1 className='text-4xl font-bold'>Hola!</h1>
          <p>Elije tu método de estudio:</p>
          <ToggleGroup type='single' className='rounded-xl bg-primary/60 p-2'>
            <ToggleGroupItem value='Capydoro'>Capydoro</ToggleGroupItem>
            <ToggleGroupItem value='Capymetro'>Capymetro</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </section>
    </>
  )
}
