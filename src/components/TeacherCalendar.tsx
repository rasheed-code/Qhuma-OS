"use client";

import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, X, Bell, CheckCircle2,
  Clock, Lock, Loader2, Calendar, Layers, Copy, RefreshCw,
} from "lucide-react";
import { weekSchedule } from "@/data/tasks";
import { TaskStatus } from "@/types";
import { useLang } from "@/lib/i18n";

type VistaCalendario = "semana" | "mes" | "trimestre";
type TipoEvento = "demo" | "entrega" | "pitch" | "recordatorio";

interface Evento {
  id: string;
  titulo: string;
  tipo: TipoEvento;
  dia: number;
  hora: string;
  alumnos: number;
}

const tipoConfig: Record<TipoEvento, { label: string; bg: string; text: string; dot: string; border: string }> = {
  demo:         { label: "Demo Day",     bg: "bg-success-light",  text: "text-success",     dot: "bg-success",      border: "border-success/30" },
  entrega:      { label: "Entrega",      bg: "bg-warning-light",  text: "text-warning",     dot: "bg-warning",      border: "border-warning/30" },
  pitch:        { label: "Pitch",        bg: "bg-urgent-light",   text: "text-urgent",      dot: "bg-urgent",       border: "border-urgent/30" },
  recordatorio: { label: "Recordatorio", bg: "bg-accent-light",   text: "text-accent-text", dot: "bg-accent",       border: "border-accent/30" },
};

const eventosIniciales: Evento[] = [
  { id: "e1", titulo: "Demo Day — Airbnb Málaga",          tipo: "demo",         dia: 13, hora: "10:00", alumnos: 12 },
  { id: "e2", titulo: "Entrega evidencias Landing Page",   tipo: "entrega",      dia: 9,  hora: "23:59", alumnos: 12 },
  { id: "e3", titulo: "Sesión de pitch individual",        tipo: "pitch",        dia: 11, hora: "09:00", alumnos: 12 },
  { id: "e4", titulo: "Entrega simulación financiera",     tipo: "entrega",      dia: 17, hora: "23:59", alumnos: 12 },
  { id: "e5", titulo: "Pitch Final — QHUMA Capital",       tipo: "pitch",        dia: 20, hora: "11:00", alumnos: 12 },
  { id: "e6", titulo: "Recordatorio: entregar evidencias", tipo: "recordatorio", dia: 8,  hora: "08:00", alumnos: 12 },
];

// Marzo 2026: día 1 = domingo → en grid lun-dom, offset = 6
const MARCH_START_OFFSET = 6;
const MARCH_DAYS = 31;
const HOY_DIA = 11;

const diasSemanaCortos = ["Lun", "Mar", "Mié", "Jue", "Vie"];

const statusIcons: Record<TaskStatus, typeof CheckCircle2> = {
  completed: CheckCircle2,
  in_progress: Loader2,
  upcoming: Clock,
  locked: Lock,
};

const statusColors: Record<TaskStatus, string> = {
  completed: "text-success",
  in_progress: "text-accent-text",
  upcoming: "text-text-muted",
  locked: "text-text-muted/40",
};

