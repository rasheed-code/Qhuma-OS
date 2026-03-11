"use client";

import { Flame, TrendingUp, Calendar, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface Dia {
  fecha: string;       // "10 feb"
  etiqueta: string;    // "L", "M"...
  pct: number;         // 0-100 completado
  esHoy: boolean;
  esFinde: boolean;
}

// 5 semanas × 6 días (lun-sáb) = 30 días
// Empezamos en lun 10 feb 2026
const semanas: Dia[][] = [
  // Semana 1: 10-15 feb
  [
    { fecha: "10 feb", etiqueta: "L", pct: 85, esHoy: false, esFinde: false },
    { fecha: "11 feb", etiqueta: "M", pct: 90, esHoy: false, esFinde: false },
    { fecha: "12 feb", etiqueta: "X", pct: 100, esHoy: false, esFinde: false },
    { fecha: "13 feb", etiqueta: "J", pct: 75, esHoy: false, esFinde: false },
    { fecha: "14 feb", etiqueta: "V", pct: 80, esHoy: false, esFinde: false },
    { fecha: "15 feb", etiqueta: "S", pct: 0,  esHoy: false, esFinde: true },
  ],
  // Semana 2: 17-22 feb
  [
    { fecha: "17 feb", etiqueta: "L", pct: 70, esHoy: false, esFinde: false },
    { fecha: "18 feb", etiqueta: "M", pct: 95, esHoy: false, esFinde: false },
    { fecha: "19 feb", etiqueta: "X", pct: 85, esHoy: false, esFinde: false },
    { fecha: "20 feb", etiqueta: "J", pct: 90, esHoy: false, esFinde: false },
    { fecha: "21 feb", etiqueta: "V", pct: 100, esHoy: false, esFinde: false },
    { fecha: "22 feb", etiqueta: "S", pct: 0,  esHoy: false, esFinde: true },
  ],
  // Semana 3: 24 feb - 1 mar (brecha en racha: lun sin actividad)
  [
    { fecha: "24 feb", etiqueta: "L", pct: 0,  esHoy: false, esFinde: false }, // Sin actividad → rompe racha
    { fecha: "25 feb", etiqueta: "M", pct: 65, esHoy: false, esFinde: false },
    { fecha: "26 feb", etiqueta: "X", pct: 80, esHoy: false, esFinde: false },
    { fecha: "27 feb", etiqueta: "J", pct: 90, esHoy: false, esFinde: false },
    { fecha: "28 feb", etiqueta: "V", pct: 95, esHoy: false, esFinde: false },
    { fecha: "1 mar",  etiqueta: "S", pct: 0,  esHoy: false, esFinde: true },
  ],
  // Semana 4: 3-8 mar — START racha actual (12 días)
  [
    { fecha: "3 mar",  etiqueta: "L", pct: 85, esHoy: false, esFinde: false },
    { fecha: "4 mar",  etiqueta: "M", pct: 90, esHoy: false, esFinde: false },
    { fecha: "5 mar",  etiqueta: "X", pct: 100, esHoy: false, esFinde: false },
    { fecha: "6 mar",  etiqueta: "J", pct: 88, esHoy: false, esFinde: false },
    { fecha: "7 mar",  etiqueta: "V", pct: 95, esHoy: false, esFinde: false },
    { fecha: "8 mar",  etiqueta: "S", pct: 70, esHoy: false, esFinde: true }, // Sábado activo
  ],
  // Semana 5: 10-15 mar (semana actual)
  [
    { fecha: "10 mar", etiqueta: "L", pct: 85, esHoy: false, esFinde: false },
    { fecha: "11 mar", etiqueta: "M", pct: 72, esHoy: true,  esFinde: false },
    { fecha: "12 mar", etiqueta: "X", pct: 0,  esHoy: false, esFinde: false }, // Futuro
    { fecha: "13 mar", etiqueta: "J", pct: 0,  esHoy: false, esFinde: false }, // Futuro
    { fecha: "14 mar", etiqueta: "V", pct: 0,  esHoy: false, esFinde: false }, // Futuro
    { fecha: "15 mar", etiqueta: "S", pct: 0,  esHoy: false, esFinde: true  }, // Futuro
  ],
];

// Índice de "mejor semana": semana 4 (índice 3)
const MEJOR_SEMANA_IDX = 3;

function heatColor(pct: number, esFinde: boolean, esFuturo: boolean): string {
  if (esFuturo || pct === 0) return esFinde ? "bg-card border border-card-border/50" : "bg-background";
  if (pct >= 90) return "bg-accent";                        // 100% opacity accent
  if (pct >= 70) return "bg-accent opacity-70";
  if (pct >= 50) return "bg-accent opacity-40";
  return "bg-accent opacity-20";
}

// Para evitar el "opacity class" que no funciona bien en Tailwind, usamos inline style
function accentOpacity(pct: number): { backgroundColor: string } | undefined {
  if (pct === 0) return undefined;
  const opacity = pct >= 90 ? 1 : pct >= 70 ? 0.7 : pct >= 50 ? 0.4 : 0.2;
  return { backgroundColor: `rgba(195, 244, 153, ${opacity})` };
}

// Días con racha actual (semanas 4 y 5, lun-vie donde pct > 0)
const diasEnRacha = new Set([
  "3 mar", "4 mar", "5 mar", "6 mar", "7 mar", "8 mar",
  "10 mar", "11 mar",
]);

const promedioSemana = (dias: Dia[]) => {
  const activos = dias.filter((d) => !d.esFinde && d.pct > 0);
  if (!activos.length) return 0;
  return Math.round(activos.reduce((s, d) => s + d.pct, 0) / activos.length);
};

// El futuro: días después de hoy
const esHoyOAntes = (fecha: string): boolean => {
  const hoy = "11 mar";
  const orden = [
    "10 feb","11 feb","12 feb","13 feb","14 feb","15 feb",
    "17 feb","18 feb","19 feb","20 feb","21 feb","22 feb",
    "24 feb","25 feb","26 feb","27 feb","28 feb","1 mar",
    "3 mar","4 mar","5 mar","6 mar","7 mar","8 mar",
    "10 mar","11 mar","12 mar","13 mar","14 mar","15 mar",
  ];
  return orden.indexOf(fecha) <= orden.indexOf(hoy);
};

export default function StreakCalendar() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;
  const diasPlanos = semanas.flat();
  const diasActivos = diasPlanos.filter((d) => !d.esFinde && d.pct > 0 && esHoyOAntes(d.fecha));
  const totalDias = diasPlanos.filter((d) => !d.esFinde && esHoyOAntes(d.fecha)).length;
  const promGlobal = Math.round(diasActivos.reduce((s, d) => s + d.pct, 0) / (diasActivos.length || 1));

  return (
    <div className="flex gap-5">
      {/* Contenido principal */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={18} className="text-accent-text" />
              <h1 className="text-[22px] font-bold text-text-primary">{lbl("Mi Racha", "My Streak")}</h1>
            </div>
            <p className="text-[13px] text-text-secondary">
              {lbl("Actividad de los últimos 30 días · Proyecto Airbnb Málaga", "Activity over the last 30 days · Airbnb Málaga project")}
            </p>
          </div>
          {/* Racha actual badge */}
          <div className="flex items-center gap-2 bg-warning-light border border-warning/20 px-4 py-2.5 rounded-xl">
            <Flame size={18} className="text-text-primary" />
            <div>
              <span className="text-[22px] font-bold text-text-primary block leading-none">12</span>
              <span className="text-[10px] text-text-muted">{lbl("días de racha", "day streak")}</span>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-card border border-card-border rounded-2xl p-5 mb-5">
          {/* Cabecera días de semana */}
          <div className="grid grid-cols-7 gap-1.5 mb-2" style={{ gridTemplateColumns: "80px repeat(6, 1fr)" }}>
            <div />
            {(lang === "es"
              ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
              : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            ).map((d) => (
              <div key={d} className="text-[9px] font-bold text-text-muted text-center">{d}</div>
            ))}
          </div>

          {/* Filas de semanas */}
          {semanas.map((semana, si) => {
            const avg = promedioSemana(semana);
            const esMejor = si === MEJOR_SEMANA_IDX;
            return (
              <div
                key={si}
                className={`grid gap-1.5 mb-1.5 rounded-xl px-2 py-1.5 transition-all ${esMejor ? "bg-accent-light border border-accent-text/15" : ""}`}
                style={{ gridTemplateColumns: "80px repeat(6, 1fr)" }}
              >
                {/* Label semana */}
                <div className="flex items-center gap-1.5">
                  {esMejor && <Star size={10} className="text-accent-text flex-shrink-0" />}
                  <span className="text-[9px] text-text-muted whitespace-nowrap">
                    {esMejor ? lbl("⭐ Mejor", "⭐ Best") : lbl(`Sem ${si + 1}`, `Wk ${si + 1}`)}
                  </span>
                  {avg > 0 && (
                    <span className="text-[8px] font-bold text-text-muted ml-auto">{avg}%</span>
                  )}
                </div>

                {/* Celdas del día */}
                {semana.map((dia) => {
                  const futuro = !esHoyOAntes(dia.fecha);
                  const enRacha = diasEnRacha.has(dia.fecha);
                  const style = !futuro && dia.pct > 0 ? accentOpacity(dia.pct) : undefined;

                  return (
                    <div key={dia.fecha} className="relative group">
                      <div
                        className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                          dia.esHoy
                            ? "ring-2 ring-accent-text ring-offset-1"
                            : ""
                        } ${
                          dia.esFinde && futuro
                            ? "bg-card border border-card-border/30"
                            : futuro
                            ? "bg-background/50 border border-dashed border-card-border"
                            : dia.pct === 0
                            ? dia.esFinde ? "bg-card" : "bg-background"
                            : "cursor-default"
                        } ${enRacha && !futuro ? "ring-1 ring-warning/40" : ""}`}
                        style={style}
                      >
                        {dia.esHoy && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-text" />
                        )}
                        {enRacha && !futuro && dia.pct > 0 && !dia.esHoy && (
                          <Flame size={8} className="text-accent-text/60" />
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-sidebar text-white text-[9px] font-medium px-2 py-1 rounded-lg whitespace-nowrap">
                          {dia.fecha}
                          {!futuro && <span className="ml-1 text-accent">{dia.pct > 0 ? `${dia.pct}%` : lbl("Sin actividad", "No activity")}</span>}
                          {futuro && <span className="ml-1 text-white/40">{lbl("Próximamente", "Upcoming")}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Leyenda intensidad */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[9px] text-text-muted">{lbl("Menos", "Less")}</span>
            {[0.15, 0.35, 0.6, 0.85, 1].map((op) => (
              <div
                key={op}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: `rgba(195, 244, 153, ${op})` }}
              />
            ))}
            <span className="text-[9px] text-text-muted">{lbl("Más", "More")}</span>
          </div>
        </div>

        {/* Stats de semana */}
        <div className="grid grid-cols-2 gap-3">
          {semanas.map((semana, si) => {
            const avg = promedioSemana(semana);
            const esMejor = si === MEJOR_SEMANA_IDX;
            const diasLab = semana.filter((d) => !d.esFinde);
            const completados = diasLab.filter((d) => d.pct >= 70 && esHoyOAntes(d.fecha)).length;
            return (
              <div
                key={si}
                className={`rounded-xl p-4 border ${esMejor ? "bg-accent-light border-accent-text/20" : "bg-background border-card-border"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-text-primary">
                    {esMejor ? lbl("⭐ Semana " + (si + 1), "⭐ Week " + (si + 1)) : lbl(`Semana ${si + 1}`, `Week ${si + 1}`)}
                  </span>
                  {avg > 0 && (
                    <span className={`text-[13px] font-bold ${esMejor ? "text-accent-text" : "text-text-primary"}`}>
                      {avg}%
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-text-muted mb-2">
                  {semana[0].fecha} → {semana[4].fecha}
                </p>
                {avg > 0 && (
                  <>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${esMejor ? "bg-accent-text" : "bg-accent"}`}
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-text-muted mt-1">{completados}/{diasLab.length} {lbl("días activos", "active days")}</p>
                  </>
                )}
                {avg === 0 && (
                  <p className="text-[10px] text-text-muted italic">{lbl("Semana futura", "Future week")}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-[220px] flex-shrink-0 flex flex-col gap-4">
        {/* Racha actual */}
        <div className="bg-sidebar rounded-2xl p-5 text-center">
          <Flame size={24} className="text-accent mx-auto mb-2" />
          <span className="text-[32px] font-bold text-white block">12</span>
          <span className="text-[11px] text-white/50 block mb-3">{lbl("días de racha actual", "day streak")}</span>
          <div className="text-[9px] text-accent font-bold">{lbl("¡Sigue así!", "Keep it up!")}</div>
        </div>

        {/* Stats */}
        <div className="bg-card border border-card-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={13} className="text-text-primary" />
            <h3 className="text-[12px] font-semibold text-text-primary">{lbl("Estadísticas", "Statistics")}</h3>
          </div>
          {[
            { label: lbl("Mejor racha", "Best streak"), valor: lbl("12 días", "12 days"), sub: lbl("Semana 4-5", "Week 4-5") },
            { label: lbl("Días activos", "Active days"), valor: `${diasActivos.length}/${totalDias}`, sub: lbl("Últimos 30 días", "Last 30 days") },
            { label: lbl("Promedio diario", "Daily average"), valor: `${promGlobal}%`, sub: lbl("Tareas completadas", "Tasks completed") },
            { label: lbl("Mejor semana", "Best week"),  valor: lbl("Sem. 4", "Wk. 4"), sub: lbl("Promedio 92%", "Avg. 92%") },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-card-border/50 last:border-0">
              <div>
                <p className="text-[11px] font-medium text-text-primary">{s.label}</p>
                <p className="text-[9px] text-text-muted">{s.sub}</p>
              </div>
              <span className="text-[13px] font-bold text-accent-text">{s.valor}</span>
            </div>
          ))}
        </div>

        {/* Próximo hito */}
        <div className="bg-accent-light border border-accent-text/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={13} className="text-accent-text" />
            <span className="text-[11px] font-semibold text-accent-text">{lbl("Próximo hito", "Next milestone")}</span>
          </div>
          <p className="text-[12px] font-semibold text-text-primary mb-0.5">{lbl("Racha maestra", "Master streak")}</p>
          <p className="text-[11px] text-text-secondary mb-2">{lbl("30 días consecutivos", "30 consecutive days")}</p>
          <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
            <div className="h-full bg-accent-text rounded-full" style={{ width: "40%" }} />
          </div>
          <p className="text-[9px] text-accent-text mt-1 font-medium">{lbl("12 / 30 días (40%)", "12 / 30 days (40%)")}</p>
        </div>

        {/* Calendario de navegación */}
        <div className="bg-card border border-card-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <button className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-accent-text" />
              <span className="text-[11px] font-semibold text-text-primary">{lbl("Marzo 2026", "March 2026")}</span>
            </div>
            <button className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {(lang === "es"
              ? ["L","M","X","J","V","S","D"]
              : ["M","T","W","T","F","S","S"]
            ).map((d, i) => (
              <div key={i} className="text-[8px] font-bold text-text-muted pb-1">{d}</div>
            ))}
            {/* Días marzo */}
            {[null, null, null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((d, i) => (
              <div
                key={i}
                className={`text-[9px] rounded-md py-0.5 font-medium ${
                  d === null ? "" :
                  d === 11 ? "bg-sidebar text-white font-bold" :
                  d && d < 11 ? "bg-accent/70 text-sidebar" :
                  "text-text-muted"
                }`}
              >
                {d || ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
