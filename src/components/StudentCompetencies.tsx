"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronDown,
  FileText,
  Users,
} from "lucide-react";
import { competencies } from "@/data/competencies";
import { weekSchedule } from "@/data/tasks";
import { taskEvidence } from "@/data/evidence";
import { Competency, CompetencyKey } from "@/types";
import { useLang } from "@/lib/i18n";

type Trimestre = "T1" | "T2" | "T3";

// Mock histórico de progreso por trimestre
const historicoPorTrimestre: Record<Trimestre, Record<CompetencyKey, number>> = {
  T1: { CLC: 52, CPL: 38, STEM: 44, CD: 60, CPSAA: 48, CC: 35, CE: 56, CCEC: 42 },
  T2: { CLC: 72, CPL: 55, STEM: 68, CD: 80, CPSAA: 65, CC: 48, CE: 74, CCEC: 60 },
  T3: { CLC: 85, CPL: 68, STEM: 79, CD: 90, CPSAA: 76, CC: 62, CE: 85, CCEC: 73 },
};

// Media de clase (anonimizada) — fija, no cambia por trimestre
const mediaClase: Record<CompetencyKey, number> = {
  CLC: 65, CPL: 48, STEM: 61, CD: 72, CPSAA: 58, CC: 42, CE: 66, CCEC: 54,
};

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

function RadarChart({
  data,
  mediaClaseData,
}: {
  data: Competency[];
  mediaClaseData: Record<CompetencyKey, number>;
}) {
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

  const mediaPoints = data.map((comp, i) =>
    getPoint(i, ((mediaClaseData[comp.key] ?? 50) / 100) * maxRadius)
  );
  const mediaPath = mediaPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

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

        {/* Media clase polygon */}
        <path d={mediaPath} fill="#94a3b8" fillOpacity="0.12" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Student data polygon */}
        <path d={dataPath} fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent-dark)" strokeWidth="2" />

        {/* Student data points */}
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

