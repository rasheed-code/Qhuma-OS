"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { classStudents } from "@/data/students";
import { competencies } from "@/data/competencies";
import { weekSchedule } from "@/data/tasks";

type Filter = "all" | "excelling" | "needs_attention";

const statusLabels: Record<string, string> = {
  on_track: "On Track",
  excelling: "Excelling",
  needs_attention: "Needs Attention",
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

// Simulated competency scores per student
function studentCompScore(studentIdx: number, compIdx: number): number {
  return ((studentIdx * 47 + compIdx * 31 + 17) % 60) + 35;
}

// Recent tasks for expanded detail
const recentTasks = weekSchedule
  .flatMap((day) => day.tasks.filter((t) => t.status === "completed"))
  .slice(0, 4);

export default function TeacherStudents() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const counts = {
    all: classStudents.length,
    excelling: classStudents.filter((s) => s.status === "excelling").length,
    needs_attention: classStudents.filter((s) => s.status === "needs_attention").length,
  };

  const filtered =
    filter === "all"
      ? classStudents
      : classStudents.filter((s) => s.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold text-text-primary">Students</h1>
          <span className="text-[11px] font-medium bg-background text-text-secondary px-2.5 py-1 rounded-full">
            {classStudents.length} total
          </span>
          <span className="text-[11px] font-medium bg-[#4F8EF7]/10 text-[#4F8EF7] px-2.5 py-1 rounded-full">
            {counts.excelling} excelling
          </span>
          <span className="text-[11px] font-medium bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
            {counts.needs_attention} need attention
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-1 bg-background rounded-xl p-1 mb-6 w-fit">
        {([
          { key: "all" as Filter, label: "All Students" },
          { key: "excelling" as Filter, label: "Excelling" },
          { key: "needs_attention" as Filter, label: "Needs Attention" },
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

      {/* Student grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((student, si) => {
          const globalIdx = classStudents.findIndex((s) => s.id === student.id);
          const isExpanded = expandedId === student.id;
          return (
            <div
              key={student.id}
              className="bg-card rounded-2xl border border-card-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-sidebar text-white text-[12px] font-semibold flex items-center justify-center shrink-0">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-text-primary">
                        {student.name}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${statusDotColors[student.status]}`}
                      />
                    </div>
                    <span className="text-[11px] text-text-muted">
                      {statusLabels[student.status]}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-text-secondary">Progress</span>
                  <span className="font-semibold text-text-primary">{student.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${student.progress}%`,
                      backgroundColor: statusBarColors[student.status],
                    }}
                  />
                </div>

                {/* Current task */}
                <p className="text-[11px] text-text-muted mb-2 truncate">
                  Current: <span className="text-text-secondary">{student.currentTask}</span>
                </p>

                {/* Evidences */}
                <p className="text-[11px] text-text-muted mb-3">
                  Evidences: <span className="font-medium text-text-secondary">{student.evidencesSubmitted}/16</span>
                </p>

                {/* Competency dots */}
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

                {/* Expand button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : student.id)}
                  className="flex items-center gap-1.5 text-[12px] text-accent font-medium hover:brightness-110 transition-all cursor-pointer"
                >
                  {isExpanded ? "Hide Details" : "View Details"}
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-card-border bg-background p-5">
                  {/* Competency bars */}
                  <h4 className="text-[12px] font-semibold text-text-primary mb-3">
                    Competency Scores
                  </h4>
                  <div className="space-y-2 mb-4">
                    {competencies.map((comp, ci) => {
                      const score = studentCompScore(globalIdx, ci);
                      return (
                        <div key={comp.key} className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-text-secondary w-10">
                            {comp.key}
                          </span>
                          <div className="flex-1 h-1.5 bg-card rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${score}%`,
                                backgroundColor: comp.color,
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-text-muted w-7 text-right">
                            {score}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent completed tasks */}
                  <h4 className="text-[12px] font-semibold text-text-primary mb-2">
                    Recent Tasks
                  </h4>
                  <div className="space-y-1.5 mb-4">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-[11px]">
                        <span className="text-green-500">✓</span>
                        <span className="text-text-secondary truncate">{task.title}</span>
                        <span className="text-text-muted ml-auto shrink-0">+{task.xpReward} XP</span>
                      </div>
                    ))}
                  </div>

                  <button className="flex items-center gap-1.5 text-[12px] text-accent font-medium hover:brightness-110 transition-all cursor-pointer">
                    <MessageSquare size={13} />
                    Send Message
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
