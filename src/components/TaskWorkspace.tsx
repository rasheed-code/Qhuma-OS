"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Lightbulb,
  BookOpen,
  Target,
  Upload,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileText,
  ExternalLink,
  Wrench,
  Clock,
  Loader2,
} from "lucide-react";
import { weekSchedule } from "@/data/tasks";
import { taskWorkspaces } from "@/data/taskWorkspaces";
import { competencies } from "@/data/competencies";
import { Task, TaskStep, StepStatus } from "@/types";

// ---- Resource type icons ----
const resourceIcons: Record<string, typeof ExternalLink> = {
  link: ExternalLink,
  template: FileText,
  reference: BookOpen,
  tool: Wrench,
};

// ---- Brief Section ----
function BriefSection({ brief }: { brief: { whyItMatters: string; whatYouLearn: string; realWorldConnection: string } }) {
  return (
    <div className="bg-background rounded-2xl p-6 mb-6">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={14} className="text-accent-text" />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Why it matters</span>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">{brief.whyItMatters}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen size={14} className="text-accent-text" />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">What you&apos;ll learn</span>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">{brief.whatYouLearn}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Target size={14} className="text-accent-text" />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Real world</span>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">{brief.realWorldConnection}</p>
        </div>
      </div>
    </div>
  );
}

