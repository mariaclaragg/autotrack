"use client"

import { useState } from "react"
import {
  MapPin,
  Truck,
  Check,
  Clock,
  FileCheck2,
  FileX2,
  FileClock,
  Package,
  Eye,
  Receipt,
  X,
} from "lucide-react"
import { viagens as viagensSeed, type StatusViagem, type DespesaViagem, formatBRL } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { Modal, Toast } from "@/components/desk/ui"
import { FichaMotoristaModal } from "@/components/desk/modais"

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
                  done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`mt-1.5 w-20 text-center text-[10px] leading-tight ${done ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {etapa}
              </span>
            </div>
            {i < etapas.length - 1 && <div className={`mx-1 h-0.5 flex-1 rounded ${i < idxAtual ? "bg-primary" : "bg-border"}`} />}
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
  const { despesas, setStatusDespesa } = useStore()
  const [comprovante, setComprovante] = useState<DespesaViagem | null>(null)
  const [recusando, setRecusando] = useState(false)
  const [motivo, setMotivo] = useState("")
  const [toast, setToast] = useState<string | null>(null)
  const [fichaMotorista, setFichaMotorista] = useState<string | null>(null)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  function aprovar(d: DespesaViagem) {
    setStatusDespesa(d.id, "aprovado")
    setComprovante(null)
    notify(`Reembolso de ${formatBRL(d.valor)} aprovado!`)
  }

  function recusar(d: DespesaViagem) {
    if (!motivo.trim()) return
    setStatusDespesa(d.id, "recusado", motivo)
    setComprovante(null)
    setRecusando(false)
    setMotivo("")
    notify("Comprovante recusado com motivo registrado.")
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
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{v.veiculo}</span>
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
                <span>
                  Motorista:{" "}
                  <button
                    onClick={() => setFichaMotorista(v.motorista)}
                    className="font-medium text-primary underline-offset-2 transition hover:underline"
                  >
                    {v.motorista}
                  </button>
                </span>
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
          <p className="text-xs text-muted-foreground">Documentos enviados pelos motoristas em tempo real</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Categoria</th>
                <th className="px-4 py-2.5 font-medium">Estabelecimento</th>
                <th className="px-4 py-2.5 font-medium">Motorista</th>
                <th className="px-4 py-2.5 text-right font-medium">Valor</th>
                <th className="px-4 py-2.5 font-medium">Data</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {despesas.map((n) => {
                const st = notaStatus[n.status]
                const Icon = st.icon
                return (
                  <tr key={n.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">{n.categoria}</td>
                    <td className="px-4 py-3 text-muted-foreground">{n.estabelecimento}</td>
                    <td className="px-4 py-3 text-muted-foreground">{n.motorista}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{formatBRL(n.valor)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{n.dataHora}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${st.cls}`}>
                        <Icon className="h-3.5 w-3.5" /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setComprovante(n)
                            setRecusando(false)
                            setMotivo("")
                          }}
                          className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
                        >
                          <Eye className="h-3.5 w-3.5" /> Ver Comprovante
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal comprovante */}
      {comprovante && (
        <Modal titulo="Comprovante de Despesa" descricao={`${comprovante.categoria} · ${comprovante.motorista}`} onClose={() => setComprovante(null)}>
          {/* imagem simulada do recibo */}
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/40 p-6">
            <div className="w-full max-w-[240px] rounded-lg bg-white p-4 font-mono text-[11px] leading-relaxed text-slate-700 shadow-sm">
              <p className="text-center font-bold">{comprovante.estabelecimento}</p>
              <p className="my-2 border-y border-dashed border-slate-300 py-2 text-center">CUPOM FISCAL</p>
              <div className="flex justify-between"><span>{comprovante.categoria}</span><span>{formatBRL(comprovante.valor)}</span></div>
              <div className="flex justify-between text-slate-400"><span>Data</span><span>{comprovante.dataHora}</span></div>
              <p className="mt-2 border-t border-dashed border-slate-300 pt-2 text-center font-bold">TOTAL {formatBRL(comprovante.valor)}</p>
              <p className="mt-2 text-center text-[9px] text-slate-400">Viagem {comprovante.viagem}</p>
            </div>
            <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <Receipt className="h-3.5 w-3.5" /> Foto enviada pelo motorista
            </span>
          </div>

          {comprovante.observacoes && (
            <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Obs.: {comprovante.observacoes}
            </p>
          )}

          {comprovante.status !== "pendente" ? (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${notaStatus[comprovante.status].cls}`}>
              {comprovante.status === "aprovado" ? "Reembolso já aprovado." : `Recusado. Motivo: ${comprovante.motivoRecusa}`}
            </div>
          ) : recusando ? (
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">Motivo da recusa</label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={2}
                autoFocus
                placeholder="Ex: valor acima do limite / falta autorização prévia"
                className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-destructive"
              />
              <div className="mt-3 flex gap-2">
                <button onClick={() => setRecusando(false)} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground">
                  Voltar
                </button>
                <button
                  onClick={() => recusar(comprovante)}
                  disabled={!motivo.trim()}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-destructive py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  <X className="h-4 w-4" /> Confirmar recusa
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setRecusando(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 py-2.5 text-sm font-semibold text-destructive"
              >
                <FileX2 className="h-4 w-4" /> Recusar com Motivo
              </button>
              <button
                onClick={() => aprovar(comprovante)}
                className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-success py-2.5 text-sm font-semibold text-white"
              >
                <FileCheck2 className="h-4 w-4" /> Aprovar Reembolso
              </button>
            </div>
          )}
        </Modal>
      )}

      {fichaMotorista && <FichaMotoristaModal nome={fichaMotorista} onClose={() => setFichaMotorista(null)} />}
      {toast && <Toast msg={toast} />}
    </div>
  )
}
