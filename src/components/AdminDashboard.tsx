"use client";

import { useState } from "react";
import {
  LayoutDashboard, Users, Bot, Building2, FileText, Shield,
  CheckCircle2, AlertTriangle, TrendingUp, Activity, Zap,
  Download, UserPlus, Bell, ChevronDown, ArrowUp, ArrowDown,
  Server, Database, RefreshCw, Clock, Search, X, Landmark,
  Vote, Eye,
} from "lucide-react";
import { AdminView } from "@/types";

interface AdminDashboardProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
}

type Colegio = "malaga" | "madrid";

const colegios = {
  malaga: {
    nombre: "QHUMA Málaga",
    alumnos: 312, docentes: 28, proyectos: 14, salud: 94,
    tendencia: "up" as const, clases: 18, nivel: "Primaria + ESO",
  },
  madrid: {
    nombre: "QHUMA Madrid",
    alumnos: 187, docentes: 19, proyectos: 8, salud: 88,
    tendencia: "up" as const, clases: 11, nivel: "ESO + Bachillerato",
  },
};

const actividadReciente = [
  { id: 1, tipo: "success", texto: "Daniel Torres alcanzó el nivel 5 — Arquitecto Digital", tiempo: "Hace 30 min", icon: Zap },
  { id: 2, tipo: "success", texto: "Sofía Martín entregó portfolio completo (16/16 evidencias)", tiempo: "Hace 1h", icon: CheckCircle2 },
  { id: 3, tipo: "info", texto: "IA generó 4 proyectos nuevos con Gemini 2.0 Flash", tiempo: "Hace 2h", icon: Bot },
  { id: 4, tipo: "warning", texto: "Pablo Ruiz requiere atención docente — sin actividad 3 días", tiempo: "Hace 3h", icon: AlertTriangle },
  { id: 5, tipo: "info", texto: "Sincronización LOMLOE completada — 8 competencias actualizadas", tiempo: "Hace 5h", icon: RefreshCw },
];

const estadoSistema = [
  { nombre: "Servidor IA (Gemini 2.0)", estado: "Operativo", detalle: "Respuesta media 1.2s", tipo: "success", icon: Server },
  { nombre: "Base de datos", estado: "Operativo", detalle: "Última copia hace 3h · 98 GB", tipo: "success", icon: Database },
  { nombre: "Sincronización LOMLOE", estado: "Actualizado", detalle: "Última sync hace 2h", tipo: "success", icon: RefreshCw },
  { nombre: "Alumnos sin actividad", estado: "3 alumnos", detalle: "Requieren seguimiento", tipo: "warning", icon: Users },
];

const usuariosMock = [
  { id: "1",  nombre: "Lucas García",      email: "lucas@qhuma.es",      rol: "Alumno",  curso: "1º ESO",               activo: true  },
  { id: "2",  nombre: "Sofía Martín",      email: "sofia@qhuma.es",      rol: "Alumno",  curso: "1º ESO",               activo: true  },
  { id: "3",  nombre: "Pablo Ruiz",        email: "pablo@qhuma.es",      rol: "Alumno",  curso: "1º ESO",               activo: false },
  { id: "4",  nombre: "Ana Martínez",      email: "ana@qhuma.es",        rol: "Docente", curso: "Mentor 1º ESO",        activo: true  },
  { id: "5",  nombre: "Carlos Pérez",      email: "carlos@qhuma.es",     rol: "Docente", curso: "Mentor 2º ESO",        activo: true  },
  { id: "6",  nombre: "María García",      email: "maria@qhuma.es",      rol: "Familia", curso: "Familia Lucas",        activo: true  },
  { id: "7",  nombre: "Daniel Torres",     email: "daniel@qhuma.es",     rol: "Alumno",  curso: "1º ESO",               activo: true  },
  { id: "8",  nombre: "Carmen Vega",       email: "carmen@qhuma.es",     rol: "Alumno",  curso: "1º ESO",               activo: true  },
  { id: "9",  nombre: "Lucía Fernández",   email: "lucia@qhuma.es",      rol: "Alumno",  curso: "2º ESO",               activo: true  },
  { id: "10", nombre: "Tomás Herrera",     email: "tomas@qhuma.es",      rol: "Alumno",  curso: "2º ESO",               activo: false },
  { id: "11", nombre: "Isabel Mora",       email: "isabel@qhuma.es",     rol: "Docente", curso: "Mentor 2º ESO",        activo: true  },
  { id: "12", nombre: "Roberto Núñez",     email: "roberto@qhuma.es",    rol: "Admin",   curso: "Administrador",        activo: true  },
];

