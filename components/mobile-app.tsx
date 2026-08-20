"use client"

import { useState } from "react"
import {
  Camera,
  ScanLine,
  Check,
  MapPin,
  Car,
  Truck,
  Wallet,
  Fuel,
  Coins,
  UtensilsCrossed,
  Paperclip,
  Signal,
  BatteryFull,
  Wifi,
  ChevronDown,
  CircleCheck,
  Loader2,
  X,
} from "lucide-react"
import { veiculosEmbarcados as seed, formatBRL, type VeiculoEmbarcado } from "@/lib/mock-data"

type ScanState = "idle" | "scanning" | "done"

function ScannerModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (v: VeiculoEmbarcado) => void }) {
  const [state, setState] = useState<ScanState>("idle")

  const dadosDetectados: VeiculoEmbarcado = {
    id: Date.now().toString(),
    placa: "BRA-2E19",
    modelo: "Chevrolet Onix",
    cor: "Prata",
    gps: "Vitória/ES",
    entregue: false,
  }

  function iniciar() {
    setState("scanning")
    setTimeout(() => setState("done"), 2400)
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-slate-950">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-medium">Scanner de Veículo IA</span>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Visor da câmera */}
      <div className="relative mx-4 flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900">
        {/* carro simulado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="h-40 w-40 text-slate-700" strokeWidth={1} />
        </div>

        {/* moldura de foco */}
        <div className="absolute inset-8 rounded-xl border-2 border-primary/60">
          <span className="absolute -left-0.5 -top-0.5 h-6 w-6 rounded-tl-xl border-l-4 border-t-4 border-primary" />
          <span className="absolute -right-0.5 -top-0.5 h-6 w-6 rounded-tr-xl border-r-4 border-t-4 border-primary" />
          <span className="absolute -bottom-0.5 -left-0.5 h-6 w-6 rounded-bl-xl border-b-4 border-l-4 border-primary" />
          <span className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-br-xl border-b-4 border-r-4 border-primary" />
        </div>

        {/* linha de escaneamento animada */}
        {state === "scanning" && (
          <div className="absolute inset-x-8 top-8 bottom-8 overflow-hidden">
            <div className="animate-scan h-0.5 w-full bg-primary shadow-[0_0_12px_2px_rgba(37,99,235,0.8)]" />
          </div>
        )}

        {state === "scanning" && (
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" /> Analisando imagem com IA...
          </div>
        )}

        {state === "done" && (
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2 text-sm font-medium text-success">
            <CircleCheck className="h-4 w-4" /> Veículo identificado!
          </div>
        )}
      </div>

      {/* Painel inferior */}
      <div className="p-4">
        {state === "idle" && (
          <button
            onClick={iniciar}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground"
          >
            <ScanLine className="h-5 w-5" /> Iniciar Escaneamento
          </button>
        )}

        {state === "scanning" && (
          <div className="rounded-xl bg-white/5 py-3.5 text-center text-sm text-slate-300">
            Reconhecendo placa e modelo...
          </div>
        )}

        {state === "done" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Placa", v: dadosDetectados.placa },
                { l: "Marca/Modelo", v: dadosDetectados.modelo },
                { l: "Cor", v: dadosDetectados.cor },
                { l: "GPS", v: dadosDetectados.gps },
              ].map((f) => (
                <div key={f.l} className="rounded-lg bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">{f.l}</p>
                  <p className="mt-0.5 font-semibold text-white">{f.v}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => onConfirm(dadosDetectados)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-success py-3.5 font-semibold text-white"
            >
              <Check className="h-5 w-5" /> Confirmar e Cadastrar Veículo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

type TipoDespesa = "Combustível" | "Pedágio" | "Alimentação"

export function MobileApp() {
  const [scanner, setScanner] = useState(false)
  const [veiculos, setVeiculos] = useState<VeiculoEmbarcado[]>(seed)
  const [tipoDespesa, setTipoDespesa] = useState<TipoDespesa>("Combustível")
  const [valorDespesa, setValorDespesa] = useState("")
  const [comprovante, setComprovante] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const embarcados = veiculos.filter((v) => !v.entregue).length
  const total = veiculos.length

  function confirmar(v: VeiculoEmbarcado) {
    setVeiculos((prev) => [...prev, v])
    setScanner(false)
    mostrarToast(`${v.modelo} (${v.placa}) adicionado ao embarque!`)
  }

  function darBaixa(id: string) {
    setVeiculos((prev) => prev.map((v) => (v.id === id ? { ...v, entregue: true } : v)))
    mostrarToast("Entrega registrada com sucesso!")
  }

  function lancarDespesa() {
    if (!valorDespesa) return
    mostrarToast(`Despesa de ${tipoDespesa} lançada: R$ ${valorDespesa}`)
    setValorDespesa("")
    setComprovante(false)
  }

  function mostrarToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  const despesaIcons = {
    Combustível: Fuel,
    Pedágio: Coins,
    Alimentação: UtensilsCrossed,
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-start justify-center bg-slate-100 p-4 sm:p-8">
      {/* Container do smartphone */}
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-50 shadow-2xl">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900" />

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
        <div className="bg-sidebar px-5 pb-5 pt-2 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold">
              RS
            </div>
            <div className="flex-1">
              <p className="font-semibold">Roberto Silva</p>
              <p className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-success" /> Online
              </p>
            </div>
            <Truck className="h-6 w-6 text-slate-400" />
          </div>
          <button className="mt-4 flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Viagem #1042 — SP × RJ
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="relative max-h-[560px] space-y-5 overflow-y-auto px-4 py-5">
          {/* Botão scanner IA */}
          <button
            onClick={() => setScanner(true)}
            className="flex w-full flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-blue-700 p-6 text-primary-foreground shadow-lg transition active:scale-[0.98]"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <Camera className="h-8 w-8" />
              <ScanLine className="absolute h-8 w-8 opacity-40" />
            </div>
            <span className="text-lg font-bold">Escanear Veículo com IA</span>
            <span className="text-xs text-blue-100">Aponte a câmera e preencha os dados automaticamente</span>
          </button>

          {/* Lista de embarcados */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <Car className="h-4 w-4 text-primary" /> Veículos embarcados
              </h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {embarcados}/{total} carros
              </span>
            </div>
            <div className="space-y-2">
              {veiculos.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Car className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{v.modelo}</p>
                    <p className="text-xs text-slate-500">
                      {v.placa} • {v.cor} • {v.gps}
                    </p>
                  </div>
                  {v.entregue ? (
                    <span className="flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs font-medium text-success">
                      <Check className="h-3.5 w-3.5" /> Entregue
                    </span>
                  ) : (
                    <button
                      onClick={() => darBaixa(v.id)}
                      className="shrink-0 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground"
                    >
                      Dar Baixa
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lançar despesa */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <Wallet className="h-4 w-4 text-primary" /> Lançar Despesa da Viagem
            </h2>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["Combustível", "Pedágio", "Alimentação"] as TipoDespesa[]).map((t) => {
                const Icon = despesaIcons[t]
                const on = tipoDespesa === t
                return (
                  <button
                    key={t}
                    onClick={() => setTipoDespesa(t)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-[11px] font-medium transition ${
                      on
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {t}
                  </button>
                )
              })}
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-500">Valor (R$)</label>
              <input
                inputMode="decimal"
                value={valorDespesa}
                onChange={(e) => setValorDespesa(e.target.value.replace(/[^0-9.,]/g, ""))}
                placeholder="0,00"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={() => setComprovante(true)}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-sm transition ${
                comprovante
                  ? "border-success bg-success/5 text-success"
                  : "border-slate-300 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {comprovante ? <CircleCheck className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
              {comprovante ? "Comprovante anexado" : "Enviar foto do comprovante fiscal"}
            </button>

            <button
              onClick={lancarDespesa}
              disabled={!valorDespesa}
              className="mt-3 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition disabled:opacity-40"
            >
              Salvar Despesa
            </button>
          </div>
        </div>

        {/* toast */}
        {toast && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-40 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
            <CircleCheck className="h-4 w-4 shrink-0 text-success" />
            {toast}
          </div>
        )}

        {scanner && <ScannerModal onClose={() => setScanner(false)} onConfirm={confirmar} />}
      </div>
    </div>
  )
}
