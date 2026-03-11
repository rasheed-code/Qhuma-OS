"use client";

import { useState, useCallback } from "react";
import { FileSpreadsheet, Download, Info, TrendingUp, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { classStudents } from "@/data/students";

const COMPS = ["CLC", "CPL", "STEM", "CD", "CPSAA", "CC", "CE", "CCEC"] as const;
type CompKey = typeof COMPS[number];

const compNombre: Record<CompKey, string> = {
  CLC:   "Comunicación Lingüística",
  CPL:   "Plurilingüe",
  STEM:  "STEM",
  CD:    "Digital",
  CPSAA: "Personal y Social",
  CC:    "Ciudadana",
  CE:    "Emprendedora",
  CCEC:  "Expresión Cultural",
};

type Nivel = 1 | 2 | 3 | 4;

const nivelConfig: Record<Nivel, { bg: string; text: string; label: string; bar: string }> = {
  1: { bg: "bg-urgent-light",   text: "text-urgent",      label: "Iniciado",    bar: "bg-urgent" },
  2: { bg: "bg-warning-light",  text: "text-text-primary", label: "En proceso",  bar: "bg-warning" },
  3: { bg: "bg-accent-light",   text: "text-accent-text",  label: "Adquirido",   bar: "bg-accent-text" },
  4: { bg: "bg-success-light",  text: "text-success",      label: "Avanzado",    bar: "bg-success" },
};

// Notas iniciales basadas en progreso real de los alumnos
const initialGrades: Record<string, Record<CompKey, Nivel>> = {
  "1":  { CLC:3, CPL:3, STEM:4, CD:4, CPSAA:3, CC:3, CE:4, CCEC:3 }, // Lucas 72%
  "2":  { CLC:4, CPL:4, STEM:4, CD:4, CPSAA:4, CC:4, CE:4, CCEC:3 }, // Sofía 85%
  "3":  { CLC:2, CPL:2, STEM:2, CD:2, CPSAA:2, CC:3, CE:2, CCEC:2 }, // Pablo 45%
  "4":  { CLC:3, CPL:3, STEM:4, CD:3, CPSAA:4, CC:3, CE:4, CCEC:3 }, // María 78%
  "5":  { CLC:4, CPL:4, STEM:4, CD:4, CPSAA:4, CC:4, CE:4, CCEC:4 }, // Daniel 92%
  "6":  { CLC:3, CPL:2, STEM:3, CD:3, CPSAA:3, CC:3, CE:3, CCEC:2 }, // Carmen 60%
  "7":  { CLC:2, CPL:1, STEM:2, CD:2, CPSAA:2, CC:2, CE:2, CCEC:1 }, // Alejandro 38%
  "8":  { CLC:4, CPL:3, STEM:4, CD:3, CPSAA:4, CC:3, CE:4, CCEC:3 }, // Valentina 80%
  "9":  { CLC:3, CPL:3, STEM:3, CD:4, CPSAA:3, CC:3, CE:3, CCEC:3 }, // Hugo 70%
  "10": { CLC:4, CPL:4, STEM:4, CD:4, CPSAA:4, CC:4, CE:4, CCEC:3 }, // Lucía 88%
  "11": { CLC:3, CPL:2, STEM:3, CD:3, CPSAA:2, CC:3, CE:3, CCEC:2 }, // Martín 55%
  "12": { CLC:3, CPL:3, STEM:4, CD:3, CPSAA:3, CC:3, CE:4, CCEC:3 }, // Alba 75%
};

export default function TeacherGradeBook() {
  const [grades, setGrades] = useState<Record<string, Record<CompKey, Nivel>>>(initialGrades);
  const [editing, setEditing] = useState<string | null>(null); // "studentId-comp"
  const [editVal, setEditVal] = useState("");
  const [tooltipComp, setTooltipComp] = useState<CompKey | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFilename, setExportFilename] = useState<string | null>(null);

  const saveEdit = useCallback(() => {
    if (!editing) return;
    const [sid, comp] = editing.split("-") as [string, CompKey];
    const val = parseInt(editVal) as Nivel;
    if (val >= 1 && val <= 4) {
      setGrades((prev) => ({ ...prev, [sid]: { ...prev[sid], [comp]: val } }));
    }
    setEditing(null);
  }, [editing, editVal]);

  // Media por alumno
  const rowAvg = (sid: string) => {
    const vals = COMPS.map((c) => grades[sid]?.[c] ?? 3);
    return (vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  // Media por competencia
  const colAvg = (comp: CompKey) => {
    const vals = classStudents.map((s) => grades[s.id]?.[comp] ?? 3);
    return (vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const avgColor = (avg: number) =>
    avg >= 3.5 ? "text-success" : avg >= 2.5 ? "text-accent-text" : avg >= 1.5 ? "text-text-primary" : "text-urgent";

  // T12: CSV export
  const handleExportCSV = () => {
    setIsExporting(true);
    const fecha = new Date().toISOString().slice(0, 10);
    const filename = `notas_lomloe_T2_1eso_${fecha}.csv`;
    const header = ["Alumno", ...COMPS, "Media"];
    const filas = classStudents.map((s) => {
      const avg = rowAvg(s.id).toFixed(2);
      return [s.name, ...COMPS.map((c) => grades[s.id]?.[c] ?? 3), avg].join(",");
    });
    const csv = [header.join(","), ...filas].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    setExportFilename(filename);
    setTimeout(() => setIsExporting(false), 1200);
  };

  // T12: Alerta trimestral — alumnos con nivel 1 en ≥ 3 competencias
  const alertasTrimestral = classStudents.filter((s) =>
    COMPS.filter((c) => (grades[s.id]?.[c] ?? 3) === 1).length >= 3
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet size={18} className="text-accent-text" />
            <h1 className="text-[22px] font-bold text-text-primary">Cuaderno de notas</h1>
          </div>
          <p className="text-[13px] text-text-secondary">
            Competencias LOMLOE · 1º ESO · Semana 3 · Proyecto Airbnb Málaga
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-background border border-card-border text-text-secondary text-[11px] font-medium px-3 py-2 rounded-xl cursor-pointer hover:border-accent-text/30 transition-all disabled:opacity-60"
          >
            {isExporting ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
            {isExporting ? "Exportando..." : "Exportar notas CSV"}
          </button>
          {exportFilename && (
            <div className="flex items-center gap-1">
              <CheckCircle2 size={9} className="text-success" />
              <span className="text-[9px] text-success font-mono">{exportFilename}</span>
            </div>
          )}
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 mb-4 bg-background rounded-xl px-4 py-2.5">
        {([1, 2, 3, 4] as Nivel[]).map((n) => (
          <div key={n} className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-md ${nivelConfig[n].bg} flex items-center justify-center`}>
              <span className={`text-[9px] font-bold ${nivelConfig[n].text}`}>{n}</span>
            </div>
            <span className="text-[10px] text-text-muted">{nivelConfig[n].label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <Info size={11} className="text-text-muted" />
          <span className="text-[10px] text-text-muted">Haz clic en cualquier celda para editar</span>
        </div>
      </div>

      {/* T12: Panel de alertas trimestrales */}
      {alertasTrimestral.length > 0 && (
        <div className="bg-urgent-light border border-urgent/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <AlertTriangle size={15} className="text-urgent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-text-primary">
              Alerta trimestral — {alertasTrimestral.length} alumno{alertasTrimestral.length > 1 ? "s" : ""} con nivel 1 en 3 o más competencias
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              {alertasTrimestral.map((s) => s.name.split(" ")[0]).join(", ")} · Requieren plan de apoyo urgente
            </p>
          </div>
          <span className="text-[9px] font-bold bg-urgent text-white px-2 py-0.5 rounded-full flex-shrink-0">
            Urgente
          </span>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background border-b border-card-border">
                <th className="text-left text-[11px] font-semibold text-text-secondary px-4 py-3 w-36 sticky left-0 bg-background z-10">
                  Alumno
                </th>
                {COMPS.map((c) => (
                  <th
                    key={c}
                    className="text-center px-1 py-3 w-12 relative cursor-help"
                    onMouseEnter={() => setTooltipComp(c)}
                    onMouseLeave={() => setTooltipComp(null)}
                  >
                    <span className="text-[10px] font-bold text-text-secondary">{c}</span>
                    {tooltipComp === c && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-sidebar text-white text-[9px] font-medium px-2 py-1 rounded-lg whitespace-nowrap z-20 pointer-events-none">
                        {compNombre[c]}
                      </div>
                    )}
                  </th>
                ))}
                <th className="text-center px-3 py-3 w-16">
                  <span className="text-[10px] font-bold text-text-secondary">Media</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((alumno, idx) => {
                const avg = rowAvg(alumno.id);
                const avgCfg = nivelConfig[Math.round(avg) as Nivel] ?? nivelConfig[3];
                return (
                  <tr
                    key={alumno.id}
                    className={`border-b border-card-border/50 hover:bg-background/40 transition-colors ${idx % 2 === 0 ? "" : "bg-background/20"}`}
                  >
                    {/* Nombre */}
                    <td className="px-4 py-2.5 sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {alumno.avatar}
                        </div>
                        <span className="text-[12px] font-medium text-text-primary whitespace-nowrap">
                          {alumno.name.split(" ")[0]}
                        </span>
                        {alertasTrimestral.some((a) => a.id === alumno.id) && (
                          <span title="Alerta trimestral: nivel 1 en ≥3 competencias">
                            <AlertTriangle size={10} className="text-urgent flex-shrink-0" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Celdas editables */}
                    {COMPS.map((comp) => {
                      const cellId = `${alumno.id}-${comp}`;
                      const nivel = grades[alumno.id]?.[comp] ?? 3;
                      const cfg = nivelConfig[nivel];
                      const isEditing = editing === cellId;

                      return (
                        <td key={comp} className="px-0.5 py-1.5 text-center">
                          {isEditing ? (
                            <input
                              autoFocus
                              type="number"
                              min={1} max={4}
                              value={editVal}
                              onChange={(e) => setEditVal(e.target.value)}
                              onBlur={saveEdit}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit();
                                if (e.key === "Escape") setEditing(null);
                              }}
                              className="w-10 h-7 text-center text-[11px] font-bold rounded-lg border border-accent-text/40 bg-card outline-none focus:border-accent-text"
                            />
                          ) : (
                            <button
                              onClick={() => { setEditing(cellId); setEditVal(String(nivel)); }}
                              title={`${cfg.label} — clic para editar`}
                              className={`w-10 h-7 text-[11px] font-bold rounded-lg cursor-pointer transition-all hover:brightness-90 hover:scale-105 ${cfg.bg} ${cfg.text}`}
                            >
                              {nivel}
                            </button>
                          )}
                        </td>
                      );
                    })}

                    {/* Media del alumno */}
                    <td className="px-3 py-1.5 text-center">
                      <div className={`inline-flex flex-col items-center`}>
                        <span className={`text-[13px] font-bold ${avgColor(avg)}`}>
                          {avg.toFixed(1)}
                        </span>
                        <div className="w-8 h-1 bg-background rounded-full overflow-hidden mt-0.5">
                          <div className={`h-full ${avgCfg.bar} rounded-full`} style={{ width: `${(avg / 4) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Fila de medias por competencia */}
              <tr className="bg-accent-light border-t-2 border-accent-text/20">
                <td className="px-4 py-3 sticky left-0 bg-accent-light z-10">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-accent-text" />
                    <span className="text-[11px] font-bold text-accent-text">Media clase</span>
                  </div>
                </td>
                {COMPS.map((comp) => {
                  const avg = colAvg(comp);
                  return (
                    <td key={comp} className="px-0.5 py-3 text-center">
                      <span className={`text-[12px] font-bold ${avgColor(avg)}`}>{avg.toFixed(1)}</span>
                    </td>
                  );
                })}
                <td className="px-3 py-3 text-center">
                  <span className={`text-[13px] font-bold ${avgColor(
                    classStudents.reduce((sum, s) => sum + rowAvg(s.id), 0) / classStudents.length
                  )}`}>
                    {(classStudents.reduce((sum, s) => sum + rowAvg(s.id), 0) / classStudents.length).toFixed(1)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribución de niveles */}
      <div className="mt-5 grid grid-cols-4 gap-3">
        {([1, 2, 3, 4] as Nivel[]).map((n) => {
          const total = classStudents.length * COMPS.length;
          const count = classStudents.reduce((sum, s) =>
            sum + COMPS.filter((c) => (grades[s.id]?.[c] ?? 3) === n).length, 0
          );
          const pct = Math.round((count / total) * 100);
          const cfg = nivelConfig[n];
          return (
            <div key={n} className={`rounded-xl p-4 border border-card-border ${cfg.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-semibold ${cfg.text}`}>{n} — {cfg.label}</span>
                <span className={`text-[18px] font-bold ${cfg.text}`}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-white/40 rounded-full overflow-hidden">
                <div className={`h-full ${cfg.bar} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[9px] text-text-muted mt-1">{count} de {total} evaluaciones</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
