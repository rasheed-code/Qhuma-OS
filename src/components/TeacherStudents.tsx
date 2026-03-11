"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MessageSquare, Send, CheckCircle2, AlertTriangle, Clock, Phone, Target, Sparkles, Download, Trophy, Star, BookOpen, RefreshCw, Play, Pause, RotateCcw, ClipboardList } from "lucide-react";
import { classStudents } from "@/data/students";
import { competencies } from "@/data/competencies";
import { weekSchedule } from "@/data/tasks";
import { useLang } from "@/lib/i18n";

type Filter = "all" | "excelling" | "needs_attention";

// T25 — Plan de acción individual
interface PlanAccion {
  id: string;
  descripcion: string;
  competencia: string;
  tiempoMin: number;
  estado: "pendiente" | "progreso" | "completado";
}

interface HistorialIntervencion {
  id: string;
  tipo: "comentario" | "prorroga" | "contacto";
  descripcion: string;
  fecha: string;
}

const historialPorAlumno: Record<string, HistorialIntervencion[]> = Object.fromEntries(
  classStudents.map((s, i) => {
    let lista: HistorialIntervencion[];
    if (i === 0) {
      lista = [
        { id: "hi1", tipo: "comentario", descripcion: "Refuerzo positivo: análisis de mercado muy riguroso.", fecha: "Lun, 9 mar" },
        { id: "hi2", tipo: "prorroga", descripcion: "Prórroga concedida para landing page hasta el 12 mar.", fecha: "Mar, 10 mar" },
        { id: "hi3", tipo: "comentario", descripcion: "Revisado modelo financiero — pendiente escenario pesimista.", fecha: "Mar, 10 mar" },
        { id: "hi4", tipo: "contacto", descripcion: "Contacto con familia: progreso excelente, Demo Day viernes.", fecha: "Mié, 11 mar" },
        { id: "hi5", tipo: "comentario", descripcion: "Feedback del pitch: sección de problema muy sólida.", fecha: "Mié, 11 mar" },
      ];
    } else if (s.status === "needs_attention") {
      lista = [
        { id: `h${i}a`, tipo: "contacto", descripcion: "Email a familia: sin actividad 3 días, revisión urgente.", fecha: "Lun, 9 mar" },
        { id: `h${i}b`, tipo: "comentario", descripcion: "Evidencia de Fase 2 pendiente — recordatorio enviado.", fecha: "Mar, 10 mar" },
        { id: `h${i}c`, tipo: "contacto", descripcion: "Llamada realizada — familia confirma dificultades en casa.", fecha: "Mié, 11 mar" },
      ];
    } else if (s.status === "excelling") {
      lista = [
        { id: `h${i}a`, tipo: "comentario", descripcion: "Destacado: entregó todas las evidencias antes del plazo.", fecha: "Mar, 10 mar" },
        { id: `h${i}b`, tipo: "comentario", descripcion: "Propuesta de ampliación de tareas aceptada.", fecha: "Mié, 11 mar" },
      ];
    } else {
      lista = [];
    }
    return [s.id, lista];
  })
);

interface Comentario {
  id: string;
  texto: string;
  categoria: "logro" | "atencion" | "entrega";
  fecha: string;
}

const statusDotColors: Record<string, string> = {
  on_track: "bg-green-400",
  excelling: "bg-[#4F8EF7]",
  needs_attention: "bg-red-400",
};

const statusBarColors: Record<string, string> = {
  on_track: "#22c55e",
  excelling: "#4F8EF7",
  needs_attention: "#ef4444",
};

function studentCompScore(studentIdx: number, compIdx: number): number {
  return ((studentIdx * 47 + compIdx * 31 + 17) % 60) + 35;
}

const recentTasks = weekSchedule
  .flatMap((day) => day.tasks.filter((t) => t.status === "completed"))
  .slice(0, 4);

function initComentarios(): Record<string, Comentario[]> {
  const result: Record<string, Comentario[]> = {};
  classStudents.forEach((s, i) => {
    if (i === 0) {
      result[s.id] = [
        { id: "c1", texto: "Excelente análisis de mercado en Semana 1. El modelo financiero fue especialmente riguroso.", categoria: "logro", fecha: "Lun, 9 mar" },
        { id: "c2", texto: "Pendiente: revisar el cálculo del punto de equilibrio con escenario conservador.", categoria: "entrega", fecha: "Mar, 10 mar" },
      ];
    } else if (s.status === "needs_attention") {
      result[s.id] = [
        { id: `cna-${s.id}`, texto: "Sin actividad los últimos 3 días. Revisar situación con la familia.", categoria: "atencion", fecha: "Mié, 11 mar" },
      ];
    } else {
      result[s.id] = [];
    }
  });
  return result;
}

