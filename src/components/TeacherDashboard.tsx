"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";
import { classStudents, teacherAlerts } from "@/data/students";
import TeacherChat from "./TeacherChat";
import CompetencyProgress from "./CompetencyProgress";

const alertConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success-light",
    border: "border-success/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning-light",
    border: "border-warning/20",
  },
  urgent: {
    icon: AlertCircle,
    color: "text-urgent",
    bg: "bg-urgent-light",
    border: "border-urgent/20",
  },
};

const statusColors = {
  on_track: "bg-success",
  needs_attention: "bg-urgent",
  excelling: "bg-[#4F8EF7]",
};

export default function TeacherDashboard() {
  const excelling = classStudents.filter((s) => s.status === "excelling").length;
  const onTrack = classStudents.filter((s) => s.status === "on_track").length;
  const needsAttention = classStudents.filter(
    (s) => s.status === "needs_attention"
  ).length;

  const totalEvidences = classStudents.reduce(
    (sum, s) => sum + s.evidencesSubmitted,
    0
  );
  const avgProgress = Math.round(
    classStudents.reduce((sum, s) => sum + s.progress, 0) / classStudents.length
  );

  return (
    <div className="flex gap-5">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Hero */}
        <div className="bg-card rounded-2xl p-6 border border-card-border mb-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[28px] font-semibold text-text-primary leading-tight mb-1">
                Good morning, Ana
              </h1>
              <p className="text-[14px] text-text-secondary">
                1º ESO —{" "}
                <span className="font-semibold text-accent-text">
                  Launch Your Airbnb
                </span>{" "}
                — Day 3 of 5
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className="text-[18px] font-bold text-text-primary block">
                  {classStudents.length}
                </span>
                <span className="text-[10px] text-text-muted">Students</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <span className="text-[18px] font-bold text-accent-text block">
                  {avgProgress}%
                </span>
                <span className="text-[10px] text-text-muted">Avg. Progress</span>
              </div>
            </div>
          </div>

          {/* Class status summary */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            <div className="bg-[#eff6ff] rounded-xl p-3 text-center">
              <span className="text-[20px] font-bold text-[#4F8EF7] block">
                {excelling}
              </span>
              <span className="text-[10px] text-text-muted">Excelling</span>
            </div>
            <div className="bg-success-light rounded-xl p-3 text-center">
              <span className="text-[20px] font-bold text-success block">
                {onTrack}
              </span>
              <span className="text-[10px] text-text-muted">On Track</span>
            </div>
            <div className="bg-urgent-light rounded-xl p-3 text-center">
              <span className="text-[20px] font-bold text-urgent block">
                {needsAttention}
              </span>
              <span className="text-[10px] text-text-muted">Need Attention</span>
            </div>
            <div className="bg-background rounded-xl p-3 text-center">
              <span className="text-[20px] font-bold text-text-primary block">
                {totalEvidences}
              </span>
              <span className="text-[10px] text-text-muted">
                Total Evidences
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={15} className="text-accent-text" />
            <h3 className="text-[14px] font-semibold text-text-primary">
              Intervention Alerts
            </h3>
            <span className="text-[10px] bg-urgent-light text-urgent rounded-full px-2 py-0.5 font-semibold">
              {teacherAlerts.filter((a) => a.type === "urgent").length} urgent
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {teacherAlerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${config.border} ${config.bg}`}
                >
                  <Icon
                    size={15}
                    className={`${config.color} flex-shrink-0 mt-0.5`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12px] font-semibold text-text-primary">
                        {alert.student}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-[12px] text-text-secondary leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                  <button className="text-[10px] font-semibold text-accent-text hover:text-accent-dark transition-colors flex-shrink-0 cursor-pointer">
                    Action →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Grid */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">
                Class Overview
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#4F8EF7]" />
                <span className="text-[10px] text-text-muted">Excelling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-[10px] text-text-muted">On Track</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-urgent" />
                <span className="text-[10px] text-text-muted">
                  Needs Attention
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {classStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-background transition-colors cursor-pointer"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-[11px] font-semibold text-text-secondary">
                    {student.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusColors[student.status]}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-medium text-text-primary block truncate">
                    {student.name}
                  </span>
                  <span className="text-[10px] text-text-muted truncate block">
                    {student.currentTask}
                  </span>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-[11px] font-semibold text-text-primary">
                    {student.progress}%
                  </span>
                  <div className="w-12 h-1 bg-background rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${statusColors[student.status]}`}
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Competencies + Quick Actions */}
        <div className="grid grid-cols-2 gap-5">
          <CompetencyProgress />
          <div className="flex flex-col gap-3">
            {[
              {
                icon: FileText,
                label: "Generate LOMLOE Report",
                desc: "Auto-fill inspection documents",
              },
              {
                icon: BarChart3,
                label: "Competency Analytics",
                desc: "Class-wide competency breakdown",
              },
              {
                icon: Users,
                label: "Assign Activity",
                desc: "Push a task to individual students",
              },
            ].map((action, i) => (
              <button
                key={i}
                className="bg-card rounded-2xl p-4 border border-card-border hover:border-accent-text/30 hover:shadow-sm transition-all text-left cursor-pointer"
              >
                <action.icon size={18} className="text-accent-text mb-2" />
                <span className="text-[12px] font-semibold text-text-primary block mb-0.5">
                  {action.label}
                </span>
                <span className="text-[10px] text-text-muted">{action.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-[300px] flex-shrink-0">
        <TeacherChat role="teacher" />
      </div>
    </div>
  );
}
