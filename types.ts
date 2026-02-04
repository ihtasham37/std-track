
export type AppMode = 'SKILL' | 'UNIVERSITY' | 'SCHOLARSHIP' | 'JOB';

export interface UserProfile {
  name: string;
  age: number;
  education: string;
  country: string;
  skills: string[];
  interests: string[];
  targetField?: string;
  targetCountry?: string;
  language?: string;
  targetCity?: string;
  targetJob?: string;
  secretKey?: string;
  fullName?: string;
  username?: string;
  email?: string;
}

export interface Task {
  title: string;
  platform: string;
  duration: string;
  course: string;
}

export interface WeeklyPlan {
  week: number;
  tasks: Task[];
}

export interface DailyLog {
  date: number;
  update: string;
}

export interface CourseSuggestion {
  title: string;
  url: string;
  platform: string;
  description: string;
  type: 'youtube' | 'website';
}

export interface UniversitySuggestion {
  name: string;
  degree: string;
  location: string;
  description: string;
  website: string;
}

export interface ScholarshipSuggestion {
  name: string;
  provider: string;
  coverage: string;
  description: string;
  link: string;
}

export interface JobSuggestion {
  title: string;
  company: string;
  location: string;
  description: string;
  link: string;
}

export interface AIResult {
  id: string;
  mode: AppMode;
  timestamp: number;
  profile: UserProfile;
  summary: string;
  title?: string; // New: Custom title for history sidebar
  courses?: CourseSuggestion[];
  universities?: UniversitySuggestion[];
  scholarships?: ScholarshipSuggestion[];
  jobs?: JobSuggestion[];
  weekly_plan?: WeeklyPlan[];
  career_suggestions?: string[];
  logs?: DailyLog[];
}
