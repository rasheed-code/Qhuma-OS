"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic, Timer, ChevronRight, ChevronLeft, Star, Target,
  MessageSquare, BarChart3, Lightbulb, CheckCircle2, Play, Pause, RotateCcw,
  Users, TrendingUp, AlertCircle, Sparkles, Loader2, BookOpen, ChevronDown, ChevronUp,
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

interface InversorVoto {
  decision: "si" | "no" | null;
  razon: string | null;
  loading: boolean;
}

const inversoresConfig = [
  {
    id: "conservadora",
    nombre: "Marta Ruiz",
    perfil: "Conservadora",
    capital: 30000,
    avatar: "MR",
    descripcion: "Inversora tradicional — prioriza ROI probado y riesgo controlado",
    umbral: 72,
  },
  {
    id: "moderado",
    nombre: "Javier Torres",
    perfil: "Moderado",
    capital: 75000,
    avatar: "JT",
    descripcion: "Business angel — busca modelo escalable con tracción inicial",
    umbral: 58,
  },
  {
    id: "arriesgada",
    nombre: "Elena López",
    perfil: "Arriesgada",
    capital: 150000,
    avatar: "EL",
    descripcion: "Inversora de riesgo — apuesta por ideas disruptivas con potencial",
    umbral: 40,
  },
];

// C13 — Guión de apoyo por sección
const guionPorSeccion: Record<string, {
  puntos: Array<{ texto: string; clave: boolean }>;
  transicion: string;
}> = {
  problema: {
    puntos: [
      { texto: "3.200 pisos en Airbnb Málaga, pero solo el 18% supera el 65% de ocupación", clave: true },
      { texto: "Los propietarios pierden entre 400€ y 800€/mes por no optimizar su anuncio", clave: true },
      { texto: "Datos confirmados con el INE y AirDNA — 3 días de investigación", clave: false },
      { texto: "Perfil afectado: familias malagueñas con piso en el centro histórico", clave: false },
    ],
    transicion: "«Ahora que sabéis el problema... aquí está la solución que diseñé.»",
  },
  solucion: {
    puntos: [
      { texto: "Casa Limón: servicio de gestión Airbnb completo para propietarios en Málaga", clave: true },
      { texto: "Anuncio optimizado + guía de precios dinámica + atención a huéspedes incluida", clave: false },
      { texto: "Diferencial: no soy una agencia cara — soy un gestor joven, local y digital", clave: true },
      { texto: "Precio: 150€/mes por piso — un 40% menos que la competencia profesional", clave: false },
    ],
    transicion: "«Y el mercado para esta solución es mucho mayor de lo que pensaba...»",
  },
  mercado: {
    puntos: [
      { texto: "4.500 propietarios potenciales en Málaga capital según el INE 2025", clave: true },
      { texto: "1.200 pisos turísticos registrados solo en el Centro Histórico", clave: false },
      { texto: "Mercado potencial año 1: 100 clientes × 150€ = 15.000€/mes", clave: true },
      { texto: "Crecimiento del alquiler vacacional en Málaga: +23% en 2025", clave: false },
    ],
    transicion: "«¿Y los números confirman que esto es viable? Sí. Veamos...»",
  },
  financiero: {
    puntos: [
      { texto: "Punto de equilibrio: 20 pisos gestionados = 3.000€/mes de ingresos", clave: true },
      { texto: "Año 1 proyección conservadora: 30 pisos × 150€ = 4.500€/mes", clave: true },
      { texto: "Coste de captación por cliente: 20€ en marketing y primera visita", clave: false },
      { texto: "Margen neto estimado: 70% — modelo digital, sin oficina física", clave: false },
    ],
    transicion: "«Para llegar aquí necesito un arranque concreto — y eso es lo que os pido.»",
  },
  equipo: {
    puntos: [
      { texto: "Lucas García, 1º ESO QHUMA — 3 semanas construyendo este proyecto", clave: false },
      { texto: "Competencias demostradas: análisis de datos, diseño, comunicación bilingüe", clave: true },
      { texto: "Solicito 500€ para lanzar 3 pisos piloto en el Centro Histórico", clave: true },
      { texto: "Meta a 6 meses: 20 pisos activos, modelo validado, listo para escalar", clave: false },
    ],
    transicion: "«¿Queréis ser parte de este primer paso? Estoy listo para empezar esta semana.»",
  },
};

