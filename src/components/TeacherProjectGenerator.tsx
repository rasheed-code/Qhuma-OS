"use client";

import { useState } from "react";
import { Sparkles, ChevronRight, RotateCcw, Copy, Check, BookOpen, Target, Clock, Users } from "lucide-react";
import { useLang } from "@/lib/i18n";

const COMPS = ["CLC", "CPL", "STEM", "CD", "CPSAA", "CC", "CE", "CCEC"] as const;
type CompKey = typeof COMPS[number];

const compFull: Record<CompKey, string> = {
  CLC:   "Comunicación Lingüística",
  CPL:   "Plurilingüe",
  STEM:  "STEM",
  CD:    "Digital",
  CPSAA: "Personal y Social",
  CC:    "Ciudadana",
  CE:    "Emprendedora",
  CCEC:  "Expresión Cultural",
};

interface GeneratedProject {
  title: string;
  subtitle: string;
  context: string;
  duration: string;
  competencies: CompKey[];
  phases: { name: string; duration: string; description: string }[];
  deliverables: string[];
  evaluationCriteria: { comp: CompKey; descriptor: string }[];
  realWorldConnection: string;
  qhumaCapital?: string;
}

const projectTemplates: GeneratedProject[] = [
  {
    title: "Startup de Turismo Sostenible",
    subtitle: "Diseña un producto turístico eco-friendly para tu ciudad",
    context: "El turismo representa el 12% del PIB español. Los viajeros del siglo XXI buscan experiencias auténticas y sostenibles. ¿Qué producto turístico crearía impacto real en tu ciudad?",
    duration: "6 semanas",
    competencies: ["CE", "CC", "CLC", "STEM", "CD"],
    phases: [
      { name: "Investigación de mercado", duration: "1 semana", description: "Análisis de competidores, encuestas a turistas, estudio de sostenibilidad local" },
      { name: "Diseño del producto", duration: "1 semana", description: "Definición del itinerario, branding, pricing y propuesta de valor diferenciada" },
      { name: "Modelo financiero", duration: "1 semana", description: "Proyección de ingresos a 12 meses, costes, punto de equilibrio y plan de inversión" },
      { name: "Prototipo y web", duration: "1.5 semanas", description: "Landing page, catálogo de experiencias y sistema de reservas básico" },
      { name: "Pitch a inversores", duration: "1.5 semanas", description: "Presentación de 8 min ante panel real de inversores locales" },
    ],
    deliverables: ["Análisis de mercado (informe PDF)", "Brand book completo", "Modelo financiero en hoja de cálculo", "Landing page funcional", "Pitch deck de 12 diapositivas", "Video promo de 90 segundos"],
    evaluationCriteria: [
      { comp: "CE", descriptor: "Identifica oportunidades de negocio y elabora un plan viable con datos reales" },
      { comp: "CC", descriptor: "Considera el impacto medioambiental y social de su proyecto en la comunidad" },
      { comp: "STEM", descriptor: "Aplica modelos matemáticos para proyección financiera y análisis estadístico" },
    ],
    realWorldConnection: "Los mejores proyectos serán presentados a la Junta de Turismo local. Los 3 finalistas optan a mentoría de empresarios reales.",
    qhumaCapital: "Proyectos con viabilidad demostrada pueden optar a financiación QHUMA Capital hasta €1.000.",
  },
  {
    title: "App para Resolver un Problema Local",
    subtitle: "Identifica un problema real de tu barrio y diseña la solución digital",
    context: "España tiene más de 47 millones de habitantes con necesidades locales muy específicas. Un estudiante de 1º ESO tiene la perspectiva fresca que los adultos perdemos. ¿Qué ves tú que ellos no ven?",
    duration: "5 semanas",
    competencies: ["CD", "CE", "CPSAA", "CLC", "STEM"],
    phases: [
      { name: "Etnografía local", duration: "1 semana", description: "Observación de campo, entrevistas a vecinos, mapa de empatía del usuario" },
      { name: "Definición del problema", duration: "0.5 semanas", description: "Problem statement, journey map, priorización de pain points" },
      { name: "Ideación y prototipado", duration: "1.5 semanas", description: "Brainstorming, wireframes en papel, prototipo clickable en Figma básico" },
      { name: "Validación con usuarios", duration: "1 semana", description: "Tests de usabilidad con 5 usuarios reales, iteraciones y mejoras" },
      { name: "Presentación y demo", duration: "1 semana", description: "Demo live del prototipo ante el consejo escolar y representantes del ayuntamiento" },
    ],
    deliverables: ["Informe etnográfico", "Problem statement visual", "Prototipo en Figma (20+ pantallas)", "Informe de pruebas de usuario", "Presentación final + demo"],
    evaluationCriteria: [
      { comp: "CD", descriptor: "Diseña interfaces centradas en el usuario aplicando principios de UX/UI básicos" },
      { comp: "CPSAA", descriptor: "Reflexiona sobre el proceso de aprendizaje y gestiona la frustración del prototipado iterativo" },
      { comp: "CE", descriptor: "Propone soluciones innovadoras a problemas reales con criterio de factibilidad" },
    ],
    realWorldConnection: "El prototipo finalista será presentado al ayuntamiento. Si se implementa, el alumno recibirá reconocimiento público oficial.",
  },
  {
    title: "Productora de Contenido Educativo",
    subtitle: "Crea un canal que explique conceptos de ciencias a tus compañeros",
    context: "El 78% de los estudiantes aprende mejor con contenido visual y narrado por pares. La divulgación científica es una habilidad clave del siglo XXI que combina conocimiento técnico con comunicación.",
    duration: "4 semanas",
    competencies: ["CLC", "STEM", "CD", "CCEC", "CPL"],
    phases: [
      { name: "Selección de tema y guion", duration: "1 semana", description: "Elección del concepto científico, investigación profunda, guion narrado" },
      { name: "Producción audiovisual", duration: "1.5 semanas", description: "Grabación, edición básica, infografías animadas, subtítulos en 2 idiomas" },
      { name: "Publicación y métricas", duration: "0.5 semanas", description: "Publicación en plataforma escolar, análisis de retención y comentarios" },
      { name: "Iteración y mejora", duration: "1 semana", description: "Segundo episodio incorporando feedback. Comparativa de métricas entre episodios" },
    ],
    deliverables: ["Guion completo", "2 episodios editados (5-8 min)", "Infografía descargable", "Análisis de métricas", "Reflexión de mejora"],
    evaluationCriteria: [
      { comp: "CLC", descriptor: "Comunica conceptos científicos complejos de forma clara, precisa y adaptada a la audiencia" },
      { comp: "STEM", descriptor: "Demuestra comprensión profunda del concepto científico elegido con rigor y precisión" },
      { comp: "CCEC", descriptor: "Emplea recursos visuales y narrativos con criterio estético y comunicativo propio" },
    ],
    realWorldConnection: "El canal será parte de la biblioteca de recursos de QHUMA para otros estudiantes. Los episodios con +50 vistas recibirán badge especial.",
  },
];

