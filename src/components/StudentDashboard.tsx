"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  Coins,
  Zap,
  Flame,
  Monitor,
  FileText,
  ShieldCheck,
  Calculator,
  Receipt,
  ClipboardCheck,
  Send,
  MessageCircle,
  ChevronRight,
  Trophy,
  Star,
  Users,
  Swords,
  Timer,
  Lock,
  Palette,
  Table,
  Code,
  Sparkles,
  TrendingUp,
  CalendarDays,
  LayoutGrid,
  Activity,
  Play,
  Pause,
  TrendingDown,
  Minus,
  Briefcase,
  UserCheck,
  MessageSquare,
  Brain,
  Focus,
  RotateCcw,
  X,
} from "lucide-react";
import { weekSchedule } from "@/data/tasks";
import { currentStudent, chatMessages } from "@/data/students";
import { competencies } from "@/data/competencies";
import {
  playerLevel,
  flashMission,
  currentTribe,
  toolOptions,
  projectImpact,
} from "@/data/gamification";
import { Task } from "@/types";
import { useLang } from "@/lib/i18n";
import WeeklyProgressView from "./WeeklyProgressView";
import TeacherChat from "./TeacherChat";
import LevelUpModal from "./LevelUpModal";

const profesionalInvitado = {
  nombre: "Marta Sánchez",
  cargo: "Revenue Manager",
  empresa: "Booking.com España",
  iniciales: "MS",
  años: 8,
  sector: "Turismo & PropTech",
  conexion: "Lo que Marta hace cada día está directamente relacionado con tu proyecto Airbnb. Esta semana calculas precios de temporada — ella lo hace a escala para miles de propiedades con datos en tiempo real.",
  pregunta: "Acabas de enterarte de que habrá un festival de música en Málaga el próximo mes. ¿Qué harías con el precio de tu apartamento y por qué? ¿Qué datos buscarías antes de decidir?",
};

const mercadoTendencias = [
  { skill: "Gestión de plataformas digitales (Airbnb, Booking)", tendencia: "creciendo" as const, cambio: "+34%", salario: "€28k–42k", comp: "CD" },
  { skill: "Marketing turístico digital y SEO",                   tendencia: "creciendo" as const, cambio: "+28%", salario: "€24k–38k", comp: "CE" },
  { skill: "Análisis de datos de reservas y revenue management",  tendencia: "creciendo" as const, cambio: "+45%", salario: "€32k–55k", comp: "STEM" },
  { skill: "Comunicación con clientes multiidioma",               tendencia: "estable"   as const, cambio: "+8%",  salario: "€20k–30k", comp: "CLC" },
  { skill: "Gestión presencial básica sin tecnología",            tendencia: "bajando"   as const, cambio: "-12%", salario: "€18k–22k", comp: "CC" },
];

const taskIcons = [
  { icon: Monitor, label: "Landing Page" },
  { icon: FileText, label: "Page Copy" },
  { icon: MessageCircle, label: "Guest Comms" },
  { icon: Calculator, label: "Profitability" },
  { icon: Receipt, label: "Tax Sim" },
  { icon: ClipboardCheck, label: "Legal Check" },
];

const toolIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Palette,
  FileText,
  Table,
  Code,
};

interface StudentDashboardProps {
  onOpenProject?: () => void;
  onOpenTask?: (taskId: string) => void;
}

