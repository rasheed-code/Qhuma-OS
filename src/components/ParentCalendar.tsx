"use client";

import { CheckCircle2, Clock, Lock, Loader } from "lucide-react";

type DeliverableStatus = "done" | "in_progress" | "upcoming" | "locked";

interface Deliverable {
  time: string;
  title: string;
  subject: string;
  status: DeliverableStatus;
  subjectColor: string;
}

interface DayBlock {
  day: string;
  date: string;
  isToday: boolean;
  isPast: boolean;
  deliverables: Deliverable[];
}

const week: DayBlock[] = [
  {
    day: "Monday",
    date: "Feb 24",
    isToday: false,
    isPast: true,
    deliverables: [
      { time: "9:00", title: "Competitor Research Doc", subject: "Social Sciences", status: "done", subjectColor: "#4F8EF7" },
      { time: "11:00", title: "Pricing Strategy Spreadsheet", subject: "Mathematics", status: "done", subjectColor: "#34D399" },
      { time: "15:00", title: "Phase 1 Review with Prof. Ana", subject: "Mentoring", status: "done", subjectColor: "#FB923C" },
    ],
  },
  {
    day: "Tuesday",
    date: "Feb 25",
    isToday: false,
    isPast: true,
    deliverables: [
      { time: "9:00", title: "Landing Page (Canva)", subject: "Digital + Art", status: "done", subjectColor: "#60A5FA" },
      { time: "13:00", title: "Brand Identity Card", subject: "Art + Language", status: "done", subjectColor: "#E879F9" },
      { time: "15:30", title: "Tribe peer review session", subject: "Teamwork", status: "done", subjectColor: "#FBBF24" },
    ],
  },
  {
    day: "Wednesday",
    date: "Feb 26",
    isToday: true,
    isPast: false,
    deliverables: [
      { time: "9:00", title: "Hygiene Protocol PDF", subject: "Biology + Language", status: "in_progress", subjectColor: "#34D399" },
      { time: "13:00", title: "Profitability Spreadsheet", subject: "Math + Finance", status: "upcoming", subjectColor: "#34D399" },
      { time: "15:00", title: "Tax Calculation Worksheet", subject: "Math + Civic Ed.", status: "upcoming", subjectColor: "#34D399" },
    ],
  },
  {
    day: "Thursday",
    date: "Feb 27",
    isToday: false,
    isPast: false,
    deliverables: [
      { time: "9:00", title: "Good Host Guide (10 FAQs)", subject: "Language Arts", status: "locked", subjectColor: "#4F8EF7" },
      { time: "13:00", title: "Demo Day Pitch (5 slides)", subject: "Social + Tutoring", status: "locked", subjectColor: "#FB923C" },
      { time: "15:30", title: "Pitch rehearsal with tribe", subject: "Teamwork", status: "locked", subjectColor: "#FBBF24" },
    ],
  },
  {
    day: "Friday — Demo Day",
    date: "Feb 28",
    isToday: false,
    isPast: false,
    deliverables: [
      { time: "9:00", title: "Final pitch prep", subject: "All competencies", status: "locked", subjectColor: "#FB923C" },
      { time: "11:00", title: "Live Pitch Presentation", subject: "All competencies", status: "locked", subjectColor: "#FB923C" },
      { time: "14:00", title: "Digital Portfolio Upload", subject: "Digital Skills", status: "locked", subjectColor: "#60A5FA" },
      { time: "16:00", title: "Trimester 1 closes", subject: "Admin", status: "locked", subjectColor: "#9CA3AF" },
    ],
  },
];

const statusIcon: Record<DeliverableStatus, typeof CheckCircle2> = {
  done: CheckCircle2,
  in_progress: Loader,
  upcoming: Clock,
  locked: Lock,
};

const statusColor: Record<DeliverableStatus, string> = {
  done: "text-success",
  in_progress: "text-accent-text",
  upcoming: "text-warning",
  locked: "text-text-muted",
};

