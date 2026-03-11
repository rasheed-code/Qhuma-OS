"use client";

import { useState } from "react";
import {
  Coins, Zap, Flame, Trophy, Sparkles, Timer, Users, Lightbulb,
  Palette, Swords, Star, Lock, TrendingUp, TrendingDown,
  ShoppingCart, X, CheckCircle2, Camera, Cpu, MapPin, Mic, Loader2,
  BarChart3, Filter, Award, Building2, BookOpen, Briefcase, UserCheck, Ticket,
} from "lucide-react";
import { currentStudent } from "@/data/students";
import { playerLevel, coinTransactions, shopItems, achievements } from "@/data/gamification";
import { competencies } from "@/data/competencies";
import { useLang } from "@/lib/i18n";

// ─── Mercado de canjes ───────────────────────────────────────────────
type Categoria = "Todo" | "Talleres" | "Maker" | "Excursiones" | "Passion" | "Experiencias";

interface ItemMercado {
  id: string;
  categoria: Exclude<Categoria, "Todo">;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  icon: string;
  tag: string;
}

const mercadoItems: ItemMercado[] = [
  { id: "t1", categoria: "Talleres",   nombre: "Taller de Fotografía Profesional", descripcion: "3h con fotógrafo profesional para mejorar las fotos de tu anuncio Airbnb", precio: 120, stock: 5,  icon: "Camera",  tag: "Portfolio" },
  { id: "t2", categoria: "Talleres",   nombre: "Pitch Training con Emprendedor",  descripcion: "Sesión 1:1 con emprendedor del sector turismo para pulir tu Demo Day",     precio: 150, stock: 3,  icon: "Mic",     tag: "Demo Day" },
  { id: "t3", categoria: "Talleres",   nombre: "Diseño UI/UX con Figma",          descripcion: "Workshop 2h de diseño de interfaces para mejorar tu landing page",         precio: 80,  stock: 8,  icon: "Palette", tag: "Digital" },
  { id: "t4", categoria: "Talleres",   nombre: "Revenue Management avanzado",     descripcion: "2h con analista de datos: aprende a optimizar precios con datos reales",   precio: 200, stock: 2,  icon: "Zap",     tag: "STEM" },
  { id: "m1", categoria: "Maker",      nombre: "Impresora 3D — 2 horas",          descripcion: "Acceso a la impresora 3D del Maker Studio para tu proyecto",               precio: 60,  stock: 10, icon: "Cpu",     tag: "Maker" },
  { id: "m2", categoria: "Maker",      nombre: "Kit Arduino + sensores IoT",      descripcion: "Kit completo para construir un dispositivo de automatización del hogar",   precio: 90,  stock: 4,  icon: "Cpu",     tag: "STEM" },
  { id: "m3", categoria: "Maker",      nombre: "Sesión de grabación podcast",      descripcion: "2h en el estudio de sonido del Maker Studio con técnico de audio",       precio: 75,  stock: 6,  icon: "Mic",     tag: "Comunicación" },
  { id: "e1", categoria: "Excursiones", nombre: "Visita a startup malagueña",     descripcion: "Tarde en las oficinas de una startup del sector turismo en Málaga",        precio: 100, stock: 20, icon: "MapPin",  tag: "Emprendimiento" },
  { id: "e2", categoria: "Excursiones", nombre: "Día en Airbnb Experience",       descripcion: "Participa como huésped en una Airbnb Experience real y aprende de dentro", precio: 200, stock: 6,  icon: "MapPin",  tag: "Proyecto" },
  { id: "e3", categoria: "Excursiones", nombre: "Feria de Turismo de Andalucía",  descripcion: "Visita guiada a FITUR o similar con networking con profesionales",         precio: 150, stock: 8,  icon: "MapPin",  tag: "Industrias" },
  { id: "p1", categoria: "Passion",    nombre: "Prioridad Passion Workshop Q2",   descripcion: "Primera plaza garantizada en el próximo workshop de tu área de pasión",    precio: 250, stock: 2,  icon: "Star",    tag: "Especial" },
  { id: "p2", categoria: "Passion",    nombre: "Mentoría 1:1 con Prof. Ana",      descripcion: "1h de mentoría personalizada para revisar tu proyecto y roadmap personal", precio: 180, stock: 5,  icon: "Users",   tag: "Especial" },
  { id: "p3", categoria: "Passion",    nombre: "Acceso anticipado Passion Track", descripcion: "Desbloquea el siguiente Passion Workshop antes que el resto de la clase",  precio: 300, stock: 1,  icon: "Star",    tag: "Especial" },
];

const mercadoIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Camera, Mic, Palette, Zap, Cpu, MapPin, Star, Users,
};

