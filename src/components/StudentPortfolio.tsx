"use client";

import { useState } from "react";
import { BookOpen, TrendingUp, FileText, Star, ChevronRight, Award, Lightbulb, MessageSquare, AlertCircle, ChevronDown, ChevronUp, RefreshCw, Sparkles } from "lucide-react";

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

const compProgress: Record<CompKey, { before: number; after: number }> = {
  CLC:   { before: 45, after: 72 },
  CPL:   { before: 40, after: 58 },
  STEM:  { before: 60, after: 85 },
  CD:    { before: 55, after: 88 },
  CPSAA: { before: 50, after: 74 },
  CC:    { before: 48, after: 68 },
  CE:    { before: 52, after: 90 },
  CCEC:  { before: 35, after: 55 },
};

const narrativeBlocks = [
  {
    week: "Semana 1",
    phase: "Investigación",
    title: "Descubriendo el mercado de alquiler vacacional",
    body: "Empecé sin saber nada sobre Airbnb. Investigué los precios en Málaga, aprendí a leer datos de ocupación y entendí por qué la localización lo es todo. El mayor reto fue organizar tanta información: creé mi primera hoja de cálculo real.",
    competencies: ["CD", "CLC", "STEM"] as CompKey[],
    evidence: "Análisis de mercado · Hoja de cálculo",
    reflection: "Aprendí que los datos cuentan historias si sabes leerlos.",
  },
  {
    week: "Semana 2",
    phase: "Diseño",
    title: "Diseñando la experiencia del huésped",
    body: "Con los datos en mano, decidí que me centraría en el segmento familiar. Diseñé la distribución del piso, la guía de bienvenida y el branding. Tuve que hacer tres versiones del logo hasta encontrar una que me convenciera.",
    competencies: ["CCEC", "CE", "CLC"] as CompKey[],
    evidence: "Brand board · Plano de distribución",
    reflection: "Diseñar para otros te obliga a ponerte en su lugar.",
  },
  {
    week: "Semana 3",
    phase: "Implementación",
    title: "Construyendo el anuncio y la estrategia de precios",
    body: "Redacté el anuncio en español e inglés y diseñé una infografía con las reglas de la casa. Usé una fórmula de precios dinámicos según temporada. Mi profe me desafió a calcular el punto de equilibrio: tardé dos días pero lo conseguí.",
    competencies: ["CLC", "CPL", "STEM", "CE"] as CompKey[],
    evidence: "Anuncio bilingüe · Modelo financiero",
    reflection: "El dinero real asusta al principio, pero te da claridad.",
  },
  {
    week: "Semana 4",
    phase: "Presentación",
    title: "Preparando el Demo Day",
    body: "Preparé un pitch de 5 minutos para inversores reales. Ensayé 8 veces. El primer intento fue un desastre, el octavo fue fluido. Mis compañeros me dieron feedback y lo incorporé. Aprendí que la práctica no te hace perfecto, pero te da confianza.",
    competencies: ["CLC", "CPSAA", "CE", "CC"] as CompKey[],
    evidence: "Presentación final · Video del pitch",
    reflection: "Hablar en público ya no me aterra. Eso vale más que el proyecto.",
  },
];

const compColor = (key: CompKey) => {
  const colors: Record<CompKey, string> = {
    CLC: "bg-accent-light text-accent-text",
    CPL: "bg-warning-light text-text-primary",
    STEM: "bg-success-light text-success",
    CD: "bg-accent-light text-accent-text",
    CPSAA: "bg-warning-light text-text-primary",
    CC: "bg-success-light text-success",
    CE: "bg-urgent-light text-urgent",
    CCEC: "bg-accent-light text-accent-text",
  };
  return colors[key];
};

interface ErrorEntry {
  id: string;
  date: string;
  title: string;
  phase: string;
  competency: CompKey;
  asumí: string;
  falló: string;
  cambiaría: string;
  resolved: boolean;
}

