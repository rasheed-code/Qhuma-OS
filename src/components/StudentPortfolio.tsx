"use client";

import { useState } from "react";
import { BookOpen, TrendingUp, FileText, Star, ChevronRight, Award, Lightbulb, MessageSquare, AlertCircle, ChevronDown, ChevronUp, RefreshCw, Sparkles, GitCommit, BarChart3, MapPin, Users, FileImage, ExternalLink, Share2, Copy, Eye, EyeOff, QrCode, Printer, CheckCircle2, Trophy, Download, Lock, Shield, Coins, TrendingDown } from "lucide-react";
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

// S20 — Próximos pasos recomendados
interface ProximoPaso {
  competencia: CompKey;
  accion: string;
  tiempo: string;
  descripcion: string;
}

const proximosPasosMock: ProximoPaso[] = [
  { competencia: "CE", accion: "Perfecciona el pitch para el Demo Day", tiempo: "2-3 h", descripcion: "Grábate presentando el modelo financiero y compártelo con tu tutor para recibir feedback antes del Demo Day real." },
  { competencia: "CD", accion: "Publica la landing page de Casa Limón", tiempo: "1-2 h", descripcion: "Despliega en Vercel o Netlify la landing page diseñada y añade el enlace como evidencia pública en tu portfolio." },
  { competencia: "CPL", accion: "Traduce las FAQ de huéspedes al francés", tiempo: "3-4 h", descripcion: "Amplía el alcance de Casa Limón al mercado francés. Usa el vocabulario trabajado en clase, evita el traductor automático." },
];

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

// S14 — Línea del tiempo del proyecto
const timelineHitos = [
  { fecha: "3 mar", titulo: "Análisis de mercado completado", competencia: "STEM" as CompKey, xp: 120, completado: true, fase: "Semana 1" },
  { fecha: "4 mar", titulo: "Identidad visual de Casa Limón creada", competencia: "CCEC" as CompKey, xp: 100, completado: true, fase: "Semana 1" },
  { fecha: "5 mar", titulo: "Listing publicado en español e inglés", competencia: "CLC" as CompKey, xp: 130, completado: true, fase: "Semana 2" },
  { fecha: "6 mar", titulo: "Landing page de Casa Limón publicada", competencia: "CD" as CompKey, xp: 150, completado: true, fase: "Semana 2" },
  { fecha: "8 mar", titulo: "Modelo financiero y punto de equilibrio", competencia: "STEM" as CompKey, xp: 140, completado: true, fase: "Semana 3" },
  { fecha: "10 mar", titulo: "Templates de comunicación con huéspedes", competencia: "CLC" as CompKey, xp: 80, completado: true, fase: "Semana 3" },
  { fecha: "Próximo", titulo: "Demo Day — Pitch ante inversores reales", competencia: "CE" as CompKey, xp: 200, completado: false, fase: "Semana 4" },
];

// S17 — Progreso semanal por competencia (4 semanas)
const competenciaMesSemanal: Record<CompKey, number[]> = {
  CLC:   [52, 60, 67, 72],
  CPL:   [44, 50, 55, 58],
  STEM:  [65, 72, 80, 85],
  CD:    [60, 70, 82, 88],
  CPSAA: [55, 62, 70, 74],
  CC:    [52, 58, 64, 68],
  CE:    [58, 70, 82, 90],
  CCEC:  [38, 44, 50, 55],
};

// S17 — Reto personalizado por competencia del mes
const retosPersonalizados: Record<CompKey, string> = {
  CLC:   "Escribe un email profesional a un proveedor de limpieza para tu Airbnb usando vocabulario formal y estructura clara.",
  CPL:   "Traduce el apartado 'Normas de la casa' de tu listing al inglés sin usar traductor automático.",
  STEM:  "Añade un escenario de precios dinámicos según festivos a tu modelo financiero.",
  CD:    "Crea un tablero de Notion para gestionar las reservas de Casa Limón con automatizaciones básicas.",
  CPSAA: "Identifica 3 momentos del proyecto donde cambiaste de opinión gracias al feedback de otros.",
  CC:    "Investiga la normativa local de alquiler vacacional en Málaga y redacta un resumen de una página.",
  CE:    "Diseña el plan de crecimiento de Casa Limón para el año 2: ¿un segundo piso o optimizar el primero?",
  CCEC:  "Crea un moodboard visual para la temporada de verano de Casa Limón con paleta y fotografía.",
};

// S16 — Evidencias destacadas
const evidenciasDestacadas = [
  {
    id: "ev1",
    titulo: "Análisis de mercado Airbnb Málaga",
    tipo: "Hoja de cálculo",
    icono: "spreadsheet" as const,
    competencia: "STEM" as CompKey,
    descripcionCorta: "Precios, ocupación y segmentación de 120 listings del centro histórico",
    descripcionCompleta: "Hoja de cálculo con 3 meses de datos del INE y AirDNA. Incluye análisis de 120 listings activos, distribución de precios por temporada (€48 noche en verano vs €32 en invierno) y modelo de proyección de ocupación para Casa Limón. Primera evidencia entregada del proyecto.",
  },
  {
    id: "ev2",
    titulo: "Brand board Casa Limón",
    tipo: "Imagen",
    icono: "image" as const,
    competencia: "CCEC" as CompKey,
    descripcionCorta: "Identidad visual completa: paleta mediterránea, tipografía, logo y guía de uso",
    descripcionCompleta: "Brand board con la identidad visual de Casa Limón. Paleta de colores mediterránea (arena #F5E6C8, verde olivo #7A8450, terracota #C4714A), tipografía Playfair Display + Inter, logotipo en 3 variantes y guía de aplicación para el listing de Airbnb y redes sociales. 3 iteraciones antes de aprobación.",
  },
  {
    id: "ev3",
    titulo: "Listing bilingüe Casa Limón",
    tipo: "Documento",
    icono: "document" as const,
    competencia: "CLC" as CompKey,
    descripcionCorta: "Descripción en español e inglés con SEO optimizado para Airbnb",
    descripcionCompleta: "Texto del listing completo en español e inglés (1.200 palabras cada uno), optimizado para búsqueda en Airbnb. Incluye guía de bienvenida bilingüe y 10 plantillas de comunicación con huéspedes para los escenarios más frecuentes: check-in, preguntas, problemas e incidencias.",
  },
  {
    id: "ev4",
    titulo: "Modelo financiero y punto de equilibrio",
    tipo: "Hoja de cálculo",
    icono: "spreadsheet" as const,
    competencia: "CE" as CompKey,
    descripcionCorta: "3 escenarios de ocupación (40/65/85%) con proyección a 12 meses",
    descripcionCompleta: "Modelo financiero con proyección a 12 meses para Casa Limón. Escenario conservador (40% = 1.200€/mes), realista (65% = 1.850€/mes) y optimista (85% = 2.400€/mes). Punto de equilibrio alcanzado en mes 3 con ocupación realista. Coste de captación: 20€/cliente. Margen neto estimado: 70%.",
  },
];

