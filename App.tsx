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
  return saved ? JSON.parse(saved) : { stars: 50, level: 1, mathScore: 25, englishScore: 20 };
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());

  useEffect(() => {
    localStorage.setItem('smartSproutProgress', JSON.stringify(progress));
  }, [progress]);

  const addPoints = (points: number) => {
    setProgress(prev => {
      const newStars = prev.stars + points;
      const newLevel = Math.floor(newStars / 100) + 1;
      // Simple logic to increment subject scores visually
      const newMath = prev.mathScore < 100 ? prev.mathScore + (points > 0 ? 2 : 0) : 100;
      const newEng = prev.englishScore < 100 ? prev.englishScore + (points > 0 ? 2 : 0) : 100;
      
      return {
        ...prev,
        stars: newStars,
        level: newLevel,
        mathScore: newMath,
        englishScore: newEng
      };
    });
  };

  return (
    <HashRouter>
      <Layout progress={progress}>
        <Routes>
          <Route path="/" element={<Home progress={progress} />} />
          <Route path="/math" element={<MathDashboard addPoints={addPoints} />} />
          <Route path="/english" element={<EnglishDashboard addPoints={addPoints} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}