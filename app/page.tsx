"use client"

import { useState } from "react"
import { Monitor, Smartphone, Truck } from "lucide-react"
import { DeskPanel } from "@/components/desk-panel"
import { MobileApp } from "@/components/mobile-app"

type Perfil = "desk" | "mobile"

export default function Page() {
  const [perfil, setPerfil] = useState<Perfil>("desk")

  return (
    <div className="min-h-screen bg-background">
      {/* Seletor de perfil global */}
      <div className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">AutoTRACK</p>
              <p className="text-[10px] text-slate-400">Gestão de Frota &amp; ERP Financeiro</p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setPerfil("desk")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                perfil === "desk"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Painel Gerencial</span>
              <span className="sm:hidden">Desk</span>
            </button>
            <button
              onClick={() => setPerfil("mobile")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                perfil === "mobile"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">App do Motorista</span>
              <span className="sm:hidden">App</span>
            </button>
          </div>
        </div>
      </div>

      {perfil === "desk" ? <DeskPanel /> : <MobileApp />}
    </div>
  )
}