export default function StudentPortfolio() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const [activeComp, setActiveComp] = useState<CompKey | null>(null);
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set(["e1"]));
  const [expandedEvidencia, setExpandedEvidencia] = useState<string | null>(null);
  const [narrativaIA, setNarrativaIA] = useState<string | null>(null);
  const [isGenerandoNarrativa, setIsGenerandoNarrativa] = useState(false);

  // S20 — Próximos pasos recomendados
  const [proximosPasos, setProximosPasos] = useState<ProximoPaso[] | null>(null);
  const [generandoProximosPasos, setGenerandoProximosPasos] = useState(false);
  const [generandoPaso, setGenerandoPaso] = useState<number | null>(null);

  const handleGenerarProximosPasos = async () => {
    setGenerandoProximosPasos(true);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "narrativa",
          message: "Genera 3 próximos pasos accionables para Lucas García en el Proyecto Airbnb Málaga, semana 4. Cada paso: competencia LOMLOE, acción concreta (máx 10 palabras), estimación de tiempo (ej: '2-3 h'), descripción breve (1 frase). Formato JSON array: [{\"competencia\":\"CE\",\"accion\":\"...\",\"tiempo\":\"...\",\"descripcion\":\"...\"}]",
          history: [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw: string = data.reply ?? "";
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as ProximoPaso[];
          setProximosPasos(parsed.slice(0, 3));
          setGenerandoProximosPasos(false);
          return;
        }
      }
    } catch { /* noop */ }
    setProximosPasos(proximosPasosMock);
    setGenerandoProximosPasos(false);
  };

  const handleRegenerarPaso = async (index: number) => {
    if (generandoPaso !== null) return;
    setGenerandoPaso(index);
    const paso = proximosPasos?.[index];
    if (!paso) { setGenerandoPaso(null); return; }
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "narrativa",
          message: `Genera un paso alternativo a "${paso.accion}" para Lucas García, Proyecto Airbnb Málaga. Usa una competencia diferente a ${paso.competencia}. JSON: {"competencia":"...","accion":"...","tiempo":"...","descripcion":"..."}`,
          history: [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw: string = data.reply ?? "";
        const jsonMatch = raw.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as ProximoPaso;
          setProximosPasos((prev) => {
            if (!prev) return prev;
            const next = [...prev];
            next[index] = parsed;
            return next;
          });
          setGenerandoPaso(null);
          return;
        }
      }
    } catch { /* noop */ }
    const alternativas: ProximoPaso[] = [
      { competencia: "STEM", accion: "Actualiza el modelo financiero con datos reales", tiempo: "2 h", descripcion: "Reemplaza los supuestos iniciales por datos reales de ocupación del Q1 y ajusta las proyecciones a 12 meses." },
      { competencia: "CC", accion: "Redacta el reglamento interno de Casa Limón", tiempo: "1.5 h", descripcion: "Define las normas de convivencia cumpliendo la normativa de Málaga para alquiler vacacional en 2024." },
      { competencia: "CPSAA", accion: "Solicita feedback escrito a 3 compañeros", tiempo: "1 h", descripcion: "Pide a tres compañeros que evalúen tu pitch con la rúbrica del Demo Day y sintetiza los puntos comunes." },
    ];
    setProximosPasos((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[index] = alternativas[index % alternativas.length];
      return next;
    });
    setGenerandoPaso(null);
  };

  // S19 — Vista pública compartible
  const [showVistaPublica, setShowVistaPublica] = useState(false);
  const [vistaPublicaURL, setVistaPublicaURL] = useState<string | null>(null);
  const [urlCopiada, setUrlCopiada] = useState(false);
  const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(true);

  const handleCompartirPortfolio = () => {
    if (!vistaPublicaURL) {
      const token = Math.random().toString(36).slice(2, 10);
      setVistaPublicaURL(`https://qhuma.es/portfolio/lucas-garcia-${token}`);
    }
    setShowVistaPublica(true);
  };

  const handleCopiarURL = async () => {
    if (!vistaPublicaURL) return;
    try { await navigator.clipboard.writeText(vistaPublicaURL); } catch { /* noop */ }
    setUrlCopiada(true);
    setTimeout(() => setUrlCopiada(false), 2000);
  };

  // S18 — Reflexión semanal IA
  const [reflexionBullets, setReflexionBullets] = useState<string[] | null>(null);
  const [isGenerandoReflexion, setIsGenerandoReflexion] = useState(false);
  const [expandedBullets, setExpandedBullets] = useState<Set<number>>(new Set());
  const [notasReflexion, setNotasReflexion] = useState<Record<number, string>>({});

  const handleGenerarReflexion = async () => {
    setIsGenerandoReflexion(true);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "narrativa",
          message: "Genera exactamente 3 aprendizajes clave de la semana para Lucas García en el Proyecto Airbnb Málaga. Formato: 3 frases numeradas (1. ... 2. ... 3. ...) separadas por salto de línea. Semana 3, competencias trabajadas: STEM (modelo financiero), CLC (listing bilingüe), CE (estrategia de precios). Logro más destacado: completó el punto de equilibrio tras 2 días de trabajo.",
          history: [],
        }),
      });
      const data = await res.json();
      const raw: string = data.reply ?? "";
      const bullets = raw
        .split("\n")
        .map((l: string) => l.replace(/^\d+[.)]\s*/, "").trim())
        .filter((l: string) => l.length > 10)
        .slice(0, 3);
      setReflexionBullets(bullets.length > 0 ? bullets : [
        "Esta semana construiste el modelo financiero de Casa Limón con 3 escenarios reales. Es la primera vez que trabajas con proyecciones a 12 meses.",
        "Completaste el listing en español e inglés sin traductor automático — aplicaste CE y CLC simultáneamente.",
        "Tu error con el punto de equilibrio optimista se convirtió en tu mejor aprendizaje: modelar siempre el escenario conservador primero.",
      ]);
      setExpandedBullets(new Set());
    } catch {
      setReflexionBullets([
        "Esta semana construiste el modelo financiero de Casa Limón con 3 escenarios reales.",
        "Completaste el listing bilingüe aplicando CE y CLC simultáneamente.",
        "El error con el punto de equilibrio fue tu mejor aprendizaje de la semana.",
      ]);
    } finally {
      setIsGenerandoReflexion(false);
    }
  };

  const toggleBullet = (i: number) => {
    setExpandedBullets((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

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

  // S21 — Mis errores → Mis aprendizajes
  const [superadosSet, setSuperadosSet] = useState<Set<string>>(new Set(["e1", "e2"]));
  const [confirmandoSuperacion, setConfirmandoSuperacion] = useState<string | null>(null);
  const [superacionMensaje, setSuperacionMensaje] = useState<Record<string, string>>({});

  const handleMarcarSuperado = async (entry: ErrorEntry) => {
    if (confirmandoSuperacion) return;
    setConfirmandoSuperacion(entry.id);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "narrativa",
          message: `Lucas García ha marcado como superado el siguiente error de aprendizaje: "${entry.title}" (competencia ${entry.competency}). Lo que cambiaría: ${entry.cambiaría}. Responde con una frase breve de felicitación y refuerzo positivo (máx 25 palabras).`,
          history: [],
        }),
      });
      const data = await res.json();
      const msg = data.reply ?? "¡Error convertido en aprendizaje! Eso es exactamente lo que hace crecer a un emprendedor.";
      setSuperacionMensaje((prev) => ({ ...prev, [entry.id]: msg }));
    } catch {
      setSuperacionMensaje((prev) => ({ ...prev, [entry.id]: "¡Error convertido en aprendizaje! Eso es exactamente lo que hace crecer a un emprendedor." }));
    } finally {
      setSuperadosSet((prev) => { const n = new Set(prev); n.add(entry.id); return n; });
      setConfirmandoSuperacion(null);
    }
  };

  // C22 — Evidencias con QR
  const [qrVisible, setQrVisible] = useState<string | null>(null);
  const [imprimiendoTarjeta, setImprimiendoTarjeta] = useState<string | null>(null);

  // C23 — Proyección a 12 meses
  const [proyeccionVisible, setProyeccionVisible] = useState(false);
  const [loadingProyeccion, setLoadingProyeccion] = useState(false);
  const [proyeccionData, setProyeccionData] = useState<{ conservador: number[]; realista: number[]; optimista: number[] } | null>(null);
  const [proyeccionGuardada, setProyeccionGuardada] = useState(false);

  // C25 — Línea del tiempo integrada
  const [timelineVista, setTimelineVista] = useState<"narrativa" | "timeline">("narrativa");
  const [exportandoTimeline, setExportandoTimeline] = useState(false);
  const [timelineExportado, setTimelineExportado] = useState(false);

  const handleImprimirTarjeta = (ev: typeof evidenciasDestacadas[number]) => {
    setImprimiendoTarjeta(ev.id);
    // Build deterministic QR-like pixel map (7×7 seed based on id)
    const seed = ev.id.charCodeAt(2) ?? 1;
    const cells: number[] = [];
    for (let i = 0; i < 49; i++) {
      cells.push(((seed * (i + 7) * 13) % 17) < 9 ? 1 : 0);
    }
    // Force corners
    [0,1,6,7,42,43,48].forEach((idx) => { cells[idx] = 1; });
    const qrSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 7 7">
      ${cells.map((v, i) => v ? `<rect x="${i%7}" y="${Math.floor(i/7)}" width="1" height="1" fill="#1f514c"/>` : "").join("")}
    </svg>`;
    const qrDataUrl = "data:image/svg+xml," + encodeURIComponent(qrSvg);
    const portfolioUrl = `https://qhuma.es/portfolio/lucas-garcia/evidencia-${ev.id}`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Tarjeta evidencia — ${ev.titulo}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  body { font-family: Inter, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f4f0e9; }
  .card { width: 340px; background: white; border-radius: 20px; padding: 24px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); border: 1px solid #ededed; }
  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .logo { width: 36px; height: 36px; background: #1f514c; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #c3f499; font-weight: 900; font-size: 18px; }
  .project { font-size: 11px; color: #9ca3af; }
  .badge { display: inline-block; background: #fffbeb; color: #f59e0b; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 12px; margin-bottom: 8px; }
  .title { font-size: 15px; font-weight: 700; color: #141414; margin-bottom: 6px; }
  .desc { font-size: 11px; color: #666; line-height: 1.5; margin-bottom: 12px; }
  .comp { display: inline-block; background: #edffe3; color: #2f574d; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 12px; margin-right: 4px; }
  .footer { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #ededed; }
  .alumno { font-size: 12px; color: #141414; font-weight: 600; }
  .url { font-size: 9px; color: #9ca3af; margin-top: 2px; word-break: break-all; }
  .qr { width: 64px; height: 64px; }
  @media print { body { background: white; } }
</style></head><body>
<div class="card">
  <div class="header">
    <div class="logo">Q</div>
    <div>
      <div style="font-weight:700;font-size:14px;color:#141414;">qhumaOS</div>
      <div class="project">Proyecto Airbnb Málaga · 1º ESO</div>
    </div>
  </div>
  <div class="badge">Evidencia destacada</div>
  <div class="title">${ev.titulo}</div>
  <div class="desc">${ev.descripcionCompleta}</div>
  <span class="comp">${ev.competencia}</span>
  <span class="comp">${ev.tipo}</span>
  <div class="footer">
    <div>
      <div class="alumno">Lucas García</div>
      <div class="url">${portfolioUrl}</div>
    </div>
    <img src="${qrDataUrl}" class="qr" alt="QR evidencia" />
  </div>
</div>
<script>window.onload = function() { window.print(); }</script>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tarjeta_evidencia_${ev.id}_lucas_garcia.html`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setImprimiendoTarjeta(null), 1500);
  };

  // C9 — ErrorLog IA reflexión
  const [iaReflexiones, setIaReflexiones] = useState<Record<string, string>>({});
  const [loadingReflexion, setLoadingReflexion] = useState<string | null>(null);

  // C27 — Insignias de habilidad
  const [badgeExpandida, setBadgeExpandida] = useState<string | null>(null);
  const [exportandoBadges, setExportandoBadges] = useState(false);
  const [badgesExportadas, setBadgesExportadas] = useState(false);

  // C33 — Carta al yo del futuro
  const [cartaGenerada, setCartaGenerada] = useState<string | null>(null);
  const [generandoCarta, setGenerandoCarta] = useState(false);
  const [cartaExportada, setCartaExportada] = useState(false);

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
          <h1 className="text-[22px] font-bold text-text-primary">{lbl("Mi Portfolio", "My Portfolio")}</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleCompartirPortfolio}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-sidebar bg-accent border border-accent/60 px-3 py-1.5 rounded-full hover:brightness-110 transition-colors cursor-pointer"
            >
              <Share2 size={11} />
              {lbl("Compartir portfolio", "Share portfolio")}
            </button>
            <button
              onClick={handleRegenerarNarrativa}
              disabled={isGenerandoNarrativa}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-text bg-accent-light border border-accent/30 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={11} className={isGenerandoNarrativa ? "animate-spin" : ""} />
              {isGenerandoNarrativa ? lbl("Generando...", "Generating...") : lbl("Regenerar narrativa IA", "Regenerate AI narrative")}
            </button>
          </div>
        </div>
        <p className="text-[13px] text-text-secondary mb-4">
          Narrativa de aprendizaje · Proyecto Airbnb Málaga · Lucas García · 1º ESO
        </p>

        {/* C25: Toggle Vista narrativa / Línea del tiempo */}
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-5 w-fit">
          {([
            { key: "narrativa" as const, label: lbl("Vista narrativa", "Narrative view") },
            { key: "timeline" as const, label: lbl("Línea del tiempo", "Timeline") },
          ]).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTimelineVista(opt.key)}
              className={`px-4 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                timelineVista === opt.key
                  ? "bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* S19: Vista pública compartible */}
        {showVistaPublica && (
          <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
            {/* Header del panel */}
            <div className="flex items-center gap-2 mb-4">
              <Share2 size={14} className="text-accent-text" />
              <span className="text-[13px] font-semibold text-text-primary">{lbl("Vista pública del portfolio", "Public portfolio view")}</span>
              <button
                onClick={() => setMostrarDatosPersonales(!mostrarDatosPersonales)}
                className={`ml-auto flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                  mostrarDatosPersonales
                    ? "bg-sidebar text-white border-sidebar"
                    : "bg-background text-text-secondary border-card-border hover:border-accent-text/30"
                }`}
              >
                {mostrarDatosPersonales ? <Eye size={10} /> : <EyeOff size={10} />}
                {mostrarDatosPersonales ? lbl("Datos visibles", "Data visible") : lbl("Datos ocultos", "Data hidden")}
              </button>
              <button
                onClick={() => setShowVistaPublica(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer text-[10px] px-2"
              >✕</button>
            </div>

            {/* URL compartible */}
            <div className="flex items-center gap-2 bg-background rounded-xl border border-card-border px-3 py-2.5 mb-4">
              <ExternalLink size={12} className="text-accent-text flex-shrink-0" />
              <span className="flex-1 text-[11px] text-text-secondary font-mono truncate">{vistaPublicaURL}</span>
              <button
                onClick={handleCopiarURL}
                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all flex-shrink-0 ${
                  urlCopiada ? "bg-success-light text-success" : "bg-sidebar text-white hover:brightness-110"
                }`}
              >
                <Copy size={10} />
                {urlCopiada ? lbl("¡Copiada!", "Copied!") : lbl("Copiar URL", "Copy URL")}
              </button>
            </div>

            {/* Previsualización */}
            <div className="bg-background rounded-xl p-4 border border-card-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-sidebar text-white font-bold text-[14px] flex items-center justify-center flex-shrink-0">
                  LG
                </div>
                <div>
                  <p className="text-[14px] font-bold text-text-primary">
                    {mostrarDatosPersonales ? "Lucas García" : "Alumno QHUMA"}
                  </p>
                  <p className="text-[11px] text-text-muted">1º ESO · Proyecto Airbnb Málaga · QHUMA Málaga</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 bg-success-light px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-[10px] font-bold text-success">{lbl("Portfolio activo", "Active portfolio")}</span>
                </div>
              </div>

              {/* Top competencias */}
              <div className="mb-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">{lbl("Competencias LOMLOE", "LOMLOE Competencies")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(compProgress) as [CompKey, { before: number; after: number }][])
                    .sort(([, a], [, b]) => b.after - a.after)
                    .slice(0, 4)
                    .map(([key, prog]) => (
                      <div key={key} className="bg-card rounded-xl border border-card-border px-3 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-text-secondary">{key}</span>
                          <span className="text-[10px] font-bold text-success">
                            {mostrarDatosPersonales ? `${prog.after}%` : "●●●"}
                          </span>
                        </div>
                        <div className="h-1.5 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full" style={{ width: mostrarDatosPersonales ? `${prog.after}%` : "0%" }} />
                        </div>
                        <p className="text-[9px] text-text-muted mt-0.5 truncate">{compFull[key]}</p>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Hitos completados */}
              <div className="mb-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">{lbl("Hitos del proyecto", "Project milestones")}</p>
                <div className="space-y-1.5">
                  {timelineHitos.filter((h) => h.completado).slice(-3).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 bg-card rounded-xl border border-card-border px-3 py-2">
                      <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[8px] font-bold">✓</span>
                      </div>
                      <span className="text-[11px] text-text-primary flex-1 truncate">{h.titulo}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${compColor(h.competencia)}`}>{h.competencia}</span>
                      <span className="text-[9px] font-bold text-success flex-shrink-0">+{h.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datos de impacto */}
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">{lbl("Impacto real del proyecto", "Real project impact")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Ocupación media", valor: mostrarDatosPersonales ? "72%" : "●●", bg: "bg-success-light text-success" },
                    { label: "Ingresos proy.", valor: mostrarDatosPersonales ? "1.850€/mes" : "●●●", bg: "bg-accent-light text-accent-text" },
                    { label: "Ranking zonal", valor: mostrarDatosPersonales ? "Top 8%" : "●●", bg: "bg-sidebar text-accent" },
                  ].map((item) => (
                    <div key={item.label} className={`${item.bg} rounded-xl px-3 py-2 text-center`}>
                      <p className="text-[13px] font-bold">{item.valor}</p>
                      <p className="text-[9px] opacity-70">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[9px] text-text-muted mt-3 text-center">
              Esta URL es pública · cualquier persona con el enlace puede ver el portfolio · los datos marcados como ocultos no aparecerán
            </p>
          </div>
        )}

        {/* C25: Línea del tiempo integrada */}
        {timelineVista === "timeline" && (() => {
          const handleExportarTimeline = () => {
            setExportandoTimeline(true);
            // Build unified timeline events
            const hitosEvts = timelineHitos.map((h) => ({
              fecha: h.fecha,
              tipo: "hito" as const,
              titulo: h.titulo,
              competencia: h.competencia,
              descripcion: h.fase,
              extra: h.completado ? lbl("Completado", "Completed") : lbl("Próximo", "Upcoming"),
            }));
            const erroresEvts = errorLog.map((e) => ({
              fecha: e.date,
              tipo: "error" as const,
              titulo: e.title,
              competencia: e.competency,
              descripcion: e.phase,
              extra: e.resolved ? lbl("→ Superado", "→ Resolved") : lbl("→ En proceso", "→ In progress"),
            }));
            const evidenciasEvts = evidenciasDestacadas.map((ev) => ({
              fecha: lbl("Semana 1-4 · 2026", "Week 1-4 · 2026"),
              tipo: "evidencia" as const,
              titulo: ev.titulo,
              competencia: ev.competencia,
              descripcion: ev.tipo,
              extra: ev.descripcionCorta,
            }));
            // Date order: hitos in order, errores interspersed by phase, evidencias by id
            const orden = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
            const phaseOf = (phase: string) => orden.findIndex((o) => phase.includes(o));
            const allEvts = [...hitosEvts, ...erroresEvts, ...evidenciasEvts].sort((a, b) => {
              const pa = phaseOf(a.descripcion);
              const pb = phaseOf(b.descripcion);
              return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
            });

            const typeLabelMap = { hito: lbl("Hito", "Milestone"), error: lbl("Error aprendido", "Learned error"), evidencia: lbl("Evidencia", "Evidence") };
            const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Línea del tiempo — Lucas García</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; background: #f4f0e9; }
  h1 { color: #141414; font-size: 20px; margin-bottom: 4px; }
  .sub { color: #666; font-size: 12px; margin-bottom: 24px; }
  .event { margin-bottom: 16px; padding: 14px 16px; border-radius: 12px; border: 1px solid #ededed; background: white; }
  .hito { border-left: 3px solid #22c55e; }
  .error { border-left: 3px solid #f59e0b; }
  .evidencia { border-left: 3px solid #2f574d; }
  .badge { display: inline-block; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 8px; margin-right: 6px; background: #edffe3; color: #2f574d; }
  .tipo { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
  .titulo { font-size: 13px; font-weight: 700; color: #141414; margin: 4px 0; }
  .extra { font-size: 10px; color: #666; }
</style></head><body>
<h1>Línea del tiempo integrada — Lucas García</h1>
<div class="sub">Proyecto Airbnb Málaga · QHUMA OS · Generado: ${new Date().toLocaleDateString("es-ES")}</div>
${allEvts.map((e) => `
<div class="event ${e.tipo}">
  <div class="tipo">${typeLabelMap[e.tipo]} · ${e.fecha}</div>
  <div class="titulo">${e.titulo}</div>
  <span class="badge">${e.competencia}</span>
  <span class="extra">${e.extra}</span>
</div>`).join("")}
</body></html>`;
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `timeline_lucas_garcia_${new Date().toISOString().slice(0,10)}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            setTimeout(() => { setExportandoTimeline(false); setTimelineExportado(true); }, 1200);
            setTimeout(() => setTimelineExportado(false), 4000);
          };

          // Build unified sorted events
          const hitosEvts = timelineHitos.map((h) => ({
            id: `h-${h.titulo}`,
            fecha: h.fecha,
            tipo: "hito" as const,
            titulo: h.titulo,
            competencia: h.competencia,
            descripcion: h.fase,
            completado: h.completado,
            xp: h.xp,
          }));
          const erroresEvts = errorLog.map((e) => ({
            id: `e-${e.id}`,
            fecha: e.date,
            tipo: "error" as const,
            titulo: e.title,
            competencia: e.competency,
            descripcion: e.phase,
            completado: e.resolved,
            xp: 0,
          }));
          const evidenciasEvts = evidenciasDestacadas.map((ev, idx) => ({
            id: `ev-${ev.id}`,
            fecha: `${idx < 2 ? "4" : idx < 3 ? "5" : "8"} mar`,
            tipo: "evidencia" as const,
            titulo: ev.titulo,
            competencia: ev.competencia,
            descripcion: ev.tipo,
            completado: true,
            xp: 0,
          }));

          const ordenFases = ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Modelo financiero"];
          const phaseScore = (desc: string) => {
            const idx = ordenFases.findIndex((o) => desc.includes(o.replace("Semana ", "")));
            return idx === -1 ? 5 : idx;
          };
          const allEvts = [...hitosEvts, ...erroresEvts, ...evidenciasEvts].sort((a, b) => {
            return phaseScore(a.descripcion) - phaseScore(b.descripcion);
          });

          const tipoCfgTL = {
            hito: { dot: "bg-success border-success", icon: Trophy, iconColor: "text-success", badge: "bg-success-light text-success", label: lbl("Hito", "Milestone") },
            error: { dot: "bg-warning border-warning", icon: AlertCircle, iconColor: "text-warning", badge: "bg-warning-light text-text-primary", label: lbl("Error aprendido", "Learned error") },
            evidencia: { dot: "bg-accent-text border-accent-text", icon: FileText, iconColor: "text-accent-text", badge: "bg-accent-light text-accent-text", label: lbl("Evidencia", "Evidence") },
          };

          return (
            <div className="mb-5">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <GitCommit size={14} className="text-accent-text" />
                <span className="text-[13px] font-semibold text-text-primary">
                  {lbl("Línea del tiempo integrada", "Integrated timeline")}
                </span>
                <span className="ml-auto text-[10px] text-text-muted bg-background border border-card-border px-2 py-0.5 rounded-full">
                  {allEvts.length} {lbl("eventos", "events")}
                </span>
                <button
                  onClick={handleExportarTimeline}
                  disabled={exportandoTimeline}
                  className={`flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-xl border cursor-pointer transition-all disabled:opacity-50 ${
                    timelineExportado
                      ? "bg-success-light text-success border-success/20"
                      : "bg-background text-text-secondary border-card-border hover:bg-accent-light hover:text-accent-text"
                  }`}
                >
                  {exportandoTimeline ? <RefreshCw size={10} className="animate-spin" /> : timelineExportado ? <CheckCircle2 size={10} /> : <Download size={10} />}
                  {timelineExportado ? lbl("Exportado", "Exported") : lbl("Exportar", "Export")}
                </button>
              </div>

              {/* Leyenda */}
              <div className="flex items-center gap-4 mb-5 bg-background rounded-xl px-4 py-2.5 border border-card-border">
                {(["hito", "error", "evidencia"] as const).map((t) => {
                  const cfg = tipoCfgTL[t];
                  return (
                    <div key={t} className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full border-2 ${cfg.dot}`} />
                      <span className="text-[10px] text-text-secondary font-medium">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Timeline vertical */}
              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-card-border" />

                <div className="space-y-3">
                  {allEvts.map((evt) => {
                    const cfg = tipoCfgTL[evt.tipo];
                    const EvtIcon = cfg.icon;
                    return (
                      <div key={evt.id} className="relative">
                        {/* Dot */}
                        <div className={`absolute -left-[19px] top-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${cfg.dot} bg-card`}>
                          <EvtIcon size={8} className={cfg.iconColor} />
                        </div>

                        {/* Card */}
                        <div className="bg-card rounded-xl border border-card-border p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-bold text-text-muted">{evt.fecha}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${compColor(evt.competencia as CompKey)}`}>
                              {evt.competencia}
                            </span>
                            {evt.tipo === "error" && (
                              <span className="text-[9px] text-text-muted ml-auto">
                                {evt.completado ? lbl("→ Aprendizaje superado", "→ Resolved") : lbl("→ En proceso", "→ In progress")}
                              </span>
                            )}
                            {evt.tipo === "hito" && evt.xp > 0 && (
                              <span className="text-[9px] font-bold text-accent-text bg-accent-light px-1.5 py-0.5 rounded-full ml-auto">
                                +{evt.xp} XP
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-text-primary leading-tight">{evt.titulo}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">{evt.descripcion}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* C25: narrative view wrapper */}
        {timelineVista === "narrativa" && <>

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

        {/* S20 — Próximos pasos recomendados */}
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <ChevronRight size={14} className="text-accent-text" />
            <span className="text-[13px] font-semibold text-text-primary">{lbl("Próximos pasos recomendados", "Recommended next steps")}</span>
            {proximosPasos && (
              <span className="text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full ml-1">{lbl("3 pasos", "3 steps")}</span>
            )}
            {!proximosPasos && (
              <button
                onClick={handleGenerarProximosPasos}
                disabled={generandoProximosPasos}
                className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-sidebar text-white cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
              >
                {generandoProximosPasos
                  ? <><RefreshCw size={11} className="animate-spin" /> {lbl("Generando...", "Generating...")}</>
                  : <><Sparkles size={11} /> {lbl("Generar con IA", "Generate with AI")}</>
                }
              </button>
            )}
          </div>
          {!proximosPasos ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-3">
                <Lightbulb size={18} className="text-accent-text" />
              </div>
              <p className="text-[12px] text-text-secondary mb-1">{lbl("La IA analizará tu progreso actual", "AI will analyse your current progress")}</p>
              <p className="text-[10px] text-text-muted">{lbl("y generará 3 pasos accionables con competencia, acción y tiempo estimado", "and generate 3 actionable steps with competency, action, and estimated time")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proximosPasos.map((paso, i) => (
                <div key={i} className="flex items-start gap-3 bg-background rounded-xl border border-card-border px-4 py-3">
                  <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${compColor(paso.competencia as CompKey)}`}>
                        {paso.competencia}
                      </span>
                      <span className="text-[10px] text-text-muted bg-card border border-card-border px-2 py-0.5 rounded-full">
                        {paso.tiempo}
                      </span>
                    </div>
                    <p className="text-[12px] font-semibold text-text-primary mb-0.5">{paso.accion}</p>
                    <p className="text-[10px] text-text-muted leading-relaxed">{paso.descripcion}</p>
                  </div>
                  <button
                    onClick={() => handleRegenerarPaso(i)}
                    disabled={generandoPaso !== null}
                    title="Regenerar este paso"
                    className="flex items-center gap-1 text-[9px] font-semibold text-text-muted hover:text-accent-text border border-card-border bg-card px-2 py-1 rounded-lg cursor-pointer hover:border-accent-text/30 transition-all disabled:opacity-40 flex-shrink-0"
                  >
                    {generandoPaso === i
                      ? <RefreshCw size={9} className="animate-spin" />
                      : <RefreshCw size={9} />
                    }
                    Otro
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Competency growth overview */}
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-accent-text" />
            <span className="text-[13px] font-semibold text-text-primary">{lbl("Crecimiento en competencias", "Competency growth")}</span>
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

        {/* S18: Reflexión semanal IA */}
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-accent-text" />
            <span className="text-[13px] font-semibold text-text-primary">{lbl("Reflexión semanal", "Weekly reflection")}</span>
            <span className="text-[10px] text-text-muted ml-1">Semana 3 · Proyecto Airbnb Málaga</span>
            <button
              onClick={handleGenerarReflexion}
              disabled={isGenerandoReflexion}
              className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-accent-text bg-accent-light border border-accent/30 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={10} className={isGenerandoReflexion ? "animate-spin" : ""} />
              {isGenerandoReflexion ? lbl("Generando...", "Generating...") : reflexionBullets ? lbl("Regenerar", "Regenerate") : lbl("Generar reflexión de la semana", "Generate weekly reflection")}
            </button>
          </div>
          {!reflexionBullets && !isGenerandoReflexion && (
            <div className="bg-background rounded-xl px-4 py-5 flex flex-col items-center gap-2">
              <Sparkles size={20} className="text-text-muted" />
              <p className="text-[11px] text-text-muted text-center">
                {lbl("Genera tu reflexión semanal: 3 aprendizajes clave de esta semana, construidos a partir de tu actividad en el proyecto.", "Generate your weekly reflection: 3 key learnings from this week, built from your project activity.")}
              </p>
            </div>
          )}
          {isGenerandoReflexion && (
            <div className="bg-background rounded-xl px-4 py-4 flex items-center gap-3">
              <RefreshCw size={14} className="text-accent-text animate-spin flex-shrink-0" />
              <span className="text-[11px] text-text-secondary">{lbl("Analizando tu semana de trabajo...", "Analyzing your work week...")}</span>
            </div>
          )}
          {reflexionBullets && (
            <div className="space-y-2">
              {reflexionBullets.map((bullet, i) => {
                const isOpen = expandedBullets.has(i);
                const nota = notasReflexion[i] ?? "";
                const labels = [lbl("Aprendizaje principal", "Main learning"), lbl("Competencia aplicada", "Applied competency"), lbl("Lección del error", "Lesson from error")];
                return (
                  <div key={i} className={`rounded-xl border transition-all ${isOpen ? "border-accent-text/30 bg-accent-light" : "border-card-border bg-background"}`}>
                    <button
                      onClick={() => toggleBullet(i)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wide block mb-0.5">{labels[i]}</span>
                        <p className={`text-[11px] leading-relaxed ${isOpen ? "text-accent-text font-medium" : "text-text-primary"}`}>{bullet}</p>
                      </div>
                      {isOpen
                        ? <ChevronUp size={12} className="text-accent-text flex-shrink-0 mt-1" />
                        : <ChevronDown size={12} className="text-text-muted flex-shrink-0 mt-1" />
                      }
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3">
                        <p className="text-[9px] font-semibold text-accent-text uppercase tracking-wide mb-1.5">{lbl("Mi nota personal", "My personal note")}</p>
                        <textarea
                          value={nota}
                          onChange={(e) => setNotasReflexion((prev) => ({ ...prev, [i]: e.target.value }))}
                          placeholder={lbl("Añade tu propio pensamiento sobre este aprendizaje...", "Add your own thought on this learning...")}
                          rows={2}
                          className="w-full text-[11px] text-text-primary bg-card border border-accent-text/20 rounded-xl px-3 py-2 outline-none focus:border-accent-text/50 resize-none transition-colors placeholder:text-text-muted"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* S14: Línea del tiempo del proyecto */}
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <GitCommit size={14} className="text-accent-text" />
            <span className="text-[13px] font-semibold text-text-primary">{lbl("Línea del tiempo del proyecto", "Project timeline")}</span>
            <span className="ml-auto text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full">
              {timelineHitos.filter((h) => h.completado).length}/{timelineHitos.length} {lbl("hitos completados", "milestones completed")}
            </span>
          </div>
          <div className="relative pl-6">
            {/* Connecting line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent-text/40 to-warning/30" />
            <div className="space-y-3">
              {timelineHitos.map((h, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <div className={`absolute -left-[19px] w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    h.completado
                      ? "bg-success border-success"
                      : "bg-warning-light border-warning"
                  }`}>
                    {h.completado
                      ? <span className="text-white text-[7px] font-black">✓</span>
                      : <span className="text-warning text-[7px] font-black">→</span>
                    }
                  </div>
                  {/* Card */}
                  <div className={`rounded-xl px-3 py-2.5 ${
                    h.completado ? "bg-background" : "bg-warning-light border border-warning/20"
                  }`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[12px] font-semibold ${h.completado ? "text-text-primary" : "text-text-primary"}`}>
                        {h.titulo}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <TrendingUp size={9} className="text-accent-text" />
                        <span className="text-[10px] font-bold text-accent-text">+{h.xp} XP</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-text-muted">{h.fecha} · {h.fase}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${compColor(h.competencia)}`}>
                        {h.competencia}
                      </span>
                      {!h.completado && (
                        <span className="text-[8px] font-bold bg-warning text-white px-1.5 py-0.5 rounded-full">Próximo</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S15: Mi impacto real */}
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Award size={14} className="text-accent-text" />
            <span className="text-[13px] font-semibold text-text-primary">{lbl("Mi impacto real", "My real impact")}</span>
            <span className="ml-auto text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full">
              Casa Limón · Airbnb Málaga
            </span>
          </div>
          <p className="text-[11px] text-text-muted mb-4">Métricas reales del proyecto al finalizar la Semana 3</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-success-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={14} className="text-success" />
                <span className="text-[11px] font-semibold text-text-primary">Ocupación media lograda</span>
              </div>
              <p className="text-[28px] font-bold text-success leading-none mb-1">72%</p>
              <p className="text-[10px] text-text-muted">vs 45% de media del sector en Málaga</p>
              <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: "72%" }} />
              </div>
            </div>
            <div className="bg-accent-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-accent-text" />
                <span className="text-[11px] font-semibold text-text-primary">Ingresos proyectados</span>
              </div>
              <p className="text-[28px] font-bold text-accent-text leading-none mb-1">1.850€</p>
              <p className="text-[10px] text-text-muted">al mes · a partir del mes 3 de operación</p>
              <p className="text-[9px] text-text-muted mt-1">Punto de equilibrio: 20 pisos × 150€/mes</p>
            </div>
            <div className="bg-warning-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="text-warning" />
                <span className="text-[11px] font-semibold text-text-primary">Reseñas positivas</span>
              </div>
              <p className="text-[28px] font-bold text-text-primary leading-none mb-1">14 <span className="text-[14px] text-text-muted font-normal">de 15</span></p>
              <p className="text-[10px] text-text-muted">reseñas simuladas en el listing de prueba</p>
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < 14 ? "bg-warning" : "bg-background"}`} />
                ))}
              </div>
            </div>
            <div className="bg-sidebar rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-accent" />
                <span className="text-[11px] font-semibold text-white">Ranking en su zona</span>
              </div>
              <p className="text-[28px] font-bold text-accent leading-none mb-1">Top 8%</p>
              <p className="text-[10px] text-white/60">de Málaga Centro Histórico</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Users size={10} className="text-white/40" />
                <span className="text-[9px] text-white/40">Entre 1.200 listings registrados en la zona</span>
              </div>
            </div>
          </div>
        </div>

        {/* C23: Proyección a 12 meses */}
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-accent-text" />
            <span className="text-[13px] font-semibold text-text-primary">{lbl("Proyección a 12 meses", "12-month projection")}</span>
            <span className="ml-auto text-[9px] font-bold bg-background text-text-muted px-2 py-0.5 rounded-full border border-card-border">
              {lbl("IA · Casa Limón", "AI · Casa Limón")}
            </span>
          </div>
          <p className="text-[11px] text-text-muted mb-4">{lbl("Simula el impacto financiero de tu Airbnb en 3 escenarios realistas", "Simulate the financial impact of your Airbnb in 3 realistic scenarios")}</p>

          {!proyeccionVisible ? (
            <button
              onClick={async () => {
                setProyeccionVisible(true);
                setLoadingProyeccion(true);
                setProyeccionGuardada(false);
                try {
                  const res = await fetch("/api/tutor-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      mode: "narrativa",
                      message: "Genera 3 escenarios financieros para Casa Limón (Airbnb Málaga) a 12 meses: conservador (40% ocupación), realista (65%), optimista (85%). Precio base 85€/noche, gastos fijos 400€/mes. Devuelve SOLO un JSON con este formato exacto: {\"conservador\":[n1,n2,...n12],\"realista\":[n1,...n12],\"optimista\":[n1,...n12]} — ingresos netos mensuales en euros enteros.",
                      history: [],
                    }),
                  });
                  const data = await res.json();
                  const match = data.reply?.match(/\{[\s\S]*\}/);
                  if (match) {
                    const parsed = JSON.parse(match[0]);
                    if (parsed.conservador && parsed.realista && parsed.optimista) {
                      setProyeccionData(parsed);
                      setLoadingProyeccion(false);
                      return;
                    }
                  }
                } catch { /* fallback */ }
                // Fallback mock realista
                setProyeccionData({
                  conservador: [310, 320, 340, 360, 380, 400, 410, 420, 410, 395, 380, 370],
                  realista:    [650, 680, 720, 760, 800, 850, 870, 860, 820, 790, 760, 740],
                  optimista:   [1050, 1100, 1180, 1240, 1300, 1380, 1410, 1390, 1320, 1270, 1220, 1200],
                });
                setLoadingProyeccion(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-accent-light text-accent-text text-[12px] font-bold py-3 rounded-xl border border-accent/20 hover:brightness-95 transition-all cursor-pointer"
            >
              <Sparkles size={14} />
              {lbl("¿Qué pasaría si...? — Generar proyección IA", "What if...? — Generate AI projection")}
            </button>
          ) : loadingProyeccion ? (
            <div className="flex items-center justify-center gap-3 py-8">
              <RefreshCw size={16} className="text-accent-text animate-spin" />
              <span className="text-[12px] text-text-muted">{lbl("Calculando escenarios con datos de Casa Limón…", "Calculating scenarios with Casa Limón data…")}</span>
            </div>
          ) : proyeccionData ? (() => {
            const meses = ["Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar"];
            const maxVal = Math.max(...proyeccionData.optimista);
            const escenarios = [
              { key: "conservador" as const, label: "Conservador (40%)",  color: "bg-urgent",     textColor: "text-urgent",     bg: "bg-urgent-light"   },
              { key: "realista"    as const, label: "Realista (65%)",     color: "bg-warning",    textColor: "text-text-primary", bg: "bg-warning-light"  },
              { key: "optimista"  as const, label: "Optimista (85%)",    color: "bg-success",    textColor: "text-success",     bg: "bg-success-light"  },
            ];
            return (
              <div>
                {/* Resumen KPIs */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {escenarios.map((e) => {
                    const anual = proyeccionData[e.key].reduce((s, v) => s + v, 0);
                    const media = Math.round(anual / 12);
                    return (
                      <div key={e.key} className={`rounded-xl p-3 ${e.bg}`}>
                        <p className={`text-[9px] font-bold ${e.textColor} mb-1`}>{e.label}</p>
                        <p className={`text-[20px] font-black ${e.textColor} leading-none`}>{media}€</p>
                        <p className="text-[9px] text-text-muted">/ mes · {anual.toLocaleString()}€ anual</p>
                      </div>
                    );
                  })}
                </div>

                {/* Barras mensuales por escenario */}
                {escenarios.map((e) => (
                  <div key={e.key} className="mb-4">
                    <p className={`text-[10px] font-semibold ${e.textColor} mb-2`}>{e.label}</p>
                    <div className="flex items-end gap-1 h-16">
                      {proyeccionData[e.key].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                          <div
                            className={`w-full rounded-sm ${e.color}`}
                            style={{ height: `${Math.max(6, (val / maxVal) * 56)}px` }}
                            title={`${meses[i]}: ${val}€`}
                          />
                          <span className="text-[7px] text-text-muted">{meses[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Nota metodológica */}
                <div className="bg-background rounded-xl p-3 mb-4">
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    <strong>Metodología:</strong> Ingresos = ocupación × 30 noches × 85€. Gastos fijos: 400€/mes. Los primeros 3 meses incluyen curva de visibilidad del listing en Airbnb.
                  </p>
                </div>

                {/* Botones */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setProyeccionGuardada(true)}
                    className={`flex-1 flex items-center justify-center gap-2 text-[11px] font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
                      proyeccionGuardada
                        ? "bg-success-light text-success"
                        : "bg-sidebar text-white hover:brightness-110"
                    }`}
                  >
                    {proyeccionGuardada
                      ? <><CheckCircle2 size={13} /> {lbl("Guardado en portfolio", "Saved to portfolio")}</>
                      : <><Award size={13} /> {lbl("Guardar proyección en portfolio", "Save projection to portfolio")}</>
                    }
                  </button>
                  <button
                    onClick={() => { setProyeccionVisible(false); setProyeccionData(null); setProyeccionGuardada(false); }}
                    className="px-4 py-2.5 rounded-xl text-[11px] text-text-muted bg-background border border-card-border hover:text-text-secondary transition-all cursor-pointer"
                  >
                    {lbl("Cerrar", "Close")}
                  </button>
                </div>
                {proyeccionGuardada && (
                  <p className="text-[10px] text-success mt-2 text-center">
                    Proyección guardada el {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            );
          })() : null}
        </div>

        {/* S16: Evidencias destacadas */}
        <div className="bg-card rounded-2xl border border-card-border p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Star size={14} className="text-accent-text" />
            <span className="text-[13px] font-semibold text-text-primary">{lbl("Evidencias destacadas", "Featured evidence")}</span>
            <span className="ml-auto text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full">
              {lbl("4 seleccionadas", "4 selected")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {evidenciasDestacadas.map((ev) => {
              const isExpanded = expandedEvidencia === ev.id;
              const EvidenciaIcon = ev.icono === "spreadsheet" ? BarChart3 : ev.icono === "image" ? FileImage : FileText;
              return (
                <div
                  key={ev.id}
                  className={`rounded-xl border transition-all cursor-pointer ${isExpanded ? "border-accent-text/30 bg-accent-light" : "border-card-border bg-background hover:border-accent-text/20"}`}
                  onClick={() => setExpandedEvidencia(isExpanded ? null : ev.id)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isExpanded ? "bg-accent-text" : "bg-card border border-card-border"}`}>
                          <EvidenciaIcon size={13} className={isExpanded ? "text-accent" : "text-text-muted"} />
                        </div>
                        <div>
                          <span className="text-[9px] text-text-muted block">{ev.tipo}</span>
                          <span className="text-[8px] font-bold bg-warning-light text-warning px-1.5 py-0.5 rounded-full">{lbl("Destacada", "Featured")}</span>
                        </div>
                      </div>
                      {isExpanded
                        ? <ChevronUp size={12} className="text-accent-text flex-shrink-0 mt-0.5" />
                        : <ChevronDown size={12} className="text-text-muted flex-shrink-0 mt-0.5" />
                      }
                    </div>
                    <p className={`text-[11px] font-semibold leading-snug mb-1 ${isExpanded ? "text-accent-text" : "text-text-primary"}`}>
                      {ev.titulo}
                    </p>
                    <p className="text-[10px] text-text-muted leading-relaxed">{ev.descripcionCorta}</p>
                    <span className={`inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${compColor(ev.competencia)}`}>
                      {ev.competencia}
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-accent-text/10 pt-2.5" onClick={(e) => e.stopPropagation()}>
                      <p className="text-[11px] text-text-secondary leading-relaxed mb-3">{ev.descripcionCompleta}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-accent-text hover:underline cursor-pointer">
                          <ExternalLink size={11} />
                          {lbl("Ver en galería", "View in gallery")}
                        </button>
                        <button
                          onClick={() => setQrVisible(qrVisible === ev.id ? null : ev.id)}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary bg-background hover:bg-card border border-card-border px-2 py-1 rounded-lg cursor-pointer transition-all"
                        >
                          <QrCode size={11} />
                          {qrVisible === ev.id ? lbl("Ocultar QR", "Hide QR") : lbl("Ver QR", "View QR")}
                        </button>
                        <button
                          onClick={() => handleImprimirTarjeta(ev)}
                          disabled={imprimiendoTarjeta === ev.id}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-sidebar hover:brightness-110 px-2.5 py-1 rounded-lg cursor-pointer transition-all disabled:opacity-60"
                        >
                          {imprimiendoTarjeta === ev.id
                            ? <><RefreshCw size={10} className="animate-spin" />{lbl("Generando…", "Generating…")}</>
                            : <><Printer size={10} />{lbl("Imprimir tarjeta", "Print card")}</>
                          }
                        </button>
                      </div>
                      {/* QR mock SVG */}
                      {qrVisible === ev.id && (() => {
                        const seed = ev.id.charCodeAt(2) ?? 1;
                        const cells: number[] = [];
                        for (let i = 0; i < 49; i++) {
                          cells.push(((seed * (i + 7) * 13) % 17) < 9 ? 1 : 0);
                        }
                        [0,1,6,7,42,43,48].forEach((idx) => { cells[idx] = 1; });
                        const portfolioUrl = `qhuma.es/portfolio/lucas-garcia/ev-${ev.id}`;
                        return (
                          <div className="mt-3 bg-background rounded-xl p-3 border border-card-border flex items-center gap-4">
                            <div className="flex-shrink-0 bg-white p-2 rounded-lg border border-card-border">
                              <svg width="64" height="64" viewBox="0 0 7 7" shapeRendering="crispEdges">
                                {cells.map((v, i) => v ? (
                                  <rect key={i} x={i % 7} y={Math.floor(i / 7)} width="1" height="1" fill="#1f514c" />
                                ) : null)}
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-semibold text-text-primary mb-0.5">{lbl("Código QR de la evidencia", "Evidence QR code")}</p>
                              <p className="text-[9px] text-text-muted leading-relaxed mb-1">{lbl("Escanea para acceder a esta evidencia directamente en el portfolio público de Lucas García.", "Scan to access this evidence directly in Lucas García's public portfolio.")}</p>
                              <p className="text-[9px] font-mono text-accent-text truncate">{portfolioUrl}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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

        {/* S21 — Mis errores → Mis aprendizajes */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <GitCommit size={15} className="text-accent-text" />
            <h2 className="text-[16px] font-bold text-text-primary">{lbl("Mis errores → Mis aprendizajes", "My mistakes → My learnings")}</h2>
            <span className="text-[10px] bg-success-light text-success font-bold px-2 py-0.5 rounded-full ml-auto">
              {superadosSet.size}/{errorLog.length} {lbl("superados", "overcome")}
            </span>
          </div>
          <p className="text-[11px] text-text-muted mb-4 leading-relaxed">
            {lbl("Cada error es una evidencia de pensamiento iterativo. No se penaliza — se analiza y se supera.", "Each mistake is evidence of iterative thinking. Not penalized — analyzed and overcome.")}
          </p>
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-card-border" />
            <div className="space-y-4">
            {errorLog.map((entry, idx) => {
              const isOpen = expandedErrors.has(entry.id);
              const isSuperado = superadosSet.has(entry.id);
              const progreso = compProgress[entry.competency];
              const isConfirmando = confirmandoSuperacion === entry.id;
              return (
                <div key={entry.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className={`absolute left-2 top-4 w-4 h-4 rounded-full flex items-center justify-center border-2 z-10 ${
                    isSuperado ? "bg-success border-success" : "bg-background border-card-border"
                  }`}>
                    {isSuperado
                      ? <span className="text-white text-[8px] font-bold">✓</span>
                      : <span className="text-text-muted text-[8px] font-bold">{idx + 1}</span>
                    }
                  </div>
                <div className={`rounded-2xl border ${isSuperado ? "border-success/20 bg-success-light/30" : entry.resolved ? "border-card-border bg-card" : "border-urgent/20 bg-urgent-light"}`}>
                  <button
                    onClick={() => toggleError(entry.id)}
                    className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSuperado ? "bg-success" : entry.resolved ? "bg-success-light" : "bg-urgent-light border border-urgent/20"}`}>
                      {isSuperado
                        ? <span className="text-white text-[13px]">✓</span>
                        : entry.resolved
                          ? <RefreshCw size={13} className="text-success" />
                          : <AlertCircle size={13} className="text-urgent" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[12px] font-semibold ${isSuperado ? "text-success line-through opacity-70" : "text-text-primary"}`}>{entry.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${compColor(entry.competency)}`}>{entry.competency}</span>
                        {isSuperado && <span className="text-[9px] text-success font-semibold">{lbl("Superado", "Overcome")}</span>}
                        {!isSuperado && entry.resolved && <span className="text-[9px] text-success font-semibold">✓ {lbl("Resuelto", "Resolved")}</span>}
                      </div>
                      <span className="text-[10px] text-text-muted">{entry.date} · {entry.phase}</span>
                    </div>
                    {isOpen ? <ChevronUp size={14} className="text-text-muted flex-shrink-0" /> : <ChevronDown size={14} className="text-text-muted flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-2.5">
                      {[
                        { label: lbl("¿Qué asumí?", "What did I assume?"), value: entry.asumí, color: "text-warning", bg: "bg-warning-light border-warning/20" },
                        { label: lbl("¿Dónde falló?", "Where did it fail?"), value: entry.falló, color: "text-urgent", bg: "bg-urgent-light border-urgent/20" },
                        { label: lbl("¿Qué cambiaría?", "What would I change?"), value: entry.cambiaría, color: "text-accent-text", bg: "bg-accent-light border-accent-text/20" },
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
                            <span className="text-[9px] font-bold uppercase tracking-wide text-accent-text">{lbl("Preguntas de reflexión IA", "AI reflection questions")}</span>
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
                            {lbl("Regenerar preguntas", "Regenerate questions")}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAnalizarError(entry)}
                          disabled={loadingReflexion !== null}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-accent/30 text-accent-text text-[11px] font-semibold hover:bg-accent-light transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingReflexion === entry.id ? (
                            <><RefreshCw size={11} className="animate-spin" />{lbl("Analizando con IA…", "Analyzing with AI…")}</>
                          ) : (
                            <><Sparkles size={11} />{lbl("Analizar con IA · 3 preguntas de reflexión", "Analyze with AI · 3 reflection questions")}</>
                          )}
                        </button>
                      )}
                      {/* S21 — Progreso de superación y botón */}
                      <div className="rounded-xl border border-card-border bg-background p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold uppercase tracking-wide text-text-muted">{lbl("Progreso competencia", "Competency progress")} · {entry.competency}</span>
                          <span className="text-[9px] font-bold text-text-primary">{progreso.before}% → {progreso.after}%</span>
                        </div>
                        <div className="relative h-2 bg-card-border rounded-full overflow-hidden mb-3">
                          <div className="absolute left-0 top-0 h-full bg-warning/40 rounded-full" style={{ width: `${progreso.before}%` }} />
                          <div className="absolute left-0 top-0 h-full bg-success rounded-full transition-all" style={{ width: `${progreso.after}%` }} />
                        </div>
                        {superacionMensaje[entry.id] ? (
                          <div className="flex items-start gap-2 bg-success-light rounded-xl px-3 py-2">
                            <Sparkles size={11} className="text-success flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-success leading-relaxed">{superacionMensaje[entry.id]}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleMarcarSuperado(entry)}
                            disabled={isSuperado || isConfirmando}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                              isSuperado
                                ? "bg-success-light text-success cursor-default"
                                : "bg-success text-white hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                            }`}
                          >
                            {isConfirmando ? (
                              <><RefreshCw size={11} className="animate-spin" />{lbl("Confirmando con IA…", "Confirming with AI…")}</>
                            ) : isSuperado ? (
                              <>{lbl("Ya superado", "Already overcome")}</>
                            ) : (
                              <>{lbl("Marcar como superado", "Mark as overcome")}</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* End C25 narrative view wrapper */}
        </>}

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
              <span className="text-text-muted">{lbl("Proyecto", "Project")}</span>
              <span className="font-semibold text-text-primary">Airbnb Málaga</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">{lbl("Progreso global", "Overall progress")}</span>
              <span className="font-bold text-success">72%</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">{lbl("Q-Coins ganadas", "Q-Coins earned")}</span>
              <span className="font-bold text-accent-text">340 QC</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">{lbl("Racha actual", "Current streak")}</span>
              <span className="font-bold text-warning">12 {lbl("días", "days")} 🔥</span>
            </div>
          </div>
        </div>

        {/* S17: Competencia del mes */}
        {(() => {
          const topComp = (Object.keys(compProgress) as CompKey[]).reduce((best, c) =>
            compProgress[c].after - compProgress[c].before > compProgress[best].after - compProgress[best].before ? c : best
          , "CLC" as CompKey);
          const { before, after } = compProgress[topComp];
          const gain = after - before;
          const semanas = competenciaMesSemanal[topComp];
          const maxVal = Math.max(...semanas);
          const reto = retosPersonalizados[topComp];
          return (
            <div className="bg-card rounded-2xl border border-card-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-success" />
                <span className="text-[11px] font-bold text-success">{lbl("Competencia del mes", "Competency of the month")}</span>
                <span className="ml-auto text-[9px] font-bold bg-success-light text-success px-2 py-0.5 rounded-full">+{gain}%</span>
              </div>
              <p className="text-[13px] font-bold text-text-primary mb-0.5">{topComp} — {compFull[topComp]}</p>
              <p className="text-[10px] text-text-muted mb-3">{before}% → {after}% · {lbl("Mayor crecimiento", "Highest growth")}</p>
              {/* Gráfico semanal CSS */}
              <div className="mb-3">
                <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wide block mb-1.5">{lbl("Progreso semanal", "Weekly progress")}</span>
                <div className="flex items-end gap-1.5 h-14">
                  {semanas.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <span className="text-[8px] font-bold text-accent-text tabular-nums">{val}%</span>
                      <div className="w-full bg-background rounded-t-sm overflow-hidden" style={{ height: "36px" }}>
                        <div
                          className="w-full bg-success rounded-t-sm transition-all"
                          style={{ height: `${(val / maxVal) * 100}%` }}
                        />
                      </div>
                      <span className="text-[7px] text-text-muted">S{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Reto de la semana */}
              <div className="bg-accent-light rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Lightbulb size={10} className="text-accent-text flex-shrink-0" />
                  <span className="text-[9px] font-bold text-accent-text uppercase tracking-wide">{lbl("Reto para la semana siguiente", "Challenge for next week")}</span>
                </div>
                <p className="text-[10px] text-text-secondary leading-relaxed">{reto}</p>
              </div>
            </div>
          );
        })()}

        {/* Awards */}
        <div className="bg-card rounded-2xl border border-card-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={13} className="text-accent-text" />
            <span className="text-[11px] font-bold text-text-primary">{lbl("Logros en este proyecto", "Achievements in this project")}</span>
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
            <span className="text-[11px] font-bold text-accent-text">{lbl("Nota de la mentora", "Mentor's note")}</span>
          </div>
          <p className="text-[11px] text-accent-text leading-relaxed italic">
            "Lucas ha demostrado una capacidad emprendedora excepcional. Su evolución en presentaciones públicas ha sido la mayor sorpresa del trimestre."
          </p>
          <p className="text-[9px] text-text-muted mt-2 text-right">— Prof. Ana Martínez</p>
        </div>

        {/* C27 — Insignias de habilidad */}
        {(() => {
          const insignias: {
            id: string;
            comp: CompKey;
            nombre: string;
            icono: string;
            progreso: number;
            evidenciaKey: string;
            momento: string;
          }[] = [
            { id: "clc", comp: "CLC", nombre: lbl("Comunicador", "Communicator"), icono: "💬", progreso: 72, evidenciaKey: lbl("Guía de bienvenida Casa Limón", "Casa Limón welcome guide"), momento: lbl("Escribiste el primer documento oficial de tu proyecto con claridad y registro formal.", "You wrote the first official document of your project with clarity and formal register.") },
            { id: "cpl", comp: "CPL", nombre: lbl("Plurilingüe", "Plurilingual"), icono: "🌍", progreso: 58, evidenciaKey: lbl("FAQ bilingüe inglés/español", "Bilingual FAQ English/Spanish"), momento: lbl("Redactaste el FAQ en dos idiomas sin traductor automático.", "You wrote the FAQ in two languages without an automatic translator.") },
            { id: "stem", comp: "STEM", nombre: lbl("Analista", "Analyst"), icono: "📊", progreso: 85, evidenciaKey: lbl("Modelo financiero Casa Limón", "Casa Limón financial model"), momento: lbl("Calculaste el punto de equilibrio real con 3 escenarios de ocupación.", "You calculated the real break-even point with 3 occupancy scenarios.") },
            { id: "cd", comp: "CD", nombre: lbl("Digital", "Digital"), icono: "💻", progreso: 88, evidenciaKey: lbl("Landing page del proyecto", "Project landing page"), momento: lbl("Publicaste la primera página web funcional de tu Airbnb.", "You published the first functional web page of your Airbnb.") },
            { id: "cpsaa", comp: "CPSAA", nombre: lbl("Reflexivo", "Reflective"), icono: "🧠", progreso: 74, evidenciaKey: lbl("Error Log — cálculo de tarifas", "Error Log — rate calculation"), momento: lbl("Documentaste tu primer error como oportunidad de aprendizaje.", "You documented your first error as a learning opportunity.") },
            { id: "cc", comp: "CC", nombre: lbl("Ciudadano", "Citizen"), icono: "⚖️", progreso: 68, evidenciaKey: lbl("Informe normativa municipal", "Municipal regulations report"), momento: lbl("Analizaste la normativa de alquiler vacacional de Málaga.", "You analyzed Málaga's vacation rental regulations.") },
            { id: "ce", comp: "CE", nombre: lbl("Emprendedor", "Entrepreneur"), icono: "🚀", progreso: 90, evidenciaKey: lbl("Estrategia de precios temporada alta", "High season pricing strategy"), momento: lbl("Diseñaste la primera estrategia de precios dinámica con datos reales del sector.", "You designed the first dynamic pricing strategy with real industry data.") },
            { id: "ccec", comp: "CCEC", nombre: lbl("Creativo", "Creative"), icono: "🎨", progreso: 55, evidenciaKey: lbl("Brand board Casa Limón", "Casa Limón brand board"), momento: lbl("Creaste la identidad visual completa de tu marca.", "You created the complete visual identity for your brand.") },
          ];

          const desbloqueadas = insignias.filter((b) => b.progreso >= 70);
          const enProgreso = insignias.filter((b) => b.progreso >= 40 && b.progreso < 70);

          const handleExportarBadges = () => {
            setExportandoBadges(true);
            setTimeout(() => {
              const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Insignias de habilidad — Lucas García</title><style>body{font-family:Inter,sans-serif;background:#f4f0e9;padding:32px;max-width:700px;margin:auto}.title{font-size:22px;font-weight:700;color:#141414;margin-bottom:4px}.sub{font-size:13px;color:#666;margin-bottom:24px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.badge{background:#fff;border-radius:16px;padding:12px;text-align:center;border:1px solid #ededed}.badge-icon{font-size:28px;margin-bottom:6px}.badge-name{font-size:11px;font-weight:700;color:#141414}.badge-comp{font-size:9px;color:#2f574d;background:#edffe3;padding:2px 6px;border-radius:20px;margin-top:4px;display:inline-block}.badge-date{font-size:9px;color:#9ca3af;margin-top:4px}.locked{opacity:0.4}</style></head><body><p class="title">Insignias de habilidad — Lucas García</p><p class="sub">Proyecto: Airbnb Málaga / Casa Limón · 1º ESO</p><div class="grid">${insignias.map((b) => `<div class="badge ${b.progreso < 70 ? 'locked' : ''}"><div class="badge-icon">${b.icono}</div><div class="badge-name">${b.nombre}</div><div class="badge-comp">${b.comp}</div>${b.progreso >= 70 ? '<div class="badge-date">Obtenida el 3 mar</div>' : `<div class="badge-date">${b.progreso}%</div>`}</div>`).join("")}</div></body></html>`;
              const blob = new Blob([html], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "insignias_lucas_garcia.html";
              a.click();
              URL.revokeObjectURL(url);
              setExportandoBadges(false);
              setBadgesExportadas(true);
              setTimeout(() => setBadgesExportadas(false), 3500);
            }, 1200);
          };

          return (
            <div className="bg-card rounded-2xl border border-card-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={12} className="text-accent-text" />
                <span className="text-[11px] font-bold text-text-primary">{lbl("Insignias de habilidad", "Skill badges")}</span>
                <span className="ml-auto text-[9px] font-bold bg-success-light text-success px-1.5 py-0.5 rounded-full">{desbloqueadas.length}/8 {lbl("obtenidas", "earned")}</span>
              </div>

              {/* Desbloqueadas */}
              {desbloqueadas.length > 0 && (
                <div className="mb-3">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">{lbl("Obtenidas", "Earned")}</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {desbloqueadas.map((b) => (
                      <div key={b.id}>
                        <button
                          onClick={() => setBadgeExpandida(badgeExpandida === b.id ? null : b.id)}
                          className="w-full flex items-center gap-2 bg-accent-light rounded-xl px-2.5 py-2 hover:bg-accent/20 transition-all cursor-pointer border border-accent/20 group"
                        >
                          <span className="text-[16px] flex-shrink-0">{b.icono}</span>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-[9px] font-bold text-accent-text truncate">{b.nombre}</p>
                            <p className="text-[8px] text-text-muted">{b.comp} · 3 mar</p>
                          </div>
                          <CheckCircle2 size={10} className="text-success flex-shrink-0" />
                        </button>
                        {badgeExpandida === b.id && (
                          <div className="mt-1 bg-background rounded-xl p-2.5 border border-card-border">
                            <p className="text-[9px] font-semibold text-text-primary mb-1">{b.evidenciaKey}</p>
                            <p className="text-[9px] text-text-muted leading-relaxed mb-2">{b.momento}</p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`¡He obtenido la insignia ${b.nombre} (${b.comp}) en QHUMA OS! Proyecto: Airbnb Málaga / Casa Limón. https://qhuma.es/portfolio/lucas-garcia`);
                              }}
                              className="flex items-center gap-1 text-[8px] font-bold text-accent-text hover:underline cursor-pointer"
                            >
                              <Share2 size={9} />
                              {lbl("Compartir", "Share")}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* En progreso */}
              {enProgreso.length > 0 && (
                <div className="mb-3">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">{lbl("En progreso", "In progress")}</span>
                  <div className="space-y-1.5">
                    {enProgreso.map((b) => {
                      const evFaltantes = Math.ceil((70 - b.progreso) / 8);
                      return (
                        <div key={b.id} className="flex items-center gap-2 bg-background rounded-xl px-2.5 py-2 border border-card-border">
                          <span className="text-[14px] opacity-60 flex-shrink-0">{b.icono}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-[9px] font-semibold text-text-secondary">{b.nombre}</span>
                              <span className="text-[8px] text-text-muted">{b.progreso}%</span>
                            </div>
                            <div className="h-1 bg-card-border rounded-full overflow-hidden">
                              <div className="h-full bg-warning rounded-full" style={{ width: `${b.progreso}%` }} />
                            </div>
                            <p className="text-[8px] text-text-muted mt-0.5">{evFaltantes} {lbl("evidencias más", "more evidence")}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bloqueadas */}
              {((): React.ReactNode => {
                const bloqueadas = insignias.filter((b) => b.progreso < 40);
                if (bloqueadas.length === 0) return null;
                return (
                  <div className="mb-3">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">{lbl("Bloqueadas", "Locked")}</span>
                    <div className="grid grid-cols-4 gap-1">
                      {bloqueadas.map((b) => (
                        <div key={b.id} className="flex flex-col items-center gap-1 opacity-40">
                          <div className="relative">
                            <span className="text-[18px]">{b.icono}</span>
                            <Lock size={8} className="absolute -bottom-0.5 -right-0.5 text-text-muted" />
                          </div>
                          <span className="text-[7px] text-text-muted text-center">{b.comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Exportar */}
              <button
                onClick={handleExportarBadges}
                disabled={exportandoBadges}
                className={`w-full flex items-center justify-center gap-2 text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer ${
                  badgesExportadas
                    ? "bg-success-light text-success"
                    : "bg-sidebar text-accent hover:brightness-110"
                } disabled:opacity-50`}
              >
                {exportandoBadges ? (
                  <><RefreshCw size={10} className="animate-spin" />{lbl("Generando…", "Generating…")}</>
                ) : badgesExportadas ? (
                  <><CheckCircle2 size={10} />{lbl("Tarjeta exportada", "Card exported")}</>
                ) : (
                  <><Download size={10} />{lbl("Exportar insignias", "Export badges")}</>
                )}
              </button>
            </div>
          );
        })()}

        {/* ── C32: Balance financiero del proyecto ─────────────────────────── */}
        {(() => {
          const ingresos = [
            { concepto: lbl("Alquiler (3 sem. × 7 noches × 85 €/noche)", "Rental (3 wk × 7 nights × €85/night)"), importe: 1785 },
            { concepto: lbl("Extras (early check-in, parking, kit bienvenida)", "Extras (early check-in, parking, welcome kit)"), importe: 147 },
          ];
          const costes = [
            { concepto: lbl("Comisión plataforma (15%)", "Platform fee (15%)"), importe: 290 },
            { concepto: lbl("Limpieza (3 servicios)", "Cleaning (3 services)"), importe: 75 },
            { concepto: lbl("Suministros y reposición", "Supplies and restocking"), importe: 48 },
            { concepto: lbl("WiFi + streaming", "WiFi + streaming"), importe: 20 },
            { concepto: lbl("Imprevistos (5%)", "Contingency (5%)"), importe: 97 },
          ];
          const totalIngresos = ingresos.reduce((s, r) => s + r.importe, 0);
          const totalCostes = costes.reduce((s, r) => s + r.importe, 0);
          const beneficio = totalIngresos - totalCostes;
          const margen = Math.round((beneficio / totalIngresos) * 100);
          const inversionInicial = 1200;
          const roi = Math.round((beneficio / inversionInicial) * 100);
          return (
            <div className="bg-card rounded-2xl border border-card-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Coins size={13} className="text-[#F59E0B]" />
                <span className="text-[11px] font-bold text-text-primary">{lbl("Balance financiero — T1", "Financial balance — T1")}</span>
                <span className="text-[9px] font-semibold text-success bg-success-light px-1.5 py-0.5 rounded-full ml-auto">
                  {lbl("Beneficio", "Profit")} +{beneficio.toLocaleString("es-ES")} €
                </span>
              </div>

              {/* KPI strip */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: lbl("Ingresos", "Revenue"),     value: `${totalIngresos.toLocaleString("es-ES")} €`, color: "text-success",   bg: "bg-success-light"  },
                  { label: lbl("Costes", "Costs"),          value: `${totalCostes.toLocaleString("es-ES")} €`,  color: "text-urgent",    bg: "bg-urgent-light"   },
                  { label: lbl("Margen neto", "Net margin"), value: `${margen}%`,                               color: "text-[#4F8EF7]", bg: "bg-[#eff6ff]"     },
                ].map((k) => (
                  <div key={k.label} className={`rounded-xl p-2.5 ${k.bg} text-center`}>
                    <p className={`text-[13px] font-black ${k.color} leading-none`}>{k.value}</p>
                    <p className={`text-[9px] font-medium mt-0.5 ${k.color} opacity-80`}>{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Income rows */}
              <div className="mb-2">
                <div className="flex items-center gap-1 mb-1.5">
                  <TrendingUp size={10} className="text-success" />
                  <span className="text-[9px] font-bold text-success uppercase tracking-wide">{lbl("Ingresos", "Revenue")}</span>
                </div>
                {ingresos.map((r) => (
                  <div key={r.concepto} className="flex items-center justify-between py-0.5">
                    <span className="text-[9px] text-text-secondary truncate flex-1 pr-2">{r.concepto}</span>
                    <span className="text-[9px] font-semibold text-text-primary flex-shrink-0">{r.importe.toLocaleString("es-ES")} €</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-card-border mb-2" />

              {/* Cost rows */}
              <div className="mb-2">
                <div className="flex items-center gap-1 mb-1.5">
                  <TrendingDown size={10} className="text-urgent" />
                  <span className="text-[9px] font-bold text-urgent uppercase tracking-wide">{lbl("Costes", "Costs")}</span>
                </div>
                {costes.map((r) => (
                  <div key={r.concepto} className="flex items-center justify-between py-0.5">
                    <span className="text-[9px] text-text-secondary truncate flex-1 pr-2">{r.concepto}</span>
                    <span className="text-[9px] font-semibold text-text-primary flex-shrink-0">{r.importe.toLocaleString("es-ES")} €</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-card-border mb-2" />

              {/* Net profit + ROI */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-text-muted">{lbl("Beneficio neto", "Net profit")}</p>
                  <p className="text-[14px] font-black text-success">+{beneficio.toLocaleString("es-ES")} €</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-text-muted">ROI</p>
                  <p className="text-[14px] font-black text-[#4F8EF7]">{roi}%</p>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-accent-light border border-accent/20 px-3 py-2">
                <p className="text-[9px] text-accent-text font-medium leading-snug">
                  {lbl(
                    `Inversión inicial estimada: ${inversionInicial.toLocaleString("es-ES")} € · Por cada euro invertido recuperas ${(roi / 100 + 1).toFixed(2)} €`,
                    `Estimated initial investment: €${inversionInicial.toLocaleString("en-GB")} · For every €1 invested you recover €${(roi / 100 + 1).toFixed(2)}`
                  )}
                </p>
              </div>
            </div>
          );
        })()}

        {/* ── C33: Carta al yo del futuro ──────────────────────────────────── */}
        {(() => {
          const cartaMock = lbl(
            `Querido Lucas del futuro,

Te escribo desde el 11 de marzo de 2026, el día en que terminé el Trimestre 1 de QHUMA OS con un proyecto que nunca olvidaré: "Gestiona tu Airbnb en Málaga — Casa Limón".

Quiero que sepas lo que aprendí porque creo que cuando lo leas, necesitarás recordarlo.

Aprendí que los datos cuentan historias si sabes leerlos. Cuando analicé los precios de Airbnb en Málaga, entendí que el precio no es arbitrario: hay una lógica detrás, y esa lógica se llama demanda, estacionalidad y valor percibido. Lo aprendí porque lo necesitaba, no porque estaba en el temario.

Aprendí que cometer errores no es fracasar. Mi primer modelo financiero tenía el punto de equilibrio mal calculado. En lugar de ocultarlo, lo documenté en mi Error Log. Esa fue la mejor decisión de todo el trimestre: volver atrás, entender dónde falló la lógica, y corregirlo. Ahora sé que el Error Log es mi historial de inteligencia, no de fracasos.

Aprendí que comunicar es tan importante como crear. El día del Demo Day presenté mi proyecto frente a la clase y dos familias invitadas. Estaba nervioso, pero gracias al PitchLab había ensayado lo suficiente. Cuando terminé y vi que la gente entendía mi idea, sentí algo que ningún examen me había dado.

Lo que más me enorgullece: que Casa Limón generaría un beneficio neto de 1.402 € con un ROI del 116% sobre la inversión inicial. Eso no es una nota. Es un resultado real.

Para el Trimestre 2, ya sé lo que viene: "Diseña tu Food Truck". Te digo lo que yo ya sé que necesitarás: aplica lo del modelo financiero desde el principio, no al final. Y cuando la IA te haga una pregunta en lugar de darte la respuesta, es porque confía en que puedes llegar solo.

Con cariño (y datos),
Lucas García — 1º ESO · Marzo 2026`,

            `Dear future Lucas,

I'm writing to you from March 11, 2026, the day I finished Term 1 at QHUMA OS with a project I'll never forget: "Manage your Airbnb in Málaga — Casa Limón."

I want you to know what I learned, because when you read this, I think you'll need to remember it.

I learned that data tells stories if you know how to read it. When I analyzed Airbnb prices in Málaga, I understood that pricing isn't arbitrary — there's logic behind it: demand, seasonality, and perceived value. I learned this because I needed it, not because it was in a syllabus.

I learned that making mistakes isn't failing. My first financial model had the break-even point wrong. Instead of hiding it, I documented it in my Error Log. That was the best decision of the whole term: go back, understand where the logic broke down, and fix it. Now I know the Error Log is my intelligence history, not my failure record.

I learned that communicating is as important as creating. On Demo Day I presented my project to the class and two guest families. I was nervous, but thanks to PitchLab I had practiced enough. When I finished and saw that people understood my idea, I felt something no exam had ever given me.

What I'm most proud of: Casa Limón would generate a net profit of €1,402 with a 116% ROI on the initial investment. That's not a grade. It's a real result.

For Term 2, I already know what's coming: "Design your Food Truck." Here's what I already know you'll need: apply the financial model from the start, not at the end. And when the AI asks you a question instead of giving you the answer, it's because it trusts you can get there on your own.

With love (and data),
Lucas García — 1º ESO · March 2026`
          );

          const handleGenerarCarta = async () => {
            setGenerandoCarta(true);
            try {
              const res = await fetch("/api/tutor-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mode: "narrativa",
                  message: "Genera una carta personal de Lucas García (alumno de 1º ESO, proyecto Airbnb Málaga T1) dirigida a su yo del futuro. La carta debe ser emotiva, reflexiva y hablar de sus aprendizajes reales: modelo financiero (ROI 116%), Error Log documentado, Demo Day superado, competencia CE al 90%. Máximo 4 párrafos. Tono personal, primera persona, sin tecnicismos. Termina con una firma.",
                  history: [],
                }),
              });
              if (res.ok) {
                const data = await res.json();
                if (data.reply) { setCartaGenerada(data.reply); setGenerandoCarta(false); return; }
              }
            } catch { /* noop */ }
            setCartaGenerada(cartaMock);
            setGenerandoCarta(false);
          };

          const handleExportarCarta = () => {
            const content = cartaGenerada ?? cartaMock;
            const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Carta al yo del futuro — Lucas García</title><style>body{font-family:Georgia,serif;max-width:640px;margin:60px auto;color:#141414;line-height:1.8;padding:0 20px}h1{font-size:20px;color:#2f574d;margin-bottom:4px}p.sub{font-size:12px;color:#9ca3af;margin-bottom:40px}p{margin-bottom:16px;font-size:15px}p.firma{margin-top:32px;font-style:italic;color:#2f574d}</style></head><body><h1>Carta al yo del futuro</h1><p class="sub">QHUMA OS · Lucas García · 1º ESO · Marzo 2026</p>${content.split("\n\n").map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("")}</body></html>`;
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "carta_futuro_lucas_garcia_T1.html";
            a.click();
            URL.revokeObjectURL(url);
            setCartaExportada(true);
            setTimeout(() => setCartaExportada(false), 2500);
          };

          return (
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-accent-text" />
                  <span className="text-[11px] font-bold text-text-primary">{lbl("Carta al yo del futuro", "Letter to my future self")}</span>
                  <span className="text-[9px] font-semibold text-accent-text bg-accent-light px-1.5 py-0.5 rounded-full">
                    {lbl("Cierre T1", "T1 close")}
                  </span>
                </div>
                {cartaGenerada && (
                  <button
                    onClick={handleExportarCarta}
                    className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      cartaExportada ? "bg-success text-white" : "bg-sidebar text-accent hover:bg-accent-dark"
                    }`}
                  >
                    {cartaExportada ? <><CheckCircle2 size={10} />{lbl(" Guardada", " Saved")}</> : <><Download size={10} />{lbl(" Exportar", " Export")}</>}
                  </button>
                )}
              </div>

              {cartaGenerada ? (
                <div className="bg-background rounded-xl border border-card-border p-4 font-serif">
                  <div className="text-[11px] text-text-secondary leading-relaxed whitespace-pre-line">
                    {cartaGenerada}
                  </div>
                  <button
                    onClick={() => setCartaGenerada(null)}
                    className="mt-3 text-[9px] text-text-muted hover:text-accent-text cursor-pointer transition-colors"
                  >
                    {lbl("Regenerar carta", "Regenerate letter")}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-background rounded-xl border border-dashed border-accent/40 p-5 text-center mb-3">
                    <BookOpen size={22} className="text-text-muted mx-auto mb-2" />
                    <p className="text-[12px] font-semibold text-text-primary mb-1">
                      {lbl("Tu historia de T1, en primera persona", "Your T1 story, in first person")}
                    </p>
                    <p className="text-[10px] text-text-muted leading-relaxed">
                      {lbl(
                        "La IA redactará una carta de \"Lucas de hoy\" a \"Lucas del futuro\": lo que aprendiste, lo que construiste y lo que no olvidarás del proyecto Casa Limón.",
                        "The AI will write a letter from \"Lucas today\" to \"Lucas in the future\": what you learned, what you built, and what you won't forget from Casa Limón."
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleGenerarCarta}
                    disabled={generandoCarta}
                    className="w-full flex items-center justify-center gap-2 bg-sidebar text-white text-[12px] font-bold py-2.5 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {generandoCarta
                      ? <><RefreshCw size={12} className="animate-spin" />{lbl("Escribiendo carta...", "Writing letter...")}</>
                      : <><Sparkles size={12} />{lbl("Generar carta IA", "Generate AI letter")}</>
                    }
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
