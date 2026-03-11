"use client";

import { useState } from "react";
import {
  TrendingUp,
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  BarChart3,
  Calendar,
  Lightbulb,
  ArrowRight,
  FileText,
  Download,
  Loader2,
  Sparkles,
  Heart,
} from "lucide-react";
import { currentStudent } from "@/data/students";
import { weekSchedule } from "@/data/tasks";
import { competencies } from "@/data/competencies";
import TeacherChat from "./TeacherChat";
import { ParentView } from "@/types";

type CardTab = "overview" | "progress" | "calendar";

interface ParentDashboardProps {
  onNavigate: (view: ParentView) => void;
}

const notifications = [
  {
    type: "success" as const,
    message:
      "Lucas completed his landing page — Prof. Ana highlighted it as one of the best in class.",
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
      "Profitability calculations this afternoon involve percentages and tax — he may benefit from a quick review at home.",
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

// Top 3 competency movers this week
const topMovers = competencies
  .map((c) => ({ ...c, delta: c.progress - c.previousProgress }))
  .sort((a, b) => b.delta - a.delta)
  .slice(0, 3);

// Next 3 upcoming deliverables
const upcomingDeliverables = [
  { title: "Profitability Spreadsheet", due: "Today, 1 PM", subject: "Math + Finance", urgent: true },
  { title: "Tax Calculation Worksheet", due: "Today, 3 PM", subject: "Math + Civic Ed.", urgent: true },
  { title: "Good Host Guide (10 FAQs)", due: "Thursday", subject: "Language Arts", urgent: false },
];

export default function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<CardTab>("overview");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [aiReport, setAiReport] = useState<{
    summary?: string; strengths?: string[]; improvements?: string[]; encouragement?: string;
  } | null>(null);

  const generateFamilyReport = async () => {
    setGeneratingReport(true);
    setReportGenerated(false);
    try {
      const compData = competencies.map(c => ({ key: c.key, progress: c.progress }));
      const res = await fetch("/api/generate-lomloe-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: "Lucas García",
          studentClass: "1º ESO",
          projectName: "Gestiona tu Airbnb en Málaga",
          competencies: compData,
          evidencesCount: currentStudent.evidencesSubmitted,
          streak: currentStudent.streak,
          reportType: "family",
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setAiReport(data);
        setReportGenerated(true);
      }
    } catch { /* silent */ } finally {
      setGeneratingReport(false);
    }
  };

  const completedTasks = weekSchedule
    .flatMap((d) => d.tasks)
    .filter((t) => t.status === "completed").length;
  const totalTasks = weekSchedule.flatMap((d) => d.tasks).length;

  const tabs: { id: CardTab; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "Overview", icon: Bell },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0">

        {/* Tab navigation */}
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-card text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div className="bg-card rounded-2xl p-6 border border-card-border mb-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[11px] text-text-muted mb-1 uppercase tracking-wide">
                    Wednesday · Week 3 of 12
                  </p>
                  <h1 className="text-[26px] font-semibold text-text-primary leading-tight">
                    Lucas is having a strong week.
                  </h1>
                  <p className="text-[13px] text-text-secondary mt-1">
                    Project:{" "}
                    <span className="font-semibold text-accent-text">
                      Launch Your Airbnb
                    </span>{" "}
                    · Trimester 1 of 4
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-success-light px-3 py-1.5 rounded-full flex-shrink-0">
                  <TrendingUp size={12} className="text-success" />
                  <span className="text-[11px] font-semibold text-success">On Track</span>
                </div>
              </div>

              <div className="bg-accent-light rounded-xl p-4 mb-4 border border-accent-text/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center">
                      <Sparkles size={10} className="text-accent" />
                    </div>
                    <span className="text-[11px] font-semibold text-accent-text">
                      Resumen inteligente de la semana
                    </span>
                  </div>
                  <button
                    onClick={generateFamilyReport}
                    disabled={generatingReport}
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-accent-text bg-white/60 hover:bg-white transition-colors px-2.5 py-1 rounded-lg cursor-pointer disabled:opacity-60 border border-accent/30"
                  >
                    {generatingReport ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Download size={10} />
                    )}
                    {generatingReport ? "Generando..." : "Informe IA"}
                  </button>
                </div>

                {/* AI Report if generated */}
                {aiReport && reportGenerated ? (
                  <div>
                    <p className="text-[13px] text-text-primary leading-relaxed mb-3">
                      {aiReport.summary}
                    </p>
                    {aiReport.strengths && aiReport.strengths.length > 0 && (
                      <div className="mb-2">
                        <span className="text-[10px] font-bold text-success uppercase tracking-wide block mb-1">
                          Puntos fuertes
                        </span>
                        {aiReport.strengths.map((s, i) => (
                          <div key={i} className="flex items-start gap-1.5 mb-1">
                            <CheckCircle2 size={10} className="text-success mt-0.5 flex-shrink-0" />
                            <span className="text-[11px] text-text-secondary">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {aiReport.encouragement && (
                      <div className="flex items-start gap-2 bg-white/50 rounded-lg p-2.5 mt-2">
                        <Heart size={12} className="text-urgent flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] text-text-primary italic">{aiReport.encouragement}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[13px] text-text-primary leading-relaxed">
                    Lucas ha tenido un <strong>inicio muy sólido</strong> en la Fase 2. Su
                    página de aterrizaje fue destacada por la Prof. Ana como una de las mejores
                    de clase. Esta tarde trabaja en <strong>cálculos financieros</strong>:
                    precios, márgenes y IVA en un Airbnb real. Su{" "}
                    <strong>competencia Emprendedora subió +8%</strong> esta
                    semana. El Demo Day es el viernes — necesita preparar un pitch de 5 diapositivas.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-background rounded-xl">
                  <span className="text-[20px] font-bold text-text-primary block">{completedTasks}</span>
                  <span className="text-[10px] text-text-muted">Tasks Done</span>
                </div>
                <div className="text-center p-3 bg-background rounded-xl">
                  <span className="text-[20px] font-bold text-text-primary block">{totalTasks - completedTasks}</span>
                  <span className="text-[10px] text-text-muted">Remaining</span>
                </div>
                <div className="text-center p-3 bg-accent-light rounded-xl">
                  <span className="text-[20px] font-bold text-accent-text block">{currentStudent.evidencesSubmitted}</span>
                  <span className="text-[10px] text-text-muted">Evidences</span>
                </div>
                <div className="text-center p-3 bg-background rounded-xl">
                  <span className="text-[20px] font-bold text-text-primary block">{currentStudent.streak}</span>
                  <span className="text-[10px] text-text-muted">Day Streak</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-card-border mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb size={15} className="text-accent-text" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-text-primary mb-1">
                    How to support Lucas tonight
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    He&apos;s working on{" "}
                    <strong>profitability and IVA calculations</strong> today —
                    real percentages applied to his Airbnb pricing. At dinner,
                    try asking:{" "}
                    <em>
                      &ldquo;If a night costs €80 and the IVA is 10%, what does
                      a guest actually pay?&rdquo;
                    </em>{" "}
                    That kind of real conversation reinforces what he practiced
                    better than any worksheet.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-card-border">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={15} className="text-text-primary" />
                <h3 className="text-[14px] font-semibold text-text-primary">Notifications</h3>
                <span className="ml-auto text-[10px] text-text-muted">Today</span>
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
                      <Icon size={16} className={`${config.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className="text-[12px] text-text-primary leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-text-muted mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PROGRESS SNEAK PEEK ── */}
        {activeTab === "progress" && (
          <div className="bg-card rounded-2xl p-6 border border-card-border">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[11px] text-text-muted mb-0.5 uppercase tracking-wide">This week</p>
                <h2 className="text-[18px] font-semibold text-text-primary">Top movers</h2>
              </div>
              <button
                onClick={() => onNavigate("progress")}
                className="flex items-center gap-1.5 text-[12px] font-medium text-accent-text hover:underline cursor-pointer"
              >
                Full progress report
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Top 3 competencies */}
            <div className="flex flex-col gap-4 mb-6">
              {topMovers.map((c) => (
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium text-text-primary">{c.shortName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-success">+{c.delta}%</span>
                      <span className="text-[12px] font-semibold text-text-primary">{c.progress}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${c.progress}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Teaser */}
            <div className="bg-background rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-text-primary">
                  +5 more competencies · trimester timeline · evidence history
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  See how Lucas is building real skills over time
                </p>
              </div>
              <button
                onClick={() => onNavigate("progress")}
                className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer flex-shrink-0 ml-4"
              >
                View all
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* ── CALENDAR SNEAK PEEK ── */}
        {activeTab === "calendar" && (
          <div className="bg-card rounded-2xl p-6 border border-card-border">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[11px] text-text-muted mb-0.5 uppercase tracking-wide">Week 3</p>
                <h2 className="text-[18px] font-semibold text-text-primary">Coming up next</h2>
              </div>
              <button
                onClick={() => onNavigate("calendar")}
                className="flex items-center gap-1.5 text-[12px] font-medium text-accent-text hover:underline cursor-pointer"
              >
                Full week view
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Next 3 deliverables */}
            <div className="flex flex-col gap-2 mb-6">
              {upcomingDeliverables.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    item.urgent ? "border-warning/20 bg-warning-light" : "border-border bg-background"
                  }`}
                >
                  <FileText
                    size={14}
                    className={`flex-shrink-0 ${item.urgent ? "text-warning" : "text-text-muted"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-medium ${item.urgent ? "text-text-primary" : "text-text-secondary"}`}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-text-muted">{item.subject}</p>
                  </div>
                  <span className={`text-[11px] font-medium flex-shrink-0 ${item.urgent ? "text-warning" : "text-text-muted"}`}>
                    {item.due}
                  </span>
                </div>
              ))}
            </div>

            {/* Teaser */}
            <div className="bg-background rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-text-primary">
                  Full week · Thu–Fri deliverables · Demo Day schedule
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Plan the week and never miss a deadline
                </p>
              </div>
              <button
                onClick={() => onNavigate("calendar")}
                className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer flex-shrink-0 ml-4"
              >
                View all
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Chat — always visible */}
      <div className="w-[300px] flex-shrink-0">
        <TeacherChat role="parent" />
      </div>
    </div>
  );
}
