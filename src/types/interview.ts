export type JobRole = 
  | 'software-engineer'
  | 'data-analyst'
  | 'product-manager'
  | 'hr-manager'
  | 'marketing-manager'
  | 'sales-representative'
  | 'ux-designer'
  | 'devops-engineer';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type RoundType = 'technical' | 'behavioral' | 'situational' | 'mixed';

export type AnswerMode = 'text' | 'voice';

export interface InterviewQuestion {
  id: string;
  question: string;
  type: RoundType;
  expectedTopics?: string[];
  answerMode: AnswerMode;
}

export interface QuestionFeedback {
  questionId: string;
  score: number;
  clarity: number;
  relevance: number;
  technicalAccuracy?: number;
  communication: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  jobRole: JobRole;
  difficulty: Difficulty;
  roundType: RoundType;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  feedback: QuestionFeedback[];
  totalScore: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  totalInterviews: number;
  averageScore: number;
  streakDays: number;
  badges: string[];
  createdAt: Date;
}

export interface AnalyticsData {
  totalSessions: number;
  averageScore: number;
  scoreHistory: { date: string; score: number }[];
  skillBreakdown: { skill: string; score: number }[];
  rolePerformance: { role: JobRole; sessions: number; avgScore: number }[];
  improvementAreas: string[];
}

export const JOB_ROLES: { value: JobRole; label: string; icon: string }[] = [
  { value: 'software-engineer', label: 'Software Engineer', icon: '💻' },
  { value: 'data-analyst', label: 'Data Analyst', icon: '📊' },
  { value: 'product-manager', label: 'Product Manager', icon: '📋' },
  { value: 'hr-manager', label: 'HR Manager', icon: '👥' },
  { value: 'marketing-manager', label: 'Marketing Manager', icon: '📢' },
  { value: 'sales-representative', label: 'Sales Representative', icon: '💼' },
  { value: 'ux-designer', label: 'UX Designer', icon: '🎨' },
  { value: 'devops-engineer', label: 'DevOps Engineer', icon: '⚙️' },
];

export const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Entry-level questions' },
  { value: 'intermediate', label: 'Intermediate', description: 'Mid-level challenges' },
  { value: 'advanced', label: 'Advanced', description: 'Senior-level questions' },
];

export const ROUND_TYPES: { value: RoundType; label: string; description: string }[] = [
  { value: 'technical', label: 'Technical', description: 'Role-specific technical questions' },
  { value: 'behavioral', label: 'Behavioral', description: 'STAR format questions' },
  { value: 'situational', label: 'Situational', description: 'Scenario-based questions' },
  { value: 'mixed', label: 'Mixed', description: 'Combination of all types' },
];
