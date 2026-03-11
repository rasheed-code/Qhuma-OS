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
  Flame,
  Zap,
  Trophy,
  MessageCircle,
  Star,
  Brain,
  Coffee,
} from "lucide-react";
import { currentStudent } from "@/data/students";
import { weekSchedule } from "@/data/tasks";
import { competencies } from "@/data/competencies";
import { ParentView } from "@/types";
import { useLang } from "@/lib/i18n";

type CardTab = "overview" | "progress" | "calendar";

interface ParentDashboardProps {
  onNavigate: (view: ParentView) => void;
}

const notifications = [
  {
    type: "success" as const,
    messageEs: "Lucas completó su página de aterrizaje — la Prof. Ana la destacó como una de las mejores de la clase.",
    messageEn: "Lucas completed his landing page — Prof. Ana highlighted it as one of the best in class.",
    time: "Hoy, 10:30",
  },
  {
    type: "success" as const,
    messageEs: "Lucas ganó 50 Q-Coins por completar la tarea de identidad de marca antes de tiempo.",
    messageEn: "Lucas earned 50 Q-Coins for completing the brand identity task ahead of schedule.",
    time: "Ayer, 15:15",
  },
  {
    type: "warning" as const,
    messageEs: "Los cálculos de rentabilidad de esta tarde implican porcentajes e IVA — puede beneficiarse de un repaso rápido en casa.",
    messageEn: "Profitability calculations this afternoon involve percentages and tax — he may benefit from a quick review at home.",
    time: "Hoy, 8:00",
  },
];

const notificationConfig = {
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success-light", border: "border-success/20" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning-light", border: "border-warning/20" },
  urgent: { icon: AlertCircle, color: "text-urgent", bg: "bg-urgent-light", border: "border-urgent/20" },
};

const topMovers = competencies
  .map((c) => ({ ...c, delta: c.progress - c.previousProgress }))
  .sort((a, b) => b.delta - a.delta)
  .slice(0, 3);

const upcomingDeliverables = [
  { titleEs: "Hoja de cálculo de rentabilidad", titleEn: "Profitability Spreadsheet", due: "Hoy, 13:00", subject: "Mat + Finanzas", urgent: true },
  { titleEs: "Ficha de cálculo de IVA", titleEn: "Tax Calculation Worksheet", due: "Hoy, 15:00", subject: "Mat + Educación Cívica", urgent: true },
  { titleEs: "Guía del buen anfitrión (10 FAQs)", titleEn: "Good Host Guide (10 FAQs)", due: "Jueves", subject: "Lengua", urgent: false },
];

// Emotional/motivational data for Lucas
const emotionalData = {
  mood: 4, // 1-5
  energy: 5, // 1-5
  motivation: 4, // 1-5
  classPosition: 4, // position out of 12
  moodEmoji: "😊",
  energyLevel: "Alta",
  streakStatus: "🔥 Racha de 12 días",
  todayNote: { es: "Lucas llegó puntual y empezó la primera tarea sin que se lo recordaran.", en: "Lucas arrived on time and started the first task without being reminded." },
};