export default function TeacherCalendar() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const diasSemanaGrid = lbl("Lun,Mar,Mié,Jue,Vie,Sáb,Dom", "Mon,Tue,Wed,Thu,Fri,Sat,Sun").split(",");

  const [vista, setVista] = useState<VistaCalendario>("semana");
  const [eventos, setEventos] = useState<Evento[]>(eventosIniciales);
  const [showModal, setShowModal] = useState(false);
  const [recordatorio, setRecordatorio] = useState<string | null>(null);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState<TipoEvento>("recordatorio");
  const [nuevoDia, setNuevoDia] = useState("");
  const [nuevaHora, setNuevaHora] = useState("09:00");

  // T28 — Vista trimestre + duplicar semana
  const [semanaOrigen, setSemanaOrigen] = useState("S1");
  const [semanaDestino, setSemanaDestino] = useState("S2");
  const [semanasDuplicadas, setSemanasDuplicadas] = useState<Set<string>>(new Set());
  const [duplicando, setDuplicando] = useState(false);

  // T28 — Trimestre data: 12 semanas, días lun-vie mapeados a dias del mes
  // Semana 1 = Mar 9-13, Semana 2 = Mar 16-20, Semana 3 = Mar 23-27, semanas 4-12 = hipotéticas (simuladas)
  const semanasTrimestrales = Array.from({ length: 12 }, (_, i) => {
    const semNum = i + 1;
    // Días lun-vie para cada semana (base real en marzo, resto hipotético)
    const baseDay = 9 + i * 7;
    const dias = [0, 1, 2, 3, 4].map((d) => baseDay + d);
    const esDemoDay = semNum === 12;
    const esEntregaT2 = semNum === 8;
    return { semNum, dias, esDemoDay, esEntregaT2 };
  });

  // Mapear evento a semana: semana 1 = dias 9-13, semana 2 = 16-20, ...
  const getSemanaPorDia = (dia: number): number => {
    if (dia <= 13) return 1;
    if (dia <= 20) return 2;
    if (dia <= 27) return 3;
    return Math.ceil(dia / 7);
  };

  const handleDuplicarSemana = () => {
    if (!semanaOrigen || !semanaDestino || semanaOrigen === semanaDestino || duplicando) return;
    setDuplicando(true);
    setTimeout(() => {
      const origenNum = parseInt(semanaOrigen.replace("S", ""));
      const destinoNum = parseInt(semanaDestino.replace("S", ""));
      const eventosSemOrigen = eventos.filter((e) => getSemanaPorDia(e.dia) === origenNum);
      const offset = (destinoNum - origenNum) * 7;
      const copias: Evento[] = eventosSemOrigen.map((e) => ({
        ...e,
        id: `dup-${Date.now()}-${e.id}`,
        dia: e.dia + offset,
      }));
      setEventos((prev) => [...prev, ...copias]);
      setSemanasDuplicadas((prev) => new Set(prev).add(`${semanaOrigen}→${semanaDestino}`));
      setDuplicando(false);
    }, 900);
  };

  // Month calendar grid
  const totalCells = Math.ceil((MARCH_START_OFFSET + MARCH_DAYS) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dia = i - MARCH_START_OFFSET + 1;
    return dia >= 1 && dia <= MARCH_DAYS ? dia : null;
  });

  const getEventosForDia = (dia: number) => eventos.filter((e) => e.dia === dia);
  const eventosOrdenados = [...eventos].sort((a, b) => a.dia - b.dia || a.hora.localeCompare(b.hora));
  const eventosSemana = eventosOrdenados.filter((e) => e.dia >= 9 && e.dia <= 13);

  const handleAddEvento = () => {
    if (!nuevoTitulo.trim() || !nuevoDia) return;
    const nuevo: Evento = {
      id: `e${Date.now()}`,
      titulo: nuevoTitulo.trim(),
      tipo: nuevoTipo,
      dia: parseInt(nuevoDia),
      hora: nuevaHora,
      alumnos: 12,
    };
    setEventos((prev) => [...prev, nuevo]);
    setNuevoTitulo("");
    setNuevoDia("");
    setNuevaHora("09:00");
    setShowModal(false);
  };

  const handleRecordatorio = (eventoId: string) => {
    setRecordatorio(eventoId);
    setTimeout(() => setRecordatorio(null), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary mb-1">{lbl("Calendario Docente", "Teacher Calendar")}</h1>
          <p className="text-[13px] text-text-secondary">{lbl("Proyecto Airbnb Málaga · Semana 1 de 3 · Marzo 2026", "Airbnb Málaga Project · Week 1 of 3 · March 2026")}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Vista toggle */}
          <div className="flex bg-background rounded-xl p-1 gap-1">
            <button
              onClick={() => setVista("semana")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                vista === "semana" ? "bg-sidebar text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Layers size={13} />
              {lbl("Semana", "Week")}
            </button>
            <button
              onClick={() => setVista("mes")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                vista === "mes" ? "bg-sidebar text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Calendar size={13} />
              {lbl("Mes", "Month")}
            </button>
            <button
              onClick={() => setVista("trimestre")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                vista === "trimestre" ? "bg-sidebar text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <ChevronRight size={13} />
              {lbl("Trimestre", "Quarter")}
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-sidebar text-white px-3 py-2 rounded-xl text-[12px] font-medium hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus size={14} />
            {lbl("Añadir evento", "Add event")}
          </button>
        </div>
      </div>

      {/* ── VISTA SEMANA ── */}
      {vista === "semana" && (
        <>
          {/* Events strip */}
          {eventosSemana.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {eventosSemana.map((evento) => {
                const cfg = tipoConfig[evento.tipo];
                const isRec = recordatorio === evento.id;
                return (
                  <div
                    key={evento.id}
                    className={`flex-shrink-0 flex items-center gap-2.5 ${cfg.bg} border ${cfg.border} rounded-xl px-3 py-2`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <div className="min-w-0">
                      <p className={`text-[11px] font-semibold ${cfg.text} max-w-[160px] truncate`}>{evento.titulo}</p>
                      <p className="text-[10px] text-text-muted">Mar {evento.dia} · {evento.hora}</p>
                    </div>
                    <button
                      onClick={() => handleRecordatorio(evento.id)}
                      className={`ml-1 p-1.5 rounded-lg transition-all cursor-pointer flex-shrink-0 ${
                        isRec ? "bg-success/20 text-success" : "hover:bg-black/5 text-text-muted"
                      }`}
                      title={lbl("Enviar recordatorio a alumnos", "Send reminder to students")}
                    >
                      {isRec ? <CheckCircle2 size={13} /> : <Bell size={13} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Week columns */}
          <div className="flex gap-3 overflow-x-auto pb-4">
            {weekSchedule.map((day, dayIdx) => {
              const completedCount = day.tasks.filter((t) => t.status === "completed").length;
              const dayEventos = getEventosForDia(9 + dayIdx);
              return (
                <div
                  key={day.day}
                  className={`rounded-2xl border p-4 min-w-[200px] flex-1 shrink-0 ${
                    day.status === "current"
                      ? "border-accent/40 bg-accent-light/50"
                      : "border-card-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[14px] font-bold text-text-primary block">{diasSemanaCortos[dayIdx]}</span>
                      <span className="text-[11px] text-text-muted">Mar {9 + dayIdx}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      day.status === "current"   ? "bg-accent/20 text-accent-text" :
                      day.status === "completed" ? "bg-success-light text-success" :
                      "bg-background text-text-muted"
                    }`}>
                      {day.status === "current" ? lbl("Hoy", "Today") : day.status === "completed" ? lbl("Listo", "Done") : lbl("Próximo", "Upcoming")}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full bg-success"
                      style={{ width: `${day.tasks.length ? (completedCount / day.tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mb-3">{completedCount}/{day.tasks.length} {lbl("tareas", "tasks")}</p>

                  {/* Day events */}
                  {dayEventos.length > 0 && (
                    <div className="flex flex-col gap-1 mb-3">
                      {dayEventos.map((ev) => {
                        const cfg = tipoConfig[ev.tipo];
                        return (
                          <div key={ev.id} className={`flex items-center gap-1.5 ${cfg.bg} rounded-lg px-2 py-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                            <span className={`text-[9px] font-semibold ${cfg.text} truncate`}>{ev.titulo}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Tasks */}
                  <div className="space-y-1.5">
                    {day.tasks.map((task) => {
                      const Icon = statusIcons[task.status];
                      return (
                        <div
                          key={task.id}
                          className={`rounded-lg p-2 bg-white/70 ${task.status === "locked" ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-start gap-1.5">
                            <Icon
                              size={12}
                              className={`mt-0.5 flex-shrink-0 ${statusColors[task.status]} ${task.status === "in_progress" ? "animate-spin" : ""}`}
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-text-primary leading-tight truncate">
                                {task.title.length > 30 ? task.title.slice(0, 30) + "…" : task.title}
                              </p>
                              <span className="text-[10px] text-text-muted">{task.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── VISTA MES ── */}
      {vista === "mes" && (
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-background rounded-lg cursor-pointer transition-colors">
                <ChevronLeft size={16} className="text-text-muted" />
              </button>
              <span className="text-[15px] font-bold text-text-primary">{lbl("Marzo 2026", "March 2026")}</span>
              <button className="p-1 hover:bg-background rounded-lg cursor-pointer transition-colors">
                <ChevronRight size={16} className="text-text-muted" />
              </button>
            </div>
            <span className="text-[11px] text-text-muted bg-background px-2.5 py-1 rounded-full">{eventos.length} {lbl("eventos", "events")}</span>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {diasSemanaGrid.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-text-muted py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((dia, i) => {
              if (!dia) return <div key={`empty-${i}`} className="min-h-[68px]" />;
              const dayEvs = getEventosForDia(dia);
              const isHoy = dia === HOY_DIA;
              const isWeekend = (i % 7) >= 5;
              return (
                <div
                  key={dia}
                  className={`min-h-[68px] rounded-xl p-1.5 transition-colors ${
                    isHoy
                      ? "bg-sidebar"
                      : isWeekend
                      ? "bg-background/40"
                      : "bg-background hover:bg-accent-light/50"
                  }`}
                >
                  <span className={`text-[11px] font-bold block mb-1 ${isHoy ? "text-accent" : "text-text-primary"}`}>
                    {dia}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {dayEvs.slice(0, 2).map((ev) => {
                      const cfg = tipoConfig[ev.tipo];
                      return (
                        <div
                          key={ev.id}
                          className={`flex items-center gap-1 rounded-md px-1 py-0.5 ${isHoy ? "bg-white/15" : cfg.bg}`}
                        >
                          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isHoy ? "bg-accent" : cfg.dot}`} />
                          <span className={`text-[9px] font-medium truncate ${isHoy ? "text-white/80" : cfg.text}`}>
                            {ev.titulo.split("—")[0].trim().slice(0, 12)}
                          </span>
                        </div>
                      );
                    })}
                    {dayEvs.length > 2 && (
                      <span className={`text-[9px] font-medium pl-1 ${isHoy ? "text-white/60" : "text-text-muted"}`}>
                        +{dayEvs.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── VISTA TRIMESTRE ── */}
      {vista === "trimestre" && (
        <div className="space-y-4 mb-5">
          {/* Duplicar semana panel */}
          <div className="bg-card border border-card-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Copy size={13} className="text-accent-text" />
              <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Duplicar semana", "Duplicate week")}</h3>
              {semanasDuplicadas.size > 0 && (
                <span className="ml-auto text-[9px] font-bold bg-success-light text-success px-2 py-0.5 rounded-full">
                  {semanasDuplicadas.size} {lbl("copias realizadas", "copies made")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-text-muted block mb-1">{lbl("Semana origen", "Source week")}</label>
                <select
                  value={semanaOrigen}
                  onChange={(e) => setSemanaOrigen(e.target.value)}
                  className="w-full border border-card-border rounded-xl px-3 py-2 text-[12px] text-text-primary bg-background outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={`S${i + 1}`} value={`S${i + 1}`}>
                      {lbl(`Semana ${i + 1}`, `Week ${i + 1}`)}
                      {i + 1 === 8 ? " — Entrega T2" : i + 1 === 12 ? " — Demo Day" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-shrink-0 mt-4">
                <ChevronRight size={16} className="text-text-muted" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-text-muted block mb-1">{lbl("Semana destino", "Target week")}</label>
                <select
                  value={semanaDestino}
                  onChange={(e) => setSemanaDestino(e.target.value)}
                  className="w-full border border-card-border rounded-xl px-3 py-2 text-[12px] text-text-primary bg-background outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={`S${i + 1}`} value={`S${i + 1}`}>
                      {lbl(`Semana ${i + 1}`, `Week ${i + 1}`)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleDuplicarSemana}
                disabled={!semanaOrigen || !semanaDestino || semanaOrigen === semanaDestino || duplicando}
                className="mt-4 flex items-center gap-1.5 bg-sidebar text-white px-3 py-2 rounded-xl text-[11px] font-semibold hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                {duplicando ? (
                  <><RefreshCw size={11} className="animate-spin" />{lbl("Copiando...", "Copying...")}</>
                ) : (
                  <><Copy size={11} />{lbl("Duplicar", "Duplicate")}</>
                )}
              </button>
            </div>
            {semanasDuplicadas.size > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Array.from(semanasDuplicadas).map((dup) => (
                  <span key={dup} className="text-[9px] font-bold bg-success-light text-success px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={8} />{dup}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Grid 12 semanas */}
          <div className="bg-card border border-card-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Planificación trimestral — T2 2025-26", "Term 2 Planning — 2025-26")}</h3>
              <div className="flex gap-2">
                <span className="text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full">{lbl("Semana actual: S1", "Current: W1")}</span>
                <span className="text-[9px] font-bold bg-warning-light text-warning px-2 py-0.5 rounded-full">{lbl("Entrega T2: S8", "T2 Deadline: W8")}</span>
                <span className="text-[9px] font-bold bg-success-light text-success px-2 py-0.5 rounded-full">{lbl("Demo Day: S12", "Demo Day: W12")}</span>
              </div>
            </div>

            {/* Header columns */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              <div className="text-[10px] font-bold text-text-muted py-1 pl-2">{lbl("Semana", "Week")}</div>
              {diasSemanaCortos.map((d) => (
                <div key={d} className="text-[10px] font-bold text-text-muted text-center py-1">{d}</div>
              ))}
            </div>

            {/* 12 rows */}
            <div className="space-y-1">
              {semanasTrimestrales.map(({ semNum, dias, esDemoDay, esEntregaT2 }) => {
                const bgRow = esDemoDay
                  ? "bg-success-light border border-success/20"
                  : esEntregaT2
                  ? "bg-warning-light border border-warning/20"
                  : semNum === 1
                  ? "bg-accent-light border border-accent-text/15"
                  : "bg-background";
                const labelFase = esDemoDay
                  ? lbl("Demo Day", "Demo Day")
                  : esEntregaT2
                  ? lbl("Entrega T2", "T2 Deadline")
                  : semNum <= 4
                  ? lbl("Fase 1 — Investigación", "Phase 1 — Research")
                  : semNum <= 8
                  ? lbl("Fase 2 — Producción", "Phase 2 — Production")
                  : lbl("Fase 3 — Presentación", "Phase 3 — Presentation");
                return (
                  <div key={semNum} className={`grid grid-cols-6 gap-1 rounded-xl ${bgRow} py-1.5`}>
                    {/* Semana label */}
                    <div className="flex flex-col justify-center pl-2">
                      <span className={`text-[11px] font-bold ${esDemoDay ? "text-success" : esEntregaT2 ? "text-warning" : semNum === 1 ? "text-accent-text" : "text-text-primary"}`}>
                        S{semNum}
                      </span>
                      <span className="text-[8px] text-text-muted leading-tight max-w-[70px]">{labelFase}</span>
                    </div>
                    {/* Lun–Vie cells */}
                    {dias.map((dia, dIdx) => {
                      const evs = eventos.filter((e) => e.dia === dia);
                      const diaNombre = diasSemanaCortos[dIdx];
                      return (
                        <div key={dIdx} className="flex flex-col items-center gap-0.5 min-h-[36px] justify-center">
                          {evs.length === 0 ? (
                            <span className="text-[8px] text-text-muted/40">{diaNombre}</span>
                          ) : (
                            evs.slice(0, 2).map((ev) => {
                              const cfg = tipoConfig[ev.tipo];
                              return (
                                <span
                                  key={ev.id}
                                  title={ev.titulo}
                                  className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`}
                                />
                              );
                            })
                          )}
                          {evs.length > 2 && (
                            <span className="text-[7px] text-text-muted">+{evs.length - 2}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {(Object.entries(tipoConfig) as [TipoEvento, typeof tipoConfig[TipoEvento]][]).map(([tipo, cfg]) => (
                <div key={tipo} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-[9px] text-text-muted">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Todos los eventos */}
      <div className="bg-card rounded-2xl border border-card-border p-5">
        <h3 className="text-[14px] font-semibold text-text-primary mb-4">{lbl("Todos los eventos del proyecto", "All project events")}</h3>
        <div className="flex flex-col gap-2">
          {eventosOrdenados.map((evento) => {
            const cfg = tipoConfig[evento.tipo];
            const isRec = recordatorio === evento.id;
            return (
              <div
                key={evento.id}
                className={`flex items-center gap-3 ${cfg.bg} border ${cfg.border} rounded-xl px-4 py-3`}
              >
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold ${cfg.text}`}>{evento.titulo}</p>
                  <p className="text-[11px] text-text-muted">Mar {evento.dia} · {evento.hora} · {evento.alumnos} {lbl("alumnos", "students")}</p>
                </div>
                <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 ${cfg.text}`}>
                  {cfg.label}
                </span>
                <button
                  onClick={() => handleRecordatorio(evento.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                    isRec
                      ? "bg-success/20 text-success"
                      : "bg-white/60 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {isRec ? <CheckCircle2 size={12} /> : <Bell size={12} />}
                  {isRec ? lbl("¡Enviado!", "Sent!") : lbl("Recordatorio", "Reminder")}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal añadir evento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-3xl p-6 w-[400px]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-bold text-text-primary">{lbl("Nuevo evento", "New event")}</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-text-muted block mb-1">{lbl("Título del evento", "Event title")}</label>
                <input
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  placeholder={lbl("Ej: Entrega práctica de comunicación", "E.g. Communication assignment deadline")}
                  className="w-full border border-card-border rounded-xl px-3 py-2 text-[13px] text-text-primary bg-background outline-none focus:border-accent-dark"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-text-muted block mb-1">{lbl("Tipo", "Type")}</label>
                  <select
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value as TipoEvento)}
                    className="w-full border border-card-border rounded-xl px-3 py-2 text-[13px] text-text-primary bg-background outline-none cursor-pointer"
                  >
                    <option value="demo">Demo Day</option>
                    <option value="entrega">{lbl("Entrega", "Submission")}</option>
                    <option value="pitch">Pitch</option>
                    <option value="recordatorio">{lbl("Recordatorio", "Reminder")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-text-muted block mb-1">{lbl("Día (marzo)", "Day (March)")}</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={nuevoDia}
                    onChange={(e) => setNuevoDia(e.target.value)}
                    placeholder="11"
                    className="w-full border border-card-border rounded-xl px-3 py-2 text-[13px] text-text-primary bg-background outline-none focus:border-accent-dark"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted block mb-1">{lbl("Hora", "Time")}</label>
                <input
                  type="time"
                  value={nuevaHora}
                  onChange={(e) => setNuevaHora(e.target.value)}
                  className="w-full border border-card-border rounded-xl px-3 py-2 text-[13px] text-text-primary bg-background outline-none focus:border-accent-dark"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-card-border rounded-xl px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-background transition-all cursor-pointer"
              >
                {lbl("Cancelar", "Cancel")}
              </button>
              <button
                onClick={handleAddEvento}
                disabled={!nuevoTitulo.trim() || !nuevoDia}
                className="flex-1 bg-sidebar text-white rounded-xl px-4 py-2.5 text-[13px] font-medium hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer"
              >
                {lbl("Crear evento", "Create event")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