const errorLog: ErrorEntry[] = [
  {
    id: "e1",
    date: "Semana 1 · Lunes",
    title: "Precios incorrectos en el análisis de mercado",
    phase: "Investigación",
    competency: "STEM",
    asumí: "Que los precios de Airbnb eran fijos todo el año, sin variación por temporada.",
    falló: "Los datos del INE mostraban variaciones del 40% entre temporada alta y baja. Mi modelo financiero inicial era completamente incorrecto.",
    cambiaría: "Buscar siempre datos históricos de al menos 12 meses antes de asumir medias. Preguntar: ¿qué factores externos podrían cambiar este dato?",
    resolved: true,
  },
  {
    id: "e2",
    date: "Semana 2 · Miércoles",
    title: "Logo del brand board no encajaba con el público objetivo",
    phase: "Diseño",
    competency: "CCEC",
    asumí: "Que un diseño moderno y minimalista funcionaría para cualquier segmento de viajeros.",
    falló: "Mi tutora señaló que el segmento familiar que había elegido espera calidez visual, no frialdad corporativa. El logo no comunicaba lo correcto.",
    cambiaría: "Definir primero al cliente ideal con detalle antes de cualquier decisión visual. Hacer al menos 2 versiones para targets diferentes antes de elegir.",
    resolved: true,
  },
  {
    id: "e3",
    date: "Semana 3 · Jueves",
    title: "El punto de equilibrio calculado era demasiado optimista",
    phase: "Modelo financiero",
    competency: "CE",
    asumí: "Que tendría ocupación del 80% todo el año desde el primer mes.",
    falló: "Ignoré la curva de aprendizaje: un nuevo anuncio tarda 2-3 meses en ganar valoraciones y visibilidad. Mi modelo mostraba rentabilidad inmediata que no era realista.",
    cambiaría: "Modelar siempre un escenario conservador (40% ocupación), uno realista (65%) y uno optimista (85%). Nunca solo el optimista.",
    resolved: false,
  },
];

