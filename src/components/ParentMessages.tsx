"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Search,
  ChevronLeft,
  CheckCheck,
  Check,
  School,
  Users,
  GraduationCap,
  BookOpen,
  Calculator,
  Globe,
  Palette,
  Music,
  Dumbbell,
  Circle,
} from "lucide-react";
import { useLang } from "@/lib/i18n";

interface Message {
  id: string;
  from: "me" | "other";
  text: string;
  time: string;
  read: boolean;
}

interface Channel {
  id: string;
  type: "tutor" | "subject_teacher" | "school" | "parent_group";
  name: string;
  subtitle: string;
  avatar: string;
  avatarColor: string;
  icon?: typeof GraduationCap;
  online: boolean;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: Message[];
}

const initialChannels: Channel[] = [
  {
    id: "ana",
    type: "tutor",
    name: "Prof. Ana Martínez",
    subtitle: "Tutora principal · Lengua & Emprendimiento",
    avatar: "AM",
    avatarColor: "#2f574d",
    icon: GraduationCap,
    online: true,
    unread: 1,
    lastMessage: "Recuerda que el viernes es el Demo Day. ¡Lucas lo va a hacer genial!",
    lastTime: "10:15",
    messages: [
      { id: "1", from: "other", text: "Buenas, María. Quería comentarle que Lucas ha tenido un progreso muy sólido esta semana.", time: "Lun 9:30", read: true },
      { id: "2", from: "me", text: "¡Muchas gracias! Nos alegramos mucho. ¿Hay algo en lo que podamos ayudarle en casa?", time: "Lun 10:02", read: true },
      { id: "3", from: "other", text: "De momento va muy bien. Si pudieran repasar con él los conceptos de IVA y porcentajes esta noche, para mañana tiene una tarea de cálculos financieros.", time: "Lun 10:15", read: true },
      { id: "4", from: "me", text: "Perfecto, lo haremos. ¿A qué hora tiene esa tarea?", time: "Lun 10:20", read: true },
      { id: "5", from: "other", text: "A las 13:00. ¡Gracias por el apoyo, es fundamental!", time: "Lun 10:35", read: true },
      { id: "6", from: "other", text: "Recuerda que el viernes es el Demo Day. ¡Lucas lo va a hacer genial!", time: "Hoy 10:15", read: false },
    ],
  },
  {
    id: "carlos",
    type: "subject_teacher",
    name: "Prof. Carlos Ruiz",
    subtitle: "Matemáticas · STEM",
    avatar: "CR",
    avatarColor: "#34D399",
    icon: Calculator,
    online: false,
    unread: 0,
    lastMessage: "La hoja de cálculo de Lucas estaba muy bien estructurada.",
    lastTime: "Ayer",
    messages: [
      { id: "1", from: "other", text: "Hola María. La hoja de cálculo de Lucas estaba muy bien estructurada. Detectó sus propios errores antes de que yo se los señalara.", time: "Ayer 14:00", read: true },
      { id: "2", from: "me", text: "¡Qué buena noticia! En casa también le gusta mucho los números. ¿Algún área donde esté más flojo?", time: "Ayer 15:30", read: true },
      { id: "3", from: "other", text: "Los porcentajes en contexto real le cuestan un poco. Lo trabaja mañana en clase.", time: "Ayer 15:45", read: true },
    ],
  },
  {
    id: "elena",
    type: "subject_teacher",
    name: "Prof. Elena Vidal",
    subtitle: "Lengua Castellana · CLC",
    avatar: "EV",
    avatarColor: "#4F8EF7",
    icon: BookOpen,
    online: true,
    unread: 0,
    lastMessage: "El copy de la landing page de Lucas tenía una voz muy original.",
    lastTime: "Mar",
    messages: [
      { id: "1", from: "other", text: "El copy de la landing page de Lucas tenía una voz muy original. Se nota que lee.", time: "Mar 11:00", read: true },
    ],
  },
  {
    id: "marta",
    type: "subject_teacher",
    name: "Prof. Marta Soler",
    subtitle: "Arte & Cultura · CCEC",
    avatar: "MS",
    avatarColor: "#E879F9",
    icon: Palette,
    online: false,
    unread: 0,
    lastMessage: "La identidad visual mejoró mucho en la segunda iteración.",
    lastTime: "Lun",
    messages: [
      { id: "1", from: "other", text: "La identidad visual mejoró mucho en la segunda iteración. Le di feedback sobre jerarquía tipográfica.", time: "Lun 16:00", read: true },
    ],
  },
  {
    id: "school",
    type: "school",
    name: "Centro IES Málaga Norte",
    subtitle: "Secretaría · Administración",
    avatar: "🏫",
    avatarColor: "#6B7280",
    icon: School,
    online: true,
    unread: 2,
    lastMessage: "Recordatorio: reunión de padres el próximo jueves a las 18:00.",
    lastTime: "Hoy 8:00",
    messages: [
      { id: "1", from: "other", text: "Estimadas familias, les recordamos que el próximo jueves 27 de febrero a las 18:00 se celebrará la reunión de padres del trimestre.", time: "Hoy 8:00", read: false },
      { id: "2", from: "other", text: "Recordatorio: reunión de padres el próximo jueves a las 18:00. Rogamos confirmación de asistencia.", time: "Hoy 8:05", read: false },
    ],
  },
  {
    id: "parents",
    type: "parent_group",
    name: "Padres 1º ESO A",
    subtitle: "12 familias · Grupo de clase",
    avatar: "👨‍👩‍👧",
    avatarColor: "#FB923C",
    icon: Users,
    online: false,
    unread: 3,
    lastMessage: "¿Alguien sabe si el Demo Day es abierto al público?",
    lastTime: "Hoy 9:30",
    messages: [
      { id: "1", from: "other", text: "Buenos días a todos. ¿Alguien sabe si necesitamos traer algo para el Demo Day del viernes?", time: "Hoy 8:45", read: true },
      { id: "2", from: "other", text: "Creo que es solo el trabajo de los niños, no hay que traer nada.", time: "Hoy 9:00", read: true },
      { id: "3", from: "other", text: "¿Alguien sabe si el Demo Day es abierto al público? Me gustaría ir a verlo.", time: "Hoy 9:30", read: false },
      { id: "4", from: "other", text: "Sí, según la circular del cole las familias están invitadas desde las 11:00.", time: "Hoy 9:45", read: false },
      { id: "5", from: "other", text: "¡Genial! Allí estaremos todos entonces 😊", time: "Hoy 9:50", read: false },
    ],
  },
];

