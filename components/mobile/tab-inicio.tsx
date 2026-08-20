"use client"

import { Camera, ScanLine, Car, MapPin, Wallet, LifeBuoy, Bot, Navigation, Clock, PackageCheck } from "lucide-react"
import { useStore } from "@/lib/store"

export function TabInicio({
  onScan,
  onDespesa,
  onSuporte,
  onSOS,
}: {
  onScan: () => void
  onDespesa: () => void
  onSuporte: () => void
  onSOS: () => void
}) {
  const { veiculos } = useStore()
  const embarcados = veiculos.filter((v) => !v.entregue).length
  const total = veiculos.length
  const progresso = 62

  return (
    <div className="space-y-5 p-4">
      {/* Card viagem ativa */}
      <div className="rounded-2xl bg-gradient-to-br from-sidebar to-slate-800 p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold">Viagem #1042</span>
          <span className="flex items-center gap-1 text-xs text-slate-300">
            <Clock className="h-3.5 w-3.5" /> Prev. entrega: Hoje, 18:30
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-semibold">São Paulo/SP</span>
          <Navigation className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold">Rio de Janeiro/RJ</span>
        </div>

        {/* Progresso */}
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-slate-300">
            <span>Progresso da rota</span>
            <span className="font-bold text-white">{progresso}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progresso}%` }} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm">
          <PackageCheck className="h-4 w-4 text-success" />
          Carregamento: <span className="font-bold">{embarcados}</span> de {total} veículos a bordo
        </div>
      </div>

      {/* Card scanner destacado */}
      <button
        onClick={onScan}
        className="flex w-full flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-blue-700 p-6 text-primary-foreground shadow-lg transition active:scale-[0.98]"
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
          <Camera className="h-8 w-8" />
          <ScanLine className="absolute h-8 w-8 opacity-40" />
        </div>
        <span className="text-lg font-bold">Escanear Veículo com IA</span>
        <span className="text-xs text-blue-100">Câmera &amp; Vistoria inteligente</span>
      </button>

      {/* Ações rápidas */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-800">Ações rápidas</h2>
        <div className="grid grid-cols-3 gap-2">
          <QuickAction icon={Wallet} label="Lançar Despesa" color="text-primary" bg="bg-primary/10" onClick={onDespesa} />
          <QuickAction icon={LifeBuoy} label="SOS / Emergência" color="text-destructive" bg="bg-destructive/10" onClick={onSOS} />
          <QuickAction icon={Bot} label="Suporte IA" color="text-success" bg="bg-success/10" onClick={onSuporte} />
        </div>
      </div>

      {/* Mini lista embarcados */}
      <div>
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <Car className="h-4 w-4 text-primary" /> A bordo da cegonha
        </h2>
        <div className="space-y-2">
          {veiculos.slice(0, 3).map((v) => (
            <div key={v.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Car className="h-5 w-5 text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{v.modelo}</p>
                <p className="text-xs text-slate-500">{v.placa} • {v.cor}</p>
              </div>
              {v.entregue && (
                <span className="rounded-md bg-success/10 px-2 py-1 text-[11px] font-medium text-success">Entregue</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  icon: Icon,
  label,
  color,
  bg,
  onClick,
}: {
  icon: React.ElementType
  label: string
  color: string
  bg: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center transition active:scale-95"
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${bg} ${color}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-[11px] font-medium leading-tight text-slate-700">{label}</span>
    </button>
  )
}
