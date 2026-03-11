"use client";

import { useState } from "react";
import { TrendingUp, Users, FileCheck, Flame, AlertTriangle, CheckCircle2, Clock, BarChart3, ZapOff, MessageSquare, ArrowUp, ArrowDown, Minus, ShieldAlert } from "lucide-react";
import { classStudents } from "@/data/students";
import { competencies } from "@/data/competencies";
import { useLang } from "@/lib/i18n";

// Genera nivel LOMLOE 1-4 con semilla estable por alumno × competencia
function seededLevel(si: number, ci: number): 1 | 2 | 3 | 4 {
  const score = ((si * 47 + ci * 31 + 17) % 60) + 35; // 35-94
  if (score >= 80) return 4;
  if (score >= 65) return 3;
  if (score >= 50) return 2;
  return 1;
}

const levelConfig = {
  1: { bg: "bg-urgent-light",   text: "text-urgent",      label: "Iniciado" },
  2: { bg: "bg-warning-light",  text: "text-text-primary", label: "En proceso" },
  3: { bg: "bg-accent-light",   text: "text-accent-text",  label: "Adquirido" },
  4: { bg: "bg-success-light",  text: "text-success",      label: "Avanzado" },
} as const;

const semanas = [
  { label: "24 feb", entregas: 68, meta: 90 },
  { label: "3 mar",  entregas: 84, meta: 90 },
  { label: "10 mar", entregas: 71, meta: 90 },
  { label: "17 mar", entregas: 23, meta: 90, actual: true },
];

const sinActividadHoy = [
  { id: "p", nombre: "Pablo Ruiz",    avatar: "PR", ultimaAct: "Hace 3 días", tarea: "Plantillas de comunicación" },
  { id: "t", nombre: "Tomás Herrera", avatar: "TH", ultimaAct: "Hace 2 días", tarea: "Análisis de mercado" },
];

// T23 — Semáforo de riesgo: datos base por alumno (índice alineado con classStudents)
// score = diasSinActividad×3 + (100 - compMasBlaja)×4/100 + entregasTardias×5
const riesgoBase = [
  { nombre: "Lucas García",      avatar: "LG", diasSinAct: 0, compBaja: 88, tardias: 0, tendencia: "bajando"  as const },
  { nombre: "Sofía Torres",      avatar: "ST", diasSinAct: 1, compBaja: 72, tardias: 1, tendencia: "bajando"  as const },
  { nombre: "Pablo Ruiz",        avatar: "PR", diasSinAct: 3, compBaja: 45, tardias: 3, tendencia: "subiendo" as const },
  { nombre: "María Santos",      avatar: "MS", diasSinAct: 0, compBaja: 82, tardias: 0, tendencia: "bajando"  as const },
  { nombre: "Diego López",       avatar: "DL", diasSinAct: 2, compBaja: 60, tardias: 2, tendencia: "estable"  as const },
  { nombre: "Ana Martín",        avatar: "AM", diasSinAct: 0, compBaja: 90, tardias: 0, tendencia: "bajando"  as const },
  { nombre: "Carlos Rivera",     avatar: "CR", diasSinAct: 1, compBaja: 68, tardias: 1, tendencia: "estable"  as const },
  { nombre: "Laura Sanz",        avatar: "LS", diasSinAct: 0, compBaja: 78, tardias: 0, tendencia: "bajando"  as const },
  { nombre: "Tomás Herrera",     avatar: "TH", diasSinAct: 2, compBaja: 50, tardias: 2, tendencia: "subiendo" as const },
  { nombre: "Carla Vega",        avatar: "CV", diasSinAct: 0, compBaja: 85, tardias: 0, tendencia: "bajando"  as const },
  { nombre: "Alejandro Pérez",   avatar: "AP", diasSinAct: 1, compBaja: 55, tardias: 2, tendencia: "estable"  as const },
  { nombre: "Valentina Cruz",    avatar: "VC", diasSinAct: 0, compBaja: 92, tardias: 0, tendencia: "bajando"  as const },
];


