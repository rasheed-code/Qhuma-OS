"use client";

import { useState } from "react";
import { MessageSquare, Send, Search, Star, Clock, CheckCheck, ChevronRight, Sparkles } from "lucide-react";

interface Conversation {
  id: string;
  student: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  status: "on_track" | "needs_attention" | "excelling";
  messages: { from: "teacher" | "student"; text: string; time: string }[];
}

const conversations: Conversation[] = [
  {
    id: "1", student: "Lucas García", avatar: "LG", lastMsg: "Profe, ¿puedo usar otra fuente para el análisis?", time: "10:23", unread: 2,
    status: "on_track",
    messages: [
      { from: "teacher", text: "Hola Lucas, ¿cómo va la fase de investigación?", time: "09:15" },
      { from: "student", text: "Bien! Encontré datos de ocupación en el INE, pero son de 2022.", time: "09:42" },
      { from: "teacher", text: "Perfecto, puedes completarlos con datos de Booking o Airbnb directamente.", time: "09:50" },
      { from: "student", text: "Profe, ¿puedo usar otra fuente para el análisis?", time: "10:23" },
    ],
  },
  {
    id: "2", student: "Sofía Rodríguez", avatar: "SR", lastMsg: "¡Terminé el brand book! Lo subo hoy.", time: "Ayer", unread: 0,
    status: "excelling",
    messages: [
      { from: "student", text: "Profe, ¿puede revisar mi primer boceto de logo?", time: "Ayer 15:00" },
      { from: "teacher", text: "Claro, súbelo a la galería de evidencias y lo comento.", time: "Ayer 15:30" },
      { from: "student", text: "¡Terminé el brand book! Lo subo hoy.", time: "Ayer 18:45" },
    ],
  },
  {
    id: "3", student: "Pablo Hernández", avatar: "PH", lastMsg: "No entiendo la fórmula del punto de equilibrio.", time: "Ayer", unread: 1,
    status: "needs_attention",
    messages: [
      { from: "student", text: "No entiendo la fórmula del punto de equilibrio.", time: "Ayer 16:10" },
    ],
  },
  {
    id: "4", student: "María López", avatar: "ML", lastMsg: "Muchas gracias por el feedback :)", time: "Lun", unread: 0,
    status: "on_track",
    messages: [
      { from: "teacher", text: "María, tu análisis de precios está muy bien. Falta justificar la temporada alta.", time: "Lun 11:00" },
      { from: "student", text: "Muchas gracias por el feedback :)", time: "Lun 11:45" },
    ],
  },
  {
    id: "5", student: "Daniel Castro", avatar: "DC", lastMsg: "Ya está la hoja de cálculo con el modelo de ingresos.", time: "Lun", unread: 0,
    status: "excelling",
    messages: [
      { from: "student", text: "Ya está la hoja de cálculo con el modelo de ingresos.", time: "Lun 09:00" },
      { from: "teacher", text: "Impresionante, Daniel. Compártela en el grupo como referencia.", time: "Lun 09:30" },
    ],
  },
  {
    id: "7", student: "Alejandro Jiménez", avatar: "AJ", lastMsg: "Perdona, no entregué la tarea de ayer.", time: "Dom", unread: 0,
    status: "needs_attention",
    messages: [
      { from: "student", text: "Perdona, no entregué la tarea de ayer.", time: "Dom 20:00" },
      { from: "teacher", text: "Alejandro, ¿todo bien? Cuéntame qué pasó y lo resolvemos.", time: "Dom 21:00" },
    ],
  },
];

const quickReplies = [
  { label: "¡Bien hecho!", text: "¡Muy buen trabajo! Sigue así." },
  { label: "Amplía esto", text: "Está en la dirección correcta, pero necesita más profundidad. ¿Puedes ampliar esta parte?" },
  { label: "Revisamos juntos", text: "No te preocupes, lo revisamos juntos en la próxima sesión. Trae tus dudas apuntadas." },
  { label: "Solicita evidencia", text: "Para avanzar al siguiente nivel necesito que subas una evidencia de este trabajo. ¡Tú puedes!" },
  { label: "Punto de equilibrio", text: "El punto de equilibrio es Costes fijos / (Precio - Coste variable). ¿Quieres que lo calculemos con tus datos?" },
  { label: "Comparte al grupo", text: "Tu trabajo es un gran ejemplo. ¿Te parece bien que lo compartamos con la clase como referencia?" },
  { label: "Demo Day check", text: "¿Cómo llevas la preparación para el Demo Day del viernes? ¿Necesitas ensayar el pitch?" },
  { label: "¡Reincorpórate!", text: "Te echamos de menos. Cuando puedas, escríbeme y acordamos cómo ponerte al día sin agobiarte." },
];

const statusColor = (s: Conversation["status"]) => {
  if (s === "excelling") return "bg-success";
  if (s === "needs_attention") return "bg-urgent";
  return "bg-accent";
};

