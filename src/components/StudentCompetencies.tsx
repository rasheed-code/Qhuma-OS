"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronDown,
  FileText,
} from "lucide-react";
import { competencies } from "@/data/competencies";
import { weekSchedule } from "@/data/tasks";
import { taskEvidence } from "@/data/evidence";
import { Competency, CompetencyKey } from "@/types";

function getTasksForCompetency(key: CompetencyKey) {
  const tasks: { title: string; day: string; status: string }[] = [];
  for (const day of weekSchedule) {
    for (const task of day.tasks) {
      if (task.competencies.includes(key)) {
        tasks.push({ title: task.title, day: day.dayShort, status: task.status });
      }
    }
  }
  return tasks;
}

function RadarChart({ data }: { data: Competency[] }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 110;

  const angleStep = (2 * Math.PI) / data.length;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, radius: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const gridLevels = [25, 50, 75, 100];

  const dataPoints = data.map((comp, i) => getPoint(i, (comp.progress / 100) * maxRadius));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="flex items-center justify-center py-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid levels */}
        {gridLevels.map((level) => {
          const r = (level / 100) * maxRadius;
          const points = data.map((_, i) => getPoint(i, r));
          const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
          return (
            <path key={level} d={path} fill="none" stroke="var(--stroke)" strokeWidth="1" opacity="0.6" />
          );
        })}

        {/* Axis lines */}
        {data.map((_, i) => {
          const p = getPoint(i, maxRadius);
          return (
            <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--stroke)" strokeWidth="1" opacity="0.4" />
          );
        })}

        {/* Data polygon */}
        <path d={dataPath} fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent-dark)" strokeWidth="2" />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={data[i].color} stroke="white" strokeWidth="2" />
        ))}

        {/* Labels */}
        {data.map((comp, i) => {
          const labelR = maxRadius + 22;
          const p = getPoint(i, labelR);
          return (
            <text
              key={comp.key}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[9px] font-semibold"
              fill={comp.color}
            >
              {comp.shortName}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function CompetencyCard({ comp, isExpanded, onToggle }: { comp: Competency; isExpanded: boolean; onToggle: () => void }) {
  const delta = comp.progress - comp.previousProgress;
  const tasks = getTasksForCompetency(comp.key);

  return (
    <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 cursor-pointer hover:bg-background/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: comp.color + "20" }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-semibold text-text-primary">{comp.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-text-primary">{comp.progress}%</span>
              <span className="text-[11px] font-semibold text-success">+{delta}%</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-background overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${comp.progress}%`, backgroundColor: comp.color }}
            />
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-text-muted flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-card-border">
          <p className="text-[12px] text-text-secondary mt-3 mb-3 leading-relaxed">
            {comp.shortName} competency — Progress based on completed project tasks and evidence quality.
          </p>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-text-muted">Related tasks</span>
            {tasks.slice(0, 5).map((task, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  task.status === "completed" ? "bg-success" : task.status === "in_progress" ? "bg-accent-dark" : "bg-text-muted"
                }`} />
                <span className="text-text-secondary truncate">{task.title}</span>
                <span className="text-text-muted ml-auto flex-shrink-0">{task.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentCompetencies() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const sorted = [...competencies].sort((a, b) => b.progress - a.progress);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const mostGrowth = [...competencies].sort((a, b) => (b.progress - b.previousProgress) - (a.progress - a.previousProgress))[0];

  const recentEvidence = taskEvidence.slice(-3);

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-semibold text-text-primary leading-tight">My Competencies</h1>
          <p className="text-[14px] text-text-secondary mt-1">LOMLOE Framework — Trimester 1</p>
        </div>

        {/* Summary pills */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-background rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-success-light flex items-center justify-center">
              <TrendingUp size={16} className="text-success" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-medium block">Strongest</span>
              <span className="text-[13px] font-semibold text-text-primary">{strongest.shortName} {strongest.progress}%</span>
            </div>
          </div>
          <div className="bg-background rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-light flex items-center justify-center">
              <TrendingUp size={16} className="text-accent-text" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-medium block">Most Growth</span>
              <span className="text-[13px] font-semibold text-text-primary">{mostGrowth.shortName} +{mostGrowth.progress - mostGrowth.previousProgress}%</span>
            </div>
          </div>
          <div className="bg-background rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning-light flex items-center justify-center">
              <AlertTriangle size={16} className="text-warning" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-medium block">Needs Work</span>
              <span className="text-[13px] font-semibold text-text-primary">{weakest.shortName} {weakest.progress}%</span>
            </div>
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-6">
          <h2 className="text-[16px] font-semibold text-text-primary mb-2">Competency Map</h2>
          <RadarChart data={competencies} />
        </div>

        {/* Detailed list */}
        <div className="flex flex-col gap-3">
          {competencies.map((comp) => (
            <CompetencyCard
              key={comp.key}
              comp={comp}
              isExpanded={expandedKey === comp.key}
              onToggle={() => setExpandedKey(expandedKey === comp.key ? null : comp.key)}
            />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[300px] flex-shrink-0 flex flex-col gap-4">
        {/* Growth This Week */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Growth This Week</h3>
          <div className="flex flex-col gap-3">
            {competencies.map((comp) => {
              const delta = comp.progress - comp.previousProgress;
              return (
                <div key={comp.key} className="flex items-center gap-2.5">
                  <span className="text-[11px] text-text-secondary w-16 truncate">{comp.shortName}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-background overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(delta / 10) * 100}%`, backgroundColor: comp.color }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-success w-8 text-right">+{delta}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Evidence */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Recent Evidence</h3>
          <div className="flex flex-col gap-3">
            {recentEvidence.map((ev) => (
              <div key={ev.taskId} className="flex items-start gap-2.5 pb-3 border-b border-card-border last:border-0 last:pb-0">
                <FileText size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[12px] font-medium text-text-primary block leading-snug">{ev.title}</span>
                  <span className="text-[10px] text-text-muted capitalize">{ev.type.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
