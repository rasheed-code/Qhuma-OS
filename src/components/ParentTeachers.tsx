"use client";

import { MessageSquare, BookOpen, Cpu, Globe, Palette, Users, Flag } from "lucide-react";

interface TeacherSession {
  teacher: string;
  initials: string;
  role: string;
  subject: string;
  subjectIcon: typeof BookOpen;
  time: string;
  day: string;
  isToday: boolean;
  observation: string;
  type: "mentor" | "session" | "feedback" | "checkIn";
}

const sessions: TeacherSession[] = [
  {
    teacher: "Ana Martínez",
    initials: "AM",
    role: "Tutor & Mentor",
    subject: "Mentoring",
    subjectIcon: Users,
    time: "10:15",
    day: "Today",
    isToday: true,
    observation:
      "Reviewed Lucas's landing page during the morning check-in. Design and copy quality was notably above average — flagged it as class example. Encouraged him to apply the same clarity to the financial section.",
    type: "feedback",
  },
  {
    teacher: "Carlos Romero",
    initials: "CR",
    role: "Mathematics",
    subject: "Math + Finance",
    subjectIcon: Cpu,
    time: "13:00",
    day: "Today",
    isToday: true,
    observation:
      "Led the profitability session. Lucas understood margin calculations quickly but struggled with IVA stacking. Gave him a concrete example with Airbnb pricing. He'll revisit it this afternoon.",
    type: "session",
  },
  {
    teacher: "Laura Vega",
    initials: "LV",
    role: "Biology & Science",
    subject: "Biology + Language",
    subjectIcon: Globe,
    time: "9:00",
    day: "Today",
    isToday: true,
    observation:
      "Guided the hygiene protocol task. Lucas is thorough and well-organised. He asked good questions about health regulations for tourist accommodation.",
    type: "session",
  },
  {
    teacher: "Ana Martínez",
    initials: "AM",
    role: "Tutor & Mentor",
    subject: "Tribe collaboration",
    subjectIcon: Users,
    time: "15:30",
    day: "Tuesday",
    isToday: false,
    observation:
      "Observed the tribe peer-review session. Lucas gave useful and specific feedback to his teammates — a sign of growing critical thinking.",
    type: "checkIn",
  },
  {
    teacher: "Marta Iglesias",
    initials: "MI",
    role: "Art & Design",
    subject: "Art + Language",
    subjectIcon: Palette,
    time: "13:00",
    day: "Tuesday",
    isToday: false,
    observation:
      "Worked with Lucas on the brand identity card. His colour choices are confident and intentional. Suggested refining the typography hierarchy — he implemented it immediately.",
    type: "feedback",
  },
  {
    teacher: "Carlos Romero",
    initials: "CR",
    role: "Mathematics",
    subject: "Mathematics",
    subjectIcon: Cpu,
    time: "11:00",
    day: "Monday",
    isToday: false,
    observation:
      "Pricing strategy spreadsheet session. Lucas built a working model from scratch — strong logical structure. Minor errors in formula referencing, corrected during review.",
    type: "session",
  },
  {
    teacher: "Javier Ruiz",
    initials: "JR",
    role: "Social Sciences",
    subject: "Social Sciences",
    subjectIcon: Flag,
    time: "9:00",
    day: "Monday",
    isToday: false,
    observation:
      "Competitor research session. Lucas analysed three real Airbnb listings and identified differentiating factors. Showed solid research habits.",
    type: "session",
  },
  {
    teacher: "Ana Martínez",
    initials: "AM",
    role: "Tutor & Mentor",
    subject: "Phase 1 Review",
    subjectIcon: BookOpen,
    time: "15:00",
    day: "Monday",
    isToday: false,
    observation:
      "End-of-phase review. Lucas has completed all Phase 1 deliverables on time. Discussed what worked well and what to focus on in Phase 2. He seemed motivated and clear on next steps.",
    type: "mentor",
  },
];

const typeConfig = {
  mentor: { label: "Mentor session", bg: "bg-accent-light", text: "text-accent-text", border: "border-accent-text/20" },
  session: { label: "Class session", bg: "bg-background", text: "text-text-secondary", border: "border-border" },
  feedback: { label: "Feedback given", bg: "bg-success-light", text: "text-success", border: "border-success/20" },
  checkIn: { label: "Check-in", bg: "bg-warning-light", text: "text-warning", border: "border-warning/20" },
};

