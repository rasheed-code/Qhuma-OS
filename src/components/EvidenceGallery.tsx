"use client";

import { useState } from "react";
import {
  GalleryHorizontalEnd,
  CheckCircle2,
  Clock,
  Upload,
  Plus,
  FileSpreadsheet,
  FileText,
  Image,
  LayoutTemplate,
  GitBranch,
  Globe,
  Star,
  TrendingUp,
  Filter,
  Download,
  Eye,
} from "lucide-react";

type EvidenceStatus = "aprobada" | "entregada" | "pendiente";
type EvidenceSubject = "Matemáticas" | "Lengua" | "Inglés" | "Ciencias Sociales" | "Tecnología" | "Arte";
type EvidenceType = "spreadsheet" | "document" | "infographic" | "floor_plan" | "brand_board" | "diagram" | "landing_page";

interface Evidence {
  id: string;
  title: string;
  description: string;
  subject: EvidenceSubject;
  type: EvidenceType;
  status: EvidenceStatus;
  date: string;
  task: string;
  xpEarned: number;
  grade?: number; // LOMLOE 1-4
  teacherComment?: string;
}

const evidences: Evidence[] = [
  {
    id: "e1",
    title: "Hoja de análisis de mercado",
    description: "5 listings de Airbnb analizados con precios, valoraciones y amenities.",
    subject: "Matemáticas",
    type: "spreadsheet",
    status: "aprobada",
    date: "3 mar",
    task: "Lunes · Investigación",
    xpEarned: 80,
    grade: 4,
    teacherComment: "Análisis muy completo. Excelente uso de fórmulas.",
  },
  {
    id: "e2",
    title: "Infografía perfil del visitante",
    description: "Visualización del perfil turístico de Málaga con datos reales del INE.",
    subject: "Ciencias Sociales",
    type: "infographic",
    status: "aprobada",
    date: "3 mar",
    task: "Lunes · Datos turísticos",
    xpEarned: 75,
    grade: 4,
    teacherComment: "Diseño claro y datos bien seleccionados.",
  },
  {
    id: "e3",
    title: "Comparativa de precios por temporada",
    description: "Tabla comparativa de 4 tipos de alojamiento en alta y baja temporada.",
    subject: "Matemáticas",
    type: "spreadsheet",
    status: "aprobada",
    date: "3 mar",
    task: "Lunes · Análisis de precios",
    xpEarned: 70,
    grade: 3,
    teacherComment: "Buena estructura. Añade porcentajes de variación.",
  },
  {
    id: "e4",
    title: "Checklist de requisitos legales",
    description: "Normativa VFT de Andalucía: registro, seguridad y certificados.",
    subject: "Ciencias Sociales",
    type: "document",
    status: "aprobada",
    date: "3 mar",
    task: "Lunes · Marco legal",
    xpEarned: 65,
    grade: 4,
    teacherComment: "Investigación rigurosa. Muy bien.",
  },
  {
    id: "e5",
    title: "Canvas del concepto Casa Limón",
    description: "Propuesta única de valor, cliente objetivo y precio estimado.",
    subject: "Lengua",
    type: "document",
    status: "aprobada",
    date: "3 mar",
    task: "Lunes · Concepto",
    xpEarned: 80,
    grade: 4,
    teacherComment: "Concepto original y bien argumentado.",
  },
  {
    id: "e6",
    title: "Reflexión Día 1 — Portfolio",
    description: "Entrada de diario sobre los aprendizajes del primer día de proyecto.",
    subject: "Lengua",
    type: "document",
    status: "aprobada",
    date: "3 mar",
    task: "Lunes · Reflexión",
    xpEarned: 50,
    grade: 3,
  },
  {
    id: "e7",
    title: "Plano digital del apartamento",
    description: "Distribución optimizada: salón, dormitorio, cocina, baño y terraza.",
    subject: "Tecnología",
    type: "floor_plan",
    status: "aprobada",
    date: "4 mar",
    task: "Martes · Diseño espacial",
    xpEarned: 90,
    grade: 4,
    teacherComment: "Uso excelente del espacio. La terraza es un gran diferenciador.",
  },
  {
    id: "e8",
    title: "Presupuesto de puesta en marcha",
    description: "4 categorías: mobiliario, decoración, legal y fotografía con prioridades.",
    subject: "Matemáticas",
    type: "spreadsheet",
    status: "aprobada",
    date: "4 mar",
    task: "Martes · Finanzas",
    xpEarned: 85,
    grade: 4,
  },
  {
    id: "e9",
    title: "Brand board Casa Limón",
    description: "Identidad visual: paleta de colores, tipografía y logo circular.",
    subject: "Arte",
    type: "brand_board",
    status: "aprobada",
    date: "4 mar",
    task: "Martes · Identidad visual",
    xpEarned: 90,
    grade: 4,
    teacherComment: "¡El amarillo y azul funcionan perfecto para Málaga!",
  },
  {
    id: "e10",
    title: "Customer journey map",
    description: "Mapa de 5 etapas del huésped: Descubrir → Reservar → Llegar → Estancia → Reseña.",
    subject: "Ciencias Sociales",
    type: "diagram",
    status: "entregada",
    date: "4 mar",
    task: "Martes · Experiencia cliente",
    xpEarned: 0,
  },
  {
    id: "e11",
    title: "Descripción del listing (500+ palabras)",
    description: "Texto completo en inglés del anuncio de Casa Limón para Airbnb.",
    subject: "Inglés",
    type: "document",
    status: "entregada",
    date: "4 mar",
    task: "Martes · Copywriting",
    xpEarned: 0,
  },
  {
    id: "e12",
    title: "Landing page — casalimon.qhuma.dev",
    description: "Página web con hero, amenities, galería, ubicación y botón de reserva.",
    subject: "Tecnología",
    type: "landing_page",
    status: "pendiente",
    date: "5 mar",
    task: "Miércoles · Desarrollo web",
    xpEarned: 0,
  },
];

