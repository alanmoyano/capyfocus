"use client"

import { signIn } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GoogleIcon from "@/components/icons/google"

export default function LogIn() {
  return (
    <div className="flex place-content-center">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido de vuelta a Capyfocus!</CardTitle>
        </CardHeader>
        <CardContent className="flex place-content-center">
          <Button
            onClick={async () =>
              await signIn.social({
                provider: "google",
                callbackURL: "/",
              })
            }
          >
            Iniciar Sesión con <GoogleIcon /> Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