export default function TeacherMessages() {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState("1");
  const [draft, setDraft] = useState("");

  const filtered = conversations.filter((c) =>
    c.student.toLowerCase().includes(search.toLowerCase())
  );

  const active = conversations.find((c) => c.id === activeId)!;

  const handleSend = () => {
    if (!draft.trim()) return;
    // In a real app, would push to state
    setDraft("");
  };

  const insertQuick = (text: string) => {
    setDraft(text);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare size={18} className="text-accent-text" />
        <div>
          <h1 className="text-[22px] font-bold text-text-primary">Mensajes</h1>
          <p className="text-[13px] text-text-secondary">Comunicación directa con alumnos · 1º ESO</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] bg-urgent text-white font-bold px-2 py-0.5 rounded-full">
            {conversations.reduce((s, c) => s + c.unread, 0)} sin leer
          </span>
        </div>
      </div>

      <div className="flex gap-4 h-[560px]">
        {/* Conversation list */}
        <div className="w-60 flex-shrink-0 flex flex-col bg-card rounded-2xl border border-card-border overflow-hidden">
          <div className="p-3 border-b border-card-border">
            <div className="flex items-center gap-2 bg-background rounded-xl px-2.5 py-1.5">
              <Search size={12} className="text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar alumno…"
                className="flex-1 text-[11px] bg-transparent outline-none text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-3 py-3 border-b border-card-border/50 transition-all cursor-pointer ${
                  activeId === c.id ? "bg-accent-light" : "hover:bg-background"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-sidebar text-accent text-[10px] font-bold flex items-center justify-center">
                      {c.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-card ${statusColor(c.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-text-primary truncate">{c.student.split(" ")[0]}</span>
                      <span className="text-[9px] text-text-muted flex-shrink-0">{c.time}</span>
                    </div>
                    <p className="text-[10px] text-text-muted truncate mt-0.5">{c.lastMsg}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-4 h-4 bg-urgent text-white text-[8px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-card rounded-2xl border border-card-border overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-card-border bg-background">
            <div className="w-8 h-8 rounded-full bg-sidebar text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              {active.avatar}
            </div>
            <div>
              <p className="text-[12px] font-bold text-text-primary">{active.student}</p>
              <p className="text-[10px] text-text-muted capitalize">
                {active.status === "excelling" ? "✨ Destacado" : active.status === "needs_attention" ? "⚠️ Necesita apoyo" : "✓ En curso"}
              </p>
            </div>
            <button className="ml-auto text-[10px] text-text-secondary border border-card-border rounded-xl px-2.5 py-1 flex items-center gap-1.5 hover:border-accent-text/30 transition-all cursor-pointer">
              Ver perfil <ChevronRight size={10} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {active.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "teacher" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                  m.from === "teacher"
                    ? "bg-sidebar text-white rounded-tr-sm"
                    : "bg-background text-text-primary rounded-tl-sm"
                }`}>
                  <p className="text-[11px] leading-relaxed">{m.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${m.from === "teacher" ? "text-white/40" : "text-text-muted"}`}>
                    <span className="text-[9px]">{m.time}</span>
                    {m.from === "teacher" && <CheckCheck size={10} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div className="px-4 py-2 border-t border-card-border/50">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={10} className="text-accent-text" />
              <span className="text-[9px] text-text-muted font-medium uppercase tracking-wide">Respuestas rápidas</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {quickReplies.slice(0, 4).map((qr, i) => (
                <button
                  key={i}
                  onClick={() => insertQuick(qr.text)}
                  className="text-[9px] font-medium bg-background border border-card-border text-text-secondary px-2 py-1 rounded-lg hover:border-accent-text/30 hover:text-accent-text transition-all cursor-pointer"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-card-border">
            <div className="flex gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Escribe un mensaje…"
                rows={2}
                className="flex-1 text-[12px] text-text-primary bg-background rounded-xl border border-card-border px-3 py-2 outline-none focus:border-accent-text/40 resize-none placeholder:text-text-muted"
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                className="w-10 bg-sidebar text-accent rounded-xl flex items-center justify-center cursor-pointer hover:brightness-110 transition-all disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel: all quick replies */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-card rounded-2xl border border-card-border p-3 flex-1">
            <div className="flex items-center gap-1.5 mb-3">
              <Star size={11} className="text-accent-text" />
              <span className="text-[10px] font-bold text-text-primary">Plantillas</span>
            </div>
            <div className="space-y-1.5">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => insertQuick(qr.text)}
                  className="w-full text-left bg-background rounded-xl px-2.5 py-2 hover:bg-accent-light transition-all cursor-pointer group"
                >
                  <p className="text-[10px] font-semibold text-text-primary group-hover:text-accent-text">{qr.label}</p>
                  <p className="text-[9px] text-text-muted leading-tight mt-0.5 line-clamp-2">{qr.text}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-accent-light rounded-2xl border border-accent-text/20 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock size={10} className="text-accent-text" />
              <span className="text-[10px] font-bold text-accent-text">Próximo check-in</span>
            </div>
            <p className="text-[11px] text-accent-text font-semibold">Alejandro J.</p>
            <p className="text-[10px] text-text-secondary mt-0.5">Hoy 15:00 · Requiere plan de recuperación</p>
          </div>
        </div>
      </div>
    </div>
  );
}
