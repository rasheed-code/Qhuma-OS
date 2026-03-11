"use client";

import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Calendar,
  Coins,
  User,
  Settings,
  Zap,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  GalleryHorizontalEnd,
  Trophy,
  Flame,
  Shield,
  Bot,
  Building2,
  FileText,
  Users,
  FileSpreadsheet,
  Sparkles,
  Mic,
  Landmark,
  ClipboardCheck,
  Search,
} from "lucide-react";
import { Role, StudentView, TeacherView, ParentView, AdminView } from "@/types";
import { useLang } from "@/lib/i18n";

// Badge counts (in a real app these would come from state/context)
const studentBadges: Partial<Record<StudentView, number | string>> = {
  qcoins: "340",
};

const teacherBadges: Partial<Record<TeacherView, number | string>> = {
  dashboard: 2, // urgent alerts
};

const studentNav: { icon: typeof LayoutDashboard; labelEs: string; labelEn: string; view: StudentView }[] = [
  { icon: LayoutDashboard,        labelEs: "Inicio",        labelEn: "Dashboard",    view: "dashboard" },
  { icon: FolderKanban,           labelEs: "Mi Proyecto",   labelEn: "My Project",   view: "project" },
  { icon: BookOpen,               labelEs: "Portfolio",     labelEn: "Portfolio",    view: "portfolio" },
  { icon: Mic,                    labelEs: "Pitch Lab",     labelEn: "Pitch Lab",    view: "pitchlab" },
  { icon: BarChart3,              labelEs: "Competencias",  labelEn: "Competencies", view: "competencies" },
  { icon: GalleryHorizontalEnd,   labelEs: "Evidencias",    labelEn: "Evidence",     view: "evidences" },
  { icon: Trophy,                 labelEs: "Logros",        labelEn: "Achievements", view: "achievements" },
  { icon: Flame,                  labelEs: "Racha",         labelEn: "Streak",       view: "streak" },
  { icon: Calendar,               labelEs: "Calendario",    labelEn: "Calendar",     view: "calendar" },
  { icon: Coins,                  labelEs: "Q-Coins",       labelEn: "Q-Coins",      view: "qcoins" },
  { icon: User,                   labelEs: "Perfil",        labelEn: "Profile",      view: "profile" },
  { icon: Settings,               labelEs: "Ajustes",       labelEn: "Settings",     view: "settings" },
];

const parentNav: { icon: typeof LayoutDashboard; labelEs: string; labelEn: string; view: ParentView }[] = [
  { icon: LayoutDashboard, labelEs: "Resumen",   labelEn: "Overview",  view: "overview" },
  { icon: BarChart3,       labelEs: "Progreso",  labelEn: "Progress",  view: "progress" },
  { icon: Calendar,        labelEs: "Calendario",labelEn: "Calendar",  view: "calendar" },
  { icon: MessageSquare,   labelEs: "Tutores",   labelEn: "Teachers",  view: "teachers" },
  { icon: User,            labelEs: "Perfil",    labelEn: "Profile",   view: "profile" },
  { icon: Settings,        labelEs: "Ajustes",   labelEn: "Settings",  view: "settings" },
];

const adminNav: { icon: typeof LayoutDashboard; labelEs: string; view: AdminView }[] = [
  { icon: LayoutDashboard, labelEs: "Resumen",     view: "overview" },
  { icon: Users,           labelEs: "Usuarios",    view: "users" },
  { icon: Landmark,        labelEs: "Capital",     view: "capital" },
  { icon: Bot,             labelEs: "IA",          view: "ai" },
  { icon: Building2,       labelEs: "Colegios",    view: "schools" },
  { icon: FileText,        labelEs: "Informes",    view: "reports" },
  { icon: Search,          labelEs: "Inspección",  view: "inspection" },
  { icon: BarChart3,       labelEs: "Métricas",    view: "metrics" },
];

const teacherNav: { icon: typeof LayoutDashboard; labelEs: string; labelEn: string; view: TeacherView }[] = [
  { icon: LayoutDashboard, labelEs: "Inicio",      labelEn: "Dashboard",  view: "dashboard" },
  { icon: FolderKanban,    labelEs: "Proyectos",   labelEn: "Projects",   view: "projects" },
  { icon: Sparkles,        labelEs: "Generador IA",labelEn: "AI Projects",view: "generator" },
  { icon: BarChart3,       labelEs: "Análisis",    labelEn: "Analytics", view: "analytics" },
  { icon: FileSpreadsheet, labelEs: "Notas",       labelEn: "Grades",    view: "gradebook" },
  { icon: ClipboardCheck,  labelEs: "Rúbricas",    labelEn: "Rubrics",   view: "rubrica" },
  { icon: Calendar,        labelEs: "Calendario",  labelEn: "Calendar",  view: "calendar" },
  { icon: User,            labelEs: "Alumnos",     labelEn: "Students",  view: "students" },
  { icon: MessageSquare,   labelEs: "Mensajes",    labelEn: "Messages",  view: "messages" },
  { icon: Settings,        labelEs: "Ajustes",     labelEn: "Settings",  view: "settings" },
];

interface SidebarProps {
  role: Role;
  activeView?: StudentView;
  onNavigate?: (view: StudentView) => void;
  activeTeacherView?: TeacherView;
  onTeacherNavigate?: (view: TeacherView) => void;
  activeParentView?: ParentView;
  onParentNavigate?: (view: ParentView) => void;
  activeAdminView?: AdminView;
  onAdminNavigate?: (view: AdminView) => void;
}

