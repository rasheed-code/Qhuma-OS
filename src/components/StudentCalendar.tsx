"use client";

import {
  CheckCircle2,
  Lock,
  Loader2,
  Clock,
} from "lucide-react";
import { weekSchedule } from "@/data/tasks";
import { competencies } from "@/data/competencies";
import { currentStudent } from "@/data/students";

export default function StudentCalendar() {
  const totalTasks = weekSchedule.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = weekSchedule.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.status === "completed").length,
    0
  );
  const inProgressTasks = weekSchedule.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.status === "in_progress").length,
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold text-text-primary leading-tight">Week 3 Calendar</h1>
        <p className="text-[14px] text-text-secondary mt-1">Launch Your Airbnb</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-[12px] text-text-muted">
            <span className="font-semibold text-text-primary">{completedTasks}</span>/{totalTasks} tasks completed
          </span>
          <span className="text-[12px] text-text-muted">
            <span className="font-semibold text-text-primary">{currentStudent.evidencesSubmitted}</span>/{currentStudent.evidencesTotal} evidences
          </span>
        </div>
      </div>

      {/* Weekly grid — horizontal scroll */}
      <div className="overflow-x-auto mb-6 -mx-8 px-8">
        <div className="flex gap-4" style={{ minWidth: "1200px" }}>
          {weekSchedule.map((day) => {
            const isCurrent = day.status === "current";
            const isCompleted = day.status === "completed";
            const isUpcoming = day.status === "upcoming";
            const dayCompleted = day.tasks.filter((t) => t.status === "completed").length;

            return (
              <div
                key={day.day}
                className={`w-[280px] flex-shrink-0 rounded-2xl overflow-hidden flex flex-col ${
                  isCurrent
                    ? "border-2 border-accent bg-accent-light/30"
                    : "border border-card-border bg-card"
                } ${isUpcoming ? "opacity-60" : ""}`}
              >
                {/* Day header */}
                <div className={`px-4 py-3.5 ${isCurrent ? "bg-accent-light" : isCompleted ? "bg-success-light" : "bg-background"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[14px] font-semibold text-text-primary">{day.day}</span>
                    <span className="text-[12px] text-text-muted">{day.date}</span>
                  </div>
                  <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full inline-block ${
                    isCurrent
                      ? "bg-accent text-sidebar"
                      : isCompleted
                      ? "bg-success text-white"
                      : "bg-text-muted/20 text-text-muted"
                  }`}>
                    {day.phase.split(": ")[1] || day.phase}
                  </div>
                  <div className="text-[11px] text-text-muted mt-2">
                    {dayCompleted}/{day.tasks.length} tasks
                  </div>
                </div>

                {/* Tasks list */}
                <div className="flex-1 p-3 flex flex-col gap-2">
                  {day.tasks.map((task) => {
                    const isDone = task.status === "completed";
                    const isInProgress = task.status === "in_progress";
                    const isLocked = task.status === "locked";

                    return (
                      <div
                        key={task.id}
                        className={`rounded-xl p-3 text-left transition-all ${
                          isDone
                            ? "bg-success-light"
                            : isInProgress
                            ? "bg-accent-light border border-accent"
                            : isLocked
                            ? "bg-background/50"
                            : "bg-background"
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-1.5">
                          {isDone ? (
                            <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5" />
                          ) : isInProgress ? (
                            <Loader2 size={14} className="text-accent-text flex-shrink-0 mt-0.5 animate-spin" />
                          ) : isLocked ? (
                            <Lock size={13} className="text-text-muted flex-shrink-0 mt-0.5" />
                          ) : (
                            <Clock size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-[12px] font-medium leading-snug ${
                            isLocked ? "text-text-muted" : "text-text-primary"
                          }`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-6 flex-wrap">
                          <span className="text-[10px] text-text-muted">{task.time}</span>
                          {task.competencies.slice(0, 3).map((key) => {
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
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card rounded-2xl p-4 border border-card-border flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-[11px] text-text-secondary">Completed ({completedTasks})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-dark" />
            <span className="text-[11px] text-text-secondary">In Progress ({inProgressTasks})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-background border border-card-border" />
            <span className="text-[11px] text-text-secondary">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-text-muted" />
            <span className="text-[11px] text-text-secondary">Locked</span>
          </div>
        </div>
        <div className="text-[12px] text-text-muted">
          {totalTasks} total tasks this week
        </div>
      </div>
    </div>
  );
}
