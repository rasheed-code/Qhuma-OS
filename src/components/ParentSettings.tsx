"use client";

import { Globe, Mail, Smartphone, Shield, LogOut } from "lucide-react";

const channelOptions = [
  { id: "email", label: "Email", description: "Summaries and alerts to your inbox" },
  { id: "app", label: "App only", description: "Only within qhumaOS" },
  { id: "both", label: "Email + App", description: "All updates everywhere" },
];

const languageOptions = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
];

const frequencyOptions = [
  { id: "daily", label: "Daily", description: "Every school day" },
  { id: "weekly", label: "Weekly", description: "Monday morning summary" },
  { id: "events", label: "Events only", description: "Only important alerts" },
];

export default function ParentSettings() {
  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 flex flex-col gap-5">

        {/* Communication channel */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">
              How would you like to receive updates?
            </h3>
          </div>
          <p className="text-[11px] text-text-muted mb-4 ml-5">
            Choose your preferred communication channel.
          </p>
          <div className="flex flex-col gap-2">
            {channelOptions.map((opt, i) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  i === 2
                    ? "border-accent-text/30 bg-accent-light"
                    : "border-border hover:bg-background"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    i === 2
                      ? "border-accent-text"
                      : "border-border"
                  }`}
                >
                  {i === 2 && (
                    <div className="w-2 h-2 rounded-full bg-accent-text" />
                  )}
                </div>
                <div>
                  <p className={`text-[12px] font-medium ${i === 2 ? "text-accent-text" : "text-text-primary"}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-text-muted">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Summary frequency */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">
              Summary frequency
            </h3>
          </div>
          <p className="text-[11px] text-text-muted mb-4 ml-5">
            How often do you want to receive Lucas&apos;s progress summaries?
          </p>
          <div className="flex gap-2">
            {frequencyOptions.map((opt, i) => (
              <button
                key={opt.id}
                className={`flex-1 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  i === 1
                    ? "border-accent-text/30 bg-accent-light"
                    : "border-border hover:bg-background"
                }`}
              >
                <p className={`text-[12px] font-medium mb-0.5 ${i === 1 ? "text-accent-text" : "text-text-primary"}`}>
                  {opt.label}
                </p>
                <p className="text-[10px] text-text-muted">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">
              Language
            </h3>
          </div>
          <div className="flex gap-2">
            {languageOptions.map((opt, i) => (
              <button
                key={opt.id}
                className={`px-5 py-2.5 rounded-xl border text-[12px] font-medium transition-all cursor-pointer ${
                  i === 0
                    ? "border-accent-text/30 bg-accent-light text-accent-text"
                    : "border-border text-text-secondary hover:bg-background"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">
              Privacy & data
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              {
                label: "Data used for AI summaries",
                description: "Lucas's tasks, evidences, and progress are used to generate the weekly summary.",
                canControl: false,
              },
              {
                label: "Share anonymised data for research",
                description: "Helps QHUMA improve the educational model. No personal data shared.",
                canControl: true,
                enabled: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-3 rounded-xl bg-background"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-text-primary">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {item.canControl && (
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-9 h-5 rounded-full bg-success flex items-center justify-end px-0.5 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                )}
                {!item.canControl && (
                  <span className="text-[10px] text-text-muted flex-shrink-0 mt-1">Required</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right: account */}
      <div className="w-[260px] flex-shrink-0 flex flex-col gap-5">
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">Account</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sidebar flex items-center justify-center text-white text-[12px] font-semibold">
              MG
            </div>
            <div>
              <p className="text-[12px] font-medium text-text-primary">María García</p>
              <p className="text-[10px] text-text-muted">maria.garcia@gmail.com</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] text-text-secondary hover:bg-background transition-colors cursor-pointer">
              Change password
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] text-text-secondary hover:bg-background transition-colors cursor-pointer">
              Update email
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] text-text-secondary hover:bg-background transition-colors cursor-pointer">
              Download my data
            </button>
          </div>
          <div className="h-px bg-border mt-3 mb-3" />
          <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] text-urgent hover:bg-urgent-light transition-colors cursor-pointer">
            <LogOut size={13} />
            Sign out
          </button>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-1">App version</h3>
          <p className="text-[11px] text-text-muted mb-3">qhumaOS for families · v0.1 MVP</p>
          <button className="text-[11px] text-accent-text font-medium hover:underline cursor-pointer">
            Send feedback
          </button>
        </div>
      </div>
    </div>
  );
}
