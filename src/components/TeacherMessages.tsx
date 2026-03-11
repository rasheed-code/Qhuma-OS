"use client";

import { useState } from "react";
import { MessageSquare, Send, Search, Star, Clock, CheckCheck, ChevronRight, Sparkles, Users, Calendar, X, Bell } from "lucide-react";
import { useLang } from "@/lib/i18n";

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
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState("1");
  const [draft, setDraft] = useState("");

  // T27 — Grupo mode + plantillas avanzadas + mensajes programados
  const [grupoMode, setGrupoMode] = useState(false);
  const [grupoMensaje, setGrupoMensaje] = useState("");
  const [enviandoGrupo, setEnviandoGrupo] = useState(false);
  const [grupoEnviado, setGrupoEnviado] = useState(false);
  const [canceladoProgramado, setCanceladoProgramado] = useState<Set<string>>(new Set());

  const mensajesProgramados = [
    { id: "mp1", titulo: lbl("Recordatorio Demo Day", "Demo Day Reminder"), hora: lbl("Mañana · 9:00", "Tomorrow · 9:00"), destinatarios: 12, preview: lbl("Recordad que el jueves a las 10:00 es el Demo Day. Traed vuestras presentaciones listas y ensayad esta tarde.", "Remember that the Demo Day is on Thursday at 10:00. Bring your presentations ready and rehearse this afternoon.") },
    { id: "mp2", titulo: lbl("Alerta entrega pendiente", "Pending Submission Alert"), hora: lbl("Viernes · 16:00", "Friday · 16:00"), destinatarios: 4, preview: lbl("Quedan 48 horas para la entrega del modelo financiero. Los alumnos que aún no han subido su hoja de cálculo, por favor, contactad conmigo.", "There are 48 hours left to submit the financial model. Students who haven't uploaded their spreadsheet yet, please contact me.") },
  ];

  const plantillasAvanzadas = [
    {
      id: "pa1",
      label: lbl("Recordatorio Demo Day", "Demo Day Reminder"),
      asunto: lbl("Preparación Demo Day — Jueves 13 mar", "Demo Day Preparation — Thursday 13 Mar"),
      body: lbl(
        "Hola Lucas,\n\nTe escribo para recordarte que el Demo Day es el jueves a las 10:00. Es tu oportunidad de presentar el proyecto Airbnb Málaga ante el claustro y los inversores invitados.\n\nRecomendaciones: ensaya tu pitch al menos 2 veces esta tarde, prepara respuestas para preguntas sobre el modelo financiero y llega 10 minutos antes.\n\n¡Mucho ánimo! Confío en tu trabajo.\n\nProfa. Ana Martínez",
        "Hi Lucas,\n\nI'm writing to remind you that Demo Day is on Thursday at 10:00. This is your opportunity to present the Airbnb Málaga project to the faculty and invited investors.\n\nRecommendations: rehearse your pitch at least twice this afternoon, prepare answers for questions about the financial model, and arrive 10 minutes early.\n\nBest of luck! I trust in your work.\n\nProf. Ana Martínez"
      ),
    },
    {
      id: "pa2",
      label: lbl("Felicitación proyecto", "Project Congratulations"),
      asunto: lbl("¡Excelente progreso en Airbnb Málaga!", "Excellent progress on Airbnb Málaga!"),
      body: lbl(
        "Hola,\n\nQuería escribirte personalmente para reconocer el trabajo excepcional que estás haciendo en el proyecto. Tu última entrega demuestra una madurez analítica muy por encima de la media del grupo.\n\nEl equipo docente está muy orgulloso de tu evolución. Sigue así — este es exactamente el tipo de pensamiento emprendedor que el proyecto necesita.\n\nProfa. Ana Martínez",
        "Hi,\n\nI wanted to write to you personally to recognize the exceptional work you're doing on the project. Your last submission demonstrates analytical maturity well above the group average.\n\nThe teaching team is very proud of your progress. Keep it up — this is exactly the kind of entrepreneurial thinking the project needs.\n\nProf. Ana Martínez"
      ),
    },
    {
      id: "pa3",
      label: lbl("Alerta entrega pendiente", "Pending Submission Alert"),
      asunto: lbl("Entrega pendiente — acción requerida", "Pending submission — action required"),
      body: lbl(
        "Hola,\n\nTe escribo porque todavía no has entregado la tarea pendiente. El plazo vence en 48 horas y es importante que puedas presentarla para no perder la puntuación asociada.\n\nSi tienes alguna dificultad técnica, de tiempo o de comprensión, escríbeme hoy mismo y buscamos una solución juntos. Nadie se queda atrás.\n\nProfa. Ana Martínez",
        "Hi,\n\nI'm writing because you haven't yet submitted the pending assignment. The deadline is in 48 hours and it's important that you can present it so you don't lose the associated score.\n\nIf you have any technical, time, or comprehension difficulties, write to me today and we'll find a solution together. Nobody gets left behind.\n\nProf. Ana Martínez"
      ),
    },
  ];

  const [hoveredPlantilla, setHoveredPlantilla] = useState<string | null>(null);

  const filtered = conversations.filter((c) =>
    c.student.toLowerCase().includes(search.toLowerCase())
  );

  const active = conversations.find((c) => c.id === activeId)!;

  const handleSend = () => {
    if (!draft.trim()) return;
    setDraft("");
  };

  const insertQuick = (text: string) => {
    setDraft(text);
  };

  const handleEnviarGrupo = () => {
    if (!grupoMensaje.trim()) return;
    setEnviandoGrupo(true);
    setTimeout(() => {
      setEnviandoGrupo(false);
      setGrupoEnviado(true);
      setGrupoMensaje("");
      setTimeout(() => setGrupoEnviado(false), 4000);
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare size={18} className="text-accent-text" />
        <div>
          <h1 className="text-[22px] font-bold text-text-primary">{lbl("Mensajes", "Messages")}</h1>
          <p className="text-[13px] text-text-secondary">{lbl("Comunicación directa con alumnos · 1º ESO", "Direct communication with students · Year 7")}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* T27 — Modo grupo toggle */}
          <button
            onClick={() => { setGrupoMode(!grupoMode); setGrupoEnviado(false); }}
            className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              grupoMode ? "bg-sidebar text-accent" : "bg-background text-text-secondary border border-card-border hover:border-accent-text/30"
            }`}
          >
            <Users size={12} />
            {lbl("Mensaje a toda la clase", "Message to the whole class")}
          </button>
          <span className="text-[11px] bg-urgent text-white font-bold px-2 py-0.5 rounded-full">
            {conversations.reduce((s, c) => s + c.unread, 0)} {lbl("sin leer", "unread")}
          </span>
        </div>
      </div>

      {/* T27 — Mensajes programados */}
      {((): React.ReactNode => {
        const visibles = mensajesProgramados.filter((m) => !canceladoProgramado.has(m.id));
        if (visibles.length === 0) return null;
        return (
          <div className="mb-4 bg-warning-light rounded-2xl border border-warning/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={13} className="text-warning" />
              <span className="text-[12px] font-bold text-text-primary">{lbl("Mensajes programados", "Scheduled messages")}</span>
              <span className="ml-auto text-[10px] bg-warning text-white font-bold px-2 py-0.5 rounded-full">{visibles.length}</span>
            </div>
            <div className="space-y-2">
              {visibles.map((mp) => (
                <div key={mp.id} className="flex items-start gap-3 bg-card rounded-xl px-3 py-2.5 border border-card-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-semibold text-text-primary">{mp.titulo}</span>
                      <span className="text-[9px] text-text-muted">·</span>
                      <span className="text-[9px] font-medium text-warning">{mp.hora}</span>
                      <span className="text-[9px] bg-accent-light text-accent-text px-1.5 py-0.5 rounded-full font-bold ml-auto">{mp.destinatarios} {lbl("alumnos", "students")}</span>
                    </div>
                    <p className="text-[10px] text-text-muted line-clamp-1">{mp.preview}</p>
                  </div>
                  <button
                    onClick={() => setCanceladoProgramado(new Set([...canceladoProgramado, mp.id]))}
                    className="flex items-center gap-1 text-[9px] font-bold text-urgent hover:bg-urgent-light rounded-lg px-2 py-1 transition-all cursor-pointer flex-shrink-0"
                  >
                    <X size={10} />
                    {lbl("Cancelar", "Cancel")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* T27 — Modo Grupo */}
      {grupoMode && (
        <div className="mb-5 bg-card rounded-2xl border border-card-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-sidebar flex items-center justify-center flex-shrink-0">
              <Users size={14} className="text-accent" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-text-primary">{lbl("Mensaje a toda la clase", "Message to the whole class")}</p>
              <p className="text-[10px] text-text-muted">{lbl("Se enviará a los 12 alumnos de 1º ESO", "Will be sent to all 12 Year 7 students")}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              {["LG","ST","PR","MS","DL","AM","CR","LS","TH","CV","AP","VC"].map((a) => (
                <div key={a} className="w-5 h-5 rounded-full bg-sidebar text-white text-[6px] font-bold flex items-center justify-center" title={a}>{a}</div>
              ))}
            </div>
          </div>

          {grupoEnviado ? (
            <div className="flex items-center gap-3 bg-success-light rounded-xl px-4 py-3 border border-success/20">
              <CheckCheck size={16} className="text-success flex-shrink-0" />
              <p className="text-[13px] font-semibold text-success">{lbl("Enviado a 12 alumnos", "Sent to 12 students")} ✓</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <textarea
                value={grupoMensaje}
                onChange={(e) => setGrupoMensaje(e.target.value)}
                placeholder={lbl("Escribe el mensaje para toda la clase…", "Write a message for the whole class…")}
                rows={4}
                className="flex-1 text-[12px] text-text-primary bg-background rounded-xl border border-card-border px-3 py-2.5 outline-none focus:border-accent-text/40 resize-none placeholder:text-text-muted"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleEnviarGrupo}
                  disabled={!grupoMensaje.trim() || enviandoGrupo}
                  className="flex items-center gap-2 bg-sidebar text-accent text-[12px] font-bold px-4 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-40"
                >
                  {enviandoGrupo ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />{lbl("Enviando…", "Sending…")}</>
                  ) : (
                    <><Send size={14} />{lbl("Enviar a todos", "Send to all")}</>
                  )}
                </button>
                <button
                  onClick={() => setGrupoMode(false)}
                  className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-secondary px-3 py-1.5 rounded-xl border border-card-border hover:bg-background transition-all cursor-pointer"
                >
                  <X size={11} />
                  {lbl("Cancelar", "Cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 h-[560px]">
        {/* Conversation list */}
        <div className="w-60 flex-shrink-0 flex flex-col bg-card rounded-2xl border border-card-border overflow-hidden">
          <div className="p-3 border-b border-card-border">
            <div className="flex items-center gap-2 bg-background rounded-xl px-2.5 py-1.5">
              <Search size={12} className="text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lbl("Buscar alumno…", "Search student…")}
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
                {active.status === "excelling" ? lbl("✨ Destacado", "✨ Excelling") : active.status === "needs_attention" ? lbl("⚠️ Necesita apoyo", "⚠️ Needs support") : lbl("✓ En curso", "✓ On track")}
              </p>
            </div>
            <button className="ml-auto text-[10px] text-text-secondary border border-card-border rounded-xl px-2.5 py-1 flex items-center gap-1.5 hover:border-accent-text/30 transition-all cursor-pointer">
              {lbl("Ver perfil", "View profile")} <ChevronRight size={10} />
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
              <span className="text-[9px] text-text-muted font-medium uppercase tracking-wide">{lbl("Respuestas rápidas", "Quick replies")}</span>
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
                placeholder={lbl("Escribe un mensaje…", "Write a message…")}
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

        {/* Right panel: all quick replies + T27 plantillas avanzadas */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-card rounded-2xl border border-card-border p-3 flex-1 overflow-y-auto">
            <div className="flex items-center gap-1.5 mb-3">
              <Star size={11} className="text-accent-text" />
              <span className="text-[10px] font-bold text-text-primary">{lbl("Plantillas rápidas", "Quick templates")}</span>
            </div>
            <div className="space-y-1.5 mb-3">
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

            {/* T27 — Plantillas avanzadas */}
            <div className="border-t border-card-border pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={10} className="text-accent-text" />
                <span className="text-[9px] font-bold text-text-primary uppercase tracking-wide">{lbl("Plantillas avanzadas", "Advanced templates")}</span>
              </div>
              <div className="space-y-1.5">
                {plantillasAvanzadas.map((pa) => (
                  <div key={pa.id} className="relative">
                    <button
                      onClick={() => setDraft(pa.body)}
                      onMouseEnter={() => setHoveredPlantilla(pa.id)}
                      onMouseLeave={() => setHoveredPlantilla(null)}
                      className="w-full text-left bg-accent-light rounded-xl px-2.5 py-2 hover:bg-accent/30 transition-all cursor-pointer group border border-accent/20"
                    >
                      <p className="text-[10px] font-semibold text-accent-text group-hover:underline">{pa.label}</p>
                      <p className="text-[9px] text-text-muted leading-tight mt-0.5 line-clamp-1">{pa.asunto}</p>
                    </button>
                    {hoveredPlantilla === pa.id && (
                      <div className="absolute right-full top-0 mr-2 w-64 bg-card border border-card-border rounded-xl p-3 z-10 shadow-sm">
                        <p className="text-[10px] font-bold text-accent-text mb-1">{pa.label}</p>
                        <p className="text-[10px] font-semibold text-text-primary mb-1.5">{pa.asunto}</p>
                        <p className="text-[9px] text-text-muted leading-relaxed line-clamp-6">{pa.body}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-accent-light rounded-2xl border border-accent-text/20 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock size={10} className="text-accent-text" />
              <span className="text-[10px] font-bold text-accent-text">{lbl("Próximo check-in", "Next check-in")}</span>
            </div>
            <p className="text-[11px] text-accent-text font-semibold">Alejandro J.</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{lbl("Hoy 15:00 · Requiere plan de recuperación", "Today 15:00 · Requires recovery plan")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