const subjectConfig: Record<EvidenceSubject, { bg: string; text: string }> = {
  Matemáticas:      { bg: "bg-accent-light",   text: "text-accent-text" },
  Lengua:           { bg: "bg-warning-light",   text: "text-text-primary" },
  Inglés:           { bg: "bg-success-light",   text: "text-text-primary" },
  "Ciencias Sociales": { bg: "bg-accent-light", text: "text-accent-text" },
  Tecnología:       { bg: "bg-background",      text: "text-text-primary" },
  Arte:             { bg: "bg-urgent-light",     text: "text-text-primary" },
};

const typeConfig: Record<EvidenceType, { icon: typeof FileText; previewBg: string; label: string }> = {
  spreadsheet:  { icon: FileSpreadsheet, previewBg: "bg-success-light",  label: "Hoja de cálculo" },
  document:     { icon: FileText,        previewBg: "bg-background",     label: "Documento" },
  infographic:  { icon: Image,           previewBg: "bg-accent-light",   label: "Infografía" },
  floor_plan:   { icon: LayoutTemplate,  previewBg: "bg-warning-light",  label: "Plano" },
  brand_board:  { icon: Star,            previewBg: "bg-urgent-light",   label: "Brand board" },
  diagram:      { icon: GitBranch,       previewBg: "bg-accent-light",   label: "Diagrama" },
  landing_page: { icon: Globe,           previewBg: "bg-sidebar",        label: "Web" },
};

const statusConfig = {
  aprobada:  { label: "Aprobada",   icon: CheckCircle2, bg: "bg-success-light",  text: "text-success",      border: "border-success/20" },
  entregada: { label: "Entregada",  icon: Upload,       bg: "bg-accent-light",   text: "text-accent-text",  border: "border-accent-text/20" },
  pendiente: { label: "Pendiente",  icon: Clock,        bg: "bg-warning-light",  text: "text-text-primary", border: "border-warning/20" },
};

const gradeLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Iniciado",    color: "text-urgent" },
  2: { label: "En proceso",  color: "text-warning" },
  3: { label: "Adquirido",   color: "text-accent-text" },
  4: { label: "Avanzado",    color: "text-success" },
};

type FilterTab = "todas" | "aprobada" | "entregada" | "pendiente";

