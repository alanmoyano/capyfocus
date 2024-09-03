import React from 'react'
import { useRoute } from 'wouter'
import { ModeToggle } from './ModeToggle'

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
    <NavigationMenu className='fixed top-0 z-20 w-screen'>
      <NavigationMenuList className='p-2'>
        <NavigationMenuItem>
          <NavbarLink to='/'>Inicio</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/login'>Login</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/signup'>Signup</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/pomodoro'>Pomodoro</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/timer'>Timer</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavbarLink to='/badges'>Badges</NavbarLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