const usoIA = [
  { feature: "Tutor chat (MentorIA)", llamadas: 1847, coste: 18.47 },
  { feature: "Generador de proyectos", llamadas: 234, coste: 4.68 },
  { feature: "Informes LOMLOE", llamadas: 89, coste: 2.67 },
];

const competenciasLOMLOE = [
  { key: "CLC", nombre: "Comunicación Lingüística", activa: true },
  { key: "CPL", nombre: "Plurilingüe", activa: true },
  { key: "STEM", nombre: "STEM", activa: true },
  { key: "CD", nombre: "Digital", activa: true },
  { key: "CPSAA", nombre: "Personal, Social y Aprender a Aprender", activa: true },
  { key: "CC", nombre: "Ciudadana", activa: true },
  { key: "CE", nombre: "Emprendedora", activa: true },
  { key: "CCEC", nombre: "Conciencia y Expresión Culturales", activa: true },
];

const qhumaCapitalProyectos = [
  {
    id: "1", alumno: "Lucas García", clase: "1º ESO",
    nombre: "El Airbnb de Lucas — Málaga",
    descripcion: "Plataforma de alquiler turístico en Málaga para financiar experiencias educativas locales",
    inversion: 8500, fase: "votación" as const, votos: 7, votosMax: 12,
  },
  {
    id: "2", alumno: "Sofía Martín", clase: "1º ESO",
    nombre: "Huerto Urbano Digital",
    descripcion: "Sistema IoT para gestión de huertos urbanos con app de seguimiento y sostenibilidad",
    inversion: 3200, fase: "aprobado" as const, votos: 11, votosMax: 12,
  },
  {
    id: "3", alumno: "Daniel Torres", clase: "1º ESO",
    nombre: "Podcast Escolar — Historias de Barrio",
    descripcion: "Serie de podcasts que explora la historia del barrio con entrevistas a vecinos",
    inversion: 1800, fase: "pitch" as const, votos: 0, votosMax: 12,
  },
  {
    id: "4", alumno: "Carmen Vega", clase: "1º ESO",
    nombre: "App de Intercambio Estudiantil",
    descripcion: "Plataforma peer-to-peer para intercambio de materiales y servicios entre estudiantes",
    inversion: 5000, fase: "financiado" as const, votos: 12, votosMax: 12,
  },
  {
    id: "5", alumno: "Lucía Fernández", clase: "2º ESO",
    nombre: "Estudio de Animación DIY",
    descripcion: "Miniestudio de stop-motion y animación 2D para producir contenido educativo",
    inversion: 2400, fase: "pitch" as const, votos: 0, votosMax: 12,
  },
];

const faseConfig = {
  pitch:      { label: "Pitch",     color: "bg-background text-text-secondary border border-card-border" },
  votación:   { label: "Votación",  color: "bg-warning-light text-warning" },
  aprobado:   { label: "Aprobado",  color: "bg-accent-light text-accent-text" },
  financiado: { label: "Financiado", color: "bg-success-light text-success" },
};

