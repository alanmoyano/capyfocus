"use client"

import type { Session } from "@/lib/auth"
import { signOut } from "@/lib/auth-client"

import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LogOutIcon } from "lucide-react"

export function UserInfo({ session }: { session: Session }) {
  const router = useRouter()

  return (
    <Popover>
      <PopoverTrigger className="flex cursor-pointer items-center justify-center gap-2">
        {session.user.name}
        <Avatar>
          <AvatarImage src={session.user.image as string | undefined} />
          <AvatarFallback>
            {session.user.name
              .split(" ")
              .map((palabra) => palabra.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <ul>
          <li>
            <Button
              variant="ghost"
              className="w-full"
              onClick={async () =>
                await signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/")
                    },
                  },
                })
              }
            >
              <LogOutIcon /> Cerrar Sesión
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
