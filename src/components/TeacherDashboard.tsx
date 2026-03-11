"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Zap,
  MessageSquare,
  ChevronRight,
  Clock,
  Star,
  Shield,
  Activity,
  WifiOff,
  CalendarClock,
  RefreshCw,
  Bell,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Coins,
  Trophy,
  Copy,
} from "lucide-react";
import { classStudents, teacherAlerts } from "@/data/students";
import TeacherChat from "./TeacherChat";
import CompetencyProgress from "./CompetencyProgress";
import { useLang } from "@/lib/i18n";

const alertConfigBase = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success-light",
    border: "border-success/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning-light",
    border: "border-warning/20",
  },
  urgent: {
    icon: AlertCircle,
    color: "text-urgent",
    bg: "bg-urgent-light",
    border: "border-urgent/20",
  },
};

const statusColors = {
  on_track: "bg-success",
  needs_attention: "bg-urgent",
  excelling: "bg-[#4F8EF7]",
};

// Risk score: combines progress, evidences, and status into a 0-100 score
function getRiskScore(student: (typeof classStudents)[0]): number {
  const progressScore = student.progress;
  const evidenceRate = (student.evidencesSubmitted / 12) * 100;
  const statusBonus =
    student.status === "excelling" ? 15 : student.status === "needs_attention" ? -20 : 0;
  return Math.min(100, Math.max(0, Math.round((progressScore + evidenceRate) / 2 + statusBonus)));
}

// ── T10: Datos de urgencias ────────────────────────────────────────────────
type CompKeyTeacher = "STEM" | "CLC" | "CE" | "CD" | "CPSAA" | "CC" | "CPL" | "CCEC";

const tareasVencidas: { id: string; alumno: string; avatar: string; tarea: string; diasRetraso: number; comp: CompKeyTeacher }[] = [
  { id: "tv1", alumno: "Pablo Ruiz",    avatar: "PR", tarea: "Análisis de mercado",    diasRetraso: 3, comp: "STEM" },
  { id: "tv2", alumno: "Pablo Ruiz",    avatar: "PR", tarea: "Presupuesto inicial",     diasRetraso: 2, comp: "CE" },
  { id: "tv3", alumno: "Tomás Herrera", avatar: "TH", tarea: "Plantillas comunicación", diasRetraso: 1, comp: "CLC" },
];

const alumnosSinLogin: { id: string; nombre: string; avatar: string; diasSinLogin: number; ultimaActividad: string }[] = [
  { id: "asl1", nombre: "Pablo Ruiz",    avatar: "PR", diasSinLogin: 3, ultimaActividad: "Lun 9 mar · 14:22" },
  { id: "asl2", nombre: "Tomás Herrera", avatar: "TH", diasSinLogin: 2, ultimaActividad: "Mar 10 mar · 09:05" },
];

// ── T22: Próximas entregas ─────────────────────────────────────────────────
type EstadoEntrega = "pendiente" | "retrasado" | "entregado";
interface EntregaProxima {
  id: string;
  alumno: string;
  avatar: string;
  tarea: string;
  proyecto: string;
  comp: CompKeyTeacher;
  fechaLimite: string;
  diasRestantes: number;
  estado: EstadoEntrega;
}

const proximasEntregas: EntregaProxima[] = [
  { id: "ep1", alumno: "Pablo Ruiz",        avatar: "PR", tarea: "Análisis de mercado revisado",          proyecto: "Airbnb Málaga",  comp: "STEM", fechaLimite: "Hoy · 23:59",   diasRestantes: 0,  estado: "retrasado" },
  { id: "ep2", alumno: "Sofía Torres",      avatar: "ST", tarea: "Brand board Casa Limón v2",             proyecto: "Airbnb Málaga",  comp: "CCEC", fechaLimite: "Mañana · 18:00", diasRestantes: 1,  estado: "pendiente" },
  { id: "ep3", alumno: "María Santos",      avatar: "MS", tarea: "Traducción listing al inglés",          proyecto: "Airbnb Málaga",  comp: "CPL",  fechaLimite: "Mañana · 23:59", diasRestantes: 1,  estado: "pendiente" },
  { id: "ep4", alumno: "Diego López",       avatar: "DL", tarea: "Modelo financiero — 3 escenarios",      proyecto: "Airbnb Málaga",  comp: "CE",   fechaLimite: "Jue 13 mar",     diasRestantes: 2,  estado: "pendiente" },
  { id: "ep5", alumno: "Ana Martín",        avatar: "AM", tarea: "Landing page Casa Limón publicada",     proyecto: "Airbnb Málaga",  comp: "CD",   fechaLimite: "Vie 14 mar",     diasRestantes: 3,  estado: "pendiente" },
];

// ── T32: Balance Demo Day ──────────────────────────────────────────────────
interface DemoDayScore {
  id: string;
  nombre: string;
  avatar: string;
  criterios: [number, number, number, number]; // A, B, C, D — LOMLOE 1–4
  qCoins: number;
}

const demoDayScores: DemoDayScore[] = [
  { id: "dd1",  nombre: "Ana Martín",       avatar: "AM", criterios: [4, 4, 3, 4], qCoins: 80 },
  { id: "dd2",  nombre: "Sofía Torres",     avatar: "ST", criterios: [4, 3, 4, 4], qCoins: 75 },
  { id: "dd3",  nombre: "Diego López",      avatar: "DL", criterios: [3, 4, 4, 3], qCoins: 70 },
  { id: "dd4",  nombre: "María Santos",     avatar: "MS", criterios: [4, 3, 3, 4], qCoins: 70 },
  { id: "dd5",  nombre: "Carlos Ruiz",      avatar: "CR", criterios: [3, 3, 4, 3], qCoins: 65 },
  { id: "dd6",  nombre: "Isabel Fdez.",     avatar: "IF", criterios: [3, 4, 3, 3], qCoins: 65 },
  { id: "dd7",  nombre: "Lucas Moreno",     avatar: "LM", criterios: [3, 3, 3, 4], qCoins: 60 },
  { id: "dd8",  nombre: "Elena Gutiérrez",  avatar: "EG", criterios: [3, 3, 3, 3], qCoins: 55 },
  { id: "dd9",  nombre: "Miguel Jiménez",   avatar: "MJ", criterios: [2, 3, 3, 3], qCoins: 50 },
  { id: "dd10", nombre: "Laura Sánchez",    avatar: "LS", criterios: [3, 2, 3, 3], qCoins: 50 },
  { id: "dd11", nombre: "Pablo Ruiz",       avatar: "PR", criterios: [2, 2, 3, 2], qCoins: 40 },
  { id: "dd12", nombre: "Tomás Herrera",    avatar: "TH", criterios: [2, 3, 2, 2], qCoins: 35 },
];

