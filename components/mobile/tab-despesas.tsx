"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  X,
  Paperclip,
  CircleCheck,
  Clock,
  XCircle,
  Fuel,
  Coins,
  UtensilsCrossed,
  BedDouble,
  Disc3,
  Wrench,
  MoreHorizontal,
  Camera,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { categoriasDespesa, formatBRL, type CategoriaDespesa, type StatusAprovacao } from "@/lib/mock-data"

const catIcons: Record<CategoriaDespesa, React.ElementType> = {
  Combustível: Fuel,
  Pedágio: Coins,
  Alimentação: UtensilsCrossed,
  "Hospedagem/Pernoite": BedDouble,
  Borracharia: Disc3,
  "Manutenção de Emergência": Wrench,
  Outros: MoreHorizontal,
}

const statusMap: Record<StatusAprovacao, { label: string; cls: string; icon: React.ElementType }> = {
  pendente: { label: "Pendente", cls: "bg-warning/10 text-warning", icon: Clock },
  aprovado: { label: "Aprovado", cls: "bg-success/10 text-success", icon: CircleCheck },
  recusado: { label: "Recusado", cls: "bg-destructive/10 text-destructive", icon: XCircle },
}

export function TabDespesas({
  abrirModalInicial,
  onNotify,
}: {
  abrirModalInicial: boolean
  onNotify: (msg: string) => void
}) {
  const { despesas, addDespesa } = useStore()
  const [modal, setModal] = useState(false)
  const minhas = despesas.filter((d) => d.motorista === "Roberto Silva")

  useEffect(() => {
    if (abrirModalInicial) setModal(true)
  }, [abrirModalInicial])

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">Minhas Despesas</h1>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Nova Despesa
        </button>
      </div>

      <div className="space-y-2">
        {minhas.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">
            Nenhuma despesa lançada ainda
          </p>
        )}
        {minhas.map((d) => {
          const Icon = catIcons[d.categoria]
          const st = statusMap[d.status]
          const StIcon = st.icon
          return (
            <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{d.categoria}</p>
                  <p className="truncate text-xs text-slate-500">{d.estabelecimento}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{formatBRL(d.valor)}</p>
                  <span className={`mt-0.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${st.cls}`}>
                    <StIcon className="h-3 w-3" /> {st.label}
                  </span>
                </div>
              </div>
              {d.status === "recusado" && d.motivoRecusa && (
                <p className="mt-2 rounded-md bg-destructive/5 px-2 py-1.5 text-[11px] text-destructive">
                  Motivo: {d.motivoRecusa}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {modal && (
        <ModalNovaDespesa
          onClose={() => setModal(false)}
          onSave={(d) => {
            addDespesa(d)
            setModal(false)
            onNotify("Despesa enviada para aprovação do gerente!")
          }}
        />
      )}
    </div>
  )
}

function ModalNovaDespesa({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (d: {
    categoria: CategoriaDespesa
    valor: number
    estabelecimento: string
    dataHora: string
    observacoes: string
    comprovante: boolean
    motorista: string
    viagem: string
  }) => void
}) {
  const [categoria, setCategoria] = useState<CategoriaDespesa>("Combustível")
  const [valor, setValor] = useState("")
  const [estabelecimento, setEstabelecimento] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [comprovante, setComprovante] = useState(false)

  const valida = valor && estabelecimento

  function salvar() {
    if (!valida) return
    const now = new Date()
    onSave({
      categoria,
      valor: Number.parseFloat(valor.replace(",", ".")) || 0,
      estabelecimento,
      dataHora: now.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      observacoes,
      comprovante,
      motorista: "Roberto Silva",
      viagem: "#1042",
    })
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-slate-950/60">
      <div className="mt-auto max-h-[92%] overflow-y-auto rounded-t-3xl bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Nova Despesa</h2>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="text-xs font-medium text-muted-foreground">Categoria</label>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {categoriasDespesa.map((c) => {
            const Icon = catIcons[c]
            const on = categoria === c
            return (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-[10px] font-medium leading-tight transition ${
                  on ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {c}
              </button>
            )
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Valor (R$)</label>
            <input
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value.replace(/[^0-9.,]/g, ""))}
              placeholder="0,00"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Data/Hora</label>
            <input
              readOnly
              value="Agora"
              className="mt-1 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground outline-none"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs font-medium text-muted-foreground">Estabelecimento</label>
          <input
            value={estabelecimento}
            onChange={(e) => setEstabelecimento(e.target.value)}
            placeholder="Ex: Posto Ipiranga Km 165"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="mt-3">
          <label className="text-xs font-medium text-muted-foreground">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={2}
            placeholder="Detalhes adicionais..."
            className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={() => setComprovante(true)}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-sm transition ${
            comprovante ? "border-success bg-success/5 text-success" : "border-border text-muted-foreground"
          }`}
        >
          {comprovante ? <CircleCheck className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
          {comprovante ? "Foto da nota anexada" : "Tirar Foto da Nota/Recibo"}
        </button>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={!valida}
            className="flex-[2] flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            <Paperclip className="h-4 w-4" /> Enviar para aprovação
          </button>
        </div>
      </div>
    </div>
  )
}
