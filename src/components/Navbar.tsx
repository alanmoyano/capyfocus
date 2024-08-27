import React from "react";
import { Link, useLocation } from "wouter";

type NavbarLinkProps = {
  to: string;
  location: string;
  children?: React.ReactNode;
};

function NavbarLink({ to, location, children }: NavbarLinkProps) {
  const current = location === to ? "bg-primary/10 font-bold" : "";

  return (
    <Link to={to} className={"rounded p-2 hover:bg-primary/50 " + current}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const location = useLocation()[0];

  return (
    <nav className="fixed start-0 top-0 z-20 w-full border-b bg-accent">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center p-2">
        <NavbarLink to="/" location={location}>
          Inicio
        </NavbarLink>
        <NavbarLink to="/login" location={location}>
          Login
        </NavbarLink>
        <NavbarLink to="/signup" location={location}>
          Signup
        </NavbarLink>
        <NavbarLink to="/pomodoro" location={location}>
          Pomodoro
        </NavbarLink>
        <NavbarLink to="/timer" location={location}>
          Timer
        </NavbarLink>
        <NavbarLink to="/badges" location={location}>
          Badges
        </NavbarLink>
      </div>
    </nav>
  );
}