const typeConfig = {
  tutor: { bg: "bg-sidebar/10", border: "border-sidebar/20", badge: "bg-sidebar text-white" },
  subject_teacher: { bg: "bg-blue-50", border: "border-blue-100", badge: "bg-blue-500 text-white" },
  school: { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-500 text-white" },
  parent_group: { bg: "bg-orange-50", border: "border-orange-100", badge: "bg-orange-500 text-white" },
};

const typeLabel: Record<Channel["type"], Record<string, string>> = {
  tutor: { es: "Tutora", en: "Tutor" },
  subject_teacher: { es: "Profesor/a", en: "Teacher" },
  school: { es: "Centro", en: "School" },
  parent_group: { es: "Grupo padres", en: "Parent group" },
};

export default function ParentMessages() {
  const { lang, tr } = useLang();
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeId) ?? null;

  // Mark as read when opening a channel
  useEffect(() => {
    if (!activeId) return;
    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
  }, [activeId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannel?.messages.length]);

  const sendMessage = () => {
    if (!input.trim() || !activeId) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newMsg: Message = {
      id: String(Date.now()),
      from: "me",
      text: input.trim(),
      time: timeStr,
      read: false,
    };
    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: input.trim(), lastTime: timeStr }
          : c
      )
    );
    setInput("");
  };

  const totalUnread = channels.reduce((sum, c) => sum + c.unread, 0);

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  // Group channels
  const grouped = {
    tutor: filteredChannels.filter((c) => c.type === "tutor"),
    subject_teacher: filteredChannels.filter((c) => c.type === "subject_teacher"),
    school: filteredChannels.filter((c) => c.type === "school"),
    parent_group: filteredChannels.filter((c) => c.type === "parent_group"),
  };

  const groupLabel: Record<string, string> = {
    tutor: lang === "es" ? "Tutora principal" : "Main tutor",
    subject_teacher: lang === "es" ? "Profesores de asignatura" : "Subject teachers",
    school: lang === "es" ? "Centro educativo" : "School",
    parent_group: lang === "es" ? "Grupos de padres" : "Parent groups",
  };

  return (
    <div className="flex gap-0 bg-card rounded-2xl border border-card-border overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: 520 }}>
      {/* ── Sidebar: channel list ── */}
      <div className="w-[280px] flex-shrink-0 border-r border-card-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-card-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-text-primary">
              {lang === "es" ? "Mensajes" : "Messages"}
            </h2>
            {totalUnread > 0 && (
              <span className="text-[10px] font-bold bg-urgent text-white px-2 py-0.5 rounded-full">{totalUnread}</span>
            )}
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "es" ? "Buscar..." : "Search..."}
              className="w-full pl-8 pr-3 py-2 text-[12px] bg-background border border-card-border rounded-xl focus:outline-none focus:ring-1 focus:ring-sidebar/30 text-text-primary placeholder-text-muted"
            />
          </div>
        </div>

        {/* Channel groups */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(grouped).map(([groupKey, groupChannels]) => {
            if (groupChannels.length === 0) return null;
            return (
              <div key={groupKey}>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-4 pt-3 pb-1">
                  {groupLabel[groupKey]}
                </p>
                {groupChannels.map((ch) => {
                  const isActive = ch.id === activeId;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveId(ch.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                        isActive ? "bg-sidebar/8 border-r-2 border-sidebar" : "hover:bg-background"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                          style={{ backgroundColor: ch.avatarColor }}
                        >
                          {ch.avatar.length <= 2 ? ch.avatar : <span className="text-lg">{ch.avatar}</span>}
                        </div>
                        {ch.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-card" />
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-[12px] font-semibold truncate ${isActive ? "text-sidebar" : "text-text-primary"}`}>
                            {ch.name}
                          </span>
                          <span className="text-[10px] text-text-muted flex-shrink-0 ml-1">{ch.lastTime}</span>
                        </div>
                        <p className="text-[11px] text-text-muted truncate">{ch.lastMessage}</p>
                      </div>
                      {/* Unread badge */}
                      {ch.unread > 0 && (
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center mt-1">
                          {ch.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Chat area ── */}
      {activeChannel ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="px-5 py-3.5 border-b border-card-border flex items-center gap-3 bg-card">
            <button
              onClick={() => setActiveId(null)}
              className="text-text-muted hover:text-text-primary transition-colors cursor-pointer md:hidden"
            >
              <ChevronLeft size={18} />
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ backgroundColor: activeChannel.avatarColor }}
            >
              {activeChannel.avatar.length <= 2 ? activeChannel.avatar : <span className="text-lg">{activeChannel.avatar}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-text-primary truncate">{activeChannel.name}</p>
              <div className="flex items-center gap-1.5">
                {activeChannel.online && <Circle size={6} className="fill-success text-success" />}
                <p className="text-[11px] text-text-muted truncate">{activeChannel.subtitle}</p>
              </div>
            </div>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${typeConfig[activeChannel.type].badge}`}>
              {typeLabel[activeChannel.type][lang]}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 bg-background/40">
            {activeChannel.messages.map((msg) => {
              const isMe = msg.from === "me";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  {!isMe && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold mr-2 flex-shrink-0 self-end mb-0.5"
                      style={{ backgroundColor: activeChannel.avatarColor }}
                    >
                      {activeChannel.avatar.length <= 2 ? activeChannel.avatar : "?"}
                    </div>
                  )}
                  <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        isMe
                          ? "bg-sidebar text-white rounded-br-sm"
                          : "bg-card text-text-primary rounded-bl-sm border border-card-border shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-text-muted">{msg.time}</span>
                      {isMe && (
                        msg.read
                          ? <CheckCheck size={11} className="text-sidebar" />
                          : <Check size={11} className="text-text-muted" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-card-border bg-card flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={
                activeChannel.type === "parent_group"
                  ? (lang === "es" ? "Escribe al grupo..." : "Write to the group...")
                  : activeChannel.type === "school"
                  ? (lang === "es" ? "Escribe a la secretaría..." : "Write to school admin...")
                  : (lang === "es" ? `Escribe a ${activeChannel.name.split(" ")[1]}...` : `Message ${activeChannel.name.split(" ")[1]}...`)
              }
              className="flex-1 border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary placeholder-text-muted bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-sidebar hover:bg-sidebar-hover transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex items-center justify-center bg-background/30">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-sidebar/10 flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-sidebar" />
            </div>
            <p className="text-[15px] font-semibold text-text-primary mb-1">
              {lang === "es" ? "Selecciona una conversación" : "Select a conversation"}
            </p>
            <p className="text-[12px] text-text-muted">
              {lang === "es"
                ? "Conecta con profesores, el centro y otras familias"
                : "Connect with teachers, school, and other families"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
