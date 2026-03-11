"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "es" | "en";

// ─── Translation dictionary ───────────────────────────────────────────────────
export const t: Record<string, Record<Lang, string>> = {
  // ── Global / nav ──
  "nav.dashboard":        { es: "Inicio",        en: "Dashboard" },
  "nav.project":          { es: "Mi Proyecto",   en: "My Project" },
  "nav.competencies":     { es: "Competencias",  en: "Competencies" },
  "nav.calendar":         { es: "Calendario",    en: "Calendar" },
  "nav.qcoins":           { es: "Q-Coins",       en: "Q-Coins" },
  "nav.profile":          { es: "Perfil",        en: "Profile" },
  "nav.settings":         { es: "Ajustes",       en: "Settings" },
  "nav.overview":         { es: "Resumen",       en: "Overview" },
  "nav.progress":         { es: "Progreso",      en: "Progress" },
  "nav.teachers":         { es: "Tutores",       en: "Teachers" },
  "nav.analytics":        { es: "Análisis",      en: "Analytics" },
  "nav.students":         { es: "Alumnos",       en: "Students" },
  "nav.projects":         { es: "Proyectos",     en: "Projects" },

  // ── Role labels ──
  "role.student":         { es: "Alumno",        en: "Student" },
  "role.parent":          { es: "Familia",       en: "Parent" },
  "role.teacher":         { es: "Profesor",      en: "Teacher" },

  // ── ParentDashboard ──
  "parent.week":          { es: "Semana",        en: "Week" },
  "parent.of":            { es: "de",            en: "of" },
  "parent.onTrack":       { es: "En ruta",       en: "On Track" },
  "parent.needsAttention":{ es: "Necesita apoyo",en: "Needs Attention" },
  "parent.excelling":     { es: "Destacando",    en: "Excelling" },
  "parent.tasksDone":     { es: "Tareas hechas", en: "Tasks Done" },
  "parent.remaining":     { es: "Pendientes",    en: "Remaining" },
  "parent.evidences":     { es: "Evidencias",    en: "Evidences" },
  "parent.streak":        { es: "Racha",         en: "Streak" },
  "parent.days":          { es: "días",          en: "days" },
  "parent.weeklySummary": { es: "Resumen inteligente de la semana", en: "Smart weekly summary" },
  "parent.aiReport":      { es: "Informe IA",    en: "AI Report" },
  "parent.generating":    { es: "Generando...",  en: "Generating..." },
  "parent.strengths":     { es: "Puntos fuertes",en: "Strengths" },
  "parent.supportTonight":{ es: "Cómo apoyar a Lucas esta noche", en: "How to support Lucas tonight" },
  "parent.notifications": { es: "Notificaciones",en: "Notifications" },
  "parent.today":         { es: "Hoy",           en: "Today" },
  "parent.topMovers":     { es: "Más crecimiento esta semana", en: "Top movers this week" },
  "parent.fullReport":    { es: "Ver informe completo", en: "Full progress report" },
  "parent.viewAll":       { es: "Ver todo",      en: "View all" },
  "parent.comingUp":      { es: "Próximas entregas", en: "Coming up" },
  "parent.fullWeek":      { es: "Ver semana completa", en: "Full week view" },
  "parent.whereWeAre":    { es: "Dónde estamos", en: "Where we are" },
  "parent.portfolio":     { es: "Portafolio de evidencias", en: "Evidence portfolio" },
  "parent.messages":      { es: "Mensajes",      en: "Messages" },
  "parent.energy":        { es: "Energía hoy",   en: "Energy today" },
  "parent.mood":          { es: "Estado de ánimo", en: "Mood" },
  "parent.motivation":    { es: "Motivación",    en: "Motivation" },
  "parent.classPosition": { es: "Posición en clase", en: "Class position" },
  "parent.of12":          { es: "de 12",         en: "of 12" },

  // ── ParentProgress ──
  "progress.excelling":   { es: "Donde destaca Lucas",     en: "Where Lucas is excelling" },
  "progress.developing":  { es: "Desarrollándose bien",    en: "Developing steadily" },
  "progress.needsTime":   { es: "Necesita más tiempo",     en: "Needs more time" },
  "progress.thisWeek":    { es: "Esta semana",             en: "This week" },
  "progress.howHelp":     { es: "Cómo puedes ayudar",      en: "How you can help" },
  "progress.summaryWeek": { es: "Resumen de progreso · Semana 3", en: "Progress summary · Week 3" },
  "progress.trimester":   { es: "Trimestre 1 de 4 · Semana 3 de 3", en: "Trimester 1 of 4 · Week 3 of 3" },
  "progress.evidencePort":{ es: "Portafolio de evidencias", en: "Evidence portfolio" },
  "progress.everyTask":   { es: "Cada tarea genera un documento real.", en: "Every task produces a real document." },
  "progress.noIntervention": { es: "Nada aquí requiere intervención", en: "Nothing here requires intervention" },
  "progress.needsTimeNote": { es: "Están creciendo — no son problemas. Pequeñas cosas en casa marcan la diferencia.", en: "These are growing — not problems. Small things at home make a real difference." },

  // ── ParentCalendar ──
  "calendar.weekOf":      { es: "Semana",        en: "Week" },
  "calendar.project":     { es: "Proyecto",      en: "Project" },
  "calendar.done":        { es: "Hecho",         en: "Done" },
  "calendar.inProgress":  { es: "En progreso",   en: "In progress" },
  "calendar.upcoming":    { es: "Hoy",           en: "Today" },
  "calendar.locked":      { es: "Próximo",       en: "Upcoming" },
  "calendar.weekGlance":  { es: "La semana de un vistazo", en: "Week at a glance" },
  "calendar.total":       { es: "Total entregas", en: "Total deliverables" },
  "calendar.completed":   { es: "Completadas",   en: "Completed" },
  "calendar.remaining":   { es: "Pendientes hoy",en: "Remaining today" },
  "calendar.locked2":     { es: "Bloqueadas",    en: "Locked" },
  "calendar.subjects":    { es: "Asignaturas esta semana", en: "Subjects this week" },
  "calendar.addReminder": { es: "Recordatorio añadido", en: "Reminder added" },
  "calendar.remind":      { es: "Recordarme",    en: "Remind me" },
  "calendar.demoDay":     { es: "Demo Day — 28 Feb", en: "Demo Day — Feb 28" },
  "calendar.demoDayInfo": { es: "Lucas presenta su proyecto Airbnb a la clase. Familias bienvenidas desde las 11:00.", en: "Lucas presents his Airbnb project to the class. Families welcome from 11:00." },
  "calendar.days.monday": { es: "Lunes",         en: "Monday" },
  "calendar.days.tuesday":{ es: "Martes",        en: "Tuesday" },
  "calendar.days.wednesday":{ es: "Miércoles",   en: "Wednesday" },
  "calendar.days.thursday":{ es: "Jueves",       en: "Thursday" },
  "calendar.days.friday": { es: "Viernes — Demo Day", en: "Friday — Demo Day" },
  "calendar.today":       { es: "HOY",           en: "TODAY" },

  // ── ParentTeachers / Messages ──
  "teachers.title":       { es: "Mensajes",      en: "Messages" },
  "teachers.mainTutor":   { es: "Tutora principal", en: "Main Tutor" },
  "teachers.send":        { es: "Enviar",        en: "Send" },
  "teachers.typeMsg":     { es: "Escribe un mensaje...", en: "Type a message..." },
  "teachers.online":      { es: "En línea",      en: "Online" },
  "teachers.offline":     { es: "Desconectado",  en: "Offline" },
  "teachers.otherParents":{ es: "Otros padres del aula", en: "Other parents in class" },
  "teachers.school":      { es: "Centro educativo", en: "School" },
  "teachers.unread":      { es: "no leído",      en: "unread" },
  "teachers.yesterday":   { es: "Ayer",          en: "Yesterday" },
  "teachers.channels":    { es: "Canales",       en: "Channels" },
  "teachers.newMsg":      { es: "Nuevo mensaje", en: "New message" },

  // ── Settings ──
  "settings.language":    { es: "Idioma",        en: "Language" },
  "settings.spanish":     { es: "Español",       en: "Spanish" },
  "settings.english":     { es: "Inglés",        en: "English" },
  "settings.saved":       { es: "Guardado",      en: "Saved" },
  "settings.title":       { es: "Ajustes",       en: "Settings" },
  "settings.notifications":{ es: "Notificaciones",en: "Notifications" },
  "settings.privacy":     { es: "Privacidad",    en: "Privacy" },
  "settings.account":     { es: "Cuenta",        en: "Account" },

  // ── Common ──
  "common.today":         { es: "Hoy",           en: "Today" },
  "common.yesterday":     { es: "Ayer",          en: "Yesterday" },
  "common.days":          { es: "días",          en: "days" },
  "common.loading":       { es: "Cargando...",   en: "Loading..." },
  "common.back":          { es: "Volver",        en: "Back" },
  "common.save":          { es: "Guardar",       en: "Save" },
  "common.cancel":        { es: "Cancelar",      en: "Cancel" },
  "common.send":          { es: "Enviar",        en: "Send" },
  "common.close":         { es: "Cerrar",        en: "Close" },
  "common.viewAll":       { es: "Ver todo",      en: "View all" },
  "common.tasks":         { es: "tareas",        en: "tasks" },
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "es",
  setLang: () => {},
  tr: (key) => t[key]?.es ?? key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const tr = (key: string) => t[key]?.[lang] ?? t[key]?.es ?? key;
  return (
    <LangContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
