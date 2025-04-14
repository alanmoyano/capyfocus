"use client"

import { useSession } from "@/lib/auth-client"
import Image from "next/image"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div>
      <p>Bienvenido {session ? session.user.name : "invitado"}</p>
      <Image
        src="https://88zflda82j.ufs.sh/f/dz6jW9yscKwL1COaPhHc4GQPuROEC5ZhHX0NYMBFiTortvkD"
        alt="Chicho en un auto"
        width={480}
        height={480}
        unoptimized
      />
      <p>texto que no se va a mover, gracias next/image</p>
    </div>
  )
}
