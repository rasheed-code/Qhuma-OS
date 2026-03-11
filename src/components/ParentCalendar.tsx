"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Lock, Loader, Bell, BellOff, CalendarPlus } from "lucide-react";
import { useLang } from "@/lib/i18n";

type DeliverableStatus = "done" | "in_progress" | "upcoming" | "locked";

interface Deliverable {
  time: string;
  titleEs: string;
  titleEn: string;
  subjectEs: string;
  subjectEn: string;
  status: DeliverableStatus;
  subjectColor: string;
}

interface DayBlock {
  dayEs: string;
  dayEn: string;
  date: string;
  isToday: boolean;
  isPast: boolean;
  deliverables: Deliverable[];
}

const week: DayBlock[] = [
  {
    dayEs: "Lunes", dayEn: "Monday",
    date: "24 Feb", isToday: false, isPast: true,
    deliverables: [
      { time: "9:00", titleEs: "Doc. de investigación de competidores", titleEn: "Competitor Research Doc", subjectEs: "Ciencias Sociales", subjectEn: "Social Sciences", status: "done", subjectColor: "#4F8EF7" },
      { time: "11:00", titleEs: "Hoja de estrategia de precios", titleEn: "Pricing Strategy Spreadsheet", subjectEs: "Matemáticas", subjectEn: "Mathematics", status: "done", subjectColor: "#34D399" },
      { time: "15:00", titleEs: "Revisión Fase 1 con Prof. Ana", titleEn: "Phase 1 Review with Prof. Ana", subjectEs: "Tutoría", subjectEn: "Mentoring", status: "done", subjectColor: "#FB923C" },
    ],
  },
  {
    dayEs: "Martes", dayEn: "Tuesday",
    date: "25 Feb", isToday: false, isPast: true,
    deliverables: [
      { time: "9:00", titleEs: "Página de aterrizaje (Canva)", titleEn: "Landing Page (Canva)", subjectEs: "Digital + Arte", subjectEn: "Digital + Art", status: "done", subjectColor: "#60A5FA" },
      { time: "13:00", titleEs: "Tarjeta de identidad de marca", titleEn: "Brand Identity Card", subjectEs: "Arte + Lengua", subjectEn: "Art + Language", status: "done", subjectColor: "#E879F9" },
      { time: "15:30", titleEs: "Sesión de revisión entre compañeros", titleEn: "Tribe peer review session", subjectEs: "Trabajo en equipo", subjectEn: "Teamwork", status: "done", subjectColor: "#FBBF24" },
    ],
  },
  {
    dayEs: "Miércoles", dayEn: "Wednesday",
    date: "26 Feb", isToday: true, isPast: false,
    deliverables: [
      { time: "9:00", titleEs: "Protocolo de higiene PDF", titleEn: "Hygiene Protocol PDF", subjectEs: "Biología + Lengua", subjectEn: "Biology + Language", status: "in_progress", subjectColor: "#34D399" },
      { time: "13:00", titleEs: "Hoja de cálculo de rentabilidad", titleEn: "Profitability Spreadsheet", subjectEs: "Mat + Finanzas", subjectEn: "Math + Finance", status: "upcoming", subjectColor: "#34D399" },
      { time: "15:00", titleEs: "Ficha de cálculo de IVA", titleEn: "Tax Calculation Worksheet", subjectEs: "Mat + Edu. Cívica", subjectEn: "Math + Civic Ed.", status: "upcoming", subjectColor: "#34D399" },
    ],
  },
  {
    dayEs: "Jueves", dayEn: "Thursday",
    date: "27 Feb", isToday: false, isPast: false,
    deliverables: [
      { time: "9:00", titleEs: "Guía del buen anfitrión (10 FAQs)", titleEn: "Good Host Guide (10 FAQs)", subjectEs: "Lengua", subjectEn: "Language Arts", status: "locked", subjectColor: "#4F8EF7" },
      { time: "13:00", titleEs: "Pitch del Demo Day (5 diapositivas)", titleEn: "Demo Day Pitch (5 slides)", subjectEs: "Social + Tutoría", subjectEn: "Social + Tutoring", status: "locked", subjectColor: "#FB923C" },
      { time: "15:30", titleEs: "Ensayo del pitch con el grupo", titleEn: "Pitch rehearsal with tribe", subjectEs: "Trabajo en equipo", subjectEn: "Teamwork", status: "locked", subjectColor: "#FBBF24" },
    ],
  },
  {
    dayEs: "Viernes — Demo Day 🎉", dayEn: "Friday — Demo Day 🎉",
    date: "28 Feb", isToday: false, isPast: false,
    deliverables: [
      { time: "9:00", titleEs: "Preparación final del pitch", titleEn: "Final pitch prep", subjectEs: "Todas las competencias", subjectEn: "All competencies", status: "locked", subjectColor: "#FB923C" },
      { time: "11:00", titleEs: "Presentación final en vivo", titleEn: "Live Pitch Presentation", subjectEs: "Todas las competencias", subjectEn: "All competencies", status: "locked", subjectColor: "#FB923C" },
      { time: "14:00", titleEs: "Subida al portafolio digital", titleEn: "Digital Portfolio Upload", subjectEs: "Competencia digital", subjectEn: "Digital Skills", status: "locked", subjectColor: "#60A5FA" },
      { time: "16:00", titleEs: "Cierre del Trimestre 1", titleEn: "Trimester 1 closes", subjectEs: "Admin", subjectEn: "Admin", status: "locked", subjectColor: "#9CA3AF" },
    ],
  },
];

