import React from 'react'
import { useRoute } from 'wouter'
import { ModeToggle } from './ModeToggle'
import { Button } from './ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import {
  NavigationMenu,
  // NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  navigationMenuTriggerStyle
  // NavigationMenuViewport
} from '@/components/ui/navigation-menu'

type NavbarLinkProps = {
  to: string
  children?: React.ReactNode
}

function NavbarLink({ to, children }: NavbarLinkProps) {
  const isActive = useRoute(to)[0]

  return (
    <NavigationMenuLink
      active={isActive}
      className={navigationMenuTriggerStyle()}
      href={to}
    >
      {children}
    </NavigationMenuLink>
  )
}

export default function Navbar() {
  return (
    // <nav className='fixed start-0 top-0 z-20 w-full border-b bg-accent'>
    //   <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-center p-2'>
    //     <NavbarLink to='/' location={location}>
    //       Inicio
    //     </NavbarLink>
    //     <NavbarLink to='/login' location={location}>
    //       Login
    //     </NavbarLink>
    //     <NavbarLink to='/signup' location={location}>
    //       Signup
    //     </NavbarLink>
    //     <NavbarLink to='/pomodoro' location={location}>
    //       Pomodoro
    //     </NavbarLink>
    //     <NavbarLink to='/timer' location={location}>
    //       Timer
    //     </NavbarLink>
    //     <NavbarLink to='/badges' location={location}>
    //       Badges
    //     </NavbarLink>
    //     <button onClick={toggleTheme} className='rounded bg-primary p-2'>
    //       Theme: {theme}
    //     </button>
    //     <ModeToggle />
    //   </div>
    // </nav>
    <NavigationMenu className='sticky w-screen p-2'>
      <div className='flex flex-1 justify-start'>
        {/* <NavbarLink to='/'>Inicio</NavbarLink>

        versión con logo! */}

        <NavbarLink to='/usuario'>
          <div className='flex items-center justify-center gap-2'>
            <img src='/logo.png' height={30} width={30} />
            <p>Capyfocus</p>
          </div>
        </NavbarLink>
      </div>

      <NavigationMenuList>
        <NavigationMenuItem>
          <NavbarLink to='/login'>Login</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/signup'>Signup</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/'>Inicio</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' className='border-0'>
                Musica
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Links Spotify</DialogTitle>
                <DialogDescription className='text-accent/100'>
                  Musica seleccionada especiamente para concentrarse! Elige el
                  estilo que mas se adapte!.
                </DialogDescription>
              </DialogHeader>
              <iframe
                className='border-radius:12px'
                src='https://open.spotify.com/embed/playlist/6xYhxczmfgi6L6knoEHktx?utm_source=generator'
                width='100%'
                height='152'
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='lazy'
              ></iframe>
              <iframe
                className='border-radius:12px'
                src='https://open.spotify.com/embed/playlist/5GnSqO293GdPWaJhD6iz8E?utm_source=generator'
                width='100%'
                height='152'
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='lazy'
              ></iframe>
              <p>Aca van los Links!</p>
              <DialogFooter>
                <p>Gracias por escuchas nuestra Musica!</p>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/capyInsignias'>CapyInsiginas</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/capyEstadisticas'>CapyEstadisticas</NavbarLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <ModeToggle className='flex flex-1 justify-end' />
    </NavigationMenu>
  )
}
