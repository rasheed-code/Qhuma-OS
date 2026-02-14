"use client";

import {
  Coins,
  Zap,
  Flame,
  Trophy,
  FileText,
  Users,
  Star,
  Lock,
  Swords,
  Timer,
} from "lucide-react";
import { currentStudent } from "@/data/students";
import { competencies } from "@/data/competencies";
import { taskEvidence } from "@/data/evidence";
import { playerLevel, currentTribe, achievements } from "@/data/gamification";
import EvidencePreviewSwitch from "@/components/EvidencePreview";

const achievementIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Swords,
  Timer,
  Star,
  Users,
  Coins,
  Zap,
};

export default function StudentProfile() {
  const levelPercent = Math.round(
    (playerLevel.xpCurrent / playerLevel.xpRequired) * 100
  );

  return (
    <div>
      {/* Hero section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-sidebar flex items-center justify-center text-white text-[24px] font-bold flex-shrink-0">
          {currentStudent.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[28px] font-semibold text-text-primary leading-tight">{currentStudent.name}</h1>
            <span className="text-[13px] text-text-muted">{currentStudent.class}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 bg-accent-light px-3 py-1 rounded-full">
              <Trophy size={12} className="text-accent-text" />
              <span className="text-[11px] font-semibold text-accent-text">
                Lvl {playerLevel.level} — {playerLevel.title}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-warning-light px-3 py-1 rounded-full">
              <Flame size={12} className="text-warning" />
              <span className="text-[11px] font-semibold text-warning">
                {currentStudent.streak}-day streak
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-accent-light px-3 py-1 rounded-full">
              <Coins size={12} className="text-accent-text" />
              <span className="text-[11px] font-semibold text-accent-text">
                {currentStudent.qcoins} Q-Coins
              </span>
            </div>
          </div>
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-text-muted">Next: {playerLevel.nextTitle}</span>
              <span className="text-[11px] text-text-muted">{playerLevel.xpCurrent}/{playerLevel.xpRequired} XP</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-background">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sidebar to-accent-dark transition-all duration-700"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <div className="flex items-center gap-1.5">
            <Coins size={13} className="text-accent-text" />
            <span className="text-[11px] text-text-muted font-medium">Q-Coins</span>
          </div>
          <span className="text-[28px] font-bold text-text-primary leading-none">{currentStudent.qcoins}</span>
        </div>
        <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-accent-text" />
            <span className="text-[11px] text-text-muted font-medium">XP Total</span>
          </div>
          <span className="text-[28px] font-bold text-text-primary leading-none">{currentStudent.xpTotal.toLocaleString()}</span>
        </div>
        <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <div className="flex items-center gap-1.5">
            <FileText size={13} className="text-accent-text" />
            <span className="text-[11px] text-text-muted font-medium">Evidences</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-text-primary leading-none">{currentStudent.evidencesSubmitted}</span>
            <span className="text-[13px] text-text-muted">/{currentStudent.evidencesTotal}</span>
          </div>
        </div>
        <div className="bg-sidebar rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <div className="flex items-center gap-1.5">
            <Flame size={13} className="text-warning" />
            <span className="text-[11px] text-white/50 font-medium">Streak</span>
          </div>
          <div>
            <span className="text-[28px] font-bold text-white leading-none">{currentStudent.streak}</span>
            <span className="text-[11px] text-white/40 ml-1">days</span>
          </div>
        </div>
      </div>

      {/* My Tribe */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users size={16} className="text-text-primary" />
          <h2 className="text-[20px] font-semibold text-text-primary">My Tribe</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-accent-light text-accent-text text-[11px] font-semibold">
            {currentTribe.name}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {currentTribe.members.map((member) => (
            <div
              key={member.id}
              className={`bg-background rounded-2xl p-4 flex flex-col items-center text-center ${
                member.isCurrentUser ? "ring-2 ring-accent-light" : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold mb-2 ${
                  member.isCurrentUser
                    ? "bg-accent text-sidebar"
                    : "bg-white text-text-secondary"
                }`}
              >
                {member.avatar}
              </div>
              <span className="text-[13px] font-semibold text-text-primary">{member.name}</span>
              <span className="text-[11px] text-text-muted">{member.role}</span>
              {member.badge && (
                <div className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-warning-light">
                  <Star size={10} className="text-warning fill-warning" />
                  <span className="text-[9px] font-semibold text-warning">{member.badge}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Portfolio */}
      <div className="mb-8">
        <h2 className="text-[20px] font-semibold text-text-primary mb-4">Evidence Portfolio</h2>
        <div className="grid grid-cols-3 gap-4">
          {taskEvidence.map((ev) => (
            <div key={ev.taskId} className="bg-card rounded-2xl p-4 border border-card-border">
              <div className="mb-3">
                <EvidencePreviewSwitch evidence={ev} />
              </div>
              <span className="text-[12px] font-semibold text-text-primary block leading-snug mb-1">
                {ev.title}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-background text-text-muted capitalize">
                {ev.type.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Competency Overview */}
      <div className="mb-8">
        <h2 className="text-[20px] font-semibold text-text-primary mb-4">Competencies</h2>
        <div className="grid grid-cols-4 gap-3">
          {competencies.map((comp) => (
            <div key={comp.key} className="bg-background rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comp.color }} />
                <span className="text-[11px] font-semibold text-text-primary">{comp.shortName}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${comp.progress}%`, backgroundColor: comp.color }}
                />
              </div>
              <span className="text-[10px] text-text-muted mt-1 block">{comp.progress}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-[20px] font-semibold text-text-primary mb-4">Achievements</h2>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {achievements.map((ach) => {
            const Icon = achievementIconMap[ach.icon] || Trophy;
            return (
              <div key={ach.id} className="flex flex-col items-center flex-shrink-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1.5 ${
                  ach.unlocked ? "bg-accent-light" : "bg-background"
                }`}>
                  {ach.unlocked ? (
                    <Icon size={22} className="text-accent-text" />
                  ) : (
                    <Lock size={18} className="text-text-muted" />
                  )}
                </div>
                <span className={`text-[10px] font-semibold text-center leading-tight ${
                  ach.unlocked ? "text-text-primary" : "text-text-muted"
                }`}>
                  {ach.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