export default function StudentPortfolio() {
  const [activeComp, setActiveComp] = useState<CompKey | null>(null);
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set(["e1"]));
  const [narrativaIA, setNarrativaIA] = useState<string | null>(null);
  const [isGenerandoNarrativa, setIsGenerandoNarrativa] = useState(false);

  const handleRegenerarNarrativa = async () => {
    setIsGenerandoNarrativa(true);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "narrativa",
          message: "Genera un párrafo narrativo de aprendizaje para el portfolio de Lucas García en el Proyecto Airbnb Málaga. Incluye su evolución en CE y STEM, el error del punto de equilibrio que superó, y cómo cambió su forma de pensar sobre los datos.",
          history: [],
        }),
      });
      const data = await res.json();
      setNarrativaIA(data.reply ?? null);
    } catch {
      setNarrativaIA("Hubo un error al conectar con la IA. Inténtalo de nuevo en unos segundos.");
    } finally {
      setIsGenerandoNarrativa(false);
    }
  };

  const toggleError = (id: string) => {
    setExpandedErrors(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // C9 — ErrorLog IA reflexión
  const [iaReflexiones, setIaReflexiones] = useState<Record<string, string>>({});
  const [loadingReflexion, setLoadingReflexion] = useState<string | null>(null);

  const handleAnalizarError = async (entry: ErrorEntry) => {
    if (loadingReflexion) return;
    setLoadingReflexion(entry.id);
    try {
      const prompt = `Error registrado por Lucas García:\nTítulo: ${entry.title}\nFase: ${entry.phase}\nCompetencia: ${entry.competency}\n¿Qué asumí?: ${entry.asumí}\n¿Dónde falló?: ${entry.falló}\n¿Qué cambiaría?: ${entry.cambiaría}`;
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "errorlog", message: prompt, history: [] }),
      });
      const data = await res.json();
      setIaReflexiones(prev => ({ ...prev, [entry.id]: data.reply ?? "" }));
    } catch {
      setIaReflexiones(prev => ({ ...prev, [entry.id]: "Error al conectar con la IA. Inténtalo de nuevo." }));
    } finally {
      setLoadingReflexion(null);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Left column — narrative */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} className="text-accent-text" />
          <h1 className="text-[22px] font-bold text-text-primary">Mi Portfolio</h1>
          <button
            onClick={handleRegenerarNarrativa}
            disabled={isGenerandoNarrativa}
            className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-accent-text bg-accent-light border border-accent/30 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={11} className={isGenerandoNarrativa ? "animate-spin" : ""} />
            {isGenerandoNarrativa ? "Generando..." : "Regenerar narrativa IA"}
          </button>
        </div>
        <p className="text-[13px] text-text-secondary mb-4">
          Narrativa de aprendizaje · Proyecto Airbnb Málaga · Lucas García · 1º ESO
        </p>

        {/* C6: Narrativa generada por IA */}
        {narrativaIA && (
          <div className="bg-sidebar rounded-2xl p-5 mb-5 relative overflow-hidden">
            <div className="absolute top-3 right-4 opacity-10">
              <MessageSquare size={40} className="text-accent" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-accent text-[9px] font-bold">IA</span>
              </div>
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">Narrativa generada por Prof. Ana</span>
              <button
                onClick={() => setNarrativaIA(null)}
                className="ml-auto text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                <span className="text-[10px]">✕</span>
              </button>
            </div>
            <p className="text-[13px] text-white/90 leading-relaxed italic">{narrativaIA}</p>
            <p className="text-[9px] text-white/30 mt-3 text-right">Generado por Gemini · {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        )}

        {/* Competency growth overview */}
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-accent-text" />
            <span className="text-[13px] font-semibold text-text-primary">Crecimiento en competencias</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {COMPS.map((c) => {
              const { before, after } = compProgress[c];
              const gain = after - before;
              const isActive = activeComp === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveComp(isActive ? null : c)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? "border-accent-text bg-accent-light"
                      : "border-card-border bg-background hover:border-accent-text/30"
                  }`}
                >
                  <div className="text-[10px] font-bold text-text-secondary mb-1">{c}</div>
                  <div className="text-[11px] text-text-muted mb-2 truncate">{compFull[c]}</div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-card rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${after}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-text-muted">{before}%→{after}%</span>
                    <span className="text-[9px] font-bold text-success">+{gain}%</span>
                  </div>
                </button>
              );
            })}
          </div>
          {activeComp && (
            <div className="mt-3 bg-accent-light border border-accent-text/20 rounded-xl p-3">
              <p className="text-[12px] font-semibold text-accent-text mb-0.5">{compFull[activeComp]}</p>
              <p className="text-[11px] text-text-secondary">
                Pasaste de {compProgress[activeComp].before}% a {compProgress[activeComp].after}% a lo largo del proyecto.
                Ganancia neta: <span className="font-bold text-success">+{compProgress[activeComp].after - compProgress[activeComp].before}%</span>
              </p>
            </div>
          )}
        </div>

        {/* Weekly narrative blocks */}
        <div className="space-y-4">
          {narrativeBlocks.map((block, idx) => (
            <div key={idx} className="bg-card rounded-2xl border border-card-border p-5">
              {/* Week tag + phase */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-bold bg-sidebar text-accent px-2 py-0.5 rounded-full">
                  {block.week}
                </span>
                <span className="text-[10px] text-text-muted font-medium">{block.phase}</span>
                <ChevronRight size={10} className="text-text-muted" />
                <div className="flex gap-1">
                  {block.competencies.map((c) => (
                    <span key={c} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${compColor(c)}`}>{c}</span>
                  ))}
                </div>
              </div>

              <h3 className="text-[14px] font-bold text-text-primary mb-2">{block.title}</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed mb-3">{block.body}</p>

              {/* Evidence */}
              <div className="flex items-center gap-1.5 mb-3">
                <FileText size={11} className="text-text-muted" />
                <span className="text-[10px] text-text-muted">{block.evidence}</span>
              </div>

              {/* Reflection */}
              <div className="bg-accent-light rounded-xl px-3 py-2.5 flex items-start gap-2">
                <Lightbulb size={12} className="text-accent-text flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-accent-text italic leading-relaxed">{block.reflection}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Error Log — culture.md Bloque 1 */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={15} className="text-urgent" />
            <h2 className="text-[16px] font-bold text-text-primary">Historial de errores aprendidos</h2>
            <span className="text-[10px] bg-urgent-light text-urgent font-bold px-2 py-0.5 rounded-full ml-auto">
              {errorLog.filter(e => !e.resolved).length} pendiente de resolver
            </span>
          </div>
          <p className="text-[11px] text-text-muted mb-3 leading-relaxed">
            Cada error es una evidencia de pensamiento iterativo. No se penaliza — se analiza. Forma parte de tu portfolio oficial.
          </p>
          <div className="space-y-3">
            {errorLog.map((entry) => {
              const isOpen = expandedErrors.has(entry.id);
              return (
                <div key={entry.id} className={`rounded-2xl border ${entry.resolved ? "border-card-border bg-card" : "border-urgent/20 bg-urgent-light"}`}>
                  <button
                    onClick={() => toggleError(entry.id)}
                    className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${entry.resolved ? "bg-success-light" : "bg-urgent-light border border-urgent/20"}`}>
                      {entry.resolved
                        ? <RefreshCw size={13} className="text-success" />
                        : <AlertCircle size={13} className="text-urgent" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-semibold text-text-primary">{entry.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${compColor(entry.competency)}`}>{entry.competency}</span>
                        {entry.resolved && <span className="text-[9px] text-success font-semibold">✓ Resuelto</span>}
                      </div>
                      <span className="text-[10px] text-text-muted">{entry.date} · {entry.phase}</span>
                    </div>
                    {isOpen ? <ChevronUp size={14} className="text-text-muted flex-shrink-0" /> : <ChevronDown size={14} className="text-text-muted flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-2.5">
                      {[
                        { label: "¿Qué asumí?", value: entry.asumí, color: "text-warning", bg: "bg-warning-light border-warning/20" },
                        { label: "¿Dónde falló?", value: entry.falló, color: "text-urgent", bg: "bg-urgent-light border-urgent/20" },
                        { label: "¿Qué cambiaría?", value: entry.cambiaría, color: "text-accent-text", bg: "bg-accent-light border-accent-text/20" },
                      ].map((item) => (
                        <div key={item.label} className={`rounded-xl border p-3 ${item.bg}`}>
                          <span className={`text-[9px] font-bold uppercase tracking-wide ${item.color} block mb-1`}>{item.label}</span>
                          <p className="text-[11px] text-text-secondary leading-relaxed">{item.value}</p>
                        </div>
                      ))}
                      {/* C9 — IA reflexión */}
                      {iaReflexiones[entry.id] ? (
                        <div className="bg-sidebar/5 rounded-xl border border-sidebar/10 p-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Sparkles size={11} className="text-accent-text" />
                            <span className="text-[9px] font-bold uppercase tracking-wide text-accent-text">Preguntas de reflexión IA</span>
                          </div>
                          <div className="space-y-1.5">
                            {iaReflexiones[entry.id].split("\n").filter(Boolean).map((linea, i) => (
                              <p key={i} className="text-[11px] text-text-secondary leading-relaxed">{linea}</p>
                            ))}
                          </div>
                          <button
                            onClick={() => handleAnalizarError(entry)}
                            disabled={loadingReflexion !== null}
                            className="mt-2 text-[10px] text-accent-text font-semibold hover:underline cursor-pointer disabled:opacity-50"
                          >
                            Regenerar preguntas
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAnalizarError(entry)}
                          disabled={loadingReflexion !== null}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-accent/30 text-accent-text text-[11px] font-semibold hover:bg-accent-light transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingReflexion === entry.id ? (
                            <><RefreshCw size={11} className="animate-spin" />Analizando con IA…</>
                          ) : (
                            <><Sparkles size={11} />Analizar con IA · 3 preguntas de reflexión</>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right column — summary */}
      <div className="w-64 flex-shrink-0 space-y-4">
        {/* Student card */}
        <div className="bg-card rounded-2xl border border-card-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-sidebar text-accent font-bold text-[16px] flex items-center justify-center flex-shrink-0">
              LG
            </div>
            <div>
              <p className="text-[13px] font-bold text-text-primary">Lucas García</p>
              <p className="text-[10px] text-text-muted">1º ESO · 2024–25</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">Proyecto</span>
              <span className="font-semibold text-text-primary">Airbnb Málaga</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">Progreso global</span>
              <span className="font-bold text-success">72%</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">Q-Coins ganadas</span>
              <span className="font-bold text-accent-text">340 QC</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">Racha actual</span>
              <span className="font-bold text-warning">12 días 🔥</span>
            </div>
          </div>
        </div>

        {/* Top competency */}
        <div className="bg-success-light rounded-2xl border border-card-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={13} className="text-success" />
            <span className="text-[11px] font-bold text-success">Mejor competencia</span>
          </div>
          <p className="text-[14px] font-bold text-text-primary mb-0.5">CE — Emprendedora</p>
          <p className="text-[11px] text-text-secondary">Pasaste de 52% a 90% (+38%)</p>
          <div className="h-2 bg-white/60 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-success rounded-full" style={{ width: "90%" }} />
          </div>
        </div>

        {/* Awards */}
        <div className="bg-card rounded-2xl border border-card-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={13} className="text-accent-text" />
            <span className="text-[11px] font-bold text-text-primary">Logros en este proyecto</span>
          </div>
          <div className="space-y-2">
            {[
              { emoji: "🚀", title: "Emprendedor nato", desc: "CE al 90%" },
              { emoji: "💡", title: "Pensador crítico", desc: "3 revisiones profundas" },
              { emoji: "📊", title: "Data analyst", desc: "Hoja de cálculo compleja" },
              { emoji: "🎤", title: "Presentador", desc: "Pitch de 5 min fluido" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[14px]">{a.emoji}</span>
                <div>
                  <p className="text-[10px] font-semibold text-text-primary leading-tight">{a.title}</p>
                  <p className="text-[9px] text-text-muted">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher comment */}
        <div className="bg-accent-light rounded-2xl border border-accent-text/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={12} className="text-accent-text" />
            <span className="text-[11px] font-bold text-accent-text">Nota de la mentora</span>
          </div>
          <p className="text-[11px] text-accent-text leading-relaxed italic">
            "Lucas ha demostrado una capacidad emprendedora excepcional. Su evolución en presentaciones públicas ha sido la mayor sorpresa del trimestre."
          </p>
          <p className="text-[9px] text-text-muted mt-2 text-right">— Prof. Ana Martínez</p>
        </div>
      </div>
    </div>
  );
}
