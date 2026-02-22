"use client";

import {
  Mail,
  Phone,
  MapPin,
  Bell,
  BellOff,
  GraduationCap,
  Calendar,
  Users,
} from "lucide-react";
import { currentStudent } from "@/data/students";

const notifications = [
  { id: "weekly", label: "Weekly AI Summary", description: "Every Monday morning", enabled: true },
  { id: "tasks", label: "Task completions", description: "When Lucas finishes a task", enabled: true },
  { id: "alerts", label: "Attention alerts", description: "If Lucas needs support", enabled: true },
  { id: "deliverables", label: "Upcoming deliverables", description: "48h before a deadline", enabled: true },
  { id: "gamification", label: "Q-Coins & missions", description: "Gamification updates", enabled: false },
  { id: "demoday", label: "Demo Day reminders", description: "Event announcements", enabled: true },
];

export default function ParentProfile() {
  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 flex flex-col gap-5">

        {/* Student card */}
        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sidebar flex items-center justify-center text-white text-[18px] font-bold flex-shrink-0">
              LG
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[20px] font-semibold text-text-primary">
                  Lucas García
                </h2>
                <span className="bg-accent-light text-accent-text text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  On Track
                </span>
              </div>
              <p className="text-[13px] text-text-secondary mb-3">
                1º ESO A · QHUMA School · Cohort 2027
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-text-muted" />
                  <span className="text-[12px] text-text-secondary">
                    {currentStudent.evidencesSubmitted}/{currentStudent.evidencesTotal} evidences
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-text-muted" />
                  <span className="text-[12px] text-text-secondary">
                    {currentStudent.streak}-day streak
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-text-muted" />
                  <span className="text-[12px] text-text-secondary">
                    Tribe: The Hosts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two column: parent info + student info */}
        <div className="grid grid-cols-2 gap-5">
          {/* Parent contact */}
          <div className="bg-card rounded-2xl p-5 border border-card-border">
            <h3 className="text-[13px] font-semibold text-text-primary mb-4">
              Parent contact
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-semibold text-text-secondary">MG</span>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-text-primary">María García</p>
                  <p className="text-[10px] text-text-muted">Primary contact</p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center gap-3">
                <Mail size={13} className="text-text-muted flex-shrink-0" />
                <span className="text-[12px] text-text-secondary">
                  maria.garcia@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={13} className="text-text-muted flex-shrink-0" />
                <span className="text-[12px] text-text-secondary">
                  +34 612 345 678
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={13} className="text-text-muted flex-shrink-0" />
                <span className="text-[12px] text-text-secondary">
                  Málaga, Spain
                </span>
              </div>
            </div>
          </div>

          {/* Student info */}
          <div className="bg-card rounded-2xl p-5 border border-card-border">
            <h3 className="text-[13px] font-semibold text-text-primary mb-4">
              Student info
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Date of birth", value: "14 March 2012" },
                { label: "Enrollment year", value: "September 2026" },
                { label: "Tutor", value: "Prof. Ana Martínez" },
                { label: "Language at home", value: "Spanish" },
                { label: "AMPA member", value: "Yes" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">{item.label}</span>
                  <span className="text-[12px] font-medium text-text-primary">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-1">
            Notification preferences
          </h3>
          <p className="text-[11px] text-text-muted mb-4">
            Choose what updates you receive and how often.
          </p>
          <div className="flex flex-col gap-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-background transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-text-primary">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-text-muted">{item.description}</p>
                </div>
                <div
                  className={`flex items-center gap-1.5 text-[11px] font-medium ${
                    item.enabled ? "text-success" : "text-text-muted"
                  }`}
                >
                  {item.enabled ? (
                    <Bell size={12} />
                  ) : (
                    <BellOff size={12} />
                  )}
                  {item.enabled ? "On" : "Off"}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right: Emergency + quick actions */}
      <div className="w-[260px] flex-shrink-0 flex flex-col gap-5">
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">
            Emergency contact
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-semibold text-text-secondary">JG</span>
              </div>
              <div>
                <p className="text-[12px] font-medium text-text-primary">Javier García</p>
                <p className="text-[10px] text-text-muted">Father</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={13} className="text-text-muted flex-shrink-0" />
              <span className="text-[12px] text-text-secondary">+34 654 987 321</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">
            Upcoming meetings
          </h3>
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Trimester check-in", date: "Mar 14", who: "Prof. Ana" },
              { title: "Demo Day", date: "Feb 28", who: "All families" },
            ].map((meeting) => (
              <div key={meeting.title} className="p-3 bg-background rounded-xl">
                <p className="text-[12px] font-medium text-text-primary">
                  {meeting.title}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {meeting.date} · {meeting.who}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-accent-light rounded-2xl p-5 border border-accent-text/10">
          <p className="text-[13px] font-semibold text-accent-text mb-1">
            Want to talk to Prof. Ana?
          </p>
          <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
            Use the chat on the dashboard to send a message directly.
          </p>
          <button className="w-full bg-sidebar text-white text-[11px] font-semibold py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer">
            Open chat
          </button>
        </div>
      </div>
    </div>
  );
}
