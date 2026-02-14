"use client";

import { CheckCircle2, Play, Lock } from "lucide-react";
import { trimesterProjects } from "@/data/tasks";

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success-light" },
  active: { icon: Play, color: "text-accent-text", bg: "bg-accent-light" },
  upcoming: { icon: Lock, color: "text-text-muted", bg: "bg-gray-50" },
};

export default function TrimesterTimeline() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-text-primary">
          Trimester 1 Projects
        </h3>
        <span className="text-[10px] text-text-muted">Real World Business</span>
      </div>

      <div className="flex flex-col gap-3">
        {trimesterProjects.map((project) => {
          const config = statusConfig[project.status];
          const Icon = config.icon;
          const isActive = project.status === "active";

          return (
            <div
              key={project.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-accent-light border border-accent-text/15"
                  : "hover:bg-background"
              } ${project.status === "upcoming" ? "opacity-50" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}
              >
                <Icon size={14} className={config.color} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[12px] font-semibold ${
                      isActive ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {project.name}
                  </span>
                  {project.status === "upcoming" && (
                    <span className="text-[8px] bg-background text-text-muted px-1.5 py-0.5 rounded font-medium">
                      DEMO
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-text-muted">
                  {project.weeks}
                </span>
              </div>

              {project.progress > 0 && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-text-primary">
                    {project.progress}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