// C15 — Preguntas del jurado (5 específicas del proyecto Airbnb Málaga)
const preguntasJurado = [
  {
    id: "q1",
    pregunta: "¿Cómo vas a atraer a los primeros 3 propietarios piloto si eres un estudiante de secundaria sin historial de resultados?",
    inversor: "Marta Ruiz",
    avatar: "MR",
    tipo: "tracción",
  },
  {
    id: "q2",
    pregunta: "El mercado de gestión de Airbnb en Málaga ya tiene actores consolidados como Spotahome o Badi. ¿Qué vas a hacer diferente para no ser aplastado?",
    inversor: "Javier Torres",
    avatar: "JT",
    tipo: "competencia",
  },
  {
    id: "q3",
    pregunta: "Si el Ayuntamiento de Málaga limita las nuevas licencias turísticas — algo que ya está en debate — ¿cuál es tu plan B?",
    inversor: "Elena López",
    avatar: "EL",
    tipo: "riesgo",
  },
  {
    id: "q4",
    pregunta: "Dices que puedes gestionar 20 pisos para alcanzar el punto de equilibrio. ¿Cuántas horas semanales te va a costar eso siendo estudiante a tiempo completo?",
    inversor: "Marta Ruiz",
    avatar: "MR",
    tipo: "operacional",
  },
  {
    id: "q5",
    pregunta: "¿Por qué debería invertir 500€ en ti hoy en lugar de esperar a que demuestres tracción con el primer piso piloto sin financiación externa?",
    inversor: "Javier Torres",
    avatar: "JT",
    tipo: "inversión",
  },
];

const tipoColor: Record<string, string> = {
  tracción:    "bg-accent-light text-accent-text",
  competencia: "bg-warning-light text-text-primary",
  riesgo:      "bg-urgent-light text-urgent",
  operacional: "bg-background text-text-muted border border-card-border",
  inversión:   "bg-success-light text-success",
};

