"use client"

import { useState } from "react"
import {
  Truck,
  MapPin,
  Navigation,
  TrendingUp,
  TrendingDown,
  FileText,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  IdCard,
  Calendar,
  Car,
  Image as ImageIcon,
  FileCheck2,
  Star,
  Award,
} from "lucide-react"
import { Modal } from "@/components/desk/ui"
import { viagens, formatBRL } from "@/lib/mock-data"

/* ---------- Mapa de viagens em rota ---------- */
export function MapaModal({ onClose }: { onClose: () => void }) {
  const emRota = viagens.filter((v) => v.status === "Em Trânsito" || v.status === "Em Carregamento")
  return (
    <Modal titulo="Viagens em Rota — Rastreamento" descricao="Posição em tempo real da frota" onClose={onClose} size="lg">
      {/* mapa simulado */}
      <div className="relative h-72 overflow-hidden rounded-xl border border-border bg-[#0f172a]">
        {/* grid de rodovias */}
        <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* rotas */}
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M 60 220 Q 200 120 360 90" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 6" />
          <path d="M 80 60 Q 220 160 420 200" fill="none" stroke="#16a34a" strokeWidth="3" strokeDasharray="6 6" />
        </svg>
        {/* caminhões */}
        <div className="absolute left-[44%] top-[38%] flex flex-col items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/30">
            <Truck className="h-4.5 w-4.5" />
          </div>
          <span className="mt-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">#1042 · 62%</span>
        </div>
        <div className="absolute left-[26%] top-[62%] flex flex-col items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-white shadow-lg ring-4 ring-success/30">
            <Truck className="h-4.5 w-4.5" />
          </div>
          <span className="mt-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">#1043 · 15%</span>
        </div>
        <span className="absolute left-4 top-4 rounded-md bg-black/50 px-2 py-1 text-xs text-slate-200">
          Sudeste — BR-116 / Via Dutra
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {emRota.map((v) => (
          <div key={v.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Navigation className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {v.codigo} — {v.veiculo}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {v.origem} → {v.destino} · {v.motorista}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{v.progresso}%</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

/* ---------- DRE detalhado ---------- */
export function DREModal({ tipo, onClose }: { tipo: "saldo" | "receber" | "pagar"; onClose: () => void }) {
  const titulo =
    tipo === "saldo" ? "DRE — Saldo Consolidado" : tipo === "receber" ? "Detalhe — Contas a Receber" : "Detalhe — Contas a Pagar"

  const linhas =
    tipo === "pagar"
      ? [
          { l: "Combustível", v: -18900, up: false },
          { l: "Manutenção da frota", v: -14500, up: false },
          { l: "Pedágios", v: -3450.9, up: false },
          { l: "Seguros", v: -6200, up: false },
        ]
      : [
          { l: "Fretes SP–RJ", v: 96700, up: true },
          { l: "Fretes MG–BA", v: 27890, up: true },
          { l: "Guinchos avulsos", v: 14170, up: true },
          { l: "Locação de cegonha", v: 12300, up: true },
        ]

  const total = linhas.reduce((s, x) => s + x.v, 0)

  return (
    <Modal titulo={titulo} descricao="Composição do período (agosto/2026)" onClose={onClose}>
      <div className="space-y-2">
        {linhas.map((x) => (
          <div key={x.l} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
            <span className="flex items-center gap-2 text-sm text-foreground">
              {x.up ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              {x.l}
            </span>
            <span className={`text-sm font-semibold ${x.up ? "text-success" : "text-destructive"}`}>
              {formatBRL(x.v)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-sidebar px-4 py-3 text-white">
        <span className="text-sm font-medium">Resultado do período</span>
        <span className="text-lg font-bold">{formatBRL(total)}</span>
      </div>
    </Modal>
  )
}

/* ---------- Leitura de documentos por IA ---------- */
type IAState = "idle" | "lendo" | "done"
export function IADocumentosModal({ onClose, onAplicar }: { onClose: () => void; onAplicar: () => void }) {
  const [state, setState] = useState<IAState>("idle")

  function processar() {
    setState("lendo")
    setTimeout(() => setState("done"), 2600)
  }

  const extraido = [
    { campo: "Tipo de documento", valor: "CT-e (Conhecimento de Transporte)" },
    { campo: "Número", valor: "CTe 000.114.582" },
    { campo: "Remetente", valor: "Localiza Rent a Car S.A." },
    { campo: "Valor do frete", valor: "R$ 18.450,00" },
    { campo: "Origem → Destino", valor: "São Paulo/SP → Rio de Janeiro/RJ" },
    { campo: "Veículos transportados", valor: "8 unidades" },
  ]

  return (
    <Modal titulo="Análise de Documentos por IA" descricao="Upload de CT-e, NF-e e comprovantes" onClose={onClose} size="lg">
      {state === "idle" && (
        <button
          onClick={processar}
          className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-12 transition hover:border-primary hover:bg-primary/5"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="h-7 w-7" />
          </div>
          <p className="font-medium text-foreground">Enviar PDF ou foto do documento</p>
          <p className="text-xs text-muted-foreground">A IA extrai os dados e preenche as tabelas automaticamente</p>
        </button>
      )}

      {state === "lendo" && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="relative flex h-20 w-16 items-center justify-center rounded-lg border-2 border-primary/40 bg-primary/5">
            <FileText className="h-8 w-8 text-primary" />
            <div className="animate-scan absolute inset-x-0 top-0 h-0.5 bg-primary shadow-[0_0_10px_2px_rgba(37,99,235,0.7)]" />
          </div>
          <p className="flex items-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" /> Lendo documento com IA...
          </p>
        </div>
      )}

      {state === "done" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm font-medium text-success">
            <CheckCircle2 className="h-4 w-4" /> Documento processado com sucesso!
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            {extraido.map((e, i) => (
              <div
                key={e.campo}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${i % 2 ? "bg-muted/40" : "bg-background"}`}
              >
                <span className="text-muted-foreground">{e.campo}</span>
                <span className="font-medium text-foreground">{e.valor}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onAplicar}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground"
          >
            <Sparkles className="h-4 w-4" /> Aplicar dados nas tabelas
          </button>
        </div>
      )}
    </Modal>
  )
}

/* ---------- Novo cadastro (cliente/fornecedor) ---------- */
export function NovoCadastroModal({
  tipo,
  onClose,
  onSalvar,
}: {
  tipo: "cliente" | "fornecedor"
  onClose: () => void
  onSalvar: () => void
}) {
  const [nome, setNome] = useState("")
  const [doc, setDoc] = useState("")

  return (
    <Modal
      titulo={tipo === "cliente" ? "Novo Cliente" : "Novo Fornecedor"}
      descricao="Preencha os dados do cadastro"
      onClose={onClose}
    >
      <div className="space-y-3">
        <Campo label="Nome / Razão Social" value={nome} onChange={setNome} placeholder="Ex: Transportes Brasil Ltda" />
        <div className="grid grid-cols-2 gap-3">
          <Campo label="CNPJ / CPF" value={doc} onChange={setDoc} placeholder="00.000.000/0001-00" />
          <Campo label="Telefone" placeholder="(11) 0000-0000" />
        </div>
        {tipo === "cliente" ? (
          <div className="grid grid-cols-2 gap-3">
            <Campo label="CEP" placeholder="00000-000" />
            <Campo label="Município / UF" placeholder="São Paulo / SP" />
          </div>
        ) : (
          <Campo label="Categoria" placeholder="Combustível, Manutenção..." />
        )}
      </div>
      <div className="mt-5 flex gap-2">
        <button onClick={onClose} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground">
          Cancelar
        </button>
        <button
          onClick={onSalvar}
          disabled={!nome || !doc}
          className="flex-[2] rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          Salvar cadastro
        </button>
      </div>
    </Modal>
  )
}

/* ---------- Exportar relatório ---------- */
export function ExportarModal({ onClose, onExport }: { onClose: () => void; onExport: (fmt: string) => void }) {
  return (
    <Modal titulo="Exportar Relatório" descricao="Escolha o formato de exportação" onClose={onClose} size="sm">
      <div className="space-y-2">
        {[
          { fmt: "PDF", desc: "Documento formatado para impressão" },
          { fmt: "Excel", desc: "Planilha editável (.xlsx)" },
          { fmt: "CSV", desc: "Dados brutos separados por vírgula" },
        ].map((o) => (
          <button
            key={o.fmt}
            onClick={() => onExport(o.fmt)}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-3 text-left transition hover:border-primary hover:bg-primary/5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{o.fmt}</p>
              <p className="text-xs text-muted-foreground">{o.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  )
}

/* ---------- Ficha do Motorista & Galeria de Vistorias ---------- */
type FotoVistoria = { id: string; legenda: string; tipo: "entrada" | "saida" | "avaria" }
type DocAnexo = { id: string; nome: string; tipo: string; tamanho: string }
type HistViagem = { id: string; codigo: string; rota: string; data: string; status: string; veiculo: string }

const fotosVistoria: FotoVistoria[] = [
  { id: "f1", legenda: "Entrada — Lateral Esquerda", tipo: "entrada" },
  { id: "f2", legenda: "Entrada — Para-choque Dianteiro", tipo: "entrada" },
  { id: "f3", legenda: "Saída — Pneu Dianteiro", tipo: "saida" },
  { id: "f4", legenda: "Avaria — Risco Porta Traseira", tipo: "avaria" },
  { id: "f5", legenda: "Saída — Painel Quilométrico", tipo: "saida" },
  { id: "f6", legenda: "Entrada — Teto do Veículo", tipo: "entrada" },
]

const docsAnexos: DocAnexo[] = [
  { id: "doc1", nome: "CNH_Roberto_Silva.pdf", tipo: "CNH Digital", tamanho: "1.2 MB" },
  { id: "doc2", nome: "Comprovante_Residencia.pdf", tipo: "Comprovante", tamanho: "0.8 MB" },
  { id: "doc3", nome: "Exame_Toxicologico.pdf", tipo: "Exame Médico", tamanho: "2.1 MB" },
  { id: "doc4", nome: "Contrato_Motorista.pdf", tipo: "Contrato", tamanho: "1.5 MB" },
]

const historicoViagens: HistViagem[] = [
  { id: "h1", codigo: "#1042", rota: "São Paulo/SP → Rio de Janeiro/RJ", data: "15/08/2026", status: "Em Trânsito", veiculo: "Cegonha - Carreta Branca" },
  { id: "h2", codigo: "#1038", rota: "São Paulo/SP → Belo Horizonte/MG", data: "10/08/2026", status: "Entregue", veiculo: "Cegonha - Carreta Branca" },
  { id: "h3", codigo: "#1035", rota: "Rio de Janeiro/RJ → São Paulo/SP", data: "05/08/2026", status: "Entregue", veiculo: "Cegonha - Carreta Branca" },
  { id: "h4", codigo: "#1031", rota: "Curitiba/PR → São Paulo/SP", data: "28/07/2026", status: "Entregue", veiculo: "Cegonha - Gaivota" },
  { id: "h5", codigo: "#1028", rota: "São Paulo/SP → Salvador/BA", data: "20/07/2026", status: "Entregue", veiculo: "Cegonha - Carreta Branca" },
]

const fotoTipoStyle: Record<FotoVistoria["tipo"], { label: string; cls: string }> = {
  entrada: { label: "Entrada", cls: "bg-primary/10 text-primary" },
  saida: { label: "Saída", cls: "bg-success/10 text-success" },
  avaria: { label: "Avaria", cls: "bg-destructive/10 text-destructive" },
}

export function FichaMotoristaModal({ nome, onClose }: { nome: string; onClose: () => void }) {
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Modal titulo="Ficha do Motorista" descricao="Perfil completo, histórico e vistorias" onClose={onClose} size="xl">
      {/* Cabeçalho do perfil */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-gradient-to-br from-sidebar to-slate-800 p-5 text-white sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold shadow-lg">
          {iniciais}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{nome}</h2>
          <p className="text-sm text-slate-300">Cegonha #1042 · Carreta Branca</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full bg-success/20 px-2.5 py-1 text-xs font-medium text-success">
              <Star className="h-3 w-3" /> 4.8 avaliação
            </span>
            <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
              <Award className="h-3 w-3" /> 142 viagens concluídas
            </span>
          </div>
        </div>
      </div>

      {/* Dados básicos */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: IdCard, label: "CNH", valor: "048.652.991-SP (Cat. E)" },
          { icon: Phone, label: "Telefone", valor: "(11) 98765-4321" },
          { icon: Mail, label: "E-mail", valor: "roberto.silva@autotrack.com" },
          { icon: Calendar, label: "Admissão", valor: "14/03/2021" },
        ].map((d) => {
          const Icon = d.icon
          return (
            <div key={d.label} className="rounded-lg border border-border bg-background p-3">
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                <Icon className="h-3 w-3" /> {d.label}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{d.valor}</p>
            </div>
          )
        })}
      </div>

      {/* Histórico de viagens */}
      <div className="mt-5">
        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Truck className="h-4 w-4 text-primary" /> Histórico de Viagens
        </h3>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Viagem</th>
                <th className="px-3 py-2 font-medium">Rota</th>
                <th className="px-3 py-2 font-medium">Data</th>
                <th className="px-3 py-2 font-medium">Veículo</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historicoViagens.map((h) => (
                <tr key={h.id} className="hover:bg-muted/40">
                  <td className="px-3 py-2.5 font-mono text-xs font-medium text-foreground">{h.codigo}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{h.rota}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{h.data}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{h.veiculo}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        h.status === "Entregue" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Galeria de vistorias */}
      <div className="mt-5">
        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <ImageIcon className="h-4 w-4 text-primary" /> Galeria de Vistorias &amp; Avarias
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fotosVistoria.map((f) => {
            const st = fotoTipoStyle[f.tipo]
            return (
              <div key={f.id} className="group overflow-hidden rounded-lg border border-border bg-background">
                <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <Car className="h-12 w-12 text-slate-400" strokeWidth={1} />
                  <span className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${st.cls}`}>
                    {st.label}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground">{f.legenda}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Documentos anexos */}
      <div className="mt-5">
        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <FileCheck2 className="h-4 w-4 text-primary" /> Documentos &amp; Comprovantes (PDF)
        </h3>
        <div className="space-y-2">
          {docsAnexos.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 transition hover:border-primary hover:bg-primary/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{d.nome}</p>
                <p className="text-xs text-muted-foreground">{d.tipo} · {d.tamanho}</p>
              </div>
              <button className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary/20">
                <FileText className="h-3.5 w-3.5" /> Visualizar
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

/* ---------- Novo Lançamento Financeiro ---------- */
export function NovaLancamentoModal({
  tipo,
  onClose,
  onSalvar,
}: {
  tipo: "pagar" | "receber"
  onClose: () => void
  onSalvar: () => void
}) {
  const [documento, setDocumento] = useState("")
  const [entidade, setEntidade] = useState("")
  const [valor, setValor] = useState("")
  const [vencimento, setVencimento] = useState("")
  const [categoria, setCategoria] = useState("")

  const valida = documento && entidade && valor && vencimento

  return (
    <Modal
      titulo={tipo === "pagar" ? "Nova Conta a Pagar" : "Nova Conta a Receber"}
      descricao="Preencha os dados do lançamento financeiro"
      onClose={onClose}
    >
      <div className="space-y-3">
        <Campo label="Documento / NF" value={documento} onChange={setDocumento} placeholder="Ex: NF-8830" />
        <Campo
          label={tipo === "pagar" ? "Fornecedor" : "Cliente"}
          value={entidade}
          onChange={setEntidade}
          placeholder={tipo === "pagar" ? "Ex: Posto Ipiranga" : "Ex: Localiza Rent a Car"}
        />
        <div className="grid grid-cols-2 gap-3">
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
            <label className="text-xs font-medium text-muted-foreground">Vencimento</label>
            <input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
        <Campo label="Categoria" value={categoria} onChange={setCategoria} placeholder="Ex: Combustível, Frete..." />
      </div>
      <div className="mt-5 flex gap-2">
        <button onClick={onClose} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground">
          Cancelar
        </button>
        <button
          onClick={onSalvar}
          disabled={!valida}
          className="flex-[2] rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          Registrar lançamento
        </button>
      </div>
    </Modal>
  )
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  )
}
