"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Building2,
  Boxes,
  Receipt,
  ArrowUpCircle,
  ArrowDownCircle,
  Landmark,
  BarChart3,
  Settings,
  Bell,
  Search,
  Truck,
  LogOut,
  Sparkles,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { DeskDashboard } from "./desk/dashboard"
import { DeskClientes, DeskFornecedores } from "./desk/cadastros"
import { DeskViagens } from "./desk/viagens"
import {
  DeskContasPagar,
  DeskContasReceber,
  DeskCaixa,
  DeskEstoque,
  DeskVendas,
  DeskRelatorios,
  DeskConfiguracoes,
} from "./desk/financeiro"
import { IADocumentosModal } from "./desk/modais"
import { Toast } from "./desk/ui"

const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "fornecedores", label: "Fornecedores", icon: Building2 },
  { id: "estoque", label: "Estoque", icon: Boxes },
  { id: "vendas", label: "Vendas/Fretes", icon: Receipt },
  { id: "viagens", label: "Viagens", icon: Truck },
  { id: "pagar", label: "Contas a Pagar", icon: ArrowUpCircle },
  { id: "receber", label: "Contas a Receber", icon: ArrowDownCircle },
  { id: "caixa", label: "Caixa/Bancos", icon: Landmark },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "config", label: "Configurações", icon: Settings },
] as const

type ModuleId = (typeof menu)[number]["id"]

export function DeskPanel() {
  const { usuario, logout, pendentesCount } = useStore()
  const [ativo, setAtivo] = useState<ModuleId>("dashboard")
  const [busca, setBusca] = useState("")
  const [iaDocs, setIaDocs] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  function buscarGlobal(e: React.KeyboardEvent) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return
    const termo = busca.trim().toLowerCase()
    if (!termo) return
    const achado = menu.find((m) => m.label.toLowerCase().includes(termo))
    if (achado) {
      setAtivo(achado.id)
      notify(`Navegando para "${achado.label}"`)
    } else {
      notify(`Nenhum módulo encontrado para "${busca}"`)
    }
    setBusca("")
  }

  function render() {
    switch (ativo) {
      case "dashboard":
        return <DeskDashboard onNavigate={(d) => setAtivo(d as ModuleId)} />
      case "clientes":
        return <DeskClientes />
      case "fornecedores":
        return <DeskFornecedores />
      case "estoque":
        return <DeskEstoque />
      case "vendas":
        return <DeskVendas />
      case "viagens":
        return <DeskViagens />
      case "pagar":
        return <DeskContasPagar />
      case "receber":
        return <DeskContasReceber />
      case "caixa":
        return <DeskCaixa />
      case "relatorios":
        return <DeskRelatorios />
      case "config":
        return <DeskConfiguracoes />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-sidebar lg:flex">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Truck className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-accent-foreground">AutoTRACK</p>
            <p className="text-[10px] text-sidebar-foreground">ERP ClippPro</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menu.map((m) => {
            const Icon = m.icon
            const on = ativo === m.id
            return (
              <button
                key={m.id}
                onClick={() => setAtivo(m.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  on
                    ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{m.label}</span>
                {m.id === "viagens" && pendentesCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {pendentesCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sair / Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="relative hidden flex-1 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={buscarGlobal}
                placeholder="Buscar módulo e pressione Enter (ex: clientes, caixa)..."
                className="w-full max-w-md rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={() => setIaDocs(true)}
              className="ml-auto flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Análise de Documentos por IA</span>
              <span className="sm:hidden">IA Docs</span>
            </button>

            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
              <Bell className="h-4.5 w-4.5" />
              {pendentesCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />}
            </button>

            <div className="flex items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {usuario?.iniciais}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium leading-none text-foreground">{usuario?.nome}</p>
                <p className="text-[10px] text-muted-foreground">{usuario?.cargo}</p>
              </div>
              <button
                onClick={logout}
                title="Sair"
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Atalhos com ícones */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-2 py-1.5">
            {menu.map((m) => {
              const Icon = m.icon
              const on = ativo === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setAtivo(m.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                    on ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {m.label}
                </button>
              )
            })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">{render()}</main>
      </div>

      {iaDocs && (
        <IADocumentosModal
          onClose={() => setIaDocs(false)}
          onAplicar={() => {
            setIaDocs(false)
            notify("Dados do documento aplicados nas tabelas!")
          }}
        />
      )}
      {toast && <Toast msg={toast} />}
    </div>
  )
}
