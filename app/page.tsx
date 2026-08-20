"use client"

import { StoreProvider, useStore } from "@/lib/store"
import { LoginScreen } from "@/components/login-screen"
import { DeskPanel } from "@/components/desk-panel"
import { MobileApp } from "@/components/mobile-app"

function AppGate() {
  const { usuario } = useStore()

  if (!usuario) return <LoginScreen />
  if (usuario.role === "gerente") return <DeskPanel />
  return <MobileApp />
}

export default function Page() {
  return (
    <StoreProvider>
      <AppGate />
    </StoreProvider>
  )
}