const historiales = [
  { id: "h1", nombre: "Taller de Fotografía Profesional", fecha: "Vie, 7 mar", precio: 120, estado: "confirmado" },
  { id: "h2", nombre: "Mentoría 1:1 con Prof. Ana",      fecha: "Lun, 3 mar", precio: 180, estado: "realizado" },
];

// ─── Tienda digital ───────────────────────────────────────────────────
const shopIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap, Palette, Timer, Users, Lightbulb, Sparkles,
};

const achievementIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Swords, Timer, Star, Users, Coins, Zap,
};

// ─── S24: Evolución mensual Q-Coins ───────────────────────────────────────
const evolucionMensual = [
  { mes: "Oct", ganadas: 210, gastadas: 60 },
  { mes: "Nov", ganadas: 280, gastadas: 100 },
  { mes: "Dic", ganadas: 190, gastadas: 30 },
  { mes: "Ene", ganadas: 340, gastadas: 120 },
  { mes: "Feb", ganadas: 310, gastadas: 180 },
  { mes: "Mar", ganadas: 420, gastadas: 120 },
];

// ─── S24: Transacciones pendientes (simuladas) ────────────────────────────
const transaccionesPendientes = [
  { id: "p1", descripcion: "Bono grupal — Demo Day viernes", cantidad: 150, fecha: "Pendiente · Vie 14 mar" },
  { id: "p2", descripcion: "Revisión de evidencias T2",     cantidad: 80,  fecha: "Pendiente · Mar 17 mar" },
];

// ─── S31: Tienda de experiencias ────────────────────────────────────
interface Experiencia {
  id: string;
  titulo: string;
  precio: number;
  aforo: { ocupado: number; total: number };
  fecha: string;
  descripcion: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface Reserva {
  id: string;
  expId: string;
  titulo: string;
  fecha: string;
  ticket: string;
}

const categorias: Categoria[] = ["Todo", "Talleres", "Maker", "Excursiones", "Passion", "Experiencias"];
const catColors: Record<Categoria, string> = {
  Todo: "bg-background text-text-secondary",
  Talleres: "bg-accent-light text-accent-text",
  Maker: "bg-success-light text-success",
  Excursiones: "bg-warning-light text-warning",
  Passion: "bg-urgent-light text-urgent",
  Experiencias: "bg-sidebar/10 text-sidebar",
};

export default function StudentQCoins() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const levelPercent = Math.round((playerLevel.xpCurrent / playerLevel.xpRequired) * 100);

  // Mercado state
  const [catActiva, setCatActiva] = useState<Categoria>("Todo");
  const [carrito, setCarrito] = useState<ItemMercado[]>([]);
  const [canjeConfirmado, setCanjeConfirmado] = useState(false);

  // C8 — MercadoIntegrado IA
  const [iaDismissed, setIaDismissed] = useState(false);
  const [isRefreshingIa, setIsRefreshingIa] = useState(false);
  const [iaVersion, setIaVersion] = useState(0);

  // Compute weakest competency + map to mercado item
  const weakestComp = [...competencies].sort((a, b) => a.progress - b.progress)[0];
  const compToMercado: Partial<Record<string, { itemId: string; razon: string; categoria: Categoria }>> = {
    CC:    { itemId: "e1", razon: "Conecta con el ecosistema emprendedor real de Málaga y desarrolla tu competencia ciudadana", categoria: "Excursiones" },
    CPL:   { itemId: "m3", razon: "Practicar comunicación oral en el estudio de podcast refuerza tu competencia plurilingüe", categoria: "Maker" },
    CPSAA: { itemId: "p2", razon: "Una sesión 1:1 con Prof. Ana te ayuda a reflexionar sobre tu aprendizaje y estrategia personal", categoria: "Passion" },
    STEM:  { itemId: "t4", razon: "Revenue Management con datos reales impulsa directamente tu competencia STEM", categoria: "Talleres" },
    CCEC:  { itemId: "t1", razon: "La fotografía profesional potencia tu expresión visual y creatividad digital", categoria: "Talleres" },
    CLC:   { itemId: "t2", razon: "Entrenar tu pitch con un emprendedor mejora tu comunicación lingüística de forma directa", categoria: "Talleres" },
    CD:    { itemId: "t3", razon: "Figma y diseño UI/UX refuerzan tu competencia digital con herramientas profesionales", categoria: "Talleres" },
    CE:    { itemId: "e2", razon: "Vivir una Airbnb Experience real te da perspectiva emprendedora desde dentro del sector", categoria: "Excursiones" },
  };
  const iaRec = compToMercado[weakestComp?.key] ?? compToMercado["CC"]!;
  const iaItemRec = mercadoItems.find((i) => i.id === iaRec?.itemId) ?? mercadoItems[0];

