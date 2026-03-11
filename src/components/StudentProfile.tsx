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
  BookOpen,
  Cpu,
  TrendingUp,
  Sparkles,
  Briefcase,
  MapPin,
  AlertCircle,
  Copy,
  Download,
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

  // S37 — Carta de presentación profesional
  const [cartaProfesional, setCartaProfesional] = useState<string | null>(null);
  const [generandoCarta, setGenerandoCarta] = useState(false);
  const [cartaCopiada, setCartaCopiada] = useState(false);
  const [cartaDescargada, setCartaDescargada] = useState(false);

  // C34 — Plan de aprendizaje T2
  const [planT2Generado, setPlanT2Generado] = useState<string[] | null>(null);
  const [generandoPlanT2, setGenerandoPlanT2] = useState(false);
  const [planT2Comprometido, setPlanT2Comprometido] = useState(false);

  // C31 — Metacognición
  const [metaEstrategia, setMetaEstrategia] = useState<string | null>(null);
  const [generandoMeta, setGenerandoMeta] = useState(false);

  // C30 — Diario socrático
  const [diarioHoy, setDiarioHoy] = useState("");
  const [diarioGuardado, setDiarioGuardado] = useState(false);

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

      {/* C30 — Diario socrático */}
      {(() => {
        const entradas = [
          {
            fecha: lbl("Lun 9 mar", "Mon Mar 9"),
            pregunta: lbl("¿Qué asumí hoy que resultó ser falso?", "What did I assume today that turned out to be false?"),
            respuesta: lbl(
              "Asumí que todos mis compañeros entendían el modelo financiero, pero al hacer el ensayo descubrí que Pablo no sabía calcular el punto de equilibrio. Me sirvió para replantear cómo explicamos los números en el pitch.",
              "I assumed all my classmates understood the financial model, but during rehearsal I found Pablo didn't know how to calculate break-even. It made me rethink how we explain the numbers in our pitch."
            ),
            ia: lbl("¿Cómo cambiarías tu siguiente explicación para que sea más accesible?", "How would you change your next explanation to make it more accessible?"),
          },
          {
            fecha: lbl("Mié 4 mar", "Wed Mar 4"),
            pregunta: lbl("¿Qué evidencia contradice mi idea inicial del proyecto?", "What evidence contradicts my initial project idea?"),
            respuesta: lbl(
              "Pensé que el precio de 3€ era perfecto, pero la encuesta de campo mostró que el 60% pagaría máximo 2€. Tuvimos que replantear los costes o buscar volumen.",
              "I thought €3 was the perfect price, but the field survey showed 60% would pay max €2. We had to rethink costs or pursue volume."
            ),
            ia: lbl("¿Qué estructura de costes te permitiría ser rentable a 2€ por unidad?", "What cost structure would allow you to be profitable at €2 per unit?"),
          },
          {
            fecha: lbl("Vie 28 feb", "Fri Feb 28"),
            pregunta: lbl("¿Qué haría diferente si empezara el proyecto de nuevo?", "What would I do differently if starting the project over?"),
            respuesta: lbl(
              "Haría el estudio de mercado antes de diseñar el producto. Perdimos dos semanas haciendo un logo para algo que luego cambió completamente.",
              "I'd do the market study before designing the product. We lost two weeks making a logo for something that completely changed afterward."
            ),
            ia: lbl("¿Cómo documentarías esa lección para el siguiente trimestre?", "How would you document that lesson for next trimester?"),
          },
        ];

        const promptsHoy = [
          lbl("¿Qué momento de hoy te hizo dudar de una creencia que tenías?", "What moment today made you question a belief you held?"),
          lbl("¿Qué pregunta dejaste sin responder hoy y por qué?", "What question did you leave unanswered today and why?"),
          lbl("¿Qué harías diferente si repitieras esta sesión de trabajo?", "What would you do differently if you repeated today's work session?"),
        ];
        const promptIdx = (new Date().getDate()) % promptsHoy.length;
        const promptHoy = promptsHoy[promptIdx];

        return (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-accent-text" />
              <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Diario socrático", "Socratic Journal")}</h2>
            </div>

            <div className="bg-card rounded-2xl border border-card-border p-5 space-y-5">
              {/* Entrada de hoy */}
              <div>
                <p className="text-[11px] font-semibold text-accent-text mb-2 uppercase tracking-wide">
                  {lbl("Pregunta de hoy", "Today's question")}
                </p>
                <p className="text-[13px] font-medium text-text-primary mb-3 leading-snug">
                  {promptHoy}
                </p>
                <textarea
                  value={diarioHoy}
                  onChange={(e) => { setDiarioHoy(e.target.value); setDiarioGuardado(false); }}
                  placeholder={lbl("Escribe tu reflexión aquí…", "Write your reflection here…")}
                  rows={3}
                  className="w-full text-[12px] bg-background border border-card-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted outline-none focus:border-accent-text/40 resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-text-muted">
                    {diarioHoy.length > 0
                      ? lbl(`${diarioHoy.length} caracteres`, `${diarioHoy.length} characters`)
                      : lbl("Mínimo 3 líneas para desbloquear seguimiento IA", "Min 3 lines to unlock AI follow-up")}
                  </span>
                  <button
                    disabled={diarioHoy.trim().length < 20 || diarioGuardado}
                    onClick={() => setDiarioGuardado(true)}
                    className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-bold px-4 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {diarioGuardado
                      ? <><CheckCircle2 size={11} />{lbl("Guardado", "Saved")}</>
                      : <><Send size={11} />{lbl("Guardar", "Save")}</>}
                  </button>
                </div>
                {diarioGuardado && (
                  <div className="mt-3 bg-accent-light rounded-xl p-3 border border-accent-text/15">
                    <p className="text-[10px] font-semibold text-accent-text mb-1">
                      {lbl("Pregunta de seguimiento IA", "AI follow-up question")}
                    </p>
                    <p className="text-[12px] text-text-primary leading-snug">
                      {lbl(
                        "Interesante reflexión. ¿Puedes identificar un momento concreto donde esta lección podría haber cambiado una decisión pasada?",
                        "Interesting reflection. Can you identify a specific moment where this lesson could have changed a past decision?"
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Entradas anteriores */}
              <div>
                <p className="text-[11px] font-semibold text-text-muted mb-3 uppercase tracking-wide">
                  {lbl("Entradas anteriores", "Previous entries")}
                </p>
                <div className="space-y-3">
                  {entradas.map((e, i) => (
                    <div key={i} className="border border-card-border rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-text-muted">{e.fecha}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-accent-text mb-1">{e.pregunta}</p>
                      <p className="text-[11px] text-text-secondary leading-snug mb-2">{e.respuesta}</p>
                      <div className="bg-accent-light rounded-lg px-3 py-2">
                        <p className="text-[10px] text-accent-text">
                          <span className="font-semibold">{lbl("IA: ", "AI: ")}</span>{e.ia}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* C31 — Metacognición */}
      {(() => {
        const franjas = [
          { hora: "8–9h",   actividad: 62, label: lbl("Antes de clase", "Before class") },
          { hora: "9–11h",  actividad: 88, label: lbl("Mañana temprana", "Early morning") },
          { hora: "11–13h", actividad: 74, label: lbl("Media mañana", "Mid morning") },
          { hora: "16–18h", actividad: 91, label: lbl("Tarde", "Afternoon") },
          { hora: "18–20h", actividad: 55, label: lbl("Tarde-noche", "Evening") },
          { hora: "20–22h", actividad: 38, label: lbl("Noche", "Night") },
        ];
        const maxActividad = Math.max(...franjas.map(f => f.actividad));
        const mejorFranja = franjas.reduce((a, b) => a.actividad > b.actividad ? a : b);

        const ratioSocratico = 74; // % de sesiones donde la IA lanzó pregunta de retorno
        const ratioSolo     = 68; // % tareas completadas en modo individual
        const ratioGrupo    = 32;
        const erroresConvertidos = 5; // de 7 errores, 5 se marcaron como "superado"

        const handleGenerarEstrategia = async () => {
          setGenerandoMeta(true);
          try {
            const res = await fetch("/api/tutor-chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode: "narrativa",
                message: `Genera una estrategia de aprendizaje personalizada en 3 frases cortas para Lucas García. Sus datos de metacognición: mejor franja horaria de estudio ${mejorFranja.hora} (${mejorFranja.actividad}% actividad), ratio socrático ${ratioSocratico}% (frecuencia con la que profundiza antes de pedir respuesta), ${erroresConvertidos}/7 errores convertidos en aprendizaje. Proyecto activo: Casa Limón (Airbnb Málaga). Demo Day: viernes 13 mar. Sé directo y específico.`,
                history: [],
              }),
            });
            if (res.ok) {
              const data = await res.json();
              setMetaEstrategia((data.reply as string).trim());
              setGenerandoMeta(false); return;
            }
          } catch { /* noop */ }
          setMetaEstrategia(lbl(
            `Lucas, tu pico de rendimiento es a las ${mejorFranja.hora}. Usa esa franja para las tareas STEM y CE del proyecto. Tu ratio socrático del ${ratioSocratico}% indica que procesas bien la información antes de pedir ayuda — una fortaleza que debes potenciar en el pitch del Demo Day.`,
            `Lucas, your performance peak is at ${mejorFranja.hora}. Use that window for STEM and CE tasks on the project. Your ${ratioSocratico}% Socratic ratio shows you process information well before asking for help — a strength to highlight in your Demo Day pitch.`
          ));
          setGenerandoMeta(false);
        };

        return (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={16} className="text-accent-text" />
              <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Mi metacognición", "My Metacognition")}</h2>
            </div>

            <div className="bg-card rounded-2xl border border-card-border p-5 space-y-5">
              {/* ¿Cuándo aprendo mejor? */}
              <div>
                <p className="text-[11px] font-semibold text-text-muted mb-3 uppercase tracking-wide">
                  {lbl("¿Cuándo rindo mejor?", "When do I perform best?")}
                </p>
                <div className="flex items-end gap-1.5 h-20">
                  {franjas.map((f) => {
                    const hPct = (f.actividad / maxActividad) * 100;
                    const isBest = f.hora === mejorFranja.hora;
                    return (
                      <div key={f.hora} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[9px] font-bold ${isBest ? "text-accent-text" : "text-text-muted"}`}>
                          {f.actividad}%
                        </span>
                        <div
                          className={`w-full rounded-t-lg transition-all ${isBest ? "bg-accent-text" : "bg-accent-text/30"}`}
                          style={{ height: `${hPct * 0.65}px` }}
                        />
                        <span className="text-[8px] text-text-muted text-center leading-tight">{f.hora}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-text-muted mt-2">
                  {lbl(`Pico de rendimiento: ${mejorFranja.hora} (${mejorFranja.actividad}% actividad)`, `Performance peak: ${mejorFranja.hora} (${mejorFranja.actividad}% activity)`)}
                </p>
              </div>

              {/* Ratios */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-accent-light rounded-xl p-3 text-center">
                  <div className="text-[22px] font-bold text-accent-text">{ratioSocratico}%</div>
                  <div className="text-[9px] text-accent-text leading-tight">{lbl("Ratio socrático", "Socratic ratio")}</div>
                  <div className="text-[8px] text-text-muted mt-0.5">{lbl("reflexiona antes de pedir", "reflects before asking")}</div>
                </div>
                <div className="bg-success-light rounded-xl p-3 text-center">
                  <div className="text-[22px] font-bold text-success">{erroresConvertidos}/7</div>
                  <div className="text-[9px] text-success leading-tight">{lbl("Errores superados", "Errors overcome")}</div>
                  <div className="text-[8px] text-text-muted mt-0.5">{lbl("convertidos en aprendizaje", "turned into learning")}</div>
                </div>
                <div className="bg-background rounded-xl p-3 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[16px] font-bold text-text-primary">{ratioSolo}%</span>
                    <span className="text-[11px] text-text-muted">/</span>
                    <span className="text-[16px] font-bold text-text-primary">{ratioGrupo}%</span>
                  </div>
                  <div className="text-[9px] text-text-muted leading-tight">{lbl("Solo / Equipo", "Solo / Team")}</div>
                  <div className="text-[8px] text-text-muted mt-0.5">{lbl("distribución de trabajo", "work distribution")}</div>
                </div>
              </div>

              {/* AI strategy */}
              {metaEstrategia ? (
                <div className="bg-sidebar rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp size={12} className="text-accent" />
                    <span className="text-[10px] font-bold text-accent">{lbl("Estrategia personalizada IA", "AI Personalized Strategy")}</span>
                  </div>
                  <p className="text-[12px] text-white/90 leading-relaxed">{metaEstrategia}</p>
                  <button
                    onClick={() => setMetaEstrategia(null)}
                    className="mt-3 text-[10px] text-accent/70 hover:text-accent cursor-pointer"
                  >
                    {lbl("Regenerar", "Regenerate")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerarEstrategia}
                  disabled={generandoMeta}
                  className="w-full flex items-center justify-center gap-2 bg-accent-light border border-dashed border-accent-text/30 text-accent-text text-[12px] font-semibold py-3 rounded-xl cursor-pointer hover:brightness-95 transition-all disabled:opacity-50"
                >
                  {generandoMeta ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  {generandoMeta ? lbl("Generando estrategia...", "Generating strategy...") : lbl("Generar estrategia de aprendizaje IA", "Generate AI learning strategy")}
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── S35: Industrias Vivas — mi huella profesional ─────────────────── */}
      {(() => {
        const industrias = [
          {
            id: "turismo",
            nombre: lbl("Turismo y Hospitalidad", "Tourism & Hospitality"),
            conexion: lbl("Tu proyecto Airbnb Málaga te ha dado experiencia real en gestión de propiedades, atención al cliente y revenue management.", "Your Airbnb Málaga project gave you real experience in property management, customer service, and revenue management."),
            roles: [
              { titulo: lbl("Revenue Manager", "Revenue Manager"), empresa: "Booking.com, Airbnb, Hoteles", match: 87 },
              { titulo: lbl("Gestor de propiedades", "Property Manager"), empresa: lbl("Agencias inmobiliarias", "Real estate agencies"), match: 82 },
              { titulo: lbl("Consultor turístico", "Tourism Consultant"), empresa: lbl("Ayuntamientos, tour ops.", "City halls, tour operators"), match: 71 },
            ],
            skills: ["CE", "STEM", "CD"],
            color: "bg-sidebar",
            textColor: "text-white",
            badge: lbl("Tu proyecto activo", "Your active project"),
          },
          {
            id: "fintech",
            nombre: lbl("Finanzas y FinTech", "Finance & FinTech"),
            conexion: lbl("Tu modelo financiero de Casa Limón (P&L, ROI, márgenes) es exactamente lo que hacen los analistas financieros junior todos los días.", "Your Casa Limón financial model (P&L, ROI, margins) is exactly what junior financial analysts do every day."),
            roles: [
              { titulo: lbl("Analista financiero", "Financial Analyst"), empresa: lbl("Bancos, startups FinTech", "Banks, FinTech startups"), match: 74 },
              { titulo: lbl("Emprendedor", "Entrepreneur"), empresa: lbl("Startups, QHUMA Capital", "Startups, QHUMA Capital"), match: 90 },
              { titulo: lbl("Gestor de inversiones", "Investment Manager"), empresa: lbl("Fondos, family offices", "Funds, family offices"), match: 61 },
            ],
            skills: ["CE", "STEM", "CPSAA"],
            color: "bg-accent-light",
            textColor: "text-accent-text",
            badge: lbl("Alta compatibilidad", "High match"),
          },
          {
            id: "digital",
            nombre: lbl("Marketing Digital", "Digital Marketing"),
            conexion: lbl("Tu landing page, brand board y estrategia de precios de temporada son las herramientas de cualquier especialista en marketing digital.", "Your landing page, brand board, and seasonal pricing strategy are the tools of any digital marketing specialist."),
            roles: [
              { titulo: lbl("Especialista SEO/SEM", "SEO/SEM Specialist"), empresa: lbl("Agencias, e-commerce", "Agencies, e-commerce"), match: 78 },
              { titulo: lbl("Community Manager", "Community Manager"), empresa: lbl("Empresas, agencias", "Companies, agencies"), match: 83 },
              { titulo: lbl("Product Manager", "Product Manager"), empresa: lbl("Startups, tech companies", "Startups, tech companies"), match: 69 },
            ],
            skills: ["CD", "CLC", "CCEC"],
            color: "bg-background",
            textColor: "text-text-primary",
            badge: lbl("En desarrollo", "In progress"),
          },
        ];

        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Industrias Vivas", "Live Industries")}</h2>
                <p className="text-[11px] text-text-muted mt-0.5">{lbl("Tu proyecto conecta con estos sectores profesionales reales", "Your project connects with these real professional sectors")}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-text-muted" />
                <span className="text-[10px] text-text-muted">{lbl("Málaga · ESO", "Málaga · ESO")}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {industrias.map((ind) => (
                <div key={ind.id} className={`rounded-2xl border border-card-border ${ind.color === "bg-sidebar" ? "bg-sidebar" : ind.color === "bg-accent-light" ? "bg-accent-light border-accent/30" : "bg-background"} p-4`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        ind.color === "bg-sidebar" ? "bg-white/20 text-white" :
                        ind.color === "bg-accent-light" ? "bg-sidebar text-accent" :
                        "bg-card border border-card-border text-text-muted"
                      }`}>{ind.badge}</span>
                      <p className={`text-[13px] font-bold mt-1.5 leading-tight ${ind.color === "bg-sidebar" ? "text-white" : "text-text-primary"}`}>
                        {ind.nombre}
                      </p>
                    </div>
                    <Briefcase size={14} className={ind.color === "bg-sidebar" ? "text-accent" : "text-text-muted"} />
                  </div>

                  {/* Connection */}
                  <p className={`text-[9px] leading-relaxed mb-3 ${ind.color === "bg-sidebar" ? "text-white/70" : "text-text-secondary"}`}>
                    {ind.conexion}
                  </p>

                  {/* Skills used */}
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {ind.skills.map((s) => (
                      <span key={s} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        ind.color === "bg-sidebar" ? "bg-white/20 text-white" : "bg-sidebar text-accent"
                      }`}>{s}</span>
                    ))}
                  </div>

                  {/* Roles */}
                  <div className="space-y-1.5">
                    {ind.roles.map((r) => (
                      <div key={r.titulo} className={`rounded-lg px-2.5 py-2 ${
                        ind.color === "bg-sidebar" ? "bg-white/10" : "bg-card border border-card-border"
                      }`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-[9px] font-semibold leading-tight ${ind.color === "bg-sidebar" ? "text-white" : "text-text-primary"}`}>
                            {r.titulo}
                          </span>
                          <span className={`text-[9px] font-bold ${r.match >= 80 ? "text-success" : r.match >= 70 ? "text-warning" : "text-text-muted"}`}>
                            {r.match}%
                          </span>
                        </div>
                        <p className={`text-[8px] ${ind.color === "bg-sidebar" ? "text-white/50" : "text-text-muted"}`}>{r.empresa}</p>
                        {/* match bar */}
                        <div className={`h-1 rounded-full mt-1 ${ind.color === "bg-sidebar" ? "bg-white/20" : "bg-border"}`}>
                          <div
                            className={`h-full rounded-full ${r.match >= 80 ? "bg-success" : r.match >= 70 ? "bg-warning" : "bg-border"}`}
                            style={{ width: `${r.match}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-accent-light border border-accent/20 rounded-xl px-4 py-3">
              <div className="flex items-start gap-2">
                <TrendingUp size={12} className="text-accent-text flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-accent-text leading-relaxed">
                  {lbl(
                    "Tu perfil está alineado con sectores con alta demanda en 2026. El emprendimiento digital, la gestión de experiencias y el marketing de datos crecerán un 34% en los próximos 5 años en España.",
                    "Your profile aligns with high-demand sectors in 2026. Digital entrepreneurship, experience management, and data marketing will grow 34% in the next 5 years in Spain."
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── C34: Plan de aprendizaje T2 — Bloque 5 Aprendizaje continuo ──── */}
      {(() => {
        // Detectar competencia más débil de T1 (CCEC: 55 = más baja en mock)
        const compDebil = competencies.reduce((min, c) => c.progress < min.progress ? c : min);
        const compDebilKey = compDebil.key;

        const planSemanalFallback = [
          lbl(
            `Semana 1 · ${compDebilKey}: Estudia el branding visual de 3 food trucks de referencia y documenta qué elementos hacen su identidad reconocible. Entregable: moodboard de 9 imágenes con anotaciones.`,
            `Week 1 · ${compDebilKey}: Study the visual branding of 3 reference food trucks and document what makes their identity recognisable. Deliverable: 9-image moodboard with annotations.`
          ),
          lbl(
            `Semana 2 · ${compDebilKey}: Diseña el sistema visual de tu Food Truck: logo (3 propuestas), paleta de colores (máximo 3 colores) y tipografías. Justifica cada decisión con criterios de ${compDebilKey}.`,
            `Week 2 · ${compDebilKey}: Design your Food Truck's visual system: logo (3 proposals), colour palette (max 3 colours) and typography. Justify each decision with ${compDebilKey} criteria.`
          ),
          lbl(
            `Semana 3 · ${compDebilKey}: Crea el material de comunicación de la semana: menú físico + post de redes sociales (Canva/Figma). Comparte con el grupo y recoge 3 feedbacks estructurados.`,
            `Week 3 · ${compDebilKey}: Create the week's communication materials: physical menu + social media post (Canva/Figma). Share with the group and collect 3 structured feedback points.`
          ),
          lbl(
            `Semana 4 · ${compDebilKey}: Presenta tu identidad de marca al inversor simulado. Prepara 3 diapositivas: antes/proceso/resultado. Justifica cómo cada decisión visual apoya el modelo de negocio.`,
            `Week 4 · ${compDebilKey}: Present your brand identity to the simulated investor. Prepare 3 slides: before/process/result. Justify how each visual decision supports the business model.`
          ),
        ];

        const recursosFallback = [
          { tipo: lbl("Lectura", "Reading"), titulo: lbl("\"La marca visual como ventaja competitiva\" — WGSN 2025", '"Visual Branding as Competitive Advantage" — WGSN 2025'), tiempo: "20 min" },
          { tipo: lbl("Vídeo", "Video"),    titulo: lbl("Cómo diseñó su logo un food truck que factura 200k€/año (YouTube)", "How a food truck making €200k/year designed its logo (YouTube)"), tiempo: "15 min" },
          { tipo: lbl("Ejercicio", "Exercise"), titulo: lbl("Análisis semiótico del menú de Casa Limón — conectado a tu proyecto", "Semiotic analysis of Casa Limón menu — connected to your project"), tiempo: "30 min" },
        ];

        const handleGenerarPlan = async () => {
          setGenerandoPlanT2(true);
          try {
            const res = await fetch("/api/tutor-chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode: "narrativa",
                message: `Genera un plan de 4 semanas para que Lucas García (1º ESO, proyecto Food Truck T2) mejore su competencia más débil de T1: ${compDebil.name} (${compDebilKey}, ${compDebil.progress}%). Formato: 4 líneas numeradas (Semana 1, 2, 3, 4), máximo 40 palabras cada una, con acción concreta y entregable vinculado al Food Truck.`,
              }),
            });
            const data = await res.json();
            const texto: string = data.message || "";
            const lineas = texto.split("\n").filter((l: string) => l.trim().match(/^[1-4]/));
            setPlanT2Generado(lineas.length >= 2 ? lineas : planSemanalFallback);
          } catch {
            setPlanT2Generado(planSemanalFallback);
          } finally {
            setGenerandoPlanT2(false);
          }
        };

        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sidebar flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={16} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold text-text-primary leading-tight">
                    {lbl("Mi plan de aprendizaje T2", "My T2 Learning Plan")}
                  </h2>
                  <p className="text-[11px] text-text-muted">{lbl("Aprendizaje continuo · Bloque 5 culture.md", "Continuous learning · Block 5 culture.md")}</p>
                </div>
              </div>
              {planT2Comprometido && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success-light px-2.5 py-1 rounded-full border border-success/20">
                  <CheckCircle2 size={10} />
                  {lbl("Comprometido T2", "T2 Committed")}
                </span>
              )}
            </div>

            {/* Competencia detectada */}
            <div className="bg-urgent-light border border-urgent/20 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={13} className="text-urgent flex-shrink-0" />
                <span className="text-[11px] font-bold text-text-primary">
                  {lbl("Área de mejora detectada en T1", "T1 improvement area detected")}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">
                {lbl(
                  `Tu competencia ${compDebil.name} (${compDebilKey}) terminó T1 en ${compDebil.progress}% — la más baja de tu perfil. El proyecto Food Truck es la oportunidad perfecta para trabajarla: desde el diseño de la marca hasta la presentación al inversor.`,
                  `Your ${compDebil.name} (${compDebilKey}) competency ended T1 at ${compDebil.progress}% — the lowest in your profile. The Food Truck project is the perfect opportunity to develop it: from brand design to investor presentation.`
                )}
              </p>
            </div>

            {/* Plan o estado vacío */}
            {!planT2Generado ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center">
                  <Sparkles size={22} className="text-accent-text" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-text-primary mb-1">
                    {lbl("La IA diseña tu plan de 4 semanas", "AI designs your 4-week plan")}
                  </p>
                  <p className="text-[11px] text-text-muted leading-snug max-w-xs">
                    {lbl(
                      "Basado en tus datos reales de T1 y el proyecto Food Truck. Un reto concreto por semana, conectado al trabajo que ya estás haciendo.",
                      "Based on your real T1 data and the Food Truck project. One concrete challenge per week, connected to the work you're already doing."
                    )}
                  </p>
                </div>
                <button
                  onClick={handleGenerarPlan}
                  disabled={generandoPlanT2}
                  className="flex items-center gap-2 bg-sidebar text-white text-[12px] font-bold px-4 py-2 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-60"
                >
                  {generandoPlanT2 ? (
                    <><RefreshCw size={13} className="animate-spin" />{lbl("Generando plan...", "Generating plan...")}</>
                  ) : (
                    <><Sparkles size={13} />{lbl("Generar mi plan con IA", "Generate my plan with AI")}</>
                  )}
                </button>
              </div>
            ) : (
              <>
                {/* Plan semanal */}
                <div className="flex flex-col gap-2 mb-4">
                  {planT2Generado.map((semana, idx) => (
                    <div key={idx} className="flex items-start gap-3 px-3 py-3 rounded-xl border border-card-border bg-background">
                      <div className="w-6 h-6 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-accent">{idx + 1}</span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-snug flex-1">{semana}</p>
                    </div>
                  ))}
                </div>

                {/* Recursos recomendados */}
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-text-primary mb-2">
                    {lbl("Recursos recomendados", "Recommended resources")}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {recursosFallback.map((r, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent-light border border-accent/20">
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-sidebar text-accent flex-shrink-0">{r.tipo}</span>
                        <p className="text-[10px] text-accent-text leading-snug flex-1">{r.titulo}</p>
                        <span className="text-[9px] text-text-muted flex-shrink-0">{r.tiempo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botones */}
                <div className="flex items-center gap-3">
                  {!planT2Comprometido ? (
                    <button
                      onClick={() => setPlanT2Comprometido(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-sidebar text-white text-[12px] font-bold py-2.5 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={13} />
                      {lbl("Comprometerse con el plan T2", "Commit to T2 plan")}
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-2 bg-success-light border border-success/20 text-success text-[12px] font-bold py-2.5 rounded-xl">
                      <CheckCircle2 size={13} />
                      {lbl("¡Compromiso registrado! La IA lo recordará.", "Commitment recorded! AI will remember it.")}
                    </div>
                  )}
                  <button
                    onClick={handleGenerarPlan}
                    disabled={generandoPlanT2}
                    className="flex items-center gap-1.5 bg-background border border-card-border text-text-secondary text-[11px] font-medium px-3 py-2.5 rounded-xl hover:bg-accent-light transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw size={12} className={generandoPlanT2 ? "animate-spin" : ""} />
                    {lbl("Regenerar", "Regenerate")}
                  </button>
                </div>
              </>
            )}

            {/* Principio pedagógico */}
            <div className="mt-4 bg-background rounded-xl px-3 py-2 border border-card-border">
              <p className="text-[10px] text-text-muted leading-relaxed">
                {lbl(
                  "La plataforma siempre propone el siguiente nivel. No aprendes competencias en abstracto — las desarrollas porque las necesitas esta semana para tu proyecto.",
                  "The platform always proposes the next level. You don't learn competencies in the abstract — you develop them because you need them this week for your project."
                )}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── S37: Carta de presentación profesional — Bloque 3 Narrativa propia ── */}
      {(() => {
        const cartaFallback = lbl(
          `Estimado/a equipo de selección,\n\nMi nombre es Lucas García y soy estudiante de 1º de ESO en QHUMA, la primera escuela con IA de España. Este primer trimestre he liderado el proyecto Casa Limón — una plataforma de alquiler vacacional en el Centro Histórico de Málaga con modelo de precios dinámicos basado en datos reales de AirDNA.\n\nA lo largo de 12 semanas he desarrollado y demostrado:\n\n• Competencia Emprendedora (CE): diseñé el modelo de negocio desde cero, calculé el punto de equilibrio en €750/mes y proyecté ingresos de €1.850/mes en escenario realista con una ocupación del 65%.\n\n• Competencia STEM: elaboré el análisis de rentabilidad con datos reales del mercado vacacional malagueño — RevPAR, ADR y ocupación por temporada — utilizando hojas de cálculo y visualizaciones propias.\n\n• Comunicación Lingüística (CLC): presenté el proyecto ante un panel de inversores simulados en el Demo Day del 13 de marzo, obteniendo una puntuación media de 3,4/4 en los criterios LOMLOE.\n\nEstoy en búsqueda de una beca o prácticas donde pueda aplicar estas competencias en un entorno real. El proyecto Casa Limón me ha enseñado que la mejor forma de aprender es cuando los resultados importan de verdad.\n\nAtentamente,\nLucas García\nQHUMA · 1º ESO · Marzo 2026`,
          `Dear Hiring Team,\n\nMy name is Lucas García and I am a Year 7 student at QHUMA, Spain's first AI-powered school. This first term I led Casa Limón — a holiday rental platform in Málaga's Historic Centre with dynamic pricing based on real AirDNA data.\n\nOver 12 weeks I developed and demonstrated:\n\n• Entrepreneurial Competency (CE): designed the business model from scratch, calculated break-even at €750/month and projected revenues of €1,850/month at a 65% realistic occupancy scenario.\n\n• STEM: built a profitability analysis using real Málaga holiday-market data — RevPAR, ADR and seasonal occupancy — in self-built spreadsheets and visualisations.\n\n• Linguistic Communication (CLC): presented the project to a simulated investor panel on Demo Day (13 March), achieving an average score of 3.4/4 on LOMLOE assessment criteria.\n\nI am looking for an internship or scholarship where I can apply these skills in a real environment. Casa Limón taught me that the best learning happens when the stakes are real.\n\nSincerely,\nLucas García\nQHUMA · Year 7 · March 2026`
        );

        const handleGenerarCarta = async () => {
          setGenerandoCarta(true);
          try {
            const res = await fetch("/api/tutor-chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode: "narrativa",
                message: lbl(
                  "Genera una carta de presentación profesional para Lucas García, alumno de 1º ESO en QHUMA. T1: proyecto Casa Limón (Airbnb Málaga), CE 82%, STEM 74%, CLC 71%, Demo Day 13 mar (nota media 3.4/4), ingresos proyectados €1.850/mes. Tono: profesional pero auténtico, primera persona, 4 párrafos, sin emojis. Para: solicitud de beca o prácticas.",
                  "Generate a professional cover letter for Lucas García, a Year 7 student at QHUMA. T1: Casa Limón project (Airbnb Málaga), CE 82%, STEM 74%, CLC 71%, Demo Day 13 Mar (avg score 3.4/4), projected revenue €1,850/month. Tone: professional but authentic, first person, 4 paragraphs, no emojis. For: scholarship or internship application."
                ),
              }),
            });
            const data = await res.json();
            const texto: string = data.message ?? "";
            setCartaProfesional(texto.length > 100 ? texto : cartaFallback);
          } catch {
            setCartaProfesional(cartaFallback);
          } finally {
            setGenerandoCarta(false);
          }
        };

        const handleCopiar = () => {
          if (!cartaProfesional) return;
          navigator.clipboard.writeText(cartaProfesional).then(() => {
            setCartaCopiada(true);
            setTimeout(() => setCartaCopiada(false), 2000);
          });
        };

        const handleDescargar = () => {
          if (!cartaProfesional) return;
          const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Carta de Presentación — Lucas García</title><style>body{font-family:Georgia,serif;max-width:680px;margin:60px auto;padding:40px;color:#141414;line-height:1.8;font-size:13px}h1{font-size:18px;margin-bottom:4px}p.subtitle{color:#666;font-size:11px;margin-bottom:32px}pre{white-space:pre-wrap;font-family:Georgia,serif;font-size:13px;line-height:1.8}</style></head><body><h1>Carta de Presentación Profesional</h1><p class="subtitle">Lucas García · QHUMA · Marzo 2026</p><pre>${cartaProfesional}</pre></body></html>`;
          const blob = new Blob([html], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "carta_presentacion_lucas_garcia.pdf";
          a.click();
          URL.revokeObjectURL(url);
          setCartaDescargada(true);
          setTimeout(() => setCartaDescargada(false), 3000);
        };

        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sidebar flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold text-text-primary leading-tight">
                    {lbl("Carta de presentación profesional", "Professional cover letter")}
                  </h2>
                  <p className="text-[11px] text-text-muted">{lbl("Generada desde tus datos reales de T1 · Bloque 3 culture.md", "Generated from your real T1 data · Block 3 culture.md")}</p>
                </div>
              </div>
              {cartaProfesional && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopiar}
                    className="flex items-center gap-1.5 bg-background border border-card-border text-text-secondary text-[11px] px-3 py-1.5 rounded-xl hover:bg-accent-light transition-colors cursor-pointer"
                  >
                    {cartaCopiada ? <CheckCircle2 size={12} className="text-success" /> : <Copy size={12} />}
                    {cartaCopiada ? lbl("Copiada", "Copied") : lbl("Copiar", "Copy")}
                  </button>
                  <button
                    onClick={handleDescargar}
                    className="flex items-center gap-1.5 bg-sidebar text-accent text-[11px] font-bold px-3 py-1.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
                  >
                    {cartaDescargada ? <CheckCircle2 size={12} /> : <Download size={12} />}
                    {cartaDescargada ? lbl("Descargada", "Downloaded") : lbl("Descargar PDF", "Download PDF")}
                  </button>
                </div>
              )}
            </div>

            {/* Context chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: lbl("Casa Limón · Airbnb Málaga", "Casa Limón · Airbnb Málaga"), bg: "bg-accent-light text-accent-text" },
                { label: lbl("CE 82% · STEM 74% · CLC 71%", "CE 82% · STEM 74% · CLC 71%"), bg: "bg-background text-text-secondary" },
                { label: lbl("Demo Day 3.4/4", "Demo Day 3.4/4"), bg: "bg-success-light text-success" },
              ].map((chip) => (
                <span key={chip.label} className={`text-[9px] font-semibold px-2.5 py-1 rounded-full ${chip.bg}`}>{chip.label}</span>
              ))}
            </div>

            {!cartaProfesional ? (
              <div className="flex flex-col items-center py-8 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center">
                  <Send size={22} className="text-accent-text" />
                </div>
                <p className="text-[13px] font-semibold text-text-primary">
                  {lbl("La IA redacta tu carta desde tu historial real", "AI drafts your letter from your real history")}
                </p>
                <p className="text-[11px] text-text-muted text-center max-w-xs leading-snug">
                  {lbl(
                    "No es una plantilla genérica. Cada párrafo está construido con tus datos reales: proyecto, competencias LOMLOE, Demo Day y resultados financieros.",
                    "Not a generic template. Each paragraph is built from your real data: project, LOMLOE competencies, Demo Day and financial results."
                  )}
                </p>
                <button
                  onClick={handleGenerarCarta}
                  disabled={generandoCarta}
                  className="flex items-center gap-2 bg-sidebar text-white text-[12px] font-bold px-5 py-2.5 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-60"
                >
                  {generandoCarta ? (
                    <><RefreshCw size={13} className="animate-spin" />{lbl("Redactando carta...", "Drafting letter...")}</>
                  ) : (
                    <><Sparkles size={13} />{lbl("Generar carta con IA", "Generate letter with AI")}</>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-background rounded-xl border border-card-border p-4 mb-3">
                  <pre className="text-[11px] text-text-secondary leading-relaxed whitespace-pre-wrap font-sans">{cartaProfesional}</pre>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerarCarta}
                    disabled={generandoCarta}
                    className="flex items-center gap-1.5 bg-background border border-card-border text-text-secondary text-[11px] px-3 py-2 rounded-xl hover:bg-accent-light cursor-pointer disabled:opacity-60 transition-colors"
                  >
                    <RefreshCw size={12} className={generandoCarta ? "animate-spin" : ""} />
                    {lbl("Regenerar", "Regenerate")}
                  </button>
                  <p className="text-[10px] text-text-muted leading-snug flex-1">
                    {lbl(
                      "Carta generada desde tus evidencias y resultados reales. Revísala antes de enviar.",
                      "Letter generated from your real evidence and results. Review before sending."
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}

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
