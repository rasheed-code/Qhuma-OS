"use client";

import { useState } from "react";
import { Role, StudentView, TeacherView, ParentView, AdminView } from "@/types";
import { useLang } from "@/lib/i18n";
import Sidebar from "@/components/Sidebar";
import RoleSelector from "@/components/RoleSelector";
import StudentDashboard from "@/components/StudentDashboard";
import ParentDashboard from "@/components/ParentDashboard";
import ParentProgress from "@/components/ParentProgress";
import ParentCalendar from "@/components/ParentCalendar";
import ParentMessages from "@/components/ParentMessages";
import ParentProfile from "@/components/ParentProfile";
import ParentSettings from "@/components/ParentSettings";
import TeacherDashboard from "@/components/TeacherDashboard";
import TeacherProjects from "@/components/TeacherProjects";
import TeacherAnalytics from "@/components/TeacherAnalytics";
import TeacherCalendar from "@/components/TeacherCalendar";
import TeacherStudents from "@/components/TeacherStudents";
import TeacherSettings from "@/components/TeacherSettings";
import ProjectDetail from "@/components/ProjectDetail";
import StudentCompetencies from "@/components/StudentCompetencies";
import StudentCalendar from "@/components/StudentCalendar";
import StudentQCoins from "@/components/StudentQCoins";
import StudentProfile from "@/components/StudentProfile";
import StudentSettings from "@/components/StudentSettings";
import TaskWorkspace from "@/components/TaskWorkspace";
import EvidenceGallery from "@/components/EvidenceGallery";
import StudentAchievements from "@/components/StudentAchievements";
import StreakCalendar from "@/components/StreakCalendar";
import StudentPortfolio from "@/components/StudentPortfolio";
import AdminDashboard from "@/components/AdminDashboard";
import TeacherGradeBook from "@/components/TeacherGradeBook";

export default function Home() {
  const { lang, tr } = useLang();
  const [role, setRole] = useState<Role>("student");
  const [activeView, setActiveView] = useState<StudentView>("dashboard");
  const [activeTeacherView, setActiveTeacherView] = useState<TeacherView>("dashboard");
  const [activeParentView, setActiveParentView] = useState<ParentView>("overview");
  const [activeAdminView, setActiveAdminView] = useState<AdminView>("overview");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setActiveView("dashboard");
    setActiveTeacherView("dashboard");
    setActiveParentView("overview");
    setActiveAdminView("overview");
  };

  return (
    <div className="flex min-h-screen bg-background p-4 gap-4">
      <Sidebar
        role={role}
        activeView={activeView}
        onNavigate={setActiveView}
        activeTeacherView={activeTeacherView}
        onTeacherNavigate={setActiveTeacherView}
        activeParentView={activeParentView}
        onParentNavigate={setActiveParentView}
        activeAdminView={activeAdminView}
        onAdminNavigate={setActiveAdminView}
      />

      {/* Main panel — one big white rounded card */}
      <main className="flex-1 ml-[228px] bg-card rounded-3xl shadow-sm overflow-hidden">
        <div className="p-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <RoleSelector activeRole={role} onRoleChange={handleRoleChange} />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[13px] font-medium text-text-primary block">
                  {role === "student" ? "Lucas García"
                    : role === "parent" ? "María García"
                    : role === "admin" ? "Admin QHUMA"
                    : "Prof. Ana Martínez"}
                </span>
                <span className="text-[11px] text-text-muted">
                  {role === "student" ? "1º ESO"
                    : role === "parent" ? (lang === "es" ? "Familia de Lucas" : "Parent of Lucas")
                    : role === "admin" ? "Panel de administración"
                    : "1º ESO Mentor"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-sidebar flex items-center justify-center text-white text-[12px] font-semibold">
                {role === "student" ? "LG"
                  : role === "parent" ? "MG"
                  : role === "admin" ? "AQ"
                  : "AM"}
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          {role === "student" && activeView === "dashboard" && (
            <StudentDashboard
              onOpenProject={() => setActiveView("project")}
              onOpenTask={(taskId) => {
                setSelectedTaskId(taskId);
                setActiveView("task");
              }}
            />
          )}
          {role === "student" && activeView === "task" && selectedTaskId && (
            <TaskWorkspace
              taskId={selectedTaskId}
              onBack={() => setActiveView("dashboard")}
            />
          )}
          {role === "student" && activeView === "project" && (
            <ProjectDetail onBack={() => setActiveView("dashboard")} />
          )}
          {role === "student" && activeView === "competencies" && <StudentCompetencies />}
          {role === "student" && activeView === "calendar" && <StudentCalendar />}
          {role === "student" && activeView === "qcoins" && <StudentQCoins />}
          {role === "student" && activeView === "profile" && <StudentProfile />}
          {role === "student" && activeView === "settings" && <StudentSettings />}
          {role === "student" && activeView === "evidences" && <EvidenceGallery />}
          {role === "student" && activeView === "achievements" && <StudentAchievements />}
          {role === "student" && activeView === "streak" && <StreakCalendar />}
          {role === "student" && activeView === "portfolio" && <StudentPortfolio />}
          {role === "parent" && activeParentView === "overview" && (
            <ParentDashboard onNavigate={setActiveParentView} />
          )}
          {role === "parent" && activeParentView === "progress" && <ParentProgress />}
          {role === "parent" && activeParentView === "calendar" && <ParentCalendar />}
          {role === "parent" && activeParentView === "teachers" && <ParentMessages />}
          {role === "parent" && activeParentView === "profile" && <ParentProfile />}
          {role === "parent" && activeParentView === "settings" && <ParentSettings />}
          {role === "teacher" && activeTeacherView === "dashboard" && <TeacherDashboard />}
          {role === "teacher" && activeTeacherView === "projects" && (
            <TeacherProjects onNavigateToDashboard={() => setActiveTeacherView("dashboard")} />
          )}
          {role === "teacher" && activeTeacherView === "analytics" && <TeacherAnalytics />}
          {role === "teacher" && activeTeacherView === "calendar" && <TeacherCalendar />}
          {role === "teacher" && activeTeacherView === "students" && <TeacherStudents />}
          {role === "teacher" && activeTeacherView === "gradebook" && <TeacherGradeBook />}
          {role === "teacher" && activeTeacherView === "settings" && <TeacherSettings />}
          {role === "admin" && (
            <AdminDashboard activeView={activeAdminView} onNavigate={setActiveAdminView} />
          )}
        </div>
      </main>
    </div>
  );
}
