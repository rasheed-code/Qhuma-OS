"use client";

import { useState, useCallback } from "react";
import { FileSpreadsheet, Download, FileText, Info, TrendingUp, AlertTriangle, RefreshCw, CheckCircle2, BarChart3, ArrowUp, ArrowDown, ArrowRight, History, ChevronDown, ChevronUp, MessageSquare, Copy, Eye, X, Target, CalendarClock, UserCheck } from "lucide-react";
import { classStudents } from "@/data/students";
import { useLang } from "@/lib/i18n";

const COMPS = ["CLC", "CPL", "STEM", "CD", "CPSAA", "CC", "CE", "CCEC"] as const;
type CompKey = typeof COMPS[number];

type Nivel = 1 | 2 | 3 | 4;

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

// T16 — Notas del 3er trimestre (mock T3 — ligeramente superiores a T2)
const gradesT3: Record<string, Record<CompKey, Nivel>> = {
  "1":  { CLC:4, CPL:3, STEM:4, CD:4, CPSAA:4, CC:3, CE:4, CCEC:3 },
  "2":  { CLC:4, CPL:4, STEM:4, CD:4, CPSAA:4, CC:4, CE:4, CCEC:4 },
  "3":  { CLC:2, CPL:2, STEM:3, CD:3, CPSAA:2, CC:3, CE:2, CCEC:2 },
  "4":  { CLC:3, CPL:3, STEM:4, CD:4, CPSAA:4, CC:3, CE:4, CCEC:3 },
  "5":  { CLC:4, CPL:4, STEM:4, CD:4, CPSAA:4, CC:4, CE:4, CCEC:4 },
  "6":  { CLC:3, CPL:3, STEM:3, CD:3, CPSAA:3, CC:3, CE:3, CCEC:3 },
  "7":  { CLC:2, CPL:2, STEM:2, CD:2, CPSAA:2, CC:2, CE:2, CCEC:1 },
  "8":  { CLC:4, CPL:4, STEM:4, CD:4, CPSAA:4, CC:3, CE:4, CCEC:3 },
  "9":  { CLC:3, CPL:3, STEM:4, CD:4, CPSAA:3, CC:3, CE:3, CCEC:3 },
  "10": { CLC:4, CPL:4, STEM:4, CD:4, CPSAA:4, CC:4, CE:4, CCEC:4 },
  "11": { CLC:3, CPL:3, STEM:3, CD:3, CPSAA:3, CC:3, CE:3, CCEC:2 },
  "12": { CLC:4, CPL:3, STEM:4, CD:3, CPSAA:3, CC:3, CE:4, CCEC:3 },
};

// T15 — Notas del trimestre anterior (mock T1)
const gradesTrimAnterior: Record<string, Record<CompKey, Nivel>> = {
  "1":  { CLC:2, CPL:2, STEM:3, CD:3, CPSAA:3, CC:2, CE:3, CCEC:3 },
  "2":  { CLC:3, CPL:4, STEM:4, CD:3, CPSAA:3, CC:4, CE:3, CCEC:3 },
  "3":  { CLC:2, CPL:1, STEM:2, CD:2, CPSAA:1, CC:2, CE:1, CCEC:2 },
  "4":  { CLC:3, CPL:2, STEM:3, CD:3, CPSAA:3, CC:3, CE:3, CCEC:3 },
  "5":  { CLC:4, CPL:3, STEM:4, CD:4, CPSAA:4, CC:4, CE:4, CCEC:4 },
  "6":  { CLC:2, CPL:2, STEM:2, CD:3, CPSAA:3, CC:2, CE:2, CCEC:2 },
  "7":  { CLC:2, CPL:1, STEM:1, CD:2, CPSAA:2, CC:2, CE:2, CCEC:1 },
  "8":  { CLC:3, CPL:3, STEM:3, CD:3, CPSAA:3, CC:3, CE:3, CCEC:3 },
  "9":  { CLC:3, CPL:2, STEM:3, CD:3, CPSAA:2, CC:3, CE:3, CCEC:2 },
  "10": { CLC:4, CPL:3, STEM:4, CD:4, CPSAA:4, CC:3, CE:4, CCEC:3 },
  "11": { CLC:2, CPL:2, STEM:2, CD:2, CPSAA:2, CC:2, CE:2, CCEC:2 },
  "12": { CLC:3, CPL:3, STEM:3, CD:3, CPSAA:3, CC:3, CE:3, CCEC:3 },
};

interface HistorialCambio {
  alumnoNombre: string;
  competencia: CompKey;
  nivelAnterior: Nivel;
  nivelNuevo: Nivel;
  timestamp: string;
}

// T20 — Objetivos de mejora por alumno
interface ObjetivoMejora {
  id: string;
  alumnoId: string;
  competencia: CompKey;
  descripcion: string;
  fechaLimite: string;
  conseguido: boolean;
}

const objetivosIniciales: ObjetivoMejora[] = [
  { id: "obj1", alumnoId: "3", competencia: "STEM", descripcion: "Completar el módulo de análisis de datos del proyecto y entregar hoja de cálculo corregida.", fechaLimite: "20 mar 2026", conseguido: false },
  { id: "obj2", alumnoId: "3", competencia: "CE", descripcion: "Redactar el plan de negocio básico con punto de equilibrio. Tutoría los martes 15:00.", fechaLimite: "25 mar 2026", conseguido: false },
  { id: "obj3", alumnoId: "7", competencia: "CPL", descripcion: "Traducir el listing de su proyecto al inglés con apoyo del profesor de idiomas.", fechaLimite: "18 mar 2026", conseguido: false },
];

