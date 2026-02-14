"use client";

import { GraduationCap, Users, BookOpen } from "lucide-react";
import { Role } from "@/types";

const roles: { key: Role; label: string; sublabel: string; icon: typeof GraduationCap }[] = [
  { key: "student", label: "Lucas García", sublabel: "1º ESO Student", icon: GraduationCap },
  { key: "parent", label: "María García", sublabel: "Parent View", icon: Users },
  { key: "teacher", label: "Prof. Ana Martínez", sublabel: "Mentor / Teacher", icon: BookOpen },
];

export default function RoleSelector({
  activeRole,
  onRoleChange,
}: {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {roles.map((role) => (
        <button
          key={role.key}
          onClick={() => onRoleChange(role.key)}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
            activeRole === role.key
              ? "bg-white text-text-primary shadow-sm"
              : "text-text-secondary hover:bg-white/50"
          }`}
        >
          <role.icon size={16} className={activeRole === role.key ? "text-accent-text" : ""} />
          <div className="text-left">
            <div className="leading-tight">{role.label}</div>
            <div className="text-[10px] text-text-muted font-normal">{role.sublabel}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
