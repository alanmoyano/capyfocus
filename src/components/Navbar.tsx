import React, { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'
import { ModeToggle } from './ModeToggle'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport
} from '@/components/ui/navigation-menu'

type NavbarLinkProps = {
  to: string
  children?: React.ReactNode
}

function NavbarLink({ to, children }: NavbarLinkProps) {
  const isActive = useRoute(to)[0]

  return (
    <Link to={to}>
      <NavigationMenuLink
        active={isActive}
        className={navigationMenuTriggerStyle()}
      >
        {children}
      </NavigationMenuLink>
    </Link>
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
    <NavigationMenu className='fixed start-0 top-0 z-20 w-full border-b'>
      <NavigationMenuList className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-center p-2'>
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
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>Link</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <ModeToggle />
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
