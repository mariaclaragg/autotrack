"use client"

import {
  Landmark,
  Boxes,
  Receipt,
  BarChart3,
  Settings,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { contasPagar, contasReceber, fluxoCaixaData, type ContaReceber, formatBRL } from "@/lib/mock-data"

const statusStyle: Record<string, string> = {
  recebido: "bg-success/10 text-success",
  pendente: "bg-warning/10 text-warning",
  atrasado: "bg-destructive/10 text-destructive",
}

function TabelaFinanceira({ titulo, dados, tipo }: { titulo: string; dados: ContaReceber[]; tipo: "pagar" | "receber" }) {
  const total = dados.reduce((s, d) => s + d.valor, 0)
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            {tipo === "pagar" ? (
              <ArrowUpCircle className="h-6 w-6 text-destructive" />
            ) : (
              <ArrowDownCircle className="h-6 w-6 text-success" />
            )}
            {titulo}
          </h1>
          <p className="text-sm text-muted-foreground">Total do período: {formatBRL(total)}</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Documento</th>
                <th className="px-4 py-2.5 font-medium">Emissão</th>
                <th className="px-4 py-2.5 font-medium">{tipo === "pagar" ? "Fornecedor" : "Cliente"}</th>
                <th className="px-4 py-2.5 text-right font-medium">Valor</th>
                <th className="px-4 py-2.5 font-medium">Vencimento</th>
                <th className="px-4 py-2.5 font-medium">Categoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dados.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{c.documento}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.emissao}</td>
                  <td className="px-4 py-3 text-foreground">{c.cliente}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">{formatBRL(c.valor)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyle[c.status]}`}>
                      {c.vencimento}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {c.contaOrigem}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function DeskContasPagar() {
  return <TabelaFinanceira titulo="Contas a Pagar" dados={contasPagar} tipo="pagar" />
}

export function DeskContasReceber() {
  return <TabelaFinanceira titulo="Contas a Receber" dados={contasReceber} tipo="receber" />
}

const contas = [
  { nome: "Banco do Brasil — CC 12.345-6", saldo: 148230.55, tipo: "Conta Corrente" },
  { nome: "Itaú — CC 98.765-4", saldo: 92450.12, tipo: "Conta Corrente" },
  { nome: "Caixa Interno — Matriz", saldo: 43226.45, tipo: "Dinheiro" },
]

export function DeskCaixa() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Landmark className="h-6 w-6 text-primary" /> Caixa &amp; Bancos
        </h1>
        <p className="text-sm text-muted-foreground">Saldos consolidados das contas</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {contas.map((c) => (
          <div key={c.nome} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.tipo}</p>
            <p className="mt-1 font-medium text-foreground">{c.nome}</p>
            <p className="mt-3 text-2xl font-bold text-primary">{formatBRL(c.saldo)}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-foreground">Receitas x Despesas por mês</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fluxoCaixaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="receita" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const estoque = [
  { item: "Pneu 295/80 R22.5 Michelin", qtd: 24, min: 12, un: "un" },
  { item: "Óleo Diesel S10", qtd: 4800, min: 2000, un: "L" },
  { item: "Filtro de Óleo Volvo FH", qtd: 8, min: 10, un: "un" },
  { item: "Correntes de Amarração", qtd: 46, min: 20, un: "un" },
  { item: "Cinta Catraca 5T", qtd: 15, min: 24, un: "un" },
]

export function DeskEstoque() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Boxes className="h-6 w-6 text-primary" /> Estoque
        </h1>
        <p className="text-sm text-muted-foreground">Peças, insumos e materiais de amarração</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Item</th>
              <th className="px-4 py-2.5 text-right font-medium">Quantidade</th>
              <th className="px-4 py-2.5 text-right font-medium">Estoque Mín.</th>
              <th className="px-4 py-2.5 font-medium">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {estoque.map((e) => {
              const baixo = e.qtd < e.min
              return (
                <tr key={e.item} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">{e.item}</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {e.qtd.toLocaleString("pt-BR")} {e.un}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {e.min.toLocaleString("pt-BR")} {e.un}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        baixo ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                      }`}
                    >
                      {baixo ? "Repor" : "Normal"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const vendas = [
  { doc: "FR-2201", cliente: "Localiza Rent a Car", rota: "SP → RJ", veiculos: 8, valor: 18450 },
  { doc: "FR-2202", cliente: "Movida Locação", rota: "MG → BA", veiculos: 10, valor: 27890 },
  { doc: "FR-2203", cliente: "Unidas Frotas", rota: "PR → SC", veiculos: 2, valor: 6200 },
  { doc: "FR-2204", cliente: "Chevrolet SP", rota: "SP → PE", veiculos: 6, valor: 15670 },
]

export function DeskVendas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Receipt className="h-6 w-6 text-primary" /> Vendas / Fretes
        </h1>
        <p className="text-sm text-muted-foreground">Ordens de frete de transporte de veículos</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Ordem</th>
              <th className="px-4 py-2.5 font-medium">Cliente</th>
              <th className="px-4 py-2.5 font-medium">Rota</th>
              <th className="px-4 py-2.5 text-right font-medium">Veículos</th>
              <th className="px-4 py-2.5 text-right font-medium">Valor do Frete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vendas.map((v) => (
              <tr key={v.doc} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{v.doc}</td>
                <td className="px-4 py-3 text-foreground">{v.cliente}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.rota}</td>
                <td className="px-4 py-3 text-right text-foreground">{v.veiculos}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">{formatBRL(v.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DeskRelatorios() {
  const rel = [
    { nome: "DRE Gerencial", desc: "Demonstrativo de resultados do exercício" },
    { nome: "Fluxo de Caixa Projetado", desc: "Projeção de 90 dias" },
    { nome: "Rentabilidade por Veículo", desc: "Margem por cegonha e guincho" },
    { nome: "Inadimplência", desc: "Boletos vencidos por cliente" },
    { nome: "Consumo de Combustível", desc: "Km/L por rota e motorista" },
    { nome: "Produtividade da Frota", desc: "Ocupação média das cegonhas" },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <BarChart3 className="h-6 w-6 text-primary" /> Relatórios
        </h1>
        <p className="text-sm text-muted-foreground">Central de relatórios gerenciais</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rel.map((r) => (
          <button
            key={r.nome}
            className="rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-semibold text-foreground">{r.nome}</h3>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export function DeskConfiguracoes() {
  const opcoes = [
    { nome: "Dados da Empresa", desc: "Razão social, CNPJ, endereço fiscal" },
    { nome: "Usuários & Permissões", desc: "Controle de acesso por perfil" },
    { nome: "Integração Bancária", desc: "Conciliação automática de boletos" },
    { nome: "Motoristas & Frota", desc: "Cadastro de veículos e condutores" },
    { nome: "Notas Fiscais (NF-e)", desc: "Certificado digital e séries" },
    { nome: "Inteligência Artificial", desc: "Preferências do diagnóstico com IA" },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Settings className="h-6 w-6 text-primary" /> Configurações
        </h1>
        <p className="text-sm text-muted-foreground">Parâmetros gerais do sistema</p>
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {opcoes.map((o) => (
          <button key={o.nome} className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-muted/40">
            <div>
              <p className="font-medium text-foreground">{o.nome}</p>
              <p className="text-sm text-muted-foreground">{o.desc}</p>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  )
}