function MoodDot({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-all ${i < value ? "" : "opacity-20"}`}
          style={{ backgroundColor: i < value ? color : "#9ca3af" }}
        />
      ))}
    </div>
  );
}

export default function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const { lang, tr } = useLang();
  const [activeTab, setActiveTab] = useState<CardTab>("overview");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [aiReport, setAiReport] = useState<{
    summary?: string; strengths?: string[]; improvements?: string[]; encouragement?: string;
  } | null>(null);
  const [generatingTip, setGeneratingTip] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

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
      if (!data.error) { setAiReport(data); setReportGenerated(true); }
    } catch { /* silent */ } finally { setGeneratingReport(false); }
  };

  const generateAiTip = async () => {
    setGeneratingTip(true);
    setAiTip(null);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: lang === "es"
            ? "Genera un consejo muy corto y concreto (máximo 3 frases) para que los padres de Lucas puedan apoyarle esta tarde en casa con los cálculos de rentabilidad e IVA de un Airbnb real. Habla directamente a los padres, con tono cálido y práctico. No uses términos técnicos educativos."
            : "Generate a very short and concrete tip (max 3 sentences) for Lucas's parents to support him at home tonight with profitability and VAT calculations for a real Airbnb. Speak directly to the parents, in a warm and practical tone. No educational jargon.",
          history: [],
        }),
      });
      const data = await res.json();
      if (data.response) setAiTip(data.response);
    } catch { /* silent */ } finally { setGeneratingTip(false); }
  };

  const completedTasks = weekSchedule.flatMap((d) => d.tasks).filter((t) => t.status === "completed").length;
  const totalTasks = weekSchedule.flatMap((d) => d.tasks).length;

  const tabs = [
    { id: "overview" as CardTab, labelEs: "Resumen", labelEn: "Overview", icon: Bell },
    { id: "progress" as CardTab, labelEs: "Progreso", labelEn: "Progress", icon: BarChart3 },
    { id: "calendar" as CardTab, labelEs: "Calendario", labelEn: "Calendar", icon: Calendar },
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
                  activeTab === tab.id ? "bg-card text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <Icon size={13} />
                {lang === "es" ? tab.labelEs : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Hero card */}
            <div className="bg-card rounded-2xl p-6 border border-card-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[11px] text-text-muted mb-1 uppercase tracking-wide">
                    {lang === "es" ? "Miércoles · Semana 3 de 12" : "Wednesday · Week 3 of 12"}
                  </p>
                  <h1 className="text-[24px] font-bold text-text-primary leading-tight">
                    {lang === "es" ? "Lucas tiene una semana fuerte. 💪" : "Lucas is having a strong week. 💪"}
                  </h1>
                  <p className="text-[13px] text-text-secondary mt-1">
                    {lang === "es" ? "Proyecto: " : "Project: "}
                    <span className="font-semibold text-accent-text">
                      {lang === "es" ? "Gestiona tu Airbnb en Málaga" : "Launch Your Airbnb"}
                    </span>
                    {" · "}
                    {lang === "es" ? "Trimestre 1 de 4" : "Trimester 1 of 4"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-success-light px-3 py-1.5 rounded-full flex-shrink-0">
                  <TrendingUp size={12} className="text-success" />
                  <span className="text-[11px] font-semibold text-success">
                    {lang === "es" ? "En ruta" : "On Track"}
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: completedTasks, labelEs: "Tareas hechas", labelEn: "Tasks Done", color: "text-text-primary", bg: "bg-background" },
                  { value: totalTasks - completedTasks, labelEs: "Pendientes", labelEn: "Remaining", color: "text-text-primary", bg: "bg-background" },
                  { value: currentStudent.evidencesSubmitted, labelEs: "Evidencias", labelEn: "Evidences", color: "text-accent-text", bg: "bg-accent-light" },
                  { value: currentStudent.streak, labelEs: "Días de racha", labelEn: "Day Streak", color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat, i) => (
                  <div key={i} className={`text-center p-3 ${stat.bg} rounded-xl`}>
                    <span className={`text-[22px] font-black ${stat.color} block`}>{stat.value}</span>
                    <span className="text-[10px] text-text-muted">{lang === "es" ? stat.labelEs : stat.labelEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Emotional panel (NEW) ── */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={16} className="text-sidebar" />
                <h3 className="text-[14px] font-bold text-text-primary">
                  {lang === "es" ? "Estado de Lucas hoy" : "Lucas's state today"}
                </h3>
                <span className="text-[10px] bg-background border border-card-border text-text-muted px-2 py-0.5 rounded-full ml-auto">
                  {lang === "es" ? "Actualizado esta mañana" : "Updated this morning"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { labelEs: "Estado de ánimo", labelEn: "Mood", value: emotionalData.mood, icon: Heart, color: "#ef4444", emoji: "😊" },
                  { labelEs: "Energía", labelEn: "Energy", value: emotionalData.energy, icon: Zap, color: "#f59e0b", emoji: "⚡" },
                  { labelEs: "Motivación", labelEn: "Motivation", value: emotionalData.motivation, icon: Star, color: "#8b5cf6", emoji: "🌟" },
                ].map((item) => (
                  <div key={item.labelEs} className="bg-background rounded-xl p-3 text-center">
                    <span className="text-xl block mb-1">{item.emoji}</span>
                    <p className="text-[11px] text-text-muted mb-2">{lang === "es" ? item.labelEs : item.labelEn}</p>
                    <MoodDot value={item.value} color={item.color} />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {/* Streak */}
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 flex-1">
                  <Flame size={16} className="text-orange-500" />
                  <div>
                    <p className="text-[12px] font-bold text-orange-700">{lang === "es" ? "Racha de 12 días" : "12-day streak"}</p>
                    <p className="text-[10px] text-orange-500">{lang === "es" ? "Sin fallar ni un día" : "Not missing a single day"}</p>
                  </div>
                </div>
                {/* Class position */}
                <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2 flex-1">
                  <Trophy size={16} className="text-purple-500" />
                  <div>
                    <p className="text-[12px] font-bold text-purple-700">
                      {lang === "es" ? `Posición ${emotionalData.classPosition}º de 12` : `Position ${emotionalData.classPosition} of 12`}
                    </p>
                    <p className="text-[10px] text-purple-500">{lang === "es" ? "En la clase" : "In class"}</p>
                  </div>
                </div>
              </div>

              {/* Today note from teacher */}
              <div className="mt-3 bg-accent-light border border-accent-text/10 rounded-xl p-3 flex items-start gap-2">
                <Coffee size={14} className="text-accent-text shrink-0 mt-0.5" />
                <p className="text-[12px] text-text-primary leading-relaxed">
                  <span className="font-semibold">{lang === "es" ? "Prof. Ana: " : "Prof. Ana: "}</span>
                  {lang === "es" ? emotionalData.todayNote.es : emotionalData.todayNote.en}
                </p>
              </div>
            </div>

            {/* ── AI Smart summary ── */}
            <div className="bg-accent-light rounded-2xl p-5 border border-accent-text/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sidebar flex items-center justify-center">
                    <Sparkles size={11} className="text-accent" />
                  </div>
                  <span className="text-[12px] font-bold text-accent-text">
                    {lang === "es" ? "Resumen inteligente de la semana" : "Smart weekly summary"}
                  </span>
                </div>
                <button
                  onClick={generateFamilyReport}
                  disabled={generatingReport}
                  className="flex items-center gap-1.5 text-[10px] font-semibold text-accent-text bg-white/60 hover:bg-white transition-colors px-2.5 py-1 rounded-lg cursor-pointer disabled:opacity-60 border border-accent/30"
                >
                  {generatingReport ? <Loader2 size={10} className="animate-spin" /> : <Download size={10} />}
                  {generatingReport ? (lang === "es" ? "Generando..." : "Generating...") : (lang === "es" ? "Informe IA" : "AI Report")}
                </button>
              </div>

              {aiReport && reportGenerated ? (
                <div>
                  <p className="text-[13px] text-text-primary leading-relaxed mb-3">{aiReport.summary}</p>
                  {aiReport.strengths && aiReport.strengths.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-success uppercase tracking-wide block mb-1">
                        {lang === "es" ? "Puntos fuertes" : "Strengths"}
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
                  {lang === "es"
                    ? <>Lucas ha tenido un <strong>inicio muy sólido</strong> en la Fase 2. Su página de aterrizaje fue destacada por la Prof. Ana como una de las mejores de clase. Esta tarde trabaja en <strong>cálculos financieros</strong>: precios, márgenes e IVA en un Airbnb real. Su <strong>competencia Emprendedora subió +8%</strong> esta semana. El Demo Day es el viernes — necesita preparar un pitch de 5 diapositivas.</>
                    : <>Lucas had a <strong>very strong start</strong> to Phase 2. His landing page was highlighted by Prof. Ana as one of the best in class. This afternoon he works on <strong>financial calculations</strong>: pricing, margins and VAT on a real Airbnb. His <strong>Entrepreneurial competency rose +8%</strong> this week. Demo Day is Friday — he needs to prepare a 5-slide pitch.</>
                  }
                </p>
              )}
            </div>

            {/* ── Support tip ── */}
            <div className="bg-card rounded-2xl p-5 border border-card-border">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb size={17} className="text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-bold text-text-primary">
                      {lang === "es" ? "Cómo apoyar a Lucas esta noche" : "How to support Lucas tonight"}
                    </p>
                    <button
                      onClick={generateAiTip}
                      disabled={generatingTip}
                      className="flex items-center gap-1.5 text-[10px] font-semibold text-sidebar bg-sidebar/10 hover:bg-sidebar/20 px-2.5 py-1 rounded-lg cursor-pointer disabled:opacity-60 transition-colors"
                    >
                      {generatingTip ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      {lang === "es" ? "Actualizar consejo" : "Refresh tip"}
                    </button>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    {aiTip ?? (lang === "es"
                      ? <>Esta tarde trabaja en <strong>rentabilidad e IVA</strong> aplicados a su Airbnb real. En la cena, prueba a preguntarle: <em>&ldquo;Si una noche cuesta 80€ y el IVA es del 10%, ¿cuánto paga realmente el huésped?&rdquo;</em> Ese tipo de conversación real refuerza lo que practicó mejor que cualquier ejercicio.</>
                      : <>He&apos;s working on <strong>profitability and IVA</strong> applied to his real Airbnb. At dinner, try asking: <em>&ldquo;If a night costs €80 and the IVA is 10%, what does a guest actually pay?&rdquo;</em> That kind of real conversation reinforces what he practiced better than any worksheet.</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Notifications ── */}
            <div className="bg-card rounded-2xl p-5 border border-card-border">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={15} className="text-text-primary" />
                <h3 className="text-[14px] font-semibold text-text-primary">
                  {lang === "es" ? "Notificaciones" : "Notifications"}
                </h3>
                <span className="ml-auto text-[10px] text-text-muted">
                  {lang === "es" ? "Hoy" : "Today"}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {notifications.map((notif, i) => {
                  const config = notificationConfig[notif.type];
                  const Icon = config.icon;
                  return (
                    <div key={i} className={`flex gap-3 p-3 rounded-xl border ${config.border} ${config.bg}`}>
                      <Icon size={16} className={`${config.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className="text-[12px] text-text-primary leading-relaxed">
                          {lang === "es" ? notif.messageEs : notif.messageEn}
                        </p>
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
                <p className="text-[11px] text-text-muted mb-0.5 uppercase tracking-wide">
                  {lang === "es" ? "Esta semana" : "This week"}
                </p>
                <h2 className="text-[18px] font-bold text-text-primary">
                  {lang === "es" ? "Más crecimiento esta semana" : "Top movers this week"}
                </h2>
              </div>
              <button onClick={() => onNavigate("progress")} className="flex items-center gap-1.5 text-[12px] font-medium text-accent-text hover:underline cursor-pointer">
                {lang === "es" ? "Ver informe completo" : "Full progress report"}
                <ArrowRight size={13} />
              </button>
            </div>

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
                    <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-background rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-text-primary">
                  {lang === "es" ? "+5 competencias más · timeline trimestral · historial de evidencias" : "+5 more competencies · trimester timeline · evidence history"}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {lang === "es" ? "Ve cómo Lucas construye habilidades reales a lo largo del tiempo" : "See how Lucas is building real skills over time"}
                </p>
              </div>
              <button onClick={() => onNavigate("progress")} className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer flex-shrink-0 ml-4">
                {lang === "es" ? "Ver todo" : "View all"}
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
                <p className="text-[11px] text-text-muted mb-0.5 uppercase tracking-wide">
                  {lang === "es" ? "Semana 3" : "Week 3"}
                </p>
                <h2 className="text-[18px] font-bold text-text-primary">
                  {lang === "es" ? "Próximas entregas" : "Coming up next"}
                </h2>
              </div>
              <button onClick={() => onNavigate("calendar")} className="flex items-center gap-1.5 text-[12px] font-medium text-accent-text hover:underline cursor-pointer">
                {lang === "es" ? "Ver semana completa" : "Full week view"}
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {upcomingDeliverables.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${item.urgent ? "border-warning/20 bg-warning-light" : "border-border bg-background"}`}>
                  <FileText size={14} className={`flex-shrink-0 ${item.urgent ? "text-warning" : "text-text-muted"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-medium ${item.urgent ? "text-text-primary" : "text-text-secondary"}`}>
                      {lang === "es" ? item.titleEs : item.titleEn}
                    </p>
                    <p className="text-[10px] text-text-muted">{item.subject}</p>
                  </div>
                  <span className={`text-[11px] font-medium flex-shrink-0 ${item.urgent ? "text-warning" : "text-text-muted"}`}>{item.due}</span>
                </div>
              ))}
            </div>

            <div className="bg-background rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-text-primary">
                  {lang === "es" ? "Semana completa · Entregas Jue–Vie · Agenda Demo Day" : "Full week · Thu–Fri deliverables · Demo Day schedule"}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {lang === "es" ? "Planifica la semana y no pierdas ninguna entrega" : "Plan the week and never miss a deadline"}
                </p>
              </div>
              <button onClick={() => onNavigate("calendar")} className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer flex-shrink-0 ml-4">
                {lang === "es" ? "Ver todo" : "View all"}
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Messages preview */}
      <div className="w-[300px] flex-shrink-0">
        {/* Quick messages preview */}
        <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
          <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={15} className="text-sidebar" />
              <span className="text-[13px] font-bold text-text-primary">
                {lang === "es" ? "Mensajes" : "Messages"}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-urgent text-white px-1.5 py-0.5 rounded-full">6</span>
          </div>
          {[
            { name: "Prof. Ana Martínez", msg: lang === "es" ? "¡Demo Day el viernes! Lucas lo hará genial" : "Demo Day on Friday! Lucas will be great", time: "10:15", unread: 1, avatar: "AM", color: "#2f574d" },
            { name: "Centro IES Málaga", msg: lang === "es" ? "Reunión de padres jueves 18:00" : "Parent meeting Thursday 18:00", time: "8:05", unread: 2, avatar: "🏫", color: "#6B7280" },
            { name: lang === "es" ? "Padres 1º ESO A" : "Parents 1st ESO A", msg: lang === "es" ? "¿El Demo Day es abierto al público?" : "Is Demo Day open to the public?", time: "9:30", unread: 3, avatar: "👨‍👩‍👧", color: "#FB923C" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate("teachers")}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-background transition-colors cursor-pointer border-b border-card-border last:border-0 text-left"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: item.color }}>
                {item.avatar.length <= 2 ? item.avatar : <span className="text-base">{item.avatar}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[12px] font-semibold text-text-primary truncate">{item.name}</span>
                  <span className="text-[10px] text-text-muted flex-shrink-0 ml-1">{item.time}</span>
                </div>
                <p className="text-[11px] text-text-muted truncate">{item.msg}</p>
              </div>
              {item.unread > 0 && (
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center mt-1">{item.unread}</span>
              )}
            </button>
          ))}
          <button
            onClick={() => onNavigate("teachers")}
            className="w-full py-2.5 text-[12px] font-semibold text-sidebar hover:bg-sidebar/5 transition-colors cursor-pointer"
          >
            {lang === "es" ? "Ver todos los mensajes →" : "View all messages →"}
          </button>
        </div>
      </div>
    </div>
  );
}