export default function TeacherGradeBook() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const compNombre: Record<CompKey, string> = {
    CLC:   lbl("Comunicación Lingüística", "Linguistic Communication"),
    CPL:   lbl("Plurilingüe", "Multilingual"),
    STEM:  "STEM",
    CD:    lbl("Digital", "Digital"),
    CPSAA: lbl("Personal y Social", "Personal & Social"),
    CC:    lbl("Ciudadana", "Civic"),
    CE:    lbl("Emprendedora", "Entrepreneurial"),
    CCEC:  lbl("Expresión Cultural", "Cultural Expression"),
  };

  const nivelConfig: Record<Nivel, { bg: string; text: string; label: string; bar: string }> = {
    1: { bg: "bg-urgent-light",   text: "text-urgent",      label: lbl("Iniciado", "Beginner"),      bar: "bg-urgent" },
    2: { bg: "bg-warning-light",  text: "text-text-primary", label: lbl("En proceso", "In Progress"), bar: "bg-warning" },
    3: { bg: "bg-accent-light",   text: "text-accent-text",  label: lbl("Adquirido", "Acquired"),     bar: "bg-accent-text" },
    4: { bg: "bg-success-light",  text: "text-success",      label: lbl("Avanzado", "Advanced"),      bar: "bg-success" },
  };

  const [grades, setGrades] = useState<Record<string, Record<CompKey, Nivel>>>(initialGrades);
  const [editing, setEditing] = useState<string | null>(null); // "studentId-comp"
  const [editVal, setEditVal] = useState("");
  const [tooltipComp, setTooltipComp] = useState<CompKey | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFilename, setExportFilename] = useState<string | null>(null);

  // T17 — PDF export
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportPDFFilename, setExportPDFFilename] = useState<string | null>(null);

  // T19 — Vista resumen por alumno (modal)
  const [alumnoResumenId, setAlumnoResumenId] = useState<string | null>(null);

  // T21 — Informe de seguimiento individual exportable
  const [exportandoInforme, setExportandoInforme] = useState<string | null>(null);
  const [exportInformeFilename, setExportInformeFilename] = useState<string | null>(null);

  const handleExportarInformeIndividual = (alumnoId: string) => {
    if (exportandoInforme) return;
    setExportandoInforme(alumnoId);
    const alumno = classStudents.find((s) => s.id === alumnoId);
    if (!alumno) { setExportandoInforme(null); return; }
    const fecha = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "2-digit" });
    const filename = `seguimiento_${alumno.name.split(" ")[0].toLowerCase()}_${trimestre}_${new Date().toISOString().slice(0, 10)}.pdf`;
    const t1g = gradesTrimAnterior[alumnoId] ?? {};
    const t2g = initialGrades[alumnoId] ?? {};
    const t3g = gradesT3[alumnoId] ?? {};
    const avgT2 = (COMPS.map((c) => t2g[c] ?? 3).reduce((a, b) => a + b, 0) / COMPS.length).toFixed(2);
    const avgT1 = (COMPS.map((c) => (t1g[c] as number) ?? 3).reduce((a, b) => a + b, 0) / COMPS.length).toFixed(2);
    const objsAlumno = objetivos.filter((o) => o.alumnoId === alumnoId);
    const feedbackDoc = feedbackGenerado[alumnoId] ?? comentariosTrimestral[alumnoId] ?? "";
    const compsRows = COMPS.map((c) => {
      const v1 = (t1g[c] as number) ?? 3;
      const v2 = t2g[c] ?? 3;
      const v3 = t3g[c] ?? 3;
      const delta = v2 - v1;
      const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "=";
      const color = delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#9ca3af";
      return `<tr><td style="font-weight:600">${c}</td><td style="text-align:center">${v1}</td><td style="text-align:center;font-weight:bold">${v2}</td><td style="text-align:center">${v3}</td><td style="text-align:center;color:${color};font-weight:bold">${arrow}${Math.abs(delta) > 0 ? Math.abs(delta) : ""}</td></tr>`;
    }).join("");
    const objsHtml = objsAlumno.length === 0
      ? `<p style="color:#9ca3af;font-style:italic">Sin objetivos definidos para este trimestre.</p>`
      : objsAlumno.map((o) => `<div style="background:${o.conseguido ? "#f0fdf4" : "#fffbeb"};border-radius:8px;padding:8px 12px;margin-bottom:6px"><span style="font-size:10px;font-weight:bold;color:${o.conseguido ? "#22c55e" : "#f59e0b"}">${o.competencia} · ${o.fechaLimite}${o.conseguido ? " · ✓ Conseguido" : ""}</span><p style="font-size:11px;margin:4px 0 0;color:#141414">${o.descripcion}</p></div>`).join("");
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe seguimiento — ${alumno.name}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:11px;color:#141414;margin:36px;line-height:1.5}h1{font-size:20px;color:#1f514c;margin-bottom:2px}h2{font-size:13px;color:#1f514c;margin-top:22px;padding-bottom:4px;border-bottom:1.5px solid #ededed}p.meta{color:#9ca3af;font-size:10px;margin-bottom:18px}table{width:100%;border-collapse:collapse;margin-top:8px}th{background:#1f514c;color:#fff;padding:5px 8px;text-align:left;font-size:10px}td{border:1px solid #ededed;padding:5px 8px;font-size:10px}tr:nth-child(even){background:#f9fafb}.stat{display:inline-block;background:#f4f0e9;border-radius:8px;padding:6px 14px;margin:4px;text-align:center}.sv{display:block;font-size:18px;font-weight:bold;color:#1f514c}.sl{font-size:9px;color:#9ca3af}.feedback-box{background:#edffe3;border-radius:8px;padding:12px;margin-top:8px;border:1px solid #c3f499}.footer{margin-top:24px;font-size:9px;color:#9ca3af;border-top:1px solid #ededed;padding-top:10px}</style></head><body><h1>Informe de seguimiento individual</h1><p class="meta">Alumno/a: <strong>${alumno.name}</strong> · ${trimestre} · 1º ESO A · Proyecto: Airbnb Málaga · ${fecha}</p><div><div class="stat"><span class="sv">${avgT2}</span><span class="sl">Media ${trimestre}</span></div><div class="stat"><span class="sv">${avgT1}</span><span class="sl">Media T${trimestre === "T2" ? "1" : "2"} anterior</span></div><div class="stat"><span class="sv" style="color:${parseFloat(avgT2) >= parseFloat(avgT1) ? "#22c55e" : "#ef4444"}">${parseFloat(avgT2) >= parseFloat(avgT1) ? "▲" : "▼"} ${Math.abs(parseFloat(avgT2) - parseFloat(avgT1)).toFixed(2)}</span><span class="sl">Evolución</span></div><div class="stat"><span class="sv">${objsAlumno.filter((o) => o.conseguido).length}/${objsAlumno.length}</span><span class="sl">Objetivos conseguidos</span></div></div><h2>Competencias LOMLOE — evolución trimestral</h2><table><thead><tr><th>Competencia</th><th>T1</th><th>${trimestre} (activo)</th><th>T3</th><th>Evolución T1→${trimestre}</th></tr></thead><tbody>${compsRows}</tbody></table><h2>Objetivos de mejora personalizados</h2>${objsHtml}${feedbackDoc ? `<h2>Comentario docente y borrador IA</h2><div class="feedback-box"><p style="font-size:11px;color:#2f574d;line-height:1.6">${feedbackDoc}</p></div>` : ""}<h2>Recomendaciones para el próximo trimestre</h2><ul style="padding-left:16px;margin:8px 0"><li style="margin-bottom:4px">Continuar reforzando las competencias con nivel 1 o 2 mediante proyectos de aplicación directa</li><li style="margin-bottom:4px">Programar tutoría individual en las primeras dos semanas del siguiente trimestre</li><li style="margin-bottom:4px">Facilitar recursos de apoyo en las competencias más débiles identificadas este trimestre</li><li>Compartir este informe con la familia en la próxima reunión de tutoría</li></ul><p class="footer">Informe generado por QHUMA OS · Conforme al Real Decreto 217/2022 (LOMLOE) · 8 competencias clave evaluadas · Proyecto Airbnb Málaga</p></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    setExportInformeFilename(filename);
    setTimeout(() => setExportandoInforme(null), 1400);
  };

  // T20 — Objetivos de mejora
  const [objetivos, setObjetivos] = useState<ObjetivoMejora[]>(objetivosIniciales);
  const [showObjetivos, setShowObjetivos] = useState(false);
  const [nuevoObjetivoAlumnoId, setNuevoObjetivoAlumnoId] = useState<string | null>(null);
  const [nuevoObjetivoComp, setNuevoObjetivoComp] = useState<CompKey>("CLC");
  const [nuevoObjetivoDesc, setNuevoObjetivoDesc] = useState("");
  const [nuevoObjetivoFecha, setNuevoObjetivoFecha] = useState("");

  // T18 — Feedback textual por alumno
  const [expandedAlumno, setExpandedAlumno] = useState<string | null>(null);
  const [comentariosTrimestral, setComentariosTrimestral] = useState<Record<string, string>>({});
  const [generandoFeedback, setGenerandoFeedback] = useState<string | null>(null);
  const [feedbackGenerado, setFeedbackGenerado] = useState<Record<string, string>>({});
  const [copiadoFeedback, setCopiadoFeedback] = useState<string | null>(null);

  // T14 — Historial de cambios
  const [historialCambios, setHistorialCambios] = useState<HistorialCambio[]>([]);
  const [showHistorial, setShowHistorial] = useState(false);

  // T15 — Comparar con trimestre anterior
  const [compareModo, setCompareModo] = useState(false);

  // T16 — Selector de trimestre
  const [trimestre, setTrimestre] = useState<"T1" | "T2" | "T3">("T2");
  // T1 = gradesTrimAnterior (read-only), T2 = grades (editable), T3 = gradesT3 (read-only)
  const activeGrades = trimestre === "T1" ? gradesTrimAnterior : trimestre === "T3" ? gradesT3 : grades;
  const prevGrades: Record<string, Record<CompKey, Nivel>> | null =
    trimestre === "T1" ? null : trimestre === "T2" ? gradesTrimAnterior : grades;
  const editingEnabled = trimestre === "T2";

  const saveEdit = useCallback(() => {
    if (!editing) return;
    const [sid, comp] = editing.split("-") as [string, CompKey];
    const val = parseInt(editVal) as Nivel;
    if (val >= 1 && val <= 4) {
      setGrades((prev) => {
        const nivelAnterior = (prev[sid]?.[comp] ?? 3) as Nivel;
        if (nivelAnterior !== val) {
          const alumno = classStudents.find((s) => s.id === sid);
          if (alumno) {
            const hora = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
            setHistorialCambios((h) => [
              { alumnoNombre: alumno.name.split(" ")[0], competencia: comp, nivelAnterior, nivelNuevo: val, timestamp: `Hoy · ${hora}` },
              ...h,
            ].slice(0, 20));
          }
        }
        return { ...prev, [sid]: { ...prev[sid], [comp]: val } };
      });
    }
    setEditing(null);
  }, [editing, editVal]);

  // Media por alumno (T16: usa activeGrades)
  const rowAvg = (sid: string) => {
    const vals = COMPS.map((c) => activeGrades[sid]?.[c] ?? 3);
    return (vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  // Media por competencia (T16: usa activeGrades)
  const colAvg = (comp: CompKey) => {
    const vals = classStudents.map((s) => activeGrades[s.id]?.[comp] ?? 3);
    return (vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  // T15/T16: Media trimestre previo por competencia
  const colAvgPrev = (comp: CompKey): number | null => {
    if (!prevGrades) return null;
    const vals = classStudents.map((s) => prevGrades[s.id]?.[comp] ?? 3);
    return (vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const avgColor = (avg: number) =>
    avg >= 3.5 ? "text-success" : avg >= 2.5 ? "text-accent-text" : avg >= 1.5 ? "text-text-primary" : "text-urgent";

  // T12: CSV export
  const handleExportCSV = () => {
    setIsExporting(true);
    const fecha = new Date().toISOString().slice(0, 10);
    const filename = `notas_lomloe_${trimestre}_1eso_${fecha}.csv`;
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

  // T17: PDF export — informe trimestral
  const handleExportPDF = () => {
    setIsExportingPDF(true);
    const fecha = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "2-digit" });
    const filename = `informe_lomloe_${trimestre}_1eso_${new Date().toISOString().slice(0, 10)}.pdf`;
    const mediaGlobal = (classStudents.reduce((sum, s) => sum + rowAvg(s.id), 0) / classStudents.length).toFixed(2);
    let topAlumno = classStudents[0];
    for (const s of classStudents.slice(1)) {
      if (rowAvg(s.id) > rowAvg(topAlumno.id)) topAlumno = s;
    }
    const alertCount = classStudents.filter((s) =>
      COMPS.filter((c) => (activeGrades[s.id]?.[c] ?? 3) === 1).length >= 3
    ).length;
    const tableRows = classStudents.map((s) =>
      `<tr><td>${s.name}</td>${COMPS.map((c) => `<td>${activeGrades[s.id]?.[c] ?? 3}</td>`).join("")}<td><strong>${rowAvg(s.id).toFixed(1)}</strong></td></tr>`
    ).join("");
    const distRows = ([1, 2, 3, 4] as Nivel[]).map((n) => {
      const count = classStudents.reduce((sum, s) => sum + COMPS.filter((c) => (activeGrades[s.id]?.[c] ?? 3) === n).length, 0);
      const total = classStudents.length * COMPS.length;
      return `<p><strong>${nivelConfig[n].label} (${n})</strong>: ${count} de ${total} evaluaciones — ${Math.round((count / total) * 100)}%</p>`;
    }).join("");
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe LOMLOE ${trimestre} · 1ºESO</title><style>body{font-family:Arial,sans-serif;font-size:11px;color:#1a1a1a;margin:36px}h1{font-size:18px;color:#1f514c;margin-bottom:4px}h2{font-size:13px;color:#1f514c;margin-top:20px;border-bottom:1px solid #d1d5db;padding-bottom:4px}p.meta{color:#9ca3af;font-size:10px;margin-bottom:18px}table{width:100%;border-collapse:collapse;font-size:9px;margin-top:6px}th{background:#1f514c;color:#fff;padding:5px 3px;text-align:center}td{border:1px solid #e5e7eb;padding:4px 3px;text-align:center}td:first-child{text-align:left;padding-left:6px}.stat{display:inline-block;background:#f4f0e9;border-radius:6px;padding:6px 14px;margin:3px}.sv{display:block;font-size:16px;font-weight:bold;color:#1f514c}.alert{color:#dc2626}</style></head><body><h1>Informe LOMLOE · ${trimestre} · 1º ESO · QHUMA Málaga</h1><p class="meta">Proyecto Airbnb Málaga · Grupo 1º ESO A · ${fecha} · Generado por QHUMA OS</p><h2>Tabla de competencias LOMLOE</h2><table><thead><tr><th>Alumno/a</th>${COMPS.map((c) => `<th>${c}</th>`).join("")}<th>Media</th></tr></thead><tbody>${tableRows}</tbody></table><h2>Resumen estadístico</h2><div><div class="stat"><span class="sv">${mediaGlobal}</span>Media global de clase</div><div class="stat"><span class="sv">${topAlumno.name.split(" ")[0]}</span>Alumno destacado</div><div class="stat"><span class="sv ${alertCount > 0 ? "alert" : ""}">${alertCount}</span>Alertas urgentes</div><div class="stat"><span class="sv">${classStudents.length}</span>Total alumnos</div></div><h2>Distribución de niveles LOMLOE</h2>${distRows}<p class="meta" style="margin-top:20px">Informe generado conforme al Real Decreto 217/2022 LOMLOE · QHUMA OS · 8 competencias clave evaluadas</p></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    setExportPDFFilename(filename);
    setTimeout(() => setIsExportingPDF(false), 1200);
  };

  // T18: Generar borrador IA por alumno
  const handleGenerarFeedbackIA = async (alumnoId: string) => {
    if (generandoFeedback) return;
    setGenerandoFeedback(alumnoId);
    const alumno = classStudents.find((s) => s.id === alumnoId);
    if (!alumno) { setGenerandoFeedback(null); return; }
    const notas = COMPS.map((c) => `${c}:${activeGrades[alumnoId]?.[c] ?? 3}`).join(", ");
    const comentario = comentariosTrimestral[alumnoId] ?? "";
    const prompt = `Redacta un breve comentario trimestral (2-3 frases) para el alumno ${alumno.name} con estas notas LOMLOE: ${notas}.${comentario ? ` Observaciones del docente: "${comentario}".` : ""} Usa tono académico, constructivo y personalizado.`;
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, mode: "pitchcoach" }),
      });
      if (res.ok) {
        const data = await res.json();
        const texto = (data.reply ?? data.message ?? data.text ?? "").trim();
        setFeedbackGenerado((prev) => ({ ...prev, [alumnoId]: texto || generarFeedbackMock(alumno.name, alumnoId) }));
      } else {
        setFeedbackGenerado((prev) => ({ ...prev, [alumnoId]: generarFeedbackMock(alumno.name, alumnoId) }));
      }
    } catch {
      setFeedbackGenerado((prev) => ({ ...prev, [alumnoId]: generarFeedbackMock(alumno.name, alumnoId) }));
    }
    setGenerandoFeedback(null);
  };

  const generarFeedbackMock = (nombre: string, alumnoId: string): string => {
    const nombre1 = nombre.split(" ")[0];
    const fuerte = COMPS.find((c) => (activeGrades[alumnoId]?.[c] ?? 3) >= 4) ?? "CE";
    const mejorar = COMPS.find((c) => (activeGrades[alumnoId]?.[c] ?? 3) <= 2) ?? null;
    return `${nombre1} ha mostrado un progreso notable este trimestre, con especial destaque en ${compNombre[fuerte]}. ${mejorar ? `Se recomienda reforzar ${compNombre[mejorar]} mediante actividades de apoyo personalizadas.` : "Ha alcanzado los objetivos planteados en todas las competencias clave."} Su actitud participativa y colaborativa es un activo para el grupo.`;
  };

  const handleCopiarFeedback = async (alumnoId: string) => {
    const texto = feedbackGenerado[alumnoId];
    if (!texto) return;
    try { await navigator.clipboard.writeText(texto); } catch {}
    setCopiadoFeedback(alumnoId);
    setTimeout(() => setCopiadoFeedback(null), 2000);
  };

  // T12: Alerta trimestral — alumnos con nivel 1 en ≥ 3 competencias (T16: usa activeGrades)
  const alertasTrimestral = classStudents.filter((s) =>
    COMPS.filter((c) => (activeGrades[s.id]?.[c] ?? 3) === 1).length >= 3
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet size={18} className="text-accent-text" />
            <h1 className="text-[22px] font-bold text-text-primary">{lbl("Cuaderno de notas", "Grade Book")}</h1>
          </div>
          <p className="text-[13px] text-text-secondary">
            {lbl("Competencias LOMLOE · 1º ESO · Semana 3 · Proyecto Airbnb Málaga", "LOMLOE Competencies · Year 1 · Week 3 · Airbnb Málaga Project")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* T16: Selector de trimestre */}
          <div className="flex items-center gap-1 bg-background rounded-xl border border-card-border p-0.5">
            {(["T1", "T2", "T3"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTrimestre(t); setEditing(null); setCompareModo(false); }}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  trimestre === t
                    ? "bg-sidebar text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-background border border-card-border text-text-secondary text-[11px] font-medium px-3 py-2 rounded-xl cursor-pointer hover:border-accent-text/30 transition-all disabled:opacity-60"
            >
              {isExporting ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
              {isExporting ? lbl("Exportando...", "Exporting...") : `${lbl("Exportar", "Export")} ${trimestre} CSV`}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-medium px-3 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
            >
              {isExportingPDF ? <RefreshCw size={13} className="animate-spin" /> : <FileText size={13} />}
              {isExportingPDF ? lbl("Generando...", "Generating...") : `${lbl("Informe", "Report")} ${trimestre} PDF`}
            </button>
          </div>
          {!editingEnabled && (
            <span className="text-[9px] font-bold bg-warning-light text-warning px-2 py-0.5 rounded-full">
              {trimestre} — {lbl("solo lectura", "read only")}
            </span>
          )}
          {exportFilename && (
            <div className="flex items-center gap-1">
              <CheckCircle2 size={9} className="text-success" />
              <span className="text-[9px] text-success font-mono">{exportFilename}</span>
            </div>
          )}
          {exportPDFFilename && (
            <div className="flex items-center gap-1">
              <CheckCircle2 size={9} className="text-success" />
              <span className="text-[9px] text-success font-mono">{exportPDFFilename}</span>
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
        <div className="ml-auto flex items-center gap-3">
          {/* T15/T16: Toggle comparar trimestre anterior */}
          {prevGrades !== null && (
            <button
              onClick={() => setCompareModo(!compareModo)}
              className={`flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                compareModo
                  ? "bg-sidebar text-white border-sidebar"
                  : "bg-card text-text-secondary border-card-border hover:border-accent-text/30"
              }`}
            >
              <ArrowUp size={10} className={compareModo ? "text-accent" : "text-text-muted"} />
              <ArrowDown size={10} className={compareModo ? "text-white/60" : "text-text-muted"} />
              {lbl("Comparar", "Compare")} {trimestre === "T2" ? "T1" : "T2"}
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <Info size={11} className="text-text-muted" />
            <span className="text-[10px] text-text-muted">
              {editingEnabled ? lbl("Haz clic en cualquier celda para editar", "Click any cell to edit") : `${trimestre} — ${lbl("datos de solo lectura", "read-only data")}`}
            </span>
          </div>
        </div>
      </div>

      {/* T12: Panel de alertas trimestrales */}
      {alertasTrimestral.length > 0 && (
        <div className="bg-urgent-light border border-urgent/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <AlertTriangle size={15} className="text-urgent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-text-primary">
              {lbl("Alerta trimestral", "Term alert")} — {alertasTrimestral.length} {lbl("alumno", "student")}{alertasTrimestral.length > 1 ? lbl("s", "s") : ""} {lbl("con nivel 1 en 3 o más competencias", "with level 1 in 3 or more competencies")}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              {alertasTrimestral.map((s) => s.name.split(" ")[0]).join(", ")} · {lbl("Requieren plan de apoyo urgente", "Require urgent support plan")}
            </p>
          </div>
          <span className="text-[9px] font-bold bg-urgent text-white px-2 py-0.5 rounded-full flex-shrink-0">
            {lbl("Urgente", "Urgent")}
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
                  {lbl("Alumno", "Student")}
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
                  <span className="text-[10px] font-bold text-text-secondary">{lbl("Media", "Avg")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((alumno, idx) => {
                const avg = rowAvg(alumno.id);
                const avgCfg = nivelConfig[Math.round(avg) as Nivel] ?? nivelConfig[3];
                const isExpanded = expandedAlumno === alumno.id;
                return (
                  <>
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
                          <span title={lbl("Alerta trimestral: nivel 1 en ≥3 competencias", "Term alert: level 1 in ≥3 competencies")}>
                            <AlertTriangle size={10} className="text-urgent flex-shrink-0" />
                          </span>
                        )}
                        <button
                          onClick={() => setExpandedAlumno(isExpanded ? null : alumno.id)}
                          title={lbl("Comentario y feedback IA", "Comment & AI feedback")}
                          className={`ml-auto flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                            isExpanded
                              ? "bg-accent-light text-accent-text border-accent-text/30"
                              : "bg-background text-text-muted border-card-border hover:border-accent-text/30"
                          }`}
                        >
                          <MessageSquare size={8} />
                          {isExpanded ? <ChevronUp size={8} /> : <ChevronDown size={8} />}
                        </button>
                        {/* T19 — Ver resumen */}
                        <button
                          onClick={() => setAlumnoResumenId(alumno.id)}
                          title={lbl("Ver resumen del alumno", "View student summary")}
                          className="flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-lg border bg-background text-text-muted border-card-border hover:border-accent-text/30 hover:text-accent-text transition-all cursor-pointer"
                        >
                          <Eye size={8} />
                        </button>
                      </div>
                    </td>

                    {/* Celdas editables (T16: solo T2 editable) */}
                    {COMPS.map((comp) => {
                      const cellId = `${alumno.id}-${comp}`;
                      const nivel = activeGrades[alumno.id]?.[comp] ?? 3;
                      const cfg = nivelConfig[nivel];
                      const isEditing = editing === cellId && editingEnabled;
                      const nivelPrev = prevGrades?.[alumno.id]?.[comp] ?? nivel;
                      const delta = prevGrades ? nivel - nivelPrev : 0;

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
                            <div className="flex flex-col items-center gap-0.5">
                              <button
                                onClick={() => { if (!editingEnabled) return; setEditing(cellId); setEditVal(String(nivel)); }}
                                title={editingEnabled ? `${cfg.label} — ${lbl("clic para editar", "click to edit")}` : cfg.label}
                                className={`w-10 h-7 text-[11px] font-bold rounded-lg transition-all ${cfg.bg} ${cfg.text} ${editingEnabled ? "cursor-pointer hover:brightness-90 hover:scale-105" : "cursor-default"}`}
                              >
                                {nivel}
                              </button>
                              {compareModo && prevGrades && (
                                <div className="flex items-center gap-0.5">
                                  {delta > 0 ? (
                                    <ArrowUp size={7} className="text-success" />
                                  ) : delta < 0 ? (
                                    <ArrowDown size={7} className="text-urgent" />
                                  ) : (
                                    <ArrowRight size={7} className="text-text-muted" />
                                  )}
                                  <span className={`text-[8px] font-bold tabular-nums ${delta > 0 ? "text-success" : delta < 0 ? "text-urgent" : "text-text-muted"}`}>
                                    {delta > 0 ? `+${delta}` : delta === 0 ? "=" : delta}
                                  </span>
                                </div>
                              )}
                            </div>
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
                  {/* T18 — Panel de feedback textual expandido */}
                  {isExpanded && (
                    <tr key={`feedback-${alumno.id}`}>
                      <td colSpan={COMPS.length + 2} className="px-5 py-3 bg-accent-light/40 border-b border-accent-text/10">
                        <div className="flex gap-4">
                          {/* Textarea comentario docente */}
                          <div className="flex-1">
                            <label className="text-[10px] font-semibold text-text-secondary block mb-1">
                              {lbl("Comentario trimestral del docente", "Teacher's term comment")}
                            </label>
                            <textarea
                              value={comentariosTrimestral[alumno.id] ?? ""}
                              onChange={(e) =>
                                setComentariosTrimestral((prev) => ({ ...prev, [alumno.id]: e.target.value }))
                              }
                              placeholder={lbl(`Observaciones sobre ${alumno.name.split(" ")[0]} para ${trimestre}...`, `Notes about ${alumno.name.split(" ")[0]} for ${trimestre}...`)}
                              className="w-full text-[11px] text-text-primary bg-card border border-card-border rounded-xl px-3 py-2 resize-none outline-none focus:border-accent-text/40 h-[68px] placeholder:text-text-muted"
                            />
                          </div>
                          {/* Borrador IA */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] font-semibold text-text-secondary">
                                {lbl("Borrador IA", "AI Draft")}
                              </label>
                              {feedbackGenerado[alumno.id] && (
                                <button
                                  onClick={() => handleCopiarFeedback(alumno.id)}
                                  className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-lg border border-card-border bg-card text-text-secondary hover:border-accent-text/30 transition-all cursor-pointer"
                                >
                                  {copiadoFeedback === alumno.id
                                    ? <><CheckCircle2 size={9} className="text-success" /> {lbl("Copiado", "Copied")}</>
                                    : <><Copy size={9} /> {lbl("Copiar", "Copy")}</>
                                  }
                                </button>
                              )}
                            </div>
                            {feedbackGenerado[alumno.id] ? (
                              <div className="bg-card border border-accent-text/20 rounded-xl px-3 py-2 text-[10px] text-text-primary leading-relaxed h-[68px] overflow-y-auto">
                                {feedbackGenerado[alumno.id]}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleGenerarFeedbackIA(alumno.id)}
                                disabled={!!generandoFeedback}
                                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-xl bg-sidebar text-white cursor-pointer hover:brightness-110 transition-all disabled:opacity-60 mt-1"
                              >
                                {generandoFeedback === alumno.id
                                  ? <><RefreshCw size={11} className="animate-spin" /> {lbl("Generando...", "Generating...")}</>
                                  : <><MessageSquare size={11} /> {lbl("Generar borrador IA", "Generate AI draft")}</>
                                }
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </>
                );
              })}

              {/* Fila de medias por competencia */}
              <tr className="bg-accent-light border-t-2 border-accent-text/20">
                <td className="px-4 py-3 sticky left-0 bg-accent-light z-10">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-accent-text" />
                    <span className="text-[11px] font-bold text-accent-text">{lbl("Media clase", "Class avg")}</span>
                  </div>
                </td>
                {COMPS.map((comp) => {
                  const avg = colAvg(comp);
                  const avgPrev = colAvgPrev(comp);
                  const delta = avgPrev !== null ? avg - avgPrev : 0;
                  return (
                    <td key={comp} className="px-0.5 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-[12px] font-bold ${avgColor(avg)}`}>{avg.toFixed(1)}</span>
                        {compareModo && avgPrev !== null && (
                          <div className="flex items-center gap-0.5">
                            {delta > 0.05 ? (
                              <ArrowUp size={7} className="text-success" />
                            ) : delta < -0.05 ? (
                              <ArrowDown size={7} className="text-urgent" />
                            ) : (
                              <ArrowRight size={7} className="text-text-muted" />
                            )}
                            <span className={`text-[8px] font-bold tabular-nums ${delta > 0.05 ? "text-success" : delta < -0.05 ? "text-urgent" : "text-text-muted"}`}>
                              {delta > 0.05 ? `+${delta.toFixed(1)}` : Math.abs(delta) < 0.05 ? "=" : delta.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
                {(() => {
                  const totalAvg = classStudents.reduce((sum, s) => sum + rowAvg(s.id), 0) / classStudents.length;
                  const totalAvgPrev = prevGrades
                    ? classStudents.reduce((sum, s) => {
                        const vals = COMPS.map((c) => prevGrades[s.id]?.[c] ?? 3);
                        return sum + vals.reduce((a, b) => a + b, 0) / vals.length;
                      }, 0) / classStudents.length
                    : null;
                  const delta = totalAvgPrev !== null ? totalAvg - totalAvgPrev : 0;
                  return (
                    <td className="px-3 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-[13px] font-bold ${avgColor(totalAvg)}`}>{totalAvg.toFixed(1)}</span>
                        {compareModo && totalAvgPrev !== null && (
                          <div className="flex items-center gap-0.5">
                            {delta > 0.05 ? (
                              <ArrowUp size={7} className="text-success" />
                            ) : delta < -0.05 ? (
                              <ArrowDown size={7} className="text-urgent" />
                            ) : (
                              <ArrowRight size={7} className="text-text-muted" />
                            )}
                            <span className={`text-[8px] font-bold tabular-nums ${delta > 0.05 ? "text-success" : delta < -0.05 ? "text-urgent" : "text-text-muted"}`}>
                              {delta > 0.05 ? `+${delta.toFixed(1)}` : Math.abs(delta) < 0.05 ? "=" : delta.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })()}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* T14: Historial de cambios */}
      {historialCambios.length > 0 && (
        <div className="mt-5 bg-card rounded-2xl border border-card-border overflow-hidden">
          <button
            onClick={() => setShowHistorial(!showHistorial)}
            className="w-full flex items-center gap-2 px-5 py-3 hover:bg-background transition-colors cursor-pointer"
          >
            <History size={14} className="text-text-secondary flex-shrink-0" />
            <span className="text-[12px] font-semibold text-text-primary flex-1 text-left">{lbl("Últimos cambios", "Recent changes")}</span>
            <span className="text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full mr-1">
              {Math.min(historialCambios.length, 5)} de {historialCambios.length}
            </span>
            {showHistorial
              ? <ChevronUp size={13} className="text-text-muted flex-shrink-0" />
              : <ChevronDown size={13} className="text-text-muted flex-shrink-0" />
            }
          </button>
          {showHistorial && (
            <div className="border-t border-card-border">
              {historialCambios.slice(0, 5).map((cambio, i) => {
                const subio = cambio.nivelNuevo > cambio.nivelAnterior;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-5 py-2.5 border-b border-card-border/50 last:border-0 ${i % 2 === 0 ? "" : "bg-background/40"}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${subio ? "bg-success-light" : "bg-urgent-light"}`}>
                      {subio
                        ? <ArrowUp size={11} className="text-success" />
                        : <ArrowDown size={11} className="text-urgent" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold text-text-primary">{cambio.alumnoNombre}</span>
                      <span className="text-[11px] text-text-muted mx-1.5">·</span>
                      <span className="text-[11px] font-bold text-accent-text">{cambio.competencia}</span>
                      <span className="text-[11px] text-text-muted ml-1.5">
                        — {nivelConfig[cambio.nivelAnterior].label} → {nivelConfig[cambio.nivelNuevo].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className={`w-5 h-5 rounded-md ${nivelConfig[cambio.nivelAnterior].bg} flex items-center justify-center`}>
                        <span className={`text-[8px] font-bold ${nivelConfig[cambio.nivelAnterior].text}`}>{cambio.nivelAnterior}</span>
                      </div>
                      <ArrowRight size={10} className="text-text-muted" />
                      <div className={`w-5 h-5 rounded-md ${nivelConfig[cambio.nivelNuevo].bg} flex items-center justify-center`}>
                        <span className={`text-[8px] font-bold ${nivelConfig[cambio.nivelNuevo].text}`}>{cambio.nivelNuevo}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-text-muted flex-shrink-0 w-16 text-right">{cambio.timestamp}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* T13: Distribución por competencia */}
      <div className="mt-5 bg-card rounded-2xl border border-card-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={14} className="text-accent-text" />
          <span className="text-[13px] font-semibold text-text-primary">{lbl("Distribución por competencia", "Distribution by competency")}</span>
          <span className="ml-auto text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full">
            {classStudents.length} {lbl("alumnos · niveles 1–4", "students · levels 1–4")}
          </span>
        </div>
        <div className="space-y-2.5">
          {COMPS.map((comp) => {
            const counts = ([1, 2, 3, 4] as Nivel[]).map((n) =>
              classStudents.filter((s) => (grades[s.id]?.[comp] ?? 3) === n).length
            );
            const total = classStudents.length;
            const avg = colAvg(comp);
            return (
              <div key={comp} className="flex items-center gap-3">
                <div className="w-14 flex-shrink-0">
                  <span className="text-[10px] font-bold text-text-secondary">{comp}</span>
                  <span className={`block text-[9px] font-semibold ${avgColor(avg)}`}>{avg.toFixed(1)} {lbl("media", "avg")}</span>
                </div>
                <div className="flex-1 flex h-6 rounded-lg overflow-hidden gap-px bg-background">
                  {([1, 2, 3, 4] as Nivel[]).map((n, ni) => {
                    const pct = (counts[ni] / total) * 100;
                    const cfg = nivelConfig[n];
                    if (pct === 0) return null;
                    return (
                      <div
                        key={n}
                        className={`${cfg.bar} flex items-center justify-center transition-all`}
                        style={{ width: `${pct}%` }}
                        title={`Nivel ${n} (${cfg.label}): ${counts[ni]} alumno${counts[ni] !== 1 ? "s" : ""}`}
                      >
                        {pct > 12 && (
                          <span className="text-white text-[8px] font-bold">{counts[ni]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 w-24">
                  {([1, 2, 3, 4] as Nivel[]).map((n, ni) => counts[ni] > 0 && (
                    <span key={n} className={`text-[9px] font-bold ${nivelConfig[n].text} tabular-nums`} title={nivelConfig[n].label}>
                      {counts[ni]}×{n}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* Leyenda */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-card-border">
          {([1, 2, 3, 4] as Nivel[]).map((n) => (
            <div key={n} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${nivelConfig[n].bar}`} />
              <span className="text-[9px] text-text-muted">{n} — {nivelConfig[n].label}</span>
            </div>
          ))}
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
              <p className="text-[9px] text-text-muted mt-1">{count} {lbl("de", "of")} {total} {lbl("evaluaciones", "assessments")}</p>
            </div>
          );
        })}
      </div>

      {/* T20 — Objetivos de mejora por alumno */}
      {(() => {
        const alumnosEnRiesgo = classStudents.filter((s) =>
          COMPS.some((c) => (activeGrades[s.id]?.[c] ?? 3) === 1)
        );
        const objsPendientes = objetivos.filter((o) => !o.conseguido).length;
        return (
          <div className="mt-5 bg-card rounded-2xl border border-card-border overflow-hidden">
            <button
              onClick={() => setShowObjetivos(!showObjetivos)}
              className="w-full flex items-center gap-2 px-5 py-3 hover:bg-background transition-colors cursor-pointer"
            >
              <Target size={14} className="text-accent-text flex-shrink-0" />
              <span className="text-[13px] font-semibold text-text-primary flex-1 text-left">
                {lbl("Objetivos de mejora", "Improvement goals")}
              </span>
              <span className="text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full mr-1">
                {objsPendientes} {lbl("pendiente", "pending")}{objsPendientes !== 1 ? "s" : ""}
              </span>
              {showObjetivos
                ? <ChevronUp size={13} className="text-text-muted flex-shrink-0" />
                : <ChevronDown size={13} className="text-text-muted flex-shrink-0" />
              }
            </button>

            {showObjetivos && (
              <div className="border-t border-card-border p-5 space-y-5">
                {/* Alumnos con nivel 1 en alguna competencia */}
                {alumnosEnRiesgo.length === 0 ? (
                  <p className="text-[12px] text-text-muted italic text-center py-4">
                    {lbl("Ningún alumno tiene nivel 1 en competencias activas.", "No student has level 1 in active competencies.")}
                  </p>
                ) : (
                  alumnosEnRiesgo.map((alumno) => {
                    const compsNivel1 = COMPS.filter((c) => (activeGrades[alumno.id]?.[c] ?? 3) === 1);
                    const objsAlumno = objetivos.filter((o) => o.alumnoId === alumno.id);
                    const isAddingHere = nuevoObjetivoAlumnoId === alumno.id;
                    return (
                      <div key={alumno.id} className="bg-background rounded-xl p-4">
                        {/* Header alumno */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {alumno.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[13px] font-semibold text-text-primary">{alumno.name.split(" ")[0]}</span>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {compsNivel1.map((c) => (
                                <span key={c} className="text-[9px] font-bold bg-urgent-light text-urgent px-1.5 py-0.5 rounded-full">
                                  {c} · Nivel 1
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (isAddingHere) { setNuevoObjetivoAlumnoId(null); setNuevoObjetivoDesc(""); setNuevoObjetivoFecha(""); }
                              else { setNuevoObjetivoAlumnoId(alumno.id); setNuevoObjetivoComp(compsNivel1[0] ?? "CLC"); }
                            }}
                            className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-xl border cursor-pointer transition-all ${
                              isAddingHere
                                ? "bg-background border-card-border text-text-muted"
                                : "bg-sidebar text-white border-sidebar hover:brightness-110"
                            }`}
                          >
                            {isAddingHere ? lbl("Cancelar", "Cancel") : lbl("+ Añadir objetivo", "+ Add goal")}
                          </button>
                        </div>

                        {/* Objetivos existentes */}
                        {objsAlumno.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {objsAlumno.map((obj) => (
                              <div
                                key={obj.id}
                                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${
                                  obj.conseguido
                                    ? "bg-success-light border-success/20"
                                    : "bg-card border-card-border"
                                }`}
                              >
                                <button
                                  onClick={() => setObjetivos((prev) =>
                                    prev.map((o) => o.id === obj.id ? { ...o, conseguido: !o.conseguido } : o)
                                  )}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border cursor-pointer transition-all mt-0.5 ${
                                    obj.conseguido
                                      ? "bg-success border-success"
                                      : "bg-card border-card-border hover:border-success"
                                  }`}
                                >
                                  {obj.conseguido && <CheckCircle2 size={10} className="text-white" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[10px] font-bold text-accent-text bg-accent-light px-1.5 py-0.5 rounded-full">
                                      {obj.competencia}
                                    </span>
                                    <span className="flex items-center gap-1 text-[9px] text-text-muted">
                                      <CalendarClock size={9} />
                                      {obj.fechaLimite}
                                    </span>
                                    {obj.conseguido && (
                                      <span className="text-[9px] font-bold text-success">{lbl("Conseguido", "Achieved")} ✓</span>
                                    )}
                                  </div>
                                  <p className={`text-[11px] leading-relaxed ${obj.conseguido ? "text-text-muted line-through" : "text-text-primary"}`}>
                                    {obj.descripcion}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Formulario nuevo objetivo */}
                        {isAddingHere && (
                          <div className="bg-card border border-card-border rounded-xl p-3 space-y-2">
                            <div className="flex gap-2">
                              <select
                                value={nuevoObjetivoComp}
                                onChange={(e) => setNuevoObjetivoComp(e.target.value as CompKey)}
                                className="text-[10px] font-bold bg-background border border-card-border rounded-lg px-2 py-1.5 text-accent-text outline-none cursor-pointer"
                              >
                                {compsNivel1.map((c) => <option key={c} value={c}>{c}</option>)}
                                {COMPS.filter((c) => !compsNivel1.includes(c)).map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                placeholder={lbl("Fecha límite (ej: 25 mar 2026)", "Deadline (e.g., Mar 25 2026)")}
                                value={nuevoObjetivoFecha}
                                onChange={(e) => setNuevoObjetivoFecha(e.target.value)}
                                className="flex-1 text-[10px] bg-background border border-card-border rounded-lg px-2 py-1.5 text-text-primary outline-none focus:border-accent-text/40 placeholder:text-text-muted"
                              />
                            </div>
                            <textarea
                              placeholder={lbl("Describe el objetivo SMART para este alumno...", "Describe the SMART goal for this student...")}
                              value={nuevoObjetivoDesc}
                              onChange={(e) => setNuevoObjetivoDesc(e.target.value)}
                              className="w-full text-[11px] bg-background border border-card-border rounded-xl px-3 py-2 resize-none outline-none focus:border-accent-text/40 h-[56px] placeholder:text-text-muted text-text-primary"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => { setNuevoObjetivoAlumnoId(null); setNuevoObjetivoDesc(""); setNuevoObjetivoFecha(""); }}
                                className="text-[10px] font-medium px-3 py-1.5 rounded-lg border border-card-border text-text-muted hover:text-text-primary cursor-pointer transition-all"
                              >
                                {lbl("Cancelar", "Cancel")}
                              </button>
                              <button
                                disabled={!nuevoObjetivoDesc.trim() || !nuevoObjetivoFecha.trim()}
                                onClick={() => {
                                  if (!nuevoObjetivoDesc.trim() || !nuevoObjetivoFecha.trim()) return;
                                  setObjetivos((prev) => [...prev, {
                                    id: `obj${Date.now()}`,
                                    alumnoId: alumno.id,
                                    competencia: nuevoObjetivoComp,
                                    descripcion: nuevoObjetivoDesc.trim(),
                                    fechaLimite: nuevoObjetivoFecha.trim(),
                                    conseguido: false,
                                  }]);
                                  setNuevoObjetivoAlumnoId(null);
                                  setNuevoObjetivoDesc("");
                                  setNuevoObjetivoFecha("");
                                }}
                                className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-sidebar text-white cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {lbl("Guardar objetivo", "Save goal")}
                              </button>
                            </div>
                          </div>
                        )}

                        {objsAlumno.length === 0 && !isAddingHere && (
                          <p className="text-[10px] text-text-muted italic">
                            {lbl("Sin objetivos definidos todavía.", "No goals defined yet.")}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* T19 — Modal vista resumen por alumno */}
      {alumnoResumenId && (() => {
        const alumno = classStudents.find((s) => s.id === alumnoResumenId);
        if (!alumno) return null;
        const t1g = gradesTrimAnterior[alumnoResumenId] ?? {};
        const t2g = initialGrades[alumnoResumenId] ?? {};
        const t3g = gradesT3[alumnoResumenId] ?? {};
        const avg = rowAvg(alumnoResumenId);
        const histFiltered = historialCambios.filter((h) => h.alumnoNombre === alumno.name.split(" ")[0]);

        // SVG radar helpers
        const cx = 80, cy = 80, maxR = 60;
        const angles = COMPS.map((_, i) => ((i * 360) / 8 - 90) * (Math.PI / 180));
        const toPoint = (val: number, i: number) => {
          const r = (val / 4) * maxR;
          return { x: cx + r * Math.cos(angles[i]), y: cy + r * Math.sin(angles[i]) };
        };
        const gridPoly = (level: number) =>
          COMPS.map((_, i) => {
            const r = (level / 4) * maxR;
            return `${cx + r * Math.cos(angles[i])},${cy + r * Math.sin(angles[i])}`;
          }).join(" ");
        const dataPoly = (grds: Record<string, Nivel>) =>
          COMPS.map((c, i) => { const p = toPoint(grds[c] ?? 3, i); return `${p.x},${p.y}`; }).join(" ");
        const labelPos = (i: number) => {
          const r = maxR + 13;
          return { x: cx + r * Math.cos(angles[i]), y: cy + r * Math.sin(angles[i]) };
        };

        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAlumnoResumenId(null)}>
            <div className="bg-card rounded-2xl border border-card-border w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header modal */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-card-border">
                <div className="w-10 h-10 rounded-full bg-sidebar text-white font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                  {alumno.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-text-primary">{alumno.name}</p>
                  <p className="text-[11px] text-text-muted">1º ESO A · {lbl("Proyecto Airbnb Málaga", "Airbnb Málaga Project")} · {lbl("Media global", "Global avg")} {avg.toFixed(1)}/4</p>
                </div>
                {alertasTrimestral.some((a) => a.id === alumnoResumenId) && (
                  <span className="flex items-center gap-1 text-[9px] font-bold bg-urgent text-white px-2 py-0.5 rounded-full flex-shrink-0">
                    <AlertTriangle size={9} /> {lbl("Alerta", "Alert")}
                  </span>
                )}
                {/* T21 — Exportar informe individual */}
                <button
                  onClick={() => handleExportarInformeIndividual(alumnoResumenId)}
                  disabled={exportandoInforme === alumnoResumenId}
                  className="flex items-center gap-1.5 bg-sidebar text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60 flex-shrink-0"
                >
                  {exportandoInforme === alumnoResumenId
                    ? <><RefreshCw size={10} className="animate-spin" />{lbl("Generando...", "Generating...")}</>
                    : <><UserCheck size={10} />{lbl("Informe individual", "Individual report")}</>
                  }
                </button>
                <button onClick={() => setAlumnoResumenId(null)} className="text-text-muted hover:text-text-primary cursor-pointer flex-shrink-0">
                  <X size={16} />
                </button>
              </div>
              {/* T21 — Filename feedback */}
              {exportInformeFilename && exportandoInforme === null && (
                <div className="flex items-center gap-2 px-6 py-2 bg-success-light border-b border-success/20">
                  <CheckCircle2 size={12} className="text-success flex-shrink-0" />
                  <span className="text-[10px] text-success font-medium">{lbl("Descargado:", "Downloaded:")} {exportInformeFilename}</span>
                  <button onClick={() => setExportInformeFilename(null)} className="ml-auto text-text-muted hover:text-text-primary cursor-pointer"><X size={11} /></button>
                </div>
              )}

              <div className="p-6 grid grid-cols-5 gap-5">
                {/* Columna izquierda — Radar SVG */}
                <div className="col-span-2">
                  <p className="text-[11px] font-semibold text-text-secondary mb-3">{lbl("Radar de competencias (T2)", "Competency radar (T2)")}</p>
                  <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
                    {/* Grid rings */}
                    {([1, 2, 3, 4] as Nivel[]).map((lvl) => (
                      <polygon key={lvl} points={gridPoly(lvl)} fill="none" stroke="#ededed" strokeWidth="1" />
                    ))}
                    {/* Axis lines */}
                    {COMPS.map((_, i) => {
                      const p = toPoint(4, i);
                      return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#ededed" strokeWidth="1" />;
                    })}
                    {/* T1 polygon */}
                    <polygon points={dataPoly(t1g as Record<string, Nivel>)} fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
                    {/* T3 polygon */}
                    <polygon points={dataPoly(t3g as Record<string, Nivel>)} fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" />
                    {/* T2 polygon (active) */}
                    <polygon points={dataPoly(t2g as Record<string, Nivel>)} fill="#2f574d" fillOpacity="0.25" stroke="#2f574d" strokeWidth="2" />
                    {/* Labels */}
                    {COMPS.map((c, i) => {
                      const lp = labelPos(i);
                      return <text key={c} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="bold" fill="#666666">{c}</text>;
                    })}
                  </svg>
                  {/* Leyenda radar */}
                  <div className="flex flex-col gap-1 mt-2">
                    {[
                      { t: "T1", color: "bg-warning", opacity: "opacity-60" },
                      { t: "T2", color: "bg-accent-text", opacity: "" },
                      { t: "T3", color: "bg-success", opacity: "opacity-60" },
                    ].map((l) => (
                      <div key={l.t} className="flex items-center gap-1.5">
                        <div className={`w-3 h-1.5 rounded-sm ${l.color} ${l.opacity}`} />
                        <span className="text-[9px] text-text-muted">{l.t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Columna central — Comparativa T1/T2/T3 */}
                <div className="col-span-2">
                  <p className="text-[11px] font-semibold text-text-secondary mb-3">{lbl("Comparativa trimestral", "Term comparison")}</p>
                  <div className="space-y-2">
                    {COMPS.map((c) => {
                      const v1 = (t1g[c] ?? 3) as Nivel;
                      const v2 = (t2g[c] ?? 3) as Nivel;
                      const v3 = (t3g[c] ?? 3) as Nivel;
                      return (
                        <div key={c} className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-text-secondary w-10">{c}</span>
                          <div className="flex-1 flex items-end gap-0.5 h-7">
                            {[
                              { v: v1, cls: "bg-warning opacity-70", t: "T1" },
                              { v: v2, cls: "bg-accent-text", t: "T2" },
                              { v: v3, cls: "bg-success opacity-70", t: "T3" },
                            ].map(({ v, cls, t }) => (
                              <div key={t} className="flex-1 flex flex-col items-center gap-0.5">
                                <span className="text-[7px] font-bold text-text-muted">{v}</span>
                                <div className={`w-full rounded-t-sm ${cls}`} style={{ height: `${(v / 4) * 20}px` }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 mt-2 pt-2 border-t border-card-border">
                    {[{ t: "T1", cls: "bg-warning" }, { t: "T2", cls: "bg-accent-text" }, { t: "T3", cls: "bg-success" }].map((l) => (
                      <div key={l.t} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-sm ${l.cls} opacity-80`} /><span className="text-[8px] text-text-muted">{l.t}</span></div>
                    ))}
                  </div>
                </div>

                {/* Columna derecha — Historial + Feedback T18 */}
                <div className="col-span-1 flex flex-col gap-3">
                  {/* Historial filtrado */}
                  <div>
                    <p className="text-[11px] font-semibold text-text-secondary mb-2">{lbl("Cambios recientes", "Recent changes")}</p>
                    {histFiltered.length === 0 ? (
                      <p className="text-[10px] text-text-muted italic">{lbl("Sin cambios registrados", "No changes recorded")}</p>
                    ) : (
                      <div className="space-y-1.5">
                        {histFiltered.slice(0, 4).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-background rounded-lg px-2 py-1.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${h.nivelNuevo > h.nivelAnterior ? "bg-success-light" : "bg-urgent-light"}`}>
                              {h.nivelNuevo > h.nivelAnterior ? <ArrowUp size={8} className="text-success" /> : <ArrowDown size={8} className="text-urgent" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-bold text-accent-text">{h.competencia}</span>
                              <span className="text-[8px] text-text-muted ml-1">{h.nivelAnterior}→{h.nivelNuevo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Feedback T18 */}
                  {(comentariosTrimestral[alumnoResumenId] || feedbackGenerado[alumnoResumenId]) && (
                    <div>
                      <p className="text-[11px] font-semibold text-text-secondary mb-2">{lbl("Feedback docente", "Teacher feedback")}</p>
                      {comentariosTrimestral[alumnoResumenId] && (
                        <div className="bg-background rounded-lg px-2 py-2 mb-2">
                          <p className="text-[9px] font-bold text-text-muted mb-0.5">{lbl("Comentario", "Comment")}</p>
                          <p className="text-[9px] text-text-primary leading-relaxed">{comentariosTrimestral[alumnoResumenId]}</p>
                        </div>
                      )}
                      {feedbackGenerado[alumnoResumenId] && (
                        <div className="bg-accent-light rounded-lg px-2 py-2">
                          <p className="text-[9px] font-bold text-accent-text mb-0.5">{lbl("Borrador IA", "AI Draft")}</p>
                          <p className="text-[9px] text-text-primary leading-relaxed line-clamp-4">{feedbackGenerado[alumnoResumenId]}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