export default function ParentCalendar() {
  const { lang } = useLang();
  const [reminders, setReminders] = useState<Set<string>>(new Set());
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const toggleReminder = (key: string) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); return next; }
      next.add(key);
      setJustAdded(key);
      setTimeout(() => setJustAdded(null), 2000);
      return next;
    });
  };

  const statusIcon = { done: CheckCircle2, in_progress: Loader, upcoming: Clock, locked: Lock };
  const statusColor: Record<DeliverableStatus, string> = { done: "text-success", in_progress: "text-accent-text", upcoming: "text-warning", locked: "text-text-muted" };
  const statusLabel: Record<DeliverableStatus, { es: string; en: string }> = {
    done: { es: "Hecho", en: "Done" },
    in_progress: { es: "En progreso", en: "In progress" },
    upcoming: { es: "Hoy", en: "Today" },
    locked: { es: "Próximo", en: "Upcoming" },
  };

  const subjectColors = [
    { es: "Matemáticas", en: "Mathematics", color: "#34D399" },
    { es: "Digital + Arte", en: "Digital + Art", color: "#60A5FA" },
    { es: "Lengua", en: "Language Arts", color: "#4F8EF7" },
    { es: "Ciencias Sociales", en: "Social Sciences", color: "#4F8EF7" },
    { es: "Biología", en: "Biology", color: "#34D399" },
    { es: "Edu. Cívica", en: "Civic Ed.", color: "#F87171" },
  ];

  const totalDeliverables = week.flatMap(d => d.deliverables).length;
  const completed = week.flatMap(d => d.deliverables).filter(d => d.status === "done").length;
  const inProgress = week.flatMap(d => d.deliverables).filter(d => d.status === "in_progress").length;
  const todayPending = week.find(d => d.isToday)?.deliverables.filter(d => d.status === "upcoming").length ?? 0;
  const locked = week.flatMap(d => d.deliverables).filter(d => d.status === "locked").length;

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0">
        {/* Week header */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-text-primary">
                {lang === "es" ? "Semana 3 de 12" : "Week 3 of 12"}
              </h2>
              <p className="text-[12px] text-text-secondary mt-0.5">
                {lang === "es" ? "24–28 Feb · Proyecto: " : "Feb 24–28 · Project: "}
                <span className="font-semibold text-accent-text">
                  {lang === "es" ? "Gestiona tu Airbnb" : "Launch Your Airbnb"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-text-muted">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-success" />{lang === "es" ? "Hecho" : "Done"}</span>
              <span className="flex items-center gap-1.5"><Loader size={12} className="text-accent-text" />{lang === "es" ? "En progreso" : "In progress"}</span>
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-warning" />{lang === "es" ? "Hoy" : "Today"}</span>
              <span className="flex items-center gap-1.5"><Lock size={12} className="text-text-muted" />{lang === "es" ? "Próximo" : "Upcoming"}</span>
            </div>
          </div>
        </div>

        {/* Reminder tip */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-4 flex items-center gap-2">
          <Bell size={14} className="text-blue-500 shrink-0" />
          <p className="text-[12px] text-blue-700">
            {lang === "es"
              ? "Pulsa 🔔 junto a cualquier entrega para activar un recordatorio. Te avisaremos 1 hora antes."
              : "Tap 🔔 next to any deliverable to set a reminder. We'll notify you 1 hour before."}
          </p>
        </div>

        {/* Day blocks */}
        <div className="flex flex-col gap-3">
          {week.map((day) => (
            <div key={day.dayEn} className={`bg-card rounded-2xl border overflow-hidden ${day.isToday ? "border-accent-text/30" : "border-card-border"}`}>
              {/* Day header */}
              <div className={`flex items-center justify-between px-5 py-3 border-b ${day.isToday ? "bg-accent-light border-accent-text/20" : day.isPast ? "bg-background border-border" : "bg-card border-border"}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-[13px] font-bold ${day.isToday ? "text-accent-text" : day.isPast ? "text-text-muted" : "text-text-primary"}`}>
                    {lang === "es" ? day.dayEs : day.dayEn}
                  </span>
                  {day.isToday && (
                    <span className="bg-accent-text text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {lang === "es" ? "HOY" : "TODAY"}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] ${day.isToday ? "text-accent-text font-semibold" : "text-text-muted"}`}>{day.date}</span>
              </div>

              {/* Deliverables */}
              <div className="px-5 py-2">
                {day.deliverables.map((item, i) => {
                  const Icon = statusIcon[item.status];
                  const reminderKey = `${day.dayEn}-${i}`;
                  const hasReminder = reminders.has(reminderKey);
                  const canRemind = item.status === "upcoming" || item.status === "locked";
                  return (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0 group">
                      <span className="text-[11px] text-text-muted w-10 flex-shrink-0 font-mono">{item.time}</span>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.subjectColor }} />
                      <div className="flex-1 min-w-0">
                        <span className={`text-[12px] font-medium block ${item.status === "locked" ? "text-text-muted" : "text-text-primary"}`}>
                          {lang === "es" ? item.titleEs : item.titleEn}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {lang === "es" ? item.subjectEs : item.subjectEn}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 ${statusColor[item.status]} flex-shrink-0`}>
                        <Icon size={11} />
                        <span className="text-[10px] font-medium">{statusLabel[item.status][lang]}</span>
                      </div>
                      {/* Reminder button */}
                      {canRemind && (
                        <button
                          onClick={() => toggleReminder(reminderKey)}
                          className={`flex-shrink-0 p-1.5 rounded-lg transition-all cursor-pointer ${hasReminder ? "bg-blue-100 text-blue-600" : "opacity-0 group-hover:opacity-100 text-text-muted hover:text-blue-500 hover:bg-blue-50"}`}
                          title={hasReminder ? (lang === "es" ? "Quitar recordatorio" : "Remove reminder") : (lang === "es" ? "Añadir recordatorio" : "Add reminder")}
                        >
                          {hasReminder ? <Bell size={12} /> : <CalendarPlus size={12} />}
                        </button>
                      )}
                      {justAdded === reminderKey && (
                        <span className="text-[10px] text-blue-600 font-semibold animate-pulse">
                          {lang === "es" ? "✓ Recordatorio añadido" : "✓ Reminder set"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: summary */}
      <div className="w-[240px] flex-shrink-0 flex flex-col gap-4">

        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-bold text-text-primary mb-4">
            {lang === "es" ? "Semana de un vistazo" : "Week at a glance"}
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { labelEs: "Total entregas", labelEn: "Total deliverables", value: totalDeliverables, color: "text-text-primary" },
              { labelEs: "Completadas", labelEn: "Completed", value: completed, color: "text-success" },
              { labelEs: "En progreso", labelEn: "In progress", value: inProgress, color: "text-accent-text" },
              { labelEs: "Pendientes hoy", labelEn: "Remaining today", value: todayPending, color: "text-warning" },
              { labelEs: "Bloqueadas", labelEn: "Locked (Thu–Fri)", value: locked, color: "text-text-muted" },
            ].map((item) => (
              <div key={item.labelEn} className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">{lang === "es" ? item.labelEs : item.labelEn}</span>
                <span className={`text-[14px] font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-bold text-text-primary mb-3">
            {lang === "es" ? "Asignaturas esta semana" : "Subjects this week"}
          </h3>
          <div className="flex flex-col gap-2">
            {subjectColors.map((item) => (
              <div key={item.en} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-text-secondary flex-1">{lang === "es" ? item.es : item.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders summary */}
        {reminders.size > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={14} className="text-blue-500" />
              <p className="text-[12px] font-bold text-blue-700">
                {reminders.size} {lang === "es" ? "recordatorio(s) activo(s)" : "reminder(s) active"}
              </p>
            </div>
            <p className="text-[11px] text-blue-600">
              {lang === "es" ? "Recibirás una notificación 1 hora antes de cada entrega marcada." : "You'll receive a notification 1 hour before each marked deliverable."}
            </p>
          </div>
        )}

        <div className="bg-accent-light rounded-2xl p-4 border border-accent-text/10">
          <p className="text-[13px] font-bold text-accent-text mb-1">
            {lang === "es" ? "Demo Day — 28 Feb 🎉" : "Demo Day — Feb 28 🎉"}
          </p>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {lang === "es"
              ? "Lucas presenta su proyecto Airbnb a la clase. Familias bienvenidas desde las 11:00."
              : "Lucas presents his Airbnb project to the class. Families welcome from 11:00."}
          </p>
        </div>
      </div>
    </div>
  );
}
