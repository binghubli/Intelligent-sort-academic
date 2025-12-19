import React from 'react'; // Fix: Import React to resolve namespace error

export enum Subject {
  MATH = 'MATH',
  ENGLISH = 'ENGLISH'
}

export interface UserProgress {
  stars: number;
  level: number;
  mathScore: number;
  englishScore: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface MathProblem {
  question: string;
  type: 'multiplication' | 'division' | 'fraction' | 'geometry';
  answer: number | string;
  options?: string[]; // For multiple choice if needed
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}