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
} from "lucide-react";
import { classStudents, teacherAlerts } from "@/data/students";
import TeacherChat from "./TeacherChat";
import CompetencyProgress from "./CompetencyProgress";

const alertConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success-light",
    border: "border-success/20",
    label: "Éxito",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning-light",
    border: "border-warning/20",
    label: "Atención",
  },
  urgent: {
    icon: AlertCircle,
    color: "text-urgent",
    bg: "bg-urgent-light",
    border: "border-urgent/20",
    label: "Urgente",
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

function getRiskLabel(score: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (score >= 80) return { label: "Excelente", color: "text-[#4F8EF7]", bg: "bg-[#eff6ff]" };
  if (score >= 60) return { label: "En ruta", color: "text-success", bg: "bg-success-light" };
  if (score >= 40) return { label: "Riesgo medio", color: "text-warning", bg: "bg-warning-light" };
  return { label: "Riesgo alto", color: "text-urgent", bg: "bg-urgent-light" };
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

export default function TeacherDashboard() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeAlerts, setActiveAlerts] = useState(new Set(teacherAlerts.map((a) => a.id)));
  const [prorrogadas, setProrrogadas] = useState<Set<string>>(new Set());

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
                  Miércoles, 15 enero · Semana 3 de 12
                </span>
              </div>
              <h1 className="text-[28px] font-bold text-white leading-tight mb-1">
                Buenos días, Ana ✨
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
                      <span className="text-[8px] text-white/50 mt-0.5">salud</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-[11px] text-white/80 font-medium">{excelling} brillando</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                      <span className="text-[11px] text-white/80 font-medium">{onTrack} en ruta</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />
                      <span className="text-[11px] text-white/80 font-medium">{needsAttention} necesitan ayuda</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={10} className="text-accent" />
                      <span className="text-[10px] text-accent font-semibold">+4% vs semana pasada</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Avatar groups + quick action */}
          <div className="mt-4 relative z-10 flex items-center gap-4">
            {[
              { label: "Brillando", students: classStudents.filter(s => s.status === "excelling"), color: "bg-accent", ring: "ring-accent/40" },
              { label: "En ruta", students: classStudents.filter(s => s.status === "on_track"), color: "bg-success", ring: "ring-success/40" },
              { label: "Apoyo", students: classStudents.filter(s => s.status === "needs_attention"), color: "bg-warning", ring: "ring-warning/40" },
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
                Contactar alumnos en riesgo
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
                  Alertas de intervención
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {visibleAlerts.filter((a) => a.type === "urgent").length > 0 && (
                  <span className="text-[10px] bg-urgent-light text-urgent rounded-full px-2 py-0.5 font-bold">
                    {visibleAlerts.filter((a) => a.type === "urgent").length} urgente
                  </span>
                )}
                {visibleAlerts.filter((a) => a.type === "warning").length > 0 && (
                  <span className="text-[10px] bg-warning-light text-warning rounded-full px-2 py-0.5 font-bold">
                    {visibleAlerts.filter((a) => a.type === "warning").length} atención
                  </span>
                )}
              </div>
            </div>

            {visibleAlerts.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 size={28} className="text-success mb-2" />
                <p className="text-[13px] font-semibold text-text-primary">Todo en orden</p>
                <p className="text-[11px] text-text-muted">No hay alertas pendientes</p>
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
                          Mensaje
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
            <h3 className="text-[13px] font-semibold text-text-primary">Acciones rápidas</h3>
            {[
              {
                icon: FileText,
                label: "Informe LOMLOE",
                desc: "Genera el informe trimestral",
                color: "text-accent-text",
                bg: "bg-accent-light",
              },
              {
                icon: Brain,
                label: "Análisis IA",
                desc: "Detección de brechas por competencia",
                color: "text-[#4F8EF7]",
                bg: "bg-[#eff6ff]",
              },
              {
                icon: Zap,
                label: "Misión Flash",
                desc: "Asignar a toda la clase",
                color: "text-warning",
                bg: "bg-warning-light",
              },
              {
                icon: Shield,
                label: "Plan de apoyo",
                desc: "Para alumnos en riesgo",
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
              <h3 className="text-[14px] font-semibold text-text-primary">Tareas vencidas hoy</h3>
              <span className="ml-auto text-[9px] font-bold bg-urgent-light text-urgent px-2 py-0.5 rounded-full">
                {tareasVencidas.filter(t => !prorrogadas.has(t.id)).length} pendientes
              </span>
            </div>
            {tareasVencidas.length === 0 ? (
              <div className="flex items-center gap-2 py-3 text-center justify-center">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-[12px] text-text-muted">Sin entregas vencidas</span>
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
                        <span className="ml-auto text-[9px] text-text-muted">{tareas.length} tarea{tareas.length > 1 ? "s" : ""}</span>
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
              <h3 className="text-[14px] font-semibold text-text-primary">Sin acceso a plataforma</h3>
              <span className="ml-auto text-[9px] font-bold bg-warning-light text-warning px-2 py-0.5 rounded-full">
                {alumnosSinLogin.length} alumnos
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
                    <p className="text-[10px] text-text-muted">Última actividad: {a.ultimaActividad}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[11px] font-bold text-warning">{a.diasSinLogin} días</span>
                    <button className="flex items-center gap-1 text-[9px] font-bold text-accent-text bg-white px-2 py-0.5 rounded-lg hover:bg-accent-light border border-accent/20 cursor-pointer transition-colors">
                      <MessageSquare size={9} />
                      Contactar
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

        {/* Student Grid with Risk Scoring */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">
                Seguimiento individual
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {[
                { color: "bg-[#4F8EF7]", label: "Brillando" },
                { color: "bg-success", label: "En ruta" },
                { color: "bg-warning", label: "Riesgo" },
                { color: "bg-urgent", label: "Urgente" },
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
                          <span className="text-[9px] text-text-muted">Puntuación IA</span>
                          <span className="text-[10px] font-bold text-accent-text">{riskScore}/100</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button className="flex-1 text-[9px] font-semibold text-accent-text bg-white rounded-lg py-1.5 hover:bg-accent-light transition-colors cursor-pointer border border-accent/30">
                            <MessageSquare size={9} className="inline mr-1" />
                            Chat
                          </button>
                          <button className="flex-1 text-[9px] font-semibold text-white bg-sidebar rounded-lg py-1.5 hover:bg-accent-dark transition-colors cursor-pointer">
                            <Star size={9} className="inline mr-1" />
                            Perfil
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

        {/* Bottom: Competency Progress */}
        <div className="grid grid-cols-2 gap-5">
          <CompetencyProgress />
          <div className="bg-card rounded-2xl p-5 border border-card-border">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">Próximos hitos</h3>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { day: "Hoy", task: "Revisión: Página de aterrizaje", type: "review", urgent: true },
                { day: "Mañana", task: "Entrega: Presupuesto financiero", type: "delivery", urgent: false },
                { day: "Viernes", task: "Demo Day: Presentación clase", type: "event", urgent: false },
                { day: "Sem. 4", task: "Inicio: Diseña tu Food Truck", type: "new", urgent: false },
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
