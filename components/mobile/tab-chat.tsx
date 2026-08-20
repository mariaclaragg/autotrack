"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, Sparkles } from "lucide-react"

type Msg = { id: string; de: "ia" | "motorista"; texto: string }

const sugestoes = [
  "Onde fica o pátio de desembarque no RJ?",
  "Como procedo se o pneu furar na Dutra?",
  "Como lanço nota de pernoite?",
]

const respostasIA: { termos: string[]; resposta: string }[] = [
  {
    termos: ["pátio", "desembarque", "rj", "rio"],
    resposta:
      "O pátio de desembarque no RJ fica na Av. Brasil, 22.000 - Pavuna. Horário de recebimento: 08h às 17h. Ao chegar, procure o supervisor João e apresente a OS #1042. Estacione na baia 4 (cegonhas).",
  },
  {
    termos: ["pneu", "furar", "furou", "borracharia", "dutra"],
    resposta:
      "Se o pneu furar na Dutra: 1) Pare em local seguro e sinalize. 2) Acione a assistência 24h pelo botão SOS. 3) Borracharia credenciada mais próxima: Auto Center Km 172 (sentido RJ). 4) Guarde a nota e lance como 'Borracharia' na aba Despesas para reembolso.",
  },
  {
    termos: ["pernoite", "hospedagem", "dormir", "hotel"],
    resposta:
      "Para lançar pernoite: vá na aba Despesas > Nova Despesa > categoria 'Hospedagem/Pernoite'. Informe valor, estabelecimento e anexe a foto da nota fiscal. O limite aprovado é R$ 180,00/diária. Acima disso precisa de autorização prévia.",
  },
]

function responder(pergunta: string): string {
  const q = pergunta.toLowerCase()
  const match = respostasIA.find((r) => r.termos.some((t) => q.includes(t)))
  if (match) return match.resposta
  return "Entendido! Registrei sua dúvida operacional. Para questões urgentes de rota, combustível ou avarias, use o botão SOS na aba Início. Posso ajudar com pátios, pedágios, lançamento de despesas e procedimentos de emergência."
}

export function TabChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "1", de: "ia", texto: "Olá, Roberto! Sou a IA operacional da AutoTRACK. Como posso ajudar na viagem #1042?" },
  ])
  const [input, setInput] = useState("")
  const [digitando, setDigitando] = useState(false)
  const fim = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs, digitando])

  function enviar(texto: string) {
    if (!texto.trim()) return
    const userMsg: Msg = { id: Date.now().toString(), de: "motorista", texto }
    setMsgs((prev) => [...prev, userMsg])
    setInput("")
    setDigitando(true)
    setTimeout(() => {
      setDigitando(false)
      setMsgs((prev) => [...prev, { id: `${Date.now()}-ia`, de: "ia", texto: responder(texto) }])
    }, 1100)
  }

  return (
    <div className="flex h-full flex-col bg-slate-100">
      {/* Header do chat */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Assistente IA Operacional</p>
          <p className="flex items-center gap-1 text-xs text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online agora
          </p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.de === "motorista" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                m.de === "motorista"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {m.texto}
            </div>
          </div>
        ))}
        {digitando && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        )}
        <div ref={fim} />
      </div>

      {/* Sugestões */}
      {msgs.length <= 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2">
          {sugestoes.map((s) => (
            <button
              key={s}
              onClick={() => enviar(s)}
              className="flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary"
            >
              <Sparkles className="h-3 w-3" /> {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) enviar(input)
          }}
          placeholder="Digite sua dúvida..."
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={() => enviar(input)}
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  )
}