export default function AdminDashboard({ activeView, onNavigate }: AdminDashboardProps) {
  const [colegioActivo, setColegioActivo] = useState<Colegio>("malaga");
  const [showColegioMenu, setShowColegioMenu] = useState(false);
  const colegio = colegios[colegioActivo];

  // A2 — Users management state
  const [userSearch, setUserSearch] = useState("");
  const [userFilterRol, setUserFilterRol] = useState("Todos");
  const [userFilterEstado, setUserFilterEstado] = useState("Todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: "", email: "", rol: "Alumno", curso: "" });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-accent-text" />
            <h1 className="text-[22px] font-bold text-text-primary">Panel de Administración</h1>
          </div>
          <p className="text-[13px] text-text-secondary">QHUMA OS · Sistema educativo con IA · España</p>
        </div>
        {/* Selector de colegio */}
        <div className="relative">
          <button
            onClick={() => setShowColegioMenu(!showColegioMenu)}
            className="flex items-center gap-2 bg-background px-4 py-2.5 rounded-xl border border-card-border hover:border-accent-text/30 transition-all cursor-pointer"
          >
            <Building2 size={14} className="text-accent-text" />
            <span className="text-[13px] font-medium text-text-primary">{colegio.nombre}</span>
            <ChevronDown size={13} className="text-text-muted" />
          </button>
          {showColegioMenu && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-card-border rounded-xl shadow-sm overflow-hidden z-10 w-48">
              {(Object.keys(colegios) as Colegio[]).map((key) => (
                <button
                  key={key}
                  onClick={() => { setColegioActivo(key); setShowColegioMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[12px] flex items-center gap-2 transition-colors cursor-pointer ${
                    colegioActivo === key ? "bg-accent-light text-accent-text font-semibold" : "text-text-secondary hover:bg-background"
                  }`}
                >
                  <Building2 size={12} />
                  {colegios[key].nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="flex gap-1 bg-background rounded-xl p-1 mb-5">
        {([
          { key: "overview" as AdminView, label: "Resumen",  icon: LayoutDashboard },
          { key: "users"    as AdminView, label: "Usuarios", icon: Users },
          { key: "capital"  as AdminView, label: "Capital",  icon: Landmark },
          { key: "ai"       as AdminView, label: "IA",       icon: Bot },
          { key: "schools"  as AdminView, label: "Colegios", icon: Building2 },
          { key: "reports"  as AdminView, label: "Informes", icon: FileText },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              activeView === tab.key
                ? "bg-card text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: RESUMEN ─── */}
      {activeView === "overview" && (
        <div className="flex gap-5">
          <div className="flex-1 min-w-0 space-y-5">
            {/* Salud del sistema */}
            <div className="bg-sidebar rounded-2xl p-5 flex items-center gap-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#c3f499" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32 * (colegio.salud / 100)} ${2 * Math.PI * 32}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[20px] font-bold text-white">{colegio.salud}</span>
                  <span className="text-[9px] text-white/40">/100</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-white/50 mb-0.5">Salud de la plataforma</p>
                <p className="text-[18px] font-bold text-white mb-1">{colegio.nombre}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <ArrowUp size={11} className="text-accent" />
                    <span className="text-[10px] text-accent">Mejorando esta semana</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                {[
                  { label: "Alumnos", val: colegio.alumnos },
                  { label: "Docentes", val: colegio.docentes },
                  { label: "Proyectos", val: colegio.proyectos },
                  { label: "Clases", val: colegio.clases },
                ].map((s) => (
                  <div key={s.label} className="bg-white/8 rounded-xl px-3 py-2 text-center">
                    <span className="text-[16px] font-bold text-white block">{s.val}</span>
                    <span className="text-[9px] text-white/40">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado del sistema */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-text-primary" />
                <h3 className="text-[14px] font-semibold text-text-primary">Estado del sistema</h3>
              </div>
              <div className="space-y-2.5">
                {estadoSistema.map((item) => (
                  <div key={item.nombre} className={`flex items-center gap-3 p-3 rounded-xl border ${
                    item.tipo === "success" ? "bg-success-light border-success/15" : "bg-warning-light border-warning/20"
                  }`}>
                    <item.icon size={15} className={item.tipo === "success" ? "text-success" : "text-text-primary"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-text-primary">{item.nombre}</p>
                      <p className="text-[10px] text-text-muted">{item.detalle}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.tipo === "success" ? "bg-success text-white" : "bg-warning text-white"
                    }`}>{item.estado}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">Acciones rápidas</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Informe mensual", icon: FileText },
                  { label: "Exportar LOMLOE", icon: Download },
                  { label: "Añadir usuario", icon: UserPlus },
                  { label: "Notificaciones", icon: Bell },
                ].map((a) => (
                  <button key={a.label} className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl hover:bg-accent-light hover:border-accent-text/20 border border-transparent transition-all cursor-pointer">
                    <a.icon size={18} className="text-accent-text" />
                    <span className="text-[10px] font-medium text-text-secondary text-center leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel derecho — Actividad reciente */}
          <div className="w-[260px] flex-shrink-0">
            <div className="bg-card rounded-2xl border border-card-border p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} className="text-text-primary" />
                <h3 className="text-[13px] font-semibold text-text-primary">Actividad reciente</h3>
              </div>
              <div className="space-y-3">
                {actividadReciente.map((a) => (
                  <div key={a.id} className="flex gap-2.5">
                    <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      a.tipo === "success" ? "bg-success-light" : a.tipo === "warning" ? "bg-warning-light" : "bg-accent-light"
                    }`}>
                      <a.icon size={11} className={
                        a.tipo === "success" ? "text-success" : a.tipo === "warning" ? "text-text-primary" : "text-accent-text"
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-text-primary leading-snug">{a.texto}</p>
                      <span className="text-[9px] text-text-muted mt-0.5 block">{a.tiempo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: USUARIOS ─── */}
      {activeView === "users" && (() => {
        const filtered = usuariosMock.filter((u) => {
          const matchSearch = userSearch === "" || u.nombre.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
          const matchRol = userFilterRol === "Todos" || u.rol === userFilterRol;
          const matchEstado = userFilterEstado === "Todos" || (userFilterEstado === "Activo" ? u.activo : !u.activo);
          return matchSearch && matchRol && matchEstado;
        });
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Usuarios — {colegio.nombre}</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all"
              >
                <UserPlus size={12} />
                Añadir usuario
              </button>
            </div>
            {/* Search + Filters */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="w-full bg-background text-[12px] text-text-primary pl-8 pr-3 py-2 rounded-xl border border-card-border outline-none focus:border-accent-text/40 transition-colors"
                />
              </div>
              <select
                value={userFilterRol}
                onChange={(e) => setUserFilterRol(e.target.value)}
                className="bg-background text-[11px] text-text-secondary px-3 py-2 rounded-xl border border-card-border outline-none cursor-pointer"
              >
                {["Todos", "Alumno", "Docente", "Familia", "Admin"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <select
                value={userFilterEstado}
                onChange={(e) => setUserFilterEstado(e.target.value)}
                className="bg-background text-[11px] text-text-secondary px-3 py-2 rounded-xl border border-card-border outline-none cursor-pointer"
              >
                {["Todos", "Activo", "Inactivo"].map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
              <span className="text-[11px] text-text-muted flex-shrink-0">{filtered.length} usuarios</span>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    {["Nombre", "Email", "Rol", "Grupo/Curso", "Estado"].map((h) => (
                      <th key={h} className="text-[10px] font-bold text-text-muted text-left pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-card-border/50 hover:bg-background/50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                            {u.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-[12px] font-medium text-text-primary">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-[11px] text-text-secondary">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          u.rol === "Docente" ? "bg-accent-light text-accent-text"
                          : u.rol === "Alumno" ? "bg-background text-text-primary border border-card-border"
                          : u.rol === "Admin"  ? "bg-sidebar text-white"
                          : "bg-warning-light text-text-primary"
                        }`}>{u.rol}</span>
                      </td>
                      <td className="py-3 pr-4 text-[11px] text-text-secondary">{u.curso}</td>
                      <td className="py-3">
                        <div className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full ${u.activo ? "bg-success-light" : "bg-urgent-light"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${u.activo ? "bg-success" : "bg-urgent"}`} />
                          <span className={`text-[9px] font-semibold ${u.activo ? "text-success" : "text-urgent"}`}>
                            {u.activo ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[12px] text-text-muted">No hay usuarios que coincidan con los filtros.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal — Añadir usuario */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                <div className="bg-card rounded-2xl border border-card-border p-6 w-full max-w-[420px]">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <UserPlus size={16} className="text-accent-text" />
                      <h3 className="text-[15px] font-bold text-text-primary">Añadir nuevo usuario</h3>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Nombre completo", key: "nombre", type: "text", placeholder: "Ej. Elena Rodríguez" },
                      { label: "Email",            key: "email", type: "email", placeholder: "elena@qhuma.es" },
                      { label: "Grupo/Curso",      key: "curso", type: "text", placeholder: "Ej. 1º ESO" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          value={newUser[field.key as keyof typeof newUser]}
                          onChange={(e) => setNewUser({ ...newUser, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-background text-[12px] text-text-primary px-3 py-2.5 rounded-xl border border-card-border outline-none focus:border-accent-text/40 transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">Rol</label>
                      <select
                        value={newUser.rol}
                        onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                        className="w-full bg-background text-[12px] text-text-primary px-3 py-2.5 rounded-xl border border-card-border outline-none cursor-pointer"
                      >
                        {["Alumno", "Docente", "Familia", "Admin"].map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2.5 bg-background text-text-secondary text-[12px] font-medium rounded-xl cursor-pointer hover:bg-card-border/20 border border-card-border transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => { setShowAddModal(false); setNewUser({ nombre: "", email: "", rol: "Alumno", curso: "" }); }}
                      className="flex-1 py-2.5 bg-accent text-sidebar text-[12px] font-bold rounded-xl cursor-pointer hover:brightness-110 transition-all"
                    >
                      Crear usuario
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── TAB: QHUMA CAPITAL ─── */}
      {activeView === "capital" && (
        <div className="space-y-5">
          {/* Header stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Proyectos en evaluación", valor: "5",      sub: "Este trimestre",            bg: "bg-accent-light",   text: "text-accent-text" },
              { label: "Inversión total solicitada", valor: "€21.900", sub: "Máx. €10.000 por proyecto", bg: "bg-background",     text: "text-text-primary" },
              { label: "Proyectos financiados",   valor: "1",      sub: "Carmen Vega · €5.000",       bg: "bg-success-light",  text: "text-success" },
              { label: "Votos emitidos (docentes)", valor: "30",   sub: "De 48 posibles",             bg: "bg-warning-light",  text: "text-warning" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-card-border`}>
                <p className="text-[10px] text-text-muted mb-1 leading-tight">{s.label}</p>
                <span className={`text-[24px] font-bold ${s.text} block leading-none`}>{s.valor}</span>
                <span className="text-[10px] text-text-muted mt-1 block">{s.sub}</span>
              </div>
            ))}
          </div>

          {/* Proyectos */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Landmark size={14} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">Proyectos QHUMA Capital</h3>
              <span className="ml-auto text-[10px] text-text-muted">Fases: Pitch → Votación → Aprobado → Financiado</span>
            </div>
            <div className="space-y-3">
              {qhumaCapitalProyectos.map((p) => {
                const fase = faseConfig[p.fase];
                const porcentajeVotos = p.votosMax > 0 ? Math.round((p.votos / p.votosMax) * 100) : 0;
                return (
                  <div key={p.id} className="bg-background rounded-2xl p-4 flex items-start gap-4">
                    {/* Avatar alumno */}
                    <div className="w-9 h-9 rounded-full bg-sidebar text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {p.alumno.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary leading-snug">{p.nombre}</p>
                          <p className="text-[10px] text-text-muted">{p.alumno} · {p.clase}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${fase.color}`}>{fase.label}</span>
                          <span className="text-[12px] font-bold text-accent-text">€{p.inversion.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed mb-2">{p.descripcion}</p>
                      {/* Votos */}
                      {p.fase !== "pitch" && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <Vote size={11} className="text-text-muted" />
                            <span className="text-[10px] text-text-muted">{p.votos}/{p.votosMax} votos</span>
                          </div>
                          <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                p.fase === "financiado" ? "bg-success"
                                : p.fase === "aprobado"  ? "bg-accent"
                                : "bg-warning"
                              }`}
                              style={{ width: `${porcentajeVotos}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-text-muted">{porcentajeVotos}%</span>
                        </div>
                      )}
                    </div>
                    {/* Acción */}
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent-text text-[10px] font-bold rounded-xl hover:brightness-95 transition-all cursor-pointer flex-shrink-0">
                      <Eye size={11} />
                      Revisar pitch
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: IA ─── */}
      {activeView === "ai" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Llamadas API este mes", valor: "2.170", sub: "Gemini 2.0 Flash", bg: "bg-accent-light", text: "text-accent-text" },
              { label: "Coste estimado", valor: "€25,82", sub: "Dentro del presupuesto", bg: "bg-success-light", text: "text-success" },
              { label: "Tiempo de respuesta", valor: "1,2s", sub: "Objetivo <2s ✓", bg: "bg-background", text: "text-text-primary" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-5 border border-card-border ${s.bg}`}>
                <p className="text-[11px] text-text-muted mb-1">{s.label}</p>
                <span className={`text-[26px] font-bold ${s.text} block`}>{s.valor}</span>
                <span className="text-[10px] text-text-muted">{s.sub}</span>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={14} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">Uso por funcionalidad</h3>
            </div>
            <div className="space-y-4">
              {usoIA.map((u) => (
                <div key={u.feature}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium text-text-secondary">{u.feature}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-text-muted">{u.llamadas} llamadas</span>
                      <span className="text-[11px] font-bold text-accent-text">€{u.coste.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-accent-text rounded-full" style={{ width: `${(u.llamadas / 2170) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: COLEGIOS ─── */}
      {activeView === "schools" && (
        <div className="space-y-4">
          {(Object.keys(colegios) as Colegio[]).map((key) => {
            const c = colegios[key];
            return (
              <div key={key} className="bg-card rounded-2xl border border-card-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary">{c.nombre}</h3>
                    <p className="text-[12px] text-text-secondary">{c.nivel} · {c.clases} clases</p>
                  </div>
                  <div className="flex items-center gap-2 bg-success-light px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span className="text-[10px] font-bold text-success">Operativo</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Alumnos", val: c.alumnos },
                    { label: "Docentes", val: c.docentes },
                    { label: "Proyectos activos", val: c.proyectos },
                    { label: "Salud del sistema", val: `${c.salud}/100` },
                  ].map((s) => (
                    <div key={s.label} className="bg-background rounded-xl p-3 text-center">
                      <span className="text-[18px] font-bold text-text-primary block">{s.val}</span>
                      <span className="text-[9px] text-text-muted">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-card-border">
                  <p className="text-[11px] font-semibold text-text-primary mb-2">Competencias LOMLOE activas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {competenciasLOMLOE.map((comp) => (
                      <span key={comp.key} className="text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full">
                        {comp.key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB: INFORMES ─── */}
      {activeView === "reports" && (
        <div className="bg-card rounded-2xl border border-card-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Informes generados</h3>
            <button className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all">
              <Download size={12} />
              Nuevo informe
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              { nombre: "Informe LOMLOE — Semana 3 — 1º ESO", tipo: "LOMLOE", fecha: "Hoy 10:30", tamaño: "245 KB" },
              { nombre: "Evaluación competencial trimestral — Todos los grupos", tipo: "Evaluación", fecha: "Ayer 16:15", tamaño: "1.2 MB" },
              { nombre: "Narrativa de progreso — Lucas García", tipo: "Individual", fecha: "Ayer 11:00", tamaño: "87 KB" },
              { nombre: "Resumen mensual IA — Febrero 2026", tipo: "IA", fecha: "1 mar", tamaño: "334 KB" },
              { nombre: "Datos para inspección educativa — T1 2026", tipo: "Inspección", fecha: "28 feb", tamaño: "2.1 MB" },
            ].map((r) => (
              <div key={r.nombre} className="flex items-center gap-3 p-3 bg-background rounded-xl hover:border hover:border-card-border transition-all">
                <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-accent-text" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-text-primary truncate">{r.nombre}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-bold bg-background border border-card-border px-1.5 py-0.5 rounded-full text-text-muted">{r.tipo}</span>
                    <span className="text-[9px] text-text-muted">{r.fecha} · {r.tamaño}</span>
                  </div>
                </div>
                <button className="text-text-muted hover:text-accent-text transition-colors cursor-pointer">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
