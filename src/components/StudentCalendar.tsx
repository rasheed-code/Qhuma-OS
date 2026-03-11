"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Lock,
  Loader2,
  Clock,
  CalendarDays,
  LayoutGrid,
  Flag,
  Mic,
  FileText,
  Trophy,
} from "lucide-react";
import { weekSchedule } from "@/data/tasks";
import { competencies } from "@/data/competencies";
import { currentStudent } from "@/data/students";

// ── Eventos personales del alumno ──────────────────────────────────────────
type EventType = "entrega" | "pitch" | "demoday" | "hito";

interface PersonalEvent {
  day: number; // día del mes
  tipo: EventType;
  titulo: string;
  hora?: string;
}

const eventosPersonales: PersonalEvent[] = [
  { day: 9,  tipo: "entrega",  titulo: "Entrega · Análisis de mercado",    hora: "10:00" },
  { day: 11, tipo: "pitch",    titulo: "Pitch Lab · Pitch de inversión",   hora: "11:30" },
  { day: 13, tipo: "demoday",  titulo: "Demo Day",                          hora: "09:00" },
  { day: 17, tipo: "entrega",  titulo: "Entrega · Prototipo final",         hora: "23:59" },
];

const tipoConfig: Record<EventType, { bg: string; text: string; icon: typeof Flag }> = {
  entrega: { bg: "bg-warning-light", text: "text-warning",    icon: FileText },
  pitch:   { bg: "bg-accent-light",  text: "text-accent-text", icon: Mic },
  demoday: { bg: "bg-urgent-light",  text: "text-urgent",     icon: Trophy },
  hito:    { bg: "bg-success-light", text: "text-success",    icon: Flag },
};

// ── Constantes de marzo 2026 ───────────────────────────────────────────────
const TODAY_DAY = 11; // 11 de marzo 2026 (miércoles)
const MONTH_NAME = "Marzo 2026";
const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];
// 1 de marzo 2026 = domingo → offset 6 en rejilla lunes-primero
const MARCH_START_OFFSET = 6;
const MARCH_DAYS = 31;

