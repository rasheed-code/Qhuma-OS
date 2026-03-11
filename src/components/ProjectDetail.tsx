"use client";

import { useState, useRef } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  ChevronDown,
  FileText,
  Loader2,
  TrendingUp,
  Euro,
  Users,
  Star,
  Trophy,
  Target,
  ChevronRight,
  LayoutList,
  Columns,
  Clock,
  GripVertical,
} from "lucide-react";
import { weekSchedule, trimesterProjects } from "@/data/tasks";
import { useLang } from "@/lib/i18n";
import { taskEvidence } from "@/data/evidence";
import { competencies } from "@/data/competencies";
import { currentStudent } from "@/data/students";
import { Task, TaskEvidence as TaskEvidenceType } from "@/types";
import EvidencePreview from "@/components/EvidencePreview";

/* ── Task Card within a day ── */

function TaskCard({ task }: { task: Task }) {
  const evidence = taskEvidence.find((e) => e.taskId === task.id);
  const isDone = task.status === "completed";
  const isInProgress = task.status === "in_progress";

  return (
    <div className={`rounded-2xl p-4 transition-all ${isDone ? "bg-white" : isInProgress ? "bg-accent-light border border-accent" : "bg-background opacity-60"}`}>
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {isDone ? (
            <CheckCircle2 size={16} className="text-success flex-shrink-0" />
          ) : isInProgress ? (
            <Loader2 size={16} className="text-accent-text flex-shrink-0 animate-spin" />
          ) : (
            <Lock size={14} className="text-text-muted flex-shrink-0" />
          )}
          <h4 className="text-[13px] font-semibold text-text-primary leading-snug">{task.title}</h4>
        </div>
        <span className="text-[11px] font-semibold text-accent-text bg-accent-light px-2 py-0.5 rounded-lg flex-shrink-0 ml-2">
          +{task.xpReward} XP
        </span>
      </div>

      <div className="flex items-center gap-2 ml-6 mb-2 flex-wrap">
        <span className="text-[10px] text-text-muted">{task.time}</span>
        <span className="text-[10px] text-text-muted">|</span>
        <span className="text-[10px] text-text-secondary">{task.subject}</span>
        {task.competencies.map((key) => {
          const comp = competencies.find((c) => c.key === key);
          if (!comp) return null;
          return (
            <span
              key={key}
              className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: comp.color }}
            >
              {comp.shortName}
            </span>
          );
        })}
      </div>

      {/* Evidence preview */}
      {evidence && isDone && (
        <div className="flex gap-3 ml-6 mt-2">
          <div className="w-[140px] flex-shrink-0">
            <EvidencePreview evidence={evidence} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <FileText size={10} className="text-text-muted" />
              <span className="text-[10px] font-medium text-text-muted">Evidence</span>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">{evidence.title}</p>
          </div>
        </div>
      )}

      {/* In-progress evidence hint */}
      {isInProgress && (
        <div className="ml-6 mt-2 flex items-center gap-1.5 text-accent-text">
          <FileText size={11} />
          <span className="text-[11px]">{task.evidence}</span>
        </div>
      )}
    </div>
  );
}

/* ── Main ProjectDetail Component ── */

interface ProjectDetailProps {
  onBack: () => void;
}

// ── S12: Kanban ────────────────────────────────────────────────────────────
type KanbanCol = "todo" | "doing" | "review" | "done";

const colConfig: Record<KanbanCol, { labelEs: string; labelEn: string; bg: string; border: string; pill: string; pillText: string }> = {
  todo:   { labelEs: "Por hacer",   labelEn: "To do",       bg: "bg-background",    border: "border-card-border",   pill: "bg-card-border text-text-muted",     pillText: "text-text-muted" },
  doing:  { labelEs: "En curso",    labelEn: "In progress", bg: "bg-accent-light",  border: "border-accent/30",     pill: "bg-accent text-sidebar",              pillText: "text-sidebar" },
  review: { labelEs: "En revisión", labelEn: "In review",   bg: "bg-warning-light", border: "border-warning/30",    pill: "bg-warning-light text-warning",       pillText: "text-warning" },
  done:   { labelEs: "Completado",  labelEn: "Done",        bg: "bg-success-light", border: "border-success/20",    pill: "bg-success-light text-success",       pillText: "text-success" },
};

