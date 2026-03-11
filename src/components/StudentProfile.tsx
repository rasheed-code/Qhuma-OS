"use client";

import { useState } from "react";
import {
  Coins,
  Zap,
  Flame,
  Trophy,
  FileText,
  Users,
  Star,
  Lock,
  Swords,
  Timer,
  Brain,
  Music,
  Globe,
  Activity,
  Leaf,
  MessageSquare,
  Clock,
  ChevronRight,
  CheckCircle2,
  Send,
  RefreshCw,
} from "lucide-react";
import { currentStudent } from "@/data/students";
import { competencies } from "@/data/competencies";
import { taskEvidence } from "@/data/evidence";
import { playerLevel, currentTribe, achievements } from "@/data/gamification";
import EvidencePreviewSwitch from "@/components/EvidencePreview";
import { useLang } from "@/lib/i18n";

const inteligencias = [
  { clave: "linguistica",    nombre: "Lingüística",          nivel: 78, descripcion: "Expresión escrita, argumentación, narrativa propia en el proyecto",     icon: MessageSquare },
  { clave: "logica",         nombre: "Lógico-Matemática",    nivel: 85, descripcion: "Análisis de datos, resolución de problemas, patrones financieros",       icon: Activity },
  { clave: "espacial",       nombre: "Espacial",             nivel: 62, descripcion: "Diseño visual, mapas de conceptos, maquetación de landing page",         icon: Globe },
  { clave: "musical",        nombre: "Musical",              nivel: 45, descripcion: "Ritmo en la presentación, patrones sonoros, expresión auditiva",         icon: Music },
  { clave: "corporal",       nombre: "Corporal-Cinestésica", nivel: 71, descripcion: "Aprendizaje práctico, maker studio, construcción de prototipos físicos",  icon: Zap },
  { clave: "interpersonal",  nombre: "Interpersonal",        nivel: 90, descripcion: "Trabajo en equipo, empatía, liderazgo en el pitch final",                icon: Users },
  { clave: "intrapersonal",  nombre: "Intrapersonal",        nivel: 68, descripcion: "Autoconocimiento, gestión emocional, reflexión crítica en error log",    icon: Brain },
  { clave: "naturalista",    nombre: "Naturalista",          nivel: 53, descripcion: "Observación del entorno, sostenibilidad, patrones naturales del barrio",  icon: Leaf },
];

const achievementIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Swords,
  Timer,
  Star,
  Users,
  Coins,
  Zap,
};

