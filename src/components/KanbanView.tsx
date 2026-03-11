"use client";

import { CheckCircle2, Clock, Circle, Lock } from "lucide-react";
import { DaySchedule, Task, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";
import { useLang } from "@/lib/i18n";

const columnDefs: {
  key: TaskStatus;
  icon: typeof CheckCircle2;
  color: string;
}[] = [
  { key: "completed", icon: CheckCircle2, color: "text-success" },
  { key: "in_progress", icon: Clock, color: "text-accent" },
  { key: "upcoming", icon: Circle, color: "text-text-muted" },
  { key: "locked", icon: Lock, color: "text-text-muted" },
];

export default function KanbanView({
  schedule,
}: {
  schedule: DaySchedule[];
}) {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const columnLabels: Record<TaskStatus, string> = {
    completed: lbl("Completadas", "Completed"),
    in_progress: lbl("En progreso", "In Progress"),
    upcoming: lbl("Próximas", "Up Next"),
    locked: lbl("Bloqueadas", "Locked"),
  };

  const columns = columnDefs.map((def) => ({ ...def, label: columnLabels[def.key] }));

  const allTasks = schedule.flatMap((d) =>
    d.tasks.map((t) => ({ ...t, dayLabel: `${d.dayShort} ${d.date}` }))
  );

  const grouped = columns.map((col) => ({
    ...col,
    tasks: allTasks.filter((t) => t.status === col.key),
  }));

  return (
    <div className="grid grid-cols-4 gap-4">
      {grouped.map((col) => (
        <div key={col.key}>
          {/* Column header */}
          <div className="flex items-center gap-2 mb-4 px-1">
            <col.icon size={14} className={col.color} />
            <span className="text-[12px] font-semibold text-text-primary">
              {col.label}
            </span>
            <span className="text-[10px] bg-background text-text-muted rounded-full px-2 py-0.5 font-medium">
              {col.tasks.length}
            </span>
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-3">
            {col.tasks.map((task) => (
              <div key={task.id}>
                <span className="text-[9px] text-text-muted font-medium px-1 mb-1 block">
                  {task.dayLabel}
                </span>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
