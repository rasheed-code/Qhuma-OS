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
  BarChart3,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  Rocket,
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

  // S33 — Resumen semanal inteligente
  const [semanaInsights, setSemanaInsights] = useState<string[] | null>(null);
  const [generandoInsights, setGenerandoInsights] = useState(false);

  // S32 — Demo Day prep checklist
  const [demoDayChecks, setDemoDayChecks] = useState<Set<string>>(new Set(["pitch", "financiero"]));

  // S40 — Lean Canvas T2
  const [canvasData, setCanvasData] = useState<Record<string, string>>({});
  const [canvasGuardando, setCanvasGuardando] = useState(false);
  const [canvasGuardado, setCanvasGuardado] = useState(false);

  // C38 — Pausa activa · Neurociencia (Bloque 6 Cuerpo)
  const [pausaHecha, setPausaHecha] = useState(false);
  const [pausaEjercicioIdx, setPausaEjercicioIdx] = useState(0);
  const [showPausaDetalle, setShowPausaDetalle] = useState(false);

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

          <h1 className="text-[28px] font-semibold text-text-primary leading-[1.15]">
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
          <div className="grid grid-cols-2 gap-3 mb-4">
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

        {/* S33 — Resumen semanal inteligente */}
      {(() => {
        const statsSemanales = [
          { label: lbl("Tareas completadas", "Tasks done"),   valor: 7, de: 9,    icon: CheckCircle2, bg: "bg-success-light",  color: "text-success"      },
          { label: lbl("Q-Coins ganados",    "Q-Coins earned"), valor: 340, de: null, icon: Coins,        bg: "bg-accent-light",   color: "text-accent-text"  },
          { label: lbl("Mejor competencia",  "Top skill"),     valor: "CE", de: null, icon: Trophy,       bg: "bg-warning-light",  color: "text-warning"      },
          { label: lbl("Racha mantenida",    "Streak"),        valor: 14,  de: null, icon: Flame,        bg: "bg-background",     color: "text-text-primary" },
          { label: lbl("Evidencias subidas", "Evidences"),     valor: 3,   de: 4,    icon: FileText,     bg: "bg-urgent-light",   color: "text-urgent"       },
        ];
        const insightsFallback = [
          lbl(
            "Esta semana tu competencia CE (Emprendedora) creció un +12% respecto a la semana anterior — el trabajo en el modelo financiero se está notando.",
            "This week your CE (Entrepreneurship) competency grew +12% versus last week — the financial modeling work is paying off."
          ),
          lbl(
            "Las tareas de comunicación (CLC) tienen un tiempo medio de resolución 35% más largo que el resto. Considera empezar por ellas cuando tengas más energía.",
            "Communication tasks (CLC) take 35% longer on average than others. Consider starting them when your energy is highest."
          ),
          lbl(
            "Tu racha de 14 días es la más larga del trimestre. Mantenerla hasta el Demo Day del viernes te daría un nuevo récord personal.",
            "Your 14-day streak is the longest of the trimester. Keeping it through Friday's Demo Day would set a new personal record."
          ),
        ];
        const handleGenerar = async () => {
          setGenerandoInsights(true);
          try {
            const res = await fetch("/api/tutor-chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode: "narrativa",
                message: "Genera 3 insights breves y personalizados sobre la semana de Lucas García en el proyecto Casa Limón (Airbnb Málaga). Semana 3, marzo 2026. Menciona competencias LOMLOE, patrones de trabajo y recomendación concreta para el Demo Day del viernes. Formato: 3 frases numeradas, una por línea, máximo 30 palabras cada una.",
                history: [],
              }),
            });
            if (res.ok) {
              const data = await res.json();
              const lines = (data.reply as string).split("\n").filter((l: string) => l.trim().length > 0).slice(0, 3);
              if (lines.length >= 2) { setSemanaInsights(lines); setGenerandoInsights(false); return; }
            }
          } catch { /* noop */ }
          setSemanaInsights(insightsFallback);
          setGenerandoInsights(false);
        };

        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">
                  {lbl("Resumen de la semana", "Weekly Summary")}
                </h3>
                <span className="text-[10px] text-text-muted font-medium">
                  {lbl("Semana 3 · 10–14 mar", "Week 3 · Mar 10–14")}
                </span>
              </div>
              <button
                onClick={handleGenerar}
                disabled={generandoInsights}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-text bg-accent-light px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-95 transition-all disabled:opacity-50"
              >
                {generandoInsights ? <RefreshCw size={11} className="animate-spin" /> : <Sparkles size={11} />}
                {lbl("Analizar con IA", "Analyze with AI")}
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {statsSemanales.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <Icon size={13} className={`${s.color} mx-auto mb-1`} />
                    <div className={`text-[16px] font-bold ${s.color}`}>
                      {s.valor}{s.de ? <span className="text-[10px] font-normal text-text-muted">/{s.de}</span> : ""}
                    </div>
                    <div className="text-[9px] text-text-muted leading-tight mt-0.5">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* AI insights */}
            {semanaInsights ? (
              <div className="space-y-2">
                {semanaInsights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 bg-background rounded-xl px-3 py-2">
                    <Lightbulb size={12} className="text-accent-text flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-text-primary leading-snug">{insight.replace(/^\d+\.\s*/, "")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-3">
                <Sparkles size={13} className="text-text-muted" />
                <p className="text-[11px] text-text-muted">
                  {lbl("Haz clic en 'Analizar con IA' para ver los patrones de tu semana.", "Click 'Analyze with AI' to see your weekly patterns.")}
                </p>
              </div>
            )}
          </div>
        );
      })()}

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

      {/* ── S36: Semana 1 Food Truck — primeros objetivos T2 ──────────────── */}
      {(() => {
        const tareasS1: Array<{
          dia: string; diaEn: string; titulo: string; tituloEn: string;
          comp: string; qcoins: number; completada: boolean;
        }> = [
          { dia: "Lunes",    diaEn: "Monday",    titulo: "Investiga 3 food trucks de referencia en Málaga",          tituloEn: "Research 3 reference food trucks in Málaga",          comp: "STEM",  qcoins: 20, completada: true  },
          { dia: "Martes",   diaEn: "Tuesday",   titulo: "Elige tu concepto gastronómico y el nombre del food truck", tituloEn: "Choose your food concept and the name of your truck", comp: "CE",    qcoins: 25, completada: true  },
          { dia: "Miércoles",diaEn: "Wednesday", titulo: "Primer boceto del logo, colores y eslogan",                tituloEn: "First logo sketch, colors and slogan",               comp: "CCEC",  qcoins: 30, completada: false },
          { dia: "Jueves",   diaEn: "Thursday",  titulo: "Elabora el menú inicial (5 platos con coste estimado)",    tituloEn: "Draft the initial menu (5 dishes with estimated cost)", comp: "STEM", qcoins: 35, completada: false },
          { dia: "Viernes",  diaEn: "Friday",    titulo: "Pitch de 90 segundos del concepto ante un compañero",      tituloEn: "90-second concept pitch to a classmate",             comp: "CLC",   qcoins: 40, completada: false },
        ];

        const completadasCount = tareasS1.filter(t => t.completada).length;
        const hoy = new Date().getDay(); // 0=dom, 1=lun...
        const diaIdx = hoy >= 1 && hoy <= 5 ? hoy - 1 : 2; // fallback miércoles
        const tareaHoy = tareasS1[diaIdx];

        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sidebar flex items-center justify-center flex-shrink-0">
                  <span className="text-[16px]">🚚</span>
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-text-primary leading-tight">
                    {lbl("Semana 1 · Food Truck", "Week 1 · Food Truck")}
                  </h2>
                  <p className="text-[10px] text-text-muted">{lbl("T2 · Tus primeros objetivos", "T2 · Your first goals")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-accent-text bg-accent-light px-2.5 py-1 rounded-full">
                  {lbl(`${completadasCount}/5 completadas`, `${completadasCount}/5 done`)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-border rounded-full h-1.5 overflow-hidden mb-4">
              <div
                className="h-full bg-accent-text rounded-full transition-all duration-500"
                style={{ width: `${(completadasCount / 5) * 100}%` }}
              />
            </div>

            {/* Tarea de hoy destacada */}
            <div className="rounded-xl bg-sidebar text-white p-4 mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest">{lbl("Tarea de hoy", "Today's task")}</span>
                <span className="text-[9px] text-white/50">·</span>
                <span className="text-[9px] text-white/60">{lang === "es" ? tareaHoy.dia : tareaHoy.diaEn}</span>
              </div>
              <p className="text-[13px] font-semibold leading-snug mb-3">
                {lang === "es" ? tareaHoy.titulo : tareaHoy.tituloEn}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">{tareaHoy.comp}</span>
                  <span className="text-[10px] font-bold text-[#F59E0B]">+{tareaHoy.qcoins} Q-Coins</span>
                </div>
                <button
                  onClick={() => alert(lang === "es" ? `¡Empezando tarea: ${tareaHoy.titulo}!` : `Starting: ${tareaHoy.tituloEn}!`)}
                  className="text-[10px] font-bold bg-accent text-sidebar px-3 py-1.5 rounded-lg hover:bg-accent/80 transition-colors cursor-pointer"
                >
                  {lbl("Empezar ahora", "Start now")}
                </button>
              </div>
            </div>

            {/* Lista de los 5 días */}
            <div className="flex flex-col gap-1.5">
              {tareasS1.map((tarea, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${
                    idx === diaIdx
                      ? "border-accent/40 bg-accent-light"
                      : tarea.completada
                      ? "border-success/20 bg-success-light"
                      : "border-card-border bg-background"
                  }`}
                >
                  {/* Day circle */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-bold ${
                    tarea.completada ? "bg-success text-white" : idx === diaIdx ? "bg-accent-text text-white" : "bg-border text-text-muted"
                  }`}>
                    {tarea.completada ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-medium leading-tight truncate ${
                      tarea.completada ? "line-through text-text-muted" : idx === diaIdx ? "text-accent-text font-semibold" : "text-text-secondary"
                    }`}>
                      {lang === "es" ? tarea.titulo : tarea.tituloEn}
                    </p>
                  </div>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-sidebar/10 text-sidebar flex-shrink-0">{tarea.comp}</span>
                  <span className={`text-[9px] font-bold flex-shrink-0 ${tarea.completada ? "text-text-muted line-through" : "text-[#F59E0B]"}`}>
                    +{tarea.qcoins}
                  </span>
                </div>
              ))}
            </div>

            {/* Nota pedagógica */}
            <div className="mt-3 bg-background rounded-xl px-3 py-2 border border-card-border">
              <p className="text-[10px] text-text-secondary leading-snug">
                {lbl(
                  "Este orden no es aleatorio: primero investigas (STEM), luego decides (CE), luego creas (CCEC), luego calculas (STEM) y finalmente comunicas (CLC). Es el ciclo emprendedor real.",
                  "This order is intentional: research (STEM), decide (CE), create (CCEC), calculate (STEM), then communicate (CLC). That's the real entrepreneurial cycle."
                )}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── C35: Empresa por dentro — Estructura Food Truck ─────────────── */}
      {(() => {
        interface Rol {
          id: string;
          titulo: string;
          emoji: string;
          dept: string;
          comp: string;
          desc: string;
          tareas: string[];
        }
        const roles: Rol[] = [
          {
            id: "ceo",
            titulo: lbl("CEO / Líder de proyecto", "CEO / Project lead"),
            emoji: "👑",
            dept: lbl("Dirección", "Management"),
            comp: "CE",
            desc: lbl("Toma las decisiones estratégicas, coordina al equipo y presenta en el Demo Day.", "Makes strategic decisions, coordinates the team and presents at Demo Day."),
            tareas: [
              lbl("Definir el concepto del Food Truck", "Define the Food Truck concept"),
              lbl("Asignar tareas a cada miembro", "Assign tasks to each member"),
              lbl("Presentar el proyecto final", "Present the final project"),
            ],
          },
          {
            id: "cfo",
            titulo: lbl("CFO / Finanzas", "CFO / Finance"),
            emoji: "💰",
            dept: lbl("Finanzas", "Finance"),
            comp: "STEM",
            desc: lbl("Gestiona el presupuesto de 3600 QC, calcula costes y proyecta ganancias.", "Manages the 3600 QC budget, calculates costs and projects profits."),
            tareas: [
              lbl("Elaborar el plan financiero", "Build the financial plan"),
              lbl("Controlar los gastos", "Track spending"),
              lbl("Calcular el punto de equilibrio", "Calculate breakeven point"),
            ],
          },
          {
            id: "cmo",
            titulo: lbl("CMO / Marketing", "CMO / Marketing"),
            emoji: "📣",
            dept: lbl("Marketing", "Marketing"),
            comp: "CLC",
            desc: lbl("Crea la identidad visual, el nombre y la estrategia de comunicación.", "Creates the visual identity, name and communication strategy."),
            tareas: [
              lbl("Diseñar el logo y colores", "Design the logo and colors"),
              lbl("Crear el slogan", "Create the tagline"),
              lbl("Planificar redes sociales", "Plan social media"),
            ],
          },
          {
            id: "coo",
            titulo: lbl("COO / Operaciones", "COO / Operations"),
            emoji: "⚙️",
            dept: lbl("Operaciones", "Operations"),
            comp: "CPSAA",
            desc: lbl("Diseña el menú, gestiona proveedores y planifica la logística del truck.", "Designs the menu, manages suppliers and plans truck logistics."),
            tareas: [
              lbl("Diseñar el menú de 5 productos", "Design the 5-product menu"),
              lbl("Buscar proveedores", "Source suppliers"),
              lbl("Planificar el espacio físico", "Plan physical space"),
            ],
          },
          {
            id: "cto",
            titulo: lbl("CTO / Tecnología", "CTO / Technology"),
            emoji: "💻",
            dept: lbl("Tecnología", "Technology"),
            comp: "CD",
            desc: lbl("Crea la presencia digital: web, pedidos online y gestión de datos.", "Creates digital presence: website, online orders and data management."),
            tareas: [
              lbl("Crear la web del Food Truck", "Build the Food Truck website"),
              lbl("Montar el sistema de pedidos", "Set up the ordering system"),
              lbl("Analizar datos de ventas", "Analyze sales data"),
            ],
          },
        ];
        const deptColors: Record<string, string> = {
          [lbl("Dirección", "Management")]:   "bg-sidebar text-accent",
          [lbl("Finanzas", "Finance")]:        "bg-warning-light text-warning",
          [lbl("Marketing", "Marketing")]:     "bg-accent-light text-accent-text",
          [lbl("Operaciones", "Operations")]:  "bg-success-light text-success",
          [lbl("Tecnología", "Technology")]:   "bg-urgent-light text-urgent",
        };
        const [rolActivo, setRolActivo] = useState<string | null>(null);
        const rolData = roles.find((r) => r.id === rolActivo);
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                <Briefcase size={14} className="text-accent-text" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-text-primary leading-tight">
                  {lbl("Empresa por dentro", "Inside the company")}
                </h2>
                <p className="text-[10px] text-text-secondary">
                  {lbl("Estructura del Food Truck · ¿Quién hace qué?", "Food Truck structure · Who does what?")}
                </p>
              </div>
            </div>

            {/* Org chart row */}
            <div className="mt-4 mb-3">
              {/* CEO at top */}
              <div className="flex justify-center mb-2">
                <button
                  onClick={() => setRolActivo(rolActivo === "ceo" ? null : "ceo")}
                  className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    rolActivo === "ceo" ? "border-sidebar bg-sidebar text-accent" : "border-card-border bg-background hover:border-sidebar/40"
                  }`}
                >
                  <span className="text-lg">👑</span>
                  <span className={`text-[10px] font-bold ${rolActivo === "ceo" ? "text-accent" : "text-text-primary"}`}>CEO</span>
                  <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-accent-light text-accent-text`}>CE</span>
                </button>
              </div>
              {/* Connector line */}
              <div className="flex justify-center mb-2">
                <div className="w-px h-3 bg-border" />
              </div>
              {/* 4 departments */}
              <div className="grid grid-cols-4 gap-2">
                {roles.filter((r) => r.id !== "ceo").map((rol) => {
                  const isActive = rolActivo === rol.id;
                  return (
                    <button
                      key={rol.id}
                      onClick={() => setRolActivo(isActive ? null : rol.id)}
                      className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                        isActive ? "border-sidebar bg-sidebar" : "border-card-border bg-background hover:border-sidebar/40"
                      }`}
                    >
                      <span className="text-base">{rol.emoji}</span>
                      <span className={`text-[9px] font-bold ${isActive ? "text-accent" : "text-text-primary"}`}>{rol.id.toUpperCase()}</span>
                      <span className={`text-[7px] font-semibold px-1 py-0.5 rounded-full ${deptColors[rol.dept] ?? "bg-border text-text-muted"}`}>{rol.comp}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail card */}
            {rolData ? (
              <div className="bg-background rounded-xl border border-card-border p-3.5 mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{rolData.emoji}</span>
                  <div>
                    <p className="text-[12px] font-bold text-text-primary">{rolData.titulo}</p>
                    <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${deptColors[rolData.dept] ?? ""}`}>{rolData.dept}</span>
                  </div>
                </div>
                <p className="text-[10px] text-text-secondary mb-2.5 leading-snug">{rolData.desc}</p>
                <div className="space-y-1.5">
                  {rolData.tareas.map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[9px] font-bold text-accent-text w-4 flex-shrink-0">{i + 1}.</span>
                      <span className="text-[10px] text-text-primary leading-snug">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-background rounded-xl border border-dashed border-card-border p-3 mt-3 text-center">
                <p className="text-[10px] text-text-muted">{lbl("Toca un rol para ver qué hace y qué tareas tiene.", "Tap a role to see what they do and their tasks.")}</p>
              </div>
            )}

            {/* Pedagogical note */}
            <div className="mt-3 bg-accent-light rounded-xl px-3 py-2 border border-accent/20">
              <p className="text-[10px] text-accent-text leading-snug">
                {lbl(
                  "Una empresa real tiene personas con funciones distintas. Conocer la estructura te ayuda a entender cómo encaja tu trabajo con el del resto del equipo.",
                  "A real company has people with different roles. Understanding the structure helps you see how your work connects with the rest of the team."
                )}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── S38: Mi presupuesto Food Truck — gestiona tus 3.600 QC ─────── */}
      {(() => {
        const TOTAL = 3600;
        interface Partida { id: string; nombre: string; emoji: string; descripcion: string; def: number; colorBar: string }
        const partidas: Partida[] = [
          { id: "ingredientes", nombre: lbl("Ingredientes", "Ingredients"),        emoji: "🥘", descripcion: lbl("Materias primas y producto fresco", "Raw materials and fresh produce"), def: 1200, colorBar: "bg-success" },
          { id: "equipamiento", nombre: lbl("Equipamiento", "Equipment"),          emoji: "🔧", descripcion: lbl("Maquinaria, utensilios, mobiliario", "Machinery, utensils, furniture"),     def: 800,  colorBar: "bg-sidebar" },
          { id: "diseno",       nombre: lbl("Diseño y branding", "Design & Brand"),emoji: "🎨", descripcion: lbl("Logo, menú visual, uniformes", "Logo, visual menu, uniforms"),             def: 400,  colorBar: "bg-warning" },
          { id: "marketing",    nombre: lbl("Marketing", "Marketing"),             emoji: "📣", descripcion: lbl("Redes sociales, flyers, publicidad", "Social media, flyers, advertising"),   def: 300,  colorBar: "bg-urgent" },
          { id: "ubicacion",    nombre: lbl("Ubicación", "Location"),              emoji: "📍", descripcion: lbl("Permisos y alquiler de espacio", "Permits and space rental"),               def: 500,  colorBar: "bg-accent-text" },
          { id: "contingencia", nombre: lbl("Contingencia", "Contingency"),        emoji: "🛡️", descripcion: lbl("Reserva para imprevistos", "Reserve for unexpected costs"),                def: 400,  colorBar: "bg-text-muted" },
        ];
        const [valores, setValores] = useState<number[]>(partidas.map((p) => p.def));
        const [guardando, setGuardando] = useState(false);
        const [guardado, setGuardado] = useState(false);
        const totalGastado = valores.reduce((s, v) => s + v, 0);
        const restante = TOTAL - totalGastado;
        const sobrePresupuesto = restante < 0;
        const pctUsado = Math.min(100, Math.round((totalGastado / TOTAL) * 100));
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-warning-light flex items-center justify-center flex-shrink-0">
                  <Coins size={14} className="text-warning" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-text-primary leading-tight">
                    {lbl("Mi presupuesto Food Truck", "My Food Truck Budget")}
                  </h2>
                  <p className="text-[10px] text-text-secondary">{lbl("Gestiona tus 3.600 QC para el Trimestre 2", "Manage your 3,600 QC for Term 2")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[18px] font-bold leading-none ${sobrePresupuesto ? "text-urgent" : restante === 0 ? "text-success" : "text-text-primary"}`}>
                  {restante < 0 ? `−${Math.abs(restante)}` : `+${restante}`} QC
                </p>
                <p className="text-[9px] text-text-muted">{sobrePresupuesto ? lbl("¡Te has pasado!", "Over budget!") : lbl("disponibles", "remaining")}</p>
              </div>
            </div>

            {/* Total bar */}
            <div className="mt-3 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-[9px] text-text-muted">{totalGastado.toLocaleString("es-ES")} QC {lbl("asignados", "allocated")}</span>
                <span className="text-[9px] font-semibold text-text-primary">{pctUsado}% / 100%</span>
              </div>
              <div className="h-2.5 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${sobrePresupuesto ? "bg-urgent" : pctUsado >= 90 ? "bg-warning" : "bg-success"}`}
                  style={{ width: `${pctUsado}%` }}
                />
              </div>
            </div>

            {/* Category rows */}
            <div className="space-y-2 mb-4">
              {partidas.map((p, i) => {
                const val = valores[i];
                const pct = Math.round((val / TOTAL) * 100);
                return (
                  <div key={p.id} className="bg-background rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-base flex-shrink-0 leading-none">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-text-primary">{p.nombre}</p>
                        <p className="text-[9px] text-text-muted">{p.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={TOTAL}
                          step={50}
                          value={val}
                          onChange={(e) => {
                            const nv = Math.max(0, Math.min(TOTAL, Number(e.target.value)));
                            setValores((prev) => { const next = [...prev]; next[i] = nv; return next; });
                          }}
                          className="w-16 text-right text-[11px] font-bold text-text-primary bg-card border border-card-border rounded-lg px-2 py-1 focus:outline-none focus:border-sidebar"
                        />
                        <span className="text-[9px] text-text-muted">QC</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                        <div className={`h-full rounded-full ${p.colorBar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[8px] text-text-muted w-6 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Over-budget alert */}
            {sobrePresupuesto && (
              <div className="bg-urgent-light border border-urgent/20 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
                <Calculator size={12} className="text-urgent flex-shrink-0" />
                <p className="text-[10px] text-urgent leading-snug font-semibold">
                  {lbl(`Has excedido el presupuesto en ${Math.abs(restante)} QC. Reduce alguna partida para poder guardar.`, `You're over budget by ${Math.abs(restante)} QC. Reduce a category to save.`)}
                </p>
              </div>
            )}

            {/* Save button */}
            <button
              onClick={() => { setGuardando(true); setTimeout(() => { setGuardando(false); setGuardado(true); setTimeout(() => setGuardado(false), 3000); }, 800); }}
              disabled={guardando || sobrePresupuesto}
              className="w-full flex items-center justify-center gap-2 bg-sidebar text-white text-[12px] font-bold py-2.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 mb-3"
            >
              {guardando ? <RefreshCw size={13} className="animate-spin" /> : guardado ? <CheckCircle2 size={13} /> : <Coins size={13} />}
              {guardado ? lbl("¡Presupuesto guardado!", "Budget saved!") : lbl("Guardar presupuesto", "Save budget")}
            </button>

            {/* Pedagogical note */}
            <div className="bg-accent-light rounded-xl px-3 py-2 border border-accent/20">
              <p className="text-[10px] text-accent-text leading-snug">
                {lbl(
                  "Controlar los costes antes de empezar es lo que separa a un emprendedor de un soñador. Tu presupuesto es tu mapa de decisiones reales.",
                  "Controlling costs before you start is what separates an entrepreneur from a dreamer. Your budget is your real decision map."
                )}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── C36: Dinero Real — márgenes de tu menú Food Truck ───────────── */}
      {(() => {
        interface ProductoMenu { id: string; nombre: string; emoji: string; coste: number; precio: number }
        const [productos, setProductos] = useState<ProductoMenu[]>([
          { id: "p1", nombre: lbl("Burger Mediterráneo", "Mediterran. Burger"), emoji: "🍔", coste: 3.2, precio: 8.5 },
          { id: "p2", nombre: lbl("Wrap de Pollo",       "Chicken Wrap"),        emoji: "🌯", coste: 2.5, precio: 7.0 },
          { id: "p3", nombre: lbl("Bowl Vegano",         "Vegan Bowl"),          emoji: "🥗", coste: 2.0, precio: 6.5 },
          { id: "p4", nombre: lbl("Patatas Bravas",      "Patatas Bravas"),      emoji: "🍟", coste: 0.8, precio: 3.5 },
          { id: "p5", nombre: lbl("Limonada Artesanal",  "Artisanal Lemonade"),  emoji: "🍋", coste: 0.6, precio: 2.5 },
        ]);
        const COSTES_FIJOS_DIARIOS = 45; // QC
        const VENTAS_DIA_EST = 30; // clientes estimados
        const margenBruto = (p: ProductoMenu) => ((p.precio - p.coste) / p.precio) * 100;
        const beneficioBruto = (p: ProductoMenu) => p.precio - p.coste;
        const ingresosTotales = productos.reduce((s, p) => s + p.precio, 0);
        const costeTotal = productos.reduce((s, p) => s + p.coste, 0);
        const margenMedio = ingresosTotales > 0 ? ((ingresosTotales - costeTotal) / ingresosTotales) * 100 : 0;
        const breakeven = margenMedio > 0 ? Math.ceil(COSTES_FIJOS_DIARIOS / ((ingresosTotales - costeTotal) / productos.length)) : 0;
        const beneficioNetoDia = Math.round((VENTAS_DIA_EST * (ingresosTotales - costeTotal) / productos.length) - COSTES_FIJOS_DIARIOS);
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-success-light flex items-center justify-center flex-shrink-0">
                <TrendingUp size={14} className="text-success" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-text-primary leading-tight">
                  {lbl("Dinero Real: márgenes de tu menú", "Real Money: your menu margins")}
                </h2>
                <p className="text-[10px] text-text-secondary">{lbl("Ajusta costes y precios — ve el impacto en directo", "Adjust costs and prices — see live impact")}</p>
              </div>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-3 gap-2 mt-3 mb-4">
              <div className="bg-success-light rounded-xl p-2.5 text-center">
                <p className="text-[16px] font-bold text-success leading-none">{margenMedio.toFixed(0)}%</p>
                <p className="text-[8px] text-text-muted mt-0.5">{lbl("Margen bruto medio", "Avg gross margin")}</p>
              </div>
              <div className="bg-accent-light rounded-xl p-2.5 text-center">
                <p className="text-[16px] font-bold text-accent-text leading-none">{breakeven}</p>
                <p className="text-[8px] text-text-muted mt-0.5">{lbl("Clientes p/breakeven", "Customers to break even")}</p>
              </div>
              <div className={`${beneficioNetoDia >= 0 ? "bg-success-light" : "bg-urgent-light"} rounded-xl p-2.5 text-center`}>
                <p className={`text-[16px] font-bold leading-none ${beneficioNetoDia >= 0 ? "text-success" : "text-urgent"}`}>
                  {beneficioNetoDia >= 0 ? "+" : ""}{beneficioNetoDia}€
                </p>
                <p className="text-[8px] text-text-muted mt-0.5">{lbl("Beneficio neto/día est.", "Est. net profit/day")}</p>
              </div>
            </div>

            {/* Producto rows */}
            <div className="space-y-2 mb-4">
              {productos.map((p, i) => {
                const mb = margenBruto(p);
                const bb = beneficioBruto(p);
                const mbColor = mb >= 60 ? "text-success" : mb >= 40 ? "text-warning" : "text-urgent";
                const barColor = mb >= 60 ? "bg-success" : mb >= 40 ? "bg-warning" : "bg-urgent";
                return (
                  <div key={p.id} className="bg-background rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base leading-none flex-shrink-0">{p.emoji}</span>
                      <p className="text-[11px] font-semibold text-text-primary flex-1 min-w-0 truncate">{p.nombre}</p>
                      <span className={`text-[11px] font-bold flex-shrink-0 ${mbColor}`}>{mb.toFixed(0)}% {lbl("mg", "mg")}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-text-muted">{lbl("Coste", "Cost")}</span>
                        <input
                          type="number" min={0.1} max={99} step={0.1} value={p.coste}
                          onChange={(e) => {
                            const nv = Math.max(0.1, Number(Number(e.target.value).toFixed(2)));
                            setProductos((prev) => prev.map((x, xi) => xi === i ? { ...x, coste: nv } : x));
                          }}
                          className="w-12 text-right text-[10px] font-bold text-text-primary bg-card border border-card-border rounded px-1.5 py-0.5 focus:outline-none focus:border-sidebar"
                        />
                        <span className="text-[8px] text-text-muted">€</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-text-muted">{lbl("Precio", "Price")}</span>
                        <input
                          type="number" min={0.5} max={99} step={0.1} value={p.precio}
                          onChange={(e) => {
                            const nv = Math.max(0.5, Number(Number(e.target.value).toFixed(2)));
                            setProductos((prev) => prev.map((x, xi) => xi === i ? { ...x, precio: nv } : x));
                          }}
                          className="w-12 text-right text-[10px] font-bold text-text-primary bg-card border border-card-border rounded px-1.5 py-0.5 focus:outline-none focus:border-sidebar"
                        />
                        <span className="text-[8px] text-text-muted">€</span>
                      </div>
                      <span className="text-[8px] text-text-muted ml-auto">{lbl("Ganancia", "Profit")}: <span className="font-bold text-accent-text">{bb.toFixed(2)}€</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, mb)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* IA contextual note */}
            <div className="bg-accent-light rounded-xl p-3 border border-accent/20">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                  <span className="text-accent text-[8px] font-bold">IA</span>
                </div>
                <span className="text-[10px] font-semibold text-accent-text">{lbl("¿Qué es el margen bruto?", "What is gross margin?")}</span>
              </div>
              <p className="text-[10px] text-text-primary leading-snug">
                {lbl(
                  `Tu margen bruto medio es ${margenMedio.toFixed(0)}%. Eso significa que de cada euro que cobras, conservas ${(margenMedio / 100).toFixed(2)}€ después de pagar los ingredientes. Con ${VENTAS_DIA_EST} clientes al día necesitas vender a ${breakeven} para cubrir costes fijos. El resto es tu beneficio.`,
                  `Your average gross margin is ${margenMedio.toFixed(0)}%. That means for every euro you charge, you keep ${(margenMedio / 100).toFixed(2)}€ after paying for ingredients. With ${VENTAS_DIA_EST} customers/day you need ${breakeven} to cover fixed costs. The rest is profit.`
                )}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── C37: Industrias Vivas — sector hostelería y restauración ────── */}
      {(() => {
        interface Tendencia { label: string; valor: string; delta: string; positivo: boolean; descripcion: string }
        interface Perfil { titulo: string; salario: string; skills: string[]; demanda: string }
        const tendencias: Tendencia[] = [
          { label: lbl("Mercado food trucks España", "Food truck market Spain"), valor: "€890M", delta: "+12% anual", positivo: true, descripcion: lbl("El sector crece un 12% cada año. Madrid y Málaga lideran el crecimiento.", "The sector grows 12% yearly. Madrid and Málaga lead growth.") },
          { label: lbl("Tasa de éxito primer año", "1st year success rate"), valor: "62%", delta: "+8pp vs media hostelería", positivo: true, descripcion: lbl("Los food trucks tienen mayor supervivencia que bares y restaurantes tradicionales.", "Food trucks have higher survival rates than traditional bars and restaurants.") },
          { label: lbl("Ticket medio", "Average ticket"), valor: "€8,40", delta: "+1.20€ vs 2023", positivo: true, descripcion: lbl("El cliente del food truck paga más que en fast food pero menos que en restaurante.", "Food truck customers pay more than fast food but less than restaurants.") },
          { label: lbl("Food trucks en España", "Food trucks in Spain"), valor: "3.200+", delta: "+400 en 2025", positivo: true, descripcion: lbl("El sector suma 400 nuevas unidades al año y tiene recorrido hasta 2030.", "The sector adds 400 new units per year with growth runway through 2030.") },
        ];
        const perfiles: Perfil[] = [
          { titulo: lbl("Emprendedor food truck", "Food Truck Entrepreneur"), salario: lbl("€24.000–€60.000/año", "€24,000–€60,000/year"), skills: ["CE", "STEM", "CLC"], demanda: lbl("Alta", "High") },
          { titulo: lbl("Chef / Jefe de cocina", "Chef / Head Cook"), salario: lbl("€22.000–€45.000/año", "€22,000–€45,000/year"), skills: ["CCEC", "CPSAA", "CE"], demanda: lbl("Muy alta", "Very high") },
          { titulo: lbl("Responsable de marketing gastronómico", "Gastro Marketing Manager"), salario: lbl("€28.000–€55.000/año", "€28,000–€55,000/year"), skills: ["CLC", "CD", "CE"], demanda: lbl("Alta", "High") },
          { titulo: lbl("Controller financiero hostelería", "Hospitality Finance Controller"), salario: lbl("€30.000–€65.000/año", "€30,000–€65,000/year"), skills: ["STEM", "CE", "CD"], demanda: lbl("Media-alta", "Medium-high") },
        ];
        const [perfilExpandido, setPerfilExpandido] = useState<number | null>(null);
        const compColors: Record<string, string> = {
          CE: "bg-sidebar text-accent", STEM: "bg-warning-light text-warning",
          CLC: "bg-accent-light text-accent-text", CCEC: "bg-urgent-light text-urgent",
          CD: "bg-success-light text-success", CPSAA: "bg-background text-text-secondary",
        };
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-warning-light flex items-center justify-center flex-shrink-0">
                <TrendingUp size={14} className="text-warning" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-text-primary leading-tight">
                  {lbl("Industrias Vivas: hostelería y restauración", "Live Industries: hospitality & food service")}
                </h2>
                <p className="text-[10px] text-text-secondary">{lbl("Tu sector real · datos actualizados 2025", "Your real sector · 2025 updated data")}</p>
              </div>
            </div>

            {/* Tendencias de mercado */}
            <div className="mt-3 mb-4">
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-wide mb-2">{lbl("Tendencias del mercado", "Market trends")}</p>
              <div className="grid grid-cols-2 gap-2">
                {tendencias.map((t) => (
                  <div key={t.label} className="bg-background rounded-xl p-3">
                    <p className="text-[9px] text-text-muted mb-0.5">{t.label}</p>
                    <p className="text-[18px] font-bold text-text-primary leading-none">{t.valor}</p>
                    <p className={`text-[8px] font-semibold mt-1 ${t.positivo ? "text-success" : "text-urgent"}`}>
                      {t.positivo ? "▲" : "▼"} {t.delta}
                    </p>
                    <p className="text-[8px] text-text-muted mt-1 leading-snug">{t.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Perfiles profesionales */}
            <div className="mb-4">
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-wide mb-2">{lbl("Perfiles profesionales del sector", "Sector job profiles")}</p>
              <div className="space-y-1.5">
                {perfiles.map((p, i) => {
                  const isOpen = perfilExpandido === i;
                  return (
                    <div key={i} className={`rounded-xl border transition-all ${isOpen ? "bg-accent-light border-accent/30" : "bg-background border-card-border"}`}>
                      <button
                        onClick={() => setPerfilExpandido(isOpen ? null : i)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[11px] font-semibold text-text-primary">{p.titulo}</p>
                          <p className="text-[9px] text-text-muted">{p.salario}</p>
                        </div>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${p.demanda === lbl("Muy alta", "Very high") || p.demanda === lbl("Alta", "High") ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}>
                          {p.demanda}
                        </span>
                        <ChevronRight size={11} className={`text-text-muted flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3">
                          <p className="text-[9px] text-text-muted mb-2">{lbl("Competencias LOMLOE clave para este perfil:", "Key LOMLOE competencies for this profile:")}</p>
                          <div className="flex gap-1.5 flex-wrap">
                            {p.skills.map((s) => (
                              <span key={s} className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${compColors[s] ?? "bg-background text-text-muted"}`}>{s}</span>
                            ))}
                          </div>
                          <p className="text-[9px] text-accent-text mt-2 leading-snug font-semibold">
                            {lbl("Tu proyecto Food Truck ya está desarrollando estas competencias.", "Your Food Truck project is already developing these competencies.")}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conexión con el proyecto */}
            <div className="bg-sidebar rounded-xl p-3">
              <p className="text-[9px] font-bold text-accent mb-1">{lbl("Tu proyecto, tu sector real", "Your project, your real sector")}</p>
              <p className="text-[10px] text-white/80 leading-snug">
                {lbl(
                  "Lo que estás construyendo en clase no es un ejercicio — es una simulación del mercado real de hostelería. Las decisiones de precio, marca y finanzas que tomas hoy son las mismas que toman los emprendedores reales del sector.",
                  "What you're building in class isn't an exercise — it's a real-market simulation of the hospitality sector. The pricing, branding and financial decisions you make today are the same ones real entrepreneurs make."
                )}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── S40: Mi Lean Canvas T2 — Food Truck ─────────────────────────── */}
      {(() => {
        interface BloqueLean {
          id: string;
          titulo: string;
          tituloEn: string;
          emoji: string;
          placeholder: string;
          placeholderEn: string;
          prefill: string;
          prefillEn: string;
        }
        const bloques: BloqueLean[] = [
          {
            id: "propuesta",
            titulo: "Propuesta de valor",
            tituloEn: "Value proposition",
            emoji: "🎯",
            placeholder: "¿Qué hace único a tu Food Truck?",
            placeholderEn: "What makes your Food Truck unique?",
            prefill: "Comida mediterránea rápida con ingredientes locales de Málaga a un precio accesible.",
            prefillEn: "Fast Mediterranean food with local Málaga ingredients at an accessible price.",
          },
          {
            id: "segmento",
            titulo: "Segmento de clientes",
            tituloEn: "Customer segment",
            emoji: "👥",
            placeholder: "¿Quién es tu cliente ideal?",
            placeholderEn: "Who is your ideal customer?",
            prefill: "Universitarios y jóvenes profesionales de 18–35 años que buscan comer bien sin gastar mucho.",
            prefillEn: "University students and young professionals aged 18–35 who want to eat well without spending much.",
          },
          {
            id: "canales",
            titulo: "Canales de venta",
            tituloEn: "Sales channels",
            emoji: "📣",
            placeholder: "¿Cómo llegas a tus clientes?",
            placeholderEn: "How do you reach your customers?",
            prefill: "",
            prefillEn: "",
          },
          {
            id: "ingresos",
            titulo: "Fuentes de ingresos",
            tituloEn: "Revenue streams",
            emoji: "💰",
            placeholder: "¿Cómo gana dinero tu Food Truck?",
            placeholderEn: "How does your Food Truck make money?",
            prefill: "Venta directa en mercado, pedidos anticipados por WhatsApp y catering para eventos.",
            prefillEn: "Direct market sales, advance orders via WhatsApp, and event catering.",
          },
          {
            id: "costes",
            titulo: "Costes clave",
            tituloEn: "Key costs",
            emoji: "📦",
            placeholder: "¿Cuáles son tus mayores gastos?",
            placeholderEn: "What are your biggest expenses?",
            prefill: "Ingredientes (45%), alquiler plaza de mercado (20%), packaging (10%), transporte (15%).",
            prefillEn: "Ingredients (45%), market pitch rental (20%), packaging (10%), transport (15%).",
          },
          {
            id: "socios",
            titulo: "Socios clave",
            tituloEn: "Key partners",
            emoji: "🤝",
            placeholder: "¿Quién te ayuda a operar?",
            placeholderEn: "Who helps you operate?",
            prefill: "",
            prefillEn: "",
          },
        ];

        const handleGuardarCanvas = () => {
          setCanvasGuardando(true);
          setTimeout(() => {
            setCanvasGuardando(false);
            setCanvasGuardado(true);
            setTimeout(() => setCanvasGuardado(false), 3000);
          }, 900);
        };

        const filledCount = bloques.filter((b) => {
          const val = canvasData[b.id];
          return val !== undefined ? val.trim().length > 0 : (lang === "es" ? b.prefill : b.prefillEn).trim().length > 0;
        }).length;

        return (
          <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent-text flex items-center justify-center flex-shrink-0">
                  <LayoutGrid size={12} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">
                    {lbl("Mi Lean Canvas T2", "My T2 Lean Canvas")}
                  </h3>
                  <span className="text-[10px] text-text-muted">{lbl("Food Truck · Modelo de negocio", "Food Truck · Business model")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-xl border border-card-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-text" />
                  <span className="text-[10px] font-semibold text-text-secondary">{filledCount}/6 {lbl("bloques", "blocks")}</span>
                </div>
                <button
                  onClick={handleGuardarCanvas}
                  disabled={canvasGuardando}
                  className="flex items-center gap-1.5 bg-sidebar text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {canvasGuardando ? <RefreshCw size={10} className="animate-spin" /> : canvasGuardado ? <CheckCircle2 size={10} /> : <Briefcase size={10} />}
                  {canvasGuardado ? lbl("¡Guardado!", "Saved!") : lbl("Guardar canvas", "Save canvas")}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-text-muted mb-4 mt-2">
              {lbl(
                "Define los 6 bloques de tu modelo de negocio. Edita cada bloque directamente — los prefills son sugerencias que puedes mejorar.",
                "Define the 6 blocks of your business model. Edit each block directly — the prefills are suggestions you can improve."
              )}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {bloques.map((b) => {
                const value = canvasData[b.id] !== undefined ? canvasData[b.id] : (lang === "es" ? b.prefill : b.prefillEn);
                const hasContent = value.trim().length > 0;
                return (
                  <div key={b.id} className={`rounded-xl border p-3 ${hasContent ? "border-accent/30 bg-accent-light/40" : "border-card-border bg-background"}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-base leading-none">{b.emoji}</span>
                      <span className="text-[11px] font-semibold text-text-primary">{lang === "es" ? b.titulo : b.tituloEn}</span>
                      {hasContent && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />}
                    </div>
                    <textarea
                      value={value}
                      onChange={(e) => setCanvasData((prev) => ({ ...prev, [b.id]: e.target.value }))}
                      placeholder={lang === "es" ? b.placeholder : b.placeholderEn}
                      rows={3}
                      className="w-full text-[10px] text-text-primary bg-white/60 border border-card-border rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-accent-text/30 placeholder:text-text-muted leading-relaxed"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 bg-sidebar rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold text-accent mb-0.5">{lbl("Por qué esto importa ahora", "Why this matters now")}</p>
              <p className="text-[10px] text-white/80 leading-snug">
                {lbl(
                  "Un Lean Canvas no es un documento escolar — es el mapa de tus decisiones reales. Cada bloque que rellenas esta semana es una hipótesis que validarás con clientes reales en el mercado.",
                  "A Lean Canvas isn't a school document — it's the map for your real decisions. Every block you fill this week is a hypothesis you'll validate with real customers at the market."
                )}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── C38: Pausa activa · Neurociencia (Bloque 6 Cuerpo) ───────────── */}
      {(() => {
        const ejercicios = [
          {
            nombre: lbl("Respiración 4-7-8", "4-7-8 Breathing"),
            icono: "🫁",
            duracion: lbl("2 min", "2 min"),
            instruccion: lbl(
              "Inhala 4 seg → aguanta 7 seg → exhala 8 seg. Repite 3 veces. Activa el sistema nervioso parasimpático y reduce el cortisol.",
              "Inhale 4s → hold 7s → exhale 8s. Repeat 3 times. Activates the parasympathetic nervous system and reduces cortisol."
            ),
          },
          {
            nombre: lbl("Estiramiento cervical", "Neck stretch"),
            icono: "🧘",
            duracion: lbl("90 seg", "90 sec"),
            instruccion: lbl(
              "Inclina la cabeza hacia el hombro derecho 15 seg, luego izquierdo 15 seg. Repite 3 veces. Aumenta el flujo sanguíneo a la corteza prefrontal.",
              "Tilt head to right shoulder 15s, then left 15s. Repeat 3 times. Increases blood flow to the prefrontal cortex."
            ),
          },
          {
            nombre: lbl("Movimiento ocular 20-20-20", "20-20-20 eye rule"),
            icono: "👁️",
            duracion: lbl("1 min", "1 min"),
            instruccion: lbl(
              "Cada 20 min de pantalla, mira a 6 metros de distancia durante 20 seg. Reduce la fatiga de los músculos ciliares y mejora la concentración sostenida.",
              "Every 20 min of screen time, look 6 meters away for 20 seconds. Reduces ciliary muscle fatigue and improves sustained focus."
            ),
          },
        ];

        const ej = ejercicios[pausaEjercicioIdx];

        return (
          <div className={`rounded-2xl border p-4 mb-5 transition-all ${pausaHecha ? "bg-success-light border-success/30" : "bg-warning-light border-warning/30"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl leading-none">{pausaHecha ? "✅" : "⏱️"}</span>
                <div>
                  <h4 className="text-[12px] font-bold text-text-primary">
                    {pausaHecha
                      ? lbl("Pausa completada · Buen trabajo", "Break done · Great job")
                      : lbl("Pausa activa recomendada · ~90 min de pantalla", "Active break recommended · ~90 min of screen time")}
                  </h4>
                  <p className="text-[10px] text-text-secondary leading-snug">
                    {pausaHecha
                      ? lbl("Tu corteza prefrontal lleva 2 min recuperándose. Vuelve a la tarea con mejor foco.", "Your prefrontal cortex has been recovering for 2 min. Return with better focus.")
                      : lbl("Tu corteza prefrontal necesita 2 min de movimiento para mantener el foco profundo.", "Your prefrontal cortex needs 2 min of movement to maintain deep focus.")}
                  </p>
                </div>
              </div>
              {!pausaHecha && (
                <button
                  onClick={() => setShowPausaDetalle((v) => !v)}
                  className="text-[10px] font-bold text-warning bg-white/70 px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-95 transition-all flex-shrink-0"
                >
                  {showPausaDetalle ? lbl("Ocultar", "Hide") : lbl("Ver ejercicio", "View exercise")}
                </button>
              )}
            </div>

            {showPausaDetalle && !pausaHecha && (
              <div className="mt-3 bg-white/60 rounded-xl px-3 py-3 border border-warning/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{ej.icono}</span>
                    <span className="text-[12px] font-bold text-text-primary">{ej.nombre}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-warning-light text-warning font-semibold">{ej.duracion}</span>
                  </div>
                  <button
                    onClick={() => setPausaEjercicioIdx((i) => (i + 1) % ejercicios.length)}
                    className="text-[9px] text-text-muted hover:text-text-secondary cursor-pointer transition-all"
                  >
                    {lbl("Cambiar →", "Switch →")}
                  </button>
                </div>
                <p className="text-[10px] text-text-secondary leading-relaxed mb-3">{ej.instruccion}</p>
                <button
                  onClick={() => { setPausaHecha(true); setShowPausaDetalle(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-success text-white text-[11px] font-bold py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all"
                >
                  <CheckCircle2 size={12} />
                  {lbl("Pausa completada ✓", "Break completed ✓")}
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── S34: Siguiente proyecto — adelanto T2 ────────────────────────── */}
      <div className="bg-card rounded-2xl border border-card-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sidebar flex items-center justify-center flex-shrink-0">
              <Rocket size={14} className="text-accent" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-primary leading-tight">
                {lbl("Siguiente proyecto", "Next project")}
              </h2>
              <p className="text-[10px] text-text-muted">{lbl("T2 · Trimestre 2 · Ya disponible", "T2 · Term 2 · Now available")}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-sidebar bg-accent-light px-2.5 py-1 rounded-full">
            {lbl("Nuevo", "New")}
          </span>
        </div>

        {/* Project card */}
        <div className="rounded-xl bg-sidebar text-white p-4 mb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[10px] font-semibold text-accent mb-0.5">{lbl("Proyecto T2", "Project T2")}</p>
              <h3 className="text-[14px] font-bold leading-tight">
                {lbl("Diseña tu Food Truck", "Design your Food Truck")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[18px]">🚚</span>
            </div>
          </div>
          <p className="text-[10px] text-white/70 leading-relaxed mb-3">
            {lbl(
              "Crea un concepto de food truck sostenible: marca, menú, modelo financiero y estrategia de localización en Málaga.",
              "Create a sustainable food truck concept: brand, menu, financial model and location strategy in Málaga."
            )}
          </p>
          <div className="flex items-center gap-2">
            {["CE", "CD", "STEM", "CLC"].map((comp) => (
              <span key={comp} className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">{comp}</span>
            ))}
          </div>
        </div>

        {/* 3 early-unlock tasks */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Zap size={11} className="text-[#F59E0B]" />
            <span className="text-[11px] font-semibold text-text-primary">{lbl("3 tareas desbloqueables ya", "3 tasks unlockable now")}</span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: "ft1", text: lbl("Investiga 3 food trucks de referencia",   "Research 3 reference food trucks"),    comp: "STEM", coins: 20, locked: false },
              { id: "ft2", text: lbl("Elige tu concepto gastronómico y nombre", "Choose your food concept and name"),   comp: "CE",   coins: 25, locked: false },
              { id: "ft3", text: lbl("Primer boceto del logo y colores",         "First logo sketch and color palette"), comp: "CCEC", coins: 30, locked: true  },
            ].map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${
                  task.locked
                    ? "border-border bg-background opacity-60"
                    : "border-accent/30 bg-accent-light"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  task.locked ? "bg-border" : "bg-accent-dark"
                }`}>
                  {task.locked
                    ? <Lock size={9} className="text-text-muted" />
                    : <Zap size={9} className="text-white" />
                  }
                </div>
                <span className={`text-[11px] font-medium flex-1 leading-tight ${task.locked ? "text-text-muted" : "text-text-primary"}`}>
                  {task.text}
                </span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-sidebar/10 text-sidebar flex-shrink-0">{task.comp}</span>
                <span className="text-[10px] font-bold text-[#F59E0B] flex-shrink-0">+{task.coins}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills to develop */}
        <div className="rounded-xl bg-background border border-card-border p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Brain size={11} className="text-accent-text" />
            <span className="text-[11px] font-semibold text-text-primary">{lbl("Habilidades a desarrollar", "Skills to develop")}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              lbl("Branding", "Branding"),
              lbl("Costes variables", "Variable costs"),
              lbl("Marketing local", "Local marketing"),
              lbl("Pitch visual", "Visual pitch"),
              lbl("Lean Canvas", "Lean Canvas"),
            ].map((skill) => (
              <span key={skill} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-card border border-card-border text-text-secondary">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button className="w-full mt-3 flex items-center justify-center gap-2 bg-sidebar text-white text-[12px] font-bold py-2.5 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer">
          {lbl("Ver proyecto completo", "View full project")}
          <ArrowRight size={13} />
        </button>
      </div>
      </div>{/* /flex-1 min-w-0 */}

      {/* Right: AI Chat — now fully powered by Gemini */}
      <div className="w-[300px] flex-shrink-0">
        <TeacherChat role="student" />
      </div>
    </div>
  );
}
