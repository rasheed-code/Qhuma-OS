"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Plus,
  Upload,
  Link,
  FileText,
  Loader2,
  Sparkles,
  Clock,
  ListChecks,
  BarChart3,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  RefreshCw,
  Send,
  Rocket,
  AlertCircle,
  X,
  BookOpen,
  Target,
  Users,
  Lightbulb,
  Trophy,
  Brain,
  Globe,
  Pencil,
  CalendarDays,
  Star,
  ChevronRight,
  Eye,
  Zap,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { trimesterProjects } from "@/data/tasks";
import { competencies as allCompetencies } from "@/data/competencies";
import { GeneratedProject, SourceAnalysis } from "@/data/projectGenerator";

type WizardStep = "list" | "input" | "processing" | "source_preview" | "proposals" | "detail" | "edit" | "deploy" | "deployed";
type InputTab = "upload" | "url" | "describe";

interface TeacherProjectsProps {
  onNavigateToDashboard: () => void;
}

const statusColors: Record<string, string> = {
  active: "bg-accent/15 text-accent-text",
  upcoming: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
};

const difficultyConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Básico: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Intermedio: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Avanzado: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  // legacy English
  Beginner: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Intermediate: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Advanced: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const bloomColors: Record<string, string> = {
  Recordar: "bg-slate-100 text-slate-600",
  Comprender: "bg-blue-50 text-blue-600",
  Aplicar: "bg-green-50 text-green-600",
  Analizar: "bg-amber-50 text-amber-600",
  Evaluar: "bg-purple-50 text-purple-600",
  Crear: "bg-pink-50 text-pink-600",
};

const groupingLabels: Record<string, string> = {
  individual: "Individual",
  pairs: "Parejas",
  small_group: "Grupo pequeño",
  full_class: "Gran grupo",
};

const groupingIcons: Record<string, string> = {
  individual: "👤",
  pairs: "👥",
  small_group: "👥👥",
  full_class: "🏫",
};

const processingPhases = [
  { msg: "Leyendo el documento curricular...", icon: "📄" },
  { msg: "Extrayendo objetivos de aprendizaje...", icon: "🎯" },
  { msg: "Identificando temas y vocabulario clave...", icon: "🔍" },
  { msg: "Mapeando competencias LOMLOE...", icon: "📊" },
  { msg: "Diseñando proyectos del mundo real...", icon: "🌍" },
  { msg: "Generando tareas y evidencias...", icon: "✍️" },
  { msg: "Creando rúbricas de evaluación...", icon: "📋" },
  { msg: "Finalizando propuestas...", icon: "✨" },
];

const gradeOptions = ["1º ESO", "2º ESO", "3º ESO", "4º ESO", "1º Bachillerato", "2º Bachillerato"];
const durationOptions = ["1 semana", "2 semanas", "3 semanas", "4 semanas"];
const bloomOptions = ["Cualquiera", "Recordar y Comprender", "Aplicar y Analizar", "Evaluar y Crear"];
const groupingOptions = ["Mixto", "Individual", "Parejas", "Grupos pequeños", "Gran grupo"];
const modalityOptions = ["Presencial", "Híbrida", "Online"];
const projectStyleOptions = ["Cualquiera", "Investigación y presentación", "Producto/prototipo", "Campaña o evento", "Emprendimiento", "Resolución de problema real"];

const subjectChips = [
  "Matemáticas", "Lengua Castellana", "Ciencias Naturales", "Historia", "Geografía",
  "Inglés", "Tecnología", "Arte", "Música", "Educación Física",
  "Biología", "Física y Química", "Economía", "Filosofía",
];