function CompetencyCard({
  comp,
  mediaValue,
  isExpanded,
  onToggle,
  lbl,
}: {
  comp: Competency;
  mediaValue: number;
  isExpanded: boolean;
  onToggle: () => void;
  lbl: (es: string, en: string) => string;
}) {
  const delta = comp.progress - comp.previousProgress;
  const tasks = getTasksForCompetency(comp.key);
  const encimaDeLaMedia = comp.progress >= mediaValue;

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
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-semibold text-text-primary">{comp.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-text-primary">{comp.progress}%</span>
              {delta > 0 ? (
                <span className="text-[11px] font-semibold text-success">+{delta}%</span>
              ) : (
                <span className="text-[11px] font-semibold text-text-muted">{delta}%</span>
              )}
            </div>
          </div>
          {/* Student bar */}
          <div className="h-2 rounded-full bg-background overflow-hidden mb-1">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${comp.progress}%`, backgroundColor: comp.color }}
            />
          </div>
          {/* Class average bar */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1 rounded-full bg-background overflow-hidden">
              <div
                className="h-full rounded-full bg-text-muted/40"
                style={{ width: `${mediaValue}%` }}
              />
            </div>
            <span className="text-[9px] text-text-muted flex-shrink-0">
              <Users size={9} className="inline mr-0.5" />
              {lbl("Media", "Avg")}: {mediaValue}%
            </span>
            {encimaDeLaMedia ? (
              <TrendingUp size={10} className="text-success flex-shrink-0" />
            ) : (
              <TrendingDown size={10} className="text-urgent flex-shrink-0" />
            )}
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
            {comp.shortName}: progreso basado en tareas completadas y calidad de evidencias del proyecto Airbnb Málaga.
          </p>

          {/* Comparativa vs clase */}
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-3 ${encimaDeLaMedia ? "bg-success-light" : "bg-warning-light"}`}>
            {encimaDeLaMedia
              ? <TrendingUp size={13} className="text-success flex-shrink-0" />
              : <AlertTriangle size={13} className="text-warning flex-shrink-0" />
            }
            <p className={`text-[11px] font-medium ${encimaDeLaMedia ? "text-success" : "text-warning"}`}>
              {encimaDeLaMedia
                ? lbl(
                    `+${comp.progress - mediaValue} pts por encima de la media de clase (${mediaValue}%)`,
                    `+${comp.progress - mediaValue} pts above class average (${mediaValue}%)`
                  )
                : lbl(
                    `${mediaValue - comp.progress} pts por debajo de la media — área de mejora prioritaria`,
                    `${mediaValue - comp.progress} pts below average — priority improvement area`
                  )
              }
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-text-muted">{lbl("Tareas relacionadas", "Related tasks")}</span>
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
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [trimestreActivo, setTrimestreActivo] = useState<Trimestre>("T2");

  // Build display competencies based on selected trimestre
  const displayCompetencies: Competency[] = competencies.map((comp) => ({
    ...comp,
    progress: historicoPorTrimestre[trimestreActivo][comp.key] ?? comp.progress,
    previousProgress: trimestreActivo === "T1"
      ? Math.max(0, (historicoPorTrimestre.T1[comp.key] ?? comp.progress) - 8)
      : historicoPorTrimestre[trimestreActivo === "T2" ? "T1" : "T2"][comp.key] ?? comp.progress,
  }));

  const sorted = [...displayCompetencies].sort((a, b) => b.progress - a.progress);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const mostGrowth = [...displayCompetencies].sort((a, b) => (b.progress - b.previousProgress) - (a.progress - a.previousProgress))[0];

  const recentEvidence = taskEvidence.slice(-3);

  const trimestreLabels: Record<Trimestre, string> = {
    T1: lbl("1er Trimestre", "1st Term"),
    T2: lbl("2º Trimestre", "2nd Term"),
    T3: lbl("3er Trimestre (proyección)", "3rd Term (projection)"),
  };

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[32px] font-semibold text-text-primary leading-tight">
                {lbl("Mis Competencias", "My Competencies")}
              </h1>
              <p className="text-[14px] text-text-secondary mt-1">
                {lbl("Marco LOMLOE · 8 competencias clave", "LOMLOE Framework · 8 key competencies")} · {trimestreLabels[trimestreActivo]}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-text-muted">{lbl("Media personal", "Personal average")}</span>
              <span className="text-[28px] font-bold text-accent-text">
                {Math.round(displayCompetencies.reduce((s, c) => s + c.progress, 0) / displayCompetencies.length)}%
              </span>
            </div>
          </div>

          {/* Trimestre selector */}
          <div className="flex bg-background rounded-xl p-1 gap-1 mt-4 w-fit">
            {(["T1", "T2", "T3"] as Trimestre[]).map((t) => (
              <button
                key={t}
                onClick={() => setTrimestreActivo(t)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                  trimestreActivo === t
                    ? "bg-sidebar text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {t} {trimestreActivo === t && trimestreLabels[t].split(" ").slice(0, 2).join(" ")}
              </button>
            ))}
          </div>
        </div>

        {/* Summary pills */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-success-light rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-success" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-medium block">{lbl("Tu fuerte", "Your strength")}</span>
              <span className="text-[13px] font-bold text-success">{strongest.shortName} · {strongest.progress}%</span>
            </div>
          </div>
          <div className="bg-accent-light rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-text/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-accent-text" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-medium block">{lbl("Mayor crecimiento", "Most growth")}</span>
              <span className="text-[13px] font-bold text-accent-text">{mostGrowth.shortName} · +{mostGrowth.progress - mostGrowth.previousProgress}%</span>
            </div>
          </div>
          <div className="bg-warning-light rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle size={16} className="text-warning" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-medium block">{lbl("A trabajar", "To work on")}</span>
              <span className="text-[13px] font-bold text-warning">{weakest.shortName} · {weakest.progress}%</span>
            </div>
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[16px] font-semibold text-text-primary">
              {lbl("Mapa de Competencias", "Competency Map")}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-accent-text rounded-full" />
                <span className="text-[10px] text-text-muted">Lucas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-text-muted/50 rounded-full" style={{ borderBottom: "1px dashed" }} />
                <span className="text-[10px] text-text-muted">{lbl("Media clase", "Class average")}</span>
              </div>
              <span className="text-[10px] text-text-muted bg-background px-2.5 py-1 rounded-full">
                {trimestreLabels[trimestreActivo].split(" (")[0]}
              </span>
            </div>
          </div>
          <RadarChart data={displayCompetencies} mediaClaseData={mediaClase} />
        </div>

        {/* Detailed list */}
        <div className="flex flex-col gap-3">
          {displayCompetencies.map((comp) => (
            <CompetencyCard
              key={comp.key}
              comp={comp}
              mediaValue={mediaClase[comp.key]}
              isExpanded={expandedKey === comp.key}
              onToggle={() => setExpandedKey(expandedKey === comp.key ? null : comp.key)}
              lbl={lbl}
            />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[300px] flex-shrink-0 flex flex-col gap-4">
        {/* Evolución histórica */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[14px] font-semibold text-text-primary mb-1">
            {lbl("Evolución histórica", "Historical progress")}
          </h3>
          <p className="text-[11px] text-text-muted mb-4">T1 → T2 → T3 (proyección)</p>
          <div className="flex flex-col gap-3">
            {competencies.map((comp) => {
              const t1 = historicoPorTrimestre.T1[comp.key];
              const t2 = historicoPorTrimestre.T2[comp.key];
              const t3 = historicoPorTrimestre.T3[comp.key];
              return (
                <div key={comp.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-text-secondary">{comp.shortName}</span>
                    <span className="text-[10px] text-success font-semibold">+{t3 - t1}% total</span>
                  </div>
                  <div className="flex gap-1 h-3">
                    {[
                      { val: t1, label: "T1", active: trimestreActivo === "T1" },
                      { val: t2, label: "T2", active: trimestreActivo === "T2" },
                      { val: t3, label: "T3", active: trimestreActivo === "T3" },
                    ].map((bar) => (
                      <div key={bar.label} className="flex-1 flex flex-col gap-0.5">
                        <div className="flex-1 bg-background rounded-sm overflow-hidden relative">
                          <div
                            className={`absolute bottom-0 left-0 right-0 rounded-sm transition-all ${bar.active ? "opacity-100" : "opacity-50"}`}
                            style={{
                              height: `${(bar.val / 100) * 100}%`,
                              backgroundColor: bar.active ? comp.color : comp.color + "80",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-0.5">
                    {["T1", "T2", "T3"].map((t) => (
                      <div key={t} className="flex-1 text-center text-[8px] text-text-muted">{t}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparativa con la clase */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} className="text-text-muted" />
            <h3 className="text-[14px] font-semibold text-text-primary">
              {lbl("vs. Media de clase", "vs. Class average")}
            </h3>
            <span className="ml-auto text-[9px] bg-background text-text-muted px-2 py-0.5 rounded-full">
              {lbl("Anónima", "Anonymous")}
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {displayCompetencies.map((comp) => {
              const media = mediaClase[comp.key];
              const diff = comp.progress - media;
              return (
                <div key={comp.key} className="flex items-center gap-2">
                  <span className="text-[10px] text-text-secondary w-10 truncate">{comp.shortName}</span>
                  <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${comp.progress}%`, backgroundColor: comp.color }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold w-8 text-right ${diff >= 0 ? "text-success" : "text-urgent"}`}>
                    {diff >= 0 ? "+" : ""}{diff}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-text-muted mt-3 pt-3 border-t border-card-border leading-relaxed">
            {lbl(
              "Positivo = por encima de la media. Los datos de los compañeros son anonimizados y no identificables.",
              "Positive = above average. Classmates' data is anonymized and non-identifiable."
            )}
          </p>
        </div>

        {/* Evidencias relacionadas */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">
            {lbl("Evidencias recientes", "Recent evidences")}
          </h3>
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
