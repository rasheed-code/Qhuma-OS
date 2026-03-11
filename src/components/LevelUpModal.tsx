"use client";

import { useEffect, useState } from "react";
import { X, Star, Zap, Trophy, ChevronRight } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  prevLevel: number;
  newLevel: number;
  newTitle: string;
  xpGained: number;
  unlockedFeature?: string;
}

const levelColors = [
  "", // 0
  "from-[#c3f499] to-[#a8e07a]",   // 1 — Aprendiz
  "from-[#c3f499] to-[#7fcb50]",   // 2 — Explorador
  "from-[#86efac] to-[#22c55e]",   // 3 — Artesano
  "from-[#fde68a] to-[#f59e0b]",   // 4 — Estratega
  "from-[#fca5a5] to-[#ef4444]",   // 5 — Maestro
];

const newPerks: Record<number, string[]> = {
  2: ["Acceso a los Deep Dive del proyecto", "Nuevo avatar desbloqueado"],
  3: ["Sistema de Error Log activado", "Badge de Artesano visible"],
  4: ["Modo Socrático con tu tutor IA", "Multiplica Q-Coins x1.5"],
  5: ["Acceso a QHUMA Capital (hasta €1.000)", "Pitch Lab desbloqueado"],
};

export default function LevelUpModal({
  isOpen,
  onClose,
  prevLevel,
  newLevel,
  newTitle,
  xpGained,
  unlockedFeature,
}: LevelUpModalProps) {
  const [visible, setVisible] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setBurst(true), 100);
    } else {
      setBurst(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [isOpen]);

  if (!visible) return null;

  const gradient = levelColors[newLevel] ?? levelColors[2];
  const perks = newPerks[newLevel] ?? ["Nuevas misiones disponibles", "Badge especial desbloqueado"];

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
        burst ? "bg-black/40 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-[400px] bg-card rounded-3xl shadow-sm overflow-hidden transition-all duration-300 ${
          burst ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${gradient} px-6 pt-8 pb-6 text-center relative`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-all cursor-pointer"
          >
            <X size={13} className="text-sidebar" />
          </button>

          {/* Level badge */}
          <div className="w-20 h-20 rounded-full bg-sidebar mx-auto mb-3 flex flex-col items-center justify-center shadow-sm">
            <Star size={18} className="text-accent mb-0.5" />
            <span className="text-accent font-black text-[22px] leading-none">Nv.{newLevel}</span>
          </div>

          <div className="text-sidebar text-[11px] font-bold uppercase tracking-widest mb-1 opacity-60">
            ¡Subiste de nivel!
          </div>
          <h2 className="text-sidebar font-black text-[26px] leading-tight mb-1">{newTitle}</h2>
          <p className="text-sidebar/60 text-[12px]">
            Antes: Nivel {prevLevel} · Ahora: Nivel {newLevel}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* XP gained */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="flex items-center gap-1.5 bg-accent-light rounded-full px-4 py-1.5">
              <Zap size={13} className="text-accent-text" />
              <span className="text-[13px] font-bold text-accent-text">+{xpGained} XP ganados</span>
            </div>
          </div>

          {/* Perks unlocked */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={13} className="text-accent-text" />
              <span className="text-[12px] font-bold text-text-primary">Desbloqueado en este nivel</span>
            </div>
            <div className="space-y-2">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-background rounded-xl px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-[11px] text-text-secondary">{perk}</span>
                </div>
              ))}
              {unlockedFeature && (
                <div className="flex items-center gap-2.5 bg-accent-light rounded-xl px-3 py-2 border border-accent-text/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-text flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-accent-text">{unlockedFeature}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full bg-sidebar text-accent text-[12px] font-bold py-3 rounded-2xl hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            ¡A por el siguiente nivel!
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
