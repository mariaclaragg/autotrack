"use client"

import { Camera, ScanLine, ShieldCheck, LogIn, LogOut, Sparkles, Car } from "lucide-react"
import { useStore } from "@/lib/store"

export function TabIA({ onScan }: { onScan: () => void }) {
  const { veiculos } = useStore()

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold text-slate-800">Reconhecimento por IA</h1>
      </div>

      {/* Visor da câmera (preview) */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900">
        <Car className="h-28 w-28 text-slate-700" strokeWidth={1} />
        <div className="absolute inset-8 rounded-xl border-2 border-primary/50">
          <span className="absolute -left-0.5 -top-0.5 h-6 w-6 rounded-tl-xl border-l-4 border-t-4 border-primary" />
          <span className="absolute -right-0.5 -top-0.5 h-6 w-6 rounded-tr-xl border-r-4 border-t-4 border-primary" />
          <span className="absolute -bottom-0.5 -left-0.5 h-6 w-6 rounded-bl-xl border-b-4 border-l-4 border-primary" />
          <span className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-br-xl border-b-4 border-r-4 border-primary" />
        </div>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-slate-300">
          Posicione o veículo na moldura
        </span>
      </div>

      <button
        onClick={onScan}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition active:scale-[0.98]"
      >
        <Camera className="h-5 w-5" /> Tirar Foto do Veículo / Placa / VIN
      </button>

      {/* O que a IA identifica */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <ScanLine className="h-4 w-4 text-primary" /> Leitura automática
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {["Placa (OCR)", "Marca e modelo", "Cor predominante", "VIN / Chassi", "Riscos e avarias", "Localização GPS"].map(
            (item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> {item}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Vistoria entrada/saída */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onScan}
          className="flex flex-col items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-primary transition active:scale-95"
        >
          <LogIn className="h-6 w-6" />
          <span className="text-sm font-semibold">Vistoria de Entrada</span>
          <span className="text-[11px] text-slate-500">Ao embarcar o veículo</span>
        </button>
        <button
          onClick={onScan}
          className="flex flex-col items-center gap-2 rounded-2xl border border-success/30 bg-success/5 p-4 text-success transition active:scale-95"
        >
          <LogOut className="h-6 w-6" />
          <span className="text-sm font-semibold">Vistoria de Saída</span>
          <span className="text-[11px] text-slate-500">Na entrega ao destino</span>
        </button>
      </div>

      <p className="text-center text-xs text-slate-400">
        {veiculos.length} veículos já registrados por IA nesta viagem
      </p>
    </div>
  )
}