function buildMonthGrid() {
  const cells: (number | null)[] = Array(MARCH_START_OFFSET).fill(null);
  for (let d = 1; d <= MARCH_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// Mapeo de label inglés → español para tareas del weekSchedule
const dayLabel: Record<string, string> = {
  Monday: "Lunes", Tuesday: "Martes", Wednesday: "Miércoles",
  Thursday: "Jueves", Friday: "Viernes", Saturday: "Sábado", Sunday: "Domingo",
};

export default function StudentCalendar() {
  const [vista, setVista] = useState<"mes" | "semana">("semana");

  // ── Estadísticas generales ──────────────────────────────────────────────
  const totalTasks = weekSchedule.reduce((s, d) => s + d.tasks.length, 0);
  const completedTasks = weekSchedule.reduce(
    (s, d) => s + d.tasks.filter((t) => t.status === "completed").length, 0
  );

  // Eventos de hoy
  const eventosHoy = eventosPersonales.filter((e) => e.day === TODAY_DAY);
  const badgeHoy = eventosHoy.length;

  const monthGrid = buildMonthGrid();

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[32px] font-semibold text-text-primary leading-tight">
                Calendario
              </h1>
              {badgeHoy > 0 && (
                <span className="mt-1 px-3 py-1 rounded-full bg-accent text-sidebar text-[11px] font-bold flex-shrink-0">
                  Hoy tienes {badgeHoy} evento{badgeHoy > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-[14px] text-text-secondary mt-1">
              Lanza tu Airbnb · Semana 3
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-[12px] text-text-muted">
                <span className="font-semibold text-text-primary">{completedTasks}</span>/{totalTasks} tareas completadas
              </span>
              <span className="text-[12px] text-text-muted">
                <span className="font-semibold text-text-primary">{currentStudent.evidencesSubmitted}</span>/{currentStudent.evidencesTotal} evidencias
              </span>
            </div>
          </div>

          {/* Toggle mes/semana */}
          <div className="flex items-center gap-1 bg-background rounded-xl p-1 flex-shrink-0 mt-1">
            <button
              onClick={() => setVista("semana")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                vista === "semana"
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <CalendarDays size={13} />
              Semana
            </button>
            <button
              onClick={() => setVista("mes")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                vista === "mes"
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <LayoutGrid size={13} />
              Mes
            </button>
          </div>
        </div>
      </div>

      {/* ── Vista Semana ────────────────────────────────────────────────── */}
      {vista === "semana" && (
        <>
          <div className="overflow-x-auto mb-6 -mx-8 px-8">
            <div className="flex gap-4" style={{ minWidth: "1100px" }}>
              {weekSchedule.map((day) => {
                const isCurrent = day.status === "current";
                const isCompleted = day.status === "completed";
                const isUpcoming = day.status === "upcoming";
                const dayCompleted = day.tasks.filter((t) => t.status === "completed").length;

                // Inferir número de día: schedule semana del 9 al 15 de marzo
                const dayOffset: Record<string, number> = {
                  Monday: 9, Tuesday: 10, Wednesday: 11, Thursday: 12,
                  Friday: 13, Saturday: 14, Sunday: 15,
                };
                const dayNum = dayOffset[day.day] ?? 0;
                const eventosDelDia = eventosPersonales.filter((e) => e.day === dayNum);

                return (
                  <div
                    key={day.day}
                    className={`w-[250px] flex-shrink-0 rounded-2xl overflow-hidden flex flex-col ${
                      isCurrent
                        ? "border-2 border-accent bg-accent-light/30"
                        : "border border-card-border bg-card"
                    } ${isUpcoming ? "opacity-60" : ""}`}
                  >
                    {/* Cabecera del día */}
                    <div className={`px-4 py-3.5 ${isCurrent ? "bg-accent-light" : isCompleted ? "bg-success-light" : "bg-background"}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[14px] font-semibold text-text-primary">
                          {dayLabel[day.day] ?? day.day}
                        </span>
                        <span className="text-[12px] text-text-muted">{dayNum} mar</span>
                      </div>
                      <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full inline-block ${
                        isCurrent
                          ? "bg-accent text-sidebar"
                          : isCompleted
                          ? "bg-success text-white"
                          : "bg-text-muted/20 text-text-muted"
                      }`}>
                        {day.phase.split(": ")[1] || day.phase}
                      </div>
                      <div className="text-[11px] text-text-muted mt-2">
                        {dayCompleted}/{day.tasks.length} tareas
                      </div>
                    </div>

                    {/* Eventos personales del día */}
                    {eventosDelDia.length > 0 && (
                      <div className="px-3 pt-2 flex flex-col gap-1.5">
                        {eventosDelDia.map((ev) => {
                          const cfg = tipoConfig[ev.tipo];
                          const Icon = cfg.icon;
                          return (
                            <div key={ev.titulo} className={`flex items-center gap-2 ${cfg.bg} rounded-lg px-2.5 py-1.5`}>
                              <Icon size={11} className={`${cfg.text} flex-shrink-0`} />
                              <span className={`text-[10px] font-semibold ${cfg.text} flex-1 leading-tight`}>
                                {ev.titulo}
                              </span>
                              {ev.hora && (
                                <span className="text-[9px] text-text-muted flex-shrink-0">{ev.hora}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Lista de tareas */}
                    <div className="flex-1 p-3 flex flex-col gap-2">
                      {day.tasks.map((task) => {
                        const isDone = task.status === "completed";
                        const isInProgress = task.status === "in_progress";
                        const isLocked = task.status === "locked";

                        return (
                          <div
                            key={task.id}
                            className={`rounded-xl p-3 text-left transition-all ${
                              isDone
                                ? "bg-success-light"
                                : isInProgress
                                ? "bg-accent-light border border-accent"
                                : isLocked
                                ? "bg-background/50"
                                : "bg-background"
                            }`}
                          >
                            <div className="flex items-start gap-2 mb-1.5">
                              {isDone ? (
                                <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5" />
                              ) : isInProgress ? (
                                <Loader2 size={14} className="text-accent-text flex-shrink-0 mt-0.5 animate-spin" />
                              ) : isLocked ? (
                                <Lock size={13} className="text-text-muted flex-shrink-0 mt-0.5" />
                              ) : (
                                <Clock size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                              )}
                              <span className={`text-[12px] font-medium leading-snug ${
                                isLocked ? "text-text-muted" : "text-text-primary"
                              }`}>
                                {task.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 ml-6 flex-wrap">
                              <span className="text-[10px] text-text-muted">{task.time}</span>
                              {task.competencies.slice(0, 3).map((key) => {
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leyenda */}
          <div className="bg-card rounded-2xl p-4 border border-card-border flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-[11px] text-text-secondary">Completada ({completedTasks})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-dark" />
                <span className="text-[11px] text-text-secondary">En progreso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-background border border-card-border" />
                <span className="text-[11px] text-text-secondary">Pendiente</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-text-muted" />
                <span className="text-[11px] text-text-secondary">Bloqueada</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {(["entrega", "pitch", "demoday"] as EventType[]).map((t) => {
                const cfg = tipoConfig[t];
                const Icon = cfg.icon;
                const nombres: Record<string, string> = { entrega: "Entrega", pitch: "Pitch", demoday: "Demo Day" };
                return (
                  <div key={t} className="flex items-center gap-1.5">
                    <Icon size={11} className={cfg.text} />
                    <span className="text-[11px] text-text-secondary">{nombres[t]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Vista Mes ───────────────────────────────────────────────────── */}
      {vista === "mes" && (
        <div className="bg-card rounded-2xl border border-card-border p-5">
          {/* Nombre del mes */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-semibold text-text-primary">{MONTH_NAME}</h2>
            <span className="text-[11px] text-text-muted bg-background px-3 py-1 rounded-full">
              {eventosPersonales.length} eventos este mes
            </span>
          </div>

          {/* Cabeceras días */}
          <div className="grid grid-cols-7 mb-2">
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="text-center text-[11px] font-bold text-text-muted py-1">{d}</div>
            ))}
          </div>

          {/* Celdas */}
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />;
              }
              const isToday = day === TODAY_DAY;
              const eventos = eventosPersonales.filter((e) => e.day === day);
              return (
                <div
                  key={day}
                  className={`relative rounded-xl p-1.5 min-h-[52px] flex flex-col transition-all ${
                    isToday
                      ? "bg-accent-light border-2 border-accent"
                      : eventos.length > 0
                      ? "bg-background border border-card-border hover:border-accent/30"
                      : "hover:bg-background"
                  }`}
                >
                  <span className={`text-[12px] font-semibold mb-1 ${
                    isToday ? "text-accent-text" : "text-text-primary"
                  }`}>
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {eventos.map((ev) => {
                      const cfg = tipoConfig[ev.tipo];
                      return (
                        <div
                          key={ev.titulo}
                          className={`${cfg.bg} rounded px-1 py-0.5`}
                          title={ev.titulo}
                        >
                          <span className={`text-[8px] font-bold ${cfg.text} leading-none block truncate`}>
                            {ev.tipo === "demoday" ? "Demo Day" : ev.tipo === "pitch" ? "Pitch" : "Entrega"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lista de eventos del mes */}
          <div className="mt-5 pt-5 border-t border-card-border">
            <h3 className="text-[12px] font-bold text-text-secondary uppercase tracking-wide mb-3">
              Eventos del mes
            </h3>
            <div className="flex flex-col gap-2">
              {eventosPersonales.map((ev) => {
                const cfg = tipoConfig[ev.tipo];
                const Icon = cfg.icon;
                const isToday = ev.day === TODAY_DAY;
                return (
                  <div key={ev.titulo} className={`flex items-center gap-3 p-3 rounded-xl ${cfg.bg}`}>
                    <Icon size={14} className={`${cfg.text} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-[13px] font-semibold ${cfg.text} block`}>{ev.titulo}</span>
                      <span className="text-[11px] text-text-muted">
                        {ev.day} de marzo{ev.hora ? ` · ${ev.hora}` : ""}
                      </span>
                    </div>
                    {isToday && (
                      <span className="text-[9px] font-bold bg-accent text-sidebar px-2 py-0.5 rounded-full flex-shrink-0">
                        Hoy
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
