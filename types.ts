import React from 'react';

export enum Subject {
  MATH = 'MATH',
  ENGLISH = 'ENGLISH'
}

export interface UserProgress {
  stars: number;
  level: number;
  mathScore: number;
  englishScore: number;
  // New stats
  wordsLearned: number;
  mathSolved: number;
  // Daily tracking
  lastLoginDate: string;
  dailyMathCount: number;
  dailyWordCount: number;
}

export interface MathProblem {
  question: string;
  type: string;
  answer: string | number;
  explanation: string;
}

export interface EnglishQuiz {
  chinese: string;
  english: string;
  missingWord: string; // The word to hide
  options: string[]; // Options for the blank
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

export interface WordCard {
  en: string;
  cn: string;
  emoji: string;
  ipa: string; // Added International Phonetic Alphabet
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}