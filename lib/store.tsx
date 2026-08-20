"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  despesasIniciais,
  veiculosEmbarcados as veiculosSeed,
  type DespesaViagem,
  type StatusAprovacao,
  type VeiculoEmbarcado,
} from "@/lib/mock-data"

export type Role = "gerente" | "motorista"

export type Usuario = {
  role: Role
  nome: string
  cargo: string
  iniciais: string
}

export const USUARIOS: Record<Role, Usuario> = {
  gerente: { role: "gerente", nome: "Maria Clara", cargo: "Diretoria Operations", iniciais: "MC" },
  motorista: { role: "motorista", nome: "Roberto Silva", cargo: "Cegonha #1042", iniciais: "RS" },
}

type Store = {
  usuario: Usuario | null
  login: (role: Role) => void
  logout: () => void
  despesas: DespesaViagem[]
  addDespesa: (d: Omit<DespesaViagem, "id" | "status">) => void
  setStatusDespesa: (id: string, status: StatusAprovacao, motivo?: string) => void
  veiculos: VeiculoEmbarcado[]
  addVeiculo: (v: VeiculoEmbarcado) => void
  darBaixaVeiculo: (id: string) => void
  pendentesCount: number
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [despesas, setDespesas] = useState<DespesaViagem[]>(despesasIniciais)
  const [veiculos, setVeiculos] = useState<VeiculoEmbarcado[]>(veiculosSeed)

  const login = useCallback((role: Role) => setUsuario(USUARIOS[role]), [])
  const logout = useCallback(() => setUsuario(null), [])

  const addDespesa = useCallback((d: Omit<DespesaViagem, "id" | "status">) => {
    setDespesas((prev) => [{ ...d, id: `d${Date.now()}`, status: "pendente" }, ...prev])
  }, [])

  const setStatusDespesa = useCallback((id: string, status: StatusAprovacao, motivo?: string) => {
    setDespesas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, motivoRecusa: status === "recusado" ? motivo : undefined } : d)),
    )
  }, [])

  const addVeiculo = useCallback((v: VeiculoEmbarcado) => setVeiculos((prev) => [...prev, v]), [])
  const darBaixaVeiculo = useCallback(
    (id: string) => setVeiculos((prev) => prev.map((v) => (v.id === id ? { ...v, entregue: true } : v))),
    [],
  )

  const pendentesCount = despesas.filter((d) => d.status === "pendente").length

  return (
    <StoreContext.Provider
      value={{
        usuario,
        login,
        logout,
        despesas,
        addDespesa,
        setStatusDespesa,
        veiculos,
        addVeiculo,
        darBaixaVeiculo,
        pendentesCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider")
  return ctx
}