export default function TeacherStudents() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const catConfig = {
    logro: {
      label: lbl("¡Buen trabajo!", "Good job!"),
      Icon: CheckCircle2,
      iconColor: "text-success",
      textColor: "text-success",
      border: "border-success/20",
      bg: "bg-success-light",
      activeBg: "bg-success-light text-success border border-success/30",
      inactiveBg: "bg-background text-text-muted hover:text-text-secondary",
    },
    atencion: {
      label: lbl("Requiere atención", "Needs attention"),
      Icon: AlertTriangle,
      iconColor: "text-warning",
      textColor: "text-warning",
      border: "border-warning/20",
      bg: "bg-warning-light",
      activeBg: "bg-warning-light text-warning border border-warning/30",
      inactiveBg: "bg-background text-text-muted hover:text-text-secondary",
    },
    entrega: {
      label: lbl("Entrega pendiente", "Pending submission"),
      Icon: Clock,
      iconColor: "text-urgent",
      textColor: "text-urgent",
      border: "border-urgent/20",
      bg: "bg-urgent-light",
      activeBg: "bg-urgent-light text-urgent border border-urgent/30",
      inactiveBg: "bg-background text-text-muted hover:text-text-secondary",
    },
  };

  const statusLabels: Record<string, string> = {
    on_track: lbl("Al día", "On track"),
    excelling: lbl("Destacado", "Excelling"),
    needs_attention: lbl("Necesita atención", "Needs attention"),
  };

  const tipoCfg = {
    comentario: { label: lbl("Comentario", "Comment"),          color: "text-accent-text", bg: "bg-accent-light",  Icon: MessageSquare },
    prorroga:   { label: lbl("Prórroga", "Extension"),           color: "text-warning",     bg: "bg-warning-light", Icon: Clock },
    contacto:   { label: lbl("Contacto familiar", "Family contact"), color: "text-success", bg: "bg-success-light", Icon: Phone },
  };

  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<Record<string, Comentario[]>>(initComentarios);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [categorias, setCategorias] = useState<Record<string, Comentario["categoria"]>>({});

  // T25 — Plan de acción individual
  const [planAlumnoId, setPlanAlumnoId] = useState<string | null>(null);
  const [planAcciones, setPlanAcciones] = useState<Record<string, PlanAccion[]>>({});
  const [generandoPlan, setGenerandoPlan] = useState<string | null>(null);
  const [planDescargado, setPlanDescargado] = useState<Set<string>>(new Set());
  const [accionesEstado, setAccionesEstado] = useState<Record<string, "pendiente" | "progreso" | "completado">>({});

  // T31 — Demo Day evaluación en directo
  const [demoDaySlot, setDemoDaySlot] = useState<string | null>(null);
  const [demoDayScores, setDemoDayScores] = useState<Record<string, number[]>>({});
  const [demoDayPresentados, setDemoDayPresentados] = useState<Set<string>>(new Set());
  const [demoDayTimer, setDemoDayTimer] = useState(0);
  const [demoDayRunning, setDemoDayRunning] = useState(false);
  const [demoDayExportando, setDemoDayExportando] = useState(false);
  const [demoDayExportado, setDemoDayExportado] = useState(false);

  useEffect(() => {
    if (!demoDayRunning) return;
    const id = setInterval(() => setDemoDayTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [demoDayRunning]);

  const counts = {
    all: classStudents.length,
    excelling: classStudents.filter((s) => s.status === "excelling").length,
    needs_attention: classStudents.filter((s) => s.status === "needs_attention").length,
  };

  // T25 — Generar plan con IA
  const planMockPorAlumno = (studentId: string, globalIdx: number): PlanAccion[] => {
    // Top 2 comps (highest scores) and bottom 2
    const scores = competencies.map((c, ci) => ({ key: c.key, score: studentCompScore(globalIdx, ci) }));
    const sorted = [...scores].sort((a, b) => b.score - a.score);
    const top2 = sorted.slice(0, 2);
    const bottom2 = sorted.slice(-2);
    return [
      {
        id: `p-${studentId}-1`,
        descripcion: lbl(
          `Reforzar ${top2[0].key}: preparar una sección del anuncio de Casa Limón aplicando tu punto fuerte.`,
          `Reinforce ${top2[0].key}: prepare a section of the Casa Limón listing using your strength.`
        ),
        competencia: top2[0].key,
        tiempoMin: 45,
        estado: "pendiente",
      },
      {
        id: `p-${studentId}-2`,
        descripcion: lbl(
          `Ampliar ${top2[1].key}: diseña un plan de comunicación con huéspedes en dos idiomas.`,
          `Expand ${top2[1].key}: design a guest communication plan in two languages.`
        ),
        competencia: top2[1].key,
        tiempoMin: 60,
        estado: "pendiente",
      },
      {
        id: `p-${studentId}-3`,
        descripcion: lbl(
          `Mejorar ${bottom2[0].key}: busca 3 ejemplos reales de Airbnb Málaga que trabajen esta competencia.`,
          `Improve ${bottom2[0].key}: find 3 real Airbnb Málaga examples that work on this competency.`
        ),
        competencia: bottom2[0].key,
        tiempoMin: 30,
        estado: "pendiente",
      },
    ];
  };

  const handleGenerarPlan = async (studentId: string, globalIdx: number) => {
    if (generandoPlan) return;
    setGenerandoPlan(studentId);
    try {
      const student = classStudents[globalIdx];
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "narrativa",
          message: `Genera un plan de acción semanal en español para el alumno ${student.name} del proyecto Airbnb Málaga. Incluye 3 acciones concretas: las 2 primeras refuerzan sus fortalezas (competencias LOMLOE más altas), la tercera aborda su competencia más baja. Cada acción: descripción breve (máx 15 palabras), competencia LOMLOE, tiempo estimado en minutos (30-60). Formato JSON array: [{"descripcion":"...","competencia":"CE","tiempoMin":45}]`,
          history: [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw: string = data.reply ?? "";
        const match = raw.match(/\[[\s\S]*\]/);
        if (match) {
          const parsed = JSON.parse(match[0]) as { descripcion: string; competencia: string; tiempoMin: number }[];
          const acciones: PlanAccion[] = parsed.slice(0, 3).map((item, i) => ({
            id: `p-${studentId}-${i + 1}`,
            descripcion: item.descripcion,
            competencia: item.competencia,
            tiempoMin: item.tiempoMin,
            estado: "pendiente",
          }));
          setPlanAcciones((prev) => ({ ...prev, [studentId]: acciones }));
          setGenerandoPlan(null);
          return;
        }
      }
    } catch { /* noop */ }
    setPlanAcciones((prev) => ({ ...prev, [studentId]: planMockPorAlumno(studentId, globalIdx) }));
    setGenerandoPlan(null);
  };

  const handleDescargarPlan = (student: typeof classStudents[number], acciones: PlanAccion[]) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Plan de acción — ${student.name}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; background: #f4f0e9; }
  .card { background: white; border-radius: 16px; padding: 32px; border: 1px solid #ededed; max-width: 600px; margin: 0 auto; }
  h1 { color: #141414; font-size: 20px; margin-bottom: 4px; }
  .sub { color: #666; font-size: 12px; margin-bottom: 24px; }
  .accion { background: #f4f0e9; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
  .badge { display: inline-block; background: #edffe3; color: #2f574d; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 8px; margin-right: 6px; }
  .estado { font-size: 10px; color: #9ca3af; }
  .footer { font-size: 11px; color: #9ca3af; margin-top: 24px; padding-top: 16px; border-top: 1px solid #ededed; }
</style></head><body>
<div class="card">
  <h1>Plan de acción individual — ${student.name}</h1>
  <div class="sub">Proyecto Airbnb Málaga · QHUMA OS · Semana del 11 mar 2026</div>
  ${acciones.map((a, i) => `
  <div class="accion">
    <div style="font-weight:700;font-size:14px;color:#141414;margin-bottom:8px;">Acción ${i + 1}</div>
    <p style="font-size:13px;color:#333;margin-bottom:8px;">${a.descripcion}</p>
    <span class="badge">${a.competencia}</span>
    <span class="badge" style="background:#fffbeb;color:#f59e0b;">${a.tiempoMin} min</span>
    <span class="estado">Estado: ${a.estado}</span>
  </div>`).join("")}
  <div class="footer">Generado por QHUMA OS · Prof. Ana Martínez · 1º ESO Málaga</div>
</div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plan_accion_${student.name.toLowerCase().replace(/\s+/g, "_")}_mar2026.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setPlanDescargado((prev) => new Set(prev).add(student.id));
  };

  const handleToggleAccionEstado = (accionId: string) => {
    setAccionesEstado((prev) => {
      const actual = prev[accionId] ?? "pendiente";
      const siguiente: Record<string, "pendiente" | "progreso" | "completado"> = {
        pendiente: "progreso",
        progreso: "completado",
        completado: "pendiente",
      };
      return { ...prev, [accionId]: siguiente[actual] };
    });
  };

  const filtered =
    filter === "all"
      ? classStudents
      : classStudents.filter((s) => s.status === filter);

  const handleAddComentario = (studentId: string) => {
    const texto = (inputs[studentId] ?? "").trim();
    if (!texto) return;
    const cat: Comentario["categoria"] = categorias[studentId] ?? "logro";
    const nuevo: Comentario = {
      id: `c-${Date.now()}`,
      texto,
      categoria: cat,
      fecha: new Date().toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }),
    };
    setComentarios((prev) => ({ ...prev, [studentId]: [nuevo, ...(prev[studentId] ?? [])] }));
    setInputs((prev) => ({ ...prev, [studentId]: "" }));
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold text-text-primary">{lbl("Alumnos", "Students")}</h1>
          <span className="text-[11px] font-medium bg-background text-text-secondary px-2.5 py-1 rounded-full">
            {classStudents.length} total
          </span>
          <span className="text-[11px] font-medium bg-[#4F8EF7]/10 text-[#4F8EF7] px-2.5 py-1 rounded-full">
            {counts.excelling} {lbl("destacados", "excelling")}
          </span>
          <span className="text-[11px] font-medium bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
            {counts.needs_attention} {lbl("necesitan atención", "need attention")}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-1 bg-background rounded-xl p-1 mb-6 w-fit">
        {([
          { key: "all" as Filter,              label: lbl("Todos", "All") },
          { key: "excelling" as Filter,         label: lbl("Brillando", "Excelling") },
          { key: "needs_attention" as Filter,   label: lbl("En riesgo", "At risk") },
        ]).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              filter === f.key
                ? "bg-card text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {/* Grid de alumnos */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((student, si) => {
          const globalIdx = classStudents.findIndex((s) => s.id === student.id);
          const isExpanded = expandedId === student.id;
          const studentComentarios = comentarios[student.id] ?? [];
          const cat = categorias[student.id] ?? "logro";
          const inputVal = inputs[student.id] ?? "";

          return (
            <div
              key={student.id}
              className="bg-card rounded-2xl border border-card-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Avatar + Nombre */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-sidebar text-white text-[12px] font-semibold flex items-center justify-center shrink-0">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-text-primary">
                        {student.name}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${statusDotColors[student.status]}`} />
                    </div>
                    <span className="text-[11px] text-text-muted">{statusLabels[student.status]}</span>
                  </div>
                  {studentComentarios.length > 0 && (
                    <div className="flex items-center gap-1 bg-accent-light px-1.5 py-0.5 rounded-full">
                      <MessageSquare size={9} className="text-accent-text" />
                      <span className="text-[9px] font-bold text-accent-text">{studentComentarios.length}</span>
                    </div>
                  )}
                </div>

                {/* Progreso */}
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-text-secondary">{lbl("Progreso", "Progress")}</span>
                  <span className="font-semibold text-text-primary">{student.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${student.progress}%`, backgroundColor: statusBarColors[student.status] }}
                  />
                </div>

                <p className="text-[11px] text-text-muted mb-2 truncate">
                  {lbl("Tarea:", "Task:")} <span className="text-text-secondary">{student.currentTask}</span>
                </p>
                <p className="text-[11px] text-text-muted mb-3">
                  {lbl("Evidencias:", "Evidences:")} <span className="font-medium text-text-secondary">{student.evidencesSubmitted}/16</span>
                </p>

                {/* Puntos competencias */}
                <div className="flex gap-1.5 mb-3">
                  {competencies.map((comp, ci) => {
                    const score = studentCompScore(globalIdx, ci);
                    return (
                      <span
                        key={comp.key}
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: comp.color,
                          backgroundColor: score >= 70 ? comp.color : "transparent",
                        }}
                        title={`${comp.shortName}: ${score}%`}
                      />
                    );
                  })}
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : student.id)}
                  className="flex items-center gap-1.5 text-[12px] text-accent font-medium hover:brightness-110 transition-all cursor-pointer"
                >
                  {isExpanded ? lbl("Ocultar detalles", "Hide details") : lbl("Ver detalles", "View details")}
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Panel expandido */}
              {isExpanded && (
                <div className="border-t border-card-border bg-background p-5">

                  {/* ─── T25: Plan de acción individual ─── */}
                  {(() => {
                    const acciones = planAcciones[student.id];
                    const isPlanOpen = planAlumnoId === student.id;
                    const isGenerando = generandoPlan === student.id;
                    const yaDescargado = planDescargado.has(student.id);

                    return (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Target size={13} className="text-accent-text" />
                          <h4 className="text-[12px] font-semibold text-text-primary">
                            {lbl("Plan de acción individual", "Individual action plan")}
                          </h4>
                          <button
                            onClick={() => setPlanAlumnoId(isPlanOpen ? null : student.id)}
                            className="ml-auto text-[10px] font-medium text-accent-text bg-accent-light border border-accent/20 px-2.5 py-1 rounded-full hover:bg-accent/20 transition-colors cursor-pointer"
                          >
                            {isPlanOpen ? lbl("Ocultar", "Hide") : lbl("Ver plan", "View plan")}
                          </button>
                        </div>

                        {isPlanOpen && (
                          <div className="bg-card rounded-xl border border-card-border p-4">
                            {/* Fortalezas / Áreas de mejora */}
                            {(() => {
                              const scores = competencies.map((c, ci) => ({ key: c.key, score: studentCompScore(globalIdx, ci), full: c.shortName }));
                              const sorted = [...scores].sort((a, b) => b.score - a.score);
                              const top2 = sorted.slice(0, 2);
                              const bottom2 = sorted.slice(-2);
                              return (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  <div className="bg-success-light rounded-xl p-3 border border-success/20">
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <Trophy size={11} className="text-success" />
                                      <span className="text-[10px] font-bold text-success uppercase tracking-wide">
                                        {lbl("Fortalezas", "Strengths")}
                                      </span>
                                    </div>
                                    {top2.map((c) => (
                                      <div key={c.key} className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[9px] font-bold bg-success text-white px-1.5 py-0.5 rounded">{c.key}</span>
                                        <span className="text-[9px] text-text-secondary">{c.score}%</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="bg-warning-light rounded-xl p-3 border border-warning/20">
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <Star size={11} className="text-warning" />
                                      <span className="text-[10px] font-bold text-warning uppercase tracking-wide">
                                        {lbl("Áreas de mejora", "Improvement areas")}
                                      </span>
                                    </div>
                                    {bottom2.map((c) => (
                                      <div key={c.key} className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[9px] font-bold bg-warning text-white px-1.5 py-0.5 rounded">{c.key}</span>
                                        <span className="text-[9px] text-text-secondary">{c.score}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Plan semanal */}
                            {acciones && acciones.length > 0 ? (
                              <div className="mb-4">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <BookOpen size={11} className="text-text-muted" />
                                  <span className="text-[11px] font-semibold text-text-primary">
                                    {lbl("Plan semanal — 3 acciones", "Weekly plan — 3 actions")}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {acciones.map((accion) => {
                                    const estadoActual = accionesEstado[accion.id] ?? accion.estado;
                                    const estadoCfg = {
                                      pendiente: { label: lbl("Pendiente", "Pending"), bg: "bg-background", text: "text-text-muted", border: "border-card-border" },
                                      progreso:  { label: lbl("En progreso", "In progress"), bg: "bg-warning-light", text: "text-warning", border: "border-warning/20" },
                                      completado: { label: lbl("Completado", "Completed"), bg: "bg-success-light", text: "text-success", border: "border-success/20" },
                                    }[estadoActual];
                                    return (
                                      <div key={accion.id} className={`rounded-xl p-3 border ${estadoCfg.bg} ${estadoCfg.border}`}>
                                        <div className="flex items-start gap-2">
                                          <button
                                            onClick={() => handleToggleAccionEstado(accion.id)}
                                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center cursor-pointer transition-all ${
                                              estadoActual === "completado"
                                                ? "bg-success border-success"
                                                : estadoActual === "progreso"
                                                ? "bg-warning border-warning"
                                                : "bg-card border-card-border hover:border-accent-text/40"
                                            }`}
                                          >
                                            {estadoActual === "completado" && <CheckCircle2 size={10} className="text-white" />}
                                            {estadoActual === "progreso" && <Clock size={9} className="text-white" />}
                                          </button>
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-[11px] leading-relaxed ${estadoActual === "completado" ? "line-through text-text-muted" : "text-text-secondary"}`}>
                                              {accion.descripcion}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                              <span className="text-[9px] font-bold bg-accent-light text-accent-text px-1.5 py-0.5 rounded">
                                                {accion.competencia}
                                              </span>
                                              <span className="text-[9px] text-text-muted">
                                                {accion.tiempoMin} min
                                              </span>
                                              <span className={`text-[9px] font-semibold ml-auto ${estadoCfg.text}`}>
                                                {estadoCfg.label}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-background rounded-xl p-4 text-center mb-4">
                                <Target size={20} className="text-text-muted mx-auto mb-2" />
                                <p className="text-[11px] text-text-muted">
                                  {lbl("Genera el plan para ver las acciones semanales", "Generate the plan to see weekly actions")}
                                </p>
                              </div>
                            )}

                            {/* Botones */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleGenerarPlan(student.id, globalIdx)}
                                disabled={!!generandoPlan}
                                className="flex items-center gap-1.5 text-[10px] font-semibold bg-sidebar text-accent px-3 py-2 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center"
                              >
                                {isGenerando
                                  ? <><RefreshCw size={11} className="animate-spin" />{lbl("Generando plan...", "Generating plan...")}</>
                                  : <><Sparkles size={11} />{lbl("Generar plan con IA", "Generate plan with AI")}</>
                                }
                              </button>
                              {acciones && acciones.length > 0 && (
                                <button
                                  onClick={() => handleDescargarPlan(student, acciones)}
                                  className={`flex items-center gap-1.5 text-[10px] font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                                    yaDescargado
                                      ? "bg-success-light text-success border border-success/20"
                                      : "bg-background text-text-secondary border border-card-border hover:bg-accent-light hover:text-accent-text"
                                  }`}
                                >
                                  {yaDescargado ? <CheckCircle2 size={11} /> : <Download size={11} />}
                                  {yaDescargado ? lbl("Descargado", "Downloaded") : lbl("Descargar plan", "Download plan")}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Barras de competencias */}
                  <h4 className="text-[12px] font-semibold text-text-primary mb-3">
                    {lbl("Competencias LOMLOE", "LOMLOE Competencies")}
                  </h4>
                  <div className="space-y-2 mb-5">
                    {competencies.map((comp, ci) => {
                      const score = studentCompScore(globalIdx, ci);
                      return (
                        <div key={comp.key} className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-text-secondary w-10">
                            {comp.key}
                          </span>
                          <div className="flex-1 h-1.5 bg-card rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: comp.color }} />
                          </div>
                          <span className="text-[10px] font-medium text-text-muted w-7 text-right">{score}%</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tareas recientes */}
                  <h4 className="text-[12px] font-semibold text-text-primary mb-2">
                    {lbl("Tareas completadas", "Completed tasks")}
                  </h4>
                  <div className="space-y-1.5 mb-5">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-[11px]">
                        <span className="text-success">✓</span>
                        <span className="text-text-secondary truncate">{task.title}</span>
                        <span className="text-text-muted ml-auto shrink-0">+{task.xpReward} XP</span>
                      </div>
                    ))}
                  </div>

                  {/* ─── T11: Historial de intervenciones ─── */}
                  {(() => {
                    const historial = historialPorAlumno[student.id] ?? [];
                    return (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={12} className="text-text-muted" />
                          <h4 className="text-[12px] font-semibold text-text-primary">{lbl("Historial de intervenciones", "Intervention history")}</h4>
                          <span className="ml-auto text-[9px] font-bold bg-card text-text-muted border border-card-border px-1.5 py-0.5 rounded-full">
                            {historial.length} {lbl("registradas", "recorded")}
                          </span>
                        </div>
                        {historial.length > 0 ? (
                          <div className="space-y-1.5">
                            {historial.map((h) => {
                              const cfg = tipoCfg[h.tipo];
                              const HIcon = cfg.Icon;
                              return (
                                <div key={h.id} className={`rounded-xl p-2.5 ${cfg.bg} flex items-start gap-2`}>
                                  <HIcon size={10} className={`${cfg.color} mt-0.5 flex-shrink-0`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className={`text-[9px] font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                                      <span className="text-[9px] text-text-muted ml-auto">{h.fecha}</span>
                                    </div>
                                    <p className="text-[10px] text-text-secondary leading-relaxed">{h.descripcion}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-text-muted italic">{lbl("Sin intervenciones registradas aún.", "No interventions recorded yet.")}</p>
                        )}
                      </div>
                    );
                  })()}

                  {/* ─── T6: Feedback docente ─── */}
                  <div className="border-t border-card-border pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={13} className="text-accent-text" />
                      <h4 className="text-[12px] font-semibold text-text-primary">{lbl("Comentarios de seguimiento", "Follow-up comments")}</h4>
                      {studentComentarios.length > 0 && (
                        <span className="ml-auto text-[9px] font-bold bg-accent-light text-accent-text px-1.5 py-0.5 rounded-full">
                          {studentComentarios.length} {lbl("nota", "note")}{studentComentarios.length !== 1 ? lbl("s", "s") : ""}
                        </span>
                      )}
                    </div>

                    {/* Historial de comentarios */}
                    {studentComentarios.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {studentComentarios.map((c) => {
                          const cfg = catConfig[c.categoria];
                          const CatIcon = cfg.Icon;
                          return (
                            <div key={c.id} className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border}`}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <CatIcon size={10} className={cfg.iconColor} />
                                <span className={`text-[9px] font-bold uppercase tracking-wide ${cfg.textColor}`}>
                                  {cfg.label}
                                </span>
                                <span className="text-[9px] text-text-muted ml-auto">{c.fecha}</span>
                              </div>
                              <p className="text-[11px] text-text-secondary leading-relaxed">{c.texto}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Selector de categoría */}
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      {(["logro", "atencion", "entrega"] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategorias((prev) => ({ ...prev, [student.id]: c }))}
                          className={`text-[9px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                            cat === c ? catConfig[c].activeBg : catConfig[c].inactiveBg
                          }`}
                        >
                          {catConfig[c].label}
                        </button>
                      ))}
                    </div>

                    {/* Input de comentario */}
                    <div className="flex items-center gap-2 bg-card border border-card-border rounded-xl px-3 py-2">
                      <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputs((prev) => ({ ...prev, [student.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddComentario(student.id); }}
                        placeholder={lbl("Añadir comentario de seguimiento...", "Add a follow-up comment...")}
                        className="flex-1 bg-transparent text-[11px] text-text-primary placeholder:text-text-muted outline-none"
                      />
                      <button
                        onClick={() => handleAddComentario(student.id)}
                        disabled={!inputVal.trim()}
                        className="w-6 h-6 rounded-full bg-sidebar flex items-center justify-center disabled:opacity-40 cursor-pointer hover:bg-accent-dark transition-colors disabled:cursor-not-allowed"
                      >
                        <Send size={11} className="text-accent" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* T31 — Demo Day: evaluación en directo */}
      {(() => {
        const criterios = [
          lbl("Claridad del problema", "Problem clarity"),
          lbl("Solución propuesta", "Proposed solution"),
          lbl("Viabilidad financiera", "Financial viability"),
          lbl("Presentación oral", "Oral presentation"),
        ];
        const nivelLabel = (n: number) => ["", lbl("Inicio", "Beginning"), lbl("En proceso", "Developing"), lbl("Logro", "Achieved"), lbl("Sobresaliente", "Outstanding")][n];
        const nivelBg = ["", "bg-urgent-light text-urgent", "bg-warning-light text-warning", "bg-accent-light text-accent-text", "bg-success-light text-success"];
        const slotMin = [
          "09:00", "09:06", "09:12", "09:18", "09:24", "09:30",
          "09:36", "09:42", "09:48", "09:54", "10:00", "10:06",
        ];
        const totalSecs = 6 * 60; // 6 min per slot
        const timerMM = String(Math.floor(demoDayTimer / 60)).padStart(2, "0");
        const timerSS = String(demoDayTimer % 60).padStart(2, "0");
        const timerPct = Math.min((demoDayTimer / totalSecs) * 100, 100);
        const timerOver = demoDayTimer >= totalSecs;

        const handleIniciarSlot = (id: string) => {
          setDemoDaySlot(id);
          setDemoDayTimer(0);
          setDemoDayRunning(true);
          if (!demoDayScores[id]) setDemoDayScores((prev) => ({ ...prev, [id]: [3, 3, 3, 3] }));
        };
        const handleMarcarPresentado = (id: string) => {
          setDemoDayRunning(false);
          setDemoDayPresentados((prev) => new Set([...prev, id]));
          setDemoDaySlot(null);
          setDemoDayTimer(0);
        };
        const handleExportar = () => {
          setDemoDayExportando(true);
          setTimeout(() => {
            const rows = classStudents.map((s, i) => {
              const scores = demoDayScores[s.id] ?? ["-", "-", "-", "-"];
              const avg = typeof scores[0] === "number" ? (scores.reduce((a, b) => a + (b as number), 0) / 4).toFixed(1) : "-";
              return `<tr><td>${i + 1}</td><td>${s.name}</td>${criterios.map((_, ci) => `<td>${scores[ci] ?? "-"}</td>`).join("")}<td><strong>${avg}</strong></td><td>${demoDayPresentados.has(s.id) ? "✓" : ""}</td></tr>`;
            }).join("");
            const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Demo Day Evaluación</title><style>body{font-family:Arial;padding:40px;background:#f4f0e9}table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden}th{background:#1f514c;color:#fff;padding:10px 12px;font-size:12px}td{padding:9px 12px;border-bottom:1px solid #ededed;font-size:12px}h1{color:#1f514c}p{color:#666;font-size:12px}</style></head><body><h1>Demo Day — Evaluación en directo</h1><p>QHUMA OS · Proyecto Casa Limón · ${new Date().toLocaleDateString("es-ES")}</p><table><thead><tr><th>#</th><th>Alumno</th>${criterios.map(c => `<th>${c}</th>`).join("")}<th>Media</th><th>Presentado</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `demo_day_evaluacion_${new Date().toISOString().slice(0, 10)}.pdf`;
            a.click(); URL.revokeObjectURL(url);
            setDemoDayExportando(false); setDemoDayExportado(true);
            setTimeout(() => setDemoDayExportado(false), 3000);
          }, 1200);
        };

        return (
          <div className="mt-6 bg-card rounded-2xl border border-card-border p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList size={15} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">
                  {lbl("Demo Day — Evaluación en directo", "Demo Day — Live Evaluation")}
                </h3>
                <span className="text-[10px] font-bold bg-urgent-light text-urgent px-2 py-0.5 rounded-full">
                  {lbl("Viernes 13 mar · 09:00h", "Friday Mar 13 · 09:00")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {demoDayExportado && <span className="text-[11px] text-success flex items-center gap-1"><CheckCircle2 size={12} />{lbl("Exportado", "Exported")}</span>}
                <button
                  onClick={handleExportar}
                  disabled={demoDayExportando}
                  className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {demoDayExportando ? <RefreshCw size={11} className="animate-spin" /> : <Download size={11} />}
                  {lbl("Exportar notas", "Export grades")}
                </button>
              </div>
            </div>

            {/* Timer for active presentation */}
            {demoDaySlot && (
              <div className={`mb-4 rounded-xl p-4 border ${timerOver ? "bg-urgent-light border-urgent/20" : "bg-accent-light border-accent/20"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-accent-text">
                    {lbl("Presentando:", "Presenting:")} {classStudents.find(s => s.id === demoDaySlot)?.name}
                  </span>
                  <span className={`text-[22px] font-mono font-bold ${timerOver ? "text-urgent" : "text-accent-text"}`}>
                    {timerMM}:{timerSS}
                  </span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${timerOver ? "bg-urgent" : "bg-accent-text"}`}
                    style={{ width: `${timerPct}%` }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDemoDayRunning((r) => !r)}
                    className="flex items-center gap-1 bg-sidebar text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    {demoDayRunning ? <><Pause size={11} />{lbl("Pausar", "Pause")}</> : <><Play size={11} />{lbl("Reanudar", "Resume")}</>}
                  </button>
                  <button
                    onClick={() => { setDemoDayTimer(0); setDemoDayRunning(false); }}
                    className="flex items-center gap-1 bg-background text-text-secondary text-[11px] font-medium px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <RotateCcw size={11} />{lbl("Reiniciar", "Reset")}
                  </button>
                  <button
                    onClick={() => handleMarcarPresentado(demoDaySlot)}
                    className="flex items-center gap-1 bg-success text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer ml-auto"
                  >
                    <CheckCircle2 size={11} />{lbl("Marcar presentado", "Mark as done")}
                  </button>
                </div>
              </div>
            )}

            {/* Evaluation grid */}
            <div className="space-y-2">
              {classStudents.map((student, i) => {
                const presentado = demoDayPresentados.has(student.id);
                const activo = demoDaySlot === student.id;
                const scores = demoDayScores[student.id] ?? [];
                const avg = scores.length === 4 ? (scores.reduce((a, b) => a + b, 0) / 4).toFixed(1) : null;
                return (
                  <div
                    key={student.id}
                    className={`rounded-xl border px-3 py-2.5 transition-all ${
                      activo ? "border-accent-text/30 bg-accent-light" : presentado ? "border-success/20 bg-success-light/40" : "border-card-border bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Slot time + number */}
                      <span className="text-[9px] font-mono text-text-muted w-10 flex-shrink-0">{slotMin[i]}</span>
                      {/* Name */}
                      <span className={`text-[12px] font-semibold flex-1 min-w-0 ${presentado ? "text-success" : activo ? "text-accent-text" : "text-text-primary"}`}>
                        {presentado && <CheckCircle2 size={11} className="inline mr-1 text-success" />}
                        {student.name}
                      </span>
                      {/* Score criteria (only if evaluated) */}
                      {scores.length === 4 && (
                        <div className="flex gap-1 flex-shrink-0">
                          {scores.map((sc, ci) => (
                            <button
                              key={ci}
                              onClick={() => {
                                const next = sc < 4 ? sc + 1 : 1;
                                setDemoDayScores((prev) => {
                                  const cur = [...(prev[student.id] ?? [3, 3, 3, 3])];
                                  cur[ci] = next;
                                  return { ...prev, [student.id]: cur };
                                });
                              }}
                              title={criterios[ci]}
                              className={`w-6 h-6 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${nivelBg[sc]}`}
                            >
                              {sc}
                            </button>
                          ))}
                        </div>
                      )}
                      {/* Avg */}
                      {avg && (
                        <span className="text-[11px] font-bold text-text-primary w-8 text-center flex-shrink-0">
                          {avg}
                        </span>
                      )}
                      {/* Action button */}
                      {!presentado && !activo && (
                        <button
                          onClick={() => handleIniciarSlot(student.id)}
                          className="flex items-center gap-1 bg-sidebar text-white text-[9px] font-bold px-2.5 py-1 rounded-lg cursor-pointer hover:brightness-110 transition-all flex-shrink-0"
                        >
                          <Play size={9} />{lbl("Iniciar", "Start")}
                        </button>
                      )}
                      {presentado && (
                        <span className="text-[9px] font-bold bg-success text-white px-2 py-0.5 rounded-full flex-shrink-0">
                          {lbl("Presentado", "Done")}
                        </span>
                      )}
                    </div>
                    {/* Criteria labels (only for active) */}
                    {activo && scores.length === 4 && (
                      <div className="mt-2 flex gap-1">
                        {criterios.map((c, ci) => (
                          <div key={ci} className="flex-1 text-center">
                            <span className="text-[8px] text-text-muted leading-tight block">{c}</span>
                            <span className={`text-[9px] font-semibold ${nivelBg[scores[ci]]} px-1.5 py-0.5 rounded-md inline-block mt-0.5`}>
                              {nivelLabel(scores[ci])}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-card-border">
              <div className="flex items-center gap-1.5 bg-success-light rounded-xl px-3 py-1.5">
                <span className="text-[18px] font-bold text-success">{demoDayPresentados.size}</span>
                <span className="text-[9px] text-success">{lbl("presentados", "done")}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-background rounded-xl px-3 py-1.5">
                <span className="text-[18px] font-bold text-text-primary">{classStudents.length - demoDayPresentados.size}</span>
                <span className="text-[9px] text-text-muted">{lbl("pendientes", "pending")}</span>
              </div>
              <span className="text-[10px] text-text-muted ml-auto">
                {lbl("Haz clic en los números de criterio para cambiar el nivel (1–4)", "Click criterion numbers to change LOMLOE level (1–4)")}
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
