"use client"

import { useState } from "react"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Truck,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CircleAlert,
  Check,
  ChevronRight,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { contasReceber, fluxoCaixaData, composicaoFrota, formatBRL } from "@/lib/mock-data"
import { MapaModal, DREModal } from "@/components/desk/modais"
import { Toast } from "@/components/desk/ui"

const statusStyle: Record<string, string> = {
  recebido: "bg-success/10 text-success",
  pendente: "bg-warning/10 text-warning",
  atrasado: "bg-destructive/10 text-destructive",
}

function Kpi({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  accent,
  onClick,
}: {
  icon: typeof Wallet
  label: string
  value: string
  trend: string
  trendUp: boolean
  accent: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-success" : "text-destructive"}`}>
          {trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {trend}
        </span>
      </div>
      <p className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
        {label}
        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
    </button>
  )
}

type AlertaIA = { id: string; tipo: "success" | "warning" | "primary"; titulo: string; texto: string; acao: string }

const alertasIniciais: AlertaIA[] = [
  { id: "a1", tipo: "success", titulo: "Fluxo positivo", texto: "Sua receita cresceu 12,4% vs. julho. O saldo atual cobre 4,3 meses de despesas fixas.", acao: "Ver projeção" },
  { id: "a2", tipo: "warning", titulo: "Atenção", texto: "Há R$ 49.290 em boletos atrasados (Unidas e Localiza). Sugerimos cobrança automática.", acao: "Ativar cobrança automática" },
  { id: "a3", tipo: "primary", titulo: "Recomendação", texto: 'A cegonha "Carreta Branca" tem a maior rentabilidade (38%). Priorize rotas SP–RJ.', acao: "Aplicar na roteirização" },
]

export function DeskDashboard({ onNavigate }: { onNavigate: (destino: string) => void }) {
  const [mapa, setMapa] = useState(false)
  const [dre, setDre] = useState<null | "saldo" | "receber" | "pagar">(null)
  const [alertas, setAlertas] = useState(alertasIniciais)
  const [toast, setToast] = useState<string | null>(null)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  function aplicarAlerta(a: AlertaIA) {
    setAlertas((prev) => prev.filter((x) => x.id !== a.id))
    notify(`IA aplicada: ${a.acao}`)
  }

  const alertaColor = {
    success: "text-success",
    warning: "text-warning",
    primary: "text-primary",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Financeiro</h1>
        <p className="text-sm text-muted-foreground">Visão geral do fluxo de caixa e operações de frota</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Wallet} label="Saldo Geral em Conta" value="R$ 283.907,12" trend="+12,4%" trendUp accent="bg-primary/10 text-primary" onClick={() => setDre("saldo")} />
        <Kpi icon={TrendingUp} label="Contas a Receber do Mês" value="R$ 138.760,25" trend="+8,1%" trendUp accent="bg-success/10 text-success" onClick={() => onNavigate("receber")} />
        <Kpi icon={TrendingDown} label="Contas a Pagar do Mês" value="R$ 33.050,90" trend="-3,2%" trendUp={false} accent="bg-destructive/10 text-destructive" onClick={() => onNavigate("pagar")} />
        <Kpi icon={Truck} label="Viagens em Rota" value="4 ativas" trend="+1 hoje" trendUp accent="bg-warning/10 text-warning" onClick={() => setMapa(true)} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Fluxo de Caixa — 6 meses</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Receita
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-foreground" /> Despesa
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fluxoCaixaData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDesp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="receita" stroke="#2563eb" strokeWidth={2} fill="url(#gRec)" />
                <Area type="monotone" dataKey="despesa" stroke="#0f172a" strokeWidth={2} fill="url(#gDesp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IA Diagnóstico acionável */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 to-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Diagnóstico com IA</h2>
              <p className="text-xs text-muted-foreground">Clique para aplicar recomendações</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {alertas.length === 0 && (
              <li className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                <Check className="h-6 w-6 text-success" />
                Todas as recomendações foram aplicadas!
              </li>
            )}
            {alertas.map((a) => (
              <li key={a.id} className="rounded-lg border border-border bg-card/70 p-3">
                <p className={`flex items-center gap-1 font-medium ${alertaColor[a.tipo]}`}>
                  {a.tipo === "warning" && <CircleAlert className="h-3.5 w-3.5" />}
                  {a.titulo}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{a.texto}</p>
                <button
                  onClick={() => aplicarAlerta(a)}
                  className="mt-2 flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
                >
                  <Sparkles className="h-3 w-3" /> {a.acao}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Contas a Receber / Boletos</h2>
            <button
              onClick={() => onNavigate("receber")}
              className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-primary"
            >
              {contasReceber.length} documentos <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Documento</th>
                  <th className="px-4 py-2.5 font-medium">Emissão</th>
                  <th className="px-4 py-2.5 font-medium">Cliente</th>
                  <th className="px-4 py-2.5 text-right font-medium">Valor</th>
                  <th className="px-4 py-2.5 font-medium">Vencimento</th>
                  <th className="px-4 py-2.5 text-right font-medium">Recebido</th>
                  <th className="px-4 py-2.5 font-medium">Conta Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contasReceber.map((c) => (
                  <tr key={c.id} className="cursor-pointer hover:bg-muted/40" onClick={() => onNavigate("receber")}>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{c.documento}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.emissao}</td>
                    <td className="px-4 py-3 text-foreground">{c.cliente}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{formatBRL(c.valor)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyle[c.status]}`}>{c.vencimento}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{c.valorRecebido > 0 ? formatBRL(c.valorRecebido) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{c.contaOrigem}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-semibold text-foreground">Rentabilidade por Veículo</h2>
          <p className="text-xs text-muted-foreground">Participação no faturamento</p>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={composicaoFrota} dataKey="value" nameKey="nome" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {composicaoFrota.map((e) => (
                    <Cell key={e.nome} fill={e.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {composicaoFrota.map((e) => (
              <li key={e.nome} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.cor }} />
                  {e.nome}
                </span>
                <span className="font-medium text-foreground">{e.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {mapa && <MapaModal onClose={() => setMapa(false)} />}
      {dre && <DREModal tipo={dre} onClose={() => setDre(null)} />}
      {toast && <Toast msg={toast} />}
    </div>
  )
}
