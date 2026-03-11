"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, Send, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { classStudents } from "@/data/students";
import { competencies } from "@/data/competencies";
import { weekSchedule } from "@/data/tasks";

type Filter = "all" | "excelling" | "needs_attention";

interface Comentario {
  id: string;
  texto: string;
  categoria: "logro" | "atencion" | "entrega";
  fecha: string;
}

const catConfig = {
  logro:    {
    label: "¡Buen trabajo!",
    Icon: CheckCircle2,
    iconColor: "text-success",
    textColor: "text-success",
    border: "border-success/20",
    bg: "bg-success-light",
    activeBg: "bg-success-light text-success border border-success/30",
    inactiveBg: "bg-background text-text-muted hover:text-text-secondary",
  },
  atencion: {
    label: "Requiere atención",
    Icon: AlertTriangle,
    iconColor: "text-warning",
    textColor: "text-warning",
    border: "border-warning/20",
    bg: "bg-warning-light",
    activeBg: "bg-warning-light text-warning border border-warning/30",
    inactiveBg: "bg-background text-text-muted hover:text-text-secondary",
  },
  entrega:  {
    label: "Entrega pendiente",
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
  on_track: "Al día",
  excelling: "Destacado",
  needs_attention: "Necesita atención",
};

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
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<Record<string, Comentario[]>>(initComentarios);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [categorias, setCategorias] = useState<Record<string, Comentario["categoria"]>>({});

  const counts = {
    all: classStudents.length,
    excelling: classStudents.filter((s) => s.status === "excelling").length,
    needs_attention: classStudents.filter((s) => s.status === "needs_attention").length,
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
          <h1 className="text-[22px] font-bold text-text-primary">Alumnos</h1>
          <span className="text-[11px] font-medium bg-background text-text-secondary px-2.5 py-1 rounded-full">
            {classStudents.length} total
          </span>
          <span className="text-[11px] font-medium bg-[#4F8EF7]/10 text-[#4F8EF7] px-2.5 py-1 rounded-full">
            {counts.excelling} destacados
          </span>
          <span className="text-[11px] font-medium bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
            {counts.needs_attention} necesitan atención
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-1 bg-background rounded-xl p-1 mb-6 w-fit">
        {([
          { key: "all" as Filter, label: "Todos los alumnos" },
          { key: "excelling" as Filter, label: "Destacados" },
          { key: "needs_attention" as Filter, label: "Necesitan atención" },
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
                  <span className="text-text-secondary">Progreso</span>
                  <span className="font-semibold text-text-primary">{student.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${student.progress}%`, backgroundColor: statusBarColors[student.status] }}
                  />
                </div>

                <p className="text-[11px] text-text-muted mb-2 truncate">
                  Tarea: <span className="text-text-secondary">{student.currentTask}</span>
                </p>
                <p className="text-[11px] text-text-muted mb-3">
                  Evidencias: <span className="font-medium text-text-secondary">{student.evidencesSubmitted}/16</span>
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
                  {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Panel expandido */}
              {isExpanded && (
                <div className="border-t border-card-border bg-background p-5">
                  {/* Barras de competencias */}
                  <h4 className="text-[12px] font-semibold text-text-primary mb-3">
                    Competencias LOMLOE
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
                    Tareas completadas
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

                  {/* ─── T6: Feedback docente ─── */}
                  <div className="border-t border-card-border pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={13} className="text-accent-text" />
                      <h4 className="text-[12px] font-semibold text-text-primary">Comentarios de seguimiento</h4>
                      {studentComentarios.length > 0 && (
                        <span className="ml-auto text-[9px] font-bold bg-accent-light text-accent-text px-1.5 py-0.5 rounded-full">
                          {studentComentarios.length} nota{studentComentarios.length !== 1 ? "s" : ""}
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
                        placeholder="Añadir comentario de seguimiento..."
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
    </div>
  );
}
