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
  BookOpen,
  Download,
} from "lucide-react";
import { useLang, Lang } from "@/lib/i18n";

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

export default function TeacherSettings() {
  const { lang, setLang, tr } = useLang();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSize, setFontSize] = useState<"small" | "normal" | "large">("normal");
  const [savedLang, setSavedLang] = useState(false);

  const lbl = (es: string, en: string) => (lang === "es" ? es : en);

  function handleSaveLang(l: Lang) {
    setLang(l);
    setSavedLang(true);
    setTimeout(() => setSavedLang(false), 1500);
  }

  const fontSizeLabel: Record<string, string> = {
    small: lbl("Pequeño", "Small"),
    normal: lbl("Normal", "Normal"),
    large: lbl("Grande", "Large"),
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-[32px] font-semibold text-text-primary leading-tight mb-2">{tr("settings.title")}</h1>
      <p className="text-[14px] text-text-secondary mb-8">{lbl("Gestiona tu clase y preferencias", "Manage your class and preferences")}</p>

      {/* Class Settings */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">{lbl("Configuración de clase", "Class Settings")}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-[12px] font-medium text-text-muted block mb-2">{lbl("Proyecto actual", "Current Project")}</span>
            <select className="w-full border-2 border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:border-accent cursor-pointer">
              <option>{lbl("Lanza tu Airbnb", "Launch Your Airbnb")}</option>
              <option>{lbl("Diseña una marca de food truck", "Design a Food Truck Brand")}</option>
              <option>{lbl("Monta un pop-up store", "Run a Pop-Up Store")}</option>
              <option>{lbl("Presenta a QHUMA Capital", "Pitch to QHUMA Capital")}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[12px] font-medium text-text-muted block mb-2">{lbl("Nivel educativo", "Grade Level")}</span>
              <select className="w-full border-2 border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:border-accent cursor-pointer">
                <option>1º ESO</option>
                <option>2º ESO</option>
                <option>3º ESO</option>
                <option>4º ESO</option>
              </select>
            </div>
            <div>
              <span className="text-[12px] font-medium text-text-muted block mb-2">{lbl("Trimestre", "Trimester")}</span>
              <select className="w-full border-2 border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:border-accent cursor-pointer">
                <option>{lbl("Trimestre 1", "Trimester 1")}</option>
                <option>{lbl("Trimestre 2", "Trimester 2")}</option>
                <option>{lbl("Trimestre 3", "Trimester 3")}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">{tr("settings.notifications")}</h2>
        </div>
        <div className="divide-y divide-card-border">
          <Toggle label={lbl("Entregas de evidencias de alumnos", "Student evidence submissions")} defaultOn={true} />
          <Toggle label={lbl("Notificaciones de alertas", "Alert threshold notifications")} defaultOn={true} />
          <Toggle label={lbl("Informes de progreso semanales", "Weekly progress reports")} defaultOn={false} />
          <Toggle label={lbl("Notificaciones a familias", "Parent update notifications")} defaultOn={false} />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Sun size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">{tr("settings.appearance")}</h2>
        </div>

        {/* Theme */}
        <span className="text-[12px] font-medium text-text-muted block mb-2">{tr("settings.theme")}</span>
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
            <span className={`text-[13px] font-semibold ${theme === "light" ? "text-accent-text" : "text-text-muted"}`}>{tr("settings.light")}</span>
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
            <span className={`text-[13px] font-semibold ${theme === "dark" ? "text-accent-text" : "text-text-muted"}`}>{tr("settings.dark")}</span>
            {theme === "dark" && <Check size={14} className="text-accent-text" />}
          </button>
        </div>

        {/* Font size */}
        <span className="text-[12px] font-medium text-text-muted block mb-2">{tr("settings.fontSize")}</span>
        <div className="flex gap-2">
          {(["small", "normal", "large"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                fontSize === size
                  ? "bg-sidebar text-white"
                  : "bg-background text-text-muted hover:bg-accent-light hover:text-accent-text"
              }`}
            >
              {fontSizeLabel[size]}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-text-primary" />
            <h2 className="text-[16px] font-semibold text-text-primary">{tr("settings.language")}</h2>
          </div>
          {savedLang && (
            <span className="text-[11px] font-semibold text-success flex items-center gap-1">
              <Check size={12} /> {tr("settings.saved")}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {(["es", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => handleSaveLang(l)}
              className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                lang === l
                  ? "bg-sidebar text-white"
                  : "bg-background text-text-muted hover:bg-accent-light hover:text-accent-text"
              }`}
            >
              {l === "es" ? "Español" : "English"}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">{tr("settings.privacy")}</h2>
        </div>
        <div className="divide-y divide-card-border">
          <Toggle label={lbl("Compartir datos de clase con dirección", "Show class data to school admin")} defaultOn={true} />
          <Toggle label={lbl("Compartir informes de competencias con familias", "Share competency reports with parents")} defaultOn={true} />
          <Toggle label={lbl("Permitir visibilidad del perfil del alumno", "Allow student profile visibility")} defaultOn={true} />
        </div>
      </div>

      {/* Export & Reporting */}
      <div className="bg-card rounded-2xl p-5 border border-card-border mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Download size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">{lbl("Exportación e informes", "Export & Reporting")}</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-card-border bg-background text-text-muted text-[13px] font-semibold hover:border-text-muted transition-all cursor-pointer">
            <Download size={15} />
            {lbl("Informe de clase (PDF)", "Class Report (PDF)")}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-card-border bg-background text-text-muted text-[13px] font-semibold hover:border-text-muted transition-all cursor-pointer">
            <Download size={15} />
            {lbl("Datos de competencias (CSV)", "Competency Data (CSV)")}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-card rounded-2xl p-5 border border-card-border">
        <div className="flex items-center gap-2 mb-4">
          <Info size={16} className="text-text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">{tr("settings.about")}</h2>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-text-muted">{tr("settings.version")}</span>
            <span className="text-[12px] text-text-primary font-medium">QhumaOS v1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-text-muted">{tr("settings.school")}</span>
            <span className="text-[12px] text-text-primary font-medium">Qhuma School</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-text-muted">{tr("settings.help")}</span>
            <span className="text-[12px] text-accent-text font-medium">help.qhuma.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
}
