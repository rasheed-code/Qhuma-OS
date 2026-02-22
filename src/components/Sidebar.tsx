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
} from "lucide-react";
import { Role, StudentView, TeacherView, ParentView } from "@/types";

const studentNav = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" as StudentView },
  { icon: FolderKanban, label: "My Project", view: "project" as StudentView },
  { icon: BarChart3, label: "Competencies", view: "competencies" as StudentView },
  { icon: Calendar, label: "Calendar", view: "calendar" as StudentView },
  { icon: Coins, label: "Q-Coins", view: "qcoins" as StudentView },
  { icon: User, label: "Profile", view: "profile" as StudentView },
  { icon: Settings, label: "Settings", view: "settings" as StudentView },
];

const parentNav: { icon: typeof LayoutDashboard; label: string; view: ParentView }[] = [
  { icon: LayoutDashboard, label: "Overview", view: "overview" },
  { icon: BarChart3, label: "Progress", view: "progress" },
  { icon: Calendar, label: "Calendar", view: "calendar" },
  { icon: User, label: "Teachers", view: "teachers" },
  { icon: Settings, label: "Settings", view: "settings" },
];

const teacherNav: { icon: typeof LayoutDashboard; label: string; view: TeacherView | null }[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: FolderKanban, label: "Projects", view: "projects" },
  { icon: BarChart3, label: "Analytics", view: "analytics" },
  { icon: Calendar, label: "Calendar", view: "calendar" },
  { icon: User, label: "Students", view: "students" },
  { icon: Settings, label: "Settings", view: "settings" },
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

export default function Sidebar({ role, activeView, onNavigate, activeTeacherView, onTeacherNavigate, activeParentView, onParentNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-4 top-4 bottom-4 w-[220px] bg-sidebar rounded-3xl flex flex-col py-7 px-4 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-10">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
          <span className="text-sidebar font-bold text-sm">Q</span>
        </div>
        <div>
          <span className="text-white font-semibold text-[15px] tracking-tight">
            qhuma
          </span>
          <span className="text-accent font-semibold text-[15px]">OS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {role === "student"
          ? studentNav.map((item) => {
              const isActive = item.view != null && item.view === activeView;
              const isClickable = item.view != null;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (isClickable && onNavigate) onNavigate(item.view!);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  } ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={isActive ? "text-accent" : ""}
                  />
                  {item.label}
                </button>
              );
            })
          : role === "teacher"
          ? teacherNav.map((item) => {
              const isActive = item.view != null && item.view === activeTeacherView;
              const isClickable = item.view != null;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (isClickable && onTeacherNavigate) onTeacherNavigate(item.view!);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  } ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={isActive ? "text-accent" : ""}
                  />
                  {item.label}
                </button>
              );
            })
          : parentNav.map((item) => {
              const isActive = item.view === activeParentView;
              return (
                <button
                  key={item.label}
                  onClick={() => onParentNavigate && onParentNavigate(item.view)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={isActive ? "text-accent" : ""}
                  />
                  {item.label}
                </button>
              );
            })}
      </nav>

      {/* Bottom promo card */}
      <div className="bg-white/10 rounded-2xl p-4 mt-4 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-2">
          <p className="text-white text-[13px] font-semibold leading-tight">
            {role === "student"
              ? "Demo Day Friday!"
              : role === "parent"
              ? "Weekly report ready"
              : "3 alerts pending"}
          </p>
          <Zap size={20} className="text-accent" />
        </div>
        <p className="text-white/40 text-[11px] leading-relaxed mb-3">
          {role === "student"
            ? "Prepare your pitch and make it count. You've got this!"
            : role === "parent"
            ? "Lucas is making great progress this week."
            : "Two students need attention."}
        </p>
        <button className="bg-accent text-sidebar text-[11px] font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer">
          {role === "student"
            ? "View Schedule"
            : role === "parent"
            ? "Read Report"
            : "Review Now"}
        </button>
      </div>
    </aside>
  );
}
