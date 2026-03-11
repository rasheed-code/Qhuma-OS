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
  Brain,
} from "lucide-react";
import { Role, StudentView, TeacherView, ParentView } from "@/types";

// Badge counts (in a real app these would come from state/context)
const studentBadges: Partial<Record<StudentView, number | string>> = {
  qcoins: "340",
};

const teacherBadges: Partial<Record<TeacherView, number | string>> = {
  dashboard: 2, // urgent alerts
};

const studentNav: { icon: typeof LayoutDashboard; label: string; labelEs: string; view: StudentView }[] = [
  { icon: LayoutDashboard, label: "Dashboard", labelEs: "Inicio", view: "dashboard" },
  { icon: FolderKanban, label: "My Project", labelEs: "Mi Proyecto", view: "project" },
  { icon: BarChart3, label: "Competencies", labelEs: "Competencias", view: "competencies" },
  { icon: Calendar, label: "Calendar", labelEs: "Calendario", view: "calendar" },
  { icon: Coins, label: "Q-Coins", labelEs: "Q-Coins", view: "qcoins" },
  { icon: User, label: "Profile", labelEs: "Perfil", view: "profile" },
  { icon: Settings, label: "Settings", labelEs: "Ajustes", view: "settings" },
];

const parentNav: { icon: typeof LayoutDashboard; label: string; labelEs: string; view: ParentView }[] = [
  { icon: LayoutDashboard, label: "Overview", labelEs: "Resumen", view: "overview" },
  { icon: BarChart3, label: "Progress", labelEs: "Progreso", view: "progress" },
  { icon: Calendar, label: "Calendar", labelEs: "Calendario", view: "calendar" },
  { icon: MessageSquare, label: "Teachers", labelEs: "Tutores", view: "teachers" },
  { icon: User, label: "Profile", labelEs: "Perfil", view: "profile" },
  { icon: Settings, label: "Settings", labelEs: "Ajustes", view: "settings" },
];

const teacherNav: { icon: typeof LayoutDashboard; label: string; labelEs: string; view: TeacherView }[] = [
  { icon: LayoutDashboard, label: "Dashboard", labelEs: "Inicio", view: "dashboard" },
  { icon: FolderKanban, label: "Projects", labelEs: "Proyectos", view: "projects" },
  { icon: BarChart3, label: "Analytics", labelEs: "Análisis", view: "analytics" },
  { icon: Calendar, label: "Calendar", labelEs: "Calendario", view: "calendar" },
  { icon: User, label: "Students", labelEs: "Alumnos", view: "students" },
  { icon: Settings, label: "Settings", labelEs: "Ajustes", view: "settings" },
];

interface SidebarProps {
  role: Role;
  activeView?: StudentView;
  onNavigate?: (view: StudentView) => void;
  activeTeacherView?: TeacherView;
  onTeacherNavigate?: (view: TeacherView) => void;
  activeParentView?: ParentView;
  onParentNavigate?: (view: ParentView) => void;
}

export default function Sidebar({
  role,
  activeView,
  onNavigate,
  activeTeacherView,
  onTeacherNavigate,
  activeParentView,
  onParentNavigate,
}: SidebarProps) {
  // Role info
  const roleInfo = {
    student: { label: "1º ESO", subtitle: "Proyecto activo", dot: "bg-success" },
    parent: { label: "Familia García", subtitle: "Lucas · 1º ESO", dot: "bg-[#4F8EF7]" },
    teacher: { label: "Profa. Martínez", subtitle: "12 alumnos · 2 alertas", dot: "bg-warning" },
  };

  const info = roleInfo[role];

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
          Navegación
        </span>

        {role === "student"
          ? studentNav.map((item) => {
              const isActive = item.view === activeView;
              const badge = studentBadges[item.view];
              return (
                <button
                  key={item.label}
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
                  <span className="flex-1 text-left">{item.labelEs}</span>
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
                  key={item.label}
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
                  <span className="flex-1 text-left">{item.labelEs}</span>
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
          : parentNav.map((item) => {
              const isActive = item.view === activeParentView;
              return (
                <button
                  key={item.label}
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
                  <span className="flex-1 text-left">{item.labelEs}</span>
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
            <span className="text-[10px] text-white/70 font-medium">8 competencias</span>
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
              ? "📊 Informe semanal listo"
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
            ? "Lucas avanza muy bien esta semana."
            : "Dos alumnos necesitan apoyo."}
        </p>
        <button className="w-full bg-accent text-sidebar text-[10px] font-bold px-3 py-1.5 rounded-xl hover:brightness-110 transition-all cursor-pointer text-center">
          {role === "student" ? "Ver cronograma" : role === "parent" ? "Leer informe" : "Revisar ahora"}
        </button>
      </div>
    </aside>
  );
}