export default function StudentProfile() {
  const levelPercent = Math.round(
    (playerLevel.xpCurrent / playerLevel.xpRequired) * 100
  );
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  // S28 — Mi red de apoyo
  const [mentorMensaje, setMentorMensaje] = useState<Record<string, string>>({});
  const [enviandoMentor, setEnviandoMentor] = useState<string | null>(null);
  const [mentorEnviado, setMentorEnviado] = useState<Set<string>>(new Set());
  const [mentorFormOpen, setMentorFormOpen] = useState<string | null>(null);

  const handlePedirConsejo = (mentorId: string) => {
    const msg = mentorMensaje[mentorId] ?? "";
    if (!msg.trim() || enviandoMentor) return;
    setEnviandoMentor(mentorId);
    setTimeout(() => {
      setMentorEnviado((prev) => new Set([...prev, mentorId]));
      setEnviandoMentor(null);
      setMentorFormOpen(null);
      setMentorMensaje((prev) => ({ ...prev, [mentorId]: "" }));
    }, 1200);
  };

  return (
    <div>
      {/* Hero section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-sidebar flex items-center justify-center text-white text-[24px] font-bold flex-shrink-0">
          {currentStudent.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[28px] font-semibold text-text-primary leading-tight">{currentStudent.name}</h1>
            <span className="text-[13px] text-text-muted">{currentStudent.class}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 bg-accent-light px-3 py-1 rounded-full">
              <Trophy size={12} className="text-accent-text" />
              <span className="text-[11px] font-semibold text-accent-text">
                Lvl {playerLevel.level} — {playerLevel.title}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-warning-light px-3 py-1 rounded-full">
              <Flame size={12} className="text-warning" />
              <span className="text-[11px] font-semibold text-warning">
                {currentStudent.streak}{lbl(" días de racha", "-day streak")}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-accent-light px-3 py-1 rounded-full">
              <Coins size={12} className="text-accent-text" />
              <span className="text-[11px] font-semibold text-accent-text">
                {currentStudent.qcoins} Q-Coins
              </span>
            </div>
          </div>
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-text-muted">{lbl("Siguiente:", "Next:")} {playerLevel.nextTitle}</span>
              <span className="text-[11px] text-text-muted">{playerLevel.xpCurrent}/{playerLevel.xpRequired} XP</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-background">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sidebar to-accent-dark transition-all duration-700"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <div className="flex items-center gap-1.5">
            <Coins size={13} className="text-accent-text" />
            <span className="text-[11px] text-text-muted font-medium">Q-Coins</span>
          </div>
          <span className="text-[28px] font-bold text-text-primary leading-none">{currentStudent.qcoins}</span>
        </div>
        <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-accent-text" />
            <span className="text-[11px] text-text-muted font-medium">XP Total</span>
          </div>
          <span className="text-[28px] font-bold text-text-primary leading-none">{currentStudent.xpTotal.toLocaleString()}</span>
        </div>
        <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <div className="flex items-center gap-1.5">
            <FileText size={13} className="text-accent-text" />
            <span className="text-[11px] text-text-muted font-medium">{lbl("Evidencias", "Evidences")}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-text-primary leading-none">{currentStudent.evidencesSubmitted}</span>
            <span className="text-[13px] text-text-muted">/{currentStudent.evidencesTotal}</span>
          </div>
        </div>
        <div className="bg-sidebar rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <div className="flex items-center gap-1.5">
            <Flame size={13} className="text-warning" />
            <span className="text-[11px] text-white/50 font-medium">{lbl("Racha", "Streak")}</span>
          </div>
          <div>
            <span className="text-[28px] font-bold text-white leading-none">{currentStudent.streak}</span>
            <span className="text-[11px] text-white/40 ml-1">{lbl("días", "days")}</span>
          </div>
        </div>
      </div>

      {/* My Tribe */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users size={16} className="text-text-primary" />
          <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Mi Tribu", "My Tribe")}</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-accent-light text-accent-text text-[11px] font-semibold">
            {currentTribe.name}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {currentTribe.members.map((member) => (
            <div
              key={member.id}
              className={`bg-background rounded-2xl p-4 flex flex-col items-center text-center ${
                member.isCurrentUser ? "ring-2 ring-accent-light" : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold mb-2 ${
                  member.isCurrentUser
                    ? "bg-accent text-sidebar"
                    : "bg-white text-text-secondary"
                }`}
              >
                {member.avatar}
              </div>
              <span className="text-[13px] font-semibold text-text-primary">{member.name}</span>
              <span className="text-[11px] text-text-muted">{member.role}</span>
              {member.badge && (
                <div className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-warning-light">
                  <Star size={10} className="text-warning fill-warning" />
                  <span className="text-[9px] font-semibold text-warning">{member.badge}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Portfolio */}
      <div className="mb-8">
        <h2 className="text-[20px] font-semibold text-text-primary mb-4">{lbl("Portafolio de evidencias", "Evidence Portfolio")}</h2>
        <div className="grid grid-cols-3 gap-4">
          {taskEvidence.map((ev) => (
            <div key={ev.taskId} className="bg-card rounded-2xl p-4 border border-card-border">
              <div className="mb-3">
                <EvidencePreviewSwitch evidence={ev} />
              </div>
              <span className="text-[12px] font-semibold text-text-primary block leading-snug mb-1">
                {ev.title}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-background text-text-muted capitalize">
                {ev.type.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* S28: Mi red de apoyo */}
      {(() => {
        const mentores = [
          {
            id: "martinez",
            nombre: "Profesora Martínez",
            rol: lbl("Tutora QHUMA", "QHUMA Tutor"),
            especialidades: ["CE", "STEM"],
            ultimoMensaje: lbl("«Revisa el modelo financiero — el margen está mal calculado.»", "«Review the financial model — margin miscalculated.»"),
            tiempoRespuesta: lbl("Responde en ~1h", "Replies in ~1h"),
            initials: "AM",
            bgColor: "bg-sidebar",
          },
          {
            id: "blanco",
            nombre: "Jorge Blanco",
            rol: lbl("Inversor externo", "External Investor"),
            especialidades: ["CE", "CCEC"],
            ultimoMensaje: lbl("«Buen trabajo con la proyección. Necesitas tracción de mercado.»", "«Good projection work. You need market traction.»"),
            tiempoRespuesta: lbl("Responde en ~2h", "Replies in ~2h"),
            initials: "JB",
            bgColor: "bg-accent-text",
          },
          {
            id: "rivas",
            nombre: "María Rivas",
            rol: lbl("Alumni QHUMA", "QHUMA Alumni"),
            especialidades: ["CLC", "CCEC"],
            ultimoMensaje: lbl("«Yo también usé Airbnb en mi proyecto. Te puedo pasar mis notas.»", "«I also used Airbnb for my project. I can share my notes.»"),
            tiempoRespuesta: lbl("Responde en ~3h", "Replies in ~3h"),
            initials: "MR",
            bgColor: "bg-warning",
          },
        ];

        const specialtyColors: Record<string, string> = {
          CE: "bg-success-light text-success",
          STEM: "bg-accent-light text-accent-text",
          CLC: "bg-background text-text-secondary border border-card-border",
          CCEC: "bg-warning-light text-warning",
          CD: "bg-urgent-light text-urgent",
        };

        return (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users size={16} className="text-text-primary" />
              <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Mi red de apoyo", "My support network")}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-accent-light text-accent-text text-[11px] font-semibold">3 {lbl("mentores", "mentors")}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mentores.map((mentor) => {
                const isEnviado = mentorEnviado.has(mentor.id);
                const isOpen = mentorFormOpen === mentor.id;
                return (
                  <div key={mentor.id} className="bg-card rounded-2xl p-4 border border-card-border">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full ${mentor.bgColor} text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0`}>
                        {mentor.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-semibold text-text-primary block truncate">{mentor.nombre}</span>
                        <span className="text-[10px] text-text-muted">{mentor.rol}</span>
                      </div>
                    </div>

                    {/* Specialty badges */}
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {mentor.especialidades.map((sp) => (
                        <span key={sp} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${specialtyColors[sp] ?? "bg-background text-text-muted"}`}>
                          {sp}
                        </span>
                      ))}
                    </div>

                    {/* Last message */}
                    <p className="text-[10px] text-text-secondary leading-relaxed italic mb-2 truncate">
                      {mentor.ultimoMensaje}
                    </p>

                    {/* Response time */}
                    <div className="flex items-center gap-1 mb-3">
                      <Clock size={9} className="text-text-muted" />
                      <span className="text-[9px] text-text-muted">{mentor.tiempoRespuesta}</span>
                    </div>

                    {/* Pedir consejo button or form */}
                    {isEnviado ? (
                      <div className="flex items-center gap-1.5 bg-success-light rounded-xl px-3 py-2">
                        <CheckCircle2 size={12} className="text-success" />
                        <span className="text-[10px] font-semibold text-success">{lbl("¡Mensaje enviado!", "Message sent!")}</span>
                      </div>
                    ) : isOpen ? (
                      <div>
                        <textarea
                          value={mentorMensaje[mentor.id] ?? ""}
                          onChange={(e) => setMentorMensaje((prev) => ({ ...prev, [mentor.id]: e.target.value }))}
                          placeholder={lbl("Escribe tu pregunta o duda…", "Write your question…")}
                          rows={3}
                          className="w-full text-[11px] bg-background border border-card-border rounded-xl px-3 py-2 text-text-primary resize-none mb-2 focus:outline-none focus:border-accent-text/40"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePedirConsejo(mentor.id)}
                            disabled={!(mentorMensaje[mentor.id] ?? "").trim() || !!enviandoMentor}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-sidebar text-white text-[10px] font-bold py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50"
                          >
                            {enviandoMentor === mentor.id
                              ? <><RefreshCw size={10} className="animate-spin" /> {lbl("Enviando…", "Sending…")}</>
                              : <><Send size={10} /> {lbl("Enviar", "Send")}</>}
                          </button>
                          <button
                            onClick={() => setMentorFormOpen(null)}
                            className="text-[10px] text-text-muted border border-card-border px-3 py-1.5 rounded-xl cursor-pointer hover:border-accent-text/30 transition-all"
                          >
                            {lbl("Cancelar", "Cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMentorFormOpen(mentor.id)}
                        className="w-full flex items-center justify-center gap-1.5 bg-accent-light text-accent-text text-[10px] font-bold py-2 rounded-xl cursor-pointer hover:bg-accent/30 transition-all"
                      >
                        <MessageSquare size={11} />
                        {lbl("Pedir consejo", "Ask for advice")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Competency Overview */}
      <div className="mb-8">
        <h2 className="text-[20px] font-semibold text-text-primary mb-4">{lbl("Competencias", "Competencies")}</h2>
        <div className="grid grid-cols-4 gap-3">
          {competencies.map((comp) => (
            <div key={comp.key} className="bg-background rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comp.color }} />
                <span className="text-[11px] font-semibold text-text-primary">{comp.shortName}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${comp.progress}%`, backgroundColor: comp.color }}
                />
              </div>
              <span className="text-[10px] text-text-muted mt-1 block">{comp.progress}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Perfil de Inteligencias — Gardner */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain size={16} className="text-text-primary" />
          <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Perfil de Inteligencias", "Intelligence Profile")}</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-accent-light text-accent-text text-[11px] font-semibold">Gardner</span>
        </div>
        <p className="text-[12px] text-text-muted mb-5 leading-relaxed">
          {lbl("Construido a través de 30 días de interacción activa, no de un test inicial. Cada dimensión refleja cómo aprendes y resuelves problemas en tu proyecto.", "Built through 30 days of active interaction, not an initial test. Each dimension reflects how you learn and solve problems in your project.")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {inteligencias.map((intel) => {
            const Icon = intel.icon;
            return (
              <div key={intel.clave} className="bg-background rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-accent-text" />
                    </div>
                    <span className="text-[12px] font-semibold text-text-primary">{intel.nombre}</span>
                  </div>
                  <span className="text-[12px] font-bold text-accent-text">{intel.nivel}%</span>
                </div>
                <div className="h-2 rounded-full bg-white overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-sidebar to-accent"
                    style={{ width: `${intel.nivel}%` }}
                  />
                </div>
                <p className="text-[10px] text-text-muted leading-snug">{intel.descripcion}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-[20px] font-semibold text-text-primary mb-4">{lbl("Logros", "Achievements")}</h2>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {achievements.map((ach) => {
            const Icon = achievementIconMap[ach.icon] || Trophy;
            return (
              <div key={ach.id} className="flex flex-col items-center flex-shrink-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1.5 ${
                  ach.unlocked ? "bg-accent-light" : "bg-background"
                }`}>
                  {ach.unlocked ? (
                    <Icon size={22} className="text-accent-text" />
                  ) : (
                    <Lock size={18} className="text-text-muted" />
                  )}
                </div>
                <span className={`text-[10px] font-semibold text-center leading-tight ${
                  ach.unlocked ? "text-text-primary" : "text-text-muted"
                }`}>
                  {ach.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
