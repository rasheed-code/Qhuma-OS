"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  ChevronDown,
  FileText,
  Loader2,
} from "lucide-react";
import { weekSchedule, trimesterProjects } from "@/data/tasks";
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

export default function ProjectDetail({ onBack }: ProjectDetailProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>("Wednesday");

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
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Project header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {/* Airbnb logo */}
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 1991.3 2143.2" width="32" height="34">
              <path d="m1851.6 1735.6c-15 111.6-90.1 208.1-195.2 251-51.5 21.4-107.3 27.9-163.1 21.4-53.6-6.4-107.3-23.6-163-55.7-77.2-43-154.5-109.4-244.6-208.1 141.6-173.8 227.4-332.5 259.6-474.1 15-66.5 17.2-126.6 10.7-182.4-8.6-53.6-27.9-103-57.9-145.9-66.5-96.5-178.1-152.3-302.5-152.3s-236 57.9-302.5 152.3c-30 42.9-49.3 92.3-57.9 145.9-8.6 55.8-6.4 118 10.7 182.4 32.2 141.6 120.1 302.5 259.6 476.2-88 98.7-167.3 165.2-244.6 208.1-55.8 32.2-109.4 49.4-163 55.8-55.3 6.2-111.2-1.2-163-21.4-105.1-42.9-180.2-139.5-195.2-251-6.4-53.6-2.1-107.2 19.3-167.3 6.4-21.5 17.2-42.9 27.9-68.6 15-34.3 32.2-70.8 49.3-107.3l2.2-4.3c148-319.7 306.8-645.8 472-963.3l6.4-12.9c17.2-32.1 34.3-66.5 51.5-98.7 17.2-34.3 36.5-66.5 60.1-94.4 45.1-51.5 105.1-79.4 171.6-79.4s126.6 27.9 171.6 79.4c23.6 27.9 42.9 60.1 60.1 94.4 17.2 32.2 34.3 66.5 51.5 98.6l6.5 12.9c163 319.6 321.8 645.7 469.8 965.4v2.1c17.2 34.3 32.2 73 49.3 107.3 10.7 25.8 21.5 47.2 27.9 68.6 17.1 55.9 23.5 109.5 14.9 165.3zm-856-100.9c-115.8-145.9-190.9-283.2-216.7-399-10.7-49.4-12.9-92.3-6.4-130.9 4.3-34.3 17.2-64.4 34.3-90.1 40.8-57.9 109.4-94.4 188.8-94.4s150.2 34.4 188.8 94.4c17.2 25.8 30 55.8 34.3 90.1 6.4 38.6 4.3 83.7-6.4 130.9-25.7 113.7-100.8 251-216.7 399zm967.6-111.5c-10.7-25.7-21.5-53.6-32.2-77.2-17.2-38.6-34.3-75.1-49.4-109.4l-2.1-2.1c-148-321.8-306.8-647.9-474.1-969.7l-6.4-12.9c-17.2-32.2-34.3-66.5-51.5-100.8-21.5-38.6-42.9-79.4-77.2-118-68.7-85.9-167.4-133.1-272.5-133.1-107.3 0-203.8 47.2-274.7 128.7-32.2 38.6-55.8 79.4-77.2 118-17.2 34.3-34.3 68.6-51.5 100.8l-6.4 12.8c-165.2 321.8-326.1 647.9-474.1 969.7l-2.1 4.3c-15 34.3-32.2 70.8-49.4 109.4-11.5 25.4-22.2 51.2-32.2 77.2-27.9 79.4-36.5 154.5-25.8 231.7 23.6 160.9 130.9 296.1 278.9 356.1 55.8 23.6 113.7 34.3 173.8 34.3 17.2 0 38.6-2.1 55.8-4.3 70.8-8.6 143.7-32.1 214.5-72.9 88-49.3 171.6-120.1 266-223.1 94.4 103 180.2 173.8 266 223.1 70.8 40.8 143.7 64.3 214.5 72.9 17.2 2.2 38.6 4.3 55.8 4.3 60.1 0 120.1-10.7 173.8-34.3 150.2-60.1 255.3-197.4 278.9-356.1 17.2-75 8.6-150-19.2-229.4z" fill="#e0565b"/>
            </svg>
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-[32px] font-semibold text-text-primary leading-tight">
              {project.name}
            </h1>
            <span className="text-[13px] text-text-muted font-medium">
              {project.weeks}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 w-48 h-2.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="text-[13px] font-semibold text-text-primary">
              {project.progress}%
            </span>
          </div>
          <span className="text-[12px] text-text-muted">
            {completedTasks}/{totalTasks} tasks
          </span>
          <span className="text-[12px] text-text-muted">
            {submittedEvidences}/{totalEvidences} evidences
          </span>
        </div>
      </div>

      {/* Day accordion */}
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
    </div>
  );
}
