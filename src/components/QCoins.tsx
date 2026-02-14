"use client";

import { Coins, Zap, TrendingUp } from "lucide-react";
import { currentStudent } from "@/data/students";

export default function QCoins() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-text-primary">
          Q-Coins & XP
        </h3>
        <Coins size={16} className="text-accent" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Q-Coins */}
        <div className="bg-accent-light rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Coins size={13} className="text-accent" />
            <span className="text-[10px] text-text-secondary font-medium">
              Q-Coins
            </span>
          </div>
          <span className="text-[22px] font-bold text-text-primary">
            {currentStudent.qcoins}
          </span>
        </div>

        {/* XP This Week */}
        <div className="bg-success-light rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={13} className="text-success" />
            <span className="text-[10px] text-text-secondary font-medium">
              XP This Week
            </span>
          </div>
          <span className="text-[22px] font-bold text-text-primary">
            {currentStudent.xpWeek}
          </span>
        </div>

        {/* Streak */}
        <div className="bg-warning-light rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={13} className="text-warning" />
            <span className="text-[10px] text-text-secondary font-medium">
              Day Streak
            </span>
          </div>
          <span className="text-[22px] font-bold text-text-primary">
            {currentStudent.streak}
          </span>
        </div>

        {/* Evidences */}
        <div className="bg-background rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-text-secondary font-medium">
              Evidences
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-bold text-text-primary">
              {currentStudent.evidencesSubmitted}
            </span>
            <span className="text-[12px] text-text-muted">
              /{currentStudent.evidencesTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
