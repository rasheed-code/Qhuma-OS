"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic, Timer, ChevronRight, ChevronLeft, Star, Target,
  MessageSquare, BarChart3, Lightbulb, CheckCircle2, Play, Pause, RotateCcw,
  Users, TrendingUp, AlertCircle,
} from "lucide-react";

interface PitchSection {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Mic;
  placeholder: string;
  tips: string[];
  wordTarget: number; // words expected spoken (reference)
  durationSeg: number; // seconds
}

const pitchSections: PitchSection[] = [
  {
    id: "problema",
    title: "El Problema",
    subtitle: "¿Qué problema real estás resolviendo?",
    icon: AlertCircle,
    placeholder: "Describe el problema que identificaste. ¿Quién lo sufre? ¿Con qué frecuencia? ¿Cuánto les cuesta no resolverlo?\n\nEj: «En Málaga hay 3.200 pisos en alquiler vacacional pero solo el 18% supera el 65% de ocupación. Los propietarios no saben cómo optimizar precios ni su anuncio...»",
    tips: [
      "Empieza con un dato concreto — los números dan credibilidad",
      "Habla en primera persona: «Descubrí que...»",
      "El problema debe resonar en los primeros 15 segundos",
    ],
    wordTarget: 80,
    durationSeg: 60,
  },
  {
    id: "solucion",
    title: "La Solución",
    subtitle: "¿Qué propones exactamente?",
    icon: Lightbulb,
    placeholder: "Explica tu solución de forma clara y simple. Si tu abuela no lo entendería, simplifica.\n\nEj: «Mi propuesta es un sistema de gestión Airbnb para familias locales: anuncio optimizado, guía de precios dinámica y comunicación profesional con huéspedes. Todo por menos de 200€/mes...»",
    tips: [
      "La solución en 1 frase antes de los detalles",
      "Menciona qué la hace diferente a lo que ya existe",
      "Cuantifica el beneficio si puedes: «Sube el ingreso un X%»",
    ],
    wordTarget: 80,
    durationSeg: 60,
  },
  {
    id: "mercado",
    title: "El Mercado",
    subtitle: "¿Quién es tu cliente y cuánto vale el mercado?",
    icon: Users,
    placeholder: "Define tu cliente ideal y el tamaño del mercado potencial.\n\nEj: «Mi cliente ideal son familias malagueñas con un piso en el centro histórico que quieren ingresar entre 800€ y 2.000€/mes sin complicaciones. Solo en Málaga hay 4.500 perfiles así...»",
    tips: [
      "Sé específico: «Familias de 35-50 años en Málaga» no «todo el mundo»",
      "Usa datos del INE o Airbnb para validar el tamaño",
      "Calcula ingresos posibles: precio × clientes × % conversión",
    ],
    wordTarget: 70,
    durationSeg: 50,
  },
  {
    id: "financiero",
    title: "Modelo Financiero",
    subtitle: "¿Cómo ganas dinero? ¿Es sostenible?",
    icon: TrendingUp,
    placeholder: "Explica cómo monetizas, tu punto de equilibrio y proyección a 12 meses.\n\nEj: «Cobro 150€/mes por piso gestionado. Con 20 pisos alcanza el punto de equilibrio. En 12 meses proyecto 30 pisos activos = 4.500€/mes de ingresos recurrentes. Coste marginal por nuevo cliente: 20€...»",
    tips: [
      "Menciona el punto de equilibrio — muestra que sabes cuándo ganas",
      "Distingue ingresos de ganancias: los inversores saben la diferencia",
      "Sé honesto con los márgenes — la credibilidad vale más que las cifras infladas",
    ],
    wordTarget: 80,
    durationSeg: 60,
  },
  {
    id: "equipo",
    title: "Equipo y Próximos Pasos",
    subtitle: "¿Quiénes sois y qué necesitáis para crecer?",
    icon: Star,
    placeholder: "Preséntate y explica qué necesitas para dar el siguiente paso.\n\nEj: «Soy Lucas García, estudiante de 1º ESO en QHUMA. Llevo 3 semanas construyendo este proyecto. Necesito 500€ para lanzar los primeros 3 pisos piloto y validar el modelo antes de escalar...»",
    tips: [
      "Conecta tu experiencia con por qué puedes resolver este problema",
      "Sé específico con el uso del dinero: «500€ para X, Y, Z»",
      "Termina con una pregunta o llamada a la acción clara",
    ],
    wordTarget: 60,
    durationSeg: 40,
  },
];

