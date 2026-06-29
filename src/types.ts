/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  complexity?: string;
  architecture?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  duration: string;
  description?: string;
}

export interface Contact {
  email: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  experience: WorkExperience[];
  education: Education[];
  contact: Contact;
  theme: 'galaxy' | 'cyberpunk' | 'minimal' | 'terminal';
  fontClass: 'font-sans' | 'font-mono' | 'font-serif' | 'font-space';
  primaryColor: string;
  secondaryColor: string;
  avatarUrl?: string;
  isPublished: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface MockInterviewQuestion {
  id: string;
  category: 'dsa' | 'system-design' | 'behavioral';
  question: string;
  hints: string[];
  userAnswer?: string;
  feedback?: {
    score: number; // 0 to 100
    strengths: string[];
    improvements: string[];
    sampleAnswer: string;
  };
}

export interface ResumeOptimization {
  originalText: string;
  optimizedText: string;
  bulletPoints: string[];
  atsScore: number;
  suggestions: string[];
}

export interface VisitorMetric {
  date: string;
  visitors: number;
  questionsAsked: number;
  timeSpentSec: number;
  projectClicks: number;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  avgTimeSpentMin: number;
  totalQuestions: number;
  clickThroughRate: number;
  visitorsOverTime: VisitorMetric[];
  mostViewedProjects: { projectId: string; projectTitle: string; views: number }[];
}

export interface UserSession {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
}
