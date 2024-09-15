import React from 'react'
import {
  Link
  // useRoute
} from 'wouter'
import { ModeToggle } from './ModeToggle'

import { Menu } from 'lucide-react'

import {
  // NavigationMenu,
  // NavigationMenuContent,
  // NavigationMenuIndicator,
  // NavigationMenuItem,
  // NavigationMenuLink,
  // NavigationMenuList,
  // NavigationMenuTrigger,
  navigationMenuTriggerStyle
  // NavigationMenuViewport
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

type NavbarLinkProps = {
  to: string
  children?: React.ReactNode
}

function NavbarLink({ to, children }: NavbarLinkProps) {
  // const isActive = useRoute(to)[0]

  return (
    <Link className={navigationMenuTriggerStyle()} href={to}>
      {children}
    </Link>
  )
}

function LogoLink() {
  return (
    <Link to='/' className={navigationMenuTriggerStyle()}>
      <div className='flex items-center justify-center gap-2'>
        <img src='/logo.png' height={30} width={30} />
        <p>Capyfocus</p>
      </div>
    </Link>
  )
}

function NavItems() {
  return (
    <>
      <NavbarLink to='/login'>Login</NavbarLink>

      <NavbarLink to='/'>Inicio</NavbarLink>

      <NavbarLink to='/capyInsignias'>CapyInsiginas</NavbarLink>

      <NavbarLink to='/capyEstadisticas'>CapyEstadisticas</NavbarLink>
    </>
  )
}

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-14 max-w-screen-2xl items-center justify-between md:justify-center'>
        <div className='flex items-center gap-4 md:absolute md:left-4'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                className='px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
              >
                <Menu className='size-5' />
                <span className='sr-only'>Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='pr-0'>
              <div className='px-7'>
                <LogoLink />
              </div>

              <div className='mt-4 flex flex-col gap-4 px-7'>
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>

          <LogoLink />
        </div>

        <nav className='hidden items-center gap-2 text-sm font-medium md:flex'>
          <NavItems />
        </nav>

        <div className='flex items-center md:absolute md:right-4'>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