// ---- Progress Bar ----
function ProgressBar({ steps, statuses }: { steps: TaskStep[]; statuses: Record<string, StepStatus> }) {
  const doneCount = steps.filter((s) => statuses[s.id] === "done").length;
  const workingCount = steps.filter((s) => statuses[s.id] === "working").length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-text-primary">
          {doneCount} of {steps.length} steps completed
        </span>
        {workingCount > 0 && (
          <span className="text-[11px] font-medium text-accent-text bg-accent-light px-2.5 py-0.5 rounded-full">
            {workingCount} in progress
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {steps.map((step, i) => {
          const status = statuses[step.id] || "not_started";
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                  status === "done"
                    ? "bg-success text-white"
                    : status === "working"
                    ? "bg-accent-light text-accent-text border-2 border-accent"
                    : "bg-background text-text-muted border-2 border-card-border"
                }`}
              >
                {status === "done" ? (
                  <CheckCircle2 size={14} />
                ) : status === "working" ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  i + 1
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${
                    status === "done" ? "bg-success" : "bg-card-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Step Card ----
function StepCard({
  step,
  index,
  status,
  isExpanded,
  onToggle,
  onStatusChange,
}: {
  step: TaskStep;
  index: number;
  status: StepStatus;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (newStatus: StepStatus) => void;
}) {
  const nextStatus: Record<StepStatus, StepStatus> = {
    not_started: "working",
    working: "done",
    done: "not_started",
  };

  return (
    <div
      className="bg-background rounded-2xl transition-all mb-3 overflow-hidden"
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 cursor-pointer hover:bg-card-border/10 transition-colors"
      >
        {/* Step number / status icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
            status === "done"
              ? "bg-success text-white"
              : status === "working"
              ? "bg-accent-light text-accent-text"
              : "bg-card text-text-muted"
          }`}
        >
          {status === "done" ? <CheckCircle2 size={16} /> : index + 1}
        </div>

        <div className="flex-1 text-left min-w-0">
          <span
            className={`text-[14px] font-semibold block leading-snug ${
              status === "done" ? "text-text-muted line-through" : "text-text-primary"
            }`}
          >
            {step.title}
          </span>
          {!isExpanded && (
            <span className="text-[11px] text-text-muted">{step.duration}</span>
          )}
        </div>

        {/* Duration pill */}
        <span className="text-[10px] font-medium text-text-muted bg-card px-2 py-0.5 rounded-full shrink-0">
          {step.duration}
        </span>

        {/* Expand chevron */}
        <ChevronDown
          size={16}
          className={`text-text-muted transition-transform shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          {/* Instruction */}
          <p className="text-[13px] text-text-secondary leading-relaxed mb-4 ml-11">
            {step.instruction}
          </p>

          {/* Tips */}
          {step.tips && step.tips.length > 0 && (
            <div className="bg-warning-light rounded-xl p-3.5 mb-3 ml-11">
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb size={13} className="text-warning" />
                <span className="text-[11px] font-semibold text-warning">Tips</span>
              </div>
              <ul className="space-y-1.5">
                {step.tips.map((tip, i) => (
                  <li key={i} className="text-[12px] text-warning/80 leading-relaxed flex gap-2">
                    <span className="shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example */}
          {step.example && (
            <div className="bg-accent-light rounded-xl p-3.5 mb-3 ml-11">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen size={13} className="text-accent-text" />
                <span className="text-[11px] font-semibold text-accent-text">{step.example.label}</span>
              </div>
              <p className="text-[12px] text-accent-text/80 leading-relaxed whitespace-pre-line">
                {step.example.content}
              </p>
            </div>
          )}

          {/* Resources */}
          {step.resources && step.resources.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap ml-11 mb-4">
              {step.resources.map((res, i) => {
                const Icon = resourceIcons[res.type] || ExternalLink;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-card text-text-secondary px-3 py-1.5 rounded-lg text-[11px] font-medium"
                  >
                    <Icon size={12} />
                    {res.label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Status toggle */}
          <div className="ml-11">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(nextStatus[status]);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                status === "done"
                  ? "bg-success/10 text-success hover:bg-success/20"
                  : status === "working"
                  ? "bg-sidebar text-white hover:bg-accent-dark"
                  : "bg-card text-text-secondary hover:bg-accent-light hover:text-accent-text"
              }`}
            >
              {status === "done" && <><CheckCircle2 size={14} /> Completed — click to undo</>}
              {status === "working" && <><Clock size={14} /> Mark as done</>}
              {status === "not_started" && <><Circle size={14} /> Start this step</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Success Criteria ----
function CriteriaSection({
  criteria,
  met,
  onToggle,
}: {
  criteria: { id: string; label: string }[];
  met: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const metCount = Object.values(met).filter(Boolean).length;

  return (
    <div className="bg-background rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-text-primary" />
          <h3 className="text-[16px] font-semibold text-text-primary">What does &quot;good&quot; look like?</h3>
        </div>
        <span className="text-[11px] font-medium text-text-muted">
          {metCount}/{criteria.length} met
        </span>
      </div>
      <div className="space-y-2">
        {criteria.map((c) => (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className="w-full flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-card transition-colors cursor-pointer text-left"
          >
            {met[c.id] ? (
              <CheckCircle2 size={18} className="text-success shrink-0" />
            ) : (
              <Circle size={18} className="text-text-muted/40 shrink-0" />
            )}
            <span
              className={`text-[13px] leading-snug ${
                met[c.id] ? "text-text-muted line-through" : "text-text-secondary"
              }`}
            >
              {c.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Evidence Submission ----
function EvidenceSection({
  submission,
  task,
}: {
  submission: { description: string; format: string };
  task: Task;
}) {
  return (
    <div className="bg-sidebar rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Upload size={16} className="text-accent" />
        <h3 className="text-[16px] font-semibold text-white">Submit Your Evidence</h3>
      </div>
      <p className="text-[13px] text-white/70 leading-relaxed mb-3">
        {submission.description}
      </p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] font-medium text-white/50">Format:</span>
        <span className="text-[11px] font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-lg">
          {submission.format}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex-1 py-3 bg-accent text-sidebar text-[13px] font-bold rounded-xl hover:bg-accent/90 transition-colors cursor-pointer flex items-center justify-center gap-2">
          <Upload size={15} />
          Submit Evidence
        </button>
        {task.status === "completed" && (
          <span className="text-[12px] font-semibold text-success flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            Submitted
          </span>
        )}
      </div>
    </div>
  );
}

// ---- Main Component ----
interface TaskWorkspaceProps {
  taskId: string;
  onBack: () => void;
}

export default function TaskWorkspace({ taskId, onBack }: TaskWorkspaceProps) {
  // Find task from schedule
  const task = weekSchedule
    .flatMap((d) => d.tasks)
    .find((t) => t.id === taskId);

  // Find workspace data
  const workspace = taskWorkspaces.find((w) => w.taskId === taskId);

  // Step statuses (local state)
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [criteriaMet, setCriteriaMet] = useState<Record<string, boolean>>({});

  // Initialize states based on task status
  useEffect(() => {
    if (!workspace || !task) return;

    const initialStatuses: Record<string, StepStatus> = {};
    const initialCriteria: Record<string, boolean> = {};

    if (task.status === "completed") {
      // All done
      workspace.steps.forEach((s) => (initialStatuses[s.id] = "done"));
      workspace.successCriteria.forEach((c) => (initialCriteria[c.id] = true));
    } else if (task.status === "in_progress") {
      // First step done, second working, rest not started
      workspace.steps.forEach((s, i) => {
        if (i === 0) initialStatuses[s.id] = "done";
        else if (i === 1) initialStatuses[s.id] = "working";
        else initialStatuses[s.id] = "not_started";
      });
      workspace.successCriteria.forEach((c) => (initialCriteria[c.id] = false));
    } else {
      // All not started
      workspace.steps.forEach((s) => (initialStatuses[s.id] = "not_started"));
      workspace.successCriteria.forEach((c) => (initialCriteria[c.id] = false));
    }

    setStepStatuses(initialStatuses);
    setCriteriaMet(initialCriteria);

    // Auto-expand the first "working" step, or first "not_started" if none working
    const workingStep = workspace.steps.find((s) => initialStatuses[s.id] === "working");
    const firstNotStarted = workspace.steps.find((s) => initialStatuses[s.id] === "not_started");
    setExpandedStepId(workingStep?.id || firstNotStarted?.id || workspace.steps[0]?.id || null);
  }, [taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [taskId]);

  if (!task) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">Task not found</p>
        <button onClick={onBack} className="text-accent-text text-[13px] font-medium mt-2 cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div className="bg-background rounded-2xl p-8 text-center">
          <h2 className="text-[18px] font-semibold text-text-primary mb-2">{task.title}</h2>
          <p className="text-[13px] text-text-muted">Detailed workspace coming soon for this task.</p>
        </div>
      </div>
    );
  }

  const handleStepStatusChange = (stepId: string, newStatus: StepStatus) => {
    setStepStatuses((prev) => ({ ...prev, [stepId]: newStatus }));
  };

  const handleCriteriaToggle = (id: string) => {
    setCriteriaMet((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-3xl">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Task header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] text-text-muted font-medium">{task.time}</span>
              <div
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  task.status === "completed"
                    ? "bg-success-light text-success"
                    : task.status === "in_progress"
                    ? "bg-accent-light text-accent-text"
                    : "bg-background text-text-muted"
                }`}
              >
                {task.status === "completed"
                  ? "Completed"
                  : task.status === "in_progress"
                  ? "In Progress"
                  : "Upcoming"}
              </div>
            </div>
            <h1 className="text-[28px] font-semibold text-text-primary leading-tight">
              {task.title}
            </h1>
          </div>
          <span className="text-[13px] font-bold text-accent-text bg-accent-light px-3 py-1.5 rounded-xl shrink-0">
            +{task.xpReward} XP
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mt-3">
          <span className="text-[11px] font-medium text-text-secondary bg-background rounded-lg px-2.5 py-1">
            {task.subject}
          </span>
          {task.competencies.map((key) => {
            const comp = competencies.find((c) => c.key === key);
            if (!comp) return null;
            return (
              <span
                key={key}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: comp.color }}
              >
                {comp.shortName}
              </span>
            );
          })}
        </div>
      </div>

      {/* Brief */}
      <BriefSection brief={workspace.brief} />

      {/* Progress */}
      <ProgressBar steps={workspace.steps} statuses={stepStatuses} />

      {/* Steps */}
      <div className="mb-6">
        {workspace.steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            status={stepStatuses[step.id] || "not_started"}
            isExpanded={expandedStepId === step.id}
            onToggle={() =>
              setExpandedStepId(expandedStepId === step.id ? null : step.id)
            }
            onStatusChange={(newStatus) => handleStepStatusChange(step.id, newStatus)}
          />
        ))}
      </div>

      {/* Success Criteria */}
      <CriteriaSection
        criteria={workspace.successCriteria}
        met={criteriaMet}
        onToggle={handleCriteriaToggle}
      />

      {/* Evidence Submission */}
      <EvidenceSection submission={workspace.evidenceSubmission} task={task} />
    </div>
  );
}
