"use client";

import { TrendingUp, Users, FileCheck, Flame, AlertCircle } from "lucide-react";
import { classStudents, teacherAlerts } from "@/data/students";
import { competencies } from "@/data/competencies";

// Stable pseudo-random per student×competency
function seededScore(studentIdx: number, compIdx: number): number {
  return ((studentIdx * 47 + compIdx * 31 + 17) % 60) + 35; // 35–94
}

const statusColors: Record<string, string> = {
  excelling: "text-[#4F8EF7]",
  on_track: "text-green-500",
  needs_attention: "text-red-500",
};

const alertTypeColors: Record<string, string> = {
  success: "bg-green-50 border-green-200 text-green-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  urgent: "bg-red-50 border-red-200 text-red-700",
};

export default function TeacherAnalytics() {
  const avgProgress = Math.round(
    classStudents.reduce((sum, s) => sum + s.progress, 0) / classStudents.length
  );
  const totalEvidences = classStudents.reduce((sum, s) => sum + s.evidencesSubmitted, 0);
  const topStudents = [...classStudents]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  return (
    <div>
      <h1 className="text-[22px] font-bold text-text-primary mb-6">Analytics</h1>

      <div className="flex gap-5">
        {/* Left column — 2/3 */}
        <div className="flex-1 min-w-0">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Avg. Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-accent" },
              { label: "Students", value: classStudents.length, icon: Users, color: "text-[#4F8EF7]" },
              { label: "Evidences", value: totalEvidences, icon: FileCheck, color: "text-green-500" },
              { label: "Class Streak", value: "8 days", icon: Flame, color: "text-amber-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl p-4 border border-card-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-text-muted">{stat.label}</span>
                  <stat.icon size={15} className={stat.color} />
                </div>
                <span className="text-[22px] font-bold text-text-primary">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Competency Heatmap */}
          <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">
              Competency Heatmap
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-[11px] text-text-muted font-medium text-left pb-2 pr-3 w-28">
                      Student
                    </th>
                    {competencies.map((c) => (
                      <th
                        key={c.key}
                        className="text-[10px] font-semibold text-text-secondary pb-2 px-1 text-center"
                      >
                        {c.key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student, si) => (
                    <tr key={student.id}>
                      <td className="text-[11px] text-text-primary font-medium py-1 pr-3 whitespace-nowrap">
                        {student.name.split(" ")[0]}
                      </td>
                      {competencies.map((comp, ci) => {
                        const score = seededScore(si, ci);
                        const bg =
                          score >= 75
                            ? `${comp.color}33`
                            : score >= 55
                            ? `${comp.color}1A`
                            : "#fee2e2";
                        const text = score >= 75 ? comp.color : score >= 55 ? "#92400e" : "#dc2626";
                        return (
                          <td key={comp.key} className="py-1 px-1 text-center">
                            <span
                              className="inline-block w-9 text-[10px] font-semibold rounded-md py-0.5"
                              style={{ backgroundColor: bg, color: text }}
                            >
                              {score}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Top Performers</h3>
            <div className="grid grid-cols-3 gap-3">
              {topStudents.map((student, i) => (
                <div
                  key={student.id}
                  className="bg-background rounded-xl p-4 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-sidebar text-white text-[12px] font-semibold flex items-center justify-center mx-auto mb-2">
                    {student.avatar}
                  </div>
                  <p className="text-[13px] font-semibold text-text-primary">{student.name}</p>
                  <p className="text-[11px] text-text-muted mb-2">{student.currentTask}</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-[18px] font-bold text-text-primary">{student.progress}%</span>
                    <span
                      className={`text-[10px] font-semibold ${statusColors[student.status]}`}
                    >
                      #{i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="w-72 shrink-0 space-y-5">
          {/* Class Competency Overview */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">
              Class Competencies
            </h3>
            <div className="space-y-3">
              {competencies.map((comp) => (
                <div key={comp.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-text-secondary">
                      {comp.shortName}
                    </span>
                    <span className="text-[11px] font-semibold text-text-primary">
                      {comp.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${comp.progress}%`,
                        backgroundColor: comp.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Summary */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={15} className="text-text-secondary" />
              <h3 className="text-[14px] font-semibold text-text-primary">Recent Alerts</h3>
            </div>
            <div className="space-y-2">
              {teacherAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl px-3 py-2.5 border text-[11px] ${alertTypeColors[alert.type]}`}
                >
                  <p className="font-semibold mb-0.5">{alert.student}</p>
                  <p className="opacity-80">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
