"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, Brain, Telescope, BookOpen, ChevronDown, ChevronUp, Save, CheckCircle2 } from "lucide-react";
import { chatMessages as initialMessages } from "@/data/students";
import { Role, ChatMessage } from "@/types";
import { useLang } from "@/lib/i18n";

interface Message {
  id: string;
  sender: "student" | "teacher";
  senderName: string;
  message: string;
  time: string;
  isTyping?: boolean;
}

function formatTime() {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export default function TeacherChat({ role }: { role: Role }) {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;
  const [messages, setMessages] = useState<Message[]>(() =>
    initialMessages.map((m: ChatMessage) => ({
      id: m.id,
      sender: m.sender,
      senderName: m.senderName,
      message: m.message,
      time: m.time,
    }))
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deepDiveMode, setDeepDiveMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // C24 — Deep Dive enhancements
  const [deepDiveDepth, setDeepDiveDepth] = useState(0); // 0-100
  const [deepDiveHilos, setDeepDiveHilos] = useState<string[]>([]);
  const [deepDiveSesiones, setDeepDiveSesiones] = useState<{ fecha: string; tema: string; profundidad: number; insights: string[] }[]>([]);
  const [guardandoSesion, setGuardandoSesion] = useState(false);
  const [sessionGuardada, setSessionGuardada] = useState(false);
  const [showSesiones, setShowSesiones] = useState(false);

  // Auto-activate Deep Dive when student has sent 6+ messages (sustained engagement)
  const studentMsgCount = messages.filter((m) => m.sender === "student").length;
  useEffect(() => {
    if (role === "student" && studentMsgCount >= 6 && !deepDiveMode) {
      setDeepDiveMode(true);
    }
    // C24 — update depth meter (0-100 based on messages past 6)
    if (deepDiveMode) {
      const extraMsgs = Math.max(0, studentMsgCount - 6);
      const newDepth = Math.min(100, Math.round((extraMsgs / 10) * 100));
      setDeepDiveDepth(newDepth);
      // Extract hilos from last 3 AI responses
      const aiResponses = messages.filter((m) => m.sender === "teacher" && !m.isTyping).slice(-3);
      const hilos = aiResponses.map((msg) => {
        const first = msg.message.split(".")[0].trim();
        return first.length > 60 ? first.slice(0, 57) + "..." : first;
      }).filter(Boolean);
      setDeepDiveHilos(hilos);
    }
  }, [studentMsgCount, role, deepDiveMode, messages]);

  const title =
    role === "student"
      ? "Profa. Ana Martínez"
      : role === "parent"
      ? "Tutor QHUMA"
      : "Mensajes";

  const subtitle =
    role === "student"
      ? "Mentora IA · 1º ESO"
      : role === "parent"
      ? "Asistente familiar"
      : "Clase 1º ESO";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const senderName =
      role === "student" ? "Lucas" : role === "parent" ? "María" : "Ana";

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "student",
      senderName,
      message: text,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        sender: "teacher",
        senderName: "Prof. Ana",
        message: "...",
        time: "",
        isTyping: true,
      },
    ]);

    try {
      const historyToSend = messages.slice(-8);
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyToSend, deepDive: deepDiveMode }),
      });

      const data = await res.json();
      const reply = data.reply ?? "¡Sigue así! 💪";

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: `ai-${Date.now()}`,
            sender: "teacher",
            senderName: "Prof. Ana",
            message: reply,
            time: formatTime(),
          })
      );
    } catch {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: `ai-err-${Date.now()}`,
            sender: "teacher",
            senderName: "Prof. Ana",
            message: "¡Sigue con la tarea! Ahora mismo estoy ocupada. 🙂",
            time: formatTime(),
          })
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    lbl("¿Cómo empiezo?", "How do I start?"),
    lbl("Estoy bloqueado", "I'm stuck"),
    lbl("¿Qué entrego?", "What do I submit?"),
  ];

  return (
    <div className="bg-card rounded-2xl border border-card-border flex flex-col h-[460px]">
      {/* Gradient header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 rounded-t-2xl"
        style={{
          background: "linear-gradient(135deg, var(--sidebar) 0%, var(--accent-dark) 100%)",
        }}
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <Sparkles size={14} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[13px] font-semibold text-white block leading-tight truncate">
            {title}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] text-white/70">{subtitle}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-[10px] text-white/60 font-medium bg-white/10 px-2 py-0.5 rounded-full">
            IA
          </div>
          {role === "student" && (
            <div className="flex items-center gap-1 bg-accent/20 px-2 py-0.5 rounded-full">
              <Brain size={8} className="text-accent" />
              <span className="text-[8px] text-accent font-bold tracking-wide">SOCRÁTICO</span>
            </div>
          )}
          {role === "student" && deepDiveMode && (
            <div className="flex items-center gap-1 bg-warning/25 px-2 py-0.5 rounded-full">
              <Telescope size={8} className="text-warning" />
              <span className="text-[8px] text-warning font-bold tracking-wide">DEEP DIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
        {messages.map((msg) => {
          const isTeacher = msg.sender === "teacher";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTeacher ? "items-start" : "items-end"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                  isTeacher
                    ? "bg-background rounded-tl-sm"
                    : "bg-sidebar text-white rounded-tr-sm"
                }`}
              >
                {msg.isTyping ? (
                  <div className="flex items-center gap-1 py-0.5">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                )}
              </div>
              {!msg.isTyping && (
                <span className="text-[9px] text-text-muted mt-0.5 px-1">
                  {msg.senderName}
                  {msg.time ? ` · ${msg.time}` : ""}
                </span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions — only when few messages */}
      {messages.length <= 5 && (
        <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
          {quickSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
                inputRef.current?.focus();
              }}
              className="text-[10px] text-accent-text bg-accent-light border border-accent/30 px-2.5 py-1 rounded-full hover:bg-accent/20 transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Deep Dive demo trigger — visible for students */}
      {role === "student" && !deepDiveMode && (
        <div className="px-3 pb-2">
          <button
            onClick={() => setDeepDiveMode(true)}
            className="flex items-center gap-1.5 text-[10px] text-text-muted hover:text-accent-text transition-colors cursor-pointer"
            title={lbl("Simula haber mantenido una conversación larga", "Simulate a long conversation")}
          >
            <Telescope size={10} />
            {lbl("Demo: activar Exploración Profunda", "Demo: activate Deep Exploration")}
          </button>
        </div>
      )}
      {role === "student" && deepDiveMode && (
        <div className="px-3 pb-2 space-y-2">
          {/* Profundímetro */}
          <div className="bg-warning-light rounded-xl px-3 py-2.5 border border-warning/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Telescope size={11} className="text-warning flex-shrink-0" />
              <span className="text-[10px] font-semibold text-warning">{lbl("Exploración Profunda activa", "Deep Exploration active")}</span>
              <span className="ml-auto text-[9px] font-bold text-warning">{deepDiveDepth}%</span>
            </div>
            {/* Barra de profundidad */}
            <div className="h-1.5 bg-warning/20 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-warning rounded-full transition-all duration-700"
                style={{ width: `${deepDiveDepth}%` }}
              />
            </div>
            <p className="text-[9px] text-text-muted">{lbl("Profundidad de exploración", "Exploration depth")} · {lbl("Sigue preguntando para ir más lejos", "Keep asking to go deeper")}</p>
          </div>

          {/* Hilos activos */}
          {deepDiveHilos.length > 0 && (
            <div className="bg-background rounded-xl px-3 py-2.5 border border-card-border">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen size={11} className="text-accent-text" />
                <span className="text-[10px] font-semibold text-text-primary">{lbl("Hilos de exploración activos", "Active exploration threads")}</span>
              </div>
              <div className="space-y-1.5">
                {deepDiveHilos.map((hilo, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
                    <p className="text-[10px] text-text-secondary flex-1 truncate">{hilo || `${lbl("Hilo", "Thread")} ${idx + 1}`}</p>
                    <button
                      onClick={() => {
                        const preguntasProfundas = [
                          lbl("¿Puedes profundizar más en ese punto y conectarlo con el mercado real de Málaga?", "Can you go deeper on that point and connect it to Málaga's real market?"),
                          lbl("¿Qué datos del INE o de AirDNA respaldan esa idea para Casa Limón?", "What INE or AirDNA data supports that idea for Casa Limón?"),
                          lbl("Si lo analizas desde la perspectiva de un inversor, ¿qué métricas cambiarían?", "If you analyze this from an investor's perspective, what metrics would change?"),
                        ];
                        setInput(preguntasProfundas[idx % preguntasProfundas.length]);
                        inputRef.current?.focus();
                      }}
                      className="text-[8px] font-semibold text-accent-text bg-accent-light px-1.5 py-0.5 rounded-full hover:bg-accent/20 transition-colors cursor-pointer flex-shrink-0"
                    >
                      {lbl("Explorar", "Explore")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guardar sesión Deep Dive */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (guardandoSesion) return;
                setGuardandoSesion(true);
                setTimeout(() => {
                  const temaDetectado = deepDiveHilos[0]
                    ? deepDiveHilos[0].slice(0, 40)
                    : lbl("Exploración Airbnb Málaga", "Airbnb Málaga Exploration");
                  const nuevaSesion = {
                    fecha: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
                    tema: temaDetectado,
                    profundidad: deepDiveDepth,
                    insights: [
                      lbl("Análisis de mercado turístico Málaga completado", "Málaga tourism market analysis completed"),
                      lbl("Conexión con datos INE explorada", "INE data connection explored"),
                      lbl("Modelo de precios dinámicos identificado", "Dynamic pricing model identified"),
                    ],
                  };
                  setDeepDiveSesiones((prev) => [nuevaSesion, ...prev].slice(0, 3));
                  setSessionGuardada(true);
                  setGuardandoSesion(false);
                  setTimeout(() => setSessionGuardada(false), 2500);
                }, 1000);
              }}
              className="flex items-center gap-1.5 text-[10px] font-semibold bg-sidebar text-white px-2.5 py-1.5 rounded-xl hover:bg-accent-dark transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              {guardandoSesion ? (
                <><Loader2 size={9} className="animate-spin" />{lbl("Guardando...", "Saving...")}</>
              ) : sessionGuardada ? (
                <><CheckCircle2 size={9} className="text-accent" />{lbl("Guardada", "Saved")}</>
              ) : (
                <><Save size={9} />{lbl("Guardar sesión Deep Dive", "Save Deep Dive session")}</>
              )}
            </button>
            {deepDiveSesiones.length > 0 && (
              <button
                onClick={() => setShowSesiones((v) => !v)}
                className="flex items-center gap-1 text-[9px] text-text-muted hover:text-accent-text transition-colors cursor-pointer"
              >
                {showSesiones ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                {deepDiveSesiones.length} {lbl("sesiones guardadas", "saved sessions")}
              </button>
            )}
          </div>

          {/* Panel sesiones guardadas */}
          {showSesiones && deepDiveSesiones.length > 0 && (
            <div className="space-y-1.5">
              {deepDiveSesiones.map((sesion, idx) => (
                <div key={idx} className="bg-background rounded-xl p-2.5 border border-card-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Telescope size={9} className="text-warning" />
                    <span className="text-[10px] font-semibold text-text-primary flex-1 truncate">{sesion.tema}</span>
                    <span className="text-[8px] text-text-muted">{sesion.fecha}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-background rounded-full overflow-hidden border border-card-border">
                      <div className="h-full bg-warning rounded-full" style={{ width: `${sesion.profundidad}%` }} />
                    </div>
                    <span className="text-[8px] font-bold text-warning">{sesion.profundidad}%</span>
                  </div>
                  <div className="space-y-0.5">
                    {sesion.insights.map((insight, i) => (
                      <p key={i} className="text-[9px] text-text-muted">· {insight}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lbl("Pregunta a la Profa. Ana...", "Ask Prof. Ana...")}
            className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-7 h-7 rounded-full bg-sidebar flex items-center justify-center hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={12} className="text-accent animate-spin" />
            ) : (
              <Send size={12} className="text-accent" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
