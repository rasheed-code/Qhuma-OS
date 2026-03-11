"use client";

import { useState } from "react";
import { TrendingUp, Users, FileCheck, Flame, AlertTriangle, CheckCircle2, Clock, BarChart3, ZapOff, MessageSquare, ArrowUp, ArrowDown, Minus, ShieldAlert, Download, Layers, Target, Lightbulb } from "lucide-react";
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

// ── T33: Tendencia semanal T1 ─────────────────────────────────────────────
const t1CompTendencia: Record<string, { sem: number[] }> = {
  CLC:   { sem: [2.1, 2.4, 2.7, 3.1] },
  CPL:   { sem: [1.8, 2.0, 2.3, 2.5] },
  STEM:  { sem: [2.5, 2.8, 3.1, 3.4] },
  CD:    { sem: [2.3, 2.6, 3.0, 3.3] },
  CPSAA: { sem: [2.0, 2.2, 2.6, 2.9] },
  CC:    { sem: [1.9, 2.1, 2.4, 2.7] },
  CE:    { sem: [2.2, 2.6, 3.0, 3.5] },
  CCEC:  { sem: [1.7, 1.9, 2.2, 2.4] },
};

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
  // T29 — Comparativa entre grupos
  const [grupoComparativaVista, setGrupoComparativaVista] = useState<"competencia" | "indicador">("competencia");
  const [exportandoAnalisis, setExportandoAnalisis] = useState(false);
  const [analisisExportado, setAnalisisExportado] = useState(false);

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

      {/* T29 — Comparativa entre grupos */}
      {(() => {
        const grupoA = [
          { nombre: "Lucas García",    avatar: "LG", racha: 14, entregasATiempo: 95, riesgo: 12 },
          { nombre: "Sofía Torres",    avatar: "ST", racha: 11, entregasATiempo: 88, riesgo: 18 },
          { nombre: "Pablo Ruiz",      avatar: "PR", racha: 4,  entregasATiempo: 62, riesgo: 45 },
          { nombre: "María Santos",    avatar: "MS", racha: 13, entregasATiempo: 92, riesgo: 10 },
          { nombre: "Diego López",     avatar: "DL", racha: 7,  entregasATiempo: 74, riesgo: 30 },
          { nombre: "Ana Martín",      avatar: "AM", racha: 15, entregasATiempo: 97, riesgo: 8  },
        ];
        const grupoB = [
          { nombre: "Carlos Rivera",   avatar: "CR", racha: 9,  entregasATiempo: 80, riesgo: 22 },
          { nombre: "Laura Sanz",      avatar: "LS", racha: 12, entregasATiempo: 89, riesgo: 14 },
          { nombre: "Tomás Herrera",   avatar: "TH", racha: 5,  entregasATiempo: 67, riesgo: 38 },
          { nombre: "Carla Vega",      avatar: "CV", racha: 10, entregasATiempo: 84, riesgo: 16 },
          { nombre: "Alejandro Pérez", avatar: "AP", racha: 6,  entregasATiempo: 70, riesgo: 32 },
          { nombre: "Valentina Cruz",  avatar: "VC", racha: 14, entregasATiempo: 93, riesgo: 9  },
        ];

        // Niveles LOMLOE por comp para cada grupo (promedio de los 6 alumnos × sus índices)
        const compsKeys = ["CLC", "CPL", "STEM", "CD", "CPSAA", "CC", "CE", "CCEC"];
        const avgA_comps = compsKeys.map((_, ci) => {
          const vals = grupoA.map((_, si) => seededLevel(si, ci));
          return parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1));
        });
        const avgB_comps = compsKeys.map((_, ci) => {
          const vals = grupoB.map((_, si) => seededLevel(si + 6, ci));
          return parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1));
        });

        // Indicadores (vista alternativa)
        const indicadores = [
          { label: lbl("Entregas a tiempo", "On-time submissions"),  a: parseFloat((grupoA.reduce((s, a) => s + a.entregasATiempo, 0) / 6).toFixed(0)), b: parseFloat((grupoB.reduce((s, a) => s + a.entregasATiempo, 0) / 6).toFixed(0)), max: 100, suffix: "%" },
          { label: lbl("Racha media",       "Average streak"),       a: parseFloat((grupoA.reduce((s, a) => s + a.racha, 0) / 6).toFixed(1)),            b: parseFloat((grupoB.reduce((s, a) => s + a.racha, 0) / 6).toFixed(1)),            max: 15,  suffix: " d" },
          { label: lbl("Riesgo medio",      "Average risk score"),   a: parseFloat((grupoA.reduce((s, a) => s + a.riesgo, 0) / 6).toFixed(0)),           b: parseFloat((grupoB.reduce((s, a) => s + a.riesgo, 0) / 6).toFixed(0)),           max: 50,  suffix: "" },
        ];

        const avgRachaA = parseFloat((grupoA.reduce((s, a) => s + a.racha, 0) / 6).toFixed(1));
        const avgRachaB = parseFloat((grupoB.reduce((s, a) => s + a.racha, 0) / 6).toFixed(1));
        const avgEntregasA = parseFloat((grupoA.reduce((s, a) => s + a.entregasATiempo, 0) / 6).toFixed(0));
        const avgEntregasB = parseFloat((grupoB.reduce((s, a) => s + a.entregasATiempo, 0) / 6).toFixed(0));
        const avgRiesgoA = parseFloat((grupoA.reduce((s, a) => s + a.riesgo, 0) / 6).toFixed(0));
        const avgRiesgoB = parseFloat((grupoB.reduce((s, a) => s + a.riesgo, 0) / 6).toFixed(0));

        const handleExportar = () => {
          setExportandoAnalisis(true);
          setTimeout(() => {
            const rows = compsKeys.map((k, ci) => `<tr><td style="padding:6px 12px;border:1px solid #eee;font-weight:600">${k}</td><td style="padding:6px 12px;border:1px solid #eee;text-align:center;color:#1f514c">${avgA_comps[ci]}</td><td style="padding:6px 12px;border:1px solid #eee;text-align:center;color:#376459">${avgB_comps[ci]}</td><td style="padding:6px 12px;border:1px solid #eee;text-align:center;font-weight:600;color:${avgA_comps[ci] >= avgB_comps[ci] ? "#22c55e" : "#ef4444"}">${avgA_comps[ci] >= avgB_comps[ci] ? "Grupo A" : "Grupo B"}</td></tr>`).join("");
            const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Análisis Comparativo Grupos — QHUMA OS</title><style>body{font-family:Inter,sans-serif;padding:32px;max-width:800px;margin:0 auto}h1{color:#141414}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#1f514c;color:white;padding:8px 12px;text-align:left}td{padding:6px 12px;border:1px solid #eee}.badge{display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700}</style></head><body><h1>Análisis comparativo — Grupos A y B</h1><p style="color:#666">Proyecto: Airbnb Málaga / Casa Limón · 1º ESO · Semana 3 · ${new Date().toLocaleDateString("es-ES")}</p><h2>Resumen por indicador</h2><table><thead><tr><th>Indicador</th><th>Grupo A</th><th>Grupo B</th></tr></thead><tbody><tr><td>Racha media</td><td>${avgRachaA} días</td><td>${avgRachaB} días</td></tr><tr><td>Entregas a tiempo</td><td>${avgEntregasA}%</td><td>${avgEntregasB}%</td></tr><tr><td>Riesgo medio</td><td>${avgRiesgoA}</td><td>${avgRiesgoB}</td></tr></tbody></table><h2 style="margin-top:24px">Competencias LOMLOE (media 1–4)</h2><table><thead><tr><th>Competencia</th><th>Grupo A</th><th>Grupo B</th><th>Lidera</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `analisis_comparativo_grupos_${new Date().toISOString().slice(0,10)}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            setExportandoAnalisis(false);
            setAnalisisExportado(true);
            setTimeout(() => setAnalisisExportado(false), 4000);
          }, 1200);
        };

        return (
          <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-text-primary" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Comparativa entre grupos", "Group comparison")}</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Toggle vista */}
                <div className="flex gap-0.5 bg-background rounded-lg p-0.5">
                  {(["competencia", "indicador"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setGrupoComparativaVista(v)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${grupoComparativaVista === v ? "bg-card text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"}`}
                    >
                      {v === "competencia" ? lbl("Por competencia", "By competency") : lbl("Por indicador", "By indicator")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleExportar}
                  disabled={exportandoAnalisis}
                  className="flex items-center gap-1.5 bg-sidebar text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {exportandoAnalisis ? <ArrowDown size={10} className="animate-bounce" /> : <Download size={10} />}
                  {exportandoAnalisis ? lbl("Generando…", "Generating…") : lbl("Exportar análisis", "Export analysis")}
                </button>
              </div>
            </div>

            {analisisExportado && (
              <div className="flex items-center gap-2 bg-success-light border border-success/20 rounded-xl px-3 py-2 mb-4">
                <CheckCircle2 size={12} className="text-success" />
                <span className="text-[11px] font-semibold text-success">{lbl("Análisis comparativo exportado correctamente", "Comparative analysis exported successfully")}</span>
              </div>
            )}

            {/* Leyenda grupos */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-sidebar" />
                <span className="text-[10px] font-semibold text-text-secondary">Grupo A: Lucas, Sofía, Pablo, María, Diego, Ana</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-accent-text/60" />
                <span className="text-[10px] font-semibold text-text-secondary">Grupo B: Carlos, Laura, Tomás, Carla, Alejandro, Valentina</span>
              </div>
            </div>

            {/* Resumen KPIs comparativos */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: lbl("Racha media", "Avg streak"), a: `${avgRachaA} d`, b: `${avgRachaB} d`, aWins: avgRachaA >= avgRachaB },
                { label: lbl("Entregas a tiempo", "On-time %"), a: `${avgEntregasA}%`, b: `${avgEntregasB}%`, aWins: avgEntregasA >= avgEntregasB },
                { label: lbl("Riesgo medio", "Avg risk"), a: String(avgRiesgoA), b: String(avgRiesgoB), aWins: avgRiesgoA <= avgRiesgoB },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-background rounded-xl p-3">
                  <span className="text-[9px] text-text-muted block mb-2">{kpi.label}</span>
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <span className="text-[18px] font-bold text-sidebar block leading-none">{kpi.a}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${kpi.aWins ? "bg-success-light text-success" : "bg-background text-text-muted"}`}>A {kpi.aWins ? "▲" : ""}</span>
                    </div>
                    <span className="text-[10px] text-text-muted mx-2">vs</span>
                    <div className="text-center flex-1">
                      <span className="text-[18px] font-bold text-accent-text block leading-none">{kpi.b}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${!kpi.aWins ? "bg-success-light text-success" : "bg-background text-text-muted"}`}>B {!kpi.aWins ? "▲" : ""}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista por competencia */}
            {grupoComparativaVista === "competencia" && (
              <div>
                <p className="text-[10px] text-text-muted mb-3">{lbl("Media LOMLOE 1–4 por competencia · barras lado a lado", "LOMLOE avg 1–4 per competency · side-by-side bars")}</p>
                <div className="space-y-2.5">
                  {compsKeys.map((comp, ci) => {
                    const va = avgA_comps[ci];
                    const vb = avgB_comps[ci];
                    const aWins = va >= vb;
                    return (
                      <div key={comp}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-text-primary w-12">{comp}</span>
                          <div className="flex items-center gap-2 flex-1 mx-3">
                            {/* Grupo A bar (right-to-left) */}
                            <div className="flex-1 flex justify-end">
                              <div className="h-2.5 bg-sidebar rounded-full" style={{ width: `${(va / 4) * 100}%`, minWidth: "4px" }} />
                            </div>
                            <span className="text-[9px] text-text-muted w-4 text-center">|</span>
                            {/* Grupo B bar (left-to-right) */}
                            <div className="flex-1">
                              <div className="h-2.5 bg-accent-text/60 rounded-full" style={{ width: `${(vb / 4) * 100}%`, minWidth: "4px" }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-sidebar">{va}</span>
                            <span className="text-[9px] text-text-muted">/</span>
                            <span className="text-[10px] font-bold text-accent-text">{vb}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${aWins ? "bg-sidebar text-white" : "bg-accent-light text-accent-text"}`}>{aWins ? "A" : "B"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vista por indicador */}
            {grupoComparativaVista === "indicador" && (
              <div className="space-y-4">
                {indicadores.map((ind) => {
                  const aWins = ind.label === lbl("Riesgo medio", "Average risk score")
                    ? ind.a <= ind.b
                    : ind.a >= ind.b;
                  const barA = Math.round((ind.a / ind.max) * 100);
                  const barB = Math.round((ind.b / ind.max) * 100);
                  return (
                    <div key={ind.label} className="bg-background rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-text-primary">{ind.label}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${aWins ? "bg-sidebar text-white" : "bg-accent-light text-accent-text"}`}>
                          {lbl("Lidera:", "Leads:")} {aWins ? "Grupo A" : "Grupo B"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] text-text-muted">Grupo A</span>
                            <span className="text-[11px] font-bold text-sidebar">{ind.a}{ind.suffix}</span>
                          </div>
                          <div className="h-2 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-sidebar rounded-full" style={{ width: `${Math.min(barA, 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] text-text-muted">Grupo B</span>
                            <span className="text-[11px] font-bold text-accent-text">{ind.b}{ind.suffix}</span>
                          </div>
                          <div className="h-2 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-accent-text/60 rounded-full" style={{ width: `${Math.min(barB, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* T30 — Correlación esfuerzo × resultado */}
      {(() => {
        // Datos por alumno: esfuerzo (% tareas) y resultado (media LOMLOE) — deterministas por seed
        const data = classStudents.map((s, si) => {
          const effort = Math.round(((si * 53 + 29) % 46) + 44); // 44–89
          const result = Math.round(((si * 37 + 19) % 46) + 38); // 38–83
          return { s, effort, result };
        });
        const mid = { effort: 66, result: 60 };
        type Q = "star" | "potential" | "support" | "priority";
        const getQ = (e: number, r: number): Q => {
          if (e >= mid.effort && r >= mid.result) return "star";
          if (e < mid.effort  && r >= mid.result) return "potential";
          if (e >= mid.effort && r < mid.result)  return "support";
          return "priority";
        };
        const qCfg: Record<Q, { label: string; color: string; bg: string; dot: string; tip: string }> = {
          star:      { label: lbl("Destacados",       "Stars"),            color: "text-success",     bg: "bg-success-light",  dot: "bg-success",     tip: lbl("Alto esfuerzo + alto resultado",   "High effort, high outcome") },
          potential: { label: lbl("Potencial oculto", "Hidden potential"), color: "text-accent-text", bg: "bg-accent-light",   dot: "bg-accent-text", tip: lbl("Bajo esfuerzo + alto resultado",   "Low effort, high outcome") },
          support:   { label: lbl("Necesitan apoyo",  "Need support"),     color: "text-warning",     bg: "bg-warning-light",  dot: "bg-warning",     tip: lbl("Alto esfuerzo + bajo resultado",   "High effort, low outcome") },
          priority:  { label: lbl("Prioridad",        "Priority"),         color: "text-urgent",      bg: "bg-urgent-light",   dot: "bg-urgent",      tip: lbl("Bajo esfuerzo + bajo resultado",   "Low effort, low outcome") },
        };
        const acciones: Record<Q, string> = {
          star:      lbl("Proponer reto avanzado o rol de mentor de equipo", "Offer advanced challenge or team mentor role"),
          potential: lbl("Activar: ¿están aburridos? Ajustar dificultad",    "Check if bored — adjust challenge level"),
          support:   lbl("Revisar metodología, no solo esfuerzo",            "Review learning strategy, not just effort"),
          priority:  lbl("Intervención urgente: reunión + plan de acción",   "Urgent: schedule meeting + action plan"),
        };
        const counts = (["star","potential","support","priority"] as Q[]).map(q => ({
          q, count: data.filter(d => getQ(d.effort, d.result) === q).length,
        }));
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-accent-text" />
              <h3 className="text-[15px] font-semibold text-text-primary">
                {lbl("Correlación esfuerzo × resultado", "Effort × outcome correlation")}
              </h3>
            </div>
            <p className="text-[11px] text-text-muted mb-4">
              {lbl("Cada alumno posicionado por % tareas completadas (eje X) y media LOMLOE (eje Y).", "Each student plotted by task completion % (X axis) and average LOMLOE score (Y axis).")}
            </p>

            {/* Scatter plot */}
            <div className="relative bg-background rounded-xl border border-card-border overflow-visible mb-4" style={{ height: "260px" }}>
              {/* Axis labels */}
              <span className="absolute bottom-2 inset-x-0 text-center text-[9px] text-text-muted pointer-events-none">
                ← {lbl("Menos esfuerzo", "Less effort")} · {lbl("Más esfuerzo", "More effort")} →
              </span>
              <div className="absolute" style={{ left: "8px", top: "8px", right: "8px", bottom: "22px" }}>
                {/* Quadrant lines */}
                <div className="absolute inset-0 border-l-0 border-t-0">
                  <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-card-border" />
                  <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-card-border" />
                </div>
                {/* Quadrant corner labels */}
                <span className="absolute top-2 right-2 text-[8px] font-bold text-success/70">{lbl("Destacados ↗", "Stars ↗")}</span>
                <span className="absolute top-2 left-2 text-[8px] font-bold text-accent-text/70">{lbl("Potencial ↗", "Potential ↗")}</span>
                <span className="absolute bottom-2 right-2 text-[8px] font-bold text-warning/70">{lbl("Apoyo ↘", "Support ↘")}</span>
                <span className="absolute bottom-2 left-2 text-[8px] font-bold text-urgent/70">{lbl("Prioridad ↘", "Priority ↘")}</span>

                {/* Student dots */}
                {data.map(({ s, effort, result }) => {
                  const q = getQ(effort, result);
                  const cfg = qCfg[q];
                  const xPct = Math.round(((effort - 40) / 55) * 100);
                  const yPct = Math.round(((result - 34) / 55) * 100);
                  const initials = s.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
                  return (
                    <div
                      key={s.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-default z-10"
                      style={{ left: `${Math.min(Math.max(xPct, 6), 94)}%`, bottom: `${Math.min(Math.max(yPct, 6), 94)}%` }}
                    >
                      <div className={`w-6 h-6 rounded-full ${cfg.dot} flex items-center justify-center text-white text-[7px] font-bold ring-2 ring-white shadow-sm`}>
                        {initials}
                      </div>
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-sidebar text-white text-[9px] rounded-lg px-2 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                        <span className="font-semibold">{s.name}</span><br />
                        {lbl("Esfuerzo", "Effort")}: {effort}% · {lbl("Resultado", "Result")}: {result}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quadrant summary cards */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {counts.map(({ q, count }) => {
                const cfg = qCfg[q];
                return (
                  <div key={q} className={`${cfg.bg} rounded-xl p-3 text-center`}>
                    <span className={`text-[20px] font-black ${cfg.color}`}>{count}</span>
                    <p className="text-[9px] text-text-secondary mt-0.5 font-medium leading-tight">{cfg.label}</p>
                    <p className="text-[8px] text-text-muted leading-tight mt-1">{cfg.tip}</p>
                  </div>
                );
              })}
            </div>

            {/* Action recommendations per quadrant */}
            <div className="bg-background rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={13} className="text-warning" />
                <span className="text-[11px] font-semibold text-text-primary">{lbl("Acciones recomendadas por cuadrante", "Recommended actions per quadrant")}</span>
              </div>
              {(["star","potential","support","priority"] as Q[]).map(q => {
                const cfg = qCfg[q];
                return (
                  <div key={q} className="flex items-start gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`} />
                    <div>
                      <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}: </span>
                      <span className="text-[10px] text-text-secondary">{acciones[q]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── T33: Tendencia semanal T1 — evolución competencial ──────────────── */}
      <div className="bg-card rounded-2xl border border-card-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-accent-text" />
            <h3 className="text-[14px] font-semibold text-text-primary">
              {lbl("Tendencia semanal T1 — 8 competencias LOMLOE", "Weekly T1 trend — 8 LOMLOE competencies")}
            </h3>
          </div>
          <span className="text-[10px] text-text-muted bg-background px-2 py-1 rounded-lg border border-card-border">
            {lbl("Media clase · escala 1–4", "Class avg · scale 1–4")}
          </span>
        </div>

        {/* Summary KPIs */}
        {(() => {
          const compKeys = Object.keys(t1CompTendencia);
          const totMejora = compKeys.filter(k => {
            const d = t1CompTendencia[k];
            return d.sem[3] - d.sem[0] >= 0.8;
          }).length;
          const mejorComp = compKeys.reduce((best, k) => {
            const delta = t1CompTendencia[k].sem[3] - t1CompTendencia[k].sem[0];
            const bestDelta = t1CompTendencia[best].sem[3] - t1CompTendencia[best].sem[0];
            return delta > bestDelta ? k : best;
          }, compKeys[0]);
          const mediaFinal = compKeys.reduce((s, k) => s + t1CompTendencia[k].sem[3], 0) / compKeys.length;
          const mediaInicio = compKeys.reduce((s, k) => s + t1CompTendencia[k].sem[0], 0) / compKeys.length;
          return (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-success-light rounded-xl p-3 text-center">
                <p className="text-[18px] font-black text-success leading-none">{mediaFinal.toFixed(1)}</p>
                <p className="text-[9px] text-success font-medium mt-0.5">{lbl("Media final T1", "T1 final avg")}</p>
                <p className="text-[9px] text-text-muted">{lbl("Inicio:", "Start:")} {mediaInicio.toFixed(1)}</p>
              </div>
              <div className="bg-accent-light rounded-xl p-3 text-center">
                <p className="text-[18px] font-black text-accent-text leading-none">+{(mediaFinal - mediaInicio).toFixed(2)}</p>
                <p className="text-[9px] text-accent-text font-medium mt-0.5">{lbl("Mejora global", "Global improvement")}</p>
                <p className="text-[9px] text-text-muted">{lbl("Promedio 8 comps.", "Avg 8 comps.")}</p>
              </div>
              <div className="bg-background rounded-xl p-3 text-center border border-card-border">
                <p className="text-[13px] font-black text-text-primary leading-none">{mejorComp}</p>
                <p className="text-[9px] text-text-secondary font-medium mt-0.5">{lbl("Más mejorada", "Most improved")}</p>
                <p className="text-[9px] text-success">
                  +{(t1CompTendencia[mejorComp].sem[3] - t1CompTendencia[mejorComp].sem[0]).toFixed(1)} pts
                </p>
              </div>
            </div>
          );
        })()}

        {/* Competency sparklines */}
        <div className="space-y-2.5">
          {Object.entries(t1CompTendencia).map(([comp, data]) => {
            const delta = data.sem[3] - data.sem[0];
            const pctFinal = (data.sem[3] / 4) * 100;
            const color = data.sem[3] >= 3.5 ? "bg-success" : data.sem[3] >= 2.5 ? "bg-accent-text" : data.sem[3] >= 2 ? "bg-warning" : "bg-urgent";
            const textColor = data.sem[3] >= 3.5 ? "text-success" : data.sem[3] >= 2.5 ? "text-accent-text" : data.sem[3] >= 2 ? "text-warning" : "text-urgent";
            const maxVal = 4;
            return (
              <div key={comp} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-text-primary w-10 flex-shrink-0">{comp}</span>
                {/* Sparkline bars */}
                <div className="flex items-end gap-0.5 h-8 flex-shrink-0">
                  {data.sem.map((v, wi) => {
                    const h = Math.round((v / maxVal) * 100);
                    const isLast = wi === data.sem.length - 1;
                    return (
                      <div key={wi} className="flex flex-col items-center gap-0.5 w-5">
                        <div
                          className={`w-full rounded-sm transition-all ${isLast ? color : "bg-border"}`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* Progress bar final value */}
                <div className="flex-1 bg-border rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pctFinal}%` }} />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 w-20 justify-end">
                  <span className={`text-[11px] font-bold ${textColor}`}>{data.sem[3].toFixed(1)}</span>
                  <span className={`text-[9px] font-semibold ${delta >= 0 ? "text-success" : "text-urgent"}`}>
                    {delta >= 0 ? "+" : ""}{delta.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly label axis */}
        <div className="flex items-center mt-3 pl-[52px] gap-0.5">
          {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((s) => (
            <div key={s} className="w-5 text-center">
              <span className="text-[7px] text-text-muted">{s.replace("Sem ", "S")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
