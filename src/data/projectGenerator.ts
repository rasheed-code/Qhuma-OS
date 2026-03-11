import { CompetencyKey } from "@/types";

export interface GeneratedTask {
  id: string;
  time: string;
  title: string;
  description: string;
  subject: string;
  competencies: CompetencyKey[];
  evidence: string;
  xpReward: number;
  // NEW
  bloomLevel?: "Recordar" | "Comprender" | "Aplicar" | "Analizar" | "Evaluar" | "Crear";
  grouping?: "individual" | "pairs" | "small_group" | "full_class";
  estimatedMinutes?: number;
}

export interface WeeklyBreakdown {
  week: number;
  phase: string;
  taskCount: number;
  // NEW
  phaseGoal?: string;
}

// NEW: Real-world impact data
export interface RealWorldImpact {
  metric: string;
  value: string;
  description: string;
}

// NEW: Rubric criterion
export interface RubricCriterion {
  criterion: string;
  competency: CompetencyKey;
  excellent: string;
  good: string;
  developing: string;
}

export interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  duration: string;
  totalTasks: number;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  competencies: CompetencyKey[];
  highlights: string[];
  weeklyBreakdown: WeeklyBreakdown[];
  sampleTasks: GeneratedTask[];
  // NEW fields
  emoji?: string;
  realWorldContext?: string;
  finalProduct?: string;
  targetAudience?: string;
  crossCurricularLinks?: string[];
  rubric?: RubricCriterion[];
  impactMetrics?: RealWorldImpact[];
  teacherNotes?: string;
  differentiationTips?: {
    support: string;
    extension: string;
  };
}

export interface SourceAnalysis {
  source: string;
  topics: string[];
  learningObjectives: string[];
  // NEW
  detectedSubject?: string;
  contentSummary?: string;
  suggestedGrade?: string;
  keyVocabulary?: string[];
}

// NEW: Config submitted by teacher
export interface ProjectConfig {
  grade: string;
  duration: string;
  subjects: string[];
  bloomFocus: string;
  grouping: string;
  modality: string;
  projectStyle: string;
  extraContext: string;
}
