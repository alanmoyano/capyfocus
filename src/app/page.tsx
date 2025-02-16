"use client"

import { useSession } from "@/lib/auth-client"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div>
      <p>Bienvenido {session ? session.user.name : "invitado"}</p>
    </div>
  )
}
