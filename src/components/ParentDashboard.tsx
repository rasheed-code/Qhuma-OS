"use client";

import {
  TrendingUp,
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { currentStudent } from "@/data/students";
import { weekSchedule } from "@/data/tasks";
import CompetencyProgress from "./CompetencyProgress";
import TeacherChat from "./TeacherChat";
import TrimesterTimeline from "./TrimesterTimeline";

const notifications = [
  {
    type: "success" as const,
    message:
      "Lucas completed his landing page — the design quality was highlighted by Prof. Ana as excellent work.",
    time: "Today, 10:30 AM",
  },
  {
    type: "success" as const,
    message:
      "Lucas earned 50 Q-Coins for completing the brand identity task ahead of schedule.",
    time: "Yesterday, 3:15 PM",
  },
  {
    type: "warning" as const,
    message:
      "Lucas's profitability calculations are scheduled for this afternoon. He may need help reviewing percentages at home.",
    time: "Today, 8:00 AM",
  },
];

const notificationConfig = {
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

export default function ParentDashboard() {
  const completedTasks = weekSchedule
    .flatMap((d) => d.tasks)
    .filter((t) => t.status === "completed").length;
  const totalTasks = weekSchedule.flatMap((d) => d.tasks).length;

  return (
    <div className="flex gap-5">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* AI Weekly Summary */}
        <div className="bg-card rounded-2xl p-6 border border-card-border mb-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-[28px] font-semibold text-text-primary leading-tight mb-1">
                Lucas&apos;s Week
              </h1>
              <p className="text-[14px] text-text-secondary">
                Project:{" "}
                <span className="font-semibold text-accent-text">
                  Launch Your Airbnb
                </span>{" "}
                — Week 3 of Trimester 1
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-success-light px-3 py-1.5 rounded-full">
              <TrendingUp size={12} className="text-success" />
              <span className="text-[11px] font-semibold text-success">
                On Track
              </span>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="bg-accent-light rounded-xl p-4 mb-4 border border-accent-text/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center">
                <span className="text-accent text-[9px] font-bold">AI</span>
              </div>
              <span className="text-[11px] font-semibold text-accent-text">
                Weekly Intelligence Summary
              </span>
            </div>
            <p className="text-[13px] text-text-primary leading-relaxed">
              Lucas had a <strong>strong start</strong> to Phase 2 this week.
              He completed his landing page with excellent design quality — Prof. Ana
              highlighted it as one of the best in the class. He&apos;s currently
              working on the hygiene protocol and has{" "}
              <strong>profitability calculations</strong> coming up this
              afternoon, which involves percentages and tax calculations. His{" "}
              <strong>Entrepreneurial competency (+8%)</strong> saw the biggest
              jump this week. Demo Day is Friday — he&apos;ll need to prepare a
              5-slide pitch by Thursday.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-background rounded-xl">
              <span className="text-[20px] font-bold text-text-primary block">
                {completedTasks}
              </span>
              <span className="text-[10px] text-text-muted">Tasks Done</span>
            </div>
            <div className="text-center p-3 bg-background rounded-xl">
              <span className="text-[20px] font-bold text-text-primary block">
                {totalTasks - completedTasks}
              </span>
              <span className="text-[10px] text-text-muted">Remaining</span>
            </div>
            <div className="text-center p-3 bg-accent-light rounded-xl">
              <span className="text-[20px] font-bold text-accent-text block">
                {currentStudent.evidencesSubmitted}
              </span>
              <span className="text-[10px] text-text-muted">Evidences</span>
            </div>
            <div className="text-center p-3 bg-background rounded-xl">
              <span className="text-[20px] font-bold text-text-primary block">
                {currentStudent.streak}
              </span>
              <span className="text-[10px] text-text-muted">Day Streak</span>
            </div>
          </div>
        </div>

        {/* Two columns: Notifications + Upcoming */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Notifications */}
          <div className="bg-card rounded-2xl p-5 border border-card-border">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={15} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">
                Notifications
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {notifications.map((notif, i) => {
                const config = notificationConfig[notif.type];
                const Icon = config.icon;
                return (
                  <div
                    key={i}
                    className={`flex gap-3 p-3 rounded-xl border ${config.border} ${config.bg}`}
                  >
                    <Icon
                      size={16}
                      className={`${config.color} flex-shrink-0 mt-0.5`}
                    />
                    <div>
                      <p className="text-[12px] text-text-primary leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-text-muted mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming deliverables */}
          <div className="bg-card rounded-2xl p-5 border border-card-border">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={15} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">
                Upcoming Deliverables
              </h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                {
                  title: "Profitability Spreadsheet",
                  due: "Today, 1:00 PM",
                  subject: "Math + Finance",
                },
                {
                  title: "Tax Calculation Worksheet",
                  due: "Today, 3:00 PM",
                  subject: "Math + Civic Ed.",
                },
                {
                  title: "Good Host Guide (10 FAQs)",
                  due: "Thursday",
                  subject: "Language Arts",
                },
                {
                  title: "Demo Day Pitch (5 slides)",
                  due: "Thursday",
                  subject: "Social + Tutoring",
                },
                {
                  title: "Digital Portfolio Upload",
                  due: "Friday",
                  subject: "Digital Skills",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-background transition-colors"
                >
                  <FileText size={14} className="text-text-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-medium text-text-primary block">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {item.subject}
                    </span>
                  </div>
                  <span className="text-[10px] text-text-muted flex-shrink-0">
                    {item.due}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row: Trimester + Competencies */}
        <div className="grid grid-cols-2 gap-5">
          <TrimesterTimeline />
          <CompetencyProgress />
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-[300px] flex-shrink-0">
        <TeacherChat role="parent" />
      </div>
    </div>
  );
}
