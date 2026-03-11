"use client";

import { useState } from "react";
import {
  LayoutDashboard, Users, Bot, Building2, FileText, Shield,
  CheckCircle2, AlertTriangle, TrendingUp, Activity, Zap,
  Download, UserPlus, Bell, ChevronDown, ArrowUp, ArrowDown,
  Server, Database, RefreshCw, Clock, Search, X, Landmark,
  Vote, Eye, Save, TrendingDown, Minus, Calendar, ClipboardCheck,
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

const heatmapAlumnos = [
  { nombre: "Lucas García",    rol: "Alumno",  semana: [12, 8, 15, 6, 10] },
  { nombre: "Sofía Martín",    rol: "Alumno",  semana: [14, 12, 9, 11, 8] },
  { nombre: "Daniel Torres",   rol: "Alumno",  semana: [11, 9, 13, 7, 12] },
  { nombre: "Carmen Vega",     rol: "Alumno",  semana: [8, 7, 10, 9, 6] },
  { nombre: "Lucía Fernández", rol: "Alumno",  semana: [5, 8, 7, 9, 11] },
  { nombre: "Pablo Ruiz",      rol: "Alumno",  semana: [0, 2, 0, 1, 0] },
  { nombre: "Tomás Herrera",   rol: "Alumno",  semana: [1, 0, 2, 0, 1] },
  { nombre: "Ana Martínez",    rol: "Docente", semana: [4, 6, 5, 8, 3] },
  { nombre: "Carlos Pérez",    rol: "Docente", semana: [3, 5, 4, 6, 2] },
  { nombre: "Isabel Mora",     rol: "Docente", semana: [5, 4, 6, 5, 4] },
  { nombre: "María García",    rol: "Familia", semana: [2, 1, 3, 2, 1] },
  { nombre: "Roberto Núñez",   rol: "Admin",   semana: [6, 8, 7, 9, 5] },
];

const comparativaSemanal = [
  { semana: "Sem 1 Feb", llamadas: 487, coste: 6.12 },
  { semana: "Sem 2 Feb", llamadas: 612, coste: 7.68 },
  { semana: "Sem 3 Feb", llamadas: 534, coste: 6.71 },
  { semana: "Sem 1 Mar (actual)", llamadas: 537, coste: 6.74 },
];

const escalasLOMLOE = [
  { nivel: 1, etiqueta: "Inicio",               desc: "El alumno necesita apoyo para lograr los aprendizajes esperados",               bg: "bg-urgent-light",  text: "text-urgent" },
  { nivel: 2, etiqueta: "En proceso",            desc: "El alumno avanza hacia los aprendizajes esperados con apoyo",                  bg: "bg-warning-light", text: "text-warning" },
  { nivel: 3, etiqueta: "Logro esperado",        desc: "El alumno alcanza los aprendizajes esperados de forma autónoma",               bg: "bg-accent-light",  text: "text-accent-text" },
  { nivel: 4, etiqueta: "Logro sobresaliente",   desc: "El alumno supera los aprendizajes esperados y los aplica en nuevos contextos", bg: "bg-success-light", text: "text-success" },
];

const trimestres = [
  { nombre: "1er Trimestre", inicio: "9 sep 2025", fin: "19 dic 2025", semanas: 15, estado: "completado" as const },
  { nombre: "2º Trimestre",  inicio: "12 ene 2026", fin: "27 mar 2026", semanas: 11, estado: "activo"     as const },
  { nombre: "3er Trimestre", inicio: "22 abr 2026", fin: "22 jun 2026", semanas: 9,  estado: "próximo"    as const },
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

  // A4 — School settings state
  const [compActivas, setCompActivas] = useState<Record<string, boolean>>(
    Object.fromEntries(competenciasLOMLOE.map((c) => [c.key, c.activa]))
  );
  const [schoolForm, setSchoolForm] = useState({
    nombre: "QHUMA Málaga", director: "Roberto Sánchez",
    email: "direccion@qhuma-malaga.es", nivel: "Primaria + ESO",
    direccion: "Calle Larios 12, 29005 Málaga",
  });

  // A6 — Reports generator state
  const reportAlumnos = usuariosMock.filter((u) => u.rol === "Alumno");
  const [reportAlumno, setReportAlumno] = useState(reportAlumnos[0]?.nombre ?? "");
  const [reportTrimestre, setReportTrimestre] = useState<"1" | "2" | "3">("2");
  const [reportTipo, setReportTipo] = useState<"individual" | "grupo" | "lomloe" | "inspeccion">("individual");
  const [reportPreview, setReportPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerarInforme = () => {
    setIsGenerating(true);
    setReportPreview(false);
    setTimeout(() => { setIsGenerating(false); setReportPreview(true); }, 1400);
  };
  const handleDescargar = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1200);
  };

  const trimestreLabel: Record<string, string> = { "1": "1er Trimestre 2025-26", "2": "2º Trimestre 2025-26", "3": "3er Trimestre 2025-26" };
  const tipoLabel: Record<string, string> = { individual: "Individual", grupo: "Grupo", lomloe: "LOMLOE Completo", inspeccion: "Inspección" };

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
          { key: "capital"     as AdminView, label: "Capital",    icon: Landmark },
          { key: "ai"          as AdminView, label: "IA",         icon: Bot },
          { key: "schools"     as AdminView, label: "Colegios",   icon: Building2 },
          { key: "reports"     as AdminView, label: "Informes",   icon: FileText },
          { key: "inspection"  as AdminView, label: "Inspección", icon: ClipboardCheck },
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
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Llamadas API este mes",    valor: "2.170",   sub: "Gemini 2.0 Flash",      bg: "bg-accent-light",  text: "text-accent-text" },
              { label: "Coste estimado total",     valor: "€25,82",  sub: "Presupuesto: €40/mes",  bg: "bg-success-light", text: "text-success" },
              { label: "Tiempo medio respuesta",   valor: "1,2s",    sub: "Objetivo <2s ✓",        bg: "bg-background",    text: "text-text-primary" },
              { label: "Tasa socrática",           valor: "74%",     sub: "Preguntas de retorno",  bg: "bg-warning-light", text: "text-warning" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-4 border border-card-border ${s.bg}`}>
                <p className="text-[10px] text-text-muted mb-1 leading-tight">{s.label}</p>
                <span className={`text-[24px] font-bold ${s.text} block leading-none`}>{s.valor}</span>
                <span className="text-[10px] text-text-muted mt-1 block">{s.sub}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-5">
            {/* Uso por funcionalidad */}
            <div className="flex-1 bg-card rounded-2xl border border-card-border p-5">
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
                        <span className="text-[10px] text-text-muted">{u.llamadas.toLocaleString()} llamadas</span>
                        <span className="text-[11px] font-bold text-accent-text">€{u.coste.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-accent-text rounded-full transition-all" style={{ width: `${(u.llamadas / 2170) * 100}%` }} />
                    </div>
                    <span className="text-[9px] text-text-muted block mt-1">
                      {Math.round((u.llamadas / 2170) * 100)}% del total
                    </span>
                  </div>
                ))}
              </div>

              {/* Comparativa semanal */}
              <div className="mt-5 pt-4 border-t border-card-border">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={12} className="text-text-primary" />
                  <span className="text-[12px] font-semibold text-text-primary">Comparativa semanal</span>
                </div>
                <div className="flex items-end gap-2 h-[80px]">
                  {comparativaSemanal.map((s) => {
                    const maxLlamadas = Math.max(...comparativaSemanal.map((x) => x.llamadas));
                    const pct = Math.round((s.llamadas / maxLlamadas) * 100);
                    const isActual = s.semana.includes("actual");
                    return (
                      <div key={s.semana} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-text-muted">{s.llamadas}</span>
                        <div className="w-full flex items-end" style={{ height: "52px" }}>
                          <div
                            className={`w-full rounded-t-lg transition-all ${isActual ? "bg-accent-text" : "bg-accent-light"}`}
                            style={{ height: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[8px] text-text-muted text-center leading-tight">{s.semana.replace(" (actual)", "")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Heatmap de uso por alumno */}
            <div className="w-[320px] flex-shrink-0 bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-text-primary" />
                <h3 className="text-[13px] font-semibold text-text-primary">Actividad por usuario</h3>
                <span className="ml-auto text-[9px] text-text-muted">Lun–Vie esta semana</span>
              </div>
              {/* Cabecera días */}
              <div className="flex gap-1 mb-1 pl-[88px]">
                {["L", "M", "X", "J", "V"].map((d) => (
                  <div key={d} className="flex-1 text-center text-[9px] text-text-muted font-bold">{d}</div>
                ))}
              </div>
              <div className="space-y-0.5">
                {heatmapAlumnos.map((a) => {
                  const total = a.semana.reduce((acc, v) => acc + v, 0);
                  return (
                    <div key={a.nombre} className="flex items-center gap-1">
                      <div className="w-[84px] flex-shrink-0 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-sidebar text-white text-[7px] font-bold flex items-center justify-center flex-shrink-0">
                          {a.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[9px] text-text-secondary truncate">{a.nombre.split(" ")[0]}</span>
                      </div>
                      {a.semana.map((val, i) => {
                        const t = Math.min(val / 15, 1);
                        const r = Math.round(195 + (31 - 195) * t);
                        const g = Math.round(244 + (81 - 244) * t);
                        const b = Math.round(153 + (76 - 153) * t);
                        return (
                          <div
                            key={i}
                            className="flex-1 h-5 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: val === 0 ? "#f4f0e9" : `rgb(${r},${g},${b})` }}
                            title={`${a.nombre} — ${["Lun","Mar","Mié","Jue","Vie"][i]}: ${val} llamadas`}
                          >
                            {val > 0 && (
                              <span className="text-[7px] font-bold" style={{ color: t > 0.5 ? "white" : "#2f574d" }}>{val}</span>
                            )}
                          </div>
                        );
                      })}
                      <span className="text-[8px] text-text-muted w-5 text-right flex-shrink-0">{total}</span>
                    </div>
                  );
                })}
              </div>
              {/* Leyenda */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-card-border">
                <span className="text-[9px] text-text-muted">Menos</span>
                {[0, 3, 6, 9, 12, 15].map((v) => {
                  const t = Math.min(v / 15, 1);
                  const r = Math.round(195 + (31 - 195) * t);
                  const g = Math.round(244 + (81 - 244) * t);
                  const b = Math.round(153 + (76 - 153) * t);
                  return (
                    <div key={v} className="w-4 h-4 rounded-sm" style={{ backgroundColor: v === 0 ? "#f4f0e9" : `rgb(${r},${g},${b})` }} />
                  );
                })}
                <span className="text-[9px] text-text-muted">Más</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: COLEGIOS (A4 — AdminSchoolSettings) ─── */}
      {activeView === "schools" && (
        <div className="space-y-5">
          {/* Información general del colegio */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-text-primary" />
                <h3 className="text-[14px] font-semibold text-text-primary">Información del colegio — {colegio.nombre}</h3>
              </div>
              <button className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all">
                <Save size={11} />
                Guardar cambios
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Nombre del colegio", key: "nombre",    placeholder: "QHUMA Málaga" },
                { label: "Director/a",         key: "director",  placeholder: "Nombre y apellidos" },
                { label: "Email institucional", key: "email",    placeholder: "direccion@colegio.es" },
                { label: "Nivel educativo",    key: "nivel",     placeholder: "Ej. Primaria + ESO" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={schoolForm[field.key as keyof typeof schoolForm]}
                    onChange={(e) => setSchoolForm({ ...schoolForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-background text-[12px] text-text-primary px-3 py-2.5 rounded-xl border border-card-border outline-none focus:border-accent-text/40 transition-colors"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">Dirección postal</label>
                <input
                  type="text"
                  value={schoolForm.direccion}
                  onChange={(e) => setSchoolForm({ ...schoolForm, direccion: e.target.value })}
                  placeholder="Calle, número, código postal, ciudad"
                  className="w-full bg-background text-[12px] text-text-primary px-3 py-2.5 rounded-xl border border-card-border outline-none focus:border-accent-text/40 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Competencias LOMLOE — toggles */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">Competencias LOMLOE activas</h3>
              <span className="ml-auto text-[10px] text-text-muted">
                {Object.values(compActivas).filter(Boolean).length}/8 activas
              </span>
            </div>
            <p className="text-[11px] text-text-muted mb-4">Según Real Decreto 217/2022 (ESO) y 243/2022 (Bachillerato). Desactivar una competencia la oculta de los informes del colegio.</p>
            <div className="grid grid-cols-2 gap-3">
              {competenciasLOMLOE.map((comp) => {
                const activa = compActivas[comp.key] ?? true;
                return (
                  <div
                    key={comp.key}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activa ? "bg-accent-light border-accent/30" : "bg-background border-card-border opacity-60"
                    }`}
                    onClick={() => setCompActivas({ ...compActivas, [comp.key]: !activa })}
                  >
                    <div className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${activa ? "bg-accent-text" : "bg-text-muted/30"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${activa ? "left-5" : "left-0.5"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-accent-text block">{comp.key}</span>
                      <span className="text-[10px] text-text-secondary truncate block">{comp.nombre}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendario académico */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">Calendario académico 2025-2026</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {trimestres.map((t) => (
                <div key={t.nombre} className={`rounded-2xl p-4 border ${
                  t.estado === "activo"     ? "bg-accent-light border-accent/30"
                  : t.estado === "completado" ? "bg-success-light border-success/20"
                  : "bg-background border-card-border opacity-70"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-text-primary">{t.nombre}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      t.estado === "activo"     ? "bg-accent text-sidebar"
                      : t.estado === "completado" ? "bg-success text-white"
                      : "bg-background border border-card-border text-text-muted"
                    }`}>
                      {t.estado === "activo" ? "En curso" : t.estado === "completado" ? "Completado" : "Próximo"}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted mb-0.5">{t.inicio} → {t.fin}</p>
                  <p className="text-[10px] font-semibold text-accent-text">{t.semanas} semanas lectivas</p>
                </div>
              ))}
            </div>
          </div>

          {/* Escala de evaluación LOMLOE */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">Escala de evaluación LOMLOE (1-4)</h3>
              <span className="ml-auto text-[10px] text-text-muted">Conforme a los criterios oficiales del MEC</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {escalasLOMLOE.map((e) => (
                <div key={e.nivel} className={`${e.bg} rounded-xl p-4 border border-card-border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[16px] font-bold ${e.text}`}>{e.nivel}</div>
                    <span className={`text-[11px] font-bold ${e.text}`}>{e.etiqueta}</span>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-snug">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: INFORMES ─── */}
      {activeView === "reports" && (
        <div className="space-y-5">
          {/* Generador de informes */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={15} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">Generador de informes LOMLOE</h3>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Selector alumno */}
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">Alumno</label>
                <select
                  value={reportAlumno}
                  onChange={(e) => { setReportAlumno(e.target.value); setReportPreview(false); }}
                  className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-[12px] text-text-primary outline-none cursor-pointer appearance-none"
                >
                  {reportAlumnos.map((a) => (
                    <option key={a.id} value={a.nombre}>{a.nombre} · {a.curso}</option>
                  ))}
                </select>
              </div>

              {/* Selector trimestre */}
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">Trimestre</label>
                <select
                  value={reportTrimestre}
                  onChange={(e) => { setReportTrimestre(e.target.value as "1" | "2" | "3"); setReportPreview(false); }}
                  className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-[12px] text-text-primary outline-none cursor-pointer appearance-none"
                >
                  <option value="1">1er Trimestre</option>
                  <option value="2">2º Trimestre (actual)</option>
                  <option value="3">3er Trimestre</option>
                </select>
              </div>

              {/* Selector tipo */}
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">Tipo de informe</label>
                <select
                  value={reportTipo}
                  onChange={(e) => { setReportTipo(e.target.value as typeof reportTipo); setReportPreview(false); }}
                  className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-[12px] text-text-primary outline-none cursor-pointer appearance-none"
                >
                  <option value="individual">Individual</option>
                  <option value="grupo">Grupo / Clase</option>
                  <option value="lomloe">LOMLOE Completo</option>
                  <option value="inspeccion">Para Inspección</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerarInforme}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-sidebar text-white text-[12px] font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-accent-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <><RefreshCw size={13} className="animate-spin" /> Generando informe...</>
              ) : (
                <><FileText size={13} /> Generar informe</>
              )}
            </button>
          </div>

          {/* Preview del informe */}
          {reportPreview && (
            <div className="bg-card rounded-2xl border border-accent-text/20 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
                    <FileText size={14} className="text-accent-text" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-text-primary">
                      Informe {tipoLabel[reportTipo]} — {reportAlumno}
                    </p>
                    <p className="text-[10px] text-text-muted">{trimestreLabel[reportTrimestre]} · Generado ahora</p>
                  </div>
                </div>
                <button
                  onClick={handleDescargar}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {isDownloading ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                  {isDownloading ? "Preparando..." : "Descargar PDF"}
                </button>
              </div>

              {/* Estructura del informe preview */}
              <div className="bg-background rounded-xl p-4 font-mono text-[11px] space-y-2">
                <p className="text-text-primary font-bold text-[12px]">
                  INFORME {tipoLabel[reportTipo].toUpperCase()} — LOMLOE 2022 — QHUMA MÁLAGA
                </p>
                <p className="text-text-muted">Alumno/a: {reportAlumno} · Curso: 1º ESO · {trimestreLabel[reportTrimestre]}</p>
                <div className="border-t border-card-border my-2" />
                {[
                  { n: "1", titulo: "Datos del alumno y contexto educativo" },
                  { n: "2", titulo: "Proyecto activo: Gestiona tu Airbnb en Málaga" },
                  { n: "3", titulo: "Evaluación de las 8 competencias LOMLOE" },
                  { n: "4", titulo: "Evidencias entregadas: 9/16 · Calidad general: Logro esperado" },
                  { n: "5", titulo: "Historial de errores documentados y superados" },
                  { n: "6", titulo: "Observaciones del docente mentor" },
                  { n: "7", titulo: "Escala LOMLOE: Logro sobresaliente en CE (90%)" },
                  { n: "8", titulo: "Recomendaciones para el siguiente trimestre" },
                ].map((s) => (
                  <p key={s.n} className="text-text-secondary">
                    <span className="text-accent-text font-bold">{s.n}.</span> {s.titulo}
                  </p>
                ))}
                <div className="border-t border-card-border my-2" />
                <p className="text-text-muted text-[10px]">
                  Generado por QHUMA OS · Normativa Real Decreto 217/2022 · {new Date().toLocaleDateString("es-ES")}
                </p>
              </div>

              {/* Escala LOMLOE resumen */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {escalasLOMLOE.map((e) => (
                  <div key={e.nivel} className={`rounded-xl p-3 ${e.bg}`}>
                    <p className={`text-[10px] font-bold ${e.text} mb-0.5`}>Nivel {e.nivel}</p>
                    <p className={`text-[9px] font-semibold ${e.text}`}>{e.etiqueta}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informes recientes */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">Informes recientes</h3>
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
        </div>
      )}
      {/* ─── TAB: INSPECCIÓN ─── */}
      {activeView === "inspection" && (() => {
        const inspeccionAlumnos = usuariosMock
          .filter((u) => u.rol === "Alumno")
          .map((u, i) => ({
            ...u,
            proyecto: i < 5 ? ["Airbnb Málaga", "Huerto Urbano Digital", "Podcast Escolar", "App Intercambio", "Estudio Animación"][i] : "Airbnb Málaga",
            progreso: [72, 88, 45, 91, 67, 54, 38, 80, 76, 62][i] ?? 60,
            evidencias: [9, 14, 6, 16, 11, 8, 5, 13, 10, 9][i] ?? 8,
            nivelLomloe: [3, 4, 2, 4, 3, 2, 1, 3, 3, 2][i] as 1 | 2 | 3 | 4 ?? 2,
          }));

        const nivelLomloeCfg: Record<number, { label: string; bg: string; text: string }> = {
          1: { label: "Inicio",        bg: "bg-urgent-light",  text: "text-urgent" },
          2: { label: "En proceso",    bg: "bg-warning-light", text: "text-warning" },
          3: { label: "Logro esp.",    bg: "bg-accent-light",  text: "text-accent-text" },
          4: { label: "Sobresaliente", bg: "bg-success-light", text: "text-success" },
        };

        const checklist = [
          { ok: true,  texto: "Programación curricular alineada con Real Decreto 217/2022 (ESO)" },
          { ok: true,  texto: "Evaluación por competencias LOMLOE — 8 áreas activas" },
          { ok: true,  texto: "Criterios de evaluación definidos por tarea y rúbrica de 4 niveles" },
          { ok: true,  texto: "Evidencias de aprendizaje digitales con control de entrega" },
          { ok: true,  texto: "Informe de progreso trimestral por alumno exportable" },
          { ok: true,  texto: "Ratio docente-alumno: 1:12 (dentro del límite normativo)" },
          { ok: false, texto: "Actas de evaluación firmadas por el claustro — pendiente T2" },
          { ok: true,  texto: "Atención a la diversidad: seguimiento activo de 3 alumnos en riesgo" },
          { ok: true,  texto: "Coordinación con familias: 100% con acceso al panel parental" },
          { ok: false, texto: "Memoria anual de curso — pendiente de redactar (entrega junio 2026)" },
        ];

        const cumplimiento = Math.round((checklist.filter((c) => c.ok).length / checklist.length) * 100);

        return (
          <div className="space-y-5">
            {/* KPIs de inspección */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Alumnos activos",        valor: "12",   sub: "1º y 2º ESO",               bg: "bg-card", textV: "text-text-primary" },
                { label: "Cumplimiento LOMLOE",    valor: `${cumplimiento}%`, sub: "8/10 requisitos", bg: "bg-success-light", textV: "text-success" },
                { label: "Evidencias entregadas",  valor: "127",  sub: "de 192 posibles",             bg: "bg-accent-light",  textV: "text-accent-text" },
                { label: "Proyectos en curso",     valor: "14",   sub: "4 colegios activos",          bg: "bg-card", textV: "text-text-primary" },
              ].map((k) => (
                <div key={k.label} className={`${k.bg} rounded-2xl border border-card-border p-4`}>
                  <p className={`text-[28px] font-bold ${k.textV} leading-none mb-1`}>{k.valor}</p>
                  <p className="text-[11px] font-semibold text-text-primary">{k.label}</p>
                  <p className="text-[10px] text-text-muted">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabla de alumnos */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">Progreso por alumno — {trimestreLabel["2"]}</h3>
                </div>
                <button className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all">
                  <Download size={12} />
                  Exportar para inspección
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-card-border">
                      {["Alumno", "Curso", "Proyecto", "Progreso", "Evidencias", "Nivel LOMLOE", "Estado"].map((h) => (
                        <th key={h} className="text-left text-[10px] font-bold text-text-muted uppercase tracking-wide py-2 px-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inspeccionAlumnos.map((a) => {
                      const nlCfg = nivelLomloeCfg[a.nivelLomloe];
                      return (
                        <tr key={a.id} className="border-b border-card-border/50 hover:bg-background transition-colors">
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                                {a.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="text-[11px] font-medium text-text-primary">{a.nombre}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-[11px] text-text-muted">{a.curso}</td>
                          <td className="py-2.5 px-2 text-[11px] text-text-secondary truncate max-w-[140px]">{a.proyecto}</td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-accent-text" style={{ width: `${a.progreso}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-text-primary">{a.progreso}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-[11px] text-text-secondary">{a.evidencias}/16</td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${nlCfg.bg} ${nlCfg.text}`}>
                              {a.nivelLomloe} — {nlCfg.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${a.activo ? "bg-success-light text-success" : "bg-urgent-light text-urgent"}`}>
                              {a.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checklist normativo */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck size={15} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">Cumplimiento normativo — Real Decreto 217/2022</h3>
                <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${cumplimiento >= 80 ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}>
                  {checklist.filter(c => c.ok).length}/{checklist.length} requisitos
                </span>
              </div>
              <div className="space-y-2">
                {checklist.map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${item.ok ? "bg-success-light" : "bg-urgent-light"}`}>
                    {item.ok
                      ? <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5" />
                      : <AlertTriangle size={14} className="text-urgent flex-shrink-0 mt-0.5" />
                    }
                    <p className={`text-[11px] leading-relaxed ${item.ok ? "text-text-secondary" : "text-urgent"}`}>
                      {item.texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos disponibles */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={14} className="text-accent-text" />
                <h3 className="text-[13px] font-semibold text-text-primary">Documentación para inspección</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { nombre: "Programación didáctica completa — 2025-26",     estado: "listo" },
                  { nombre: "Evaluación competencial por alumno — T2",        estado: "listo" },
                  { nombre: "Rúbricas de evaluación — todas las tareas",      estado: "listo" },
                  { nombre: "Informe de atención a la diversidad",            estado: "listo" },
                  { nombre: "Actas de evaluación del claustro — T2",          estado: "pendiente" },
                  { nombre: "Memoria anual 2025-26",                          estado: "pendiente" },
                ].map((doc) => (
                  <div key={doc.nombre} className="flex items-center gap-3 bg-background rounded-xl p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.estado === "listo" ? "bg-success-light" : "bg-warning-light"}`}>
                      {doc.estado === "listo"
                        ? <Download size={13} className="text-success" />
                        : <Clock size={13} className="text-warning" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-text-primary leading-snug truncate">{doc.nombre}</p>
                      <span className={`text-[9px] font-bold ${doc.estado === "listo" ? "text-success" : "text-warning"}`}>
                        {doc.estado === "listo" ? "Disponible para descarga" : "Pendiente de preparar"}
                      </span>
                    </div>
                    {doc.estado === "listo" && (
                      <button className="text-text-muted hover:text-accent-text transition-colors cursor-pointer flex-shrink-0">
                        <Download size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── TAB: MÉTRICAS (A8 — AdminMetricas) ─── */}
      {activeView === "metrics" && (() => {
        const riesgoAlumnos = [
          { nombre: "Pablo Ruiz",     curso: "1º ESO", racha: 0,  evidencias: 2,  score: 15, nivel: "Alto" },
          { nombre: "Tomás Herrera",  curso: "2º ESO", racha: 2,  evidencias: 6,  score: 32, nivel: "Medio" },
          { nombre: "Carmen Vega",    curso: "1º ESO", racha: 5,  evidencias: 10, score: 64, nivel: "Bajo" },
        ];
        const engagementSemanal = [
          { semana: "Sem 1 Feb", activos: 68, total: 12 },
          { semana: "Sem 2 Feb", activos: 75, total: 12 },
          { semana: "Sem 3 Feb", activos: 72, total: 12 },
          { semana: "Sem 1 Mar", activos: 78, total: 12 },
        ];
        const comparativaColegios = [
          { nombre: "QHUMA Málaga", retencion: 96, engagement: 78, evidencias: 66, lomloe: 89 },
          { nombre: "QHUMA Madrid", retencion: 91, engagement: 71, evidencias: 58, lomloe: 83 },
        ];
        const metricas = [
          { nombre: "Retención", max: 100, color: "bg-success" },
          { nombre: "Engagement", max: 100, color: "bg-accent-text" },
          { nombre: "Evidencias %", max: 100, color: "bg-warning" },
          { nombre: "Cumpl. LOMLOE", max: 100, color: "bg-sidebar" },
        ];
        const riesgoNivelCfg: Record<string, { bg: string; text: string }> = {
          Alto:  { bg: "bg-urgent-light",  text: "text-urgent" },
          Medio: { bg: "bg-warning-light", text: "text-warning" },
          Bajo:  { bg: "bg-accent-light",  text: "text-accent-text" },
        };

        return (
          <div className="space-y-5">
            {/* KPIs globales */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Tasa de retención",    valor: "96%",  sub: "+2% vs trimestre anterior", bg: "bg-success-light", textV: "text-success" },
                { label: "Engagement semanal",    valor: "78%",  sub: "Alumnos activos hoy",       bg: "bg-accent-light",  textV: "text-accent-text" },
                { label: "Cumplimiento LOMLOE",   valor: "89%",  sub: "8 competencias evaluadas",  bg: "bg-card",          textV: "text-text-primary" },
                { label: "Alumnos en riesgo",     valor: "3",    sub: "Scoring < 40 — intervenir", bg: "bg-urgent-light",  textV: "text-urgent" },
              ].map((k) => (
                <div key={k.label} className={`${k.bg} rounded-2xl border border-card-border p-4`}>
                  <p className={`text-[28px] font-bold ${k.textV} leading-none mb-1`}>{k.valor}</p>
                  <p className="text-[11px] font-semibold text-text-primary">{k.label}</p>
                  <p className="text-[10px] text-text-muted">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Comparativa entre colegios + Engagement semanal */}
            <div className="flex gap-5">
              {/* Comparativa */}
              <div className="flex-1 bg-card rounded-2xl border border-card-border p-5">
                <h3 className="text-[14px] font-semibold text-text-primary mb-4">Comparativa entre colegios QHUMA</h3>
                <div className="flex flex-col gap-4">
                  {metricas.map((metrica, mi) => {
                    const vals = comparativaColegios.map((c) => {
                      const arr = [c.retencion, c.engagement, c.evidencias, c.lomloe];
                      return arr[mi];
                    });
                    return (
                      <div key={metrica.nombre}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-text-secondary">{metrica.nombre}</span>
                        </div>
                        {comparativaColegios.map((col, ci) => (
                          <div key={col.nombre} className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-text-muted w-28 truncate">{col.nombre.replace("QHUMA ", "")}</span>
                            <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
                              <div
                                className={`h-full rounded-full ${metrica.color}`}
                                style={{ width: `${vals[ci]}%`, opacity: ci === 0 ? 1 : 0.6 }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-text-primary w-8 text-right">{vals[ci]}%</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Engagement semanal */}
              <div className="w-[280px] flex-shrink-0 bg-card rounded-2xl border border-card-border p-5">
                <h3 className="text-[14px] font-semibold text-text-primary mb-1">Engagement semanal</h3>
                <p className="text-[11px] text-text-muted mb-4">% alumnos activos por semana</p>
                <div className="flex items-end gap-3 h-32">
                  {engagementSemanal.map((sem) => {
                    const pct = Math.round((sem.activos / 100) * 100);
                    return (
                      <div key={sem.semana} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-accent-text">{sem.activos}%</span>
                        <div className="w-full bg-background rounded-t-lg overflow-hidden flex-1 flex items-end">
                          <div
                            className="w-full bg-accent-text/80 rounded-t-lg transition-all"
                            style={{ height: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[8px] text-text-muted text-center leading-tight">
                          {sem.semana.replace("Sem ", "S").replace(" Feb", "F").replace(" Mar", "M")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Riesgo de abandono */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-warning" />
                <h3 className="text-[14px] font-semibold text-text-primary">Predicción de riesgo de abandono</h3>
                <span className="ml-auto text-[10px] text-text-muted bg-background px-2.5 py-1 rounded-full">
                  Scoring: racha × 3 + evidencias × 4 (máx 100)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-card-border">
                      {["Alumno", "Curso", "Racha (días)", "Evidencias", "Score riesgo", "Nivel", "Acción"].map((h) => (
                        <th key={h} className="text-left text-[10px] font-bold text-text-muted uppercase tracking-wide py-2 px-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riesgoAlumnos.map((al) => {
                      const cfg = riesgoNivelCfg[al.nivel];
                      return (
                        <tr key={al.nombre} className="border-b border-card-border/50 hover:bg-background transition-colors">
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                                {al.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="text-[11px] font-medium text-text-primary">{al.nombre}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-[11px] text-text-muted">{al.curso}</td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[12px] font-bold ${al.racha === 0 ? "text-urgent" : al.racha < 5 ? "text-warning" : "text-success"}`}>
                              {al.racha}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-12 h-1.5 bg-background rounded-full overflow-hidden">
                                <div className="h-full bg-accent-text rounded-full" style={{ width: `${(al.evidencias / 16) * 100}%` }} />
                              </div>
                              <span className="text-[10px] text-text-secondary">{al.evidencias}/16</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-14 h-2 bg-background rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${al.score < 30 ? "bg-urgent" : al.score < 50 ? "bg-warning" : "bg-success"}`}
                                  style={{ width: `${al.score}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-text-primary">{al.score}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                              {al.nivel}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <button className="text-[10px] font-medium text-accent-text hover:underline cursor-pointer">
                              {al.nivel === "Alto" ? "Intervenir ahora" : al.nivel === "Medio" ? "Hacer seguimiento" : "Monitorear"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-card-border">
                <p className="text-[11px] text-text-muted leading-relaxed">
                  <strong className="text-text-secondary">Metodología scoring:</strong> Racha de días activos × 3 + Evidencias entregadas × 4. Score {"<"} 30 = riesgo alto (contacto inmediato), 30-50 = riesgo medio (seguimiento semanal), {">"} 50 = riesgo bajo.
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
