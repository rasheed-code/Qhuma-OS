"use client";

import { CheckCircle2, Clock, Circle, Lock } from "lucide-react";
import { DaySchedule, Task, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";

const columns: {
  key: TaskStatus;
  label: string;
  icon: typeof CheckCircle2;
  color: string;
}[] = [
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "text-success" },
  { key: "in_progress", label: "In Progress", icon: Clock, color: "text-accent" },
  { key: "upcoming", label: "Up Next", icon: Circle, color: "text-text-muted" },
  { key: "locked", label: "Locked", icon: Lock, color: "text-text-muted" },
];

export default function KanbanView({
  schedule,
}: {
  schedule: DaySchedule[];
}) {
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