  const handleRefreshIa = () => {
    setIsRefreshingIa(true);
    setTimeout(() => setIsRefreshingIa(false), 1500);
    setIaVersion((v) => v + 1);
  };

  const catLabels: Record<Categoria, string> = {
    Todo: lbl("Todo", "All"),
    Talleres: lbl("Talleres", "Workshops"),
    Maker: "Maker",
    Excursiones: lbl("Excursiones", "Trips"),
    Passion: "Passion",
    Experiencias: lbl("Experiencias", "Experiences"),
  };

  // S31 — Tienda de experiencias
  const experienciasData: Experiencia[] = [
    { id: "ex1", titulo: lbl("Visita empresa tecnológica en Málaga", "Tech company visit in Málaga"),  precio: 500, aforo: { ocupado: 10, total: 12 }, fecha: "25 mar", descripcion: lbl("Tarde inmersiva en una empresa tech de Málaga. Conoce cómo se construye producto real y conecta con ingenieros.", "Immersive afternoon at a Málaga tech company."), icon: Building2 },
    { id: "ex2", titulo: lbl("Workshop fotografía profesional",      "Professional photography workshop"), precio: 350, aforo: { ocupado: 6,  total: 8  }, fecha: "1 abr",  descripcion: lbl("3h con fotógrafo profesional. Aprende a capturar el apartamento Casa Limón para maximizar conversión en Airbnb.", "3h with a pro photographer."), icon: Camera },
    { id: "ex3", titulo: lbl("Charla inversor real QHUMA Capital",   "QHUMA Capital investor talk"),      precio: 250, aforo: { ocupado: 12, total: 15 }, fecha: "15 abr", descripcion: lbl("Sesión con inversor real del ecosistema QHUMA Capital. Preguntas abiertas sobre tu proyecto Airbnb Málaga.", "Q&A session with a real QHUMA Capital investor about your project."), icon: BookOpen },
    { id: "ex4", titulo: lbl("Mentoría 1:1 con alumni empresa",      "1:1 mentoring with alumni"),         precio: 400, aforo: { ocupado: 3,  total: 5  }, fecha: "22 abr", descripcion: lbl("1h de mentoría personalizada con un alumni QHUMA que trabaja en empresa real. Perspectiva de futuro laboral directo.", "1h personalized mentoring with a QHUMA alumni working at a real company."), icon: UserCheck },
  ];

  const itemsFiltrados = catActiva === "Todo" ? mercadoItems : mercadoItems.filter((i) => i.categoria === catActiva);
  const totalCarrito = carrito.reduce((s, i) => s + i.precio, 0);
  const saldoDisponible = saldoActual;
  const puedeComprar = totalCarrito > 0 && totalCarrito <= saldoDisponible;

  const addToCart = (item: ItemMercado) => {
    if (carrito.find((i) => i.id === item.id)) return;
    setCarrito((prev) => [...prev, item]);
  };
  const removeFromCart = (id: string) => setCarrito((prev) => prev.filter((i) => i.id !== id));
  const handleConfirmar = () => {
    setCanjeConfirmado(true);
    setTimeout(() => { setCarrito([]); setCanjeConfirmado(false); }, 3000);
  };

  // S24 — Historial de transacciones con filtro
  type FiltroTx = "todo" | "ganadas" | "gastadas" | "pendientes";
  const [filtroTx, setFiltroTx] = useState<FiltroTx>("todo");