interface FeedbackScore {
  categoria: string;
  score: number;
  comentario: string;
  mejora: string;
}

const generateFeedback = (sections: Record<string, string>): FeedbackScore[] => {
  const totalWords = Object.values(sections).join(" ").split(/\s+/).filter(Boolean).length;
  const filledSections = Object.values(sections).filter(s => s.trim().length > 30).length;

  const estructuraScore = Math.min(100, Math.round((filledSections / 5) * 80 + 20));
  const claridadScore = Math.min(100, Math.round(totalWords > 100 ? 70 + Math.min(30, (totalWords - 100) / 5) : totalWords * 0.7));
  const persuasionScore = Math.min(100, Math.round(
    (sections.problema?.length > 50 ? 20 : 0) +
    (sections.financiero?.includes("€") ? 25 : 0) +
    (sections.mercado?.match(/\d/) ? 20 : 0) +
    (sections.equipo?.length > 30 ? 20 : 0) +
    15
  ));

  return [
    {
      categoria: "Estructura",
      score: estructuraScore,
      comentario: filledSections === 5
        ? "Cubre todas las secciones clave. Un pitch completo."
        : `Has completado ${filledSections}/5 secciones. Trabaja las que faltan.`,
      mejora: filledSections < 5
        ? "Completa las secciones vacías — especialmente el modelo financiero."
        : "Asegúrate de que cada sección fluye hacia la siguiente de forma natural.",
    },
    {
      categoria: "Claridad",
      score: claridadScore,
      comentario: totalWords > 150
        ? "Buen nivel de detalle. Recuerda que en el pitch real debes hablar, no leer."
        : "El pitch es conciso. Asegúrate de no perder información clave por brevedad.",
      mejora: "Practica en voz alta y cronométrate. 5 minutos = ~650 palabras habladas.",
    },
    {
      categoria: "Persuasión",
      score: persuasionScore,
      comentario: sections.financiero?.includes("€")
        ? "Bien: usas cifras financieras concretas. Los inversores lo valoran."
        : "Añade más datos cuantitativos — cifras específicas generan confianza.",
      mejora: "Incluye al menos 3 datos numéricos: tamaño de mercado, proyección de ingresos, punto de equilibrio.",
    },
  ];
};

function TimerBlock({ totalSecs, onComplete }: { totalSecs: number; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(totalSecs);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      ref.current = setInterval(() => setRemaining(r => r - 1), 1000);
    } else if (remaining === 0) {
      setRunning(false);
      onComplete();
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, remaining, onComplete]);

  const pct = Math.round((remaining / totalSecs) * 100);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const color = remaining > totalSecs * 0.5 ? "bg-success" : remaining > totalSecs * 0.2 ? "bg-warning" : "bg-urgent";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[13px] font-bold text-text-primary tabular-nums w-10 text-right">
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
      <button
        onClick={() => setRunning(r => !r)}
        className="w-7 h-7 rounded-full bg-sidebar text-accent flex items-center justify-center cursor-pointer hover:brightness-110 transition-all flex-shrink-0"
      >
        {running ? <Pause size={11} /> : <Play size={11} />}
      </button>
      <button
        onClick={() => { setRemaining(totalSecs); setRunning(false); }}
        className="w-7 h-7 rounded-full bg-background border border-card-border flex items-center justify-center cursor-pointer hover:bg-accent-light transition-all flex-shrink-0"
      >
        <RotateCcw size={11} className="text-text-muted" />
      </button>
    </div>
  );
}

