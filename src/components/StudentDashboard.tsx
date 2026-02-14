"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  Coins,
  Zap,
  Flame,
  Monitor,
  FileText,
  ShieldCheck,
  Calculator,
  Receipt,
  ClipboardCheck,
  Send,
  MessageCircle,
  ChevronRight,
  Trophy,
  Star,
  Users,
  Swords,
  Timer,
  Lock,
  Palette,
  Table,
  Code,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { weekSchedule } from "@/data/tasks";
import { currentStudent, chatMessages } from "@/data/students";
import { competencies } from "@/data/competencies";
import {
  playerLevel,
  flashMission,
  currentTribe,
  toolOptions,
  projectImpact,
} from "@/data/gamification";
import { Task } from "@/types";

const taskIcons = [
  { icon: Monitor, label: "Landing Page" },
  { icon: FileText, label: "Page Copy" },
  { icon: MessageCircle, label: "Guest Comms" },
  { icon: Calculator, label: "Profitability" },
  { icon: Receipt, label: "Tax Sim" },
  { icon: ClipboardCheck, label: "Legal Check" },
];

const toolIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Palette,
  FileText,
  Table,
  Code,
};

interface StudentDashboardProps {
  onOpenProject?: () => void;
}

export default function StudentDashboard({ onOpenProject }: StudentDashboardProps) {
  const today = weekSchedule.find((d) => d.status === "current")!;
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    today.tasks.find((t) => t.status === "in_progress") || null
  );
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const doneTasks = today.tasks.filter((t) => t.status === "completed");
  const progressPercent = Math.round(
    (doneTasks.length / today.tasks.length) * 100
  );

  const levelPercent = Math.round(
    (playerLevel.xpCurrent / playerLevel.xpRequired) * 100
  );

  return (
    <div className="flex gap-6">
      {/* Left: Main content */}
      <div className="flex-1 min-w-0">
        {/* CD1: Epic Meaning — Hero Reframing */}
        <div className="mb-6">
          {/* Level badge + streak pills */}
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
          </div>

          <h1 className="text-[42px] font-semibold text-text-primary leading-[1.15]">
            Today&apos;s Mission
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[16px] text-text-secondary">
              Lucas&apos;s Airbnb
            </span>
            {onOpenProject && (
              <button
                onClick={onOpenProject}
                className="flex items-center gap-1 text-[12px] font-medium text-accent-text hover:text-sidebar transition-colors cursor-pointer"
              >
                View Project
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* CD2: Accomplishment — Level Progression Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-text-muted font-medium">
              Next: {playerLevel.nextTitle}
            </span>
            <span className="text-[11px] text-text-muted font-medium">
              {playerLevel.xpCurrent}/{playerLevel.xpRequired} XP
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-background">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sidebar to-accent-dark transition-all duration-700"
              style={{ width: `${levelPercent}%` }}
            />
          </div>
        </div>

        {/* Progress card */}
        <div className="bg-background rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[14px] font-medium text-text-primary mb-1">
              You&apos;re {progressPercent}% through today
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[13px] font-semibold text-text-primary">
                {doneTasks.length}/{today.tasks.length}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
            <Zap size={22} className="text-sidebar" />
          </div>
        </div>

        {/* CD7: Unpredictability — Flash Mission Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-sidebar to-accent-dark rounded-2xl p-5 mb-6">
          {/* Decorative sparkles */}
          <div className="absolute top-3 right-3 opacity-15">
            <Sparkles size={40} className="text-accent" />
          </div>

          {!missionAccepted ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Swords size={16} className="text-accent" />
                <span className="text-[12px] font-bold text-accent uppercase tracking-wider">
                  Flash Mission
                </span>
                <div className="flex items-center gap-1 ml-auto bg-white/10 px-2 py-0.5 rounded-full">
                  <Timer size={11} className="text-white/70" />
                  <span className="text-[11px] text-white/70 font-medium">
                    {flashMission.timeLimit} min
                  </span>
                </div>
              </div>
              <p className="text-[14px] text-white/90 leading-relaxed mb-3 pr-8">
                {flashMission.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-accent">
                  +{flashMission.xpReward} XP
                </span>
                <button
                  onClick={() => setMissionAccepted(true)}
                  className="px-4 py-2 bg-accent text-sidebar text-[12px] font-bold rounded-xl hover:bg-accent/90 transition-colors cursor-pointer"
                >
                  Accept Mission
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-accent uppercase tracking-wider">
                    Mission Active
                  </span>
                  <p className="text-[13px] text-white/80 mt-0.5">
                    {flashMission.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                  <Timer size={13} className="text-accent" />
                  <span className="text-[14px] font-bold text-white">
                    14:32
                  </span>
                </div>
                <span className="text-[13px] font-bold text-accent">
                  +{flashMission.xpReward} XP
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick action icons — CD6: Scarcity (lock indicators on upcoming) */}
        <div className="flex items-center justify-between mb-8 px-2">
          {today.tasks.map((task, i) => {
            const iconData = taskIcons[i];
            if (!iconData) return null;
            const Icon = iconData.icon;
            const isDone = task.status === "completed";
            const isCurrent = task.status === "in_progress";
            const isUpcoming = task.status === "upcoming";
            const isSelected = selectedTask?.id === task.id;

            return (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`flex flex-col items-center gap-2 cursor-pointer group transition-all ${
                  isUpcoming ? "opacity-40" : ""
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-sidebar text-accent shadow-lg scale-105"
                        : isDone
                        ? "bg-accent-light text-accent-text"
                        : isCurrent
                        ? "bg-accent-light text-accent-text border-2 border-accent"
                        : "bg-background text-text-muted"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={22} className="text-success" />
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>
                  {/* Lock overlay for upcoming tasks */}
                  {isUpcoming && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Lock size={10} className="text-text-muted" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    isSelected
                      ? "text-text-primary"
                      : "text-text-muted group-hover:text-text-secondary"
                  }`}
                >
                  {iconData.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected task detail — CD3: Creativity (tool selector) + CD6: Scarcity */}
        {selectedTask && (
          <div className="bg-background rounded-2xl p-5 mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-text-muted font-medium">
                    {selectedTask.time}
                  </span>
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      selectedTask.status === "completed"
                        ? "bg-success-light text-success"
                        : selectedTask.status === "in_progress"
                        ? "bg-accent-light text-accent-text"
                        : "bg-white text-text-muted"
                    }`}
                  >
                    {selectedTask.status === "completed"
                      ? "Completed"
                      : selectedTask.status === "in_progress"
                      ? "In Progress"
                      : "Up Next"}
                  </div>
                </div>
                <h3 className="text-[18px] font-semibold text-text-primary leading-snug">
                  {selectedTask.title}
                </h3>
              </div>
              <span className="text-[12px] font-semibold text-accent-text bg-accent-light px-2.5 py-1 rounded-lg flex-shrink-0">
                +{selectedTask.xpReward} XP
              </span>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
              {selectedTask.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[10px] font-medium text-text-secondary bg-white rounded-lg px-2.5 py-1">
                {selectedTask.subject}
              </span>
              {selectedTask.competencies.map((key) => {
                const comp = competencies.find((c) => c.key === key);
                if (!comp) return null;
                return (
                  <span
                    key={key}
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: comp.color }}
                  >
                    {comp.shortName}
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 text-text-muted mb-4">
              <FileText size={12} />
              <span className="text-[11px]">{selectedTask.evidence}</span>
            </div>

            {/* CD3: Tool Choice Selector — only for in_progress tasks */}
            {selectedTask.status === "in_progress" && (
              <div className="border-t border-card-border pt-4">
                <span className="text-[11px] font-medium text-text-muted block mb-2.5">
                  Choose your tool
                </span>
                <div className="flex items-center gap-2">
                  {toolOptions.map((tool) => {
                    const ToolIcon = toolIconMap[tool.icon];
                    const isActive = selectedTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() =>
                          setSelectedTool(isActive ? null : tool.id)
                        }
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-sidebar text-accent shadow-md"
                            : "bg-white text-text-secondary hover:bg-accent-light hover:text-accent-text"
                        }`}
                      >
                        {ToolIcon && <ToolIcon size={14} />}
                        {tool.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CD6: Scarcity — lock message for upcoming tasks */}
            {selectedTask.status === "upcoming" && (
              <div className="border-t border-card-border pt-3 flex items-center gap-2 text-text-muted">
                <Lock size={12} />
                <span className="text-[11px]">
                  Unlocks after current task
                </span>
              </div>
            )}
          </div>
        )}

        {/* Summary section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-semibold text-text-primary">
            Summary
          </h2>
          <div className="flex items-center gap-1 bg-background rounded-xl p-1">
            <span className="px-3 py-1.5 rounded-lg text-[11px] text-text-muted font-medium">
              Daily
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-text-primary bg-white shadow-sm">
              Weekly
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] text-text-muted font-medium">
              Monthly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* CD4: Ownership — Q-Coins enhanced */}
          <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <Coins size={13} className="text-accent-text" />
              <span className="text-[11px] text-text-muted font-medium">
                Q-Coins
              </span>
            </div>
            <div>
              <span className="text-[28px] font-bold text-text-primary block leading-none">
                {currentStudent.qcoins}
              </span>
              <span className="text-[10px] text-text-muted mt-1 block">
                Your currency, your choices
              </span>
            </div>
          </div>

          {/* XP This Week */}
          <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="text-accent-text" />
              <span className="text-[11px] text-text-muted font-medium">
                XP Earned
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-text-primary leading-none">
                {currentStudent.xpWeek}
              </span>
              <span className="text-[13px] text-text-muted">
                /{currentStudent.xpTotal}
              </span>
            </div>
          </div>

          {/* CD8: Loss Avoidance — Streak enhanced */}
          <div className="bg-background rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <Flame size={13} className="text-warning" />
              <span className="text-[11px] text-text-muted font-medium">
                Streak
              </span>
            </div>
            <div>
              <span className="text-[28px] font-bold text-text-primary block leading-none">
                {currentStudent.streak}
              </span>
              <span className="text-[10px] text-warning font-medium mt-1 block">
                Keep it alive!
              </span>
            </div>
          </div>

          {/* Evidences */}
          <div className="bg-sidebar rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-1.5">
              <FileText size={13} className="text-accent" />
              <span className="text-[11px] text-white/50 font-medium">
                Evidences
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-white leading-none">
                {currentStudent.evidencesSubmitted}
              </span>
              <span className="text-[13px] text-white/40">
                /{currentStudent.evidencesTotal}
              </span>
            </div>
          </div>
        </div>

        {/* CD5: Social Influence — Tribe Section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-text-primary" />
              <h2 className="text-[20px] font-semibold text-text-primary">
                Your Tribe
              </h2>
            </div>
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
                <span className="text-[13px] font-semibold text-text-primary">
                  {member.name}
                </span>
                <span className="text-[11px] text-text-muted">{member.role}</span>
                {member.badge && (
                  <div className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-warning-light">
                    <Star size={10} className="text-warning fill-warning" />
                    <span className="text-[9px] font-semibold text-warning">
                      {member.badge}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Chat widget — UNCHANGED */}
      <div className="w-[300px] flex-shrink-0">
        {/* Chat header with gradient pill */}
        <div className="bg-background rounded-2xl flex flex-col h-[520px]">
          {/* Gradient header */}
          <div className="p-4 pb-3">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sidebar to-accent-dark px-3 py-1.5 rounded-full mb-3">
              <MessageCircle size={12} className="text-accent" />
              <span className="text-[11px] font-semibold text-white">
                Chat with Prof. Ana
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 pb-3 flex flex-col gap-3">
            {chatMessages.map((msg) => {
              const isTeacher = msg.sender === "teacher";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isTeacher ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                      isTeacher
                        ? "bg-white rounded-tl-sm"
                        : "bg-[#d9e8fc] text-text-primary rounded-tr-sm"
                    }`}
                  >
                    <p className="text-[12px] leading-relaxed">{msg.message}</p>
                  </div>
                  <span className="text-[9px] text-text-muted mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5">
              <input
                type="text"
                placeholder="Type something.."
                className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none"
              />
              <button className="w-7 h-7 rounded-full bg-sidebar flex items-center justify-center hover:bg-accent-dark transition-colors cursor-pointer">
                <Send size={12} className="text-accent" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