const todaySessions = sessions.filter((s) => s.isToday);
const weekSessions = sessions.filter((s) => !s.isToday);

// Unique teachers this week
const uniqueTeachers = Array.from(
  new Map(sessions.map((s) => [s.initials, { name: s.teacher, initials: s.initials, role: s.role, count: sessions.filter((x) => x.initials === s.initials).length }])).values()
);

export default function ParentTeachers() {
  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 flex flex-col gap-5">

        {/* Today */}
        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <h2 className="text-[15px] font-semibold text-text-primary">Today</h2>
            <span className="text-[11px] text-text-muted ml-1">Wednesday, Feb 26</span>
          </div>

          <div className="flex flex-col gap-4">
            {todaySessions.map((s, i) => {
              const Icon = s.subjectIcon;
              const type = typeConfig[s.type];
              return (
                <div key={i} className={`rounded-xl border p-4 ${type.border} ${type.bg}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sidebar flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5">
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[13px] font-semibold text-text-primary">{s.teacher}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${type.text} bg-white/60`}>
                          {type.label}
                        </span>
                        <span className="text-[10px] text-text-muted ml-auto">{s.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon size={11} className="text-text-muted" />
                        <span className="text-[11px] text-text-muted">{s.subject}</span>
                      </div>
                      <p className="text-[12px] text-text-primary leading-relaxed">
                        {s.observation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earlier this week */}
        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-[15px] font-semibold text-text-primary">Earlier this week</h2>
            <span className="text-[11px] text-text-muted">Mon–Tue</span>
          </div>

          {["Tuesday", "Monday"].map((day) => {
            const daySessions = weekSessions.filter((s) => s.day === day);
            if (!daySessions.length) return null;
            return (
              <div key={day} className="mb-5 last:mb-0">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3 px-1">
                  {day}
                </p>
                <div className="flex flex-col gap-3">
                  {daySessions.map((s, i) => {
                    const Icon = s.subjectIcon;
                    const type = typeConfig[s.type];
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-background transition-colors">
                        <div className="w-7 h-7 rounded-xl bg-sidebar flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {s.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[12px] font-semibold text-text-primary">{s.teacher}</span>
                            <span className={`text-[10px] font-medium ${type.text}`}>{type.label}</span>
                            <span className="text-[10px] text-text-muted ml-auto">{s.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Icon size={11} className="text-text-muted" />
                            <span className="text-[11px] text-text-muted">{s.subject}</span>
                          </div>
                          <p className="text-[12px] text-text-secondary leading-relaxed">
                            {s.observation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right column */}
      <div className="w-[240px] flex-shrink-0 flex flex-col gap-4">

        {/* Teachers this week */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-1">
            This week&apos;s team
          </h3>
          <p className="text-[11px] text-text-muted mb-4">
            Everyone who worked with Lucas.
          </p>
          <div className="flex flex-col gap-3">
            {uniqueTeachers.map((t) => (
              <div key={t.initials} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sidebar flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-text-primary truncate">{t.name}</p>
                  <p className="text-[10px] text-text-muted">{t.role}</p>
                </div>
                <span className="text-[10px] text-text-muted flex-shrink-0">
                  {t.count} session{t.count > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Message a teacher */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-1">
            Have a question?
          </h3>
          <p className="text-[11px] text-text-muted mb-4 leading-relaxed">
            Message Prof. Ana directly from the Overview chat, or request a meeting.
          </p>
          <button className="w-full flex items-center justify-center gap-2 bg-sidebar text-white text-[11px] font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer">
            <MessageSquare size={13} />
            Open chat
          </button>
        </div>

        {/* Quick stat */}
        <div className="bg-accent-light rounded-2xl p-4 border border-accent-text/10">
          <p className="text-[22px] font-bold text-accent-text">{sessions.length}</p>
          <p className="text-[11px] text-text-secondary mt-0.5">
            teacher interactions this week
          </p>
          <p className="text-[10px] text-text-muted mt-2">
            {uniqueTeachers.length} different teachers · {todaySessions.length} today
          </p>
        </div>

      </div>
    </div>
  );
}
