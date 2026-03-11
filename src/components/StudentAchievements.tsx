"use client";

import { useState } from "react";
import {
  Trophy, Star, Flame, Zap, BarChart3, Globe, Users, BookOpen,
  TrendingUp, FileText, Shield, Target, Sparkles, Lock,
  Award, Search, Copy, CheckCircle2, MapPin, Clock, ChevronRight, X,
} from "lucide-react";
import { useLang } from "@/lib/i18n";

type Rarity = "Común" | "Raro" | "Legendario";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  rarity: Rarity;
  xp: number;
  date?: string;
  unlocked: boolean;
  requirement?: string;
  progress?: { current: number; total: number };
}

const rarityConfig: Record<Rarity, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  Común:      { bg: "bg-accent-light",   border: "border-accent-text/15",  text: "text-accent-text",  badge: "bg-accent-light",   badgeText: "text-accent-text" },
  Raro:       { bg: "bg-warning-light",  border: "border-warning/25",      text: "text-text-primary", badge: "bg-warning-light",  badgeText: "text-text-primary" },
  Legendario: { bg: "bg-urgent-light",   border: "border-urgent/25",       text: "text-urgent",       badge: "bg-urgent-light",   badgeText: "text-urgent" },
};

const achievements: Achievement[] = [
  // — GANADOS —
  {
    id: "a1", title: "Primer día de proyecto", unlocked: true, rarity: "Común", xp: 50, date: "3 mar",
    description: "Completaste tu primera jornada completa del proyecto Airbnb.",
    icon: Star,
  },
  {
    id: "a2", title: "Investigador de mercado", unlocked: true, rarity: "Común", xp: 75, date: "3 mar",
    description: "Analizaste 5 alojamientos de Airbnb con datos reales de Málaga.",
    icon: Search,
  },
  {
    id: "a3", title: "Experto en datos", unlocked: true, rarity: "Común", xp: 90, date: "3 mar",
    description: "Creaste una hoja de cálculo con comparativa de precios por temporada.",
    icon: BarChart3,
  },
  {
    id: "a4", title: "Colaborador del equipo", unlocked: true, rarity: "Común", xp: 60, date: "3 mar",
    description: "Participaste activamente con tu equipo «The Hosts» durante toda la fase.",
    icon: Users,
  },
  {
    id: "a5", title: "Planificador financiero", unlocked: true, rarity: "Común", xp: 80, date: "4 mar",
    description: "Elaboraste el presupuesto inicial de puesta en marcha de tu Airbnb.",
    icon: TrendingUp,
  },
  {
    id: "a6", title: "Escritor bilingüe", unlocked: true, rarity: "Raro", xp: 110, date: "4 mar",
    description: "Redactaste la descripción completa del listing en inglés (500+ palabras).",
    icon: BookOpen,
  },
  {
    id: "a7", title: "Constructor de marca", unlocked: true, rarity: "Raro", xp: 120, date: "4 mar",
    description: "Diseñaste la identidad visual completa de Casa Limón: logo, colores y tipografía.",
    icon: Zap,
  },
  {
    id: "a8", title: "Racha de fuego", unlocked: true, rarity: "Raro", xp: 150, date: "4 mar",
    description: "Mantuviste una racha de actividad de 12 días consecutivos.",
    icon: Flame,
  },
  {
    id: "a9", title: "Arquitecto digital", unlocked: true, rarity: "Raro", xp: 180, date: "5 mar",
    description: "Publicaste la landing page de Casa Limón con hero, galería y mapa.",
    icon: Globe,
  },
  {
    id: "a10", title: "Emprendedor junior", unlocked: true, rarity: "Raro", xp: 200, date: "5 mar",
    description: "Completaste las fases 1 y 2 del proyecto con todas las evidencias entregadas.",
    icon: Trophy,
  },

  // — BLOQUEADOS —
  {
    id: "b1", title: "CFO del Airbnb", unlocked: false, rarity: "Legendario", xp: 400,
    description: "Completa el análisis de rentabilidad completo con proyección anual.",
    icon: Shield,
    requirement: "Completar análisis de rentabilidad (Fase 3)",
    progress: { current: 0, total: 1 },
  },
  {
    id: "b2", title: "Demo Day Champion", unlocked: false, rarity: "Legendario", xp: 500,
    description: "Presenta tu Airbnb en el Demo Day del viernes ante toda la clase.",
    icon: Award,
    requirement: "Presentar en Demo Day (viernes 7 mar)",
    progress: { current: 0, total: 1 },
  },
  {
    id: "b3", title: "Portfolio de élite", unlocked: false, rarity: "Raro", xp: 250,
    description: "Consigue que las 16 evidencias del proyecto sean aprobadas por la profesora.",
    icon: FileText,
    requirement: "16/16 evidencias aprobadas (llevas 9)",
    progress: { current: 9, total: 16 },
  },
  {
    id: "b4", title: "Racha maestra", unlocked: false, rarity: "Raro", xp: 300,
    description: "Mantén 30 días consecutivos de actividad en qhumaOS.",
    icon: Target,
    requirement: "Racha de 30 días (llevas 12)",
    progress: { current: 12, total: 30 },
  },
  {
    id: "b5", title: "Influencer digital", unlocked: false, rarity: "Legendario", xp: 450,
    description: "Tu landing page de Casa Limón alcanza 500 visitas reales.",
    icon: Sparkles,
    requirement: "500 visitas a casalimon.qhuma.dev",
    progress: { current: 47, total: 500 },
  },
];

