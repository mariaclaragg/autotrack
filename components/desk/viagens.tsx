"use client"

import { useState } from "react"
import { MapPin, Truck, Check, Clock, FileCheck2, FileX2, FileClock, Package } from "lucide-react"
import { viagens as viagensSeed, notasFiscais as notasSeed, type StatusViagem, formatBRL } from "@/lib/mock-data"

const etapas: StatusViagem[] = ["Planejada", "Em Carregamento", "Em Trânsito", "Entregue"]

function Timeline({ status }: { status: StatusViagem }) {
  const idxAtual = etapas.indexOf(status)
  return (
    <div className="flex items-center">
      {etapas.map((etapa, i) => {
        const done = i <= idxAtual
        return (
          <div key={etapa} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`mt-1.5 w-20 text-center text-[10px] leading-tight ${
                  done ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {etapa}
              </span>
            </div>
            {i < etapas.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 rounded ${i < idxAtual ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

const notaStatus = {
  pendente: { label: "Pendente", cls: "bg-warning/10 text-warning", icon: FileClock },
  aprovado: { label: "Aprovado", cls: "bg-success/10 text-success", icon: FileCheck2 },
  recusado: { label: "Recusado", cls: "bg-destructive/10 text-destructive", icon: FileX2 },
}

export function DeskViagens() {
  const [notas, setNotas] = useState(notasSeed)

  function atualizar(id: string, status: "aprovado" | "recusado") {
    setNotas((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Truck className="h-6 w-6 text-primary" /> Viagens &amp; Frota (Cegonhas)
        </h1>
        <p className="text-sm text-muted-foreground">Acompanhamento em tempo real e conferência documental</p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {viagensSeed.map((v) => (
          <div key={v.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  Viagem {v.codigo}
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    {v.veiculo}
                  </span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {v.origem} → {v.destino}
                </p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {v.previsao}
                </p>
                <p className="mt-1 flex items-center justify-end gap-1 text-sm font-medium text-foreground">
                  <Package className="h-3.5 w-3.5 text-primary" /> {v.cargaAtual}/{v.cargaTotal} carros
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Timeline status={v.status} />
            </div>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Motorista: {v.motorista}</span>
                <span>{v.progresso}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${v.progresso}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conferência de notas */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Conferência de Notas Fiscais &amp; Comprovantes</h2>
          <p className="text-xs text-muted-foreground">Documentos enviados pelos motoristas aguardando aprovação</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Documento</th>
                <th className="px-4 py-2.5 font-medium">Tipo</th>
                <th className="px-4 py-2.5 font-medium">Motorista</th>
                <th className="px-4 py-2.5 text-right font-medium">Valor</th>
                <th className="px-4 py-2.5 font-medium">Data</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {notas.map((n) => {
                const st = notaStatus[n.status]
                const Icon = st.icon
                return (
                  <tr key={n.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{n.numero}</td>
                    <td className="px-4 py-3 text-foreground">{n.tipo}</td>
                    <td className="px-4 py-3 text-muted-foreground">{n.motorista}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{formatBRL(n.valor)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{n.data}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${st.cls}`}>
                        <Icon className="h-3.5 w-3.5" /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {n.status === "pendente" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => atualizar(n.id, "aprovado")}
                            className="rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success transition hover:bg-success/20"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => atualizar(n.id, "recusado")}
                            className="rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/20"
                          >
                            Recusar
                          </button>
                        </div>
                      ) : (
                        <p className="text-right text-xs text-muted-foreground">Conferido</p>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
