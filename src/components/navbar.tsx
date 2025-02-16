"use client"

import { useSession } from "@/lib/auth-client"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { UserInfo } from "@/components/user-info"

import Image from "next/image"
import Link from "next/link"

export function Navbar() {
  const { data: session, isPending } = useSession()

  return (
    <header className="sticky">
      <nav className="flex h-14 items-center justify-between p-4">
        <div className="flex h-8 items-center gap-4">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo de Capyfocus"
              width={24}
              height={24}
            />
            Capyfocus
          </Link>
          <Separator orientation="vertical" />
          <ul className="flex items-center justify-center gap-2">
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>
        <div>
          {isPending ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="size-8 rounded-full" />
            </div>
          ) : session ? (
            <UserInfo session={session} />
          ) : (
            <Link href="/auth/login">Iniciar Sesión</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