export default function PitchLab() {
  const [activeSection, setActiveSection] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"write" | "feedback">("write");
  const [feedback, setFeedback] = useState<FeedbackScore[] | null>(null);
  const [timerDone, setTimerDone] = useState(false);

  const current = pitchSections[activeSection];
  const totalWords = Object.values(notes).join(" ").split(/\s+/).filter(Boolean).length;
  const filledCount = pitchSections.filter(s => (notes[s.id] || "").trim().length > 10).length;

  const handleSimulate = () => {
    const fb = generateFeedback(notes);
    setFeedback(fb);
    setMode("feedback");
  };

  const avgScore = feedback ? Math.round(feedback.reduce((s, f) => s + f.score, 0) / feedback.length) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mic size={18} className="text-accent-text" />
            <h1 className="text-[22px] font-bold text-text-primary">Pitch Lab</h1>
          </div>
          <p className="text-[13px] text-text-secondary">
            Practica tu presentación para el Demo Day · Proyecto Airbnb Málaga
          </p>
        </div>
        <div className="flex items-center gap-3">
          {mode === "write" && (
            <>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <BarChart3 size={12} />
                <span>{filledCount}/5 secciones</span>
                <span>·</span>
                <span>~{totalWords} palabras</span>
              </div>
              <button
                onClick={handleSimulate}
                className="flex items-center gap-2 bg-sidebar text-accent font-bold text-[12px] px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all"
              >
                <Users size={14} />
                Simular audiencia
              </button>
            </>
          )}
          {mode === "feedback" && (
            <button
              onClick={() => setMode("write")}
              className="text-[11px] text-text-secondary border border-card-border rounded-xl px-3 py-2 hover:border-accent-text/30 transition-all cursor-pointer"
            >
              ← Seguir editando
            </button>
          )}
        </div>
      </div>

      {mode === "write" ? (
        <div className="grid grid-cols-4 gap-4">
          {/* Section nav */}
          <div className="col-span-1 space-y-1.5">
            {pitchSections.map((s, idx) => {
              const filled = (notes[s.id] || "").trim().length > 10;
              const isActive = idx === activeSection;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(idx)}
                  className={`w-full text-left px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-sidebar border-sidebar text-white"
                      : "bg-card border-card-border hover:border-accent-text/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={13} className={isActive ? "text-accent" : filled ? "text-success" : "text-text-muted"} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-[11px] font-semibold block ${isActive ? "text-white" : "text-text-primary"}`}>
                        {s.title}
                      </span>
                      <span className={`text-[9px] ${isActive ? "text-white/60" : "text-text-muted"}`}>
                        {s.durationSeg}s · {s.wordTarget}p aprox.
                      </span>
                    </div>
                    {filled && !isActive && (
                      <CheckCircle2 size={12} className="text-success flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Progress */}
            <div className="bg-accent-light rounded-xl border border-accent-text/20 p-3 mt-3">
              <p className="text-[10px] font-bold text-accent-text mb-1.5">Progreso total</p>
              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-accent-text rounded-full" style={{ width: `${(filledCount / 5) * 100}%` }} />
              </div>
              <p className="text-[9px] text-accent-text">{filledCount}/5 secciones · ~{Math.round(totalWords / 130)} min</p>
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-3 space-y-4">
            {/* Section header */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <current.icon size={16} className="text-accent-text" />
                    <h2 className="text-[17px] font-bold text-text-primary">{current.title}</h2>
                    <span className="text-[9px] text-text-muted bg-background px-2 py-0.5 rounded-full">
                      Sección {activeSection + 1} de 5
                    </span>
                  </div>
                  <p className="text-[12px] text-text-secondary">{current.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                    disabled={activeSection === 0}
                    className="w-8 h-8 rounded-xl bg-background border border-card-border flex items-center justify-center cursor-pointer hover:bg-accent-light disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={14} className="text-text-muted" />
                  </button>
                  <button
                    onClick={() => setActiveSection(Math.min(pitchSections.length - 1, activeSection + 1))}
                    disabled={activeSection === pitchSections.length - 1}
                    className="w-8 h-8 rounded-xl bg-background border border-card-border flex items-center justify-center cursor-pointer hover:bg-accent-light disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={14} className="text-text-muted" />
                  </button>
                </div>
              </div>

              {/* Timer */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer size={12} className="text-text-muted" />
                  <span className="text-[10px] text-text-muted font-medium">
                    Tiempo asignado para esta sección: {current.durationSeg}s
                  </span>
                  {timerDone && <span className="text-[9px] text-warning font-bold bg-warning-light px-2 py-0.5 rounded-full">¡Tiempo!</span>}
                </div>
                <TimerBlock
                  key={current.id}
                  totalSecs={current.durationSeg}
                  onComplete={() => setTimerDone(true)}
                />
              </div>

              {/* Notes textarea */}
              <textarea
                value={notes[current.id] || ""}
                onChange={(e) => {
                  setTimerDone(false);
                  setNotes(prev => ({ ...prev, [current.id]: e.target.value }));
                }}
                placeholder={current.placeholder}
                rows={8}
                className="w-full text-[12px] text-text-primary bg-background rounded-xl border border-card-border px-4 py-3 outline-none focus:border-accent-text/40 resize-none placeholder:text-text-muted leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-text-muted">
                  {(notes[current.id] || "").split(/\s+/).filter(Boolean).length} palabras
                  · objetivo ~{current.wordTarget}
                </span>
                {activeSection < pitchSections.length - 1 && (
                  <button
                    onClick={() => setActiveSection(activeSection + 1)}
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-accent-text hover:underline cursor-pointer"
                  >
                    Siguiente sección <ChevronRight size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-accent-light rounded-2xl border border-accent-text/20 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <Lightbulb size={13} className="text-accent-text" />
                <span className="text-[11px] font-bold text-accent-text">Consejos para esta sección</span>
              </div>
              <ul className="space-y-1.5">
                {current.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-text flex-shrink-0 mt-1.5" />
                    <span className="text-[11px] text-accent-text leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Feedback mode */
        feedback && (
          <div className="grid grid-cols-3 gap-5">
            {/* Main score */}
            <div className="col-span-3 bg-sidebar rounded-2xl p-6 flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-accent flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[28px] font-black text-accent block leading-none">{avgScore}</span>
                    <span className="text-[9px] text-white/60">/ 100</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users size={14} className="text-accent" />
                  <span className="text-[12px] text-white/70 font-medium uppercase tracking-widest">Simulacro de audiencia completado</span>
                </div>
                <h2 className="text-[22px] font-bold text-white mb-1">
                  {avgScore >= 80 ? "¡Pitch sólido! Estás listo." : avgScore >= 60 ? "Buen avance. Perfina estos puntos." : "Necesita más trabajo. ¡Tú puedes!"}
                </h2>
                <p className="text-[12px] text-white/60">
                  {filledCount}/5 secciones completadas · {totalWords} palabras (~{Math.round(totalWords / 130)} min de pitch)
                </p>
              </div>
              <div className="ml-auto flex gap-3">
                <button
                  onClick={() => { setMode("write"); setFeedback(null); }}
                  className="flex items-center gap-1.5 border border-white/20 text-white text-[11px] font-semibold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
                >
                  <RotateCcw size={13} />
                  Volver a practicar
                </button>
              </div>
            </div>

            {/* Category scores */}
            {feedback.map((fb, i) => (
              <div key={i} className="bg-card rounded-2xl border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-accent-text" />
                    <span className="text-[13px] font-bold text-text-primary">{fb.categoria}</span>
                  </div>
                  <span className={`text-[18px] font-black ${fb.score >= 80 ? "text-success" : fb.score >= 60 ? "text-warning" : "text-urgent"}`}>
                    {fb.score}
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${fb.score >= 80 ? "bg-success" : fb.score >= 60 ? "bg-warning" : "bg-urgent"}`}
                    style={{ width: `${fb.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed mb-2">{fb.comentario}</p>
                <div className="bg-accent-light rounded-xl px-3 py-2">
                  <div className="flex items-start gap-1.5">
                    <Lightbulb size={11} className="text-accent-text flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-accent-text leading-relaxed">{fb.mejora}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Mentor message */}
            <div className="col-span-3 bg-accent-light rounded-2xl border border-accent-text/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-accent-text" />
                <span className="text-[12px] font-bold text-accent-text">Nota de la Profa. Ana</span>
              </div>
              <p className="text-[12px] text-accent-text leading-relaxed">
                {avgScore >= 80
                  ? "Lucas, este pitch tiene madera. El modelo financiero está bien fundamentado y el problema que presentas es real y local. Ahora practica diciéndolo en voz alta sin leer, cronométrate, y hazlo con alguien que te interrumpa con preguntas. Eso es lo que pasará el viernes."
                  : avgScore >= 60
                  ? "Vas bien encaminado. Tu sección de problema es fuerte — la gente se va a identificar. Lo que necesitas reforzar es el modelo financiero: un inversor siempre preguntará '¿cuándo recupero mi dinero?' y tienes que tener esa respuesta en dos frases."
                  : "Todavía hay trabajo por hacer, y eso está bien — tienes tiempo. Empieza por la sección del problema: describe una situación específica que hayas vivido o investigado. Los datos reales del INE o Airbnb son tus aliados. Vuelve cuando tengas eso y lo revisamos juntos."}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