const unlocked = achievements.filter((a) => a.unlocked);
const locked = achievements.filter((a) => !a.unlocked);
const totalXP = unlocked.reduce((acc, a) => acc + a.xp, 0);

const misionesCompletadas = [
  { id: "m1", titulo: "Analiza el mercado malagueño", semana: "Semana 1", xp: 120, competencia: "STEM" },
  { id: "m2", titulo: "Crea la identidad de Casa Limón", semana: "Semana 1", xp: 100, competencia: "CCEC" },
  { id: "m3", titulo: "Diseña el listing perfecto", semana: "Semana 2", xp: 130, competencia: "CLC" },
  { id: "m4", titulo: "Lanza la landing page", semana: "Semana 2", xp: 150, competencia: "CD" },
  { id: "m5", titulo: "Gestiona tus primeras comunicaciones", semana: "Semana 3", xp: 80, competencia: "CLC" },
];

type FilterRarity = "todas" | Rarity;

export default function StudentAchievements() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  // S26 — Misiones semanales
  const misionesSemanales = [
    {
      id: "ms1",
      cluster: "CLC+CPL",
      titulo: lbl("Redacta la ficha bilingüe de Casa Limón", "Write the bilingual profile of Casa Limón"),
      descripcion: lbl("Crea una descripción en español e inglés (200 palabras c/u) de tu alojamiento para el listing de Airbnb.", "Create a description in Spanish and English (200 words each) of your accommodation for the Airbnb listing."),
      pasos: 4,
      xpRecompensa: 180,
      diasRestantes: 3,
      completencias: ["CLC", "CPL"],
      icon: BookOpen,
    },
    {
      id: "ms2",
      cluster: "STEM",
      titulo: lbl("Calcula el margen por reserva en 3 escenarios", "Calculate margin per booking in 3 scenarios"),
      descripcion: lbl("Construye una hoja de cálculo con escenario conservador, realista y optimista para Casa Limón. Incluye ocupación, precio medio y costes fijos.", "Build a spreadsheet with conservative, realistic and optimistic scenarios for Casa Limón."),
      pasos: 3,
      xpRecompensa: 200,
      diasRestantes: 2,
      completencias: ["STEM"],
      icon: BarChart3,
    },
    {
      id: "ms3",
      cluster: "CD",
      titulo: lbl("Publica el widget de reservas en tu landing", "Publish the booking widget on your landing page"),
      descripcion: lbl("Integra el botón de reserva en la landing page de Casa Limón y conecta el formulario de contacto. Prueba que funciona desde móvil.", "Integrate the booking button on Casa Limón's landing page and connect the contact form."),
      pasos: 3,
      xpRecompensa: 160,
      diasRestantes: 5,
      completencias: ["CD"],
      icon: Globe,
    },
    {
      id: "ms4",
      cluster: "CE+CPSAA",
      titulo: lbl("Prepara tu pitch de 90 segundos para el Demo Day", "Prepare your 90-second pitch for Demo Day"),
      descripcion: lbl("Ensaya y graba un pitch de 90 segundos explicando la propuesta de valor de Casa Limón. Recibe feedback de Prof. Ana antes del viernes.", "Rehearse and record a 90-second pitch explaining Casa Limón's value proposition."),
      pasos: 5,
      xpRecompensa: 250,
      diasRestantes: 1,
      completencias: ["CE", "CPSAA"],
      icon: Sparkles,
    },
  ];

  const [misionesProgreso, setMisionesProgreso] = useState<Record<string, number>>({
    ms1: 2, ms2: 1, ms3: 0, ms4: 3,
  });
  const [completandoPaso, setCompletandoPaso] = useState<string | null>(null);
  const [pasoCompletado, setPasoCompletado] = useState<Set<string>>(new Set());

  const handleCompletarPaso = (misionId: string, totalPasos: number) => {
    if (completandoPaso) return;
    const current = misionesProgreso[misionId] ?? 0;
    if (current >= totalPasos) return;
    setCompletandoPaso(misionId);
    setTimeout(() => {
      setMisionesProgreso((prev) => ({ ...prev, [misionId]: current + 1 }));
      if (current + 1 >= totalPasos) {
        setPasoCompletado((prev) => new Set(prev).add(misionId));
      }
      setCompletandoPaso(null);
    }, 700);
  };

  // S30 — Retos entre compañeros
  interface RetoCompanero {
    id: string;
    desafiador: string;
    desafiadoNombre: string;
    competencia: string;
    descripcion: string;
    fechaLimite: string;
    estado: "pendiente" | "aceptado" | "completado";
    xpEnJuego: number;
    progreso?: number; // 0-100 solo cuando aceptado
  }

  const retosIniciales: RetoCompanero[] = [
    {
      id: "r1",
      desafiador: "Compañero A",
      desafiadoNombre: "Lucas García",
      competencia: "STEM",
      descripcion: lbl(
        "Calcula el RevPAR (Revenue Per Available Room) de Casa Limón para los meses de mayo y junio con datos reales de AirDNA.",
        "Calculate Casa Limón's RevPAR for May and June using real AirDNA data."
      ),
      fechaLimite: lbl("Viernes 13 mar", "Fri 13 Mar"),
      estado: "aceptado",
      xpEnJuego: 150,
      progreso: 45,
    },
    {
      id: "r2",
      desafiador: "Compañero B",
      desafiadoNombre: "Lucas García",
      competencia: "CLC",
      descripcion: lbl(
        "Redacta las respuestas a 5 reseñas negativas de un Airbnb en inglés, manteniendo un tono profesional y empático.",
        "Write responses to 5 negative Airbnb reviews in English, maintaining a professional and empathetic tone."
      ),
      fechaLimite: lbl("Lunes 16 mar", "Mon 16 Mar"),
      estado: "pendiente",
      xpEnJuego: 120,
    },
    {
      id: "r3",
      desafiador: "Compañero C",
      desafiadoNombre: "Lucas García",
      competencia: "CE",
      descripcion: lbl(
        "Diseña una estrategia de precios dinámicos para Casa Limón que maximice los ingresos durante la Semana Santa 2026.",
        "Design a dynamic pricing strategy for Casa Limón that maximizes revenue during Easter 2026."
      ),
      fechaLimite: lbl("Miércoles 18 mar", "Wed 18 Mar"),
      estado: "completado",
      xpEnJuego: 200,
      progreso: 100,
    },
  ];

  const [retosActivos, setRetosActivos] = useState<RetoCompanero[]>(retosIniciales);
  const [retosAceptados, setRetosAceptados] = useState<Set<string>>(new Set(["r1"]));
  const [lanzandoReto, setLanzandoReto] = useState(false);
  const [nuevoRetoComp, setNuevoRetoComp] = useState("STEM");
  const [nuevoRetoDesc, setNuevoRetoDesc] = useState("");
  const [nuevoRetoDestino, setNuevoRetoDestino] = useState("A");
  const [nuevoRetoDias, setNuevoRetoDias] = useState<3 | 5 | 7>(3);
  const [retosEnviados, setRetosEnviados] = useState(0);
  const [enviandoReto, setEnviandoReto] = useState(false);
  const [retoEnviadoFeedback, setRetoEnviadoFeedback] = useState(false);
  const [showLanzarForm, setShowLanzarForm] = useState(false);

  const handleAceptarReto = (retoId: string) => {
    setRetosActivos((prev) =>
      prev.map((r) => r.id === retoId ? { ...r, estado: "aceptado", progreso: 0 } : r)
    );
    setRetosAceptados((prev) => new Set(prev).add(retoId));
  };

  const handleLanzarReto = () => {
    if (!nuevoRetoDesc.trim() || enviandoReto) return;
    setEnviandoReto(true);
    setTimeout(() => {
      const diasLabel = nuevoRetoDias === 3 ? lbl("En 3 días", "In 3 days") : nuevoRetoDias === 5 ? lbl("En 5 días", "In 5 days") : lbl("En 7 días", "In 7 days");
      const nuevoReto: RetoCompanero = {
        id: `r-nuevo-${Date.now()}`,
        desafiador: "Lucas García",
        desafiadoNombre: `Compañero ${nuevoRetoDestino}`,
        competencia: nuevoRetoComp,
        descripcion: nuevoRetoDesc.trim(),
        fechaLimite: diasLabel,
        estado: "pendiente",
        xpEnJuego: nuevoRetoDias === 3 ? 100 : nuevoRetoDias === 5 ? 150 : 200,
      };
      setRetosActivos((prev) => [...prev, nuevoReto]);
      setRetosEnviados((v) => v + 1);
      setNuevoRetoDesc("");
      setEnviandoReto(false);
      setRetoEnviadoFeedback(true);
      setTimeout(() => { setRetoEnviadoFeedback(false); setShowLanzarForm(false); }, 2500);
    }, 1000);
  };

  const compColors: Record<string, string> = {
    CLC: "bg-accent-light text-accent-text",
    CPL: "bg-accent-light text-accent-text",
    STEM: "bg-success-light text-success",
    CD: "bg-warning-light text-warning",
    CPSAA: "bg-urgent-light text-urgent",
    CC: "bg-background text-text-secondary border border-card-border",
    CE: "bg-sidebar text-accent",
    CCEC: "bg-warning-light text-warning",
  };

  const estadoCfg: Record<RetoCompanero["estado"], { label: string; bg: string; text: string }> = {
    pendiente:  { label: lbl("Pendiente", "Pending"),    bg: "bg-warning-light",  text: "text-warning" },
    aceptado:   { label: lbl("En curso",  "In progress"), bg: "bg-accent-light",   text: "text-accent-text" },
    completado: { label: lbl("Completado","Completed"),  bg: "bg-success-light",  text: "text-success" },
  };

  const [filter, setFilter] = useState<FilterRarity>("todas");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);

  const handleShare = (id: string, title: string) => {
    const url = `https://qhuma.es/logros/${id}?alumno=lucas-garcia&logro=${encodeURIComponent(title)}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setSharedId(id);
    setTimeout(() => setSharedId(null), 2000);
  };

  const filtered = filter === "todas" ? unlocked : unlocked.filter((a) => a.rarity === filter);

  const countByRarity = (r: Rarity) => unlocked.filter((a) => a.rarity === r).length;

  // Labels for rarity display
  const rarityLabel = (r: Rarity): string => {
    if (r === "Común") return lbl("Común", "Common");
    if (r === "Raro") return lbl("Raro", "Rare");
    return lbl("Legendario", "Legendary");
  };

  return (
    <div className="flex gap-5">
      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={18} className="text-accent-text" />
              <h1 className="text-[22px] font-bold text-text-primary">{lbl("Mis Logros", "My Achievements")}</h1>
            </div>
            <p className="text-[13px] text-text-secondary">
              <span className="font-medium text-accent-text">{unlocked.length}</span> {lbl("logros conseguidos ·", "achievements earned ·")}{" "}
              <span className="font-medium text-text-primary">{totalXP} XP</span> {lbl("acumulados", "accumulated")}
            </p>
          </div>
        </div>

        {/* S26 — Misiones de esta semana */}
        <div className="bg-card border border-card-border rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-accent-text" />
            <h2 className="text-[13px] font-semibold text-text-primary">{lbl("Misiones de esta semana", "This week's missions")}</h2>
            <span className="ml-auto text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full">
              Airbnb Málaga
            </span>
          </div>
          <div className="space-y-3">
            {misionesSemanales.map((mision) => {
              const progreso = misionesProgreso[mision.id] ?? 0;
              const isCompletada = pasoCompletado.has(mision.id) || progreso >= mision.pasos;
              const pct = Math.min(100, Math.round((progreso / mision.pasos) * 100));
              const Icon = mision.icon;
              return (
                <div
                  key={mision.id}
                  className={`rounded-xl p-3.5 border transition-all ${
                    isCompletada ? "bg-success-light border-success/20" : "bg-background border-card-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompletada ? "bg-success text-white" : "bg-sidebar"}`}>
                      {isCompletada ? <CheckCircle2 size={16} className="text-white" /> : <Icon size={14} className="text-accent" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className={`text-[12px] font-semibold leading-snug ${isCompletada ? "text-success" : "text-text-primary"}`}>
                          {mision.titulo}
                        </p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Días restantes */}
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                            mision.diasRestantes <= 1 ? "bg-urgent-light text-urgent" :
                            mision.diasRestantes <= 3 ? "bg-warning-light text-warning" :
                            "bg-background text-text-muted"
                          }`}>
                            <Clock size={7} />
                            {mision.diasRestantes === 1 ? lbl("¡Hoy!", "Today!") : `${mision.diasRestantes}d`}
                          </span>
                          {/* XP */}
                          <span className="text-[8px] font-bold bg-accent-light text-accent-text px-1.5 py-0.5 rounded-full">
                            +{mision.xpRecompensa} XP
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed mb-2">{mision.descripcion}</p>
                      {/* Competencias */}
                      <div className="flex gap-1 mb-2">
                        {mision.completencias.map((comp) => (
                          <span key={comp} className="text-[8px] font-bold bg-sidebar text-accent px-1.5 py-0.5 rounded-full">{comp}</span>
                        ))}
                      </div>
                      {/* Barra de progreso */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-card rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isCompletada ? "bg-success" : "bg-accent-text"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-text-muted flex-shrink-0">{progreso}/{mision.pasos}</span>
                      </div>
                      {/* Botón completar paso */}
                      {isCompletada ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-success" />
                          <span className="text-[11px] font-semibold text-success">{lbl("¡Misión completada! +Q-Coins", "Mission complete! +Q-Coins")}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCompletarPaso(mision.id, mision.pasos)}
                          disabled={!!completandoPaso}
                          className="flex items-center gap-1.5 text-[10px] font-semibold bg-sidebar text-white px-3 py-1.5 rounded-xl hover:bg-accent-dark transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {completandoPaso === mision.id ? (
                            <><TrendingUp size={10} className="animate-bounce" />{lbl("Completando paso...", "Completing step...")}</>
                          ) : (
                            <><ChevronRight size={10} />{lbl("Completar paso", "Complete step")}</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* S30 — Retos entre compañeros */}
        <div className="bg-card border border-card-border rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-accent-text" />
            <h2 className="text-[13px] font-semibold text-text-primary">{lbl("Retos entre compañeros", "Peer Challenges")}</h2>
            <span className="ml-auto text-[9px] font-bold bg-sidebar text-accent px-2 py-0.5 rounded-full">
              {retosActivos.filter((r) => r.estado !== "completado").length} {lbl("activos", "active")}
            </span>
          </div>

          {/* Lista de retos */}
          <div className="space-y-3 mb-4">
            {retosActivos.map((reto) => {
              const estCfg = estadoCfg[reto.estado];
              const compCfg = compColors[reto.competencia] ?? "bg-background text-text-muted";
              return (
                <div
                  key={reto.id}
                  className={`rounded-xl p-3.5 border ${estCfg.bg} ${
                    reto.estado === "pendiente" ? "border-warning/20" :
                    reto.estado === "aceptado" ? "border-accent-text/15" :
                    "border-success/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                        <span className="text-accent text-[8px] font-bold">{reto.desafiador.slice(-1)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted">{reto.desafiador} {lbl("te desafía", "challenges you")}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${compCfg}`}>{reto.competencia}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${estCfg.bg} ${estCfg.text}`}>{estCfg.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] font-bold text-accent-text block">+{reto.xpEnJuego} XP</span>
                      <span className="text-[9px] text-text-muted">{reto.fechaLimite}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed mb-2">{reto.descripcion}</p>
                  {reto.estado === "aceptado" && reto.progreso !== undefined && (
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-text-muted">{lbl("Progreso", "Progress")}</span>
                        <span className="text-[9px] font-bold text-accent-text">{reto.progreso}%</span>
                      </div>
                      <div className="h-1.5 bg-card rounded-full overflow-hidden">
                        <div className="h-full bg-accent-text rounded-full transition-all" style={{ width: `${reto.progreso}%` }} />
                      </div>
                    </div>
                  )}
                  {reto.estado === "pendiente" && (
                    <button
                      onClick={() => handleAceptarReto(reto.id)}
                      className="flex items-center gap-1.5 text-[10px] font-semibold bg-sidebar text-white px-3 py-1.5 rounded-xl hover:bg-accent-dark transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={10} />
                      {lbl("Aceptar reto", "Accept challenge")}
                    </button>
                  )}
                  {reto.estado === "completado" && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-success" />
                      <span className="text-[11px] font-semibold text-success">{lbl("¡Reto superado!", "Challenge completed!")}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lanzar reto */}
          <div className="border-t border-card-border pt-3">
            {retoEnviadoFeedback ? (
              <div className="flex items-center gap-2 bg-success-light rounded-xl px-3 py-2.5">
                <CheckCircle2 size={14} className="text-success" />
                <span className="text-[12px] font-semibold text-success">
                  {lbl(`¡Reto enviado a Compañero ${nuevoRetoDestino}!`, `Challenge sent to Classmate ${nuevoRetoDestino}!`)}
                </span>
              </div>
            ) : !showLanzarForm ? (
              <button
                onClick={() => setShowLanzarForm(true)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-text bg-accent-light px-3 py-2 rounded-xl hover:bg-accent/20 transition-all cursor-pointer w-full justify-center"
              >
                <TrendingUp size={12} />
                {lbl("Lanzar un reto", "Launch a challenge")}
                {retosEnviados > 0 && <span className="text-[9px] bg-sidebar text-accent px-1.5 py-0.5 rounded-full ml-1">{retosEnviados} {lbl("enviados", "sent")}</span>}
              </button>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-semibold text-text-primary">{lbl("Nuevo reto", "New challenge")}</span>
                  <button onClick={() => setShowLanzarForm(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-semibold text-text-muted block mb-1">{lbl("Competencia", "Competency")}</label>
                    <select
                      value={nuevoRetoComp}
                      onChange={(e) => setNuevoRetoComp(e.target.value)}
                      className="w-full border border-card-border rounded-xl px-2 py-1.5 text-[11px] bg-background outline-none cursor-pointer"
                    >
                      {["CLC", "CPL", "STEM", "CD", "CPSAA", "CC", "CE", "CCEC"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-text-muted block mb-1">{lbl("Compañero", "Classmate")}</label>
                    <select
                      value={nuevoRetoDestino}
                      onChange={(e) => setNuevoRetoDestino(e.target.value)}
                      className="w-full border border-card-border rounded-xl px-2 py-1.5 text-[11px] bg-background outline-none cursor-pointer"
                    >
                      <option value="A">{lbl("Compañero A (anónimo)", "Classmate A (anonymous)")}</option>
                      <option value="B">{lbl("Compañero B (anónimo)", "Classmate B (anonymous)")}</option>
                      <option value="C">{lbl("Compañero C (anónimo)", "Classmate C (anonymous)")}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-text-muted block mb-1">{lbl("Descripción del reto (Casa Limón / Airbnb Málaga)", "Challenge description")}</label>
                  <textarea
                    value={nuevoRetoDesc}
                    onChange={(e) => setNuevoRetoDesc(e.target.value)}
                    placeholder={lbl("Ej: Compara los precios de Casa Limón con los 5 competidores más cercanos y propón una mejora...", "E.g. Compare Casa Limón's prices with the 5 nearest competitors...")}
                    rows={2}
                    className="w-full border border-card-border rounded-xl px-3 py-2 text-[11px] bg-background outline-none resize-none leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-text-muted block mb-1">{lbl("Plazo", "Deadline")}</label>
                  <div className="flex gap-2">
                    {([3, 5, 7] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setNuevoRetoDias(d)}
                        className={`flex-1 py-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer border ${
                          nuevoRetoDias === d
                            ? "bg-sidebar text-white border-sidebar"
                            : "bg-background text-text-secondary border-card-border hover:border-accent-text/30"
                        }`}
                      >
                        {d} {lbl("días", "days")}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleLanzarReto}
                  disabled={!nuevoRetoDesc.trim() || enviandoReto}
                  className="w-full bg-sidebar text-white py-2 rounded-xl text-[12px] font-semibold hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  {enviandoReto ? (
                    <><TrendingUp size={12} className="animate-bounce" />{lbl("Enviando...", "Sending...")}</>
                  ) : (
                    <>{lbl("Lanzar reto · +", "Launch · +")} {nuevoRetoDias === 3 ? 100 : nuevoRetoDias === 5 ? 150 : 200} XP</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats rarity row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {(["Común", "Raro", "Legendario"] as Rarity[]).map((r) => {
            const cfg = rarityConfig[r];
            return (
              <div key={r} className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border} text-center`}>
                <span className={`text-[22px] font-bold block ${cfg.text}`}>{countByRarity(r)}</span>
                <span className="text-[10px] text-text-muted">{rarityLabel(r)}</span>
              </div>
            );
          })}
        </div>

        {/* S13: Misiones completadas */}
        <div className="bg-card border border-card-border rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={13} className="text-accent-text" />
            <h2 className="text-[13px] font-semibold text-text-primary">{lbl("Misiones completadas", "Completed missions")}</h2>
            <span className="ml-auto text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full">
              Proyecto Airbnb Málaga
            </span>
          </div>
          <div className="space-y-2">
            {misionesCompletadas.map((m, idx) => (
              <div key={m.id} className="flex items-center gap-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={13} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-text-primary truncate">{m.titulo}</span>
                    <span className="text-[9px] font-bold text-accent-text bg-accent-light px-1.5 py-0.5 rounded-full flex-shrink-0">{m.competencia}</span>
                  </div>
                  <span className="text-[10px] text-text-muted">{m.semana}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <TrendingUp size={10} className="text-accent-text" />
                  <span className="text-[11px] font-bold text-accent-text">+{m.xp} XP</span>
                </div>
                {idx < misionesCompletadas.length - 1 && (
                  <div className="absolute" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-5">
          {(["todas", "Común", "Raro", "Legendario"] as FilterRarity[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                filter === f
                  ? "bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {f === "todas"
                ? `${lbl("Todas", "All")} (${unlocked.length})`
                : rarityLabel(f as Rarity)}
            </button>
          ))}
        </div>

        {/* Unlocked achievements grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {filtered.map((a) => {
            const cfg = rarityConfig[a.rarity];
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative rounded-2xl p-4 border transition-all duration-200 cursor-default ${cfg.bg} ${cfg.border} ${
                  hoveredId === a.id ? "scale-[1.01]" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/60`}>
                    <Icon size={20} className={cfg.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className="text-[13px] font-semibold text-text-primary leading-tight truncate">
                        {a.title}
                      </h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge} ${cfg.badgeText}`}>
                        {rarityLabel(a.rarity)}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed mb-2">{a.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-muted">{a.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp size={10} className="text-accent-text" />
                          <span className="text-[11px] font-bold text-accent-text">+{a.xp} XP</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShare(a.id, a.title); }}
                          className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-white/60 text-text-muted hover:text-accent-text transition-colors cursor-pointer"
                          title={lbl("Compartir logro", "Share achievement")}
                        >
                          {sharedId === a.id ? (
                            <><CheckCircle2 size={9} className="text-success" /><span className="text-success">{lbl("Copiado", "Copied")}</span></>
                          ) : (
                            <><Copy size={9} /><span>{lbl("Compartir", "Share")}</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Locked achievements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock size={14} className="text-text-muted" />
            <h2 className="text-[14px] font-semibold text-text-primary">{lbl("Próximos logros", "Upcoming achievements")}</h2>
            <span className="text-[11px] text-text-muted">({locked.length} {lbl("bloqueados", "locked")})</span>
          </div>

          <div className="space-y-2.5">
            {locked.map((a) => {
              const cfg = rarityConfig[a.rarity];
              const Icon = a.icon;
              return (
                <div
                  key={a.id}
                  className="bg-card border border-card-border rounded-2xl p-4 opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0 relative">
                      <Icon size={18} className="text-text-muted" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background border border-card-border flex items-center justify-center">
                        <Lock size={8} className="text-text-muted" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[13px] font-semibold text-text-primary">{a.title}</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.badge} ${cfg.badgeText}`}>
                          {rarityLabel(a.rarity)}
                        </span>
                        <span className="text-[10px] font-bold text-text-muted ml-auto">+{a.xp} XP</span>
                      </div>
                      <p className="text-[11px] text-text-muted mb-2">{a.requirement}</p>
                      {a.progress && (
                        <div>
                          <div className="h-1.5 bg-background rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full transition-all"
                              style={{ width: `${Math.min(100, (a.progress.current / a.progress.total) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-text-muted mt-0.5 block">
                            {a.progress.current} / {a.progress.total}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[240px] flex-shrink-0 flex flex-col gap-4">
        {/* Total XP card */}
        <div className="bg-sidebar rounded-2xl p-5 text-center">
          <Trophy size={22} className="text-accent mx-auto mb-2" />
          <span className="text-[28px] font-bold text-white block">{totalXP}</span>
          <span className="text-[11px] text-white/50">{lbl("XP total de logros", "Total achievement XP")}</span>
        </div>

        {/* Rarity breakdown */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">{lbl("Por rareza", "By rarity")}</h3>
          <div className="space-y-3">
            {(["Legendario", "Raro", "Común"] as Rarity[]).map((r) => {
              const cfg = rarityConfig[r];
              const count = countByRarity(r);
              return (
                <div key={r}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[11px] font-semibold ${cfg.text}`}>{rarityLabel(r)}</span>
                    <span className="text-[11px] font-bold text-text-primary">{count}</span>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.bg.replace("bg-", "bg-").replace("-light", "")}`}
                      style={{ width: `${(count / (unlocked.length || 1)) * 100}%`, backgroundColor: r === "Legendario" ? "#ef4444" : r === "Raro" ? "#f59e0b" : "#c3f499" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* S13: Próximos desbloqueos */}
        <div className="bg-card border border-card-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={13} className="text-accent-text" />
            <span className="text-[12px] font-semibold text-text-primary">{lbl("Próximos desbloqueos", "Upcoming unlocks")}</span>
          </div>
          <div className="space-y-3">
            {locked.filter((a) => a.progress).map((a) => {
              const pct = Math.round(((a.progress!.current) / (a.progress!.total)) * 100);
              const Icon = a.icon;
              const cfg = rarityConfig[a.rarity];
              return (
                <div key={a.id}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                      <Icon size={11} className={cfg.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-text-primary leading-tight truncate">{a.title}</p>
                      <p className="text-[9px] text-text-muted">{a.progress!.current} / {a.progress!.total}</p>
                    </div>
                    <span className="text-[10px] font-bold text-text-muted flex-shrink-0">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-text rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent unlocks */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">{lbl("Recientes", "Recent")}</h3>
          <div className="space-y-2.5">
            {unlocked.slice(-4).reverse().map((a) => {
              const Icon = a.icon;
              const cfg = rarityConfig[a.rarity];
              return (
                <div key={a.id} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <Icon size={13} className={cfg.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-text-primary truncate">{a.title}</p>
                    <p className="text-[9px] text-text-muted">{a.date} · +{a.xp} XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
