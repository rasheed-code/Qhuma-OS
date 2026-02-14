"use client";

import { CheckCircle2, Clock, Circle, Lock, Loader2 } from "lucide-react";
import { weekSchedule } from "@/data/tasks";
import { competencies } from "@/data/competencies";
import { TaskStatus } from "@/types";

// Simulate how many students completed each task
function studentsCompleted(taskIdx: number, dayIdx: number): number {
  const seed = (dayIdx * 37 + taskIdx * 19 + 7) % 12;
  return seed + 1; // 1–12
}

const statusIcons: Record<TaskStatus, typeof CheckCircle2> = {
  completed: CheckCircle2,
  in_progress: Loader2,
  upcoming: Clock,
  locked: Lock,
};

const statusStyles: Record<TaskStatus, string> = {
  completed: "text-green-500",
  in_progress: "text-accent",
  upcoming: "text-text-muted",
  locked: "text-text-muted/40",
};

const dayStatusColors: Record<string, string> = {
  completed: "bg-green-50 text-green-600",
  current: "bg-accent/15 text-accent",
  upcoming: "bg-background text-text-muted",
};

export default function TeacherCalendar() {
  const totalTasks = weekSchedule.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = weekSchedule.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.status === "completed").length,
    0
  );

  const getCompColor = (key: string) =>
    competencies.find((c) => c.key === key)?.color ?? "#94a3b8";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary mb-1">Calendar</h1>
          <p className="text-[13px] text-text-secondary">
            Launch Your Airbnb — Week 1 of 3
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-text-muted block">Tasks</span>
            <span className="text-[15px] font-bold text-text-primary">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week grid */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-8 px-8">
        {weekSchedule.map((day, dayIdx) => (
          <div
            key={day.day}
            className="bg-card rounded-2xl border border-card-border p-4 min-w-[220px] flex-1 shrink-0"
          >
            {/* Day header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[14px] font-bold text-text-primary block">
                  {day.dayShort}
                </span>
                <span className="text-[11px] text-text-muted">{day.date}</span>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  dayStatusColors[day.status]
                }`}
              >
                {day.status === "current"
                  ? "Today"
                  : day.status.charAt(0).toUpperCase() + day.status.slice(1)}
              </span>
            </div>

            {/* Phase */}
            <p className="text-[10px] text-text-secondary font-medium mb-3 leading-tight">
              {day.phase}
            </p>

            {/* Day completion bar */}
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-green-400"
                style={{
                  width: `${
                    (day.tasks.filter((t) => t.status === "completed").length / day.tasks.length) *
                    100
                  }%`,
                }}
              />
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {day.tasks.map((task, taskIdx) => {
                const Icon = statusIcons[task.status];
                const completed = task.status === "completed" ? studentsCompleted(taskIdx, dayIdx) : 0;
                return (
                  <div
                    key={task.id}
                    className={`rounded-lg p-2.5 ${
                      task.status === "locked"
                        ? "bg-background/50 opacity-50"
                        : "bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon
                        size={13}
                        className={`mt-0.5 shrink-0 ${statusStyles[task.status]} ${
                          task.status === "in_progress" ? "animate-spin" : ""
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-primary leading-tight truncate">
                          {task.title.length > 40
                            ? task.title.slice(0, 40) + "..."
                            : task.title}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-text-muted">{task.time}</span>
                          {task.status === "completed" && (
                            <span className="text-[10px] font-medium text-green-600">
                              {completed}/12
                            </span>
                          )}
                          {task.status === "in_progress" && (
                            <span className="text-[10px] font-medium text-accent">
                              In progress
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {task.competencies.map((key) => (
                            <span
                              key={key}
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getCompColor(key) }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
        <h3 className="text-[14px] font-semibold text-text-primary mb-3">Upcoming Deadlines</h3>
        <div className="grid grid-cols-3 gap-3">
          {weekSchedule
            .flatMap((day) =>
              day.tasks
                .filter((t) => t.status === "upcoming" || t.status === "in_progress")
                .map((t) => ({ ...t, day: day.dayShort, date: day.date }))
            )
            .slice(0, 6)
            .map((task) => (
              <div key={task.id} className="bg-background rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-text-muted">
                    {task.day} {task.date}
                  </span>
                  <span className="text-[10px] text-text-muted">{task.time}</span>
                </div>
                <p className="text-[11px] font-medium text-text-primary leading-tight">
                  {task.title}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