  // S31 — Tienda de experiencias
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cancelando, setCancelando] = useState<string | null>(null);
  const [saldoActual, setSaldoActual] = useState(currentStudent.qcoins);
  const [reservandoId, setReservandoId] = useState<string | null>(null);
  const [confirmacionReserva, setConfirmacionReserva] = useState<string | null>(null);
  const [showMisReservas, setShowMisReservas] = useState(false);

  const handleReservar = (exp: Experiencia) => {
    if (saldoActual < exp.precio) return;
    setReservandoId(exp.id);
    setTimeout(() => {
      const ticket = `QHM-${exp.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setReservas((prev) => [{ id: ticket, expId: exp.id, titulo: exp.titulo, fecha: exp.fecha, ticket }, ...prev]);
      setSaldoActual((s) => s - exp.precio);
      setConfirmacionReserva(ticket);
      setReservandoId(null);
      setTimeout(() => setConfirmacionReserva(null), 5000);
    }, 1000);
  };

  const handleCancelar = (reservaId: string, precio: number) => {
    setCancelando(reservaId);
    setTimeout(() => {
      setReservas((prev) => prev.filter((r) => r.id !== reservaId));
      setSaldoActual((s) => s + precio);
      setCancelando(null);
    }, 800);
  };

  // suppress unused warning
  void iaVersion;

  return (
    <div className="flex gap-6">
      {/* Columna principal */}
      <div className="flex-1 min-w-0">
        {/* Hero balance */}
        <div className="relative overflow-hidden bg-gradient-to-r from-sidebar to-accent-dark rounded-2xl p-6 mb-6">
          <div className="absolute top-4 right-4 opacity-10">
            <Coins size={80} className="text-accent" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Coins size={16} className="text-accent" />
              <span className="text-[12px] font-bold text-accent uppercase tracking-wider">{lbl("Saldo Q-Coins", "Q-Coins Balance")}</span>
            </div>
            <div className="text-[48px] font-bold text-white leading-none mb-4">{saldoActual}</div>
            <div className="flex items-center gap-6">
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white/60">Lvl {playerLevel.level} — {playerLevel.title}</span>
                  <span className="text-[11px] text-white/60">{playerLevel.xpCurrent}/{playerLevel.xpRequired} XP</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-white/10">
                  <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${levelPercent}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                <Flame size={14} className="text-warning" />
                <span className="text-[13px] font-bold text-white">{currentStudent.streak}-day streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Mercado de Canjes ─── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Mercado de Canjes", "Rewards Market")}</h2>
              <p className="text-[11px] text-text-muted mt-0.5">{lbl("Talleres · Maker Studio · Excursiones · Passion Workshop", "Workshops · Maker Studio · Trips · Passion Workshop")}</p>
            </div>
            {carrito.length > 0 && (
              <div className="flex items-center gap-1.5 bg-accent-light border border-accent/30 px-3 py-1.5 rounded-full">
                <ShoppingCart size={12} className="text-accent-text" />
                <span className="text-[11px] font-bold text-accent-text">{carrito.length} {lbl("en carrito", "in cart")} · {totalCarrito} QC</span>
              </div>
            )}
          </div>

          {/* IA Recomendación — Prof. Ana detecta competencia más baja */}
          {!iaDismissed && iaItemRec && (
            <div className="bg-sidebar rounded-2xl p-4 mb-4 relative">
              <button
                onClick={() => setIaDismissed(true)}
                className="absolute top-3 right-3 text-white/40 hover:text-white/80 cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-sidebar" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-accent uppercase tracking-wide">{lbl("Prof. Ana recomienda", "Prof. Ana recommends")}</span>
                    <span className="text-[9px] text-white/40">{lbl("Tu competencia más baja", "Your lowest competency")}: {weakestComp?.shortName} ({weakestComp?.progress}%)</span>
                  </div>
                  <p className="text-[13px] font-semibold text-white mb-1">{iaItemRec.nombre}</p>
                  <p className="text-[11px] text-white/60 leading-relaxed mb-3">{iaRec?.razon}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setCatActiva(iaRec?.categoria ?? "Todo"); }}
                      className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
                    >
                      {lbl("Ver en mercado →", "View in market →")}
                    </button>
                    <button
                      onClick={handleRefreshIa}
                      disabled={isRefreshingIa}
                      className="flex items-center gap-1.5 bg-white/10 text-white text-[11px] font-medium px-3 py-1.5 rounded-xl hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isRefreshingIa ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {isRefreshingIa ? lbl("Analizando…", "Analyzing…") : lbl("Renovar consejo", "Refresh advice")}
                    </button>
                    <span className="text-[10px] text-white/40 ml-1">{iaItemRec.precio} QC · {iaItemRec.stock} {lbl("plazas", "spots")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros por categoría */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCatActiva(cat)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer border ${
                  catActiva === cat
                    ? `${catColors[cat]} border-transparent`
                    : "bg-card text-text-muted border-card-border hover:text-text-secondary"
                }`}
              >
                {catLabels[cat]}
                {cat !== "Todo" && (
                  <span className="ml-1 opacity-60">({mercadoItems.filter((i) => i.categoria === cat).length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Grid de items */}
          <div className="grid grid-cols-3 gap-3">
            {itemsFiltrados.map((item) => {
              const Icon = mercadoIconMap[item.icon] || Sparkles;
              const enCarrito = carrito.some((c) => c.id === item.id);
              const puedePermitirse = saldoDisponible >= item.precio;
              const catColor = catColors[item.categoria];

              return (
                <div
                  key={item.id}
                  className={`bg-card rounded-2xl p-4 border transition-all ${
                    enCarrito ? "border-accent-text/30 ring-1 ring-accent/30" : "border-card-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${catColor}`}>
                      <Icon size={18} className={catColor.split(" ")[1]} />
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-background text-text-muted border border-card-border">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[12px] font-bold text-text-primary mb-1 leading-snug">{item.nombre}</p>
                  <p className="text-[10px] text-text-muted leading-relaxed mb-3">{item.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins size={11} className="text-accent-text" />
                      <span className="text-[13px] font-bold text-accent-text">{item.precio}</span>
                      <span className="text-[9px] text-text-muted">· {item.stock} {lbl("disponibles", "available")}</span>
                    </div>
                    {enCarrito ? (
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-[10px] font-bold text-urgent bg-urgent-light border border-urgent/20 px-2.5 py-1.5 rounded-xl cursor-pointer hover:brightness-95 transition-all"
                      >
                        <X size={10} />
                        {lbl("Quitar", "Remove")}
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!puedePermitirse}
                        className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                          puedePermitirse
                            ? "bg-accent text-sidebar hover:brightness-110"
                            : "bg-background text-text-muted cursor-not-allowed"
                        }`}
                      >
                        {puedePermitirse ? <ShoppingCart size={10} /> : <Lock size={10} />}
                        {puedePermitirse ? lbl("Añadir", "Add") : lbl("Sin saldo", "No funds")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── S31: Tienda de Experiencias ─── */}
        {(catActiva === "Todo" || catActiva === "Experiencias") && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[20px] font-semibold text-text-primary">{lbl("Tienda de Experiencias", "Experience Store")}</h2>
                <p className="text-[11px] text-text-muted mt-0.5">{lbl("Reserva tu plaza en experiencias reales del mundo profesional", "Reserve your spot at real professional experiences")}</p>
              </div>
              {reservas.length > 0 && (
                <button
                  onClick={() => setShowMisReservas((v) => !v)}
                  className="flex items-center gap-1.5 bg-sidebar text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all"
                >
                  <Ticket size={11} />
                  {showMisReservas ? lbl("Ocultar reservas", "Hide bookings") : `${lbl("Mis reservas", "My bookings")} (${reservas.length})`}
                </button>
              )}
            </div>

            {/* Confirmación de reserva */}
            {confirmacionReserva && (
              <div className="flex items-start gap-3 bg-success-light border border-success/20 rounded-xl p-4 mb-4">
                <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-success">{lbl("¡Plaza reservada con éxito!", "Spot reserved successfully!")}</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">{lbl("Tu código de ticket:", "Your ticket code:")} <span className="font-bold text-sidebar">{confirmacionReserva}</span></p>
                  <p className="text-[10px] text-text-muted mt-1">{lbl("Guarda este código. Lo necesitarás el día del evento.", "Save this code. You'll need it on the day of the event.")}</p>
                </div>
              </div>
            )}

            {/* Mis reservas */}
            {showMisReservas && reservas.length > 0 && (
              <div className="bg-background rounded-2xl p-4 mb-4 border border-card-border">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket size={13} className="text-sidebar" />
                  <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Mis reservas activas", "My active bookings")}</h3>
                </div>
                <div className="space-y-2">
                  {reservas.map((r) => {
                    const exp = experienciasData.find((e) => e.id === r.expId);
                    return (
                      <div key={r.id} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-card-border">
                        <div className="w-8 h-8 rounded-lg bg-sidebar/10 flex items-center justify-center flex-shrink-0">
                          {exp && <exp.icon size={14} className="text-sidebar" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-text-primary truncate">{r.titulo}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-text-muted">{r.fecha}</span>
                            <span className="text-[9px] font-bold bg-accent-light text-accent-text px-1.5 py-0.5 rounded-full">{r.ticket}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const precio = exp?.precio ?? 0;
                            handleCancelar(r.id, precio);
                          }}
                          disabled={cancelando === r.id}
                          className="text-[9px] font-bold text-urgent border border-urgent/20 bg-urgent-light px-2.5 py-1.5 rounded-xl cursor-pointer hover:brightness-95 transition-all disabled:opacity-50 flex-shrink-0"
                        >
                          {cancelando === r.id ? "…" : lbl("Cancelar", "Cancel")}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grid de experiencias */}
            <div className="grid grid-cols-2 gap-4">
              {experienciasData.map((exp) => {
                const plazasLibres = exp.aforo.total - exp.aforo.ocupado;
                const yaTieneReserva = reservas.some((r) => r.expId === exp.id);
                const puedePagar = saldoActual >= exp.precio;
                const plazasPct = (exp.aforo.ocupado / exp.aforo.total) * 100;
                return (
                  <div key={exp.id} className={`bg-card rounded-2xl p-4 border transition-all ${yaTieneReserva ? "border-success/30 ring-1 ring-success/20" : "border-card-border"}`}>
                    {/* Imagen placeholder */}
                    <div className="w-full h-20 rounded-xl bg-sidebar/10 flex items-center justify-center mb-3 relative overflow-hidden">
                      <exp.icon size={32} className="text-sidebar/40" />
                      {yaTieneReserva && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-success text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={9} />
                          {lbl("Reservada", "Booked")}
                        </div>
                      )}
                    </div>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-[12px] font-bold text-text-primary leading-snug flex-1 pr-2">{exp.titulo}</p>
                      <span className="text-[9px] font-bold bg-warning-light text-text-primary px-2 py-0.5 rounded-full flex-shrink-0">{exp.fecha}</span>
                    </div>
                    <p className="text-[10px] text-text-muted leading-relaxed mb-3">{exp.descripcion}</p>
                    {/* Aforo */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-text-muted">{lbl("Plazas", "Spots")}: {exp.aforo.ocupado}/{exp.aforo.total}</span>
                        <span className={`text-[9px] font-bold ${plazasLibres <= 2 ? "text-urgent" : plazasLibres <= 4 ? "text-warning" : "text-success"}`}>
                          {plazasLibres} {lbl("libres", "left")}
                        </span>
                      </div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${plazasPct >= 90 ? "bg-urgent" : plazasPct >= 70 ? "bg-warning" : "bg-success"}`}
                          style={{ width: `${plazasPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins size={11} className="text-accent-text" />
                        <span className="text-[14px] font-bold text-accent-text">{exp.precio}</span>
                        <span className="text-[9px] text-text-muted">QC</span>
                      </div>
                      {yaTieneReserva ? (
                        <span className="text-[10px] font-bold text-success bg-success-light px-3 py-1.5 rounded-xl">
                          ✓ {lbl("Reservada", "Booked")}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReservar(exp)}
                          disabled={!puedePagar || plazasLibres === 0 || reservandoId === exp.id}
                          className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            puedePagar && plazasLibres > 0
                              ? "bg-sidebar text-white hover:brightness-110"
                              : "bg-background text-text-muted cursor-not-allowed"
                          } disabled:opacity-60`}
                        >
                          {reservandoId === exp.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Ticket size={10} />
                          )}
                          {reservandoId === exp.id
                            ? lbl("Reservando…", "Booking…")
                            : plazasLibres === 0
                            ? lbl("Sin plazas", "Full")
                            : !puedePagar
                            ? lbl("Sin saldo", "No funds")
                            : lbl("Reservar plaza", "Reserve spot")}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Historial de canjes ─── */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">{lbl("Historial de canjes", "Redemption history")}</h2>
          <div className="space-y-2.5">
            {historiales.map((h) => (
              <div key={h.id} className="flex items-center gap-3 bg-card rounded-xl border border-card-border p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  h.estado === "realizado" ? "bg-success-light" : "bg-accent-light"
                }`}>
                  <CheckCircle2 size={16} className={h.estado === "realizado" ? "text-success" : "text-accent-text"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-text-primary">{h.nombre}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      h.estado === "realizado" ? "bg-success-light text-success" : "bg-accent-light text-accent-text"
                    }`}>
                      {h.estado === "realizado" ? lbl("Realizado", "Completed") : lbl("Confirmado", "Confirmed")}
                    </span>
                    <span className="text-[10px] text-text-muted">{h.fecha}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Coins size={11} className="text-urgent" />
                  <span className="text-[12px] font-bold text-urgent">-{h.precio}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Q-Store digital ─── */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">Q-Store digital</h2>
          <div className="grid grid-cols-3 gap-3">
            {shopItems.map((item) => {
              const Icon = shopIconMap[item.icon] || Sparkles;
              const canAfford = currentStudent.qcoins >= item.price;
              return (
                <div
                  key={item.id}
                  className={`bg-card rounded-2xl p-4 border border-card-border flex flex-col items-center text-center transition-all ${
                    !canAfford && !item.owned ? "opacity-50" : ""
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                    item.owned ? "bg-success-light" : canAfford ? "bg-accent-light" : "bg-background"
                  }`}>
                    <Icon size={22} className={item.owned ? "text-success" : canAfford ? "text-accent-text" : "text-text-muted"} />
                  </div>
                  <span className="text-[13px] font-semibold text-text-primary mb-0.5">{item.name}</span>
                  <span className="text-[11px] text-text-muted mb-3 leading-snug">{item.description}</span>
                  {item.owned ? (
                    <span className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-success-light text-success">{lbl("Activado", "Active")}</span>
                  ) : (
                    <button
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
                        canAfford
                          ? "bg-accent text-sidebar hover:brightness-110 cursor-pointer"
                          : "bg-background text-text-muted cursor-not-allowed"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Coins size={11} />
                        {item.price}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Logros ─── */}
        <div>
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">{lbl("Logros", "Achievements")}</h2>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((ach) => {
              const Icon = achievementIconMap[ach.icon] || Trophy;
              return (
                <div
                  key={ach.id}
                  className={`bg-card rounded-2xl p-4 border border-card-border flex items-start gap-3 ${!ach.unlocked ? "opacity-50" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ach.unlocked ? "bg-accent-light" : "bg-background"}`}>
                    {ach.unlocked ? <Icon size={18} className="text-accent-text" /> : <Lock size={16} className="text-text-muted" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[13px] font-semibold text-text-primary block">{ach.name}</span>
                    <span className="text-[11px] text-text-muted leading-snug block">{ach.description}</span>
                    {ach.unlocked && ach.date && (
                      <span className="text-[10px] text-success font-medium mt-1 block">{ach.date}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="w-[280px] flex-shrink-0 space-y-4">
        {/* Carrito */}
        <div className="bg-card rounded-2xl border border-card-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart size={14} className="text-accent-text" />
            <h3 className="text-[13px] font-bold text-text-primary">{lbl("Carrito", "Cart")}</h3>
            {carrito.length > 0 && (
              <span className="ml-auto text-[9px] font-bold bg-accent text-sidebar px-1.5 py-0.5 rounded-full">{carrito.length}</span>
            )}
          </div>

          {carrito.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingCart size={28} className="text-text-muted mx-auto mb-2 opacity-30" />
              <p className="text-[11px] text-text-muted">{lbl("Tu carrito está vacío", "Your cart is empty")}</p>
            </div>
          ) : canjeConfirmado ? (
            <div className="text-center py-6">
              <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
              <p className="text-[12px] font-bold text-success">{lbl("¡Canje confirmado!", "Redemption confirmed!")}</p>
              <p className="text-[10px] text-text-muted mt-1">{lbl("Recibirás confirmación por correo", "You will receive a confirmation email")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {carrito.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-background rounded-xl p-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-text-primary truncate">{item.nombre}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Coins size={9} className="text-accent-text" />
                        <span className="text-[9px] font-bold text-accent-text">{item.precio}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-5 h-5 rounded-full bg-urgent-light flex items-center justify-center cursor-pointer hover:brightness-95 flex-shrink-0"
                    >
                      <X size={9} className="text-urgent" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-card-border pt-3 mb-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-text-muted">{lbl("Total", "Total")}</span>
                  <span className="font-bold text-text-primary">{totalCarrito} QC</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-text-muted">{lbl("Saldo restante", "Remaining balance")}</span>
                  <span className={`font-bold ${puedeComprar ? "text-success" : "text-urgent"}`}>
                    {saldoDisponible - totalCarrito} QC
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmar}
                disabled={!puedeComprar}
                className={`w-full py-2.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                  puedeComprar
                    ? "bg-sidebar text-white hover:bg-accent-dark"
                    : "bg-background text-text-muted cursor-not-allowed"
                }`}
              >
                {puedeComprar ? lbl("Confirmar canje", "Confirm redemption") : lbl("Saldo insuficiente", "Insufficient balance")}
              </button>
            </>
          )}
        </div>

        {/* S24 — Gráfico evolución mensual */}
        <div className="bg-card rounded-2xl p-4 border border-card-border">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={13} className="text-accent-text" />
            <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Evolución mensual", "Monthly trend")}</h3>
          </div>
          {(() => {
            const maxVal = Math.max(...evolucionMensual.map((m) => m.ganadas));
            return (
              <>
                <div className="flex items-end gap-1.5 h-20 mb-2">
                  {evolucionMensual.map((m, i) => {
                    const isActual = i === evolucionMensual.length - 1;
                    const hGanadas = Math.round((m.ganadas / maxVal) * 72);
                    const hGastadas = Math.round((m.gastadas / maxVal) * 72);
                    return (
                      <div key={m.mes} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "72px" }}>
                          <div className="w-full flex items-end gap-0.5 h-full">
                            <div
                              className={`flex-1 rounded-t-sm transition-all ${isActual ? "bg-sidebar" : "bg-accent-text/40"}`}
                              style={{ height: `${hGanadas}px` }}
                              title={`Ganadas: ${m.ganadas} QC`}
                            />
                            <div
                              className={`flex-1 rounded-t-sm transition-all ${isActual ? "bg-urgent/60" : "bg-urgent/25"}`}
                              style={{ height: `${hGastadas}px` }}
                              title={`Gastadas: ${m.gastadas} QC`}
                            />
                          </div>
                        </div>
                        <span className={`text-[8px] font-medium ${isActual ? "text-sidebar font-bold" : "text-text-muted"}`}>{m.mes}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[9px] text-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-sidebar inline-block" /> {lbl("Ganadas", "Earned")}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-urgent/50 inline-block" /> {lbl("Gastadas", "Spent")}</span>
                  </div>
                  <span className="font-semibold text-success">+{evolucionMensual[evolucionMensual.length - 1].ganadas - evolucionMensual[evolucionMensual.length - 2].ganadas} QC vs mes ant.</span>
                </div>
              </>
            );
          })()}
        </div>

        {/* S24 — Badge Racha de gasto inteligente */}
        {(() => {
          const lastThree = evolucionMensual.slice(-3);
          const rachaActiva = lastThree.every((m) => m.gastadas / m.ganadas < 0.5);
          return rachaActiva ? (
            <div className="bg-sidebar rounded-2xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <Award size={18} className="text-sidebar" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-bold text-accent uppercase tracking-wide">{lbl("Racha activa", "Active streak")}</span>
                    <span className="text-[9px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded-full">3 meses</span>
                  </div>
                  <p className="text-[12px] font-semibold text-white mb-0.5">{lbl("Gasto inteligente 🏆", "Smart spending 🏆")}</p>
                  <p className="text-[10px] text-white/55 leading-relaxed">{lbl("Llevas 3 meses gastando menos del 50% de lo que ganas. Estrategia excepcional.", "3 months spending less than 50% of earnings. Exceptional strategy.")}</p>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* S24 — Historial de transacciones con filtro */}
        <div className="bg-card rounded-2xl p-4 border border-card-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-accent-text" />
              <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Movimientos", "Transactions")}</h3>
            </div>
          </div>
          {/* Filtros */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {(["todo", "ganadas", "gastadas", "pendientes"] as const).map((f) => {
              const labels: Record<typeof f, string> = { todo: lbl("Todo", "All"), ganadas: lbl("Ganadas", "Earned"), gastadas: lbl("Gastadas", "Spent"), pendientes: lbl("Pendientes", "Pending") };
              return (
                <button
                  key={f}
                  onClick={() => setFiltroTx(f)}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all border ${
                    filtroTx === f
                      ? f === "ganadas" ? "bg-success-light text-success border-success/20"
                        : f === "gastadas" ? "bg-urgent-light text-urgent border-urgent/20"
                        : f === "pendientes" ? "bg-warning-light text-warning border-warning/20"
                        : "bg-accent-light text-accent-text border-accent/20"
                      : "bg-background text-text-muted border-card-border"
                  }`}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>

          {/* Transacciones pendientes */}
          {(filtroTx === "todo" || filtroTx === "pendientes") && (
            <div className="mb-2">
              {transaccionesPendientes.map((p) => (
                <div key={p.id} className="flex items-center gap-2 py-1.5 border-b border-card-border last:border-0">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-warning-light">
                    <Coins size={11} className="text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-text-primary block truncate">{p.descripcion}</span>
                    <span className="text-[9px] text-text-muted">{p.fecha}</span>
                  </div>
                  <span className="text-[11px] font-bold flex-shrink-0 text-warning">+{p.cantidad}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-0 max-h-[280px] overflow-y-auto">
            {coinTransactions
              .filter((tx) => {
                if (filtroTx === "ganadas") return tx.type === "earned";
                if (filtroTx === "gastadas") return tx.type === "spent";
                if (filtroTx === "pendientes") return false;
                return true;
              })
              .map((tx, i, arr) => {
                const prevDate = i > 0 ? arr[i - 1].date.split(" ")[0] : "";
                const currentDate = tx.date.split(" ")[0];
                const showDivider = currentDate !== prevDate;
                return (
                  <div key={tx.id}>
                    {showDivider && (
                      <div className="flex items-center gap-2 py-1.5 mt-1">
                        <div className="h-px flex-1 bg-card-border" />
                        <span className="text-[9px] font-semibold text-text-muted uppercase">{currentDate}</span>
                        <div className="h-px flex-1 bg-card-border" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 py-1.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${tx.type === "earned" ? "bg-success-light" : "bg-urgent-light"}`}>
                        {tx.type === "earned" ? <TrendingUp size={11} className="text-success" /> : <TrendingDown size={11} className="text-urgent" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-text-primary block truncate">{tx.description}</span>
                        <span className="text-[9px] text-text-muted">{tx.date}</span>
                      </div>
                      <span className={`text-[11px] font-bold flex-shrink-0 ${tx.type === "earned" ? "text-success" : "text-urgent"}`}>
                        {tx.type === "earned" ? "+" : ""}{tx.amount}
                      </span>
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
