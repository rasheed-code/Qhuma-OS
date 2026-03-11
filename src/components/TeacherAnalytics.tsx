"use client";

import { useState } from "react";
import { TrendingUp, Users, FileCheck, Flame, AlertTriangle, CheckCircle2, Clock, BarChart3, ZapOff, MessageSquare } from "lucide-react";
import { classStudents } from "@/data/students";
import { competencies } from "@/data/competencies";

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
  const [contactados, setContactados] = useState<Set<string>>(new Set());

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
          <h1 className="text-[22px] font-bold text-text-primary">Análisis de clase</h1>
          <p className="text-[13px] text-text-secondary mt-0.5">Semana 3 · Proyecto Airbnb Málaga · 1º ESO</p>
        </div>
        <div className="flex items-center gap-2 bg-success-light px-3 py-1.5 rounded-full border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[11px] font-semibold text-success">Clase activa</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Progreso medio", valor: `${progMedio}%`, icon: TrendingUp, bg: "bg-accent-light", text: "text-accent-text" },
          { label: "Alumnos",        valor: classStudents.length, icon: Users, bg: "bg-background", text: "text-text-primary" },
          { label: "Entregas totales", valor: totalEntregas, icon: FileCheck, bg: "bg-success-light", text: "text-success" },
          { label: "Racha de clase", valor: "8 días", icon: Flame, bg: "bg-warning-light", text: "text-text-primary" },
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
              <h3 className="text-[14px] font-semibold text-text-primary">Mapa de competencias LOMLOE</h3>
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
                    <th className="text-[10px] text-text-muted font-medium text-left pb-2 pr-3 w-24">Alumno</th>
                    {competencies.map((c) => (
                      <th key={c.key} className="text-[9px] font-bold text-text-secondary pb-2 px-0.5 text-center w-9">
                        {c.key}
                      </th>
                    ))}
                    <th className="text-[9px] font-bold text-text-muted pb-2 px-1 text-center w-10">Media</th>
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
              <h3 className="text-[14px] font-semibold text-text-primary">Entregas por semana</h3>
              <span className="text-[11px] text-text-muted ml-auto">Meta: 90 entregas</span>
            </div>
            <div className="space-y-3">
              {semanas.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-text-secondary">{s.label}</span>
                    <div className="flex items-center gap-2">
                      {s.actual && (
                        <span className="text-[9px] font-bold bg-accent text-sidebar px-1.5 py-0.5 rounded-full">En curso</span>
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
                    <span className="text-[9px] text-text-muted">Meta: {s.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sin actividad hoy */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <ZapOff size={14} className="text-urgent" />
              <h3 className="text-[14px] font-semibold text-text-primary">Sin actividad hoy</h3>
              <span className="ml-auto text-[9px] font-bold bg-urgent-light text-urgent px-2 py-0.5 rounded-full">
                {sinActividadHoy.length} alumnos
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
                      <p className="text-[10px] text-text-muted">Última actividad: {a.ultimaAct} · Pendiente: {a.tarea}</p>
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
                      {yaContactado ? "Contactado" : "Contactar"}
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
              <h3 className="text-[14px] font-semibold text-text-primary">Alumnos en seguimiento</h3>
            </div>
            <div className="space-y-2">
              {enRiesgo.map((a) => {
                const nivel = a.riesgo >= 50 ? { label: "Alto", bg: "bg-urgent-light", text: "text-urgent", bar: "bg-urgent" }
                  : a.riesgo >= 35 ? { label: "Medio", bg: "bg-warning-light", text: "text-text-primary", bar: "bg-warning" }
                  : { label: "Bajo", bg: "bg-accent-light", text: "text-accent-text", bar: "bg-accent-text" };
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
                      <span className="text-[9px] text-text-muted block">riesgo</span>
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
              <h3 className="text-[13px] font-semibold text-text-primary">Competencias clase</h3>
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
              <h3 className="text-[13px] font-semibold text-text-primary">Tiempo por asignatura</h3>
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
              <h3 className="text-[13px] font-semibold text-text-primary">Distribución LOMLOE</h3>
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
                            title={`Nivel ${i + 1}: ${c} alumnos`}
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
              <h3 className="text-[13px] font-semibold text-text-primary">Destacados</h3>
            </div>
            <div className="space-y-2.5">
              {[...classStudents].sort((a, b) => b.progress - a.progress).slice(0, 3).map((a, i) => (
                <div key={a.id} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-text-primary truncate">{a.name.split(" ")[0]}</p>
                    <p className="text-[9px] text-text-muted">{a.evidencesSubmitted} evidencias</p>
                  </div>
                  <span className="text-[13px] font-bold text-success">{a.progress}%</span>
                  <span className="text-[9px] text-text-muted">#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparativa de progreso semanal — sparklines */}
      <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-text-primary" />
          <h3 className="text-[14px] font-semibold text-text-primary">Progreso semanal por alumno</h3>
          <span className="ml-auto text-[10px] text-text-muted">Semanas 1 → 4 del proyecto</span>
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
