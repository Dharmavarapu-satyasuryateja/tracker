export type ActivityCategory = 'fitness' | 'nutrition' | 'study' | 'mental' | 'recovery';

export interface Habit {
  id: string;
  name: string;
  category: ActivityCategory;
  time: string;
  completed: boolean;
  points: number;
  description: string;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'mobility' | 'stability' | 'strength' | 'agility';
  description: string;
  steps: string[];
  target: string;
  benefitsForCricket: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface JourneyStage {
  id: string;
  title: string;
  timeRange: string;
  iconName: string; // lucide icon name
  description: string;
  challenge: string;
  solution: string;
  activities: string[];
}

export interface DailyLog {
  date: string;
  sleepHours: number;
  studyHours: number;
  trainingHours: number;
  hydrationLiters: number;
  proteinGrams: number;
  fatigueLevel: number; // 1 to 5 scale
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