export default function EvidenceGallery() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("todas");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeFilter === "todas"
    ? evidences
    : evidences.filter((e) => e.status === activeFilter);

  const counts = {
    todas:     evidences.length,
    aprobada:  evidences.filter((e) => e.status === "aprobada").length,
    entregada: evidences.filter((e) => e.status === "entregada").length,
    pendiente: evidences.filter((e) => e.status === "pendiente").length,
  };

  const totalXP = evidences.reduce((acc, e) => acc + e.xpEarned, 0);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "todas",     label: `Todas (${counts.todas})` },
    { key: "aprobada",  label: `Aprobadas (${counts.aprobada})` },
    { key: "entregada", label: `Entregadas (${counts.entregada})` },
    { key: "pendiente", label: `Pendientes (${counts.pendiente})` },
  ];

  return (
    <div className="flex gap-5">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GalleryHorizontalEnd size={18} className="text-accent-text" />
              <h1 className="text-[22px] font-bold text-text-primary">Mis Evidencias</h1>
            </div>
            <p className="text-[13px] text-text-secondary">
              Proyecto: <span className="font-medium text-accent-text">Gestiona tu Airbnb en Málaga</span> · Semana 3 de 12
            </p>
          </div>
          <button className="flex items-center gap-2 bg-accent text-sidebar text-[12px] font-bold px-4 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer">
            <Plus size={14} />
            Añadir evidencia
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-background rounded-xl p-3 text-center">
            <span className="text-[22px] font-bold text-text-primary block">{counts.todas}</span>
            <span className="text-[10px] text-text-muted">Total evidencias</span>
          </div>
          <div className="bg-success-light rounded-xl p-3 text-center">
            <span className="text-[22px] font-bold text-success block">{counts.aprobada}</span>
            <span className="text-[10px] text-text-muted">Aprobadas</span>
          </div>
          <div className="bg-warning-light rounded-xl p-3 text-center">
            <span className="text-[22px] font-bold text-text-primary block">{counts.entregada}</span>
            <span className="text-[10px] text-text-muted">En revisión</span>
          </div>
          <div className="bg-accent-light rounded-xl p-3 text-center">
            <span className="text-[22px] font-bold text-accent-text block">{totalXP}</span>
            <span className="text-[10px] text-text-muted">XP ganado</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                activeFilter === tab.key
                  ? "bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Evidence grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((ev) => {
            const subj = subjectConfig[ev.subject];
            const type = typeConfig[ev.type];
            const status = statusConfig[ev.status];
            const StatusIcon = status.icon;
            const TypeIcon = type.icon;
            const isExpanded = expandedId === ev.id;

            return (
              <div
                key={ev.id}
                className={`bg-card border border-card-border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isExpanded ? "col-span-2" : ""
                }`}
              >
                {/* Preview thumbnail */}
                <div
                  className={`h-[72px] ${type.previewBg} flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    {ev.type === "spreadsheet" && (
                      <div className="grid grid-cols-6 grid-rows-4 h-full gap-px">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="bg-current" />
                        ))}
                      </div>
                    )}
                    {ev.type === "landing_page" && (
                      <div className="flex flex-col gap-1 p-3">
                        <div className="h-3 bg-white/30 rounded w-3/4" />
                        <div className="h-2 bg-white/20 rounded w-1/2" />
                        <div className="h-1.5 bg-white/10 rounded w-2/3 mt-1" />
                      </div>
                    )}
                  </div>
                  <TypeIcon
                    size={28}
                    className={
                      ev.type === "landing_page"
                        ? "text-white/70 relative z-10"
                        : "text-text-secondary/40 relative z-10"
                    }
                  />
                  {/* Grade badge on thumbnail */}
                  {ev.grade && (
                    <div className="absolute top-2 right-2 bg-card/90 rounded-lg px-2 py-0.5 flex items-center gap-1">
                      <span className={`text-[10px] font-bold ${gradeLabels[ev.grade].color}`}>
                        {ev.grade}/4
                      </span>
                      <span className="text-[9px] text-text-muted">{gradeLabels[ev.grade].label}</span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4">
                  {/* Subject + type row */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${subj.bg} ${subj.text}`}>
                      {ev.subject}
                    </span>
                    <span className="text-[9px] text-text-muted">{type.label}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[13px] font-semibold text-text-primary leading-snug mb-1">
                    {ev.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                    {ev.description}
                  </p>

                  {/* Task + date */}
                  <div className="text-[10px] text-text-muted mb-3">
                    {ev.task} · {ev.date}
                  </div>

                  {/* Status + XP row */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${status.bg} ${status.border}`}>
                      <StatusIcon size={11} className={status.text} />
                      <span className={`text-[10px] font-semibold ${status.text}`}>{status.label}</span>
                    </div>
                    {ev.xpEarned > 0 ? (
                      <div className="flex items-center gap-1">
                        <TrendingUp size={11} className="text-accent-text" />
                        <span className="text-[11px] font-bold text-accent-text">+{ev.xpEarned} XP</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-text-muted">XP pendiente</span>
                    )}
                  </div>

                  {/* Expanded: teacher comment */}
                  {isExpanded && ev.teacherComment && (
                    <div className="mt-3 bg-accent-light rounded-xl p-3 border border-accent-text/10">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-sidebar flex items-center justify-center">
                          <span className="text-accent text-[7px] font-bold">A</span>
                        </div>
                        <span className="text-[10px] font-semibold text-accent-text">Profa. Martínez</span>
                      </div>
                      <p className="text-[12px] text-text-primary leading-relaxed">"{ev.teacherComment}"</p>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-card-border">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-accent-text hover:text-sidebar transition-colors cursor-pointer"
                    >
                      <Eye size={12} />
                      {isExpanded ? "Ocultar" : "Ver detalle"}
                    </button>
                    <button className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted hover:text-text-secondary transition-colors cursor-pointer ml-auto">
                      <Download size={12} />
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-3">
              <GalleryHorizontalEnd size={22} className="text-text-muted" />
            </div>
            <p className="text-[14px] font-semibold text-text-primary mb-1">Sin evidencias aquí</p>
            <p className="text-[12px] text-text-secondary">Cambia el filtro o añade una nueva evidencia.</p>
          </div>
        )}
      </div>

      {/* Right panel — Project summary */}
      <div className="w-[260px] flex-shrink-0 flex flex-col gap-4">
        {/* Progress summary */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">Progreso del proyecto</h3>
          </div>

          {/* Circular progress */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#ededed" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke="#c3f499" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32 * 0.75} ${2 * Math.PI * 32}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[18px] font-bold text-text-primary">75%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Evidencias entregadas</span>
              <span className="font-semibold text-text-primary">9 / 12</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Aprobadas</span>
              <span className="font-semibold text-success">{counts.aprobada}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">XP total acumulado</span>
              <span className="font-semibold text-accent-text">{totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Subjects breakdown */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-text-primary" />
            <h3 className="text-[13px] font-semibold text-text-primary">Por asignatura</h3>
          </div>
          <div className="space-y-2.5">
            {(
              [
                { subject: "Matemáticas",      count: 3, approved: 3 },
                { subject: "Lengua",            count: 2, approved: 2 },
                { subject: "Ciencias Sociales", count: 3, approved: 2 },
                { subject: "Tecnología",        count: 2, approved: 1 },
                { subject: "Inglés",            count: 1, approved: 0 },
                { subject: "Arte",              count: 1, approved: 1 },
              ] as { subject: EvidenceSubject; count: number; approved: number }[]
            ).map(({ subject, count, approved }) => {
              const subj = subjectConfig[subject];
              const pct = Math.round((approved / count) * 100);
              return (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${subj.bg} ${subj.text}`}>
                      {subject}
                    </span>
                    <span className="text-[10px] text-text-muted">{approved}/{count}</span>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next evidence due */}
        <div className="bg-warning-light border border-warning/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={13} className="text-text-primary" />
            <span className="text-[12px] font-semibold text-text-primary">Próxima entrega</span>
          </div>
          <p className="text-[12px] text-text-primary font-medium mb-0.5">Landing page completa</p>
          <p className="text-[11px] text-text-secondary mb-3">Miércoles 5 mar · 16:00</p>
          <div className="h-1.5 bg-warning/20 rounded-full overflow-hidden">
            <div className="h-full bg-warning rounded-full" style={{ width: "40%" }} />
          </div>
          <p className="text-[9px] text-text-muted mt-1.5">40% completado</p>
        </div>
      </div>
    </div>
  );
}