export default function TeacherDashboard() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeAlerts, setActiveAlerts] = useState(new Set(teacherAlerts.map((a) => a.id)));
  const [prorrogadas, setProrrogadas] = useState<Set<string>>(new Set());

  // T22 — Próximas entregas
  const [recordadas, setRecordadas] = useState<Set<string>>(new Set());
  const [recordandoId, setRecordandoId] = useState<string | null>(null);

  // T26 — Semana en números
  const [semanaExpanded, setSemanaExpanded] = useState(true);
  const [semanaResumen, setSemanaResumen] = useState<string | null>(null);
  const [generandoResumen, setGenerandoResumen] = useState(false);
  const [resumenCopiado, setResumenCopiado] = useState(false);

  // T32 — Balance Demo Day
  const [cartaEnviada, setCartaEnviada] = useState(false);

  const handleGenerarResumen = async () => {
    if (generandoResumen) return;
    setGenerandoResumen(true);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "narrativa",
          message: "Eres la IA de QHUMA OS. Genera un resumen semanal del docente en exactamente 3 frases para compartir con el equipo directivo. Datos: 7/12 evidencias revisadas, media LOMLOE 3.1/4, 8 alumnos mejoraron esta semana, 2 nuevos errores registrados, 340 Q-Coins distribuidos. El proyecto activo es Airbnb Málaga, 1º ESO. Sé conciso, profesional y destaca los logros más relevantes.",
          history: [],
        }),
      });
      const data = await res.json();
      setSemanaResumen(data.reply ?? "Esta semana el grupo de 1º ESO ha mostrado una evolución positiva: 8 de 12 alumnos mejoraron su nivel LOMLOE, con una media de 3.1 sobre 4. Las 340 Q-Coins distribuidas reflejan el alto nivel de compromiso con el proyecto Airbnb Málaga. Se han identificado 2 nuevos errores de aprendizaje que serán abordados en la próxima sesión de refuerzo.");
    } catch {
      setSemanaResumen("Esta semana el grupo de 1º ESO ha mostrado una evolución positiva: 8 de 12 alumnos mejoraron su nivel LOMLOE, con una media de 3.1 sobre 4. Las 340 Q-Coins distribuidas reflejan el alto nivel de compromiso con el proyecto Airbnb Málaga. Se han identificado 2 nuevos errores de aprendizaje que serán abordados en la próxima sesión de refuerzo.");
    } finally {
      setGenerandoResumen(false);
    }
  };

  const handleCopiarResumen = () => {
    if (!semanaResumen) return;
    navigator.clipboard.writeText(semanaResumen).catch(() => {});
    setResumenCopiado(true);
    setTimeout(() => setResumenCopiado(false), 2000);
  };

  const handleRecordar = (id: string) => {
    if (recordandoId || recordadas.has(id)) return;
    setRecordandoId(id);
    setTimeout(() => {
      setRecordadas((prev) => new Set([...prev, id]));
      setRecordandoId(null);
    }, 900);
  };

  const alertConfig = {
    success: { ...alertConfigBase.success, label: lbl("Éxito", "Success") },
    warning: { ...alertConfigBase.warning, label: lbl("Atención", "Warning") },
    urgent:  { ...alertConfigBase.urgent,  label: lbl("Urgente", "Urgent") },
  };

  function getRiskLabel(score: number): { label: string; color: string; bg: string } {
    if (score >= 80) return { label: lbl("Excelente", "Excellent"), color: "text-[#4F8EF7]", bg: "bg-[#eff6ff]" };
    if (score >= 60) return { label: lbl("En ruta", "On track"),    color: "text-success",   bg: "bg-success-light" };
    if (score >= 40) return { label: lbl("Riesgo medio", "Medium risk"), color: "text-warning", bg: "bg-warning-light" };
    return { label: lbl("Riesgo alto", "High risk"), color: "text-urgent", bg: "bg-urgent-light" };
  }

  const excelling = classStudents.filter((s) => s.status === "excelling").length;
  const onTrack = classStudents.filter((s) => s.status === "on_track").length;
  const needsAttention = classStudents.filter((s) => s.status === "needs_attention").length;
  const totalEvidences = classStudents.reduce((sum, s) => sum + s.evidencesSubmitted, 0);
  const avgProgress = Math.round(
    classStudents.reduce((sum, s) => sum + s.progress, 0) / classStudents.length
  );

  const selectedStudent = selectedStudentId
    ? classStudents.find((s) => s.id === selectedStudentId)
    : null;

  const visibleAlerts = teacherAlerts.filter((a) => activeAlerts.has(a.id));

  return (
    <div className="flex gap-5">
      {/* Main content */}
      <div className="flex-1 min-w-0">

        {/* T26: Semana en números ───────────────────────────────── */}
        {(() => {
          const semanaStats = [
            {
              icon: FileText,
              label: lbl("Evidencias revisadas", "Evidence reviewed"),
              valor: "7/12",
              trend: +17,
              color: "text-accent-text",
              bg: "bg-accent-light",
            },
            {
              icon: BarChart3,
              label: lbl("Media nivel LOMLOE", "Avg LOMLOE level"),
              valor: "3.1",
              trend: +5,
              color: "text-[#4F8EF7]",
              bg: "bg-[#eff6ff]",
            },
            {
              icon: TrendingUp,
              label: lbl("Alumnos que mejoraron", "Students improved"),
              valor: "8",
              trend: +33,
              color: "text-success",
              bg: "bg-success-light",
            },
            {
              icon: AlertCircle,
              label: lbl("Nuevos errores registrados", "New errors logged"),
              valor: "2",
              trend: -50,
              color: "text-warning",
              bg: "bg-warning-light",
            },
            {
              icon: Coins,
              label: lbl("Q-Coins distribuidas", "Q-Coins distributed"),
              valor: "340",
              trend: +13,
              color: "text-accent-text",
              bg: "bg-accent-light",
            },
          ];
          return (
            <div className="bg-card rounded-2xl border border-card-border mb-5">
              <button
                onClick={() => setSemanaExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Trophy size={15} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">
                    {lbl("Semana en números", "Week in numbers")}
                  </h3>
                  <span className="text-[10px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full ml-1">
                    {lbl("Semana 3 · 10–14 mar", "Week 3 · Mar 10–14")}
                  </span>
                </div>
                {semanaExpanded
                  ? <ChevronUp size={14} className="text-text-muted group-hover:text-text-primary transition-colors" />
                  : <ChevronDown size={14} className="text-text-muted group-hover:text-text-primary transition-colors" />}
              </button>

              {semanaExpanded && (
                <div className="px-5 pb-5">
                  {/* Stats grid */}
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {semanaStats.map((stat) => {
                      const Icon = stat.icon;
                      const isPositive = stat.trend > 0;
                      const TrendIcon = isPositive ? TrendingUp : TrendingDown;
                      const trendColor = stat.label === lbl("Nuevos errores registrados", "New errors logged")
                        ? (isPositive ? "text-urgent" : "text-success")
                        : (isPositive ? "text-success" : "text-urgent");
                      return (
                        <div key={stat.label} className={`rounded-xl p-3.5 ${stat.bg}`}>
                          <div className="flex items-center justify-between mb-2">
                            <Icon size={13} className={stat.color} />
                            <div className={`flex items-center gap-0.5 ${trendColor}`}>
                              <TrendIcon size={9} />
                              <span className="text-[9px] font-bold">{Math.abs(stat.trend)}%</span>
                            </div>
                          </div>
                          <span className="text-[22px] font-bold text-text-primary block leading-none mb-1">
                            {stat.valor}
                          </span>
                          <span className="text-[9px] text-text-muted leading-tight block">{stat.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI summary */}
                  {semanaResumen && (
                    <div className="bg-accent-light rounded-xl p-4 border border-accent-text/10 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                          <span className="text-accent text-[9px] font-bold">AI</span>
                        </div>
                        <span className="text-[11px] font-semibold text-accent-text">
                          {lbl("Resumen narrativo generado", "Generated narrative summary")}
                        </span>
                      </div>
                      <p className="text-[12px] text-text-primary leading-relaxed">{semanaResumen}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleGenerarResumen}
                      disabled={generandoResumen}
                      className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-semibold px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                    >
                      {generandoResumen
                        ? <><RefreshCw size={11} className="animate-spin" /> {lbl("Generando…", "Generating…")}</>
                        : <><Brain size={11} /> {lbl("Generar resumen narrativo", "Generate narrative summary")}</>}
                    </button>
                    {semanaResumen && (
                      <button
                        onClick={handleCopiarResumen}
                        className={`flex items-center gap-1.5 text-[11px] font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all border ${
                          resumenCopiado
                            ? "bg-success-light text-success border-success/20"
                            : "bg-card text-text-secondary border-card-border hover:border-accent-text/30"
                        }`}
                      >
                        {resumenCopiado
                          ? <><CheckCircle2 size={11} /> {lbl("¡Copiado!", "Copied!")}</>
                          : <><Copy size={11} /> {lbl("Compartir con equipo directivo", "Share with leadership")}</>}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Hero — Buenos días + clase pulse */}
        <div
          className="rounded-2xl p-6 mb-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--sidebar) 0%, var(--accent-dark) 100%)" }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
            <Brain size={160} className="text-accent" />
          </div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                  {lbl("Miércoles, 15 enero · Semana 3 de 12", "Wednesday, Jan 15 · Week 3 of 12")}
                </span>
              </div>
              <h1 className="text-[28px] font-bold text-white leading-tight mb-1">
                {lbl("Buenos días, Ana ✨", "Good morning, Ana ✨")}
              </h1>
              <p className="text-[14px] text-white/70">
                1º ESO ·{" "}
                <span className="font-semibold text-accent">Gestiona tu Airbnb en Málaga</span>
                {" "}· Fase 2: Construcción Digital
              </p>
            </div>
            {/* SVG Health Ring */}
            {(() => {
              const total = classStudents.length;
              const r = 38;
              const C = 2 * Math.PI * r;
              const exArc = (excelling / total) * C;
              const otArc = (onTrack / total) * C;
              const naArc = (needsAttention / total) * C;
              const healthPct = Math.round(((excelling + onTrack) / total) * 100);
              return (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                      {excelling > 0 && (
                        <circle cx="48" cy="48" r={r} fill="none" stroke="#c3f499" strokeWidth="10"
                          strokeDasharray={`${exArc} ${C}`} strokeDashoffset="0" strokeLinecap="butt" />
                      )}
                      {onTrack > 0 && (
                        <circle cx="48" cy="48" r={r} fill="none" stroke="#22c55e" strokeWidth="10"
                          strokeDasharray={`${otArc} ${C}`} strokeDashoffset={`${-exArc}`} strokeLinecap="butt" />
                      )}
                      {needsAttention > 0 && (
                        <circle cx="48" cy="48" r={r} fill="none" stroke="#f59e0b" strokeWidth="10"
                          strokeDasharray={`${naArc} ${C}`} strokeDashoffset={`${-(exArc + otArc)}`} strokeLinecap="butt" />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[18px] font-bold text-white leading-none">{healthPct}%</span>
                      <span className="text-[8px] text-white/50 mt-0.5">{lbl("salud", "health")}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-[11px] text-white/80 font-medium">{excelling} {lbl("brillando", "excelling")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                      <span className="text-[11px] text-white/80 font-medium">{onTrack} {lbl("en ruta", "on track")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />
                      <span className="text-[11px] text-white/80 font-medium">{needsAttention} {lbl("necesitan ayuda", "need help")}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={10} className="text-accent" />
                      <span className="text-[10px] text-accent font-semibold">{lbl("+4% vs semana pasada", "+4% vs last week")}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Avatar groups + quick action */}
          <div className="mt-4 relative z-10 flex items-center gap-4">
            {[
              { label: lbl("Brillando", "Excelling"), students: classStudents.filter(s => s.status === "excelling"), color: "bg-accent", ring: "ring-accent/40" },
              { label: lbl("En ruta", "On track"),    students: classStudents.filter(s => s.status === "on_track"),   color: "bg-success", ring: "ring-success/40" },
              { label: lbl("Apoyo", "Support"),        students: classStudents.filter(s => s.status === "needs_attention"), color: "bg-warning", ring: "ring-warning/40" },
            ].map((group) => (
              <div key={group.label} className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {group.students.slice(0, 4).map((s) => (
                    <div key={s.id}
                      className={`w-6 h-6 rounded-full ${group.color} text-white text-[8px] font-bold flex items-center justify-center ring-1 ${group.ring} flex-shrink-0`}
                      title={s.name}
                    >
                      {s.avatar}
                    </div>
                  ))}
                  {group.students.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-white/20 text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white/20">
                      +{group.students.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-white/60">{group.label}</span>
              </div>
            ))}
            <div className="ml-auto">
              <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-all text-white text-[10px] font-semibold px-3 py-1.5 rounded-xl cursor-pointer border border-white/10">
                <MessageSquare size={11} />
                {lbl("Contactar alumnos en riesgo", "Contact at-risk students")}
              </button>
            </div>
          </div>
        </div>

        {/* Two columns: Alerts + Quick Actions */}
        <div className="grid grid-cols-3 gap-5 mb-5">

          {/* Alerts — 2/3 width */}
          <div className="col-span-2 bg-card rounded-2xl p-5 border border-card-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">
                  {lbl("Alertas de intervención", "Intervention alerts")}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {visibleAlerts.filter((a) => a.type === "urgent").length > 0 && (
                  <span className="text-[10px] bg-urgent-light text-urgent rounded-full px-2 py-0.5 font-bold">
                    {visibleAlerts.filter((a) => a.type === "urgent").length} {lbl("urgente", "urgent")}
                  </span>
                )}
                {visibleAlerts.filter((a) => a.type === "warning").length > 0 && (
                  <span className="text-[10px] bg-warning-light text-warning rounded-full px-2 py-0.5 font-bold">
                    {visibleAlerts.filter((a) => a.type === "warning").length} {lbl("atención", "warning")}
                  </span>
                )}
              </div>
            </div>

            {visibleAlerts.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 size={28} className="text-success mb-2" />
                <p className="text-[13px] font-semibold text-text-primary">{lbl("Todo en orden", "All clear")}</p>
                <p className="text-[11px] text-text-muted">{lbl("No hay alertas pendientes", "No pending alerts")}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {visibleAlerts.map((alert) => {
                  const config = alertConfig[alert.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${config.border} ${config.bg} transition-all`}
                    >
                      <Icon size={15} className={`${config.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[12px] font-semibold text-text-primary">
                            {alert.student}
                          </span>
                          <span className="text-[9px] text-text-muted bg-white/60 px-1.5 py-0.5 rounded-full">
                            {config.label}
                          </span>
                          <span className="text-[10px] text-text-muted ml-auto">{alert.time}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          className="text-[10px] font-semibold text-accent-text bg-white hover:bg-accent-light transition-colors px-2.5 py-1 rounded-lg cursor-pointer border border-accent/20"
                        >
                          <MessageSquare size={11} className="inline mr-1" />
                          {lbl("Mensaje", "Message")}
                        </button>
                        <button
                          onClick={() =>
                            setActiveAlerts((prev) => {
                              const next = new Set(prev);
                              next.delete(alert.id);
                              return next;
                            })
                          }
                          className="text-[10px] font-semibold text-text-muted hover:text-text-primary bg-white hover:bg-background transition-colors px-2 py-1 rounded-lg cursor-pointer"
                        >
                          ✓
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions — 1/3 width */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Acciones rápidas", "Quick actions")}</h3>
            {[
              {
                icon: FileText,
                label: lbl("Informe LOMLOE", "LOMLOE Report"),
                desc: lbl("Genera el informe trimestral", "Generate quarterly report"),
                color: "text-accent-text",
                bg: "bg-accent-light",
              },
              {
                icon: Brain,
                label: lbl("Análisis IA", "AI Analysis"),
                desc: lbl("Detección de brechas por competencia", "Gap detection by competency"),
                color: "text-[#4F8EF7]",
                bg: "bg-[#eff6ff]",
              },
              {
                icon: Zap,
                label: lbl("Misión Flash", "Flash Mission"),
                desc: lbl("Asignar a toda la clase", "Assign to whole class"),
                color: "text-warning",
                bg: "bg-warning-light",
              },
              {
                icon: Shield,
                label: lbl("Plan de apoyo", "Support plan"),
                desc: lbl("Para alumnos en riesgo", "For at-risk students"),
                color: "text-urgent",
                bg: "bg-urgent-light",
              },
            ].map((action, i) => (
              <button
                key={i}
                className="bg-card rounded-xl p-3.5 border border-card-border hover:border-accent-text/20 hover:shadow-sm transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0`}>
                    <action.icon size={14} className={action.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-semibold text-text-primary block truncate">
                      {action.label}
                    </span>
                    <span className="text-[10px] text-text-muted truncate block">{action.desc}</span>
                  </div>
                  <ChevronRight size={12} className="text-text-muted group-hover:text-accent-text transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* T10: Panel de urgencias ────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-5 mb-5">

          {/* Tareas vencidas agrupadas por alumno */}
          <div className="bg-card rounded-2xl p-5 border border-card-border">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock size={14} className="text-urgent" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Tareas vencidas hoy", "Tasks due today")}</h3>
              <span className="ml-auto text-[9px] font-bold bg-urgent-light text-urgent px-2 py-0.5 rounded-full">
                {tareasVencidas.filter(t => !prorrogadas.has(t.id)).length} {lbl("pendientes", "pending")}
              </span>
            </div>
            {tareasVencidas.length === 0 ? (
              <div className="flex items-center gap-2 py-3 text-center justify-center">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-[12px] text-text-muted">{lbl("Sin entregas vencidas", "No overdue submissions")}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Agrupamos por alumno */}
                {Array.from(new Set(tareasVencidas.map(t => t.alumno))).map((alumno) => {
                  const tareas = tareasVencidas.filter(t => t.alumno === alumno);
                  const av = tareas[0].avatar;
                  return (
                    <div key={alumno} className="bg-background rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {av}
                        </div>
                        <span className="text-[12px] font-semibold text-text-primary">{alumno}</span>
                        <span className="ml-auto text-[9px] text-text-muted">{tareas.length} {lbl("tarea", "task")}{tareas.length > 1 ? lbl("s", "s") : ""}</span>
                      </div>
                      <div className="space-y-1.5">
                        {tareas.map((t) => (
                          <div key={t.id} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all ${
                            prorrogadas.has(t.id) ? "bg-accent-light border border-accent/20" : "bg-urgent-light border border-urgent/10"
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${prorrogadas.has(t.id) ? "bg-accent-text" : "bg-urgent"}`} />
                            <span className="text-[10px] text-text-secondary flex-1 leading-snug">{t.tarea}</span>
                            <span className="text-[9px] font-bold text-text-muted flex-shrink-0">{t.comp}</span>
                            <span className={`text-[8px] font-semibold flex-shrink-0 ${prorrogadas.has(t.id) ? "text-accent-text" : "text-urgent"}`}>
                              {t.diasRetraso}d
                            </span>
                            {prorrogadas.has(t.id) ? (
                              <span className="text-[8px] font-bold text-accent-text flex-shrink-0">+48h ✓</span>
                            ) : (
                              <button
                                onClick={() => setProrrogadas(prev => new Set([...prev, t.id]))}
                                className="flex items-center gap-0.5 text-[8px] font-bold text-accent-text bg-white px-1.5 py-0.5 rounded-md hover:bg-accent-light transition-colors cursor-pointer border border-accent/20 flex-shrink-0"
                              >
                                <RefreshCw size={7} />
                                +48h
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Alumnos sin login más de 2 días */}
          <div className="bg-card rounded-2xl p-5 border border-card-border">
            <div className="flex items-center gap-2 mb-4">
              <WifiOff size={14} className="text-warning" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Sin acceso a plataforma", "No platform access")}</h3>
              <span className="ml-auto text-[9px] font-bold bg-warning-light text-warning px-2 py-0.5 rounded-full">
                {alumnosSinLogin.length} {lbl("alumnos", "students")}
              </span>
            </div>
            <div className="space-y-2.5 mb-4">
              {alumnosSinLogin.map((a) => (
                <div key={a.id} className="flex items-center gap-3 bg-warning-light rounded-xl px-3 py-2.5 border border-warning/15">
                  <div className="w-8 h-8 rounded-full bg-sidebar text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-text-primary">{a.nombre}</p>
                    <p className="text-[10px] text-text-muted">{lbl("Última actividad:", "Last activity:")} {a.ultimaActividad}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[11px] font-bold text-warning">{a.diasSinLogin} {lbl("días", "days")}</span>
                    <button className="flex items-center gap-1 text-[9px] font-bold text-accent-text bg-white px-2 py-0.5 rounded-lg hover:bg-accent-light border border-accent/20 cursor-pointer transition-colors">
                      <MessageSquare size={9} />
                      {lbl("Contactar", "Contact")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-background rounded-xl p-3 border border-card-border">
              <p className="text-[10px] text-text-muted leading-relaxed">
                <span className="font-semibold text-text-secondary">Protocolo QHUMA:</span> Si un alumno lleva más de 3 días sin acceder, el sistema notifica automáticamente a la familia. Los datos se envían al informe de seguimiento mensual.
              </p>
            </div>
          </div>
        </div>

        {/* T22: Próximas entregas ─────────────────────────────────── */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList size={15} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Próximas entregas", "Upcoming submissions")}</h3>
            </div>
            <div className="flex items-center gap-2">
              {proximasEntregas.filter((e) => e.estado === "retrasado").length > 0 && (
                <span className="text-[9px] font-bold bg-urgent-light text-urgent px-2 py-0.5 rounded-full">
                  {proximasEntregas.filter((e) => e.estado === "retrasado").length} {lbl("retrasada", "overdue")}
                </span>
              )}
              <span className="text-[9px] font-bold bg-warning-light text-warning px-2 py-0.5 rounded-full">
                {proximasEntregas.filter((e) => e.estado === "pendiente").length} {lbl("pendientes", "pending")}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {proximasEntregas.map((entrega) => {
              const isRecordada = recordadas.has(entrega.id);
              const isRecordando = recordandoId === entrega.id;
              const diasBadge =
                entrega.diasRestantes === 0
                  ? { label: lbl("Hoy", "Today"), color: "bg-urgent-light text-urgent border border-urgent/20" }
                  : entrega.diasRestantes === 1
                  ? { label: lbl("Mañana", "Tomorrow"), color: "bg-warning-light text-warning border border-warning/20" }
                  : { label: `${entrega.diasRestantes}d`, color: "bg-success-light text-success border border-success/20" };
              const estadoBg =
                entrega.estado === "retrasado" ? "border-urgent/20 bg-urgent-light" :
                entrega.estado === "pendiente" ? "border-card-border bg-background" :
                "border-success/20 bg-success-light";
              return (
                <div key={entrega.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all ${estadoBg}`}>
                  <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {entrega.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[12px] font-semibold text-text-primary">{entrega.alumno}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 text-text-muted border border-card-border">
                        {entrega.comp}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-secondary truncate">{entrega.tarea}</p>
                    <p className="text-[9px] text-text-muted">{entrega.fechaLimite}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${diasBadge.color}`}>
                    {diasBadge.label}
                  </span>
                  {isRecordada ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-success flex-shrink-0">
                      <CheckCircle2 size={11} />
                      {lbl("Enviado", "Sent")}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRecordar(entrega.id)}
                      disabled={!!recordandoId}
                      className="flex items-center gap-1 text-[9px] font-bold text-accent-text bg-white hover:bg-accent-light border border-accent/20 px-2 py-1 rounded-lg cursor-pointer transition-all flex-shrink-0 disabled:opacity-50"
                    >
                      {isRecordando ? (
                        <RefreshCw size={9} className="animate-spin" />
                      ) : (
                        <Bell size={9} />
                      )}
                      {isRecordando ? lbl("Enviando…", "Sending…") : lbl("Recordar", "Remind")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-2.5 bg-background rounded-xl border border-card-border">
            <p className="text-[10px] text-text-muted leading-relaxed">
              <span className="font-semibold text-text-secondary">Nota:</span> {lbl("El recordatorio se envía por email y notificación push. El alumno recibe el aviso con el nombre de la tarea y la fecha límite exacta.", "Reminder sent via email and push notification with task name and exact deadline.")}
            </p>
          </div>
        </div>

        {/* Student Grid with Risk Scoring */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">
                {lbl("Seguimiento individual", "Individual tracking")}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {[
                { color: "bg-[#4F8EF7]", label: lbl("Brillando", "Excelling") },
                { color: "bg-success",   label: lbl("En ruta", "On track") },
                { color: "bg-warning",   label: lbl("Riesgo", "Risk") },
                { color: "bg-urgent",    label: lbl("Urgente", "Urgent") },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-[10px] text-text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {classStudents.map((student) => {
              const riskScore = getRiskScore(student);
              const riskInfo = getRiskLabel(riskScore);
              const isSelected = selectedStudentId === student.id;

              const trendIcon =
                student.progress > 70
                  ? TrendingUp
                  : student.progress > 50
                  ? Minus
                  : TrendingDown;
              const trendColor =
                student.progress > 70
                  ? "text-success"
                  : student.progress > 50
                  ? "text-text-muted"
                  : "text-urgent";

              return (
                <button
                  key={student.id}
                  onClick={() =>
                    setSelectedStudentId(isSelected ? null : student.id)
                  }
                  className={`text-left rounded-xl p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent-light shadow-sm"
                      : "border-card-border hover:border-accent/40 hover:bg-background"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary">
                        {student.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusColors[student.status]}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold text-text-primary block truncate">
                        {student.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {(() => {
                          const TrendComp = trendIcon;
                          return <TrendComp size={9} className={trendColor} />;
                        })()}
                        <span className="text-[9px] text-text-muted truncate">
                          {student.currentTask}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-text-primary flex-shrink-0">
                      {student.progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-border overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusColors[student.status]}`}
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>

                  {/* Risk badge + evidences */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${riskInfo.bg} ${riskInfo.color}`}>
                      {riskInfo.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <FileText size={9} className="text-text-muted" />
                      <span className="text-[9px] text-text-muted">
                        {student.evidencesSubmitted}/12
                      </span>
                    </div>
                  </div>

                  {/* Expanded detail on selection */}
                  {isSelected && (
                    <div className="mt-2.5 pt-2.5 border-t border-accent/20">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-text-muted">{lbl("Puntuación IA", "AI score")}</span>
                          <span className="text-[10px] font-bold text-accent-text">{riskScore}/100</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button className="flex-1 text-[9px] font-semibold text-accent-text bg-white rounded-lg py-1.5 hover:bg-accent-light transition-colors cursor-pointer border border-accent/30">
                            <MessageSquare size={9} className="inline mr-1" />
                            Chat
                          </button>
                          <button className="flex-1 text-[9px] font-semibold text-white bg-sidebar rounded-lg py-1.5 hover:bg-accent-dark transition-colors cursor-pointer">
                            <Star size={9} className="inline mr-1" />
                            {lbl("Perfil", "Profile")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── T32: Balance Demo Day ─────────────────────────────────────────── */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-[#F59E0B]" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Balance Demo Day", "Demo Day Results")}</h3>
              <span className="text-[10px] font-semibold text-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                T1 · Airbnb Málaga
              </span>
            </div>
            <button
              onClick={() => { setCartaEnviada(true); setTimeout(() => setCartaEnviada(false), 3000); }}
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                cartaEnviada
                  ? "bg-success text-white"
                  : "bg-sidebar text-white hover:bg-accent-dark"
              }`}
            >
              {cartaEnviada
                ? <><CheckCircle2 size={11} className="mr-1" />{lbl("Cartas enviadas", "Letters sent!")}</>
                : <><Star size={11} className="mr-1" />{lbl("Carta de felicitación", "Send congrats")}</>
              }
            </button>
          </div>

          {/* Score table */}
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-[10px]">
              <thead>
                <tr>
                  <th className="text-left text-text-muted font-medium pb-2 pr-3">{lbl("Alumno", "Student")}</th>
                  {["A", "B", "C", "D"].map((c) => (
                    <th key={c} className="text-center text-text-muted font-medium pb-2 px-2 w-8">{c}</th>
                  ))}
                  <th className="text-center text-text-muted font-medium pb-2 px-2">{lbl("Media", "Avg")}</th>
                  <th className="text-center text-[#F59E0B] font-semibold pb-2 pl-2">Q</th>
                </tr>
              </thead>
              <tbody>
                {demoDayScores.map((s) => {
                  const sum = s.criterios.reduce((a, b) => a + b, 0);
                  const avg = sum / 4;
                  const avgStr = avg.toFixed(1);
                  const avgColor = avg >= 3.5 ? "text-[#4F8EF7] font-bold" : avg >= 2.5 ? "text-success font-semibold" : "text-warning";
                  return (
                    <tr key={s.id} className="border-t border-border/40">
                      <td className="py-1.5 pr-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-sidebar text-white text-[7px] font-bold flex items-center justify-center flex-shrink-0">
                            {s.avatar}
                          </div>
                          <span className="text-text-primary font-medium truncate max-w-[100px]">{s.nombre}</span>
                        </div>
                      </td>
                      {s.criterios.map((v, i) => (
                        <td key={i} className="text-center px-2">
                          <span className={`${v === 4 ? "text-[#4F8EF7] font-bold" : v <= 1 ? "text-urgent" : "text-text-primary"}`}>{v}</span>
                        </td>
                      ))}
                      <td className="text-center px-2">
                        <span className={avgColor}>{avgStr}</span>
                      </td>
                      <td className="text-center pl-2">
                        <span className="text-[#F59E0B] font-semibold">{s.qCoins}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Top 3 performers */}
          {(() => {
            const sorted = [...demoDayScores].sort(
              (a, b) =>
                b.criterios.reduce((s, v) => s + v, 0) -
                a.criterios.reduce((s, v) => s + v, 0)
            );
            const top3 = sorted.slice(0, 3);
            const medalLabels = ["1°", "2°", "3°"];
            const medalBg = ["bg-[#FEF3C7]", "bg-[#F3F4F6]", "bg-[#FDF4E7]"];
            const medalColor = ["text-[#D97706]", "text-[#6B7280]", "text-[#B45309]"];
            return (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Coins size={12} className="text-[#F59E0B]" />
                  <span className="text-[11px] font-semibold text-text-primary">
                    {lbl("Top 3 · Q-Coins distribuidas", "Top 3 · Q-Coins awarded")}
                  </span>
                  <span className="text-[10px] text-text-muted ml-auto">
                    {lbl("Total:", "Total:")} {demoDayScores.reduce((s, d) => s + d.qCoins, 0)} Q
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {top3.map((s, i) => {
                    const avg = (s.criterios.reduce((a, b) => a + b, 0) / 4).toFixed(1);
                    return (
                      <div key={s.id} className={`rounded-xl p-3 text-center ${medalBg[i]}`}>
                        <div className={`text-[13px] font-black mb-1 ${medalColor[i]}`}>{medalLabels[i]}</div>
                        <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[8px] font-bold flex items-center justify-center mx-auto mb-1.5">
                          {s.avatar}
                        </div>
                        <div className="text-[10px] font-semibold text-text-primary truncate">{s.nombre.split(" ")[0]}</div>
                        <div className="text-[9px] text-text-muted">{lbl("Media", "Avg")} {avg}</div>
                        <div className={`text-[11px] font-bold mt-0.5 ${medalColor[i]}`}>+{s.qCoins} Q</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── T39: Radar T2 — Seguimiento semanal de arranque ─────────── */}
        {(() => {
          const t2Alumnos = [
            { nombre: "Lucas García",    avatar: "LG", canvas: true,  presupuesto: true,  equipo: true  },
            { nombre: "Sofía Torres",    avatar: "ST", canvas: true,  presupuesto: true,  equipo: true  },
            { nombre: "Pablo Ruiz",      avatar: "PR", canvas: false, presupuesto: false, equipo: false },
            { nombre: "María Santos",    avatar: "MS", canvas: true,  presupuesto: true,  equipo: true  },
            { nombre: "Diego López",     avatar: "DL", canvas: true,  presupuesto: false, equipo: true  },
            { nombre: "Ana Martín",      avatar: "AM", canvas: true,  presupuesto: true,  equipo: true  },
            { nombre: "Carlos Rivera",   avatar: "CR", canvas: true,  presupuesto: false, equipo: true  },
            { nombre: "Laura Sanz",      avatar: "LS", canvas: true,  presupuesto: true,  equipo: true  },
            { nombre: "Tomás Herrera",   avatar: "TH", canvas: false, presupuesto: false, equipo: false },
            { nombre: "Carla Vega",      avatar: "CV", canvas: true,  presupuesto: true,  equipo: true  },
            { nombre: "Alejandro Pérez", avatar: "AP", canvas: false, presupuesto: false, equipo: true  },
            { nombre: "Valentina Cruz",  avatar: "VC", canvas: true,  presupuesto: true,  equipo: true  },
          ];
          const canvasOk    = t2Alumnos.filter(a => a.canvas).length;
          const presupOk    = t2Alumnos.filter(a => a.presupuesto).length;
          const equiposOk   = [...new Set(t2Alumnos.filter(a => a.equipo).map(a => a.avatar))].length;
          const sinCanvas   = t2Alumnos.filter(a => !a.canvas);

          return (
            <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">
                    {lbl("Radar T2 — Seguimiento de arranque", "T2 Radar — Launch tracking")}
                  </h3>
                </div>
                <span className="text-[9px] bg-accent-light text-accent-text font-bold px-2 py-1 rounded-full">
                  {lbl("Semana 2 de T2", "T2 Week 2")}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mb-4">
                {lbl("Estado de los 3 hitos de arranque por alumno (Lean Canvas · Presupuesto · Equipo).", "Status of the 3 launch milestones per student (Lean Canvas · Budget · Team).")}
              </p>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: lbl("Canvas enviados", "Canvas submitted"), val: `${canvasOk}/12`, bg: canvasOk >= 10 ? "bg-success-light" : "bg-warning-light", txt: canvasOk >= 10 ? "text-success" : "text-warning" },
                  { label: lbl("Presupuestos activos", "Budgets active"), val: `${presupOk}/12`, bg: presupOk >= 8 ? "bg-success-light" : "bg-warning-light", txt: presupOk >= 8 ? "text-success" : "text-warning" },
                  { label: lbl("Alumnos en equipo", "Students in teams"), val: `${equiposOk}/12`, bg: "bg-accent-light", txt: "text-accent-text" },
                ].map((k) => (
                  <div key={k.label} className={`rounded-xl p-3 text-center ${k.bg}`}>
                    <p className={`text-[18px] font-black leading-none ${k.txt}`}>{k.val}</p>
                    <p className="text-[9px] text-text-muted mt-1">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Tabla por alumno */}
              <div className="space-y-1.5 mb-4">
                {t2Alumnos.map((a) => {
                  const hitos = [a.canvas, a.presupuesto, a.equipo];
                  const ok = hitos.filter(Boolean).length;
                  const rowBg = ok === 3 ? "bg-success-light border-success/20" : ok === 0 ? "bg-urgent-light border-urgent/20" : "bg-background border-card-border";
                  return (
                    <div key={a.avatar} className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${rowBg}`}>
                      <div className="w-6 h-6 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-bold text-accent">{a.avatar}</span>
                      </div>
                      <span className="text-[11px] font-medium text-text-primary flex-1 truncate">{a.nombre}</span>
                      {[
                        { v: a.canvas,      l: "Canvas" },
                        { v: a.presupuesto, l: lbl("Presup.", "Budget") },
                        { v: a.equipo,      l: lbl("Equipo", "Team") },
                      ].map((h) => (
                        <span key={h.l} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${h.v ? "bg-success-light text-success" : "bg-border text-text-muted"}`}>
                          {h.v ? "✓" : "·"} {h.l}
                        </span>
                      ))}
                      <span className="text-[9px] font-bold text-text-muted flex-shrink-0 w-8 text-right">{ok}/3</span>
                    </div>
                  );
                })}
              </div>

              {sinCanvas.length > 0 && (
                <div className="bg-urgent-light border border-urgent/20 rounded-xl px-3 py-2.5 flex items-start gap-2">
                  <AlertTriangle size={11} className="text-urgent flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-urgent leading-snug">
                    {lbl(
                      `${sinCanvas.map(a => a.nombre.split(" ")[0]).join(", ")} aún no han enviado el Lean Canvas. Contactar esta semana.`,
                      `${sinCanvas.map(a => a.nombre.split(" ")[0]).join(", ")} haven't submitted their Lean Canvas. Follow up this week.`
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── T40: Revisiones T2 pendientes ─────────────────────────────── */}
        {(() => {
          const [revisados, setRevisados] = useState<Set<string>>(new Set());
          const enviosT2 = [
            { id: "r1", alumno: "Lucas García",    avatar: "LG", tipo: lbl("Canvas",      "Canvas"),  fecha: lbl("Hoy · 09:15",    "Today · 09:15"),    comp: "CE"   },
            { id: "r2", alumno: "Sofía Torres",    avatar: "ST", tipo: lbl("Canvas",      "Canvas"),  fecha: lbl("Hoy · 10:32",    "Today · 10:32"),    comp: "CCEC" },
            { id: "r3", alumno: "Diego López",     avatar: "DL", tipo: lbl("Presupuesto", "Budget"),  fecha: lbl("Ayer · 16:40",   "Yesterday · 16:40"), comp: "STEM" },
            { id: "r4", alumno: "Ana Martín",      avatar: "AM", tipo: lbl("Canvas",      "Canvas"),  fecha: lbl("Ayer · 15:20",   "Yesterday · 15:20"), comp: "CE"   },
            { id: "r5", alumno: "Carla Vega",      avatar: "CV", tipo: lbl("Presupuesto", "Budget"),  fecha: lbl("Mar 10 · 11:05", "Mar 10 · 11:05"),   comp: "CE"   },
          ];
          const revisadasCount = revisados.size;

          return (
            <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ClipboardList size={14} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">
                    {lbl("Revisiones T2 pendientes", "T2 pending reviews")}
                  </h3>
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                  revisadasCount === enviosT2.length ? "bg-success-light text-success" : "bg-warning-light text-warning"
                }`}>
                  {revisadasCount}/{enviosT2.length} {lbl("revisadas", "reviewed")}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mb-4">
                {lbl("Canvas y presupuestos T2 enviados esta semana. Revisa y deja feedback antes del viernes.", "T2 canvases and budgets submitted this week. Review and give feedback before Friday.")}
              </p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-background rounded-full overflow-hidden border border-card-border">
                  <div
                    className="h-full bg-success transition-all duration-500 rounded-full"
                    style={{ width: `${(revisadasCount / enviosT2.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* List */}
              <div className="space-y-2 mb-4">
                {enviosT2.map((e) => {
                  const done = revisados.has(e.id);
                  const isCanvas = e.tipo === lbl("Canvas", "Canvas");
                  return (
                    <div key={e.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                      done ? "bg-success-light border-success/20" : "bg-background border-card-border"
                    }`}>
                      <div className="w-7 h-7 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-accent">{e.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-text-primary truncate">{e.alumno}</p>
                        <p className="text-[10px] text-text-muted">{e.fecha}</p>
                      </div>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        isCanvas ? "bg-accent-light text-accent-text" : "bg-warning-light text-warning"
                      }`}>
                        {e.tipo}
                      </span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-sidebar/10 text-sidebar flex-shrink-0">{e.comp}</span>
                      {done ? (
                        <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                      ) : (
                        <button
                          onClick={() => setRevisados(prev => new Set([...prev, e.id]))}
                          className="text-[9px] font-bold bg-sidebar text-white px-2.5 py-1 rounded-lg hover:bg-accent-dark transition-colors cursor-pointer flex-shrink-0"
                        >
                          {lbl("Revisar", "Review")}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pedagogical note */}
              <div className="bg-accent-light rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-accent-text leading-relaxed">
                  {lbl(
                    "Revisar el canvas en las primeras 3 semanas detecta misconceptions antes de que el alumno construya sobre hipótesis incorrectas. Un feedback de 2 líneas antes del viernes vale más que una corrección completa en semana 6.",
                    "Reviewing the canvas in the first 3 weeks detects misconceptions before students build on incorrect hypotheses. 2-line feedback before Friday is worth more than a full correction in week 6."
                  )}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Bottom: Competency Progress */}
        <div className="grid grid-cols-2 gap-5">
          <CompetencyProgress />
          <div className="bg-card rounded-2xl p-5 border border-card-border">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Próximos hitos", "Upcoming milestones")}</h3>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { day: lbl("Hoy", "Today"),     task: lbl("Revisión: Página de aterrizaje", "Review: Landing page"),       type: "review",   urgent: true },
                { day: lbl("Mañana", "Tomorrow"), task: lbl("Entrega: Presupuesto financiero", "Submit: Financial budget"), type: "delivery", urgent: false },
                { day: lbl("Viernes", "Friday"),  task: lbl("Demo Day: Presentación clase", "Demo Day: Class presentation"),type: "event",    urgent: false },
                { day: lbl("Sem. 4", "Wk. 4"),   task: lbl("Inicio: Diseña tu Food Truck", "Start: Design your Food Truck"),type: "new",     urgent: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    item.urgent ? "bg-urgent animate-pulse" :
                    item.type === "event" ? "bg-[#4F8EF7]" :
                    item.type === "new" ? "bg-accent-dark" :
                    "bg-success"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] text-text-secondary leading-tight block truncate">
                      {item.task}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold flex-shrink-0 ${
                    item.urgent ? "text-urgent" : "text-text-muted"
                  }`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar — AI Chat */}
      <div className="w-[300px] flex-shrink-0">
        <TeacherChat role="teacher" />
      </div>
    </div>
  );
}
