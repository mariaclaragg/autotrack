"use client"

import { useState } from "react"
import { Search, Plus, Building2, Users } from "lucide-react"
import { clientes as clientesSeed, fornecedores as fornecedoresSeed, type Cliente, type Fornecedor } from "@/lib/mock-data"
import { NovoCadastroModal } from "@/components/desk/modais"
import { Toast, AcoesBotoes } from "@/components/desk/ui"

export function DeskClientes() {
  const [lista, setLista] = useState<Cliente[]>(clientesSeed)
  const [busca, setBusca] = useState("")
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const filtrados = lista.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.documento.includes(busca) ||
      c.municipio.toLowerCase().includes(busca.toLowerCase()),
  )

  function salvar() {
    const novo: Cliente = {
      id: `c${Date.now()}`,
      nome: "Novo Cliente (demonstração)",
      documento: "00.000.000/0001-00",
      cep: "00000-000",
      logradouro: "A definir",
      bairro: "—",
      municipio: "São Paulo",
      uf: "SP",
      telefone: "(11) 0000-0000",
    }
    setLista((prev) => [novo, ...prev])
    setModal(false)
    setToast("Cliente cadastrado com sucesso!")
    setTimeout(() => setToast(null), 2600)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Users className="h-6 w-6 text-primary" /> Clientes
          </h1>
          <p className="text-sm text-muted-foreground">Cadastro completo com dados fiscais e de endereço</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Novo Cliente
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, CNPJ ou município..."
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Nome / Razão Social</th>
                <th className="px-4 py-2.5 font-medium">CNPJ / CPF</th>
                <th className="px-4 py-2.5 font-medium">CEP</th>
                <th className="px-4 py-2.5 font-medium">Logradouro</th>
                <th className="px-4 py-2.5 font-medium">Bairro</th>
                <th className="px-4 py-2.5 font-medium">Município</th>
                <th className="px-4 py-2.5 font-medium">UF</th>
                <th className="px-4 py-2.5 font-medium">Telefone</th>
                <th className="px-4 py-2.5 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtrados.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">{c.nome}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.documento}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.cep}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.logradouro}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.bairro}</td>
                  <td className="px-4 py-3 text-foreground">{c.municipio}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">{c.uf}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.telefone}</td>
                  <td className="px-4 py-3">
                    <AcoesBotoes
                      onVisualizar={() => notify(`Visualizando cliente: ${c.nome}`)}
                      onEditar={() => notify(`Editando cliente: ${c.nome}`)}
                      onExcluir={() => {
                        setLista((prev) => prev.filter((x) => x.id !== c.id))
                        notify(`Cliente ${c.nome} excluído!`)
                      }}
                    />
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Nenhum cliente encontrado para "{busca}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <NovoCadastroModal tipo="cliente" onClose={() => setModal(false)} onSalvar={salvar} />}
      {toast && <Toast msg={toast} />}
    </div>
  )
}

export function DeskFornecedores() {
  const [lista, setLista] = useState<Fornecedor[]>(fornecedoresSeed)
  const [busca, setBusca] = useState("")
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const filtrados = lista.filter(
    (f) => f.nome.toLowerCase().includes(busca.toLowerCase()) || f.categoria.toLowerCase().includes(busca.toLowerCase()),
  )

  function salvar() {
    const novo: Fornecedor = {
      id: `f${Date.now()}`,
      nome: "Novo Fornecedor (demonstração)",
      documento: "00.000.000/0001-00",
      categoria: "Serviços",
      municipio: "São Paulo",
      uf: "SP",
      telefone: "(11) 0000-0000",
    }
    setLista((prev) => [novo, ...prev])
    setModal(false)
    setToast("Fornecedor cadastrado com sucesso!")
    setTimeout(() => setToast(null), 2600)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Building2 className="h-6 w-6 text-primary" /> Fornecedores
          </h1>
          <p className="text-sm text-muted-foreground">Postos, oficinas, seguradoras e prestadores</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Novo Fornecedor
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou categoria..."
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtrados.map((f) => (
          <div key={f.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{f.categoria}</span>
            </div>
            <h3 className="mt-3 font-semibold text-foreground">{f.nome}</h3>
            <p className="font-mono text-xs text-muted-foreground">{f.documento}</p>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
              <p>{f.municipio} — {f.uf}</p>
              <p>{f.telefone}</p>
            </div>
          </div>
        ))}
      </div>

      {modal && <NovoCadastroModal tipo="fornecedor" onClose={() => setModal(false)} onSalvar={salvar} />}
      {toast && <Toast msg={toast} />}
    </div>
  )
}