const statusToCol: Record<string, KanbanCol> = {
  completed: "done",
  in_progress: "doing",
  upcoming: "todo",
  locked: "todo",
};

// Some tasks start in "review" to populate that column
const reviewOverride = new Set(["mon-3", "mon-5", "tue-1"]);

function initKanban(): Record<string, KanbanCol> {
  const allTasks = weekSchedule.flatMap((d) => d.tasks);
  return Object.fromEntries(
    allTasks.map((t) => [
      t.id,
      reviewOverride.has(t.id) ? ("review" as KanbanCol) : statusToCol[t.status] ?? "todo",
    ])
  );
}

// Estimated times in minutes per task (mock)
const estimadoMin: Record<string, number> = {
  "mon-1": 60, "mon-2": 60, "mon-3": 60, "mon-4": 60, "mon-5": 90,
  "tue-1": 90, "tue-2": 60, "tue-3": 60,
  "wed-1": 90, "wed-2": 60, "wed-3": 90, "wed-4": 60,
  "thu-1": 120, "thu-2": 90, "thu-3": 60,
  "fri-1": 90, "fri-2": 90, "fri-3": 60,
};

export default function ProjectDetail({ onBack }: ProjectDetailProps) {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const [expandedDay, setExpandedDay] = useState<string | null>("Wednesday");
  const [proyectoVista, setProyectoVista] = useState<"lista" | "kanban">("lista");
  const [kanban, setKanban] = useState<Record<string, KanbanCol>>(initKanban);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanCol | null>(null);
  const dragTask = useRef<string | null>(null);

  const project = trimesterProjects.find((p) => p.status === "active")!;
  const totalTasks = weekSchedule.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = weekSchedule.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.status === "completed").length,
    0
  );
  const totalEvidences = currentStudent.evidencesTotal;
  const submittedEvidences = currentStudent.evidencesSubmitted;

  const dayIcons: Record<string, string> = {
    completed: "✓",
    current: "●",
    upcoming: "🔒",
  };

  return (
    <div>
      {/* Back button + vista toggle */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>
        <div className="flex items-center gap-1 bg-background rounded-xl p-1">
          <button
            onClick={() => setProyectoVista("lista")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              proyectoVista === "lista" ? "bg-white shadow-sm text-text-primary" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <LayoutList size={12} />
            Lista
          </button>
          <button
            onClick={() => setProyectoVista("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              proyectoVista === "kanban" ? "bg-white shadow-sm text-text-primary" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <Columns size={12} />
            Kanban
          </button>
        </div>
      </div>

      {/* Project header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Airbnb logo */}
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 1991.3 2143.2" width="32" height="34">
                <path d="m1851.6 1735.6c-15 111.6-90.1 208.1-195.2 251-51.5 21.4-107.3 27.9-163.1 21.4-53.6-6.4-107.3-23.6-163-55.7-77.2-43-154.5-109.4-244.6-208.1 141.6-173.8 227.4-332.5 259.6-474.1 15-66.5 17.2-126.6 10.7-182.4-8.6-53.6-27.9-103-57.9-145.9-66.5-96.5-178.1-152.3-302.5-152.3s-236 57.9-302.5 152.3c-30 42.9-49.3 92.3-57.9 145.9-8.6 55.8-6.4 118 10.7 182.4 32.2 141.6 120.1 302.5 259.6 476.2-88 98.7-167.3 165.2-244.6 208.1-55.8 32.2-109.4 49.4-163 55.8-55.3 6.2-111.2-1.2-163-21.4-105.1-42.9-180.2-139.5-195.2-251-6.4-53.6-2.1-107.2 19.3-167.3 6.4-21.5 17.2-42.9 27.9-68.6 15-34.3 32.2-70.8 49.3-107.3l2.2-4.3c148-319.7 306.8-645.8 472-963.3l6.4-12.9c17.2-32.1 34.3-66.5 51.5-98.7 17.2-34.3 36.5-66.5 60.1-94.4 45.1-51.5 105.1-79.4 171.6-79.4s126.6 27.9 171.6 79.4c23.6 27.9 42.9 60.1 60.1 94.4 17.2 32.2 34.3 66.5 51.5 98.6l6.5 12.9c163 319.6 321.8 645.7 469.8 965.4v2.1c17.2 34.3 32.2 73 49.3 107.3 10.7 25.8 21.5 47.2 27.9 68.6 17.1 55.9 23.5 109.5 14.9 165.3zm-856-100.9c-115.8-145.9-190.9-283.2-216.7-399-10.7-49.4-12.9-92.3-6.4-130.9 4.3-34.3 17.2-64.4 34.3-90.1 40.8-57.9 109.4-94.4 188.8-94.4s150.2 34.4 188.8 94.4c17.2 25.8 30 55.8 34.3 90.1 6.4 38.6 4.3 83.7-6.4 130.9-25.7 113.7-100.8 251-216.7 399zm967.6-111.5c-10.7-25.7-21.5-53.6-32.2-77.2-17.2-38.6-34.3-75.1-49.4-109.4l-2.1-2.1c-148-321.8-306.8-647.9-474.1-969.7l-6.4-12.9c-17.2-32.2-34.3-66.5-51.5-100.8-21.5-38.6-42.9-79.4-77.2-118-68.7-85.9-167.4-133.1-272.5-133.1-107.3 0-203.8 47.2-274.7 128.7-32.2 38.6-55.8 79.4-77.2 118-17.2 34.3-34.3 68.6-51.5 100.8l-6.4 12.8c-165.2 321.8-326.1 647.9-474.1 969.7l-2.1 4.3c-15 34.3-32.2 70.8-49.4 109.4-11.5 25.4-22.2 51.2-32.2 77.2-27.9 79.4-36.5 154.5-25.8 231.7 23.6 160.9 130.9 296.1 278.9 356.1 55.8 23.6 113.7 34.3 173.8 34.3 17.2 0 38.6-2.1 55.8-4.3 70.8-8.6 143.7-32.1 214.5-72.9 88-49.3 171.6-120.1 266-223.1 94.4 103 180.2 173.8 266 223.1 70.8 40.8 143.7 64.3 214.5 72.9 17.2 2.2 38.6 4.3 55.8 4.3 60.1 0 120.1-10.7 173.8-34.3 150.2-60.1 255.3-197.4 278.9-356.1 17.2-75 8.6-150-19.2-229.4z" fill="#e0565b"/>
              </svg>
            </div>
            <div>
              <h1 className="text-[32px] font-semibold text-text-primary leading-tight">
                {project.name}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[12px] text-text-muted font-medium">{project.weeks}</span>
                <span className="text-[11px] bg-success-light text-success font-semibold px-2.5 py-0.5 rounded-full">
                  En progreso
                </span>
                <span className="text-[12px] text-text-muted">
                  {completedTasks}/{totalTasks} tareas · {submittedEvidences}/{totalEvidences} evidencias
                </span>
              </div>
            </div>
          </div>

          {/* Project progress */}
          <div className="flex flex-col items-end">
            <span className="text-[36px] font-bold text-text-primary leading-none">{project.progress}%</span>
            <span className="text-[11px] text-text-muted mb-2">completado</span>
            <div className="w-32 h-2.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sidebar to-accent-dark rounded-full transition-all duration-700"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Real-world impact metrics */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: Euro, label: "Ingresos proyectados", value: "€847/mes", color: "text-success", bg: "bg-success-light" },
            { icon: Users, label: "Huéspedes al año", value: "32 huéspedes", color: "text-[#4F8EF7]", bg: "bg-[#eff6ff]" },
            { icon: Star, label: "Rating proyectado", value: "4.8 ★", color: "text-warning", bg: "bg-warning-light" },
            { icon: Trophy, label: "XP acumulados", value: "680 XP", color: "text-accent-text", bg: "bg-accent-light" },
          ].map((metric) => (
            <div key={metric.label} className={`${metric.bg} rounded-2xl p-4`}>
              <div className="flex items-center gap-1.5 mb-1">
                <metric.icon size={12} className={metric.color} />
                <span className="text-[10px] text-text-muted font-medium">{metric.label}</span>
              </div>
              <span className={`text-[18px] font-bold ${metric.color}`}>{metric.value}</span>
            </div>
          ))}
        </div>

        {/* Trimester journey — horizontal timeline */}
        <div className="bg-background rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={13} className="text-accent-text" />
            <span className="text-[12px] font-semibold text-text-primary">Tu viaje este trimestre</span>
          </div>
          <div className="flex items-center gap-0">
            {trimesterProjects.map((proj, i) => {
              const isActive = proj.status === "active";
              const isDone = proj.status === "completed";
              const isNext = proj.status === "upcoming" && i === trimesterProjects.findIndex(p => p.status === "active") + 1;
              return (
                <div key={proj.id} className="flex items-center flex-1">
                  <div className={`flex-1 flex flex-col items-center ${i > 0 ? "" : ""}`}>
                    {/* Node */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold mb-1.5 transition-all ${
                      isDone ? "bg-success text-white" :
                      isActive ? "bg-sidebar text-accent ring-4 ring-accent/30" :
                      "bg-border text-text-muted"
                    }`}>
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span className={`text-[9px] font-semibold text-center leading-tight px-1 ${
                      isActive ? "text-accent-text" : isDone ? "text-success" : "text-text-muted"
                    }`}>
                      {proj.name.split(":")[0].replace("Launch Your ", "").replace("Design a ", "").replace("Run a ", "").replace("Pitch to ", "")}
                    </span>
                    {isActive && (
                      <span className="text-[8px] text-accent-text bg-accent-light px-1.5 py-0.5 rounded-full mt-1 font-bold">
                        ACTIVO {proj.progress}%
                      </span>
                    )}
                  </div>
                  {/* Connector */}
                  {i < trimesterProjects.length - 1 && (
                    <div className={`h-0.5 w-6 mx-1 rounded-full flex-shrink-0 ${
                      isDone ? "bg-success" : "bg-border"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── S12: Vista Kanban ─────────────────────────────────────── */}
      {proyectoVista === "kanban" && (() => {
        const allTasks = weekSchedule.flatMap((d) => d.tasks);
        const cols: KanbanCol[] = ["todo", "doing", "review", "done"];

        const handleDragStart = (e: React.DragEvent, taskId: string) => {
          dragTask.current = taskId;
          setDragId(taskId);
          e.dataTransfer.effectAllowed = "move";
        };

        const handleDragOver = (e: React.DragEvent, col: KanbanCol) => {
          e.preventDefault();
          setDragOverCol(col);
        };

        const handleDrop = (e: React.DragEvent, col: KanbanCol) => {
          e.preventDefault();
          if (dragTask.current) {
            setKanban((prev) => ({ ...prev, [dragTask.current!]: col }));
          }
          setDragId(null);
          setDragOverCol(null);
          dragTask.current = null;
        };

        const handleDragEnd = () => {
          setDragId(null);
          setDragOverCol(null);
          dragTask.current = null;
        };

        return (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ minHeight: "420px" }}>
            {cols.map((col) => {
              const cfg = colConfig[col];
              const tasksInCol = allTasks.filter((t) => kanban[t.id] === col);
              const isOver = dragOverCol === col;
              return (
                <div
                  key={col}
                  className={`flex-1 min-w-[220px] rounded-2xl border-2 transition-all duration-150 ${
                    isOver ? "border-accent bg-accent-light/30" : `${cfg.border} ${cfg.bg}`
                  }`}
                  onDragOver={(e) => handleDragOver(e, col)}
                  onDrop={(e) => handleDrop(e, col)}
                >
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.pill}`}>
                      {tasksInCol.length}
                    </span>
                    <span className="text-[12px] font-semibold text-text-primary">{lbl(cfg.labelEs, cfg.labelEn)}</span>
                  </div>
                  {/* Tasks */}
                  <div className="flex flex-col gap-2 px-2 pb-3" style={{ minHeight: "60px" }}>
                    {tasksInCol.map((task) => {
                      const mins = estimadoMin[task.id] ?? 60;
                      const isDragging = dragId === task.id;
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          className={`bg-white rounded-xl p-3 border border-card-border cursor-grab active:cursor-grabbing transition-all ${
                            isDragging ? "opacity-40 scale-95" : "hover:border-accent/30 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-1.5 mb-1.5">
                            <GripVertical size={11} className="text-text-muted flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] font-semibold text-text-primary leading-snug flex-1">{task.title}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-3.5 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Clock size={9} className="text-text-muted" />
                              <span className="text-[9px] text-text-muted">{mins >= 60 ? `${Math.floor(mins/60)}h${mins%60 ? ` ${mins%60}min` : ""}` : `${mins}min`}</span>
                            </div>
                            {task.competencies.slice(0, 2).map((key) => (
                              <span key={key} className="text-[8px] font-bold bg-background text-accent-text px-1.5 py-0.5 rounded-full">{key}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {tasksInCol.length === 0 && (
                      <div className={`flex-1 rounded-xl border-2 border-dashed flex items-center justify-center min-h-[60px] ${
                        isOver ? "border-accent bg-accent-light/20" : "border-card-border"
                      }`}>
                        <span className="text-[10px] text-text-muted">Arrastra aquí</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* ── Vista Lista (original) ─────────────────────────────────── */}
      {proyectoVista === "lista" && (
      <div className="flex flex-col gap-3">
        {weekSchedule.map((day) => {
          const isExpanded = expandedDay === day.day;
          const isLocked = day.status === "upcoming";
          const dayDone = day.tasks.filter((t) => t.status === "completed").length;
          const dayTotal = day.tasks.length;

          return (
            <div key={day.day} className={`rounded-2xl overflow-hidden transition-all ${isLocked ? "opacity-50" : ""}`}>
              {/* Day header */}
              <button
                onClick={() => {
                  if (isLocked) return;
                  setExpandedDay(isExpanded ? null : day.day);
                }}
                className={`w-full flex items-center justify-between px-5 py-4 transition-all ${
                  isLocked
                    ? "bg-background cursor-not-allowed"
                    : isExpanded
                    ? "bg-sidebar text-white cursor-pointer"
                    : "bg-background hover:bg-accent-light cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[14px] ${isExpanded ? "text-accent" : ""}`}>
                    {dayIcons[day.status]}
                  </span>
                  <div className="text-left">
                    <span className={`text-[14px] font-semibold ${isExpanded ? "text-white" : "text-text-primary"}`}>
                      {day.day}
                    </span>
                    <span className={`text-[12px] ml-2 ${isExpanded ? "text-white/60" : "text-text-muted"}`}>
                      — {day.phase}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[12px] font-medium ${isExpanded ? "text-white/70" : "text-text-muted"}`}>
                    {dayDone}/{dayTotal}
                  </span>
                  {!isLocked && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-accent" : "text-text-muted"}`}
                    />
                  )}
                </div>
              </button>

              {/* Expanded tasks */}
              {isExpanded && !isLocked && (
                <div className="bg-background/50 px-5 py-4 flex flex-col gap-3">
                  {day.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