function computeScore(d: typeof riesgoBase[number]): number {
  return d.diasSinAct * 3 + Math.round(((100 - d.compBaja) * 4) / 100) + d.tardias * 5;
}

function nivelRiesgo(score: number): "Alto" | "Medio" | "Bajo" {
  if (score >= 18) return "Alto";
  if (score >= 8)  return "Medio";
  return "Bajo";
}

function sparklineWeek(si: number, weekIdx: number, currentProgress: number): number {
  const base = Math.max(10, currentProgress - (3 - weekIdx) * 9);
  const noise = ((si * 11 + weekIdx * 7 + 5) % 14) - 7;
  return Math.max(5, Math.min(100, base + noise));
}

const tiempoAsignatura = [
  { nombre: "Matemáticas",    pct: 28 },
  { nombre: "Lengua",         pct: 22 },
  { nombre: "Inglés",         pct: 18 },
  { nombre: "CC Sociales",    pct: 16 },
  { nombre: "Tecnología",     pct: 10 },
  { nombre: "Arte",           pct: 6  },
];

export default function TeacherAnalytics() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const microAccionPorNivel: Record<"Alto" | "Medio" | "Bajo", string> = {
    Alto:  lbl("Contactar hoy — ofrecer sesión 1:1 de 15 min y revisar carga de trabajo.", "Contact today — offer a 15-min 1:1 session and review workload."),
    Medio: lbl("Enviar mensaje de apoyo y recordar la próxima entrega con fecha concreta.", "Send a supportive message and remind them of the next deadline."),
    Bajo:  lbl("Mantener seguimiento semanal regular. Felicitar el avance.", "Maintain regular weekly check-in. Acknowledge their progress."),
  };

  const [contactados, setContactados] = useState<Set<string>>(new Set());
  // T23 — Semáforo de riesgo
  const [contactadosSemaforo, setContactadosSemaforo] = useState<Set<string>>(new Set());

  const progMedio = Math.round(classStudents.reduce((s, a) => s + a.progress, 0) / classStudents.length);
  const totalEntregas = classStudents.reduce((s, a) => s + a.evidencesSubmitted, 0);

  const enRiesgo = classStudents
    .map((a) => ({ ...a, riesgo: 100 - a.progress }))
    .filter((a) => a.riesgo >= 30)
    .sort((a, b) => b.riesgo - a.riesgo);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary">{lbl("Análisis de clase", "Class analytics")}</h1>
          <p className="text-[13px] text-text-secondary mt-0.5">{lbl("Semana 3 · Proyecto Airbnb Málaga · 1º ESO", "Week 3 · Airbnb Málaga Project · 1º ESO")}</p>
        </div>
        <div className="flex items-center gap-2 bg-success-light px-3 py-1.5 rounded-full border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[11px] font-semibold text-success">{lbl("Clase activa", "Class active")}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: lbl("Progreso medio", "Average progress"), valor: `${progMedio}%`, icon: TrendingUp, bg: "bg-accent-light", text: "text-accent-text" },
          { label: lbl("Alumnos", "Students"),                valor: classStudents.length, icon: Users, bg: "bg-background", text: "text-text-primary" },
          { label: lbl("Entregas totales", "Total submissions"), valor: totalEntregas, icon: FileCheck, bg: "bg-success-light", text: "text-success" },
          { label: lbl("Racha de clase", "Class streak"),     valor: lbl("8 días", "8 days"), icon: Flame, bg: "bg-warning-light", text: "text-text-primary" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 border border-card-border ${s.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-text-muted">{s.label}</span>
              <s.icon size={15} className={s.text} />
            </div>
            <span className={`text-[22px] font-bold ${s.text}`}>{s.valor}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* Columna izquierda */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Heatmap competencias LOMLOE */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={14} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Mapa de competencias LOMLOE", "LOMLOE competency map")}</h3>
            </div>
            {/* Leyenda */}
            <div className="flex gap-3 mb-3">
              {([1, 2, 3, 4] as const).map((n) => (
                <div key={n} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded-sm ${levelConfig[n].bg}`} />
                  <span className="text-[9px] text-text-muted">{n} — {levelConfig[n].label}</span>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-[10px] text-text-muted font-medium text-left pb-2 pr-3 w-24">{lbl("Alumno", "Student")}</th>
                    {competencies.map((c) => (
                      <th key={c.key} className="text-[9px] font-bold text-text-secondary pb-2 px-0.5 text-center w-9">
                        {c.key}
                      </th>
                    ))}
                    <th className="text-[9px] font-bold text-text-muted pb-2 px-1 text-center w-10">{lbl("Media", "Avg")}</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((alumno, si) => {
                    const niveles = competencies.map((_, ci) => seededLevel(si, ci));
                    const media = (niveles.reduce((a, b) => a + b, 0) / niveles.length).toFixed(1);
                    return (
                      <tr key={alumno.id} className="hover:bg-background/50 transition-colors">
                        <td className="text-[11px] text-text-primary font-medium py-0.5 pr-3 whitespace-nowrap">
                          {alumno.name.split(" ")[0]}
                        </td>
                        {niveles.map((nivel, ci) => {
                          const cfg = levelConfig[nivel];
                          return (
                            <td key={ci} className="py-0.5 px-0.5 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-6 text-[10px] font-bold rounded-md ${cfg.bg} ${cfg.text}`}>
                                {nivel}
                              </span>
                            </td>
                          );
                        })}
                        <td className="py-0.5 px-1 text-center">
                          <span className="text-[10px] font-bold text-text-secondary">{media}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Entregas semanales — barras CSS */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck size={14} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Entregas por semana", "Submissions per week")}</h3>
              <span className="text-[11px] text-text-muted ml-auto">{lbl("Meta: 90 entregas", "Target: 90 submissions")}</span>
            </div>
            <div className="space-y-3">
              {semanas.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-text-secondary">{s.label}</span>
                    <div className="flex items-center gap-2">
                      {s.actual && (
                        <span className="text-[9px] font-bold bg-accent text-sidebar px-1.5 py-0.5 rounded-full">{lbl("En curso", "In progress")}</span>
                      )}
                      <span className={`text-[11px] font-bold ${s.entregas >= s.meta ? "text-success" : "text-text-primary"}`}>
                        {s.entregas}
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${s.entregas >= s.meta ? "bg-success" : s.actual ? "bg-accent" : "bg-accent-text"}`}
                      style={{ width: `${Math.min(100, (s.entregas / s.meta) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-0.5 flex justify-between">
                    <span className="text-[9px] text-text-muted">0</span>
                    <span className="text-[9px] text-text-muted">{lbl("Meta:", "Target:")} {s.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sin actividad hoy */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <ZapOff size={14} className="text-urgent" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Sin actividad hoy", "No activity today")}</h3>
              <span className="ml-auto text-[9px] font-bold bg-urgent-light text-urgent px-2 py-0.5 rounded-full">
                {sinActividadHoy.length} {lbl("alumnos", "students")}
              </span>
            </div>
            <div className="space-y-2">
              {sinActividadHoy.map((a) => {
                const yaContactado = contactados.has(a.id);
                return (
                  <div key={a.id} className="flex items-center gap-3 bg-urgent-light rounded-xl p-3">
                    <div className="w-8 h-8 rounded-full bg-sidebar text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {a.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-text-primary">{a.nombre}</p>
                      <p className="text-[10px] text-text-muted">{lbl("Última actividad:", "Last activity:")} {a.ultimaAct} · {lbl("Pendiente:", "Pending:")} {a.tarea}</p>
                    </div>
                    <button
                      onClick={() => setContactados((prev) => new Set([...prev, a.id]))}
                      className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                        yaContactado
                          ? "bg-success-light text-success"
                          : "bg-card text-urgent hover:brightness-95"
                      }`}
                    >
                      {yaContactado ? <CheckCircle2 size={11} /> : <MessageSquare size={11} />}
                      {yaContactado ? lbl("Contactado", "Contacted") : lbl("Contactar", "Contact")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabla de riesgo */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} className="text-warning" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Alumnos en seguimiento", "Students in review")}</h3>
            </div>
            <div className="space-y-2">
              {enRiesgo.map((a) => {
                const nivel = a.riesgo >= 50
                  ? { label: lbl("Alto", "High"),   bg: "bg-urgent-light", text: "text-urgent",      bar: "bg-urgent" }
                  : a.riesgo >= 35
                  ? { label: lbl("Medio", "Medium"), bg: "bg-warning-light", text: "text-text-primary", bar: "bg-warning" }
                  : { label: lbl("Bajo", "Low"),     bg: "bg-accent-light",  text: "text-accent-text",  bar: "bg-accent-text" };
                return (
                  <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border border-card-border ${nivel.bg}`}>
                    <div className="w-7 h-7 rounded-full bg-sidebar flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      {a.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12px] font-semibold text-text-primary">{a.name}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-card ${nivel.text}`}>{nivel.label}</span>
                      </div>
                      <p className="text-[10px] text-text-muted truncate">{a.currentTask}</p>
                      <div className="h-1 bg-white/50 rounded-full mt-1.5 overflow-hidden">
                        <div className={`h-full ${nivel.bar} rounded-full`} style={{ width: `${a.progress}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[15px] font-bold ${nivel.text}`}>{a.riesgo}</span>
                      <span className="text-[9px] text-text-muted block">{lbl("riesgo", "risk")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="w-[260px] flex-shrink-0 space-y-4">

          {/* Competencias promedio clase */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-text-primary" />
              <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Competencias clase", "Class competencies")}</h3>
            </div>
            <div className="space-y-2.5">
              {competencies.map((c) => (
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-text-secondary">{c.key}</span>
                    <span className="text-[10px] font-bold text-text-primary">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tiempo por asignatura */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-text-primary" />
              <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Tiempo por asignatura", "Time per subject")}</h3>
            </div>
            <div className="space-y-2.5">
              {tiempoAsignatura.map((a) => (
                <div key={a.nombre}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-text-secondary">{a.nombre}</span>
                    <span className="text-[10px] font-semibold text-text-primary">{a.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-accent-text rounded-full" style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribución LOMLOE por competencia */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className="text-text-primary" />
              <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Distribución LOMLOE", "LOMLOE Distribution")}</h3>
            </div>
            <div className="flex gap-2 mb-3">
              {([1, 2, 3, 4] as const).map((n) => (
                <div key={n} className="flex items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-sm ${levelConfig[n].bg}`} />
                  <span className="text-[8px] text-text-muted">{n}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {competencies.map((comp, ci) => {
                const counts = [0, 0, 0, 0];
                classStudents.forEach((_, si) => { counts[seededLevel(si, ci) - 1]++; });
                const total = classStudents.length;
                return (
                  <div key={comp.key}>
                    <span className="text-[9px] font-bold text-text-secondary block mb-0.5">{comp.key}</span>
                    <div className="flex h-3 rounded-full overflow-hidden">
                      {counts.map((c, i) => {
                        const pct = (c / total) * 100;
                        const bgClasses = ["bg-urgent-light", "bg-warning-light", "bg-accent-light", "bg-success-light"];
                        return pct > 0 ? (
                          <div
                            key={i}
                            className={bgClasses[i]}
                            style={{ width: `${pct}%` }}
                            title={`${lbl("Nivel", "Level")} ${i + 1}: ${c} ${lbl("alumnos", "students")}`}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mejores alumnos */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={14} className="text-success" />
              <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Destacados", "Top students")}</h3>
            </div>
            <div className="space-y-2.5">
              {[...classStudents].sort((a, b) => b.progress - a.progress).slice(0, 3).map((a, i) => (
                <div key={a.id} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-text-primary truncate">{a.name.split(" ")[0]}</p>
                    <p className="text-[9px] text-text-muted">{a.evidencesSubmitted} {lbl("evidencias", "evidences")}</p>
                  </div>
                  <span className="text-[13px] font-bold text-success">{a.progress}%</span>
                  <span className="text-[9px] text-text-muted">#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* T23: Semáforo de riesgo actualizado */}
      {(() => {
        const alumnosConScore = riesgoBase
          .map((a) => ({ ...a, score: computeScore(a), nivel: nivelRiesgo(computeScore(a)) }))
          .sort((a, b) => b.score - a.score);
        const altos  = alumnosConScore.filter((a) => a.nivel === "Alto");
        const medios = alumnosConScore.filter((a) => a.nivel === "Medio");
        const bajos  = alumnosConScore.filter((a) => a.nivel === "Bajo");
        const nivelCfg = {
          Alto:  { bg: "bg-urgent-light",   text: "text-urgent",       border: "border-urgent/30",       bar: "bg-urgent",       dot: "bg-urgent"   },
          Medio: { bg: "bg-warning-light",  text: "text-text-primary", border: "border-warning/30",      bar: "bg-warning",      dot: "bg-warning"  },
          Bajo:  { bg: "bg-success-light",  text: "text-success",      border: "border-success/30",      bar: "bg-success",      dot: "bg-success"  },
        } as const;
        const tendenciaCfg = {
          subiendo: { icon: ArrowUp,   color: "text-urgent"   },
          bajando:  { icon: ArrowDown, color: "text-success"  },
          estable:  { icon: Minus,     color: "text-text-muted" },
        } as const;
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert size={14} className="text-urgent" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Semáforo de riesgo actualizado", "Updated risk traffic light")}</h3>
              <span className="ml-auto text-[10px] text-text-muted">{lbl("Score = días sin actividad × 3 + comp. baja × 4 + tardías × 5", "Score = inactivity × 3 + low comp × 4 + late × 5")}</span>
            </div>

            {/* Donut / distribución resumen */}
            <div className="flex items-center gap-6 mb-5 p-4 bg-background rounded-xl">
              <div className="flex flex-col items-center">
                {/* Donut SVG simulado con 3 arcos */}
                <svg width="80" height="80" viewBox="0 0 80 80">
                  {/* Base circle */}
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#f0fdf4" strokeWidth="12" />
                  {/* Bajo: success */}
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#22c55e" strokeWidth="12"
                    strokeDasharray={`${(bajos.length / 12) * 175.9} 175.9`}
                    strokeDashoffset="0" transform="rotate(-90 40 40)" />
                  {/* Medio: warning — empieza donde termina Bajo */}
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#f59e0b" strokeWidth="12"
                    strokeDasharray={`${(medios.length / 12) * 175.9} 175.9`}
                    strokeDashoffset={`-${(bajos.length / 12) * 175.9}`}
                    transform="rotate(-90 40 40)" />
                  {/* Alto: urgent */}
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#ef4444" strokeWidth="12"
                    strokeDasharray={`${(altos.length / 12) * 175.9} 175.9`}
                    strokeDashoffset={`-${((bajos.length + medios.length) / 12) * 175.9}`}
                    transform="rotate(-90 40 40)" />
                  <text x="40" y="44" textAnchor="middle" className="text-[11px] font-bold fill-current" style={{ fill: "#141414", fontSize: "12px", fontWeight: "bold" }}>{altos.length > 0 ? `${altos.length}⚠` : "✓"}</text>
                </svg>
                <span className="text-[9px] text-text-muted mt-1">{lbl("Salud de clase", "Class health")}</span>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3">
                {([
                  { label: lbl("Alto riesgo", "High risk"),    count: altos.length,  cfg: nivelCfg["Alto"]  },
                  { label: lbl("Riesgo medio", "Medium risk"),  count: medios.length, cfg: nivelCfg["Medio"] },
                  { label: lbl("Bajo riesgo", "Low risk"),     count: bajos.length,  cfg: nivelCfg["Bajo"]  },
                ]).map((seg) => (
                  <div key={seg.label} className={`rounded-xl p-3 border text-center ${seg.cfg.bg} ${seg.cfg.border}`}>
                    <span className={`text-[24px] font-black block leading-none ${seg.cfg.text}`}>{seg.count}</span>
                    <span className="text-[9px] text-text-muted">{seg.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista ordenada por score */}
            <div className="space-y-2">
              {alumnosConScore.map((a) => {
                const cfg = nivelCfg[a.nivel];
                const TendIcon = tendenciaCfg[a.tendencia].icon;
                const tendColor = tendenciaCfg[a.tendencia].color;
                const yaContactado = contactadosSemaforo.has(a.avatar);
                return (
                  <div key={a.avatar} className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                      {a.avatar}
                    </div>
                    {/* Nombre + micro-acción */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-semibold text-text-primary">{a.nombre}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-card ${cfg.text}`}>{a.nivel}</span>
                        <TendIcon size={11} className={`flex-shrink-0 ${tendColor}`} />
                      </div>
                      {a.nivel !== "Bajo" && (
                        <p className="text-[10px] text-text-muted leading-snug">{microAccionPorNivel[a.nivel]}</p>
                      )}
                    </div>
                    {/* Score */}
                    <div className="text-center flex-shrink-0 mr-1">
                      <span className={`text-[15px] font-bold ${cfg.text} block leading-none`}>{a.score}</span>
                      <span className="text-[8px] text-text-muted">score</span>
                    </div>
                    {/* Barra score/50 */}
                    <div className="w-16 flex-shrink-0">
                      <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                        <div className={`h-full ${cfg.bar} rounded-full`} style={{ width: `${Math.min(100, (a.score / 40) * 100)}%` }} />
                      </div>
                    </div>
                    {/* Botón Contactar — solo para riesgo Alto */}
                    {a.nivel === "Alto" && (
                      <button
                        onClick={() => setContactadosSemaforo((prev) => new Set([...prev, a.avatar]))}
                        className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                          yaContactado
                            ? "bg-success-light text-success"
                            : "bg-card text-urgent hover:brightness-95 border border-urgent/20"
                        }`}
                      >
                        {yaContactado ? <CheckCircle2 size={11} /> : <MessageSquare size={11} />}
                        {yaContactado ? lbl("Contactado", "Contacted") : lbl("Contactar", "Contact")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-text-muted mt-3 text-center border-t border-card-border pt-3">
              {lbl("Metodología: score alto = mayor prioridad de intervención docente", "Methodology: higher score = higher teaching intervention priority")}
            </p>
          </div>
        );
      })()}

      {/* Comparativa de progreso semanal — sparklines */}
      <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-text-primary" />
          <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Progreso semanal por alumno", "Weekly progress per student")}</h3>
          <span className="ml-auto text-[10px] text-text-muted">{lbl("Semanas 1 → 4 del proyecto", "Weeks 1 → 4 of project")}</span>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {classStudents.map((alumno, si) => {
            const weeks = [0, 1, 2, 3].map((w) => sparklineWeek(si, w, alumno.progress));
            const max = Math.max(...weeks);
            const trend = weeks[3] - weeks[0];
            return (
              <div key={alumno.id} className="bg-background rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 rounded-full bg-sidebar text-white text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                    {alumno.avatar}
                  </div>
                  <span className="text-[10px] font-semibold text-text-primary truncate">{alumno.name.split(" ")[0]}</span>
                </div>
                {/* Mini sparkline bars */}
                <div className="flex items-end gap-0.5 h-8">
                  {weeks.map((val, wi) => (
                    <div
                      key={wi}
                      className={`flex-1 rounded-sm transition-all ${wi === 3 ? "bg-accent-text" : "bg-accent-light"}`}
                      style={{ height: `${(val / max) * 100}%`, minHeight: "4px" }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[9px] text-text-muted">{weeks[0]}%</span>
                  <span className={`text-[9px] font-bold ${trend >= 0 ? "text-success" : "text-urgent"}`}>
                    {trend >= 0 ? "+" : ""}{trend}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