export default function Sidebar({
  role,
  activeView,
  onNavigate,
  activeTeacherView,
  onTeacherNavigate,
  activeParentView,
  onParentNavigate,
  activeAdminView,
  onAdminNavigate,
}: SidebarProps) {
  const { lang } = useLang();

  const lbl = (es: string, en: string) => (lang === "es" ? es : en);

  // Role info — always Spanish for student/teacher, bilingual for parent
  const roleInfo: Record<string, { label: string; subtitle: string; dot: string }> = {
    student: { label: "1º ESO", subtitle: "Proyecto activo", dot: "bg-success" },
    parent:  { label: "Familia García", subtitle: "Lucas · 1º ESO", dot: "bg-accent" },
    teacher: { label: "Profa. Martínez", subtitle: "12 alumnos · 2 alertas", dot: "bg-warning" },
    admin:   { label: "Admin QHUMA", subtitle: "Sistema activo", dot: "bg-success" },
  };

  const info = roleInfo[role];

  const navLabel = (item: { labelEs: string; labelEn: string }) =>
    lang === "es" ? item.labelEs : item.labelEn;

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-[220px] bg-sidebar rounded-3xl flex flex-col py-6 px-4 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-sidebar font-black text-[15px]">Q</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-0.5">
            <span className="text-white font-bold text-[16px] tracking-tight">qhuma</span>
            <span className="text-accent font-bold text-[16px]">OS</span>
          </div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 animate-pulse" title="Sistema activo" />
      </div>

      {/* Role indicator */}
      <div className="mx-3 mb-6 bg-white/5 rounded-2xl px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${info.dot} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <span className="text-white text-[12px] font-semibold block leading-tight truncate">{info.label}</span>
            <span className="text-white/40 text-[10px] truncate block">{info.subtitle}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {/* Section label */}
        <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest px-3 mb-2">
          {lbl("Navegación", "Navigation")}
        </span>

        {role === "student"
          ? studentNav.map((item) => {
              const isActive = item.view === activeView;
              const badge = studentBadges[item.view];
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate?.(item.view)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer group relative ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={17}
                    className={`flex-shrink-0 transition-colors ${isActive ? "text-accent" : "group-hover:text-white/60"}`}
                  />
                  <span className="flex-1 text-left">{navLabel(item)}</span>
                  {badge !== undefined && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      isActive ? "bg-accent text-sidebar" : "bg-white/10 text-white/60"
                    }`}>
                      {badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />
                  )}
                </button>
              );
            })
          : role === "teacher"
          ? teacherNav.map((item) => {
              const isActive = item.view === activeTeacherView;
              const badge = teacherBadges[item.view];
              return (
                <button
                  key={item.view}
                  onClick={() => onTeacherNavigate?.(item.view)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer group relative ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={17}
                    className={`flex-shrink-0 transition-colors ${isActive ? "text-accent" : "group-hover:text-white/60"}`}
                  />
                  <span className="flex-1 text-left">{navLabel(item)}</span>
                  {badge !== undefined && (
                    <span className="text-[9px] font-bold bg-urgent text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />
                  )}
                </button>
              );
            })
          : role === "admin"
          ? adminNav.map((item) => {
              const isActive = item.view === activeAdminView;
              return (
                <button
                  key={item.view}
                  onClick={() => onAdminNavigate?.(item.view)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer group relative ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={17}
                    className={`flex-shrink-0 transition-colors ${isActive ? "text-accent" : "group-hover:text-white/60"}`}
                  />
                  <span className="flex-1 text-left">{item.labelEs}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />
                  )}
                </button>
              );
            })
          : parentNav.map((item) => {
              const isActive = item.view === activeParentView;
              return (
                <button
                  key={item.view}
                  onClick={() => onParentNavigate?.(item.view)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer group relative ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={17}
                    className={`flex-shrink-0 transition-colors ${isActive ? "text-accent" : "group-hover:text-white/60"}`}
                  />
                  <span className="flex-1 text-left">{navLabel(item)}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />
                  )}
                </button>
              );
            })}
      </nav>

      {/* LOMLOE compliance badge */}
      <div className="mx-1 mb-3">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
          <BookOpen size={12} className="text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-wide block">LOMLOE</span>
            <span className="text-[10px] text-white/70 font-medium">8 {lbl("competencias", "competencies")}</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
        </div>
      </div>

      {/* Bottom contextual card */}
      <div className="bg-white/8 rounded-2xl p-3.5 backdrop-blur-sm border border-white/5">
        <div className="flex items-start justify-between mb-1.5">
          <p className="text-white text-[12px] font-semibold leading-tight pr-2">
            {role === "student"
              ? "🎯 Demo Day viernes"
              : role === "parent"
              ? lbl("📊 Informe semanal listo", "📊 Weekly report ready")
              : role === "admin"
              ? "⚡ Sistema al 94% de salud"
              : "⚠️ 2 alertas urgentes"}
          </p>
          {role === "teacher" ? (
            <AlertTriangle size={14} className="text-warning flex-shrink-0" />
          ) : (
            <Zap size={14} className="text-accent flex-shrink-0" />
          )}
        </div>
        <p className="text-white/40 text-[10px] leading-relaxed mb-2.5">
          {role === "student"
            ? "Prepara tu pitch. ¡Lo tienes!"
            : role === "parent"
            ? lbl("Lucas avanza muy bien esta semana.", "Lucas is doing great this week.")
            : "Dos alumnos necesitan apoyo."}
        </p>
        <button className="w-full bg-accent text-sidebar text-[10px] font-bold px-3 py-1.5 rounded-xl hover:brightness-110 transition-all cursor-pointer text-center">
          {role === "student"
            ? lbl("Ver cronograma", "View schedule")
            : role === "parent"
            ? lbl("Leer informe", "Read report")
            : lbl("Revisar ahora", "Review now")}
        </button>
      </div>
    </aside>
  );
}
