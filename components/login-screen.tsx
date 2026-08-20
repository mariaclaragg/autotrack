"use client"

import { useState } from "react"
import { Truck, Monitor, Smartphone, Lock, ArrowRight, ShieldCheck, Loader2, KeyRound } from "lucide-react"
import { useStore, type Role } from "@/lib/store"

export function LoginScreen() {
  const { login } = useStore()
  const [selecionado, setSelecionado] = useState<Role | null>(null)
  const [senha, setSenha] = useState("")
  const [entrando, setEntrando] = useState(false)

  function selecionar(role: Role) {
    setSelecionado(role)
    setSenha("")
  }

  function entrar() {
    if (!senha) return
    setEntrando(true)
    setTimeout(() => {
      if (selecionado) login(selecionado)
    }, 900)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar p-4">
      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Truck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">AutoTRACK</h1>
          <p className="text-sm text-slate-400">Gestão de Frota &amp; ERP Financeiro ClippPro</p>
        </div>

        <div className="rounded-2xl border border-sidebar-border bg-card p-6 shadow-2xl">
          {!selecionado ? (
            <>
              <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Selecione o perfil de acesso
              </div>

              <button
                onClick={() => selecionar("gerente")}
                className="group flex w-full items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Monitor className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">Entrar como Gerente</p>
                  <p className="text-xs text-muted-foreground">Maria Clara — Diretoria Operations</p>
                  <p className="mt-1 text-[11px] font-medium text-primary">Acesso: ERP Desktop</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>

              <button
                onClick={() => selecionar("motorista")}
                className="group mt-3 flex w-full items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">Entrar como Motorista</p>
                  <p className="text-xs text-muted-foreground">Roberto Silva — Cegonha #1042</p>
                  <p className="mt-1 text-[11px] font-medium text-success">Acesso: App Mobile</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelecionado(null)}
                className="mb-4 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                ← Trocar perfil
              </button>

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    selecionado === "gerente" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                  }`}
                >
                  {selecionado === "gerente" ? <Monitor className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selecionado === "gerente" ? "Maria Clara" : "Roberto Silva"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selecionado === "gerente" ? "Diretoria Operations" : "Cegonha #1042"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  {selecionado === "gerente" ? <Lock className="h-3.5 w-3.5" /> : <KeyRound className="h-3.5 w-3.5" />}
                  {selecionado === "gerente" ? "Senha de acesso" : "PIN de segurança"}
                </label>
                <input
                  type="password"
                  autoFocus
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) entrar()
                  }}
                  placeholder={selecionado === "gerente" ? "••••••••" : "• • • •"}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Demonstração: digite qualquer senha para continuar
                </p>
              </div>

              <button
                onClick={entrar}
                disabled={!senha || entrando}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
              >
                {entrando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Autenticando...
                  </>
                ) : (
                  <>
                    Acessar sistema <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          AutoTRACK © 2026 — Ambiente de demonstração comercial
        </p>
      </div>
    </div>
  )
}
