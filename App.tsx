import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { MathDashboard } from './pages/Math/MathDashboard';
import { EnglishDashboard } from './pages/English/EnglishDashboard';
import { UserProgress } from './types';

// Helper to persist state
const loadProgress = (): UserProgress => {
  const saved = localStorage.getItem('smartSproutProgress');
  const defaultState: UserProgress = { 
    stars: 50, 
    level: 1, 
    mathScore: 0, 
    englishScore: 0,
    wordsLearned: 0,
    mathSolved: 0,
    lastLoginDate: new Date().toDateString(),
    dailyMathCount: 0,
    dailyWordCount: 0
  };

  if (!saved) return defaultState;

  const parsed = JSON.parse(saved);
  // Merge with default to handle schema migrations for existing users
  return { ...defaultState, ...parsed };
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());

  // Check for daily reset on load
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastLoginDate !== today) {
      setProgress(prev => ({
        ...prev,
        lastLoginDate: today,
        dailyMathCount: 0,
        dailyWordCount: 0
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('smartSproutProgress', JSON.stringify(progress));
  }, [progress]);

  const addPoints = (points: number, type: 'MATH' | 'ENGLISH') => {
    setProgress(prev => {
      const newStars = prev.stars + points;
      const newLevel = Math.floor(newStars / 100) + 1;
      
      return {
        ...prev,
        stars: newStars,
        level: newLevel,
        mathScore: type === 'MATH' ? prev.mathScore + points : prev.mathScore,
        englishScore: type === 'ENGLISH' ? prev.englishScore + points : prev.englishScore,
        mathSolved: type === 'MATH' ? prev.mathSolved + 1 : prev.mathSolved,
        wordsLearned: type === 'ENGLISH' ? prev.wordsLearned + 1 : prev.wordsLearned,
        dailyMathCount: type === 'MATH' ? prev.dailyMathCount + 1 : prev.dailyMathCount,
        dailyWordCount: type === 'ENGLISH' ? prev.dailyWordCount + 1 : prev.dailyWordCount
      };
    });
  };

  return (
    <HashRouter>
      <Layout progress={progress}>
        <Routes>
          <Route path="/" element={<Home progress={progress} />} />
          <Route path="/math" element={<MathDashboard addPoints={(p) => addPoints(p, 'MATH')} />} />
          <Route path="/english" element={<EnglishDashboard addPoints={(p) => addPoints(p, 'ENGLISH')} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}