export default function TeacherProjects({ onNavigateToDashboard }: TeacherProjectsProps) {
  const [step, setStep] = useState<WizardStep>("list");
  const [inputTab, setInputTab] = useState<InputTab>("upload");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [processingPhaseIndex, setProcessingPhaseIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<GeneratedProject | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));
  const [expandedRubric, setExpandedRubric] = useState(false);
  const [refinementText, setRefinementText] = useState("");
  const [activeProposalTab, setActiveProposalTab] = useState<"overview" | "tasks" | "rubric">("overview");
  const [editedProject, setEditedProject] = useState<GeneratedProject | null>(null);

  // Input state
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [gradeLevel, setGradeLevel] = useState("1º ESO");
  const [durationWeeks, setDurationWeeks] = useState("2 semanas");
  const [bloomFocus, setBloomFocus] = useState("Cualquiera");
  const [grouping, setGrouping] = useState("Mixto");
  const [modality, setModality] = useState("Presencial");
  const [projectStyle, setProjectStyle] = useState("Cualquiera");
  const [extraContext, setExtraContext] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Deploy state
  const [deployDate, setDeployDate] = useState("");
  const [deployGroups, setDeployGroups] = useState<string[]>(["1º ESO A"]);
  const [enableGamification, setEnableGamification] = useState(true);

  // AI state
  const [generatedProjects, setGeneratedProjects] = useState<GeneratedProject[]>([]);
  const [sourceInfo, setSourceInfo] = useState<SourceAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Processing animation
  useEffect(() => {
    if (step !== "processing") return;
    const interval = setInterval(() => {
      setProcessingPhaseIndex((prev) => (prev + 1) % processingPhases.length);
    }, 900);
    return () => clearInterval(interval);
  }, [step]);

  const callGenerateAPI = useCallback(async (extraRefinement?: string) => {
    setError(null);
    setProcessingPhaseIndex(0);
    setStep("processing");

    const formData = new FormData();
    if (inputTab === "upload" && file) {
      formData.append("file", file);
    } else if (inputTab === "url" && urlInput.trim()) {
      formData.append("url", urlInput.trim());
    } else if (inputTab === "describe" && descriptionInput.trim()) {
      formData.append("description", descriptionInput.trim());
    } else {
      setError("Por favor, proporciona un archivo PDF, URL o descripción antes de generar.");
      setStep("input");
      return;
    }

    formData.append("grade", gradeLevel);
    formData.append("duration", durationWeeks);
    if (selectedSubjects.length > 0) formData.append("subjects", selectedSubjects.join(", "));
    if (bloomFocus !== "Cualquiera") formData.append("bloomFocus", bloomFocus);
    if (grouping !== "Mixto") formData.append("grouping", grouping);
    if (modality !== "Presencial") formData.append("modality", modality);
    if (projectStyle !== "Cualquiera") formData.append("projectStyle", projectStyle);
    if (extraContext.trim()) formData.append("extraContext", extraContext.trim());
    if (extraRefinement) formData.append("refinement", extraRefinement);

    try {
      abortControllerRef.current = new AbortController();
      const res = await fetch("/api/generate-projects", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar proyectos");
      setGeneratedProjects(data.projects);
      setSourceInfo(data.sourceAnalysis);
      setStep("source_preview");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Algo salió mal. Inténtalo de nuevo.");
      setStep("input");
    }
  }, [inputTab, file, urlInput, descriptionInput, gradeLevel, durationWeeks, selectedSubjects, bloomFocus, grouping, modality, projectStyle, extraContext]);

  const toggleSubject = (s: string) =>
    setSelectedSubjects((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleWeek = (w: number) =>
    setExpandedWeeks((prev) => { const n = new Set(prev); n.has(w) ? n.delete(w) : n.add(w); return n; });

  const getCompetencyColor = (key: string) => allCompetencies.find((c) => c.key === key)?.color ?? "#94a3b8";
  const getCompetencyName = (key: string) => allCompetencies.find((c) => c.key === key)?.shortName ?? key;
  const getCompetencyFullName = (key: string) => allCompetencies.find((c) => c.key === key)?.name ?? key;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const diffCfg = (d: string) => difficultyConfig[d] ?? { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" };

  // ── LIST ──────────────────────────────────────────────────
  if (step === "list") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-text-primary">Proyectos del Trimestre</h1>
            <p className="text-[13px] text-text-secondary mt-0.5">Gestiona y crea proyectos ABP para tu clase</p>
          </div>
          <button
            onClick={() => { setError(null); setStep("input"); }}
            className="flex items-center gap-2 bg-sidebar text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer shadow-sm"
          >
            <Sparkles size={15} />
            Crear con IA
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Proyectos activos", value: trimesterProjects.filter(p => p.status === "active").length, color: "text-accent-text", icon: Zap },
            { label: "Completados", value: trimesterProjects.filter(p => p.status === "completed").length, color: "text-emerald-600", icon: CheckCircle2 },
            { label: "Próximos", value: trimesterProjects.filter(p => p.status === "upcoming").length, color: "text-blue-600", icon: CalendarDays },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl border border-card-border p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center">
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-[20px] font-bold text-text-primary">{stat.value}</p>
                <p className="text-[11px] text-text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {trimesterProjects.map((project) => (
            <div key={project.id} className="bg-card rounded-2xl p-5 border border-card-border hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-text-primary group-hover:text-sidebar transition-colors">
                  {project.name}
                </h3>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColors[project.status]}`}>
                  {project.status === "active" ? "Activo" : project.status === "completed" ? "Completado" : "Próximo"}
                </span>
              </div>
              <p className="text-[12px] text-text-muted mb-4 leading-relaxed">{project.description}</p>
              <div className="flex items-center justify-between text-[11px] text-text-secondary mb-2">
                <span className="flex items-center gap-1"><CalendarDays size={12} />{project.weeks}</span>
                <span className="font-semibold">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%`, backgroundColor: project.progress > 0 ? "#2f574d" : "#e5e7eb" }}
                />
              </div>
            </div>
          ))}

          {/* New project CTA card */}
          <button
            onClick={() => { setError(null); setStep("input"); }}
            className="bg-card rounded-2xl p-5 border-2 border-dashed border-card-border hover:border-sidebar/40 hover:bg-sidebar/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-xl bg-sidebar/10 flex items-center justify-center">
              <Sparkles size={20} className="text-sidebar" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-sidebar">Crear nuevo proyecto</p>
              <p className="text-[12px] text-text-muted mt-0.5">Sube un PDF, pega una URL o describe el tema</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ── INPUT ─────────────────────────────────────────────────
  if (step === "input") {
    return (
      <div className="max-w-2xl">
        <button onClick={() => setStep("list")} className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer">
          <ArrowLeft size={16} />Volver a Proyectos
        </button>

        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-text-primary">Crear Proyecto con IA</h1>
          <p className="text-[13px] text-text-secondary mt-1">Sube tu material curricular y la IA diseñará 3 proyectos ABP perfectos para tu clase.</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-[13px] text-red-700 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="cursor-pointer"><X size={14} className="text-red-400" /></button>
          </div>
        )}

        {/* STEP 1: Source */}
        <div className="bg-card rounded-2xl border border-card-border p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[11px] font-bold flex items-center justify-center">1</div>
            <h3 className="text-[14px] font-semibold text-text-primary">Fuente del contenido</h3>
          </div>

          <div className="flex gap-1 bg-background rounded-xl p-1 mb-5 w-fit">
            {([
              { key: "upload" as InputTab, label: "Subir archivo", icon: Upload },
              { key: "url" as InputTab, label: "Pegar URL", icon: Link },
              { key: "describe" as InputTab, label: "Describir", icon: FileText },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setInputTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                  inputTab === tab.key ? "bg-card text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <tab.icon size={14} />{tab.label}
              </button>
            ))}
          </div>

          {inputTab === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-sidebar/40 hover:bg-sidebar/3 transition-colors cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="absolute w-0 h-0 opacity-0 overflow-hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
              />
              {file ? (
                <>
                  <CheckCircle2 size={32} className="mx-auto text-sidebar mb-3" />
                  <p className="text-[14px] font-semibold text-text-primary mb-1">{file.name}</p>
                  <p className="text-[12px] text-text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB — pulsa para cambiar</p>
                </>
              ) : (
                <>
                  <Upload size={32} className="mx-auto text-text-muted mb-3" />
                  <p className="text-[14px] font-semibold text-text-primary mb-1">Arrastra tu PDF curricular aquí</p>
                  <p className="text-[12px] text-text-muted">o pulsa para buscar — soporta PDF, DOCX, TXT</p>
                </>
              )}
            </div>
          )}
          {inputTab === "url" && (
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-2 block">URL del currículo o sílabo</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.educacion.es/curriculo/eso/matematicas..."
                className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary placeholder-text-muted bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 focus:border-sidebar"
              />
            </div>
          )}
          {inputTab === "describe" && (
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-2 block">Describe el contenido o tema de aprendizaje</label>
              <textarea
                rows={4}
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                placeholder="Ej: Unidad 4 de Matemáticas 2º ESO — Funciones lineales y cuadráticas. Los alumnos deben aprender a representar gráficas, interpretar pendiente e intersección, y aplicar funciones a situaciones cotidianas como costes o velocidad..."
                className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary placeholder-text-muted bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 focus:border-sidebar resize-none"
              />
            </div>
          )}
        </div>

        {/* STEP 2: Basic Parameters */}
        <div className="bg-card rounded-2xl border border-card-border p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[11px] font-bold flex items-center justify-center">2</div>
            <h3 className="text-[14px] font-semibold text-text-primary">Parámetros básicos</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-2 block">Curso</label>
              <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer">
                {gradeOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-2 block">Duración</label>
              <select value={durationWeeks} onChange={(e) => setDurationWeeks(e.target.value)} className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer">
                {durationOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-text-secondary mb-2 block">Asignaturas implicadas</label>
            <div className="flex flex-wrap gap-2">
              {subjectChips.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedSubjects.includes(s) ? "bg-sidebar/10 text-sidebar border-sidebar/30" : "border-card-border text-text-secondary hover:border-sidebar/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 3: Advanced pedagogical config */}
        <div className="bg-card rounded-2xl border border-card-border p-6 mb-5">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[11px] font-bold flex items-center justify-center">3</div>
              <h3 className="text-[14px] font-semibold text-text-primary">Configuración pedagógica</h3>
              <span className="text-[11px] text-text-muted bg-background px-2 py-0.5 rounded-full">Opcional</span>
            </div>
            {showAdvanced ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
          </button>

          {showAdvanced && (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-text-secondary mb-2 block flex items-center gap-1">
                    <Brain size={13} />Nivel cognitivo (Bloom)
                  </label>
                  <select value={bloomFocus} onChange={(e) => setBloomFocus(e.target.value)} className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer">
                    {bloomOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-text-secondary mb-2 block flex items-center gap-1">
                    <Users size={13} />Agrupamiento
                  </label>
                  <select value={grouping} onChange={(e) => setGrouping(e.target.value)} className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer">
                    {groupingOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-text-secondary mb-2 block flex items-center gap-1">
                    <Globe size={13} />Modalidad
                  </label>
                  <select value={modality} onChange={(e) => setModality(e.target.value)} className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer">
                    {modalityOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-text-secondary mb-2 block flex items-center gap-1">
                    <Rocket size={13} />Tipo de proyecto
                  </label>
                  <select value={projectStyle} onChange={(e) => setProjectStyle(e.target.value)} className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer">
                    {projectStyleOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-medium text-text-secondary mb-2 block flex items-center gap-1">
                  <Lightbulb size={13} />Contexto adicional para la IA
                </label>
                <textarea
                  rows={2}
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                  placeholder="Ej: Mi clase tiene un 30% de alumnos con NEAE. Estamos cerca de un parque natural. Queremos hacer algo con la comunidad local..."
                  className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary placeholder-text-muted bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => callGenerateAPI()}
          className="flex items-center gap-2 bg-sidebar text-white font-bold text-[14px] px-7 py-3.5 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer shadow-md"
        >
          <Sparkles size={17} />
          Generar 3 Proyectos con IA
        </button>
      </div>
    );
  }

  // ── PROCESSING ────────────────────────────────────────────
  if (step === "processing") {
    const phase = processingPhases[processingPhaseIndex];
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl border border-card-border p-10 text-center max-w-sm w-full">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sidebar to-accent opacity-20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-sidebar to-accent/70 flex items-center justify-center shadow-lg">
              <span className="text-3xl">{phase.icon}</span>
            </div>
          </div>
          <h2 className="text-[17px] font-bold text-text-primary mb-2">Diseñando proyectos ABP</h2>
          <p className="text-[13px] text-text-secondary h-6 transition-all duration-300">{phase.msg}</p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-5">
            {processingPhases.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === processingPhaseIndex
                    ? "w-5 h-2.5 bg-sidebar"
                    : i < processingPhaseIndex
                    ? "w-2.5 h-2.5 bg-sidebar/40"
                    : "w-2.5 h-2.5 bg-card-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── SOURCE PREVIEW ────────────────────────────────────────
  if (step === "source_preview" && sourceInfo) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sidebar/10 flex items-center justify-center">
            <CheckCircle2 size={22} className="text-sidebar" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-text-primary">Análisis completado</h1>
            <p className="text-[13px] text-text-secondary">Esto es lo que la IA encontró en tu material</p>
          </div>
        </div>

        {/* Source card */}
        <div className="bg-sidebar/5 border border-sidebar/20 rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <BookOpen size={20} className="text-sidebar mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-[14px] font-bold text-text-primary mb-1">{sourceInfo.source}</p>
              {sourceInfo.contentSummary && (
                <p className="text-[13px] text-text-secondary leading-relaxed">{sourceInfo.contentSummary}</p>
              )}
            </div>
            {sourceInfo.detectedSubject && (
              <span className="text-[11px] font-semibold bg-sidebar text-white px-3 py-1 rounded-full shrink-0">
                {sourceInfo.detectedSubject}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Topics */}
          <div className="bg-card rounded-2xl border border-card-border p-4 col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Target size={15} className="text-sidebar" />
              <h3 className="text-[12px] font-bold text-text-primary uppercase tracking-wide">Temas detectados</h3>
            </div>
            <ul className="space-y-1.5">
              {sourceInfo.topics.slice(0, 5).map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-sidebar/10 text-sidebar text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Objectives */}
          <div className="bg-card rounded-2xl border border-card-border p-4 col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={15} className="text-sidebar" />
              <h3 className="text-[12px] font-bold text-text-primary uppercase tracking-wide">Objetivos de aprendizaje</h3>
            </div>
            <ul className="space-y-2">
              {sourceInfo.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-text-secondary">
                  <CheckCircle2 size={13} className="text-sidebar shrink-0 mt-0.5" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vocabulary */}
        {sourceInfo.keyVocabulary && sourceInfo.keyVocabulary.length > 0 && (
          <div className="bg-card rounded-2xl border border-card-border p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={15} className="text-sidebar" />
              <h3 className="text-[12px] font-bold text-text-primary uppercase tracking-wide">Vocabulario clave detectado</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {sourceInfo.keyVocabulary.map((v, i) => (
                <span key={i} className="text-[12px] bg-background border border-card-border text-text-secondary px-3 py-1 rounded-full">{v}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("proposals")}
            className="flex items-center gap-2 bg-sidebar text-white font-bold text-[14px] px-6 py-3 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer shadow-md"
          >
            <ChevronRight size={17} />
            Ver los 3 proyectos generados
          </button>
          <button
            onClick={() => setStep("input")}
            className="flex items-center gap-2 border border-card-border text-text-secondary text-[13px] font-medium px-4 py-3 rounded-xl hover:bg-background transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            Regenerar
          </button>
        </div>
      </div>
    );
  }

  // ── PROPOSALS ─────────────────────────────────────────────
  if (step === "proposals") {
    return (
      <div>
        <button onClick={() => setStep("source_preview")} className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer">
          <ArrowLeft size={16} />Volver al análisis
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-text-primary">3 Propuestas de Proyecto</h1>
            {sourceInfo && (
              <p className="text-[13px] text-text-secondary mt-0.5">Basadas en: <span className="font-medium">{sourceInfo.source}</span></p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-muted bg-background border border-card-border px-3 py-1 rounded-full">
              {gradeLevel} · {durationWeeks}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {generatedProjects.map((project, idx) => {
            const cfg = diffCfg(project.difficulty);
            return (
              <div key={project.id} className="bg-card rounded-2xl border border-card-border flex flex-col hover:shadow-md transition-all group">
                {/* Header gradient */}
                <div className="p-5 pb-4 bg-gradient-to-br from-sidebar/8 to-transparent rounded-t-2xl border-b border-card-border">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{project.emoji ?? ["🚀", "🌍", "💡"][idx]}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {project.difficulty}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-text-primary leading-snug mb-2">
                    {project.name}
                  </h3>
                  <p className="text-[12px] text-text-muted leading-relaxed line-clamp-3">{project.description}</p>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-[11px] text-text-secondary">
                    <span className="flex items-center gap-1.5"><Clock size={13} />{project.duration}</span>
                    <span className="flex items-center gap-1.5"><ListChecks size={13} />{project.totalTasks} tareas</span>
                    <span className="flex items-center gap-1.5"><BarChart3 size={13} />{project.competencies.length} comp.</span>
                  </div>

                  {/* Final product */}
                  {project.finalProduct && (
                    <div className="bg-sidebar/5 rounded-xl px-3 py-2.5 mb-4 flex items-start gap-2">
                      <Trophy size={14} className="text-sidebar shrink-0 mt-0.5" />
                      <p className="text-[12px] text-sidebar font-medium leading-snug">{project.finalProduct}</p>
                    </div>
                  )}

                  {/* Competency pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.competencies.map((key) => (
                      <span
                        key={key}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: getCompetencyColor(key) }}
                        title={getCompetencyFullName(key)}
                      >
                        {key}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <ul className="flex-1 mb-4">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-text-secondary mb-1.5">
                        <CheckCircle2 size={12} className="text-sidebar mt-0.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Impact metrics */}
                  {project.impactMetrics && project.impactMetrics.length > 0 && (
                    <div className="bg-background rounded-xl p-3 mb-4 grid grid-cols-2 gap-2">
                      {project.impactMetrics.slice(0, 2).map((m, i) => (
                        <div key={i} className="text-center">
                          <p className="text-[16px] font-black text-sidebar">{m.value}</p>
                          <p className="text-[10px] text-text-muted leading-tight">{m.metric}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Diff tips */}
                  {project.differentiationTips && (
                    <div className="flex gap-2 mb-4">
                      <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        🤝 Apoyo incluido
                      </span>
                      <span className="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                        🚀 Reto extra
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => { setSelectedProject(project); setEditedProject(project); setExpandedWeeks(new Set([1])); setActiveProposalTab("overview"); setStep("detail"); }}
                    className="w-full bg-sidebar text-white font-bold text-[13px] py-2.5 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Eye size={14} />
                    Ver en detalle
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Refinement bar */}
        <div className="bg-card rounded-2xl border border-card-border p-4 flex items-center gap-3">
          <button onClick={() => callGenerateAPI()} className="flex items-center gap-2 border border-card-border text-text-secondary font-medium text-[13px] px-4 py-2.5 rounded-xl hover:bg-background transition-all cursor-pointer whitespace-nowrap">
            <RefreshCw size={14} />Nueva generación
          </button>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={refinementText}
              onChange={(e) => setRefinementText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && refinementText.trim()) { callGenerateAPI(refinementText.trim()); setRefinementText(""); } }}
              placeholder='Ejemplo: "Más enfocado en matemáticas y con producto físico..."'
              className="flex-1 border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary placeholder-text-muted bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20"
            />
            <button
              onClick={() => { if (refinementText.trim()) { callGenerateAPI(refinementText.trim()); setRefinementText(""); } }}
              className="bg-sidebar text-white p-2.5 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── DETAIL ────────────────────────────────────────────────
  if (step === "detail" && selectedProject) {
    const project = editedProject ?? selectedProject;
    const cfg = diffCfg(project.difficulty);
    return (
      <div>
        <button onClick={() => setStep("proposals")} className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer">
          <ArrowLeft size={16} />Volver a propuestas
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-sidebar to-sidebar/80 rounded-2xl p-6 mb-5 text-white">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{project.emoji ?? "🚀"}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>{project.difficulty}</span>
                <span className="text-[11px] text-white/70">{project.duration} · {project.totalTasks} tareas</span>
              </div>
              <h1 className="text-[22px] font-black mb-1">{project.name}</h1>
              <p className="text-[13px] text-white/80 leading-relaxed">{project.description}</p>
            </div>
            <button
              onClick={() => setStep("edit")}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-[12px] font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Pencil size={13} />Editar
            </button>
          </div>
          {/* Real-world info strip */}
          {(project.finalProduct || project.targetAudience || project.realWorldContext) && (
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-[12px]">
              {project.finalProduct && <div><p className="text-white/60 mb-0.5">Producto final</p><p className="font-semibold">{project.finalProduct}</p></div>}
              {project.targetAudience && <div><p className="text-white/60 mb-0.5">Audiencia real</p><p className="font-semibold">{project.targetAudience}</p></div>}
              {project.realWorldContext && <div><p className="text-white/60 mb-0.5">Contexto real</p><p className="font-semibold">{project.realWorldContext}</p></div>}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-5 w-fit">
          {(["overview", "tasks", "rubric"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveProposalTab(tab)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                activeProposalTab === tab ? "bg-card text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab === "overview" ? "Resumen" : tab === "tasks" ? "Tareas" : "Rúbrica"}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeProposalTab === "overview" && (
          <div className="space-y-4">
            {/* Competencies */}
            <div className="bg-card rounded-2xl border border-card-border p-6">
              <h3 className="text-[14px] font-bold text-text-primary mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-sidebar" />Cobertura de Competencias LOMLOE</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {allCompetencies.map((comp, idx) => {
                  const isUsed = project.competencies.includes(comp.key);
                  const seed = (project.id.charCodeAt(project.id.length - 1) * 31 + idx * 17) % 50;
                  const coverage = isUsed ? 45 + seed : 0;
                  return (
                    <div key={comp.key} className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold w-12 ${isUsed ? "text-text-primary" : "text-text-muted"}`}>{comp.key}</span>
                      <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${coverage}%`, backgroundColor: isUsed ? comp.color : "#e5e7eb" }} />
                      </div>
                      <span className="text-[11px] text-text-muted w-8 text-right">{coverage > 0 ? `${coverage}%` : "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly breakdown */}
            <div className="bg-card rounded-2xl border border-card-border p-6">
              <h3 className="text-[14px] font-bold text-text-primary mb-4 flex items-center gap-2"><CalendarDays size={16} className="text-sidebar" />Planificación semanal</h3>
              <div className="space-y-3">
                {project.weeklyBreakdown.map((wb) => (
                  <div key={wb.week} className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-sidebar bg-sidebar/10 px-2.5 py-1.5 rounded-lg whitespace-nowrap">Semana {wb.week}</span>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-text-primary">{wb.phase}</p>
                      {wb.phaseGoal && <p className="text-[11px] text-text-muted">{wb.phaseGoal}</p>}
                    </div>
                    <span className="text-[11px] text-text-muted whitespace-nowrap">{wb.taskCount} tareas</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact metrics */}
            {project.impactMetrics && project.impactMetrics.length > 0 && (
              <div className="bg-card rounded-2xl border border-card-border p-6">
                <h3 className="text-[14px] font-bold text-text-primary mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-sidebar" />Impacto real del proyecto</h3>
                <div className="grid grid-cols-3 gap-4">
                  {project.impactMetrics.map((m, i) => (
                    <div key={i} className="bg-background rounded-xl p-4 text-center">
                      <p className="text-[24px] font-black text-sidebar mb-1">{m.value}</p>
                      <p className="text-[12px] font-semibold text-text-primary">{m.metric}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Differentiation */}
            {project.differentiationTips && (
              <div className="bg-card rounded-2xl border border-card-border p-5">
                <h3 className="text-[14px] font-bold text-text-primary mb-3 flex items-center gap-2"><Users size={16} className="text-sidebar" />Atención a la diversidad</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-[11px] font-bold text-blue-700 mb-1">🤝 Apoyo / Adaptación</p>
                    <p className="text-[12px] text-blue-800 leading-relaxed">{project.differentiationTips.support}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-[11px] font-bold text-purple-700 mb-1">🚀 Ampliación / Reto extra</p>
                    <p className="text-[12px] text-purple-800 leading-relaxed">{project.differentiationTips.extension}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Teacher notes */}
            {project.teacherNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Lightbulb size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-amber-800 mb-0.5">Consejo para el profesor</p>
                  <p className="text-[12px] text-amber-700 leading-relaxed">{project.teacherNotes}</p>
                </div>
              </div>
            )}

            {/* Cross-curricular */}
            {project.crossCurricularLinks && project.crossCurricularLinks.length > 0 && (
              <div className="bg-card rounded-2xl border border-card-border p-4 flex items-center gap-3">
                <Globe size={16} className="text-sidebar shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-text-primary mb-1">Conexiones interdisciplinares</p>
                  <div className="flex flex-wrap gap-2">
                    {project.crossCurricularLinks.map((s, i) => (
                      <span key={i} className="text-[11px] bg-background border border-card-border text-text-secondary px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: TASKS */}
        {activeProposalTab === "tasks" && (
          <div className="bg-card rounded-2xl border border-card-border p-6">
            <h3 className="text-[14px] font-bold text-text-primary mb-4 flex items-center gap-2"><ListChecks size={16} className="text-sidebar" />Tareas por semana</h3>
            {project.weeklyBreakdown.map((wb) => {
              const isExpanded = expandedWeeks.has(wb.week);
              const weekTasks = project.sampleTasks.slice((wb.week - 1) * wb.taskCount, wb.week * wb.taskCount);
              return (
                <div key={wb.week} className="mb-3 last:mb-0">
                  <button
                    onClick={() => toggleWeek(wb.week)}
                    className="w-full flex items-center justify-between p-3 bg-background rounded-xl hover:bg-background/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-bold text-sidebar bg-sidebar/10 px-2.5 py-1 rounded-lg">Semana {wb.week}</span>
                      <span className="text-[13px] font-semibold text-text-primary">{wb.phase}</span>
                      <span className="text-[11px] text-text-muted">{wb.taskCount} tareas</span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                  </button>
                  {isExpanded && (
                    <div className="mt-2 space-y-2 pl-2">
                      {weekTasks.map((task) => (
                        <div key={task.id} className="bg-background rounded-xl p-4 border border-card-border/50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[11px] text-text-muted font-medium flex items-center gap-1">
                                  <Clock size={11} />{task.estimatedMinutes ? `${task.estimatedMinutes} min` : task.time}
                                </span>
                                <span className="text-[10px] text-sidebar font-bold bg-sidebar/10 px-2 py-0.5 rounded-full">+{task.xpReward} XP</span>
                                {task.bloomLevel && (
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${bloomColors[task.bloomLevel] ?? "bg-gray-50 text-gray-600"}`}>
                                    🧠 {task.bloomLevel}
                                  </span>
                                )}
                                {task.grouping && (
                                  <span className="text-[10px] text-text-muted bg-background border border-card-border px-2 py-0.5 rounded-full">
                                    {groupingIcons[task.grouping]} {groupingLabels[task.grouping]}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-[13px] font-bold text-text-primary">{task.title}</h4>
                            </div>
                          </div>
                          <p className="text-[12px] text-text-muted leading-relaxed mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1.5">
                              {task.competencies.map((key) => (
                                <span key={key} className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: getCompetencyColor(key) }}>{key}</span>
                              ))}
                            </div>
                            <span className="text-[11px] text-text-muted italic ml-2">{task.evidence}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: RUBRIC */}
        {activeProposalTab === "rubric" && (
          <div className="bg-card rounded-2xl border border-card-border p-6">
            <h3 className="text-[14px] font-bold text-text-primary mb-4 flex items-center gap-2"><Star size={16} className="text-sidebar" />Rúbrica de evaluación</h3>
            {project.rubric && project.rubric.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-card-border">
                      <th className="text-left py-2 pr-4 text-text-secondary font-semibold w-[25%]">Criterio</th>
                      <th className="text-left py-2 px-3 text-emerald-700 font-semibold bg-emerald-50 rounded-tl-lg">⭐⭐⭐ Excelente</th>
                      <th className="text-left py-2 px-3 text-amber-700 font-semibold bg-amber-50">⭐⭐ Bien</th>
                      <th className="text-left py-2 px-3 text-blue-700 font-semibold bg-blue-50 rounded-tr-lg">⭐ En desarrollo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.rubric.map((r, i) => (
                      <tr key={i} className="border-b border-card-border/50 last:border-0">
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-text-primary">{r.criterion}</p>
                          <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: getCompetencyColor(r.competency) }}>{r.competency}</span>
                        </td>
                        <td className="py-3 px-3 bg-emerald-50/50 text-emerald-800">{r.excellent}</td>
                        <td className="py-3 px-3 bg-amber-50/50 text-amber-800">{r.good}</td>
                        <td className="py-3 px-3 bg-blue-50/50 text-blue-800">{r.developing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <Star size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-[13px]">No se generó rúbrica para este proyecto.</p>
              </div>
            )}
          </div>
        )}

        {/* Deploy button */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => setStep("deploy")}
            className="flex items-center gap-2 bg-sidebar text-white font-bold text-[14px] px-8 py-3.5 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer shadow-md"
          >
            <Rocket size={18} />
            Publicar en clase
          </button>
          <button
            onClick={() => setStep("edit")}
            className="flex items-center gap-2 border border-card-border text-text-secondary text-[13px] font-medium px-5 py-3.5 rounded-xl hover:bg-background transition-all cursor-pointer"
          >
            <Pencil size={14} />
            Editar proyecto
          </button>
        </div>
      </div>
    );
  }

  // ── EDIT ──────────────────────────────────────────────────
  if (step === "edit" && (editedProject || selectedProject)) {
    const project = editedProject ?? selectedProject!;
    return (
      <div className="max-w-2xl">
        <button onClick={() => setStep("detail")} className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer">
          <ArrowLeft size={16} />Volver al detalle
        </button>

        <h1 className="text-[20px] font-bold text-text-primary mb-5">Editar proyecto</h1>

        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <label className="text-[12px] font-bold text-text-secondary mb-2 block uppercase tracking-wide">Título del proyecto</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setEditedProject({ ...project, name: e.target.value })}
              className="w-full border border-card-border rounded-xl px-4 py-3 text-[15px] font-semibold text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20"
            />
          </div>

          <div className="bg-card rounded-2xl border border-card-border p-5">
            <label className="text-[12px] font-bold text-text-secondary mb-2 block uppercase tracking-wide">Descripción</label>
            <textarea
              rows={3}
              value={project.description}
              onChange={(e) => setEditedProject({ ...project, description: e.target.value })}
              className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 resize-none"
            />
          </div>

          <div className="bg-card rounded-2xl border border-card-border p-5">
            <label className="text-[12px] font-bold text-text-secondary mb-2 block uppercase tracking-wide">Producto final</label>
            <input
              type="text"
              value={project.finalProduct ?? ""}
              onChange={(e) => setEditedProject({ ...project, finalProduct: e.target.value })}
              className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <label className="text-[12px] font-bold text-text-secondary mb-2 block uppercase tracking-wide">Duración</label>
              <select
                value={project.duration}
                onChange={(e) => setEditedProject({ ...project, duration: e.target.value })}
                className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer"
              >
                {durationOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <label className="text-[12px] font-bold text-text-secondary mb-2 block uppercase tracking-wide">Dificultad</label>
              <select
                value={project.difficulty}
                onChange={(e) => setEditedProject({ ...project, difficulty: e.target.value as GeneratedProject["difficulty"] })}
                className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer"
              >
                <option>Básico</option><option>Intermedio</option><option>Avanzado</option>
              </select>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-card-border p-5">
            <label className="text-[12px] font-bold text-text-secondary mb-2 block uppercase tracking-wide">Notas del profesor</label>
            <textarea
              rows={2}
              value={project.teacherNotes ?? ""}
              onChange={(e) => setEditedProject({ ...project, teacherNotes: e.target.value })}
              className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => setStep("detail")}
            className="flex items-center gap-2 bg-sidebar text-white font-bold text-[14px] px-6 py-3 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer shadow-md"
          >
            <CheckCircle2 size={16} />Guardar cambios
          </button>
          <button
            onClick={() => { setEditedProject(selectedProject); setStep("detail"); }}
            className="flex items-center gap-2 border border-card-border text-text-secondary text-[13px] font-medium px-4 py-3 rounded-xl hover:bg-background transition-all cursor-pointer"
          >
            <X size={14} />Cancelar
          </button>
        </div>
      </div>
    );
  }

  // ── DEPLOY CONFIG ─────────────────────────────────────────
  if (step === "deploy" && (editedProject || selectedProject)) {
    const project = editedProject ?? selectedProject!;
    return (
      <div className="max-w-lg">
        <button onClick={() => setStep("detail")} className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer">
          <ArrowLeft size={16} />Volver al detalle
        </button>

        <h1 className="text-[20px] font-bold text-text-primary mb-1">Publicar en clase</h1>
        <p className="text-[13px] text-text-secondary mb-6">Configura cómo se publicará <span className="font-semibold text-text-primary">{project.name}</span></p>

        {/* Project summary */}
        <div className="bg-sidebar/8 rounded-2xl border border-sidebar/20 p-4 mb-5 flex items-center gap-4">
          <span className="text-3xl">{project.emoji ?? "🚀"}</span>
          <div>
            <p className="text-[14px] font-bold text-text-primary">{project.name}</p>
            <p className="text-[12px] text-text-secondary">{project.duration} · {project.totalTasks} tareas · {project.difficulty}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <label className="text-[12px] font-bold text-text-secondary mb-2 block uppercase tracking-wide flex items-center gap-1">
              <CalendarDays size={13} />Fecha de inicio
            </label>
            <input
              type="date"
              value={deployDate}
              onChange={(e) => setDeployDate(e.target.value)}
              className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-sidebar/20 cursor-pointer"
            />
          </div>

          <div className="bg-card rounded-2xl border border-card-border p-5">
            <label className="text-[12px] font-bold text-text-secondary mb-3 block uppercase tracking-wide flex items-center gap-1">
              <Users size={13} />Grupos / Clases
            </label>
            <div className="flex flex-wrap gap-2">
              {["1º ESO A", "1º ESO B", "2º ESO A", "2º ESO B"].map((group) => (
                <button
                  key={group}
                  onClick={() => setDeployGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group])}
                  className={`text-[12px] font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    deployGroups.includes(group) ? "bg-sidebar text-white border-sidebar" : "border-card-border text-text-secondary hover:border-sidebar/30"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-text-primary flex items-center gap-2"><Trophy size={14} className="text-sidebar" />Activar gamificación</p>
                <p className="text-[12px] text-text-muted mt-0.5">XP, medallas y tabla de clasificación para los alumnos</p>
              </div>
              <button
                onClick={() => setEnableGamification(!enableGamification)}
                className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${enableGamification ? "bg-sidebar" : "bg-card-border"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${enableGamification ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep("deployed")}
          disabled={deployGroups.length === 0}
          className="mt-5 flex items-center gap-2 bg-sidebar text-white font-bold text-[14px] px-8 py-3.5 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket size={18} />
          Publicar proyecto ahora
        </button>
      </div>
    );
  }

  // ── DEPLOYED ──────────────────────────────────────────────
  if (step === "deployed") {
    const project = editedProject ?? selectedProject!;
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl border border-card-border p-10 text-center max-w-md w-full">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-sidebar/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-sidebar to-sidebar/70 flex items-center justify-center shadow-lg">
              <span className="text-3xl">{project.emoji ?? "🚀"}</span>
            </div>
          </div>
          <h2 className="text-[22px] font-black text-text-primary mb-1">¡Proyecto publicado!</h2>
          <p className="text-[16px] font-semibold text-text-primary mb-1">{project.name}</p>
          <p className="text-[13px] text-text-secondary mb-2">
            {deployGroups.length > 0 ? `${deployGroups.join(", ")}` : "Tu clase"} verá este proyecto
            {deployDate ? ` a partir del ${new Date(deployDate + "T00:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}` : " desde hoy"}
          </p>
          {enableGamification && (
            <div className="flex items-center justify-center gap-2 mb-6 bg-accent/10 rounded-xl py-2 px-4">
              <Trophy size={15} className="text-accent-text" />
              <p className="text-[12px] font-semibold text-accent-text">Gamificación activada — {project.totalTasks * 50} XP disponibles</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button
              onClick={onNavigateToDashboard}
              className="bg-sidebar text-white font-bold text-[14px] px-6 py-3 rounded-xl hover:bg-sidebar-hover transition-all cursor-pointer"
            >
              Ir al Dashboard
            </button>
            <button
              onClick={() => { setStep("list"); setSelectedProject(null); setEditedProject(null); setGeneratedProjects([]); setSourceInfo(null); }}
              className="text-text-secondary text-[13px] font-medium py-2 hover:text-text-primary transition-colors cursor-pointer"
            >
              Crear otro proyecto
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
