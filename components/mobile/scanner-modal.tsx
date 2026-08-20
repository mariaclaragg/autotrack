"use client"

import { useState } from "react"
import {
  ScanLine,
  Check,
  Car,
  CircleCheck,
  Loader2,
  X,
  AlertTriangle,
  Camera,
} from "lucide-react"
import { type VeiculoEmbarcado } from "@/lib/mock-data"

type ScanState = "idle" | "scanning" | "done"

const itensVistoria = [
  "Lataria sem amassados",
  "Vidros e retrovisores intactos",
  "Pneus calibrados",
  "Faróis e lanternas OK",
  "Interior limpo e sem avarias",
]

export function ScannerModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void
  onConfirm: (v: VeiculoEmbarcado) => void
}) {
  const [state, setState] = useState<ScanState>("idle")
  const [checklist, setChecklist] = useState<boolean[]>(itensVistoria.map(() => true))

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

  function toggleItem(i: number) {
    setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-slate-950">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Camera className="h-4 w-4 text-primary" /> Scanner de Veículo IA
        </span>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Visor da câmera */}
      <div className="relative mx-4 h-56 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="h-32 w-32 text-slate-700" strokeWidth={1} />
        </div>
        <div className="absolute inset-8 rounded-xl border-2 border-primary/60">
          <span className="absolute -left-0.5 -top-0.5 h-6 w-6 rounded-tl-xl border-l-4 border-t-4 border-primary" />
          <span className="absolute -right-0.5 -top-0.5 h-6 w-6 rounded-tr-xl border-r-4 border-t-4 border-primary" />
          <span className="absolute -bottom-0.5 -left-0.5 h-6 w-6 rounded-bl-xl border-b-4 border-l-4 border-primary" />
          <span className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-br-xl border-b-4 border-r-4 border-primary" />
        </div>
        {state === "scanning" && (
          <>
            <div className="absolute inset-x-8 top-8 bottom-8 overflow-hidden">
              <div className="animate-scan h-0.5 w-full bg-primary shadow-[0_0_12px_2px_rgba(37,99,235,0.8)]" />
            </div>
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" /> Analisando imagem com IA...
            </div>
          </>
        )}
        {state === "done" && (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 text-sm font-medium text-success">
            <CircleCheck className="h-4 w-4" /> Veículo identificado!
          </div>
        )}
      </div>

      {/* Painel inferior */}
      <div className="flex-1 overflow-y-auto p-4">
        {state === "idle" && (
          <button
            onClick={iniciar}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground"
          >
            <ScanLine className="h-5 w-5" /> Tirar Foto do Veículo / Placa / VIN
          </button>
        )}

        {state === "scanning" && (
          <div className="space-y-2">
            {["Detectando placa...", "Reconhecendo modelo e cor...", "Analisando riscos e avarias..."].map((t, i) => (
              <div
                key={t}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-slate-300"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> {t}
              </div>
            ))}
          </div>
        )}

        {state === "done" && (
          <div className="space-y-4">
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

            <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              IA detectou 1 risco leve no para-choque traseiro. Registrado na vistoria de entrada.
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Checklist de vistoria
              </p>
              <div className="space-y-1.5">
                {itensVistoria.map((item, i) => (
                  <button
                    key={item}
                    onClick={() => toggleItem(i)}
                    className="flex w-full items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5 text-left text-sm text-slate-200"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        checklist[i] ? "border-success bg-success text-white" : "border-slate-500"
                      }`}
                    >
                      {checklist[i] && <Check className="h-3.5 w-3.5" />}
                    </span>
                    {item}
                  </button>
                ))}
              </div>
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