// C14 — Puntuación por sección (1–10)
const computeSectionScores = (sections: Record<string, string>): Record<string, number> => {
  const scores: Record<string, number> = {};
  for (const section of pitchSections) {
    const text = sections[section.id] || "";
    const words = text.split(/\s+/).filter(Boolean).length;
    const wordRatio = Math.min(1, words / section.wordTarget);
    let bonus = 0;
    if (section.id === "problema") {
      if (text.match(/\d+%|\d+\.?\d*[kK€]/)) bonus += 2;
      if (/málaga|airbnb|mercado/i.test(text)) bonus += 1;
    } else if (section.id === "solucion") {
      if (/diferent|único|ventaj/i.test(text)) bonus += 2;
      if (text.includes("€")) bonus += 1;
    } else if (section.id === "mercado") {
      if (text.match(/\d+/) && /cliente|mercado|segmento/i.test(text)) bonus += 2;
      if (/málaga|alicant|españa/i.test(text)) bonus += 1;
    } else if (section.id === "financiero") {
      if (text.includes("€") || /equilibrio|ingreso|margen/i.test(text)) bonus += 2;
      if (text.match(/\d+%/)) bonus += 1;
    } else if (section.id === "equipo") {
      if (text.length > 50) bonus += 1;
      if (/necesit|solicito|€|inversion/i.test(text)) bonus += 2;
    }
    scores[section.id] = Math.min(10, Math.max(1, Math.round(wordRatio * 7 + bonus)));
  }
  return scores;
};

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
  const [aiCoach, setAiCoach] = useState<Record<string, string | null>>({});
  const [coachingSection, setCoachingSection] = useState<string | null>(null);
  const [inversoresVotos, setInversoresVotos] = useState<Record<string, InversorVoto>>({});

  // C14 — Puntuación por sección
  const [sectionScores, setSectionScores] = useState<Record<string, number> | null>(null);

  // C15 — Preguntas del jurado
  const [respuestasJurado, setRespuestasJurado] = useState<Record<string, string>>({});
  const [evaluacionesJurado, setEvaluacionesJurado] = useState<Record<string, string | null>>({});
  const [evaluandoJurado, setEvaluandoJurado] = useState<string | null>(null);

  const handleEvaluarRespuesta = async (preguntaId: string) => {
    const respuesta = respuestasJurado[preguntaId] ?? "";
    if (!respuesta.trim() || evaluandoJurado) return;
    const pregunta = preguntasJurado.find((p) => p.id === preguntaId);
    if (!pregunta) return;
    setEvaluandoJurado(preguntaId);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "pitchcoach",
          message: `Soy ${pregunta.inversor}, inversor/a en el pitch de Lucas García (proyecto Airbnb Málaga).\nMi pregunta fue: "${pregunta.pregunta}"\nLa respuesta del alumno es: "${respuesta}"\n\nEvalúa la respuesta en máximo 3 frases: señala lo que funciona, lo que falta y una sugerencia concreta para mejorarla.`,
          history: [],
        }),
      });
      const data = await res.json();
      setEvaluacionesJurado((prev) => ({ ...prev, [preguntaId]: data.reply ?? null }));
    } catch {
      setEvaluacionesJurado((prev) => ({ ...prev, [preguntaId]: "Error al conectar con la IA. Inténtalo de nuevo." }));
    } finally {
      setEvaluandoJurado(null);
    }
  };

  // C13 — Guión de apoyo
  const [guionOpen, setGuionOpen] = useState<Set<string>>(new Set());
  const toggleGuion = (sectionId: string) => {
    setGuionOpen((prev) => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  // C12 — Ensayo cronometrado
  const totalPitchSecs = pitchSections.reduce((sum, s) => sum + s.durationSeg, 0); // 270s
  const sectionCumulative = pitchSections.reduce((acc, s, i) => {
    return [...acc, (acc[i - 1] ?? 0) + s.durationSeg];
  }, [] as number[]);
  const [ensayoMode, setEnsayoMode] = useState(false);
  const [ensayoRunning, setEnsayoRunning] = useState(false);
  const [ensayoElapsed, setEnsayoElapsed] = useState(0);
  const [ensayoCompleted, setEnsayoCompleted] = useState(false);

  useEffect(() => {
    if (!ensayoRunning || ensayoCompleted) return;
    const interval = setInterval(() => {
      setEnsayoElapsed((e) => {
        if (e >= totalPitchSecs - 1) {
          setEnsayoRunning(false);
          setEnsayoCompleted(true);
          return totalPitchSecs;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [ensayoRunning, ensayoCompleted, totalPitchSecs]);

  const currentEnsayoSectionIdx = Math.min(
    sectionCumulative.findIndex((c) => ensayoElapsed < c),
    pitchSections.length - 1
  );
  const currentEnsayoSection = pitchSections[currentEnsayoSectionIdx < 0 ? pitchSections.length - 1 : currentEnsayoSectionIdx];
  const ensayoPct = Math.round((ensayoElapsed / totalPitchSecs) * 100);
  const ensayoMins = Math.floor(ensayoElapsed / 60);
  const ensayoSecs = ensayoElapsed % 60;

  const handleResetEnsayo = () => {
    setEnsayoElapsed(0);
    setEnsayoRunning(false);
    setEnsayoCompleted(false);
  };

  const handlePedirConsejo = async (sectionId: string, texto: string) => {
    if (!texto.trim() || coachingSection) return;
    setCoachingSection(sectionId);
    try {
      const seccion = pitchSections.find(s => s.id === sectionId);
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "pitchcoach",
          message: `Sección: "${seccion?.title}"\n\nTexto del alumno:\n${texto}`,
          history: [],
        }),
      });
      const data = await res.json();
      setAiCoach(prev => ({ ...prev, [sectionId]: data.reply ?? null }));
    } catch {
      setAiCoach(prev => ({ ...prev, [sectionId]: "No he podido conectar ahora mismo. Revisa tu pitch manualmente y vuelve a intentarlo." }));
    } finally {
      setCoachingSection(null);
    }
  };

  const current = pitchSections[activeSection];
  const totalWords = Object.values(notes).join(" ").split(/\s+/).filter(Boolean).length;
  const filledCount = pitchSections.filter(s => (notes[s.id] || "").trim().length > 10).length;

  const handleSimulate = async () => {
    const fb = generateFeedback(notes);
    const avg = Math.round(fb.reduce((s, f) => s + f.score, 0) / fb.length);
    setFeedback(fb);
    setSectionScores(computeSectionScores(notes));
    setMode("feedback");
    setInversoresVotos({});

    // Trigger investor votes sequentially with stagger
    for (let idx = 0; idx < inversoresConfig.length; idx++) {
      const inv = inversoresConfig[idx];
      await new Promise<void>((r) => setTimeout(r, idx * 950 + 600));
      const decision: "si" | "no" = avg >= inv.umbral ? "si" : "no";
      setInversoresVotos((prev) => ({ ...prev, [inv.id]: { decision: null, razon: null, loading: true } }));
      try {
        const res = await fetch("/api/tutor-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "pitchcoach",
            message: `Soy ${inv.nombre}, inversora ${inv.perfil.toLowerCase()}. He evaluado el pitch de Lucas (Airbnb Málaga, puntuación media ${avg}/100, ${filledCount}/5 secciones). Mi decisión es ${decision === "si" ? "INVERTIR" : "NO INVERTIR"}. En máximo 15 palabras, da UNA razón concisa desde mi perspectiva ${inv.perfil.toLowerCase()}.`,
            history: [],
          }),
        });
        const data = await res.json();
        setInversoresVotos((prev) => ({ ...prev, [inv.id]: { decision, razon: data.reply ?? null, loading: false } }));
      } catch {
        setInversoresVotos((prev) => ({ ...prev, [inv.id]: { decision, razon: "Sin conexión en este momento.", loading: false } }));
      }
    }
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
                onClick={() => { setEnsayoMode(!ensayoMode); if (ensayoMode) handleResetEnsayo(); }}
                className={`flex items-center gap-2 font-bold text-[12px] px-4 py-2 rounded-xl cursor-pointer transition-all ${
                  ensayoMode
                    ? "bg-warning text-white hover:brightness-110"
                    : "bg-background border border-card-border text-text-secondary hover:border-accent-text/30"
                }`}
              >
                <Timer size={14} />
                {ensayoMode ? "Salir del ensayo" : "Ensayo cronometrado"}
              </button>
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
        <div>
        {/* C12: Ensayo cronometrado */}
        {ensayoMode && (
          <div className={`rounded-2xl p-5 mb-5 border ${ensayoCompleted ? "bg-success-light border-success/20" : "bg-sidebar border-sidebar"}`}>
            {ensayoCompleted ? (
              /* Completed state */
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-success uppercase tracking-wide mb-0.5">Ensayo completado</p>
                  <p className="text-[20px] font-bold text-text-primary">
                    Pitch completado en {ensayoMins}:{ensayoElapsed % 60 === 0 && ensayoMins > 0 ? "00" : String(ensayoSecs).padStart(2, "0")} min
                  </p>
                  <p className="text-[12px] text-text-secondary mt-0.5">Tiempo total del pitch: {Math.floor(totalPitchSecs / 60)}:{String(totalPitchSecs % 60).padStart(2, "0")} · ¡Bien hecho!</p>
                </div>
                <button
                  onClick={handleResetEnsayo}
                  className="flex items-center gap-1.5 border border-success/30 text-success text-[11px] font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-success/10 transition-all"
                >
                  <RotateCcw size={13} />
                  Reiniciar
                </button>
              </div>
            ) : (
              /* Running state */
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Timer size={14} className="text-accent" />
                    <span className="text-[12px] font-bold text-white uppercase tracking-wide">Ensayo cronometrado</span>
                    <span className="text-[10px] text-white/50">— {Math.floor(totalPitchSecs / 60)}:{String(totalPitchSecs % 60).padStart(2, "0")} min total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[20px] font-bold text-accent tabular-nums">
                      {ensayoMins}:{String(ensayoSecs).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                {/* Global progress bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-1000"
                    style={{ width: `${ensayoPct}%` }}
                  />
                </div>
                {/* Current section indicator */}
                <div className="bg-white/8 rounded-xl p-3 mb-3 flex items-center gap-3">
                  <currentEnsayoSection.icon size={15} className="text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/50 font-medium">Sección actual</p>
                    <p className="text-[13px] font-bold text-white">{currentEnsayoSection.title}</p>
                    <p className="text-[10px] text-white/50">{currentEnsayoSection.subtitle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-white/40">Tiempo objetivo</p>
                    <p className="text-[12px] font-bold text-accent">{currentEnsayoSection.durationSeg}s</p>
                  </div>
                </div>
                {/* Section mini progress dots */}
                <div className="flex gap-1.5 mb-3">
                  {pitchSections.map((s, idx) => {
                    const isDone = ensayoElapsed >= (sectionCumulative[idx - 1] ?? 0) + s.durationSeg;
                    const isCurrent = idx === (currentEnsayoSectionIdx < 0 ? pitchSections.length - 1 : currentEnsayoSectionIdx);
                    return (
                      <div key={s.id} className="flex-1">
                        <div className={`h-1 rounded-full ${isDone ? "bg-success" : isCurrent ? "bg-accent" : "bg-white/20"}`} />
                        <p className={`text-[8px] mt-1 text-center ${isCurrent ? "text-accent font-bold" : "text-white/30"}`}>{s.title.split(" ")[0]}</p>
                      </div>
                    );
                  })}
                </div>
                {/* Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEnsayoRunning(!ensayoRunning)}
                    className="flex items-center gap-2 bg-accent text-sidebar text-[12px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all"
                  >
                    {ensayoRunning ? <Pause size={13} /> : <Play size={13} />}
                    {ensayoRunning ? "Pausar" : ensayoElapsed > 0 ? "Continuar" : "Empezar"}
                  </button>
                  <button
                    onClick={handleResetEnsayo}
                    className="flex items-center gap-2 bg-white/8 text-white text-[11px] font-medium px-3 py-2 rounded-xl cursor-pointer hover:bg-white/15 transition-all"
                  >
                    <RotateCcw size={12} />
                    Reiniciar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
              <div className="flex items-center justify-between mt-2 mb-4">
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

              {/* C7: Botón feedback IA por sección */}
              <div className="border-t border-card-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-accent-text" />
                    <span className="text-[11px] font-bold text-accent-text">Coach IA — Prof. Ana</span>
                  </div>
                  <button
                    onClick={() => handlePedirConsejo(current.id, notes[current.id] || "")}
                    disabled={coachingSection !== null || !(notes[current.id] || "").trim()}
                    className="flex items-center gap-1.5 text-[10px] font-bold bg-sidebar text-white px-3 py-1.5 rounded-xl cursor-pointer hover:bg-accent-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {coachingSection === current.id
                      ? <><Loader2 size={10} className="animate-spin" /> Analizando...</>
                      : <><MessageSquare size={10} /> Pedir consejo</>
                    }
                  </button>
                </div>

                {aiCoach[current.id] ? (
                  <div className="bg-sidebar rounded-xl p-4 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent text-[8px] font-bold">IA</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Feedback de Prof. Ana</span>
                      <button
                        onClick={() => setAiCoach(prev => ({ ...prev, [current.id]: null }))}
                        className="ml-auto text-white/30 hover:text-white/60 cursor-pointer text-[10px]"
                      >✕</button>
                    </div>
                    <p className="text-[12px] text-white/90 leading-relaxed">{aiCoach[current.id]}</p>
                  </div>
                ) : (
                  <div className="bg-background rounded-xl px-4 py-3 border border-dashed border-card-border text-center">
                    <p className="text-[10px] text-text-muted">
                      Escribe tu sección y pulsa &ldquo;Pedir consejo&rdquo; — la Profa. Ana revisará tu pitch y dará feedback personalizado.
                    </p>
                  </div>
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

            {/* C13: Guión de apoyo */}
            {guionPorSeccion[current.id] && (
              <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
                <button
                  onClick={() => toggleGuion(current.id)}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-background transition-colors cursor-pointer"
                >
                  <BookOpen size={13} className="text-text-secondary flex-shrink-0" />
                  <span className="text-[11px] font-bold text-text-primary flex-1 text-left">Guión de apoyo</span>
                  <span className="text-[9px] text-text-muted bg-background px-2 py-0.5 rounded-full mr-1">
                    {guionPorSeccion[current.id].puntos.filter((p) => p.clave).length} puntos clave
                  </span>
                  {guionOpen.has(current.id)
                    ? <ChevronUp size={13} className="text-text-muted flex-shrink-0" />
                    : <ChevronDown size={13} className="text-text-muted flex-shrink-0" />
                  }
                </button>
                {guionOpen.has(current.id) && (
                  <div className="px-4 pb-4 border-t border-card-border">
                    <p className="text-[10px] text-text-muted py-2.5">
                      Puntos que debes cubrir en esta sección — los marcados como <span className="font-bold text-sidebar">Clave</span> son imprescindibles.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {guionPorSeccion[current.id].puntos.map((punto, i) => (
                        <li key={i} className={`flex items-start gap-2.5 rounded-xl px-3 py-2 ${punto.clave ? "bg-sidebar" : "bg-background"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${punto.clave ? "bg-accent" : "bg-text-muted"}`} />
                          <span className={`text-[11px] leading-relaxed flex-1 ${punto.clave ? "text-white" : "text-text-secondary"}`}>
                            {punto.texto}
                          </span>
                          {punto.clave && (
                            <span className="text-[8px] font-bold bg-accent text-sidebar px-1.5 py-0.5 rounded-full flex-shrink-0 self-start mt-0.5">
                              Clave
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-accent-light rounded-xl px-3 py-2.5 border border-accent-text/20">
                      <p className="text-[9px] font-bold text-accent-text uppercase tracking-wide mb-1">Frase de transición →</p>
                      <p className="text-[11px] text-accent-text italic leading-relaxed">
                        {guionPorSeccion[current.id].transicion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                  onClick={() => { setMode("write"); setFeedback(null); setSectionScores(null); }}
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

            {/* C14: Puntuación por sección */}
            {sectionScores && (
              <div className="col-span-3 bg-card rounded-2xl border border-card-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={14} className="text-accent-text" />
                  <span className="text-[13px] font-semibold text-text-primary">Puntuación por sección</span>
                  <span className="ml-auto text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full">
                    Media: {(Object.values(sectionScores).reduce((a, b) => a + b, 0) / Object.values(sectionScores).length).toFixed(1)}/10
                  </span>
                </div>
                {(() => {
                  const minScore = Math.min(...Object.values(sectionScores));
                  const weakestId = pitchSections.find((s) => sectionScores[s.id] === minScore)?.id;
                  return (
                    <div className="space-y-2.5">
                      {pitchSections.map((section) => {
                        const score = sectionScores[section.id] ?? 0;
                        const isWeakest = section.id === weakestId;
                        const Icon = section.icon;
                        const barColor = score >= 7 ? "bg-success" : score >= 5 ? "bg-warning" : "bg-urgent";
                        const textColor = score >= 7 ? "text-success" : score >= 5 ? "text-warning" : "text-urgent";
                        return (
                          <div key={section.id} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${isWeakest ? "bg-urgent-light" : "bg-background"}`}>
                            <Icon size={13} className="text-text-muted flex-shrink-0" />
                            <span className="text-[11px] font-medium text-text-primary w-32 flex-shrink-0 truncate">{section.title}</span>
                            <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                                style={{ width: `${score * 10}%` }}
                              />
                            </div>
                            <span className={`text-[14px] font-bold w-5 text-right flex-shrink-0 ${textColor}`}>{score}</span>
                            <span className="text-[9px] text-text-muted w-7 flex-shrink-0">/10</span>
                            {isWeakest
                              ? <span className="text-[8px] font-bold bg-urgent text-white px-2 py-0.5 rounded-full flex-shrink-0">Mejorar</span>
                              : <div className="w-14 flex-shrink-0" />
                            }
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* C11: Panel de Inversores Simulados */}
            {Object.keys(inversoresVotos).length > 0 && (() => {
              const capitalConseguido = inversoresConfig
                .filter((inv) => inversoresVotos[inv.id]?.decision === "si")
                .reduce((sum, inv) => sum + inv.capital, 0);
              return (
                <div className="col-span-3 bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-accent-text" />
                      <span className="text-[13px] font-bold text-text-primary">Inversores simulados</span>
                    </div>
                    {capitalConseguido > 0 && (
                      <div className="flex items-center gap-2 bg-success-light border border-success/20 rounded-xl px-4 py-2">
                        <TrendingUp size={13} className="text-success" />
                        <span className="text-[12px] font-bold text-success">
                          {capitalConseguido.toLocaleString("es-ES")} € conseguidos
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {inversoresConfig.map((inv) => {
                      const voto = inversoresVotos[inv.id];
                      const isLoading = voto?.loading ?? false;
                      const decision = voto?.decision ?? null;
                      const razon = voto?.razon ?? null;
                      return (
                        <div
                          key={inv.id}
                          className={`rounded-xl p-4 border transition-all ${
                            decision === "si"
                              ? "bg-success-light border-success/25"
                              : decision === "no"
                              ? "bg-urgent-light border-urgent/25"
                              : "bg-background border-card-border"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-9 h-9 rounded-full bg-sidebar text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                              {inv.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-text-primary leading-tight">{inv.nombre}</p>
                              <p className="text-[10px] text-text-muted">{inv.perfil}</p>
                            </div>
                            {isLoading ? (
                              <Loader2 size={16} className="text-text-muted animate-spin flex-shrink-0" />
                            ) : decision !== null ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                decision === "si" ? "bg-success text-white" : "bg-urgent text-white"
                              }`}>
                                <span className="text-[14px] font-black">{decision === "si" ? "✓" : "✗"}</span>
                              </div>
                            ) : null}
                          </div>
                          <p className="text-[10px] text-text-muted mb-2 leading-relaxed">{inv.descripcion}</p>
                          {decision !== null && (
                            <div className={`text-[10px] font-semibold mb-1 ${decision === "si" ? "text-success" : "text-urgent"}`}>
                              {decision === "si" ? `Invierte ${inv.capital.toLocaleString("es-ES")} €` : "No invierte"}
                            </div>
                          )}
                          {razon && (
                            <p className="text-[10px] text-text-secondary leading-relaxed italic">
                              &ldquo;{razon}&rdquo;
                            </p>
                          )}
                          {isLoading && (
                            <p className="text-[10px] text-text-muted italic">Evaluando pitch...</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {capitalConseguido === 0 && !inversoresConfig.some((inv) => inversoresVotos[inv.id]?.loading) && (
                    <div className="mt-4 bg-urgent-light rounded-xl px-4 py-3 border border-urgent/20">
                      <p className="text-[11px] text-urgent font-medium">
                        Ningún inversor ha apostado por el proyecto esta vez. Refuerza el modelo financiero y la sección de mercado para convencerlos.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* AI coach feedback per section (collected during writing) */}
            {Object.keys(aiCoach).some(k => aiCoach[k]) && (
              <div className="col-span-3 bg-sidebar rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-accent" />
                  <span className="text-[12px] font-bold text-accent uppercase tracking-wide">Feedback IA por sección</span>
                </div>
                <div className="space-y-3">
                  {pitchSections.filter(s => aiCoach[s.id]).map(s => (
                    <div key={s.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <s.icon size={12} className="text-accent" />
                        <span className="text-[11px] font-semibold text-white">{s.title}</span>
                      </div>
                      <p className="text-[11px] text-white/80 leading-relaxed">{aiCoach[s.id]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* C15: Panel Preguntas del jurado */}
            <div className="col-span-3 bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-accent-text" />
                <span className="text-[13px] font-semibold text-text-primary">Preguntas del jurado</span>
                <span className="ml-auto text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full">
                  5 preguntas · inversores reales del Demo Day
                </span>
              </div>
              <div className="space-y-4">
                {preguntasJurado.map((pj) => {
                  const evaluacion = evaluacionesJurado[pj.id] ?? null;
                  const isEvaluando = evaluandoJurado === pj.id;
                  const respuesta = respuestasJurado[pj.id] ?? "";
                  return (
                    <div key={pj.id} className="bg-background rounded-xl p-4">
                      {/* Inversor + tipo */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {pj.avatar}
                        </div>
                        <span className="text-[10px] font-semibold text-text-secondary">{pj.inversor}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto ${tipoColor[pj.tipo]}`}>
                          {pj.tipo}
                        </span>
                      </div>
                      {/* Pregunta */}
                      <p className="text-[12px] font-medium text-text-primary leading-relaxed mb-3 italic">
                        &ldquo;{pj.pregunta}&rdquo;
                      </p>
                      {/* Respuesta libre */}
                      <textarea
                        value={respuesta}
                        onChange={(e) => setRespuestasJurado((prev) => ({ ...prev, [pj.id]: e.target.value }))}
                        placeholder="Escribe tu respuesta aquí... Sé directo, usa datos si los tienes y termina con seguridad."
                        rows={3}
                        className="w-full text-[11px] text-text-primary bg-card border border-card-border rounded-xl px-3 py-2.5 outline-none focus:border-accent-text/40 resize-none transition-colors placeholder:text-text-muted mb-2"
                      />
                      {/* Evaluar button */}
                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleEvaluarRespuesta(pj.id)}
                          disabled={!respuesta.trim() || !!evaluandoJurado}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-sidebar px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isEvaluando ? (
                            <><Loader2 size={10} className="animate-spin" />Evaluando...</>
                          ) : (
                            <><Sparkles size={10} />Evaluar respuesta</>
                          )}
                        </button>
                        {respuesta.length > 0 && (
                          <span className="text-[9px] text-text-muted">{respuesta.split(/\s+/).filter(Boolean).length} palabras</span>
                        )}
                      </div>
                      {/* Evaluación IA */}
                      {evaluacion && (
                        <div className="mt-3 bg-sidebar/5 rounded-xl border border-sidebar/10 p-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles size={10} className="text-accent-text" />
                            <span className="text-[9px] font-bold text-accent-text uppercase tracking-wide">Evaluación del jurado IA</span>
                          </div>
                          <p className="text-[11px] text-text-secondary leading-relaxed">{evaluacion}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

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
