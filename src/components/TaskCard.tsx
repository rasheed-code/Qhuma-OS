"use client";

import { CheckCircle2, Clock, Lock, Circle, FileText } from "lucide-react";
import { Task } from "@/types";
import { competencies } from "@/data/competencies";
import { useLang } from "@/lib/i18n";

const statusStyles = {
  completed: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success-light",
    border: "border-success/20",
  },
  in_progress: {
    icon: Clock,
    color: "text-accent-text",
    bg: "bg-accent-light",
    border: "border-accent-text/20",
  },
  upcoming: {
    icon: Circle,
    color: "text-text-muted",
    bg: "bg-gray-50",
    border: "border-border",
  },
  locked: {
    icon: Lock,
    color: "text-text-muted",
    bg: "bg-gray-50",
    border: "border-border",
  },
};

export default function TaskCard({ task }: { task: Task }) {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const statusLabels = {
    completed: lbl("Completada", "Completed"),
    in_progress: lbl("En progreso", "In Progress"),
    upcoming: lbl("Próxima", "Up Next"),
    locked: lbl("Bloqueada", "Locked"),
  };

  const config = { ...statusStyles[task.status], label: statusLabels[task.status] };
  const StatusIcon = config.icon;
  const isInteractive = task.status !== "locked";

  return (
    <div
      className={`bg-card rounded-2xl p-4 border ${config.border} transition-all duration-200 ${
        isInteractive
          ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : "opacity-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted font-medium">
            {task.time}
          </span>
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.bg} ${config.color}`}
          >
            <StatusIcon size={11} />
            {config.label}
          </div>
        </div>
        <span className="text-[11px] font-semibold text-accent-text">
          +{task.xpReward} XP
        </span>
      </div>

      {/* Title */}
      <h3
        className={`text-[14px] font-semibold mb-1.5 leading-snug ${
          task.status === "locked" ? "text-text-muted" : "text-text-primary"
        }`}
      >
        {task.title}
      </h3>

      {/* Subject tag */}
      <span className="inline-block text-[10px] font-medium text-text-secondary bg-background rounded-lg px-2 py-0.5 mb-3">
        {task.subject}
      </span>

      {/* Description */}
      {isInteractive && (
        <p className="text-[12px] text-text-secondary leading-relaxed mb-3">
          {task.description}
        </p>
      )}

      {/* Competency tags */}
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        {task.competencies.map((key) => {
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

      {/* Evidence */}
      {isInteractive && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border">
          <FileText size={11} className="text-text-muted" />
          <span className="text-[10px] text-text-muted">{task.evidence}</span>
        </div>
      )}
    </div>
  );
}