export default function TeacherProjectGenerator() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const [step, setStep] = useState<"config" | "result">("config");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("5");
  const [selectedComps, setSelectedComps] = useState<CompKey[]>(["CE", "STEM", "CLC"]);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedProject | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(0);

  const toggleComp = (c: CompKey) => {
    setSelectedComps((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setResult(projectTemplates[currentTemplate % projectTemplates.length]);
      setCurrentTemplate((n) => n + 1);
      setGenerating(false);
      setStep("result");
    }, 1800);
  };

  const handleRegenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setResult(projectTemplates[currentTemplate % projectTemplates.length]);
      setCurrentTemplate((n) => n + 1);
      setGenerating(false);
    }, 1200);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${result.title}\n${result.subtitle}\n\n${result.context}\n\nDuración: ${result.duration}\nCompetencias: ${result.competencies.join(", ")}\n\nFases:\n${result.phases.map((p) => `- ${p.name} (${p.duration}): ${p.description}`).join("\n")}\n\nEntregables:\n${result.deliverables.map((d) => `- ${d}`).join("\n")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-accent-text" />
            <h1 className="text-[22px] font-bold text-text-primary">{lbl("Generador de Proyectos", "Project Generator")}</h1>
          </div>
          <p className="text-[13px] text-text-secondary">
            {lbl("Genera proyectos LOMLOE alineados con competencias y contexto real · IA educativa QHUMA", "Generate LOMLOE projects aligned with competencies and real-world context · QHUMA educational AI")}
          </p>
        </div>
        {step === "result" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep("config")}
              className="text-[11px] text-text-secondary border border-card-border rounded-xl px-3 py-2 hover:border-accent-text/30 transition-all cursor-pointer"
            >
              {lbl("Nueva configuración", "New configuration")}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-background border border-card-border text-text-secondary text-[11px] font-medium px-3 py-2 rounded-xl cursor-pointer hover:border-accent-text/30 transition-all"
            >
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
              {copied ? lbl("¡Copiado!", "Copied!") : lbl("Copiar proyecto", "Copy project")}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="flex items-center gap-1.5 bg-sidebar text-accent text-[11px] font-bold px-3 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50"
            >
              <RotateCcw size={13} className={generating ? "animate-spin" : ""} />
              {lbl("Regenerar", "Regenerate")}
            </button>
          </div>
        )}
      </div>

      {step === "config" ? (
        <div className="grid grid-cols-3 gap-5">
          {/* Config panel */}
          <div className="col-span-2 space-y-5">
            {/* Context / subject */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <label className="block text-[12px] font-semibold text-text-primary mb-2">
                {lbl("Contexto o área de conocimiento", "Context or area of knowledge")}
              </label>
              <textarea
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={lbl("Ej: Economía local, emprendimiento, turismo, tecnología, medio ambiente…", "E.g.: Local economy, entrepreneurship, tourism, technology, environment…")}
                rows={3}
                className="w-full text-[12px] text-text-primary bg-background rounded-xl border border-card-border px-3 py-2.5 outline-none focus:border-accent-text/50 resize-none placeholder:text-text-muted"
              />
            </div>

            {/* Duration */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <label className="block text-[12px] font-semibold text-text-primary mb-3">
                {lbl("Duración del proyecto", "Project duration")}
              </label>
              <div className="flex gap-2">
                {["3", "4", "5", "6", "8"].map((w) => (
                  <button
                    key={w}
                    onClick={() => setDuration(w)}
                    className={`flex-1 py-2 rounded-xl text-[11px] font-semibold cursor-pointer transition-all ${
                      duration === w
                        ? "bg-sidebar text-accent"
                        : "bg-background text-text-secondary hover:bg-accent-light"
                    }`}
                  >
                    {w} {lbl("sem.", "wks.")}
                  </button>
                ))}
              </div>
            </div>

            {/* Competencies */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <label className="block text-[12px] font-semibold text-text-primary mb-3">
                {lbl("Competencias prioritarias LOMLOE", "Priority LOMLOE competencies")}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COMPS.map((c) => {
                  const sel = selectedComps.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleComp(c)}
                      className={`p-2.5 rounded-xl text-left cursor-pointer transition-all border ${
                        sel
                          ? "bg-accent-light border-accent-text/30"
                          : "bg-background border-card-border hover:border-accent-text/20"
                      }`}
                    >
                      <span className={`text-[11px] font-bold block ${sel ? "text-accent-text" : "text-text-secondary"}`}>{c}</span>
                      <span className="text-[9px] text-text-muted leading-tight block mt-0.5">{compFull[c]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preview / hints */}
          <div className="space-y-4">
            <div className="bg-accent-light rounded-2xl border border-accent-text/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={13} className="text-accent-text" />
                <span className="text-[11px] font-bold text-accent-text">Metodología QHUMA</span>
              </div>
              <p className="text-[11px] text-accent-text leading-relaxed">
                {lbl(
                  "Los proyectos generados siguen el marco pedagógico de QHUMA: aprendizaje basado en retos reales, evaluación competencial LOMLOE y conexión con el mundo laboral.",
                  "Generated projects follow the QHUMA pedagogical framework: real-world challenge-based learning, LOMLOE competency assessment and connection to the professional world."
                )}
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-card-border p-4 space-y-3">
              {[
                { icon: Target, text: lbl("Proyectos conectados a retos locales reales", "Projects connected to real local challenges") },
                { icon: Clock, text: lbl("Fases ajustadas al calendario escolar", "Phases aligned to the school calendar") },
                { icon: Users, text: lbl("Rol del estudiante como protagonista activo", "Student as active protagonist") },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon size={12} className="text-accent-text mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] text-text-secondary leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || selectedComps.length === 0}
              className="w-full bg-sidebar text-accent font-bold text-[13px] py-3.5 rounded-2xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Sparkles size={15} className="animate-pulse" />
                  {lbl("Generando…", "Generating…")}
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  {lbl("Generar proyecto", "Generate project")}
                  <ChevronRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Result view */
        result && (
          <div className="grid grid-cols-3 gap-5">
            {/* Main project card */}
            <div className="col-span-2 space-y-4">
              {/* Title */}
              <div className={`bg-card rounded-2xl border border-card-border p-5 ${generating ? "opacity-50 pointer-events-none" : ""}`}>
                {generating && (
                  <div className="text-[11px] text-accent-text font-semibold mb-3 flex items-center gap-1.5">
                    <Sparkles size={12} className="animate-pulse" /> {lbl("Regenerando…", "Regenerating…")}
                  </div>
                )}
                <div className="flex gap-2 mb-2">
                  {result.competencies.map((c) => (
                    <span key={c} className="text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                  <span className="text-[9px] font-bold bg-background text-text-muted px-2 py-0.5 rounded-full ml-auto">{result.duration}</span>
                </div>
                <h2 className="text-[20px] font-black text-text-primary mb-1">{result.title}</h2>
                <p className="text-[13px] text-text-secondary mb-3">{result.subtitle}</p>
                <p className="text-[12px] text-text-secondary leading-relaxed bg-background rounded-xl p-3">{result.context}</p>
              </div>

              {/* Phases */}
              <div className="bg-card rounded-2xl border border-card-border p-5">
                <h3 className="text-[13px] font-bold text-text-primary mb-3">{lbl("Fases del proyecto", "Project phases")}</h3>
                <div className="space-y-3">
                  {result.phases.map((p, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-sidebar text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[12px] font-semibold text-text-primary">{p.name}</span>
                          <span className="text-[9px] text-text-muted">{p.duration}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-card rounded-2xl border border-card-border p-5">
                <h3 className="text-[13px] font-bold text-text-primary mb-3">{lbl("Entregables", "Deliverables")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {result.deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 bg-background rounded-xl px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-text flex-shrink-0 mt-1.5" />
                      <span className="text-[11px] text-text-secondary">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: evaluation + real world */}
            <div className="space-y-4">
              {/* Evaluation */}
              <div className="bg-card rounded-2xl border border-card-border p-4">
                <h3 className="text-[12px] font-bold text-text-primary mb-3">{lbl("Criterios de evaluación", "Assessment criteria")}</h3>
                <div className="space-y-3">
                  {result.evaluationCriteria.map((ec, i) => (
                    <div key={i} className="bg-accent-light rounded-xl p-3">
                      <span className="text-[9px] font-bold text-accent-text bg-accent px-2 py-0.5 rounded-full inline-block mb-1.5">{ec.comp}</span>
                      <p className="text-[10px] text-accent-text leading-relaxed">{ec.descriptor}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real world */}
              <div className="bg-success-light rounded-2xl border border-card-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={12} className="text-success" />
                  <span className="text-[11px] font-bold text-success">{lbl("Impacto real", "Real-world impact")}</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">{result.realWorldConnection}</p>
              </div>

              {/* QHUMA Capital */}
              {result.qhumaCapital && (
                <div className="bg-warning-light rounded-2xl border border-card-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-warning" />
                    <span className="text-[11px] font-bold text-text-primary">QHUMA Capital</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{result.qhumaCapital}</p>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
