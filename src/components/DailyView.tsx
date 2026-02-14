"use client";

import { useState } from "react";
import { CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { DaySchedule } from "@/types";
import TaskCard from "./TaskCard";

const dayStatusIcon = {
  completed: <CheckCircle2 size={14} className="text-success" />,
  current: <Clock size={14} className="text-accent" />,
  upcoming: <ChevronRight size={14} className="text-text-muted" />,
};

export default function DailyView({ schedule }: { schedule: DaySchedule[] }) {
  const currentDayIndex = schedule.findIndex((d) => d.status === "current");
  const [selectedDay, setSelectedDay] = useState(
    currentDayIndex >= 0 ? currentDayIndex : 0
  );
  const day = schedule[selectedDay];

  return (
    <div>
      {/* Day tabs */}
      <div className="flex gap-2 mb-6">
        {schedule.map((d, i) => {
          const completedCount = d.tasks.filter(
            (t) => t.status === "completed"
          ).length;
          const isActive = i === selectedDay;

          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-[12px] font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white shadow-sm border border-card-border"
                  : "hover:bg-white/50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {dayStatusIcon[d.status]}
                <span
                  className={
                    isActive ? "text-text-primary" : "text-text-secondary"
                  }
                >
                  {d.dayShort}
                </span>
              </div>
              <span className="text-[10px] text-text-muted">{d.date}</span>
              {d.status === "completed" && (
                <span className="text-[9px] text-success font-semibold">
                  {completedCount}/{d.tasks.length}
                </span>
              )}
              {d.status === "current" && (
                <span className="text-[9px] text-accent font-semibold">
                  {completedCount}/{d.tasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Phase label */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            day.status === "completed"
              ? "bg-success"
              : day.status === "current"
              ? "bg-accent"
              : "bg-text-muted"
          }`}
        />
        <span className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
          {day.phase}
        </span>
      </div>

      {/* Task grid */}
      <div className="grid grid-cols-2 gap-3">
        {day.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
