"use client";

import { useState } from "react";
import { Globe, Mail, Smartphone, Shield, LogOut, Check } from "lucide-react";
import { useLang, Lang } from "@/lib/i18n";

export default function ParentSettings() {
  const { lang, setLang, tr } = useLang();
  const [saved, setSaved] = useState(false);
  const [channel, setChannel] = useState<"email" | "app" | "both">("both");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "events">("weekly");
  const [shareData, setShareData] = useState(true);

  const channelOptions: { id: "email" | "app" | "both"; labelEs: string; labelEn: string; descEs: string; descEn: string }[] = [
    {
      id: "email",
      labelEs: "Solo email",
      labelEn: "Email only",
      descEs: "Resúmenes y alertas en tu bandeja",
      descEn: "Summaries and alerts to your inbox",
    },
    {
      id: "app",
      labelEs: "Solo app",
      labelEn: "App only",
      descEs: "Solo dentro de qhumaOS",
      descEn: "Only within qhumaOS",
    },
    {
      id: "both",
      labelEs: "Email + App",
      labelEn: "Email + App",
      descEs: "Todas las actualizaciones en todos lados",
      descEn: "All updates everywhere",
    },
  ];

  const frequencyOptions: { id: "daily" | "weekly" | "events"; labelEs: string; labelEn: string; descEs: string; descEn: string }[] = [
    {
      id: "daily",
      labelEs: "Diario",
      labelEn: "Daily",
      descEs: "Cada día lectivo",
      descEn: "Every school day",
    },
    {
      id: "weekly",
      labelEs: "Semanal",
      labelEn: "Weekly",
      descEs: "Resumen lunes por la mañana",
      descEn: "Monday morning summary",
    },
    {
      id: "events",
      labelEs: "Solo eventos",
      labelEn: "Events only",
      descEs: "Solo alertas importantes",
      descEn: "Only important alerts",
    },
  ];

  const handleSaveLang = (l: Lang) => {
    setLang(l);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const lbl = (es: string, en: string) => (lang === "es" ? es : en);

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 flex flex-col gap-5">

        {/* Language — FIRST and most prominent since it controls the whole app */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-text-primary" />
              <h3 className="text-[13px] font-semibold text-text-primary">
                {tr("settings.language")}
              </h3>
            </div>
            {saved && (
              <span className="flex items-center gap-1 text-[11px] text-success font-medium">
                <Check size={12} />
                {tr("settings.saved")}
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-muted mb-4 ml-5">
            {lbl(
              "Cambia el idioma de toda la plataforma para la vista de familias.",
              "Change the language of the entire platform for the family view."
            )}
          </p>
          <div className="flex gap-2">
            {(["es", "en"] as Lang[]).map((l) => {
              const active = lang === l;
              return (
                <button
                  key={l}
                  onClick={() => handleSaveLang(l)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[12px] font-medium transition-all cursor-pointer ${
                    active
                      ? "border-accent-text/30 bg-accent-light text-accent-text"
                      : "border-border text-text-secondary hover:bg-background"
                  }`}
                >
                  {active && <Check size={12} />}
                  {l === "es" ? "🇪🇸 Español" : "🇬🇧 English"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Communication channel */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">
              {lbl("¿Cómo quieres recibir las actualizaciones?", "How would you like to receive updates?")}
            </h3>
          </div>
          <p className="text-[11px] text-text-muted mb-4 ml-5">
            {lbl("Elige tu canal de comunicación preferido.", "Choose your preferred communication channel.")}
          </p>
          <div className="flex flex-col gap-2">
            {channelOptions.map((opt) => {
              const active = channel === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => setChannel(opt.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? "border-accent-text/30 bg-accent-light"
                      : "border-border hover:bg-background"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      active ? "border-accent-text" : "border-border"
                    }`}
                  >
                    {active && <div className="w-2 h-2 rounded-full bg-accent-text" />}
                  </div>
                  <div>
                    <p className={`text-[12px] font-medium ${active ? "text-accent-text" : "text-text-primary"}`}>
                      {lang === "es" ? opt.labelEs : opt.labelEn}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {lang === "es" ? opt.descEs : opt.descEn}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Summary frequency */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">
              {lbl("Frecuencia de resúmenes", "Summary frequency")}
            </h3>
          </div>
          <p className="text-[11px] text-text-muted mb-4 ml-5">
            {lbl(
              "¿Con qué frecuencia quieres recibir el resumen de progreso de Lucas?",
              "How often do you want to receive Lucas's progress summaries?"
            )}
          </p>
          <div className="flex gap-2">
            {frequencyOptions.map((opt) => {
              const active = frequency === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFrequency(opt.id)}
                  className={`flex-1 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? "border-accent-text/30 bg-accent-light"
                      : "border-border hover:bg-background"
                  }`}
                >
                  <p className={`text-[12px] font-medium mb-0.5 ${active ? "text-accent-text" : "text-text-primary"}`}>
                    {lang === "es" ? opt.labelEs : opt.labelEn}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {lang === "es" ? opt.descEs : opt.descEn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">
              {lbl("Privacidad y datos", "Privacy & data")}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-background">
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-text-primary">
                  {lbl("Datos usados para los resúmenes IA", "Data used for AI summaries")}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">
                  {lbl(
                    "Las tareas, evidencias y progreso de Lucas se usan para generar el resumen semanal.",
                    "Lucas's tasks, evidences, and progress are used to generate the weekly summary."
                  )}
                </p>
              </div>
              <span className="text-[10px] text-text-muted flex-shrink-0 mt-1">
                {lbl("Requerido", "Required")}
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-background">
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-text-primary">
                  {lbl("Compartir datos anónimos para investigación", "Share anonymised data for research")}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">
                  {lbl(
                    "Ayuda a QHUMA a mejorar el modelo educativo. No se comparten datos personales.",
                    "Helps QHUMA improve the educational model. No personal data shared."
                  )}
                </p>
              </div>
              <div className="flex-shrink-0 mt-0.5" onClick={() => setShareData(!shareData)}>
                <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${shareData ? "bg-success justify-end" : "bg-border justify-start"}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right: account */}
      <div className="w-[260px] flex-shrink-0 flex flex-col gap-5">
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">
            {tr("settings.account")}
          </h3>
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
              {lbl("Cambiar contraseña", "Change password")}
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] text-text-secondary hover:bg-background transition-colors cursor-pointer">
              {lbl("Actualizar email", "Update email")}
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] text-text-secondary hover:bg-background transition-colors cursor-pointer">
              {lbl("Descargar mis datos", "Download my data")}
            </button>
          </div>
          <div className="h-px bg-border mt-3 mb-3" />
          <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] text-urgent hover:bg-urgent-light transition-colors cursor-pointer">
            <LogOut size={13} />
            {lbl("Cerrar sesión", "Sign out")}
          </button>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-semibold text-text-primary mb-1">
            {lbl("Versión de la app", "App version")}
          </h3>
          <p className="text-[11px] text-text-muted mb-3">qhumaOS for families · v0.1 MVP</p>
          <button className="text-[11px] text-accent-text font-medium hover:underline cursor-pointer">
            {lbl("Enviar comentarios", "Send feedback")}
          </button>
        </div>

        {/* Current language indicator */}
        <div className="bg-accent-light rounded-2xl p-4 border border-accent-text/20">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={13} className="text-accent-text" />
            <span className="text-[11px] font-semibold text-accent-text">
              {lbl("Idioma activo", "Active language")}
            </span>
          </div>
          <p className="text-[12px] font-bold text-accent-text">
            {lang === "es" ? "🇪🇸 Español" : "🇬🇧 English"}
          </p>
          <p className="text-[10px] text-text-muted mt-1">
            {lbl(
              "Toda la sección de familias está en este idioma.",
              "The entire family section is in this language."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
