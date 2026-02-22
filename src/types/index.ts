export type TaskStatus = "completed" | "in_progress" | "upcoming" | "locked";
export type DayStatus = "completed" | "current" | "upcoming";
export type Role = "student" | "parent" | "teacher";
export type ViewMode = "daily" | "kanban";
export type StudentView = "dashboard" | "project" | "task" | "competencies" | "calendar" | "qcoins" | "profile" | "settings";
export type TeacherView = "dashboard" | "projects" | "analytics" | "calendar" | "students" | "settings";
export type ParentView = "overview" | "progress" | "calendar" | "teachers" | "profile" | "settings";

export type EvidenceType =
  | "spreadsheet"
  | "infographic"
  | "document"
  | "floor_plan"
  | "brand_board"
  | "diagram"
  | "landing_page";

export interface TaskEvidence {
  taskId: string;
  type: EvidenceType;
  title: string;
  previewData: Record<string, unknown>;
}

export type CompetencyKey =
  | "CLC" // Comunicación Lingüística
  | "CPL" // Plurilingüe
  | "STEM" // STEM
  | "CD" // Digital
  | "CPSAA" // Personal, Social y Aprender a Aprender
  | "CC" // Ciudadana
  | "CE" // Emprendedora
  | "CCEC"; // Conciencia y Expresión Culturales

export interface Competency {
  key: CompetencyKey;
  name: string;
  shortName: string;
  color: string;
  progress: number; // 0-100
  previousProgress: number;
}

export interface Task {
  id: string;
  time: string;
  title: string;
  description: string;
  subject: string;
  competencies: CompetencyKey[];
  status: TaskStatus;
  evidence: string;
  xpReward: number;
}

export interface DaySchedule {
  day: string;
  dayShort: string;
  date: string;
  phase: string;
  status: DayStatus;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  weeks: string;
  status: "completed" | "active" | "upcoming";
  description: string;
  progress: number;
}

export interface Student {
  name: string;
  avatar: string;
  class: string;
  qcoins: number;
  xpTotal: number;
  xpWeek: number;
  streak: number;
  evidencesSubmitted: number;
  evidencesTotal: number;
}

export interface ChatMessage {
  id: string;
  sender: "student" | "teacher";
  senderName: string;
  message: string;
  time: string;
  read: boolean;
}

export interface ClassStudent {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  status: "on_track" | "needs_attention" | "excelling";
  currentTask: string;
  evidencesSubmitted: number;
}

export interface Alert {
  id: string;
  type: "success" | "warning" | "urgent";
  student: string;
  message: string;
  time: string;
}

export interface PlayerLevel {
  level: number;
  title: string;
  xpCurrent: number;
  xpRequired: number;
  nextTitle: string;
}

export interface EmergencyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  timeLimit: number; // minutes
}

export interface TribeMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isCurrentUser: boolean;
  badge?: string;
}

export interface Tribe {
  name: string;
  members: TribeMember[];
}

export interface ToolOption {
  id: string;
  name: string;
  icon: string; // lucide icon name reference
}

export interface ProjectImpact {
  revenue: string;
  label: string;
  guests: string;
  rating: string;
}

// Task Workspace types
export type StepStatus = "not_started" | "working" | "done";

export interface TaskStep {
  id: string;
  title: string;
  instruction: string;
  duration: string;
  tips?: string[];
  example?: {
    label: string;
    content: string;
  };
  resources?: {
    label: string;
    type: "link" | "template" | "reference" | "tool";
  }[];
}

export interface SuccessCriterion {
  id: string;
  label: string;
}

export interface TaskWorkspaceData {
  taskId: string;
  brief: {
    whyItMatters: string;
    whatYouLearn: string;
    realWorldConnection: string;
  };
  steps: TaskStep[];
  successCriteria: SuccessCriterion[];
  evidenceSubmission: {
    description: string;
    format: string;
  };
}