const statusLabel: Record<DeliverableStatus, string> = {
  done: "Done",
  in_progress: "In progress",
  upcoming: "Today",
  locked: "Upcoming",
};

export default function ParentCalendar() {
  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0">

        {/* Week header */}
        <div className="bg-card rounded-2xl p-5 border border-card-border mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-text-primary">Week 3 of 12</h2>
              <p className="text-[12px] text-text-secondary mt-0.5">
                Feb 24–28 · Project: <span className="font-semibold text-accent-text">Launch Your Airbnb</span>
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-text-muted">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-success" /> Done</span>
              <span className="flex items-center gap-1.5"><Loader size={12} className="text-accent-text" /> In progress</span>
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-warning" /> Today</span>
              <span className="flex items-center gap-1.5"><Lock size={12} className="text-text-muted" /> Upcoming</span>
            </div>
          </div>
        </div>

        {/* Day blocks */}
        <div className="flex flex-col gap-3">
          {week.map((day) => (
            <div
              key={day.day}
              className={`bg-card rounded-2xl border overflow-hidden ${
                day.isToday ? "border-accent-text/30" : "border-card-border"
              }`}
            >
              {/* Day header */}
              <div
                className={`flex items-center justify-between px-5 py-3 border-b ${
                  day.isToday
                    ? "bg-accent-light border-accent-text/20"
                    : day.isPast
                    ? "bg-background border-border"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[13px] font-semibold ${day.isToday ? "text-accent-text" : day.isPast ? "text-text-muted" : "text-text-primary"}`}>
                    {day.day}
                  </span>
                  {day.isToday && (
                    <span className="bg-accent-text text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      TODAY
                    </span>
                  )}
                </div>
                <span className={`text-[11px] ${day.isToday ? "text-accent-text font-medium" : "text-text-muted"}`}>
                  {day.date}
                </span>
              </div>

              {/* Deliverables */}
              <div className="px-5 py-2">
                {day.deliverables.map((item, i) => {
                  const Icon = statusIcon[item.status];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                    >
                      <span className="text-[11px] text-text-muted w-10 flex-shrink-0 font-mono">
                        {item.time}
                      </span>
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.subjectColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-[12px] font-medium block ${
                            item.status === "locked" ? "text-text-muted" : "text-text-primary"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] text-text-muted">{item.subject}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${statusColor[item.status]} flex-shrink-0`}>
                        <Icon size={11} />
                        <span className="text-[10px] font-medium">{statusLabel[item.status]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: summary */}
      <div className="w-[240px] flex-shrink-0 flex flex-col gap-4">

        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">Week at a glance</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "Total deliverables", value: "14", color: "text-text-primary" },
              { label: "Completed", value: "6", color: "text-success" },
              { label: "In progress", value: "1", color: "text-accent-text" },
              { label: "Remaining today", value: "2", color: "text-warning" },
              { label: "Locked (Thu–Fri)", value: "5", color: "text-text-muted" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">{item.label}</span>
                <span className={`text-[13px] font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">Subjects this week</h3>
          <div className="flex flex-col gap-2">
            {[
              { subject: "Mathematics", color: "#34D399", tasks: 3 },
              { subject: "Digital + Art", color: "#60A5FA", tasks: 2 },
              { subject: "Language Arts", color: "#4F8EF7", tasks: 3 },
              { subject: "Social Sciences", color: "#4F8EF7", tasks: 1 },
              { subject: "Biology", color: "#34D399", tasks: 1 },
              { subject: "Civic Ed.", color: "#F87171", tasks: 1 },
            ].map((item) => (
              <div key={item.subject} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-text-secondary flex-1">{item.subject}</span>
                <span className="text-[10px] text-text-muted">{item.tasks} task{item.tasks > 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-accent-light rounded-2xl p-4 border border-accent-text/10">
          <p className="text-[13px] font-semibold text-accent-text mb-1">Demo Day — Feb 28</p>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Lucas presents his Airbnb project to the class. Families welcome from 11:00.
          </p>
        </div>
      </div>
    </div>
  );
}
