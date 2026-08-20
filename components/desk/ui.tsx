"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import { X, CircleCheck as CheckCircle2, Eye, Pencil, Trash2, MoveHorizontal as MoreHorizontal } from "lucide-react"

export function Modal({
  titulo,
  descricao,
  onClose,
  children,
  size = "md",
}: {
  titulo: string
  descricao?: string
  onClose: () => void
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const width = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${width} max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl`}>
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">{titulo}</h2>
            {descricao && <p className="mt-0.5 text-xs text-muted-foreground">{descricao}</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground transition hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-70px)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

export function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-xl bg-sidebar px-4 py-3 text-sm text-white shadow-2xl">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
      {msg}
    </div>
  )
}

export function AcoesBotoes({ onVisualizar, onEditar, onExcluir }: { onVisualizar?: () => void; onEditar?: () => void; onExcluir?: () => void }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    if (aberto) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [aberto])

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {aberto && (
        <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-xl">
          {onVisualizar && (
            <button
              onClick={() => { setAberto(false); onVisualizar() }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Eye className="h-3.5 w-3.5" /> Visualizar
            </button>
          )}
          {onEditar && (
            <button
              onClick={() => { setAberto(false); onEditar() }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
          )}
          {onExcluir && (
            <button
              onClick={() => { setAberto(false); onExcluir() }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-destructive transition hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Excluir
            </button>
          )}
        </div>
      )}
    </div>
  )
}
