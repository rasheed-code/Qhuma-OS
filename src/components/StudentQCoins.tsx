"use client";

import {
  Coins,
  Zap,
  Flame,
  Trophy,
  Sparkles,
  Timer,
  Users,
  Lightbulb,
  Palette,
  Swords,
  Star,
  Lock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { currentStudent } from "@/data/students";
import {
  playerLevel,
  coinTransactions,
  shopItems,
  achievements,
} from "@/data/gamification";

const shopIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap,
  Palette,
  Timer,
  Users,
  Lightbulb,
  Sparkles,
};

const achievementIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Swords,
  Timer,
  Star,
  Users,
  Coins,
  Zap,
};

export default function StudentQCoins() {
  const levelPercent = Math.round(
    (playerLevel.xpCurrent / playerLevel.xpRequired) * 100
  );

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Hero card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-sidebar to-accent-dark rounded-2xl p-6 mb-6">
          <div className="absolute top-4 right-4 opacity-10">
            <Coins size={80} className="text-accent" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Coins size={16} className="text-accent" />
              <span className="text-[12px] font-bold text-accent uppercase tracking-wider">
                Q-Coins Balance
              </span>
            </div>
            <div className="text-[48px] font-bold text-white leading-none mb-4">
              {currentStudent.qcoins}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white/60">
                    Lvl {playerLevel.level} — {playerLevel.title}
                  </span>
                  <span className="text-[11px] text-white/60">
                    {playerLevel.xpCurrent}/{playerLevel.xpRequired} XP
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-white/10">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700"
                    style={{ width: `${levelPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                <Flame size={14} className="text-warning" />
                <span className="text-[13px] font-bold text-white">
                  {currentStudent.streak}-day streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Q-Store */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">Q-Store</h2>
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
                    <span className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-success-light text-success">
                      Owned
                    </span>
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

        {/* Achievements */}
        <div>
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">Achievements</h2>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((ach) => {
              const Icon = achievementIconMap[ach.icon] || Trophy;
              return (
                <div
                  key={ach.id}
                  className={`bg-card rounded-2xl p-4 border border-card-border flex items-start gap-3 ${
                    !ach.unlocked ? "opacity-50" : ""
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    ach.unlocked ? "bg-accent-light" : "bg-background"
                  }`}>
                    {ach.unlocked ? (
                      <Icon size={18} className="text-accent-text" />
                    ) : (
                      <Lock size={16} className="text-text-muted" />
                    )}
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

      {/* Right panel — Transaction History */}
      <div className="w-[300px] flex-shrink-0">
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Transaction History</h3>
          <div className="flex flex-col gap-1 max-h-[600px] overflow-y-auto">
            {coinTransactions.map((tx, i) => {
              const prevDate = i > 0 ? coinTransactions[i - 1].date.split(" ")[0] : "";
              const currentDate = tx.date.split(" ")[0];
              const showDivider = currentDate !== prevDate;

              return (
                <div key={tx.id}>
                  {showDivider && (
                    <div className="flex items-center gap-2 py-2 mt-1">
                      <div className="h-px flex-1 bg-card-border" />
                      <span className="text-[10px] font-semibold text-text-muted uppercase">{currentDate}</span>
                      <div className="h-px flex-1 bg-card-border" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 py-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      tx.type === "earned" ? "bg-success-light" : "bg-urgent-light"
                    }`}>
                      {tx.type === "earned" ? (
                        <TrendingUp size={13} className="text-success" />
                      ) : (
                        <TrendingDown size={13} className="text-urgent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-text-primary block truncate">{tx.description}</span>
                      <span className="text-[10px] text-text-muted">{tx.date}</span>
                    </div>
                    <span className={`text-[12px] font-bold flex-shrink-0 ${
                      tx.type === "earned" ? "text-success" : "text-urgent"
                    }`}>
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
