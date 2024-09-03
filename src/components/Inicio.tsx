import { Link } from 'wouter'

export default function Inicio() {
  return (
    <>
      <section className='flex flex-col gap-20 p-10 md:flex-row'>
        <div className='m-auto'>
          <img src='/idle.gif' />
        </div>

        <div className='m-auto'>
          <h1>hola!</h1>
          <Link to='/login' className='font-bold text-primary'>
            Login
          </Link>
        </div>
      </section>
    </>
  )
}
