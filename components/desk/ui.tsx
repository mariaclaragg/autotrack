"use client"

import { useEffect, type ReactNode } from "react"
import { X, CheckCircle2 } from "lucide-react"

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
