"use client";

import { useState } from "react";
import {
  Bell,
  Sun,
  Moon,
  Globe,
  Shield,
  Info,
  Check,
} from "lucide-react";

interface ToggleProps {
  label: string;
  defaultOn?: boolean;
}

function Toggle({ label, defaultOn = true }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[13px] text-text-primary">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-[22px] rounded-full transition-colors duration-200 flex items-center px-0.5 cursor-pointer ${
          on ? "bg-accent-dark" : "bg-text-muted/30"
        }`}
      >
        <div
          className={`w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
            on ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function StudentSettings() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSize, setFontSize] = useState<"small" | "normal" | "large">("normal");
  const [language, setLanguage] = useState<"es" | "en" | "ca">("en");

  return (
    <div className="max-w-2xl">
      <h1 className="text-[32px] font-semibold text-text-primary leading-tight mb-2">Settings</h1>
      <p className="text-[14px] text-text-secondary mb-8">Customize your learning experience</p>

      {/* Notifications */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">Notifications</h2>
        </div>
        <div className="divide-y divide-card-border">
          <Toggle label="Task reminders" defaultOn={true} />
          <Toggle label="Flash mission alerts" defaultOn={true} />
          <Toggle label="Tribe activity" defaultOn={true} />
          <Toggle label="Weekly summary email" defaultOn={false} />
          <Toggle label="Q-Coin rewards" defaultOn={true} />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Sun size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">Appearance</h2>
        </div>

        {/* Theme */}
        <span className="text-[12px] font-medium text-text-muted block mb-2">Theme</span>
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all cursor-pointer ${
              theme === "light"
                ? "border-accent bg-accent-light"
                : "border-card-border bg-background hover:border-text-muted"
            }`}
          >
            <Sun size={16} className={theme === "light" ? "text-accent-text" : "text-text-muted"} />
            <span className={`text-[13px] font-semibold ${theme === "light" ? "text-accent-text" : "text-text-muted"}`}>Light</span>
            {theme === "light" && <Check size={14} className="text-accent-text" />}
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all cursor-pointer ${
              theme === "dark"
                ? "border-accent bg-accent-light"
                : "border-card-border bg-background hover:border-text-muted"
            }`}
          >
            <Moon size={16} className={theme === "dark" ? "text-accent-text" : "text-text-muted"} />
            <span className={`text-[13px] font-semibold ${theme === "dark" ? "text-accent-text" : "text-text-muted"}`}>Dark</span>
            {theme === "dark" && <Check size={14} className="text-accent-text" />}
          </button>
        </div>

        {/* Font size */}
        <span className="text-[12px] font-medium text-text-muted block mb-2">Font size</span>
        <div className="flex gap-2">
          {(["small", "normal", "large"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer capitalize ${
                fontSize === size
                  ? "bg-sidebar text-white"
                  : "bg-background text-text-muted hover:bg-accent-light hover:text-accent-text"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">Language</h2>
        </div>
        <div className="flex gap-2">
          {([
            { key: "es" as const, label: "Español" },
            { key: "en" as const, label: "English" },
            { key: "ca" as const, label: "Català" },
          ]).map((lang) => (
            <button
              key={lang.key}
              onClick={() => setLanguage(lang.key)}
              className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                language === lang.key
                  ? "bg-sidebar text-white"
                  : "bg-background text-text-muted hover:bg-accent-light hover:text-accent-text"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">Privacy</h2>
        </div>
        <div className="divide-y divide-card-border">
          <Toggle label="Show my profile to classmates" defaultOn={true} />
          <Toggle label="Show my Q-Coins balance" defaultOn={true} />
          <Toggle label="Appear in tribe leaderboard" defaultOn={true} />
        </div>
      </div>

      {/* About */}
      <div className="bg-card rounded-2xl p-5 border border-card-border">
        <div className="flex items-center gap-2 mb-4">
          <Info size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">About</h2>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-text-muted">App version</span>
            <span className="text-[12px] text-text-primary font-medium">QhumaOS v1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-text-muted">School</span>
            <span className="text-[12px] text-text-primary font-medium">Qhuma School</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-text-muted">Help & Support</span>
            <span className="text-[12px] text-accent-text font-medium">help.qhuma.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
}
