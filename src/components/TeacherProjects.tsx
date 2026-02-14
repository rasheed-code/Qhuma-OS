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
} from "lucide-react";
import { trimesterProjects } from "@/data/tasks";
import { competencies as allCompetencies } from "@/data/competencies";
import { GeneratedProject, SourceAnalysis } from "@/data/projectGenerator";

type WizardStep = "list" | "input" | "processing" | "proposals" | "detail" | "deployed";
type InputTab = "upload" | "url" | "describe";

interface TeacherProjectsProps {
  onNavigateToDashboard: () => void;
}

const statusColors: Record<string, string> = {
  active: "bg-accent/15 text-accent",
  upcoming: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-50 text-green-600",
  Intermediate: "bg-amber-50 text-amber-600",
  Advanced: "bg-red-50 text-red-600",
};

const processingMessages = [
  "Analyzing curriculum document...",
  "Extracting learning objectives...",
  "Mapping to LOMLOE competencies...",
  "Generating project proposals...",
  "Evaluating task complexity...",
];

const subjectChips = [
  "Business Studies",
  "Mathematics",
  "Language Arts",
  "Technology",
  "Social Studies",
  "Visual Arts",
  "Science",
];

export default function TeacherProjects({ onNavigateToDashboard }: TeacherProjectsProps) {
  const [step, setStep] = useState<WizardStep>("list");
  const [inputTab, setInputTab] = useState<InputTab>("upload");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [processingMsgIndex, setProcessingMsgIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<GeneratedProject | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));
  const [refinementText, setRefinementText] = useState("");

  // Real input state
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [gradeLevel, setGradeLevel] = useState("1º ESO");
  const [durationWeeks, setDurationWeeks] = useState("2 weeks");

  // AI generation state
  const [generatedProjects, setGeneratedProjects] = useState<GeneratedProject[]>([]);
  const [sourceInfo, setSourceInfo] = useState<SourceAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Processing animation (only visual, no auto-advance)
  useEffect(() => {
    if (step !== "processing") return;
    const msgInterval = setInterval(() => {
      setProcessingMsgIndex((prev) => (prev + 1) % processingMessages.length);
    }, 600);
    return () => clearInterval(msgInterval);
  }, [step]);

  const callGenerateAPI = useCallback(async (extraRefinement?: string) => {
    setError(null);
    setProcessingMsgIndex(0);
    setStep("processing");

    const formData = new FormData();

    // Input content
    if (inputTab === "upload" && file) {
      formData.append("file", file);
    } else if (inputTab === "url" && urlInput.trim()) {
      formData.append("url", urlInput.trim());
    } else if (inputTab === "describe" && descriptionInput.trim()) {
      formData.append("description", descriptionInput.trim());
    } else {
      setError("Please provide a PDF file, URL, or description before generating.");
      setStep("input");
      return;
    }

    // Parameters
    formData.append("grade", gradeLevel);
    formData.append("duration", durationWeeks);
    if (selectedSubjects.length > 0) {
      formData.append("subjects", selectedSubjects.join(", "));
    }
    if (extraRefinement) {
      formData.append("refinement", extraRefinement);
    }

    try {
      abortControllerRef.current = new AbortController();
      const res = await fetch("/api/generate-projects", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate projects");
      }

      setGeneratedProjects(data.projects);
      setSourceInfo(data.sourceAnalysis);
      setStep("proposals");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep("input");
    }
  }, [inputTab, file, urlInput, descriptionInput, gradeLevel, durationWeeks, selectedSubjects]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const toggleWeek = (week: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  };

  const getCompetencyColor = (key: string) => {
    return allCompetencies.find((c) => c.key === key)?.color ?? "#94a3b8";
  };

  const getCompetencyName = (key: string) => {
    return allCompetencies.find((c) => c.key === key)?.shortName ?? key;
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  // ── LIST ──────────────────────────────────────────────────
  if (step === "list") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-bold text-text-primary">Projects</h1>
          <button
            onClick={() => { setError(null); setStep("input"); }}
            className="flex items-center gap-2 bg-accent text-sidebar font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus size={16} />
            Create New Project
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {trimesterProjects.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-2xl p-5 border border-card-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-text-primary">{project.name}</h3>
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                    statusColors[project.status]
                  }`}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              <p className="text-[12px] text-text-muted mb-3 leading-relaxed">{project.description}</p>
              <div className="flex items-center justify-between text-[11px] text-text-secondary mb-2">
                <span>{project.weeks}</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${project.progress}%`,
                    backgroundColor: project.progress > 0 ? "#A3E635" : "#e5e7eb",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── INPUT ─────────────────────────────────────────────────
  if (step === "input") {
    return (
      <div>
        <button
          onClick={() => setStep("list")}
          className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </button>

        <h1 className="text-[22px] font-bold text-text-primary mb-6">Create a New Project</h1>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-[13px] text-red-700 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="cursor-pointer">
              <X size={14} className="text-red-400" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-6 w-fit">
          {([
            { key: "upload" as InputTab, label: "Upload PDF", icon: Upload },
            { key: "url" as InputTab, label: "Paste URL", icon: Link },
            { key: "describe" as InputTab, label: "Describe", icon: FileText },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setInputTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                inputTab === tab.key
                  ? "bg-card text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="bg-card rounded-2xl border border-card-border p-6 mb-6">
          {inputTab === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-card-border rounded-xl p-10 text-center hover:border-accent/40 transition-colors cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="absolute w-0 h-0 opacity-0 overflow-hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
              {file ? (
                <>
                  <CheckCircle2 size={32} className="mx-auto text-accent mb-3" />
                  <p className="text-[14px] font-medium text-text-primary mb-1">
                    {file.name}
                  </p>
                  <p className="text-[12px] text-text-muted">
                    {(file.size / 1024 / 1024).toFixed(1)} MB — click to change
                  </p>
                </>
              ) : (
                <>
                  <Upload size={32} className="mx-auto text-text-muted mb-3" />
                  <p className="text-[14px] font-medium text-text-primary mb-1">
                    Drop your curriculum PDF here
                  </p>
                  <p className="text-[12px] text-text-muted">
                    or click to browse — supports PDF, DOCX, TXT
                  </p>
                </>
              )}
            </div>
          )}
          {inputTab === "url" && (
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-2 block">
                Curriculum or syllabus URL
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.cambridgeinternational.org/programmes/igcse..."
                className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary placeholder-text-muted bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          )}
          {inputTab === "describe" && (
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-2 block">
                Describe the learning content or topic
              </label>
              <textarea
                rows={4}
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                placeholder="e.g. Cambridge IGCSE Business Studies — Marketing unit. Students should learn about the 4Ps, market research, branding, and pricing strategies..."
                className="w-full border border-card-border rounded-xl px-4 py-3 text-[13px] text-text-primary placeholder-text-muted bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
              />
            </div>
          )}
        </div>

        {/* Parameters */}
        <div className="bg-card rounded-2xl border border-card-border p-6 mb-6">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Parameters</h3>
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-2 block">
                Grade Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer"
              >
                <option>1º ESO</option>
                <option>2º ESO</option>
                <option>3º ESO</option>
                <option>4º ESO</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-2 block">
                Duration
              </label>
              <select
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value)}
                className="w-full border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer"
              >
                <option>1 week</option>
                <option>2 weeks</option>
                <option>3 weeks</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-text-secondary mb-2 block">
              Subject Focus
            </label>
            <div className="flex flex-wrap gap-2">
              {subjectChips.map((subject) => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedSubjects.includes(subject)
                      ? "bg-accent/15 text-accent border-accent/30"
                      : "border-card-border text-text-secondary hover:border-accent/30 hover:text-text-primary"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => callGenerateAPI()}
          className="flex items-center gap-2 bg-accent text-sidebar font-semibold text-[14px] px-6 py-3 rounded-xl hover:brightness-110 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Projects
        </button>
      </div>
    );
  }

  // ── PROCESSING ────────────────────────────────────────────
  if (step === "processing") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl border border-card-border p-10 text-center max-w-md w-full">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sidebar to-accent opacity-20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-sidebar to-accent flex items-center justify-center">
              <Loader2 size={28} className="text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-[16px] font-bold text-text-primary mb-2">Generating Projects</h2>
          <p className="text-[13px] text-text-secondary h-5 transition-opacity duration-200">
            {processingMessages[processingMsgIndex]}
          </p>
        </div>
      </div>
    );
  }

  // ── PROPOSALS ─────────────────────────────────────────────
  if (step === "proposals") {
    return (
      <div>
        <button
          onClick={() => setStep("input")}
          className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Input
        </button>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-[22px] font-bold text-text-primary">
            {generatedProjects.length} Project Ideas
          </h1>
          {sourceInfo && (
            <span className="text-[11px] font-medium bg-sidebar/10 text-sidebar px-3 py-1 rounded-full">
              {sourceInfo.source}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {generatedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-2xl border border-card-border p-5 flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[15px] font-bold text-text-primary leading-tight pr-2">
                  {project.name}
                </h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    difficultyColors[project.difficulty] ?? "bg-gray-50 text-gray-600"
                  }`}
                >
                  {project.difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-text-muted leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-[11px] text-text-secondary">
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {project.duration}
                </span>
                <span className="flex items-center gap-1">
                  <ListChecks size={13} />
                  {project.totalTasks} tasks
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 size={13} />
                  {project.competencies.length} comp.
                </span>
              </div>

              {/* Competency pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.competencies.map((key) => (
                  <span
                    key={key}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: getCompetencyColor(key) }}
                  >
                    {getCompetencyName(key)}
                  </span>
                ))}
              </div>

              {/* Highlights */}
              <ul className="mb-4 flex-1">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-text-secondary mb-1.5">
                    <CheckCircle2 size={13} className="text-accent mt-0.5 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Weekly mini-timeline */}
              <div className="bg-background rounded-xl p-3 mb-4">
                {project.weeklyBreakdown.map((wb) => (
                  <div key={wb.week} className="flex items-center justify-between text-[11px] mb-1 last:mb-0">
                    <span className="text-text-secondary">
                      Week {wb.week}: <span className="text-text-primary font-medium">{wb.phase}</span>
                    </span>
                    <span className="text-text-muted">{wb.taskCount} tasks</span>
                  </div>
                ))}
              </div>

              {/* Select button */}
              <button
                onClick={() => {
                  setSelectedProject(project);
                  setExpandedWeeks(new Set([1]));
                  setStep("detail");
                }}
                className="w-full bg-accent text-sidebar font-semibold text-[13px] py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
              >
                Select This Project
              </button>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="bg-card rounded-2xl border border-card-border p-4 flex items-center gap-4">
          <button
            onClick={() => callGenerateAPI()}
            className="flex items-center gap-2 border border-card-border text-text-secondary font-medium text-[13px] px-4 py-2.5 rounded-xl hover:bg-background transition-all cursor-pointer"
          >
            <RefreshCw size={15} />
            Generate New Options
          </button>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={refinementText}
              onChange={(e) => setRefinementText(e.target.value)}
              placeholder="Looking for something more like..."
              className="flex-1 border border-card-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary placeholder-text-muted bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            <button
              onClick={() => {
                if (refinementText.trim()) {
                  callGenerateAPI(refinementText.trim());
                  setRefinementText("");
                }
              }}
              className="bg-accent text-sidebar p-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
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
    return (
      <div>
        <button
          onClick={() => setStep("proposals")}
          className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Proposals
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-[22px] font-bold text-text-primary">{selectedProject.name}</h1>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
            <Sparkles size={12} />
            AI Generated
          </span>
        </div>

        {/* Summary card */}
        <div className="bg-card rounded-2xl border border-card-border p-6 mb-5">
          <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
            {selectedProject.description}
          </p>
          <div className="flex gap-6 text-[12px]">
            <div>
              <span className="text-text-muted">Duration</span>
              <p className="font-semibold text-text-primary">{selectedProject.duration}</p>
            </div>
            <div>
              <span className="text-text-muted">Total Tasks</span>
              <p className="font-semibold text-text-primary">{selectedProject.totalTasks}</p>
            </div>
            <div>
              <span className="text-text-muted">Difficulty</span>
              <p className="font-semibold text-text-primary">{selectedProject.difficulty}</p>
            </div>
            {sourceInfo && (
              <div>
                <span className="text-text-muted">Source</span>
                <p className="font-semibold text-text-primary">{sourceInfo.source}</p>
              </div>
            )}
          </div>
        </div>

        {/* Competency coverage */}
        <div className="bg-card rounded-2xl border border-card-border p-6 mb-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Competency Coverage</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {allCompetencies.map((comp, idx) => {
              const isUsed = selectedProject.competencies.includes(comp.key);
              const seed = (selectedProject.id.charCodeAt(selectedProject.id.length - 1) * 31 + idx * 17) % 50;
              const coverage = isUsed ? 40 + seed : 0;
              return (
                <div key={comp.key} className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold w-12 text-text-secondary">
                    {comp.key}
                  </span>
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${coverage}%`,
                        backgroundColor: isUsed ? comp.color : "#e5e7eb",
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-text-muted w-8 text-right">
                    {coverage > 0 ? `${coverage}%` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly breakdown accordion */}
        <div className="bg-card rounded-2xl border border-card-border p-6 mb-6">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Weekly Breakdown</h3>
          {selectedProject.weeklyBreakdown.map((wb) => {
            const isExpanded = expandedWeeks.has(wb.week);
            const weekTasks = selectedProject.sampleTasks.slice(
              (wb.week - 1) * wb.taskCount,
              wb.week * wb.taskCount
            );
            return (
              <div key={wb.week} className="mb-3 last:mb-0">
                <button
                  onClick={() => toggleWeek(wb.week)}
                  className="w-full flex items-center justify-between p-3 bg-background rounded-xl hover:bg-background/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg">
                      Week {wb.week}
                    </span>
                    <span className="text-[13px] font-medium text-text-primary">{wb.phase}</span>
                    <span className="text-[11px] text-text-muted">{wb.taskCount} tasks</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={16} className="text-text-muted" />
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-2 space-y-2 pl-2">
                    {weekTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-background rounded-xl p-4 border border-card-border/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] text-text-muted font-medium">
                                {task.time}
                              </span>
                              <span className="text-[10px] text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full">
                                +{task.xpReward} XP
                              </span>
                            </div>
                            <h4 className="text-[13px] font-semibold text-text-primary">
                              {task.title}
                            </h4>
                          </div>
                        </div>
                        <p className="text-[12px] text-text-muted leading-relaxed mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {task.competencies.map((key) => (
                              <span
                                key={key}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: getCompetencyColor(key) }}
                              >
                                {key}
                              </span>
                            ))}
                          </div>
                          <span className="text-[11px] text-text-muted italic">
                            {task.evidence}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Deploy button */}
        <button
          onClick={() => setStep("deployed")}
          className="flex items-center gap-2 bg-accent text-sidebar font-semibold text-[14px] px-8 py-3.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
        >
          <Rocket size={18} />
          Deploy to Class
        </button>
      </div>
    );
  }

  // ── DEPLOYED ──────────────────────────────────────────────
  if (step === "deployed") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl border border-card-border p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <h2 className="text-[20px] font-bold text-text-primary mb-2">Project Deployed!</h2>
          <p className="text-[15px] font-semibold text-text-primary mb-1">
            {selectedProject?.name}
          </p>
          <p className="text-[13px] text-text-secondary mb-8">
            12 students will see this project starting Monday
          </p>
          <button
            onClick={onNavigateToDashboard}
            className="bg-accent text-sidebar font-semibold text-[14px] px-6 py-3 rounded-xl hover:brightness-110 transition-all cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
