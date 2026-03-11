"use client";

import { useState } from "react";
import { ClipboardCheck, ChevronDown, ChevronUp, Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";
import { classStudents } from "@/data/students";
import { useLang } from "@/lib/i18n";

type Nivel = 1 | 2 | 3 | 4;

interface CriterioComp {
  key: string;
  nombre: string;
  descriptores: [string, string, string, string]; // niveles 1-4
}

interface RubricaMock {
  id: string;
  tarea: string;
  fase: string;
  descripcion: string;
  criterios: CriterioComp[];
}

const rubricasMock: RubricaMock[] = [
  {
    id: "r1",
    tarea: "Plantillas de comunicación con huéspedes",
    fase: "Construcción Digital — Semana 2",
    descripcion: "El alumno crea plantillas de mensajes para antes, durante y después de la estancia del huésped en su Airbnb de Málaga.",
    criterios: [
      {
        key: "CLC", nombre: "Comunicación Lingüística",
        descriptores: [
          "Sin saludo ni despedida. Errores frecuentes. No comunica la información mínima.",
          "Saludo y despedida presentes. Información básica correcta pero sin personalización.",
          "Mensaje claro, personalizado y con tono adecuado. Cubre todas las necesidades del huésped.",
          "Mensaje bilingüe, tono profesional y cercano. Anticipa preguntas frecuentes del huésped.",
        ],
      },
      {
        key: "CD", nombre: "Competencia Digital",
        descriptores: [
          "No usa ninguna herramienta digital para crear las plantillas.",
          "Usa plantillas predefinidas sin adaptar al proyecto.",
          "Crea plantillas propias con estructura clara usando herramientas digitales.",
          "Integra variables automáticas (nombre, fecha) y propone sistema de envío automatizado.",
        ],
      },
      {
        key: "CE", nombre: "Competencia Emprendedora",
        descriptores: [
          "No considera las necesidades del cliente ni la imagen de su negocio.",
          "Considera al cliente de forma básica. El tono no refleja una marca personal.",
          "Anticipa necesidades del huésped y alinea el tono con la propuesta de valor del alojamiento.",
          "Diseña un sistema de comunicación proactivo que genera valoraciones positivas y fidelización.",
        ],
      },
    ],
  },
  {
    id: "r2",
    tarea: "Simulación de rentabilidad",
    fase: "Modelo Financiero — Semana 3",
    descripcion: "El alumno calcula ingresos proyectados, costes fijos/variables y punto de equilibrio de su Airbnb en tres escenarios (conservador/realista/optimista).",
    criterios: [
      {
        key: "STEM", nombre: "Competencia STEM",
        descriptores: [
          "No completa el modelo. Los cálculos tienen errores graves sin justificación.",
          "Completa el modelo con algún error no corregido. Solo trabaja el escenario optimista.",
          "Modelo correcto con los tres escenarios. Justifica las hipótesis de ocupación.",
          "Modelo robusto con análisis de sensibilidad. Usa datos reales del INE y plataformas.",
        ],
      },
      {
        key: "CE", nombre: "Competencia Emprendedora",
        descriptores: [
          "No distingue entre ingresos y beneficio. No identifica el punto de equilibrio.",
          "Calcula el punto de equilibrio con algún error en la estructura de costes.",
          "Identifica correctamente ingresos, costes y punto de equilibrio. Interpreta los resultados.",
          "Argumenta decisiones de precio y ocupación con datos de mercado. Propone mejoras al modelo.",
        ],
      },
      {
        key: "CLC", nombre: "Comunicación Lingüística",
        descriptores: [
          "No explica el modelo. Presentación confusa.",
          "Explica el modelo con dificultad. Terminología financiera incorrecta.",
          "Explica el modelo con claridad usando terminología adecuada.",
          "Explica el modelo de forma persuasiva, como si lo presentara a un inversor real.",
        ],
      },
    ],
  },
  {
    id: "r3",
    tarea: "Landing page del alojamiento",
    fase: "Construcción Digital — Semana 1",
    descripcion: "El alumno diseña y redacta una landing page convincente para su Airbnb que incluye título, descripción, fotos, precios y call-to-action.",
    criterios: [
      {
        key: "CD", nombre: "Competencia Digital",
        descriptores: [
          "La página no está estructurada. No se puede navegar fácilmente.",
          "Estructura básica. Información incompleta o sin jerarquía visual.",
          "Diseño limpio, jerarquía clara, todos los elementos presentes y funcionales.",
          "Diseño optimizado para conversión: CTAs bien ubicados, fotografía cuidada, SEO básico.",
        ],
      },
      {
        key: "CLC", nombre: "Comunicación Lingüística",
        descriptores: [
          "Texto con errores graves. No capta la atención del visitante.",
          "Texto correcto pero genérico. No diferencia el alojamiento.",
          "Copy atractivo que destaca la propuesta de valor con un tono propio.",
          "Copy bilingüe, con voz de marca definida y título optimizado para búsqueda.",
        ],
      },
      {
        key: "CCEC", nombre: "Expresión Cultural",
        descriptores: [
          "Sin identidad visual. Uso de imágenes genéricas sin relación con Málaga.",
          "Identidad visual básica. Imágenes propias pero sin coherencia estética.",
          "Identidad visual coherente que refleja el carácter del alojamiento y la ciudad.",
          "Brand board completo: paleta, tipografía, fotografía y tono que transmiten una experiencia.",
        ],
      },
    ],
  },
];

// Mock scores por alumno: studentId → criterioKey → nivel
function initScores(): Record<string, Record<string, Record<string, Nivel>>> {
  const result: Record<string, Record<string, Record<string, Nivel>>> = {};
  rubricasMock.forEach((r) => {
    result[r.id] = {};
    classStudents.forEach((s, si) => {
      result[r.id][s.id] = {};
      r.criterios.forEach((c, ci) => {
        const base = ((si * 13 + ci * 7 + 17) % 3) + 2 as Nivel; // nivel 2-4
        result[r.id][s.id][c.key] = base;
      });
    });
  });
  return result;
}

export default function TeacherRubrica() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const nivelConfig: Record<Nivel, { label: string; bg: string; text: string; border: string }> = {
    1: { label: lbl("Inicio", "Beginning"),              bg: "bg-urgent-light",  text: "text-urgent",      border: "border-urgent/30" },
    2: { label: lbl("En proceso", "In progress"),        bg: "bg-warning-light", text: "text-warning",     border: "border-warning/30" },
    3: { label: lbl("Logro esperado", "Achieved"),       bg: "bg-accent-light",  text: "text-accent-text", border: "border-accent/30" },
    4: { label: lbl("Logro sobresaliente", "Advanced"),  bg: "bg-success-light", text: "text-success",     border: "border-success/30" },
  };

  const [activeRubrica, setActiveRubrica] = useState<string>(rubricasMock[0].id);
  const [scores, setScores] = useState(initScores);
  const [vistaAlumno, setVistaAlumno] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [savedRubrica, setSavedRubrica] = useState<string | null>(null);

  const rubrica = rubricasMock.find((r) => r.id === activeRubrica)!;

  const cycleNivel = (rubricaId: string, studentId: string, criterioKey: string) => {
    setScores((prev) => {
      const current = prev[rubricaId][studentId][criterioKey];
      const next = ((current % 4) + 1) as Nivel;
      return {
        ...prev,
        [rubricaId]: {
          ...prev[rubricaId],
          [studentId]: { ...prev[rubricaId][studentId], [criterioKey]: next },
        },
      };
    });
  };

  const getMediaNivel = (rubricaId: string, studentId: string): number => {
    const studentScores = scores[rubricaId]?.[studentId] ?? {};
    const vals = Object.values(studentScores);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const handleGuardar = () => {
    setSavedRubrica(rubrica.id);
    setTimeout(() => setSavedRubrica(null), 2000);
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck size={18} className="text-accent-text" />
            <h1 className="text-[22px] font-bold text-text-primary">{lbl("Rúbricas de Evaluación", "Assessment Rubrics")}</h1>
          </div>
          <p className="text-[13px] text-text-secondary">
            {lbl("Criterios LOMLOE 1-4 · Proyecto Airbnb Málaga · 1º ESO", "LOMLOE criteria 1-4 · Airbnb Málaga Project · Year 7")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVistaAlumno(!vistaAlumno)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary bg-background border border-card-border px-3 py-2 rounded-xl hover:border-accent-text/30 transition-all cursor-pointer"
          >
            {vistaAlumno ? <EyeOff size={13} /> : <Eye size={13} />}
            {vistaAlumno ? lbl("Vista docente", "Teacher view") : lbl("Vista alumno", "Student view")}
          </button>
          <button
            onClick={handleGuardar}
            className="flex items-center gap-1.5 text-[11px] font-bold bg-sidebar text-white px-3 py-2 rounded-xl hover:bg-accent-dark transition-all cursor-pointer"
          >
            {savedRubrica === rubrica.id ? <CheckCircle2 size={13} className="text-accent" /> : <Save size={13} />}
            {savedRubrica === rubrica.id ? lbl("Guardada", "Saved") : lbl("Guardar rúbrica", "Save rubric")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Panel izquierdo — lista de rúbricas */}
        <div className="col-span-1 space-y-2.5">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">{lbl("Tareas del proyecto", "Project tasks")}</p>
          {rubricasMock.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRubrica(r.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                activeRubrica === r.id
                  ? "bg-sidebar border-sidebar"
                  : "bg-card border-card-border hover:border-accent-text/30"
              }`}
            >
              <div className="flex items-start gap-2">
                <ClipboardCheck
                  size={13}
                  className={`flex-shrink-0 mt-0.5 ${activeRubrica === r.id ? "text-accent" : "text-text-muted"}`}
                />
                <div>
                  <p className={`text-[11px] font-semibold leading-snug mb-1 ${activeRubrica === r.id ? "text-white" : "text-text-primary"}`}>
                    {r.tarea}
                  </p>
                  <p className={`text-[9px] ${activeRubrica === r.id ? "text-white/50" : "text-text-muted"}`}>
                    {r.fase}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {r.criterios.map((c) => (
                      <span
                        key={c.key}
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                          activeRubrica === r.id ? "bg-white/10 text-white/70" : "bg-background text-text-muted"
                        }`}
                      >
                        {c.key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Leyenda niveles */}
          <div className="bg-card rounded-2xl border border-card-border p-4 mt-4">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2.5">{lbl("Escala LOMLOE", "LOMLOE scale")}</p>
            {(Object.entries(nivelConfig) as [string, typeof nivelConfig[Nivel]][]).map(([n, cfg]) => (
              <div key={n} className="flex items-center gap-2 mb-1.5">
                <div className={`w-5 h-5 rounded-md ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-[9px] font-black ${cfg.text}`}>{n}</span>
                </div>
                <span className="text-[10px] text-text-secondary">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel central — rúbrica activa */}
        <div className="col-span-3">
          <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
            {/* Header rúbrica */}
            <div className="bg-background px-5 py-4 border-b border-card-border">
              <h2 className="text-[15px] font-bold text-text-primary mb-0.5">{rubrica.tarea}</h2>
              <p className="text-[11px] text-text-muted">{rubrica.descripcion}</p>
            </div>

            {/* Vista docente — tabla de alumnos con notas */}
            {!vistaAlumno ? (
              <div className="p-5">
                {/* Cabecera de columnas */}
                <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `200px repeat(${rubrica.criterios.length}, 1fr) 80px` }}>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wide">{lbl("Alumno", "Student")}</div>
                  {rubrica.criterios.map((c) => (
                    <div key={c.key} className="text-[10px] font-bold text-text-muted uppercase tracking-wide text-center">{c.key}</div>
                  ))}
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wide text-center">{lbl("Media", "Average")}</div>
                </div>

                {/* Filas por alumno */}
                <div className="space-y-2">
                  {classStudents.map((student) => {
                    const media = getMediaNivel(rubrica.id, student.id);
                    const mediaCfg = nivelConfig[media as Nivel] ?? nivelConfig[2];
                    const isOpen = expandedStudent === student.id;

                    return (
                      <div key={student.id} className="rounded-xl border border-card-border overflow-hidden">
                        <div
                          className="grid gap-2 items-center p-3 cursor-pointer hover:bg-background transition-colors"
                          style={{ gridTemplateColumns: `200px repeat(${rubrica.criterios.length}, 1fr) 80px` }}
                          onClick={() => setExpandedStudent(isOpen ? null : student.id)}
                        >
                          {/* Alumno */}
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {student.avatar}
                            </div>
                            <span className="text-[11px] font-medium text-text-primary truncate">{student.name}</span>
                            {isOpen ? <ChevronUp size={11} className="text-text-muted flex-shrink-0" /> : <ChevronDown size={11} className="text-text-muted flex-shrink-0" />}
                          </div>

                          {/* Nivel por criterio */}
                          {rubrica.criterios.map((c) => {
                            const nivel = scores[rubrica.id]?.[student.id]?.[c.key] ?? 2 as Nivel;
                            const cfg = nivelConfig[nivel];
                            return (
                              <div key={c.key} className="flex justify-center">
                                <button
                                  onClick={(e) => { e.stopPropagation(); cycleNivel(rubrica.id, student.id, c.key); }}
                                  className={`w-9 h-9 rounded-xl border ${cfg.bg} ${cfg.border} flex items-center justify-center cursor-pointer hover:brightness-95 transition-all`}
                                  title={`${cfg.label} — ${lbl("clic para cambiar", "click to change")}`}
                                >
                                  <span className={`text-[13px] font-black ${cfg.text}`}>{nivel}</span>
                                </button>
                              </div>
                            );
                          })}

                          {/* Media */}
                          <div className="flex justify-center">
                            <div className={`px-2.5 py-1 rounded-lg ${mediaCfg.bg} ${mediaCfg.border} border`}>
                              <span className={`text-[11px] font-bold ${mediaCfg.text}`}>{media.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Detalle expandido — descriptores del nivel actual */}
                        {isOpen && (
                          <div className="bg-background border-t border-card-border px-5 py-4 space-y-3">
                            {rubrica.criterios.map((c) => {
                              const nivel = scores[rubrica.id]?.[student.id]?.[c.key] ?? 2 as Nivel;
                              const cfg = nivelConfig[nivel];
                              return (
                                <div key={c.key} className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border}`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[9px] font-black ${cfg.text} bg-white/50 px-1.5 py-0.5 rounded-full`}>{nivel}</span>
                                    <span className={`text-[10px] font-bold ${cfg.text}`}>{c.key} — {c.nombre}</span>
                                    <span className={`text-[9px] ${cfg.text} ml-auto`}>{cfg.label}</span>
                                  </div>
                                  <p className="text-[11px] text-text-secondary leading-relaxed">{c.descriptores[nivel - 1]}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Vista alumno — rúbrica de criterios sin scores personales */
              <div className="p-5">
                <div className="bg-accent-light rounded-xl px-4 py-3 mb-4 border border-accent/20">
                  <p className="text-[12px] font-bold text-accent-text mb-0.5">{lbl("Vista del alumno — lo que verá Lucas antes de entregar", "Student view — what Lucas sees before submitting")}</p>
                  <p className="text-[11px] text-text-secondary">{lbl("Esta rúbrica describe exactamente qué se evalúa y qué diferencia cada nivel. Úsala para auto-evaluar tu trabajo antes de enviarlo.", "This rubric describes exactly what is assessed and what distinguishes each level. Use it to self-assess your work before submitting.")}</p>
                </div>

                {rubrica.criterios.map((c) => (
                  <div key={c.key} className="mb-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[10px] font-bold bg-sidebar text-accent px-2 py-0.5 rounded-full">{c.key}</span>
                      <span className="text-[12px] font-bold text-text-primary">{c.nombre}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {c.descriptores.map((desc, idx) => {
                        const nivel = (idx + 1) as Nivel;
                        const cfg = nivelConfig[nivel];
                        return (
                          <div key={nivel} className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border}`}>
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className={`text-[11px] font-black ${cfg.text}`}>{nivel}</span>
                              <span className={`text-[9px] font-semibold ${cfg.text}`}>{cfg.label}</span>
                            </div>
                            <p className="text-[10px] text-text-secondary leading-relaxed">{desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
