"use client";

import { useState } from "react";
import {
  Trophy, Star, Flame, Zap, BarChart3, Globe, Users, BookOpen,
  TrendingUp, FileText, Shield, Target, Sparkles, Lock,
  Award, Search,
} from "lucide-react";

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

type FilterRarity = "todas" | Rarity;

export default function StudentAchievements() {
  const [filter, setFilter] = useState<FilterRarity>("todas");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = filter === "todas" ? unlocked : unlocked.filter((a) => a.rarity === filter);

  const countByRarity = (r: Rarity) => unlocked.filter((a) => a.rarity === r).length;

  return (
    <div className="flex gap-5">
      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={18} className="text-accent-text" />
              <h1 className="text-[22px] font-bold text-text-primary">Mis Logros</h1>
            </div>
            <p className="text-[13px] text-text-secondary">
              <span className="font-medium text-accent-text">{unlocked.length}</span> logros conseguidos ·{" "}
              <span className="font-medium text-text-primary">{totalXP} XP</span> acumulados
            </p>
          </div>
        </div>

        {/* Stats rarity row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {(["Común", "Raro", "Legendario"] as Rarity[]).map((r) => {
            const cfg = rarityConfig[r];
            return (
              <div key={r} className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border} text-center`}>
                <span className={`text-[22px] font-bold block ${cfg.text}`}>{countByRarity(r)}</span>
                <span className="text-[10px] text-text-muted">{r}</span>
              </div>
            );
          })}
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
              {f === "todas" ? `Todas (${unlocked.length})` : f}
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
                        {a.rarity}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed mb-2">{a.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-muted">{a.date}</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={10} className="text-accent-text" />
                        <span className="text-[11px] font-bold text-accent-text">+{a.xp} XP</span>
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
            <h2 className="text-[14px] font-semibold text-text-primary">Próximos logros</h2>
            <span className="text-[11px] text-text-muted">({locked.length} bloqueados)</span>
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
                          {a.rarity}
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
          <span className="text-[11px] text-white/50">XP total de logros</span>
        </div>

        {/* Rarity breakdown */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">Por rareza</h3>
          <div className="space-y-3">
            {(["Legendario", "Raro", "Común"] as Rarity[]).map((r) => {
              const cfg = rarityConfig[r];
              const count = countByRarity(r);
              const total = unlocked.filter((a) => a.rarity === r || true).length;
              return (
                <div key={r}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[11px] font-semibold ${cfg.text}`}>{r}</span>
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

        {/* Next milestone */}
        <div className="bg-accent-light border border-accent-text/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={13} className="text-accent-text" />
            <span className="text-[12px] font-semibold text-accent-text">Siguiente logro</span>
          </div>
          <p className="text-[12px] font-semibold text-text-primary mb-0.5">Portfolio de élite</p>
          <p className="text-[11px] text-text-secondary mb-2">9 / 16 evidencias aprobadas</p>
          <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div className="h-full bg-accent-text rounded-full" style={{ width: "56%" }} />
          </div>
          <p className="text-[9px] text-accent-text mt-1 font-medium">56% completado</p>
        </div>

        {/* Recent unlocks */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">Recientes</h3>
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
