"use client";

import { CheckCircle2, Lock, Circle, Clock, Zap, ChevronRight } from "lucide-react";
import { weekSchedule } from "@/data/tasks";
import { competencies } from "@/data/competencies";
import { TaskStatus, CompetencyKey } from "@/types";

const statusConfig = {
  completed: {
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success-light",
    border: "border-success/20",
    icon: CheckCircle2,
    label: "Completada",
  },
  in_progress: {
    dot: "bg-accent-dark",
    text: "text-accent-text",
    bg: "bg-accent-light",
    border: "border-accent/30",
    icon: Clock,
    label: "En progreso",
  },
  upcoming: {
    dot: "bg-text-muted",
    text: "text-text-secondary",
    bg: "bg-background",
    border: "border-card-border",
    icon: Circle,
    label: "Próxima",
  },
  locked: {
    dot: "bg-text-muted/40",
    text: "text-text-muted",
    bg: "bg-background",
    border: "border-card-border",
    icon: Lock,
    label: "Bloqueada",
  },
};

const competencyColors: Record<CompetencyKey, string> = {
  CLC: "#4F8EF7",
  CPL: "#a78bfa",
  STEM: "#22c55e",
  CD: "#f59e0b",
  CPSAA: "#ec4899",
  CC: "#14b8a6",
  CE: "#f97316",
  CCEC: "#8b5cf6",
};

interface WeeklyProgressViewProps {
  onOpenTask?: (taskId: string) => void;
}

export default function WeeklyProgressView({ onOpenTask }: WeeklyProgressViewProps) {
  const totalTasks = weekSchedule.flatMap((d) => d.tasks).length;
  const completedTasks = weekSchedule
    .flatMap((d) => d.tasks)
    .filter((t) => t.status === "completed").length;
  const inProgressTasks = weekSchedule
    .flatMap((d) => d.tasks)
    .filter((t) => t.status === "in_progress").length;

  const weekProgress = Math.round((completedTasks / totalTasks) * 100);

  // XP earned so far
  const xpEarned = weekSchedule
    .flatMap((d) => d.tasks)
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.xpReward, 0);

  return (
    <div>
      {/* Week header stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-background rounded-2xl p-4">
          <span className="text-[11px] text-text-muted font-medium block mb-1">Progreso semana</span>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-[24px] font-bold text-text-primary">{weekProgress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-success to-accent-dark transition-all duration-700"
              style={{ width: `${weekProgress}%` }}
            />
          </div>
        </div>
        <div className="bg-background rounded-2xl p-4">
          <span className="text-[11px] text-text-muted font-medium block mb-1">Completadas</span>
          <span className="text-[24px] font-bold text-success">{completedTasks}</span>
          <span className="text-[13px] text-text-muted">/{totalTasks}</span>
        </div>
        <div className="bg-background rounded-2xl p-4">
          <span className="text-[11px] text-text-muted font-medium block mb-1">En progreso</span>
          <span className="text-[24px] font-bold text-accent-text">{inProgressTasks}</span>
          <span className="text-[13px] text-text-muted"> tarea{inProgressTasks !== 1 ? "s" : ""}</span>
        </div>
        <div className="bg-background rounded-2xl p-4">
          <div className="flex items-center gap-1 mb-1">
            <Zap size={11} className="text-accent-text" />
            <span className="text-[11px] text-text-muted font-medium">XP ganados</span>
          </div>
          <span className="text-[24px] font-bold text-text-primary">{xpEarned}</span>
        </div>
      </div>

      {/* Weekly grid — one column per day */}
      <div className="grid grid-cols-5 gap-3">
        {weekSchedule.map((day) => {
          const dayCompleted = day.tasks.filter((t) => t.status === "completed").length;
          const dayTotal = day.tasks.length;
          const dayProgress = Math.round((dayCompleted / dayTotal) * 100);
          const isCurrent = day.status === "current";
          const isPast = day.status === "completed";

          return (
            <div
              key={day.day}
              className={`rounded-2xl p-3 border transition-all ${
                isCurrent
                  ? "border-accent bg-accent-light"
                  : "border-card-border bg-card"
              }`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span
                    className={`text-[11px] font-bold block ${
                      isCurrent ? "text-accent-text" : "text-text-primary"
                    }`}
                  >
                    {day.dayShort}
                  </span>
                  <span className="text-[10px] text-text-muted">{day.date}</span>
                </div>
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-accent-dark animate-pulse" />
                )}
                {isPast && (
                  <CheckCircle2 size={14} className="text-success" />
                )}
              </div>

              {/* Phase label */}
              <div className="mb-2">
                <span className="text-[9px] text-text-muted leading-tight block truncate">
                  {day.phase.replace("Phase 1: ", "").replace("Phase 2: ", "").replace("Phase 3: ", "")}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1 rounded-full bg-border mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPast ? "bg-success" : isCurrent ? "bg-accent-dark" : "bg-text-muted/30"
                  }`}
                  style={{ width: `${dayProgress}%` }}
                />
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-1.5">
                {day.tasks.map((task) => {
                  const cfg = statusConfig[task.status as TaskStatus];
                  const isClickable =
                    task.status === "in_progress" || task.status === "upcoming";

                  return (
                    <button
                      key={task.id}
                      onClick={() => isClickable && onOpenTask?.(task.id)}
                      disabled={!isClickable}
                      className={`w-full text-left rounded-xl px-2.5 py-2 border transition-all group ${cfg.bg} ${cfg.border} ${
                        isClickable
                          ? "hover:border-accent cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span
                          className={`text-[10px] font-medium leading-tight flex-1 ${cfg.text} ${
                            task.status === "locked" ? "line-through opacity-50" : ""
                          }`}
                        >
                          {task.title.length > 28
                            ? task.title.slice(0, 28) + "…"
                            : task.title}
                        </span>
                        {isClickable && (
                          <ChevronRight
                            size={10}
                            className="text-text-muted group-hover:text-accent-text transition-colors shrink-0 mt-0.5"
                          />
                        )}
                      </div>

                      {/* Competency dots */}
                      <div className="flex items-center gap-1 mt-1.5">
                        {task.competencies.slice(0, 3).map((key) => (
                          <div
                            key={key}
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: competencyColors[key] + "33" }}
                            title={competencies.find((c) => c.key === key)?.name}
                          >
                            <span
                              style={{ color: competencyColors[key] }}
                              className="text-[7px] font-bold"
                            >
                              {key}
                            </span>
                          </div>
                        ))}
                        <span className="text-[9px] text-text-muted ml-auto">
                          +{task.xpReward}XP
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Competency coverage this week */}
      <div className="mt-6 bg-background rounded-2xl p-4">
        <h3 className="text-[13px] font-semibold text-text-primary mb-3">
          Competencias trabajadas esta semana
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {competencies.map((comp) => {
            const tasksWithComp = weekSchedule
              .flatMap((d) => d.tasks)
              .filter((t) => t.competencies.includes(comp.key));
            const completedWithComp = tasksWithComp.filter(
              (t) => t.status === "completed"
            ).length;
            const coverage =
              tasksWithComp.length > 0
                ? Math.round((completedWithComp / tasksWithComp.length) * 100)
                : 0;

            return (
              <div key={comp.key} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: competencyColors[comp.key as CompetencyKey] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-semibold text-text-secondary truncate">
                      {comp.key}
                    </span>
                    <span className="text-[9px] text-text-muted">{coverage}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${coverage}%`,
                        backgroundColor: competencyColors[comp.key as CompetencyKey],
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
