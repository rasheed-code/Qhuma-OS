"use client";

import { useState } from "react";
import {
  Coins, Zap, Flame, Trophy, Sparkles, Timer, Users, Lightbulb,
  Palette, Swords, Star, Lock, TrendingUp, TrendingDown,
  ShoppingCart, X, CheckCircle2, Camera, Cpu, MapPin, Mic, Loader2,
} from "lucide-react";
import { currentStudent } from "@/data/students";
import { playerLevel, coinTransactions, shopItems, achievements } from "@/data/gamification";
import { competencies } from "@/data/competencies";

// ─── Mercado de canjes ───────────────────────────────────────────────
type Categoria = "Todo" | "Talleres" | "Maker" | "Excursiones" | "Passion";

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

const categorias: Categoria[] = ["Todo", "Talleres", "Maker", "Excursiones", "Passion"];
const catColors: Record<Categoria, string> = {
  Todo: "bg-background text-text-secondary",
  Talleres: "bg-accent-light text-accent-text",
  Maker: "bg-success-light text-success",
  Excursiones: "bg-warning-light text-warning",
  Passion: "bg-urgent-light text-urgent",
};

export default function StudentQCoins() {
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

  const itemsFiltrados = catActiva === "Todo" ? mercadoItems : mercadoItems.filter((i) => i.categoria === catActiva);
  const totalCarrito = carrito.reduce((s, i) => s + i.precio, 0);
  const saldoDisponible = currentStudent.qcoins;
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
              <span className="text-[12px] font-bold text-accent uppercase tracking-wider">Saldo Q-Coins</span>
            </div>
            <div className="text-[48px] font-bold text-white leading-none mb-4">{saldoDisponible}</div>
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
              <h2 className="text-[20px] font-semibold text-text-primary">Mercado de Canjes</h2>
              <p className="text-[11px] text-text-muted mt-0.5">Talleres · Maker Studio · Excursiones · Passion Workshop</p>
            </div>
            {carrito.length > 0 && (
              <div className="flex items-center gap-1.5 bg-accent-light border border-accent/30 px-3 py-1.5 rounded-full">
                <ShoppingCart size={12} className="text-accent-text" />
                <span className="text-[11px] font-bold text-accent-text">{carrito.length} en carrito · {totalCarrito} QC</span>
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
                    <span className="text-[11px] font-bold text-accent uppercase tracking-wide">Prof. Ana recomienda</span>
                    <span className="text-[9px] text-white/40">Tu competencia más baja: {weakestComp?.shortName} ({weakestComp?.progress}%)</span>
                  </div>
                  <p className="text-[13px] font-semibold text-white mb-1">{iaItemRec.nombre}</p>
                  <p className="text-[11px] text-white/60 leading-relaxed mb-3">{iaRec?.razon}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setCatActiva(iaRec?.categoria ?? "Todo"); }}
                      className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
                    >
                      Ver en mercado →
                    </button>
                    <button
                      onClick={handleRefreshIa}
                      disabled={isRefreshingIa}
                      className="flex items-center gap-1.5 bg-white/10 text-white text-[11px] font-medium px-3 py-1.5 rounded-xl hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isRefreshingIa ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {isRefreshingIa ? "Analizando…" : "Renovar consejo"}
                    </button>
                    <span className="text-[10px] text-white/40 ml-1">{iaItemRec.precio} QC · {iaItemRec.stock} plazas</span>
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
                {cat}
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
                      <span className="text-[9px] text-text-muted">· {item.stock} disponibles</span>
                    </div>
                    {enCarrito ? (
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-[10px] font-bold text-urgent bg-urgent-light border border-urgent/20 px-2.5 py-1.5 rounded-xl cursor-pointer hover:brightness-95 transition-all"
                      >
                        <X size={10} />
                        Quitar
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
                        {puedePermitirse ? "Añadir" : "Sin saldo"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Historial de canjes ─── */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">Historial de canjes</h2>
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
                      {h.estado === "realizado" ? "Realizado" : "Confirmado"}
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
                    <span className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-success-light text-success">Activado</span>
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
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">Logros</h2>
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
            <h3 className="text-[13px] font-bold text-text-primary">Carrito</h3>
            {carrito.length > 0 && (
              <span className="ml-auto text-[9px] font-bold bg-accent text-sidebar px-1.5 py-0.5 rounded-full">{carrito.length}</span>
            )}
          </div>

          {carrito.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingCart size={28} className="text-text-muted mx-auto mb-2 opacity-30" />
              <p className="text-[11px] text-text-muted">Tu carrito está vacío</p>
            </div>
          ) : canjeConfirmado ? (
            <div className="text-center py-6">
              <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
              <p className="text-[12px] font-bold text-success">¡Canje confirmado!</p>
              <p className="text-[10px] text-text-muted mt-1">Recibirás confirmación por correo</p>
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
                  <span className="text-text-muted">Total</span>
                  <span className="font-bold text-text-primary">{totalCarrito} QC</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-text-muted">Saldo restante</span>
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
                {puedeComprar ? "Confirmar canje" : "Saldo insuficiente"}
              </button>
            </>
          )}
        </div>

        {/* Historial de transacciones */}
        <div className="bg-card rounded-2xl p-4 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">Movimientos</h3>
          <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
            {coinTransactions.map((tx, i) => {
              const prevDate = i > 0 ? coinTransactions[i - 1].date.split(" ")[0] : "";
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
