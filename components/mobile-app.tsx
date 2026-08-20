"use client"

import { useState } from "react"
import {
  MapPin,
  Truck,
  Signal,
  BatteryFull,
  Wifi,
  ChevronDown,
  CircleCheck,
  Home,
  Camera,
  Wallet,
  MessageCircle,
  LogOut,
  X,
  LifeBuoy,
  Phone,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { ScannerModal } from "@/components/mobile/scanner-modal"
import { TabInicio } from "@/components/mobile/tab-inicio"
import { TabIA } from "@/components/mobile/tab-ia"
import { TabDespesas } from "@/components/mobile/tab-despesas"
import { TabChat } from "@/components/mobile/tab-chat"

type TabId = "inicio" | "ia" | "despesas" | "chat"

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "ia", label: "Scanner IA", icon: Camera },
  { id: "despesas", label: "Despesas", icon: Wallet },
  { id: "chat", label: "Chat IA", icon: MessageCircle },
]

export function MobileApp() {
  const { usuario, logout, addVeiculo, pendentesCount } = useStore()
  const [tab, setTab] = useState<TabId>("inicio")
  const [scanner, setScanner] = useState(false)
  const [sos, setSos] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [abrirDespesaModal, setAbrirDespesaModal] = useState(false)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  function confirmarVeiculo(v: Parameters<typeof addVeiculo>[0]) {
    addVeiculo(v)
    setScanner(false)
    notify(`${v.modelo} (${v.placa}) adicionado ao embarque!`)
  }

  function irParaDespesas() {
    setTab("despesas")
    setAbrirDespesaModal(true)
    setTimeout(() => setAbrirDespesaModal(false), 300)
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-200 p-0 sm:p-8">
      {/* Container do smartphone */}
      <div className="relative flex h-screen w-full max-w-[420px] flex-col overflow-hidden bg-slate-50 shadow-2xl sm:h-[860px] sm:rounded-[2.5rem] sm:border-[10px] sm:border-slate-900">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-20 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900 sm:block" />

        {/* status bar */}
        <div className="flex items-center justify-between bg-sidebar px-6 py-2 text-[11px] text-white">
          <span className="font-medium">09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Cabeçalho motorista */}
        <div className="bg-sidebar px-5 pb-4 pt-1 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold">
              {usuario?.iniciais}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{usuario?.nome}</p>
              <p className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-success" /> Online
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium transition hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
          <button className="mt-3 flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-2.5 text-sm">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Viagem #1042 — SP × RJ
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Conteúdo da aba */}
        <div className="relative flex-1 overflow-y-auto">
          {tab === "inicio" && (
            <TabInicio
              onScan={() => setScanner(true)}
              onDespesa={irParaDespesas}
              onSuporte={() => setTab("chat")}
              onSOS={() => setSos(true)}
            />
          )}
          {tab === "ia" && <TabIA onScan={() => setScanner(true)} />}
          {tab === "despesas" && <TabDespesas abrirModalInicial={abrirDespesaModal} onNotify={notify} />}
          {tab === "chat" && <TabChat />}
        </div>

        {/* Bottom nav */}
        <nav className="flex shrink-0 items-center justify-around border-t border-slate-200 bg-white pb-2 pt-1.5">
          {tabs.map((t) => {
            const Icon = t.icon
            const on = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium transition ${
                  on ? "text-primary" : "text-slate-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                {t.label}
                {t.id === "despesas" && pendentesCount > 0 && (
                  <span className="absolute right-4 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
                    {pendentesCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* toast */}
        {toast && (
          <div className="pointer-events-none absolute inset-x-4 bottom-20 z-40 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
            <CircleCheck className="h-4 w-4 shrink-0 text-success" />
            {toast}
          </div>
        )}

        {/* Scanner */}
        {scanner && <ScannerModal onClose={() => setScanner(false)} onConfirm={confirmarVeiculo} />}

        {/* SOS */}
        {sos && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/70 p-6">
            <div className="w-full rounded-2xl bg-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <LifeBuoy className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">Emergência / SOS</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Acione o suporte 24h. Sua localização (Km 165 - Via Dutra) será enviada à central.
              </p>
              <div className="mt-5 space-y-2">
                <button
                  onClick={() => {
                    setSos(false)
                    notify("Central acionada! Suporte a caminho.")
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive py-3 font-semibold text-white"
                >
                  <Phone className="h-4.5 w-4.5" /> Acionar Assistência 24h
                </button>
                <button
                  onClick={() => setSos(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground"
                >
                  <X className="h-4 w-4" /> Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