export default function StudentDashboard({ onOpenProject, onOpenTask }: StudentDashboardProps) {
  const today = weekSchedule.find((d) => d.status === "current")!;
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    today.tasks.find((t) => t.status === "in_progress") || null
  );
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"today" | "week">("today");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showCuerpoWidget, setShowCuerpoWidget] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showPreguntaInvitado, setShowPreguntaInvitado] = useState(false);
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;
  // C10 — CuerpoIA
  const [iaConsejoDescanso, setIaConsejoDescanso] = useState<string | null>(null);
  const [loadingConsejo, setLoadingConsejo] = useState(false);

  // C29 — Reflexión del día
  const [reflexionHoy, setReflexionHoy] = useState("");
  const [reflexionesGuardadas, setReflexionesGuardadas] = useState<{ texto: string; dia: string; fecha: string }[]>([]);
  const [guardandoReflexion, setGuardandoReflexion] = useState(false);
  const [reflexionGuardada, setReflexionGuardada] = useState(false);
  const [showReflexiones, setShowReflexiones] = useState(false);

  // S32 — Demo Day prep checklist
  const [demoDayChecks, setDemoDayChecks] = useState<Set<string>>(new Set(["pitch", "financiero"]));

  // S29 — Modo enfoque Pomodoro
  const [enfoqueMode, setEnfoqueMode] = useState(false);
  const [enfoqueRunning, setEnfoqueRunning] = useState(false);
  const [enfoqueElapsed, setEnfoqueElapsed] = useState(0);
  const [enfoqueFase, setEnfoqueFase] = useState<"trabajo" | "descanso">("trabajo");
  const [sesionesHoy, setSesionesHoy] = useState(2);
  const [enfoqueCompleted, setEnfoqueCompleted] = useState(false);

  const fetchConsejoIA = async (tareaActual: string) => {
    setLoadingConsejo(true);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "cuerpo",
          message: `Lucas acaba de terminar su pausa activa de 10 minutos. Estaba trabajando en: "${tareaActual}". Genera el micro-consejo de reincorporación.`,
          history: [],
        }),
      });
      const data = await res.json();
      setIaConsejoDescanso(data.reply ?? null);
    } catch {
      setIaConsejoDescanso("¡Bienvenido de vuelta! Tu cerebro está listo. Vuelve a la tarea con la mente fresca.");
    } finally {
      setLoadingConsejo(false);
    }
  };

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => {
        if (s <= 1) {
          setTimerRunning(false);
          // C10: fetch IA consejo when timer completes
          const tareaEnProgreso = today.tasks.find((t) => t.status === "in_progress");
          fetchConsejoIA(tareaEnProgreso?.title ?? "su proyecto Airbnb Málaga");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // S29 — Pomodoro useEffect (same pattern as PitchLab ensayo timer)
  useEffect(() => {
    if (!enfoqueRunning || enfoqueCompleted) return;
    const totalSecs = enfoqueFase === "trabajo" ? 25 * 60 : 5 * 60;
    if (enfoqueElapsed >= totalSecs) return;
    const interval = setInterval(() => {
      setEnfoqueElapsed((e) => {
        const next = e + 1;
        if (next >= totalSecs) {
          setEnfoqueRunning(false);
          if (enfoqueFase === "trabajo") {
            setEnfoqueCompleted(true);
            setSesionesHoy((s) => s + 1);
          } else {
            setEnfoqueFase("trabajo");
            setEnfoqueElapsed(0);
          }
          return next;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [enfoqueRunning, enfoqueElapsed, enfoqueFase, enfoqueCompleted]);

  const doneTasks = today.tasks.filter((t) => t.status === "completed");
  const progressPercent = Math.round(
    (doneTasks.length / today.tasks.length) * 100
  );

  const levelPercent = Math.round(
    (playerLevel.xpCurrent / playerLevel.xpRequired) * 100
  );

  return (
    <div className="flex gap-6">
      {/* Left: Main content */}
      <div className="flex-1 min-w-0">
        {/* C29 — Reflexión del día */}
        {(() => {
          const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
          const diasSemanaEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const hoy = new Date();
          const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes...
          const diaActual = lang === "es" ? diasSemana[diaSemana] : diasSemanaEn[diaSemana];
          const fechaFormato = hoy.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

          const prompts: Record<number, { es: string; en: string }> = {
            1: {
              es: "¿Cuál fue el mayor aprendizaje de la semana pasada en Casa Limón que quieres aplicar hoy?",
              en: "What was your biggest learning from last week at Casa Limón that you want to apply today?",
            },
            2: {
              es: "¿Qué decisión tomaste ayer en tu proyecto y cómo la cambiarías ahora con más información?",
              en: "What decision did you make yesterday in your project and how would you change it now with more information?",
            },
            3: {
              es: "Si tuvieras que explicarle a un inversor en 30 segundos por qué Casa Limón merece financiación, ¿qué dirías?",
              en: "If you had to explain to an investor in 30 seconds why Casa Limón deserves funding, what would you say?",
            },
            4: {
              es: "¿Qué competencia LOMLOE has trabajado más esta semana y cómo lo sabes?",
              en: "Which LOMLOE competency have you worked on most this week, and how do you know?",
            },
            5: {
              es: "¿Qué harías diferente la semana que viene para mejorar un resultado concreto de Casa Limón?",
              en: "What would you do differently next week to improve a specific result from Casa Limón?",
            },
          };

          // lunes=1…viernes=5, fin de semana usa viernes
          const promptIdx = diaSemana >= 1 && diaSemana <= 5 ? diaSemana : 5;
          const promptObj = prompts[promptIdx];
          const prompt = lang === "es" ? promptObj.es : promptObj.en;

          const handleGuardar = () => {
            if (!reflexionHoy.trim()) return;
            setGuardandoReflexion(true);
            setTimeout(() => {
              setReflexionesGuardadas((prev) => [
                { texto: reflexionHoy, dia: diaActual, fecha: fechaFormato },
                ...prev,
              ].slice(0, 5));
              setReflexionHoy("");
              setGuardandoReflexion(false);
              setReflexionGuardada(true);
              setTimeout(() => setReflexionGuardada(false), 3000);
            }, 700);
          };

          return (
            <div className="mb-6 bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sidebar flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-[9px] font-black">AI</span>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Reflexión del día", "Daily reflection")}</h3>
                    <span className="text-[10px] text-text-muted">{diaActual} · {fechaFormato}</span>
                  </div>
                </div>
                {reflexionesGuardadas.length > 0 && (
                  <button
                    onClick={() => setShowReflexiones((v) => !v)}
                    className="text-[10px] font-semibold text-accent-text bg-accent-light px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-95 transition-all"
                  >
                    {showReflexiones ? lbl("Ocultar", "Hide") : `${lbl("Ver mis reflexiones", "View my reflections")} (${reflexionesGuardadas.length})`}
                  </button>
                )}
              </div>

              {/* Prompt socrático */}
              <div className="bg-accent-light rounded-xl p-3 mb-3 border border-accent-text/10">
                <p className="text-[12px] text-text-primary leading-relaxed italic">&ldquo;{prompt}&rdquo;</p>
              </div>

              {/* Textarea */}
              <div className="relative mb-3">
                <textarea
                  value={reflexionHoy}
                  onChange={(e) => setReflexionHoy(e.target.value.slice(0, 300))}
                  placeholder={lbl("Escribe tu reflexión aquí...", "Write your reflection here...")}
                  rows={3}
                  className="w-full text-[12px] text-text-primary bg-background border border-card-border rounded-xl p-3 resize-none focus:outline-none focus:ring-1 focus:ring-accent-text/30 placeholder:text-text-muted"
                />
                <span className={`absolute bottom-2 right-3 text-[9px] ${reflexionHoy.length >= 280 ? "text-warning" : "text-text-muted"}`}>
                  {reflexionHoy.length}/300
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGuardar}
                  disabled={!reflexionHoy.trim() || guardandoReflexion}
                  className={`flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    reflexionHoy.trim()
                      ? "bg-sidebar text-white hover:brightness-110"
                      : "bg-background text-text-muted cursor-not-allowed"
                  } disabled:opacity-60`}
                >
                  {guardandoReflexion ? (
                    <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                  ) : (
                    <CheckCircle2 size={12} />
                  )}
                  {guardandoReflexion ? lbl("Guardando…", "Saving…") : lbl("Guardar reflexión", "Save reflection")}
                </button>
                {reflexionGuardada && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                    <CheckCircle2 size={11} />
                    {lbl("Reflexión guardada ✓", "Reflection saved ✓")}
                  </span>
                )}
              </div>

              {/* Mis reflexiones */}
              {showReflexiones && reflexionesGuardadas.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-card-border pt-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide">{lbl("Últimas reflexiones guardadas", "Recent saved reflections")}</p>
                  {reflexionesGuardadas.map((r, i) => (
                    <div key={i} className="bg-background rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold text-accent-text">{r.dia}</span>
                        <span className="text-[9px] text-text-muted">·</span>
                        <span className="text-[9px] text-text-muted">{r.fecha}</span>
                      </div>
                      <p className="text-[11px] text-text-primary leading-relaxed">{r.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* CD1: Epic Meaning — Hero Reframing */}
        <div className="mb-6">
          {/* Level badge + streak pills */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
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
            </div>
            {/* Cuerpo demo trigger */}
            <button
              onClick={() => { setShowCuerpoWidget(true); setTimerSeconds(600); setTimerRunning(false); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background text-text-muted text-[10px] font-medium hover:text-accent-text transition-colors cursor-pointer"
              title="Simular 90 minutos de pantalla"
            >
              <Activity size={11} />
              Demo 90 min
            </button>
          {/* View toggle */}
            <div className="flex items-center gap-1 bg-background rounded-xl p-1">
              <button
                onClick={() => setViewMode("today")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  viewMode === "today"
                    ? "bg-white shadow-sm text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <LayoutGrid size={11} />
                {lbl("Hoy", "Today")}
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  viewMode === "week"
                    ? "bg-white shadow-sm text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <CalendarDays size={11} />
                {lbl("Semana", "Week")}
              </button>
            </div>
          </div>

          <h1 className="text-[42px] font-semibold text-text-primary leading-[1.15]">
            {viewMode === "today" ? lbl("Misión de Hoy", "Today's Mission") : lbl("Tu Semana", "Your Week")}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[16px] text-text-secondary">
              El Airbnb de Lucas · Málaga
            </span>
            {onOpenProject && (
              <button
                onClick={onOpenProject}
                className="flex items-center gap-1 text-[12px] font-medium text-accent-text hover:text-sidebar transition-colors cursor-pointer"
              >
                {lbl("Ver Proyecto", "View Project")}
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* WEEKLY VIEW */}
        {viewMode === "week" && (
          <WeeklyProgressView onOpenTask={onOpenTask} />
        )}

        {/* TODAY VIEW — only show when viewMode is "today" */}
        {viewMode === "today" && <>

        {/* CD2: Accomplishment — Level Progression Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-text-muted font-medium">
              {lbl("Siguiente:", "Next:")} {playerLevel.nextTitle}
            </span>
            <span className="text-[11px] text-text-muted font-medium">
              {playerLevel.xpCurrent}/{playerLevel.xpRequired} XP
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-background">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sidebar to-accent-dark transition-all duration-700"
              style={{ width: `${levelPercent}%` }}
            />
          </div>
          <div className="flex justify-end mt-1.5">
            <button
              onClick={() => setShowLevelUp(true)}
              className="text-[10px] text-accent-text font-semibold underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity"
            >
              {lbl("¡Simulador de subida de nivel!", "Level-up simulator!")}
            </button>
          </div>
        </div>

        <LevelUpModal
          isOpen={showLevelUp}
          onClose={() => setShowLevelUp(false)}
          prevLevel={playerLevel.level}
          newLevel={playerLevel.level + 1}
          newTitle={playerLevel.nextTitle}
          xpGained={playerLevel.xpRequired - playerLevel.xpCurrent}
          unlockedFeature="Modo Socrático con tu tutor IA"
        />

        {/* Progress card */}
        <div className="bg-background rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[14px] font-medium text-text-primary mb-1">
                {lbl(`Llevas el ${progressPercent}% del día de hoy`, `You're ${progressPercent}% through today`)}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[13px] font-semibold text-text-primary">
                {doneTasks.length}/{today.tasks.length}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
            <Zap size={22} className="text-sidebar" />
          </div>
        </div>

        {/* C5: Cuerpo como herramienta — widget neurociencia */}
        {showCuerpoWidget && (
          <div className="relative overflow-hidden bg-sidebar rounded-2xl p-5 mb-6">
            <div className="absolute top-3 right-3 opacity-10">
              <Activity size={52} className="text-accent" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={15} className="text-accent" />
              <span className="text-[12px] font-bold text-accent uppercase tracking-wider">Cuerpo como Herramienta</span>
              <div className="ml-auto flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                <Clock size={10} className="text-white/50" />
                <span className="text-[10px] text-white/50 font-medium">{lbl("Llevas 90 min en pantalla", "You've been on screen 90 min")}</span>
              </div>
            </div>
            <p className="text-[13px] text-white/85 leading-relaxed mb-1 pr-10">
              Tu cerebro necesita un descanso activo. La neurociencia muestra que el movimiento libera BDNF (Factor Neurotrófico Derivado del Cerebro), mejorando la memoria y la concentración hasta un 20% en las siguientes 2 horas.
            </p>
            <p className="text-[11px] text-white/40 mb-4 italic">Muévete 10 minutos → más capacidad cognitiva para el resto del día.</p>
            {/* Timer + acciones */}
            {timerSeconds > 0 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-xl px-5 py-3 text-center min-w-[80px]">
                    <span className="text-[28px] font-bold text-white block leading-none">
                      {String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:{String(timerSeconds % 60).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-white/35 block mt-0.5">minutos</span>
                  </div>
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                    {timerRunning ? lbl("Pausar", "Pause") : lbl("Iniciar", "Start")}
                  </button>
                </div>
                <button
                  onClick={() => { setShowCuerpoWidget(false); setTimerRunning(false); setTimerSeconds(600); setIaConsejoDescanso(null); }}
                  className="px-4 py-2.5 bg-accent text-sidebar text-[12px] font-bold rounded-xl hover:brightness-110 transition-all cursor-pointer"
                >
                  {lbl("✓ Volver al trabajo", "✓ Back to work")}
                </button>
              </div>
            ) : (
              /* C10 — IA micro-consejo post-pausa */
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2">
                  <Sparkles size={13} className="text-accent flex-shrink-0" />
                  <span className="text-[11px] font-bold text-accent uppercase tracking-wider">{lbl("¡10 minutos completados!", "10 minutes done!")}</span>
                </div>
                {loadingConsejo ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin flex-shrink-0" />
                    <span className="text-[11px] text-white/60">Prof. Ana está preparando tu consejo…</span>
                  </div>
                ) : iaConsejoDescanso ? (
                  <div className="bg-white/8 rounded-xl p-3 border border-accent/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-sidebar text-[7px] font-black">IA</span>
                      </div>
                      <span className="text-[9px] font-semibold text-accent/80">Prof. Ana Martínez</span>
                    </div>
                    <p className="text-[12px] text-white/90 leading-relaxed">{iaConsejoDescanso}</p>
                  </div>
                ) : null}
                <button
                  onClick={() => { setShowCuerpoWidget(false); setTimerRunning(false); setTimerSeconds(600); setIaConsejoDescanso(null); }}
                  className="w-full px-4 py-2.5 bg-accent text-sidebar text-[12px] font-bold rounded-xl hover:brightness-110 transition-all cursor-pointer"
                >
                  {lbl("✓ Volver al trabajo", "✓ Back to work")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* CD7: Unpredictability — Flash Mission Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-sidebar to-accent-dark rounded-2xl p-5 mb-6">
          {/* Decorative sparkles */}
          <div className="absolute top-3 right-3 opacity-15">
            <Sparkles size={40} className="text-accent" />
          </div>

          {!missionAccepted ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Swords size={16} className="text-accent" />
                <span className="text-[12px] font-bold text-accent uppercase tracking-wider">
                  {lbl("Misión Flash", "Flash Mission")}
                </span>
                <div className="flex items-center gap-1 ml-auto bg-white/10 px-2 py-0.5 rounded-full">
                  <Timer size={11} className="text-white/70" />
                  <span className="text-[11px] text-white/70 font-medium">
                    {flashMission.timeLimit} min
                  </span>
                </div>
              </div>
              <p className="text-[14px] text-white/90 leading-relaxed mb-3 pr-8">
                {flashMission.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-accent">
                  +{flashMission.xpReward} XP
                </span>
                <button
                  onClick={() => setMissionAccepted(true)}
                  className="px-4 py-2 bg-accent text-sidebar text-[12px] font-bold rounded-xl hover:bg-accent/90 transition-colors cursor-pointer"
                >
                  {lbl("Aceptar misión", "Accept Mission")}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-accent uppercase tracking-wider">
                    {lbl("Misión activa", "Mission Active")}
                  </span>
                  <p className="text-[13px] text-white/80 mt-0.5">
                    {flashMission.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                  <Timer size={13} className="text-accent" />
                  <span className="text-[14px] font-bold text-white">
                    14:32
                  </span>
                </div>
                <span className="text-[13px] font-bold text-accent">
                  +{flashMission.xpReward} XP
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick action icons — CD6: Scarcity (lock indicators on upcoming) */}
        <div className="flex items-center justify-between mb-8 px-2">
          {today.tasks.map((task, i) => {
            const iconData = taskIcons[i];
            if (!iconData) return null;
            const Icon = iconData.icon;
            const isDone = task.status === "completed";
            const isCurrent = task.status === "in_progress";
            const isUpcoming = task.status === "upcoming";
            const isSelected = selectedTask?.id === task.id;

            return (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`flex flex-col items-center gap-2 cursor-pointer group transition-all ${
                  isUpcoming ? "opacity-40" : ""
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-sidebar text-accent shadow-lg scale-105"
                        : isDone
                        ? "bg-accent-light text-accent-text"
                        : isCurrent
                        ? "bg-accent-light text-accent-text border-2 border-accent"
                        : "bg-background text-text-muted"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={22} className="text-success" />
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>
                  {/* Lock overlay for upcoming tasks */}
                  {isUpcoming && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Lock size={10} className="text-text-muted" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    isSelected
                      ? "text-text-primary"
                      : "text-text-muted group-hover:text-text-secondary"
                  }`}
                >
                  {iconData.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected task detail — CD3: Creativity (tool selector) + CD6: Scarcity */}
        {selectedTask && (
          <div className="bg-background rounded-2xl p-5 mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-text-muted font-medium">
                    {selectedTask.time}
                  </span>
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      selectedTask.status === "completed"
                        ? "bg-success-light text-success"
                        : selectedTask.status === "in_progress"
                        ? "bg-accent-light text-accent-text"
                        : "bg-white text-text-muted"
                    }`}
                  >
                    {selectedTask.status === "completed"
                      ? lbl("Completada", "Completed")
                      : selectedTask.status === "in_progress"
                      ? lbl("En progreso", "In Progress")
                      : lbl("Siguiente", "Up Next")}
                  </div>
                </div>
                <h3 className="text-[18px] font-semibold text-text-primary leading-snug">
                  {selectedTask.title}
                </h3>
              </div>
              <span className="text-[12px] font-semibold text-accent-text bg-accent-light px-2.5 py-1 rounded-lg flex-shrink-0">
                +{selectedTask.xpReward} XP
              </span>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
              {selectedTask.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[10px] font-medium text-text-secondary bg-white rounded-lg px-2.5 py-1">
                {selectedTask.subject}
              </span>
              {selectedTask.competencies.map((key) => {
                const comp = competencies.find((c) => c.key === key);
                if (!comp) return null;
                return (
                  <span
                    key={key}
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: comp.color }}
                  >
                    {comp.shortName}
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 text-text-muted mb-4">
              <FileText size={12} />
              <span className="text-[11px]">{selectedTask.evidence}</span>
            </div>

            {/* Open Task Workspace button */}
            {(selectedTask.status === "in_progress" || selectedTask.status === "completed") && onOpenTask && (
              <button
                onClick={() => onOpenTask(selectedTask.id)}
                className="w-full mb-4 py-3 bg-sidebar text-white text-[13px] font-semibold rounded-xl hover:bg-accent-dark transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {lbl("Abrir espacio de trabajo", "Open Task Workspace")}
                <ChevronRight size={16} />
              </button>
            )}

            {/* CD3: Tool Choice Selector — only for in_progress tasks */}
            {selectedTask.status === "in_progress" && (
              <div className="border-t border-card-border pt-4">
                <span className="text-[11px] font-medium text-text-muted block mb-2.5">
                  {lbl("Elige tu herramienta", "Choose your tool")}
                </span>
                <div className="flex items-center gap-2">
                  {toolOptions.map((tool) => {
                    const ToolIcon = toolIconMap[tool.icon];
                    const isActive = selectedTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() =>
                          setSelectedTool(isActive ? null : tool.id)
                        }
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-sidebar text-accent shadow-md"
                            : "bg-white text-text-secondary hover:bg-accent-light hover:text-accent-text"
                        }`}
                      >
                        {ToolIcon && <ToolIcon size={14} />}
                        {tool.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CD6: Scarcity — lock message for upcoming tasks */}
            {selectedTask.status === "upcoming" && (
              <div className="border-t border-card-border pt-3 flex items-center gap-2 text-text-muted">
                <Lock size={12} />
                <span className="text-[11px]">
                  {lbl("Se desbloquea al completar la tarea actual", "Unlocks after current task")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Summary section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-semibold text-text-primary">
            {lbl("Resumen", "Summary")}
          </h2>
          <div className="flex items-center gap-1 bg-background rounded-xl p-1">
            <span className="px-3 py-1.5 rounded-lg text-[11px] text-text-muted font-medium">
              {lbl("Diario", "Daily")}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-text-primary bg-white shadow-sm">
              {lbl("Semanal", "Weekly")}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] text-text-muted font-medium">
              {lbl("Mensual", "Monthly")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* CD4: Ownership — Q-Coins enhanced */}
          <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <Coins size={13} className="text-accent-text" />
              <span className="text-[11px] text-text-muted font-medium">
                Q-Coins
              </span>
            </div>
            <div>
              <span className="text-[28px] font-bold text-text-primary block leading-none">
                {currentStudent.qcoins}
              </span>
              <span className="text-[10px] text-text-muted mt-1 block">
                {lbl("Tu moneda, tus decisiones", "Your currency, your choices")}
              </span>
            </div>
          </div>

          {/* XP This Week */}
          <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="text-accent-text" />
              <span className="text-[11px] text-text-muted font-medium">
                {lbl("XP ganado", "XP Earned")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-text-primary leading-none">
                {currentStudent.xpWeek}
              </span>
              <span className="text-[13px] text-text-muted">
                /{currentStudent.xpTotal}
              </span>
            </div>
          </div>

          {/* CD8: Loss Avoidance — Streak enhanced */}
          <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <Flame size={13} className="text-warning" />
              <span className="text-[11px] text-text-muted font-medium">
                {lbl("Racha", "Streak")}
              </span>
            </div>
            <div>
              <span className="text-[28px] font-bold text-text-primary block leading-none">
                {currentStudent.streak}
              </span>
              <span className="text-[10px] text-warning font-medium mt-1 block">
                {lbl("¡No la rompas!", "Keep it alive!")}
              </span>
            </div>
          </div>

          {/* Evidences */}
          <div className="bg-sidebar rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <FileText size={13} className="text-accent" />
              <span className="text-[11px] text-white/50 font-medium">
                {lbl("Evidencias", "Evidences")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-white leading-none">
                {currentStudent.evidencesSubmitted}
              </span>
              <span className="text-[13px] text-white/40">
                /{currentStudent.evidencesTotal}
              </span>
            </div>
          </div>
        </div>

        {/* CD5: Social Influence — Tribe Section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-text-primary" />
              <h2 className="text-[20px] font-semibold text-text-primary">
                {lbl("Tu Tribu", "Your Tribe")}
              </h2>
            </div>
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
                <span className="text-[13px] font-semibold text-text-primary">
                  {member.name}
                </span>
                <span className="text-[11px] text-text-muted">{member.role}</span>
                {member.badge && (
                  <div className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-warning-light">
                    <Star size={10} className="text-warning fill-warning" />
                    <span className="text-[9px] font-semibold text-warning">
                      {member.badge}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* S8: Industrias Vivas — Profesional invitado */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-text-primary" />
              <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Profesional Invitado", "Guest Professional")}</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-accent-light text-accent-text text-[10px] font-semibold border border-accent/20">
              {profesionalInvitado.sector}
            </span>
          </div>

          <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
            <div className="p-5">
              {/* Perfil */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-sidebar text-accent font-bold text-[16px] flex items-center justify-center flex-shrink-0">
                  {profesionalInvitado.iniciales}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-text-primary leading-tight">{profesionalInvitado.nombre}</p>
                  <p className="text-[12px] text-text-secondary">{profesionalInvitado.cargo}</p>
                  <p className="text-[11px] text-text-muted">{profesionalInvitado.empresa} · {profesionalInvitado.años} {lbl("años de experiencia", "years of experience")}</p>
                </div>
                {/* Simulated video thumbnail */}
                <div className="w-20 h-14 rounded-xl bg-sidebar/80 flex items-center justify-center flex-shrink-0 relative overflow-hidden cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-sidebar to-accent-dark" />
                  <div className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play size={13} className="text-white ml-0.5" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[8px] text-white/60 font-medium">3:42</span>
                </div>
              </div>

              {/* Conexión con el proyecto */}
              <div className="bg-accent-light rounded-xl px-3 py-2.5 mb-4 border border-accent/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <Briefcase size={11} className="text-accent-text" />
                  <span className="text-[10px] font-bold text-accent-text uppercase tracking-wide">{lbl("Conectado a tu proyecto", "Connected to your project")}</span>
                </div>
                <p className="text-[12px] text-text-secondary leading-relaxed">{profesionalInvitado.conexion}</p>
              </div>

              {/* Pregunta para reflexionar */}
              <button
                onClick={() => setShowPreguntaInvitado(!showPreguntaInvitado)}
                className="w-full flex items-center justify-between gap-2 bg-background rounded-xl px-4 py-3 hover:border hover:border-card-border transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-accent-text flex-shrink-0" />
                  <span className="text-[12px] font-semibold text-text-primary">{lbl("Pregunta de reflexión de Marta", "Marta's reflection question")}</span>
                </div>
                <span className="text-[10px] text-accent-text font-bold group-hover:underline">
                  {showPreguntaInvitado ? lbl("Ocultar", "Hide") : lbl("Ver pregunta", "View question")}
                </span>
              </button>

              {showPreguntaInvitado && (
                <div className="mt-3 bg-warning-light rounded-xl px-4 py-3 border border-warning/20">
                  <p className="text-[12px] text-text-primary leading-relaxed italic">
                    &ldquo;{profesionalInvitado.pregunta}&rdquo;
                  </p>
                  <p className="text-[10px] text-text-muted mt-2">
                    {lbl("Comparte tu respuesta con la Profa. Ana en el chat →", "Share your answer with Prof. Ana in the chat →")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* S22: Economía de mi proyecto */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-text-primary" />
              <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Economía de mi proyecto", "My project economics")}</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-accent-light text-accent-text text-[10px] font-bold border border-accent/20">
              Casa Limón · Airbnb Málaga
            </span>
          </div>

          {/* 4 KPIs financieros */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: lbl("Ingresos este mes", "Monthly revenue"), valor: "1.240€", meta: "1.850€", pct: 67, bg: "bg-success-light", barColor: "bg-success", icon: Coins, info: lbl("vs. objetivo mensual", "vs. monthly target") },
              { label: lbl("Gastos fijos", "Fixed costs"), valor: "310€", meta: "350€ máx.", pct: 89, bg: "bg-warning-light", barColor: "bg-warning", icon: Receipt, info: lbl("limpieza + suministros", "cleaning + supplies") },
              { label: lbl("Beneficio neto", "Net profit"), valor: "930€", meta: lbl("Punto equilibrio: 750€", "Break even: €750"), pct: 100, bg: "bg-accent-light", barColor: "bg-accent-text", icon: TrendingUp, info: lbl("superado ✓", "exceeded ✓") },
              { label: lbl("ROI del proyecto", "Project ROI"), valor: "18%", meta: lbl("Objetivo: 15%", "Target: 15%"), pct: 100, bg: "bg-background", barColor: "bg-sidebar", icon: Activity, info: lbl("por encima del objetivo", "above target") },
            ].map((kpi) => (
              <div key={kpi.label} className={`rounded-xl p-3 ${kpi.bg}`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <kpi.icon size={12} className="text-text-secondary flex-shrink-0" />
                  <span className="text-[10px] text-text-muted leading-tight">{kpi.label}</span>
                </div>
                <span className="text-[20px] font-bold text-text-primary block">{kpi.valor}</span>
                <div className="mt-1.5 h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div className={`h-full ${kpi.barColor} rounded-full transition-all`} style={{ width: `${Math.min(kpi.pct, 100)}%` }} />
                </div>
                <span className="text-[9px] text-text-muted mt-1 block">{kpi.info}</span>
              </div>
            ))}
          </div>

          {/* Desglose mensual */}
          <div className="bg-background rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold text-text-primary">{lbl("Desglose de ingresos — marzo 2026", "Revenue breakdown — March 2026")}</span>
              <span className="text-[10px] text-text-muted bg-card px-2 py-0.5 rounded-full border border-card-border">{lbl("4 reservas activas", "4 active bookings")}</span>
            </div>
            <div className="space-y-2">
              {[
                { concepto: "Reserva fam. Müller (5 noches × €68)", importe: 340, tipo: "ingreso", semana: "Sem. 1" },
                { concepto: "Reserva pareja Roca (3 noches × €72)", importe: 216, tipo: "ingreso", semana: "Sem. 2" },
                { concepto: "Reserva fam. Nakamura (7 noches × €78)", importe: 546, tipo: "ingreso", semana: "Sem. 3" },
                { concepto: "Reserva Sr. Martins (2 noches × €69)", importe: 138, tipo: "ingreso", semana: "Sem. 4" },
                { concepto: "Servicio de limpieza (4 limpiezas)", importe: -180, tipo: "gasto", semana: "Variable" },
                { concepto: "Suministros y extras", importe: -130, tipo: "gasto", semana: "Fijo" },
              ].map((item) => (
                <div key={item.concepto} className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.tipo === "ingreso" ? "bg-success" : "bg-urgent"}`} />
                  <span className="text-[11px] text-text-primary flex-1">{item.concepto}</span>
                  <span className="text-[10px] text-text-muted flex-shrink-0">{item.semana}</span>
                  <span className={`text-[12px] font-bold flex-shrink-0 tabular-nums ${item.tipo === "ingreso" ? "text-success" : "text-urgent"}`}>
                    {item.tipo === "ingreso" ? "+" : ""}{item.importe}€
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-card-border mt-1">
                <span className="text-[11px] font-bold text-text-primary flex-1">{lbl("Beneficio neto del mes", "Net profit for the month")}</span>
                <span className="text-[14px] font-bold text-success tabular-nums">+930€</span>
              </div>
            </div>
          </div>

          {/* Bloque IA conectado */}
          <div className="bg-accent-light rounded-xl p-4 border border-accent/20 mt-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                <span className="text-accent text-[8px] font-bold">IA</span>
              </div>
              <span className="text-[11px] font-semibold text-accent-text">{lbl("Análisis financiero — Proyecto activo", "Financial analysis — Active project")}</span>
            </div>
            <p className="text-[12px] text-text-primary leading-relaxed">
              Tu beneficio de <strong>930€</strong> supera el punto de equilibrio (750€) en un <strong>24%</strong>. La reserva de la familia Nakamura (7 noches) fue clave — las reservas largas mejoran el margen porque el coste de limpieza es fijo por reserva, no por noche.
              <span className="block mt-1 text-accent-text font-medium">¿Podrías diseñar una tarifa especial de "semana completa" para atraer más reservas de 7+ noches?</span>
            </p>
          </div>
        </div>

        {/* S23: Perfil cognitivo activo */}
        {(() => {
          const tareaActiva = today.tasks.find((t) => t.status === "in_progress");
          // Gardner intelligence profiles mapped to task competencies
          const inteligenciasPorComp: Record<string, { nombre: string; descripcion: string; estrategia: string; nivel: number }> = {
            STEM:  { nombre: "Lógico-matemática", descripcion: "Razonamiento analítico, patrones numéricos y resolución sistemática de problemas.", estrategia: "Usa tablas o esquemas para estructurar tu análisis antes de escribir. Los datos son tu aliado.", nivel: 82 },
            CD:    { nombre: "Espacial-digital",  descripcion: "Visualización de sistemas, diseño de interfaces y pensamiento en diagramas.", estrategia: "Dibuja el flujo de tu solución digital antes de implementarla. La estructura visual acelera la comprensión.", nivel: 76 },
            CLC:   { nombre: "Lingüística",       descripcion: "Comunicación precisa, narrativa clara y capacidad de síntesis escrita.", estrategia: "Escribe el concepto central en una sola frase antes de desarrollarlo. La claridad viene de la economía de palabras.", nivel: 71 },
            CE:    { nombre: "Emprendedora",      descripcion: "Visión de oportunidades, toma de decisiones bajo incertidumbre y creación de valor.", estrategia: "Pregúntate qué haría alguien que ya tiene este negocio funcionando. Piensa como operador, no como estudiante.", nivel: 88 },
            CPSAA: { nombre: "Intrapersonal",     descripcion: "Metacognición, autorregulación y conciencia de los propios procesos de aprendizaje.", estrategia: "Dedica 3 minutos a identificar qué sabes ya y qué necesitas aprender para esta tarea. Reduce la ansiedad.", nivel: 65 },
            CC:    { nombre: "Interpersonal",     descripcion: "Empatía, colaboración y comprensión de dinámicas sociales y ciudadanas.", estrategia: "Piensa en cómo tu proyecto impacta en personas reales. El propósito social mejora la calidad de las decisiones.", nivel: 60 },
            CPL:   { nombre: "Lingüística-plurilingüe", descripcion: "Capacidad de conectar con audiencias diversas y comunicar en múltiples contextos culturales.", estrategia: "Imagina que explicas tu proyecto a alguien de otro país. ¿Qué necesitarías aclarar? Eso es lo que falta en tu argumentación.", nivel: 58 },
            CCEC:  { nombre: "Estético-creativa", descripcion: "Sensibilidad visual, pensamiento divergente y capacidad de dar forma a ideas abstractas.", estrategia: "Busca una metáfora o imagen que represente tu proyecto. Ayuda a que otros lo recuerden mejor.", nivel: 55 },
          };
          const compActiva = tareaActiva?.competencies?.[0] ?? "STEM";
          const perfil = inteligenciasPorComp[compActiva] ?? inteligenciasPorComp["STEM"];
          const todas = Object.entries(inteligenciasPorComp).sort((a, b) => b[1].nivel - a[1].nivel);
          const top3 = todas.slice(0, 3);
          return (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-text-primary" />
                  <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Perfil cognitivo activo", "Active cognitive profile")}</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-accent-light text-accent-text text-[10px] font-bold border border-accent/20">
                  {lbl("Basado en tu interacción de hoy", "Based on today's interaction")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Inteligencia activa hoy */}
                <div className="col-span-2 bg-sidebar rounded-2xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Brain size={18} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{lbl("Inteligencia dominante hoy", "Today's dominant intelligence")}</span>
                      </div>
                      <p className="text-[16px] font-bold text-white leading-tight">{perfil.nombre}</p>
                      <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">{perfil.descripcion}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-[24px] font-black text-accent block leading-none">{perfil.nivel}</span>
                      <span className="text-[9px] text-white/40">/ 100</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${perfil.nivel}%` }} />
                  </div>
                  {/* Estrategia activada */}
                  <div className="bg-white/8 rounded-xl px-4 py-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles size={11} className="text-accent flex-shrink-0" />
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wide">{lbl("Estrategia para tu tarea actual", "Strategy for your current task")}</span>
                    </div>
                    <p className="text-[12px] text-white/80 leading-relaxed">
                      {tareaActiva
                        ? <><span className="text-white font-semibold">{tareaActiva.title}:</span> {perfil.estrategia}</>
                        : perfil.estrategia
                      }
                    </p>
                  </div>
                </div>

                {/* Top 3 inteligencias */}
                <div className="bg-card rounded-2xl border border-card-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy size={12} className="text-accent-text" />
                    <span className="text-[11px] font-semibold text-text-primary">{lbl("Tus 3 más fuertes", "Your top 3")}</span>
                  </div>
                  <div className="space-y-3">
                    {top3.map(([comp, data], i) => (
                      <div key={comp}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 ${i === 0 ? "bg-accent text-sidebar" : "bg-background text-text-muted"}`}>{i + 1}</span>
                          <span className="text-[11px] font-semibold text-text-primary flex-1 truncate">{data.nombre}</span>
                          <span className="text-[11px] font-bold text-accent-text">{data.nivel}</span>
                        </div>
                        <div className="h-1.5 bg-background rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${i === 0 ? "bg-accent-text" : "bg-accent-text/40"}`}
                            style={{ width: `${data.nivel}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-card-border">
                    <p className="text-[10px] text-text-muted leading-relaxed">
                      {lbl("Construido desde 30 días de interacción — no es un test, es tu huella de aprendizaje.", "Built from 30 days of interaction — not a test, it's your learning fingerprint.")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* S25: Habilidad de la semana */}
        {(() => {
          // Detectar competencia con menor score
          const compScores: Record<string, number> = { CLC: 72, CPL: 58, STEM: 85, CD: 88, CPSAA: 74, CC: 68, CE: 90, CCEC: 55 };
          const compNames: Record<string, string> = { CLC: "Comunicación Lingüística", CPL: "Plurilingüe", STEM: "STEM", CD: "Digital", CPSAA: "Personal y Social", CC: "Ciudadana", CE: "Emprendedora", CCEC: "Expresión Cultural" };
          const lowestComp = Object.entries(compScores).reduce((min, cur) => cur[1] < min[1] ? cur : min);
          const [compKey, compScore] = lowestComp;
          const ejercicios: Record<string, { titulo: string; descripcion: string; tiempo: string; dificultad: "Básico" | "Medio" | "Avanzado"; evidencia: string }> = {
            CLC: { titulo: "Redacta la guía de bienvenida de Casa Limón en español formal",                  descripcion: "Escribe un texto de 150 palabras explicando las normas de la casa, los puntos de interés cercanos y el protocolo de check-out. Usa registro formal y lenguaje claro para huéspedes adultos.",       tiempo: "30 min", dificultad: "Medio",    evidencia: "Documento Word" },
            CPL: { titulo: "Traduce las normas de Casa Limón al inglés y al francés",                      descripcion: "Toma las 5 normas principales de tu Airbnb y tradúcelas a inglés y francés sin usar traductores automáticos. Compara el resultado con DeepL y anota las diferencias de matiz.",                  tiempo: "30 min", dificultad: "Avanzado", evidencia: "Documento bilingüe" },
            STEM: { titulo: "Calcula el punto de equilibrio real de Casa Limón con 3 escenarios",          descripcion: "Crea una hoja de cálculo con los costes fijos mensuales, precio medio por noche y 3 escenarios de ocupación (40%, 65%, 85%). Determina en qué escenario cubres costes.",                          tiempo: "30 min", dificultad: "Avanzado", evidencia: "Hoja de cálculo" },
            CD: { titulo: "Optimiza el listing de Casa Limón para el algoritmo de Airbnb",                descripcion: "Revisa las 10 mejores prácticas de SEO de Airbnb (título, palabras clave, fotos, respuesta rápida) y aplica al menos 5 a tu listing actual. Documenta cada cambio con antes/después.",            tiempo: "30 min", dificultad: "Medio",    evidencia: "Captura de pantalla" },
            CPSAA: { titulo: "Reflexiona sobre tu error más costoso del proyecto y crea un plan de acción", descripcion: "Identifica el error que más impactó en tu proyecto Airbnb (financiero, de comunicación o de diseño). Responde: ¿qué supuse? ¿dónde falló? ¿qué cambiarías? Escribe un plan de 3 acciones.",   tiempo: "30 min", dificultad: "Medio",    evidencia: "Reflexión escrita" },
            CC: { titulo: "Analiza la normativa municipal de alquiler vacacional en Málaga 2024",          descripcion: "Busca en el BOE y la web del Ayuntamiento de Málaga los requisitos legales para alquiler vacacional. Lista 5 obligaciones del propietario y evalúa si Casa Limón las cumple.",                    tiempo: "30 min", dificultad: "Avanzado", evidencia: "Informe legal" },
            CE: { titulo: "Diseña una oferta de temporada para el verano de Casa Limón",                  descripcion: "Crea una estrategia de precios para julio-agosto: precio base, precio fin de semana, descuento para estancias de 7+ noches. Justifica cada decisión con datos de ocupación del sector.",          tiempo: "30 min", dificultad: "Medio",    evidencia: "Estrategia de precios" },
            CCEC: { titulo: "Diseña el branding visual de Casa Limón en Canva",                            descripcion: "Crea una identidad visual coherente: logotipo, paleta de 3 colores, tipografía y una foto de portada del listing. Justifica cada decisión estética en función del público objetivo familiar.", tiempo: "30 min", dificultad: "Básico",   evidencia: "Brand board" },
          };
          const ejercicio = ejercicios[compKey] ?? ejercicios["CCEC"];
          const dificultadCfg = {
            Básico:   { bg: "bg-success-light",  text: "text-success"      },
            Medio:    { bg: "bg-warning-light",  text: "text-text-primary" },
            Avanzado: { bg: "bg-urgent-light",   text: "text-urgent"       },
          } as const;
          const difCfg = dificultadCfg[ejercicio.dificultad];
          const difLabel: Record<"Básico" | "Medio" | "Avanzado", string> = {
            Básico:   lbl("Básico",   "Basic"),
            Medio:    lbl("Medio",    "Medium"),
            Avanzado: lbl("Avanzado", "Advanced"),
          };
          return (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-text-primary" />
                  <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Habilidad de la semana", "Skill of the week")}</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-warning-light text-text-primary text-[10px] font-bold border border-warning/20">
                  {lbl("Tu punto de mejora", "Your improvement area")}
                </span>
              </div>

              <div className="bg-card rounded-2xl border border-card-border p-5">
                {/* Cabecera: competencia detectada */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold bg-warning-light text-text-primary px-2 py-0.5 rounded-full border border-warning/20">
                        {lbl("Competencia más baja detectada", "Lowest detected competency")}
                      </span>
                      <span className="text-[9px] font-bold bg-urgent-light text-urgent px-2 py-0.5 rounded-full">{compScore}%</span>
                    </div>
                    <p className="text-[16px] font-bold text-text-primary leading-tight">{compKey} — {compNames[compKey]}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{lbl("Nivel actual en tu perfil de competencias LOMLOE", "Current level in your LOMLOE competency profile")}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-background flex flex-col items-center justify-center border border-card-border">
                      <span className="text-[22px] font-black text-urgent leading-none">{compScore}</span>
                      <span className="text-[8px] text-text-muted">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-5">
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: `${compScore}%` }} />
                  </div>
                </div>

                {/* Ejercicio contextualizado en Casa Limón */}
                <div className="bg-accent-light rounded-xl p-4 border border-accent/20 mb-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[13px] font-semibold text-text-primary leading-snug">{ejercicio.titulo}</p>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${difCfg.bg} ${difCfg.text}`}>{difLabel[ejercicio.dificultad]}</span>
                      <span className="text-[9px] font-bold bg-sidebar text-white px-2 py-0.5 rounded-full">{ejercicio.tiempo}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed mb-3">{ejercicio.descripcion}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-accent-text">{lbl("Evidencia:", "Evidence:")} {ejercicio.evidencia}</span>
                    <span className="text-[9px] text-text-muted">· Casa Limón · Airbnb Málaga</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      alert(lbl("¡Ejercicio marcado! +45 Q-Coins añadidos a tu saldo. Sigue así, Lucas.", "Exercise marked! +45 Q-Coins added to your balance. Keep it up, Lucas."));
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-sidebar text-white text-[12px] font-bold py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    {lbl("Marcar como practicado · +45 Q-Coins", "Mark as practiced · +45 Q-Coins")}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/tutor-chat", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            mode: "narrativa",
                            message: `Dame un ejercicio alternativo de ${compNames[compKey]} (competencia LOMLOE ${compKey}) para el proyecto Airbnb Málaga / Casa Limón. Solo el título del ejercicio y una descripción de 2 frases. Sin introducción.`,
                            history: [],
                          }),
                        });
                        const data = await res.json();
                        alert(data.reply ?? lbl("Aquí tienes otro ejercicio de refuerzo para Casa Limón.", "Here's another reinforcement exercise for Casa Limón."));
                      } catch {
                        alert(lbl("Intenta más tarde. ¡Sigue practicando!", "Try again later. Keep practicing!"));
                      }
                    }}
                    className="flex items-center gap-2 bg-background text-text-secondary text-[11px] font-medium py-2.5 px-4 rounded-xl hover:bg-card border border-card-border transition-all cursor-pointer"
                  >
                    <Sparkles size={12} />
                    {lbl("Pedir otro ejercicio", "Request another exercise")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* S27: Mi tribu aprende */}
        {(() => {
          const actividadDiaria = [
            { dia: lbl("L","M"), intensidad: 6 },
            { dia: lbl("M","T"), intensidad: 8 },
            { dia: lbl("X","W"), intensidad: 10 },
            { dia: lbl("J","Th"), intensidad: 7 },
            { dia: lbl("V","F"), intensidad: 9 },
            { dia: lbl("S","Sa"), intensidad: 3 },
            { dia: lbl("D","Su"), intensidad: 2 },
          ];
          const maxIntensidad = Math.max(...actividadDiaria.map((d) => d.intensidad));
          const logrosAnonimos = [
            { id: "l1", texto: lbl("Alumno A subió su mejor evidencia de CE esta semana.", "Student A submitted their best CE evidence this week."), comp: "CE", icono: "🏆" },
            { id: "l2", texto: lbl("Alumno B completó su pitch en tiempo récord: 4 min 12 s.", "Student B completed their pitch in record time: 4 min 12 s."), comp: "CLC", icono: "⚡" },
            { id: "l3", texto: lbl("Alumno C superó su error de cálculo y reentregó el modelo financiero.", "Student C fixed their calculation error and resubmitted the financial model."), comp: "STEM", icono: "✨" },
          ];
          const compBadge: Record<string, string> = {
            CE: "bg-urgent-light text-urgent",
            CLC: "bg-accent-light text-accent-text",
            STEM: "bg-success-light text-success",
          };
          return (
            <div className="mt-8 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-text-primary" />
                  <h2 className="text-[20px] font-semibold text-text-primary">
                    {lbl("Mi tribu aprende", "My tribe is learning")}
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-background text-text-muted text-[10px] font-medium border border-card-border">
                  {lbl("Esta semana en tu clase", "This week in your class")}
                </span>
              </div>

              {/* Stats agregados */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { valor: "8", label: lbl("Evidencias subidas", "Evidence submitted"), bg: "bg-success-light", text: "text-success" },
                  { valor: "3", label: lbl("Pitches ensayados", "Pitches rehearsed"), bg: "bg-accent-light", text: "text-accent-text" },
                  { valor: "12d", label: lbl("Racha media de clase", "Class average streak"), bg: "bg-warning-light", text: "text-warning" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl p-3 border border-card-border ${s.bg} text-center`}>
                    <span className={`text-[20px] font-bold ${s.text} block leading-none`}>{s.valor}</span>
                    <span className="text-[10px] text-text-muted block mt-0.5">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Logros anónimos */}
              <div className="space-y-2 mb-4">
                {logrosAnonimos.map((logro) => (
                  <div key={logro.id} className="flex items-center gap-3 bg-card rounded-xl border border-card-border px-3 py-2.5">
                    <span className="text-[16px] flex-shrink-0">{logro.icono}</span>
                    <p className="flex-1 text-[11px] text-text-secondary leading-relaxed">{logro.texto}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${compBadge[logro.comp] ?? "bg-background text-text-muted"}`}>
                      {logro.comp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ranking hint */}
              <div className="bg-sidebar rounded-xl p-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-accent flex-shrink-0" />
                  <p className="text-[12px] text-white leading-relaxed">
                    {lbl(
                      "¿Eres tú el más activo? Estás entre los top 3 de tu clase esta semana 🔥",
                      "Are you the most active? You're in your class's top 3 this week 🔥"
                    )}
                  </p>
                </div>
              </div>

              {/* Heatmap de actividad */}
              {(() => {
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays size={12} className="text-text-muted" />
                      <span className="text-[11px] font-semibold text-text-primary">
                        {lbl("Actividad de la clase — últimos 7 días", "Class activity — last 7 days")}
                      </span>
                    </div>
                    <div className="flex items-end gap-1.5 h-12 bg-background rounded-xl px-3 py-2">
                      {actividadDiaria.map((d) => (
                        <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-accent-text rounded-sm transition-all"
                            style={{ height: `${Math.round((d.intensidad / maxIntensidad) * 28)}px`, opacity: 0.3 + (d.intensidad / maxIntensidad) * 0.7 }}
                          />
                          <span className="text-[8px] text-text-muted">{d.dia}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* S6: Mercado en Tiempo Real */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-text-primary" />
              <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Mercado en Tiempo Real", "Live Market Data")}</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-background text-text-muted text-[10px] font-medium border border-card-border">
              {lbl("Actualizado hoy, 11 mar 2026", "Updated today, 11 Mar 2026")}
            </span>
          </div>

          {/* Insight IA */}
          <div className="bg-accent-light rounded-xl p-4 border border-accent/20 mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                <span className="text-accent text-[8px] font-bold">IA</span>
              </div>
              <span className="text-[11px] font-semibold text-accent-text">{lbl("Conectado a: Gestiona tu Airbnb en Málaga", "Connected to: Manage your Airbnb in Málaga")}</span>
            </div>
            <p className="text-[12px] text-text-primary leading-relaxed">
              El sector turístico digital en España creció un <strong>18% en 2025</strong>. Las habilidades que estás trabajando esta semana — plataformas digitales, comunicación y análisis financiero — están entre las más demandadas. Tu proyecto no es un ejercicio: es un portfolio real.
            </p>
          </div>

          {/* Tendencias */}
          <div className="space-y-2">
            {mercadoTendencias.map((t) => {
              const Icon = t.tendencia === "creciendo" ? TrendingUp : t.tendencia === "bajando" ? TrendingDown : Minus;
              const colorClass = t.tendencia === "creciendo" ? "text-success" : t.tendencia === "bajando" ? "text-urgent" : "text-warning";
              const bgClass = t.tendencia === "creciendo" ? "bg-success-light" : t.tendencia === "bajando" ? "bg-urgent-light" : "bg-warning-light";
              return (
                <div key={t.skill} className="flex items-center gap-3 bg-background rounded-xl p-3">
                  <div className={`w-7 h-7 rounded-lg ${bgClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={14} className={colorClass} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-text-primary leading-snug truncate">{t.skill}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold ${colorClass}`}>{t.cambio}</span>
                      <span className="text-[10px] text-text-muted">· {t.salario}/año · {lbl("Competencia", "Competency")}</span>
                      <span className="text-[9px] font-bold bg-accent-light text-accent-text px-1.5 py-0.5 rounded-full">{t.comp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        </> /* END TODAY VIEW */}

        {/* S29 — Floating "Modo enfoque" button + panel (absolute within flex-1 left column) */}
        {viewMode === "today" && ((() => {
          const totalSecs = enfoqueFase === "trabajo" ? 25 * 60 : 5 * 60;
          const remaining = Math.max(totalSecs - enfoqueElapsed, 0);
          const mins = Math.floor(remaining / 60);
          const secs = remaining % 60;
          const mmss = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
          const ringPct = totalSecs > 0 ? 1 - enfoqueElapsed / totalSecs : 1;
          const circum = 2 * Math.PI * 44;
          const dash = ringPct * circum;
          const sesionesHistorico = [
            { hora: "08:45", tarea: "Modelo de ingresos (STEM)" },
            { hora: "10:15", tarea: "Análisis de competencia (CE)" },
          ];
          return (
            <div>
              {/* Floating button */}
              {!enfoqueMode && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => { setEnfoqueMode(true); setEnfoqueCompleted(false); setEnfoqueElapsed(0); setEnfoqueFase("trabajo"); setEnfoqueRunning(false); }}
                    className="flex items-center gap-2 bg-sidebar text-accent text-[12px] font-bold px-4 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
                  >
                    <Focus size={14} />
                    {lbl("Modo enfoque", "Focus mode")}
                  </button>
                </div>
              )}

              {/* Panel overlay */}
              {enfoqueMode && (
                <div className={`mt-6 bg-card rounded-2xl border border-card-border p-6 ${enfoqueCompleted ? "ring-2 ring-success animate-pulse" : ""}`}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <Focus size={15} className="text-accent-text" />
                      <h3 className="text-[15px] font-bold text-text-primary">{lbl("Modo enfoque", "Focus mode")}</h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${enfoqueFase === "trabajo" ? "bg-accent-light text-accent-text" : "bg-success-light text-success"}`}>
                        {enfoqueFase === "trabajo" ? lbl("Trabajo · 25 min", "Work · 25 min") : lbl("Descanso · 5 min", "Break · 5 min")}
                      </span>
                    </div>
                    <button
                      onClick={() => { setEnfoqueMode(false); setEnfoqueRunning(false); setEnfoqueElapsed(0); setEnfoqueCompleted(false); setEnfoqueFase("trabajo"); }}
                      className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex gap-6 items-start">
                    {/* Ring + timer */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-28 h-28">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" fill="none" stroke="#f4f0e9" strokeWidth="8" />
                          <circle
                            cx="50" cy="50" r="44"
                            fill="none"
                            stroke={enfoqueFase === "trabajo" ? "#2f574d" : "#22c55e"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${circum}`}
                            style={{ transition: "stroke-dasharray 1s linear" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-[22px] font-black leading-none ${enfoqueCompleted ? "text-success" : "text-text-primary"}`}>{mmss}</span>
                          <span className="text-[8px] text-text-muted mt-0.5">{enfoqueFase === "trabajo" ? lbl("restantes", "remaining") : lbl("descanso", "break")}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      {enfoqueCompleted ? (
                        <button
                          onClick={() => { setEnfoqueCompleted(false); setEnfoqueFase("descanso"); setEnfoqueElapsed(0); setEnfoqueRunning(true); }}
                          className="flex items-center gap-1.5 bg-success text-white text-[11px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all"
                        >
                          <Play size={12} />
                          {lbl("Iniciar descanso 5 min", "Start 5-min break")}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEnfoqueRunning(!enfoqueRunning)}
                            className={`flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all ${
                              enfoqueRunning ? "bg-warning-light text-warning border border-warning/20" : "bg-sidebar text-accent"
                            }`}
                          >
                            {enfoqueRunning ? <><Pause size={12} />{lbl("Pausar", "Pause")}</> : <><Play size={12} />{enfoqueElapsed > 0 ? lbl("Continuar", "Resume") : lbl("Iniciar", "Start")}</>}
                          </button>
                          <button
                            onClick={() => { setEnfoqueElapsed(0); setEnfoqueRunning(false); setEnfoqueCompleted(false); setEnfoqueFase("trabajo"); }}
                            className="p-2 rounded-xl bg-background text-text-muted hover:text-text-secondary border border-card-border cursor-pointer transition-all"
                            title={lbl("Reiniciar", "Reset")}
                          >
                            <RotateCcw size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right info */}
                    <div className="flex-1 min-w-0">
                      {/* Tarea activa */}
                      <div className="bg-accent-light rounded-xl p-3 mb-4 border border-accent/20">
                        <div className="flex items-center gap-1.5 mb-1">
                          <ClipboardCheck size={11} className="text-accent-text" />
                          <span className="text-[9px] font-bold text-accent-text uppercase tracking-wide">{lbl("Tarea activa", "Active task")}</span>
                        </div>
                        <p className="text-[12px] font-semibold text-text-primary leading-snug">
                          {today.tasks.find((t) => t.status === "in_progress")?.title ?? lbl("Completar modelo financiero Casa Limón", "Complete Casa Limón financial model")}
                        </p>
                      </div>

                      {/* Sesiones completadas */}
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Trophy size={11} className="text-accent-text" />
                          <span className="text-[10px] font-semibold text-text-primary">{lbl("Sesiones hoy", "Sessions today")}</span>
                          <span className="ml-auto text-[10px] font-bold text-accent-text">{sesionesHoy} {lbl("completadas", "completed")}</span>
                        </div>
                        <div className="space-y-1">
                          {sesionesHistorico.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 bg-background rounded-lg px-2.5 py-1.5">
                              <CheckCircle2 size={10} className="text-success flex-shrink-0" />
                              <span className="text-[9px] text-text-muted flex-shrink-0">{s.hora}</span>
                              <span className="text-[9px] text-text-primary truncate">{s.tarea}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {enfoqueCompleted && (
                        <div className="bg-success-light rounded-xl px-3 py-2.5 border border-success/20">
                          <div className="flex items-center gap-1.5">
                            <Zap size={12} className="text-success flex-shrink-0" />
                            <p className="text-[12px] font-bold text-success">
                              {lbl("¡Sesión completada! +20 Q-Coins", "Session complete! +20 Q-Coins")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })())}
      </div>

      {/* S32 — Demo Day prep */}
      {(() => {
        const demoDayItems: { id: string; text: string; comp: string }[] = [
          { id: "pitch",      text: lbl("Pitch escrito (≥250 palabras)", "Pitch written (≥250 words)"),             comp: "CLC"  },
          { id: "slides",     text: lbl("Slides preparadas (mínimo 5)", "Slides prepared (min. 5)"),                comp: "CD"   },
          { id: "financiero", text: lbl("Modelo financiero actualizado", "Financial model updated"),               comp: "STEM" },
          { id: "ensayo",     text: lbl("Ensayo cronometrado completado", "Timed run-through completed"),           comp: "CE"   },
          { id: "feedback",   text: lbl("Feedback de Prof. Ana revisado", "Prof. Ana's feedback reviewed"),        comp: "CPSAA"},
          { id: "equipo",     text: lbl("Equipo coordinado + roles definidos", "Team coordinated + roles defined"), comp: "CC"   },
        ];
        const total = demoDayItems.length;
        const done = demoDayItems.filter(i => demoDayChecks.has(i.id)).length;
        const pct = Math.round((done / total) * 100);
        // Demo Day: Friday March 13. Today: March 11 → 2 days
        const diasRestantes = 2;
        const ringR = 22;
        const ringCirc = 2 * Math.PI * ringR;
        const ringFill = (pct / 100) * ringCirc;
        const ringColor = pct >= 80 ? "text-success" : pct >= 50 ? "text-warning" : "text-urgent";
        const ringStroke = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
        const compColors: Record<string, string> = {
          CLC: "bg-accent-light text-accent-text", STEM: "bg-success-light text-success",
          CD: "bg-warning-light text-warning", CE: "bg-sidebar text-white",
          CPSAA: "bg-background text-text-secondary", CC: "bg-urgent-light text-urgent",
        };
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-urgent flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[11px] font-black">DD</span>
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-text-primary leading-tight">
                    {lbl("Preparación Demo Day", "Demo Day Preparation")}
                  </h2>
                  <p className="text-[10px] text-text-muted">{lbl("Viernes 13 mar · Casa Limón · Airbnb Málaga", "Friday 13 Mar · Casa Limón · Airbnb Málaga")}</p>
                </div>
              </div>
              {/* Countdown */}
              <div className={`flex flex-col items-center px-3 py-2 rounded-xl ${diasRestantes <= 1 ? "bg-urgent-light" : "bg-warning-light"}`}>
                <span className={`text-[22px] font-black leading-none ${diasRestantes <= 1 ? "text-urgent" : "text-warning"}`}>{diasRestantes}</span>
                <span className={`text-[9px] font-semibold ${diasRestantes <= 1 ? "text-urgent" : "text-warning"}`}>{lbl("días", "days")}</span>
              </div>
            </div>

            {/* Readiness ring + checklist */}
            <div className="flex gap-4">
              {/* Ring */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 54 54" className="w-14 h-14 -rotate-90">
                    <circle cx="27" cy="27" r={ringR} fill="none" stroke="#ededed" strokeWidth="5" />
                    <circle
                      cx="27" cy="27" r={ringR} fill="none"
                      stroke={ringStroke} strokeWidth="5"
                      strokeDasharray={`${ringFill} ${ringCirc - ringFill}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-[12px] font-black ${ringColor}`}>{pct}%</span>
                  </div>
                </div>
                <span className="text-[9px] text-text-muted text-center leading-tight">{done}/{total} {lbl("listo", "ready")}</span>
              </div>

              {/* Checklist */}
              <div className="flex-1 space-y-2">
                {demoDayItems.map(item => {
                  const checked = demoDayChecks.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDemoDayChecks(prev => {
                        const next = new Set(prev);
                        if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
                        return next;
                      })}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        checked ? "bg-success-light border border-success/20" : "bg-background border border-card-border hover:border-accent/30"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                        checked ? "bg-success border-success" : "border-text-muted"
                      }`}>
                        {checked && <span className="text-white text-[8px] font-black">✓</span>}
                      </div>
                      <span className={`text-[11px] font-medium flex-1 leading-tight ${checked ? "line-through text-text-muted" : "text-text-primary"}`}>
                        {item.text}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${compColors[item.comp] ?? "bg-background text-text-muted"}`}>
                        {item.comp}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Motivational footer */}
            <div className={`mt-3 rounded-xl px-3 py-2 ${pct === 100 ? "bg-success-light border border-success/20" : "bg-accent-light border border-accent/20"}`}>
              <p className={`text-[11px] font-medium leading-snug ${pct === 100 ? "text-success" : "text-accent-text"}`}>
                {pct === 100
                  ? lbl("🎯 ¡Estás listo! Casa Limón va a brillar en el Demo Day.", "🎯 You're ready! Casa Limón will shine at Demo Day.")
                  : pct >= 66
                  ? lbl("💪 Casi allí — revisa los puntos pendientes hoy mismo.", "💪 Almost there — check the remaining points today.")
                  : lbl("⚡ Quedan 2 días. Cada ítem completado = más confianza en el escenario.", "⚡ 2 days left. Every item done = more confidence on stage.")}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Right: AI Chat — now fully powered by Gemini */}
      <div className="w-[300px] flex-shrink-0">
        <TeacherChat role="student" />
      </div>
    </div>
  );
}
