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

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => {
        if (s <= 1) { setTimerRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

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
                  {currentStudent.streak}-day streak
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
                Hoy
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
                Semana
              </button>
            </div>
          </div>

          <h1 className="text-[42px] font-semibold text-text-primary leading-[1.15]">
            {viewMode === "today" ? "Misión de Hoy" : "Tu Semana"}
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
                Ver Proyecto
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
              Next: {playerLevel.nextTitle}
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
              ¡Simulador de subida de nivel!
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
              You&apos;re {progressPercent}% through today
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
                <span className="text-[10px] text-white/50 font-medium">Llevas 90 min en pantalla</span>
              </div>
            </div>
            <p className="text-[13px] text-white/85 leading-relaxed mb-1 pr-10">
              Tu cerebro necesita un descanso activo. La neurociencia muestra que el movimiento libera BDNF (Factor Neurotrófico Derivado del Cerebro), mejorando la memoria y la concentración hasta un 20% en las siguientes 2 horas.
            </p>
            <p className="text-[11px] text-white/40 mb-4 italic">Muévete 10 minutos → más capacidad cognitiva para el resto del día.</p>
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
                  {timerRunning ? "Pausar" : "Iniciar"}
                </button>
              </div>
              <button
                onClick={() => { setShowCuerpoWidget(false); setTimerRunning(false); setTimerSeconds(600); }}
                className="px-4 py-2.5 bg-accent text-sidebar text-[12px] font-bold rounded-xl hover:brightness-110 transition-all cursor-pointer"
              >
                ✓ Volver al trabajo
              </button>
            </div>
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
                  Flash Mission
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
                  Accept Mission
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
                    Mission Active
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
                      ? "Completed"
                      : selectedTask.status === "in_progress"
                      ? "In Progress"
                      : "Up Next"}
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
                Open Task Workspace
                <ChevronRight size={16} />
              </button>
            )}

            {/* CD3: Tool Choice Selector — only for in_progress tasks */}
            {selectedTask.status === "in_progress" && (
              <div className="border-t border-card-border pt-4">
                <span className="text-[11px] font-medium text-text-muted block mb-2.5">
                  Choose your tool
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
                  Unlocks after current task
                </span>
              </div>
            )}
          </div>
        )}

        {/* Summary section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-semibold text-text-primary">
            Summary
          </h2>
          <div className="flex items-center gap-1 bg-background rounded-xl p-1">
            <span className="px-3 py-1.5 rounded-lg text-[11px] text-text-muted font-medium">
              Daily
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-text-primary bg-white shadow-sm">
              Weekly
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] text-text-muted font-medium">
              Monthly
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
                Your currency, your choices
              </span>
            </div>
          </div>

          {/* XP This Week */}
          <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="text-accent-text" />
              <span className="text-[11px] text-text-muted font-medium">
                XP Earned
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
                Streak
              </span>
            </div>
            <div>
              <span className="text-[28px] font-bold text-text-primary block leading-none">
                {currentStudent.streak}
              </span>
              <span className="text-[10px] text-warning font-medium mt-1 block">
                Keep it alive!
              </span>
            </div>
          </div>

          {/* Evidences */}
          <div className="bg-sidebar rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <FileText size={13} className="text-accent" />
              <span className="text-[11px] text-white/50 font-medium">
                Evidences
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
                Your Tribe
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
              <h2 className="text-[20px] font-semibold text-text-primary">Profesional Invitado</h2>
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
                  <p className="text-[11px] text-text-muted">{profesionalInvitado.empresa} · {profesionalInvitado.años} años de experiencia</p>
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
                  <span className="text-[10px] font-bold text-accent-text uppercase tracking-wide">Conectado a tu proyecto</span>
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
                  <span className="text-[12px] font-semibold text-text-primary">Pregunta de reflexión de Marta</span>
                </div>
                <span className="text-[10px] text-accent-text font-bold group-hover:underline">
                  {showPreguntaInvitado ? "Ocultar" : "Ver pregunta"}
                </span>
              </button>

              {showPreguntaInvitado && (
                <div className="mt-3 bg-warning-light rounded-xl px-4 py-3 border border-warning/20">
                  <p className="text-[12px] text-text-primary leading-relaxed italic">
                    &ldquo;{profesionalInvitado.pregunta}&rdquo;
                  </p>
                  <p className="text-[10px] text-text-muted mt-2">
                    Comparte tu respuesta con la Profa. Ana en el chat →
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* S6: Mercado en Tiempo Real */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-text-primary" />
              <h2 className="text-[20px] font-semibold text-text-primary">Mercado en Tiempo Real</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-background text-text-muted text-[10px] font-medium border border-card-border">
              Actualizado hoy, 11 mar 2026
            </span>
          </div>

          {/* Insight IA */}
          <div className="bg-accent-light rounded-xl p-4 border border-accent/20 mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                <span className="text-accent text-[8px] font-bold">IA</span>
              </div>
              <span className="text-[11px] font-semibold text-accent-text">Conectado a: Gestiona tu Airbnb en Málaga</span>
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
                      <span className="text-[10px] text-text-muted">· {t.salario}/año · Competencia</span>
                      <span className="text-[9px] font-bold bg-accent-light text-accent-text px-1.5 py-0.5 rounded-full">{t.comp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        </> /* END TODAY VIEW */}
      </div>

      {/* Right: AI Chat — now fully powered by Gemini */}
      <div className="w-[300px] flex-shrink-0">
        <TeacherChat role="student" />
      </div>
    </div>
  );
}
