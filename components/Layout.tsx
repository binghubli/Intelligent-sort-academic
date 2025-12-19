import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calculator, Languages, Star, Trophy } from 'lucide-react';
import { UserProgress, NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  progress: UserProgress;
}

const navItems: NavItem[] = [
  { label: '首页', path: '/', icon: <Home />, color: 'text-brand-blue' },
  { label: '趣味数学', path: '/math', icon: <Calculator />, color: 'text-brand-green' },
  { label: '快乐英语', path: '/english', icon: <Languages />, color: 'text-brand-purple' },
];

export const Layout: React.FC<LayoutProps> = ({ children, progress }) => {
  return (
    <div className="min-h-screen bg-sky-50 font-sans text-gray-800 pb-20 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md p-4 rounded-b-3xl mx-2 mt-2 border-b-4 border-gray-100">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-2xl animate-bounce">
              🌱
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-700 tracking-tight">
              智慧苗<span className="text-brand-blue">学院</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full border-2 border-gray-200">
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <Star className="fill-current w-5 h-5" />
              <span>{progress.stars}</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-1 text-brand-purple font-bold">
              <Trophy className="w-5 h-5" />
              <span>Lv. {progress.level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl border-t border-gray-100 md:hidden flex justify-around p-3 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center p-2 rounded-xl transition-all
              ${isActive ? 'bg-sky-100 scale-110' : 'hover:bg-gray-50'}
            `}
          >
            <div className={`${item.color}`}>{item.icon}</div>
            <span className="text-xs font-bold text-gray-500 mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <nav className="hidden md:flex fixed top-32 left-8 flex-col gap-4">
         {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 p-4 rounded-2xl shadow-sm transition-all w-48 font-bold border-2
              ${isActive ? 'bg-white border-brand-blue scale-105 shadow-md' : 'bg-white/80 border-transparent hover:bg-white'}
            `}
          >
            <div className={`${item.color}`}>{item.icon}</div>
            <span className="text-gray-600">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};