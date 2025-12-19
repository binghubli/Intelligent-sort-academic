import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { UserProgress } from '../types';
import { CheckCircle, Circle, Calculator, BookOpen, Star, Trophy } from 'lucide-react';

interface HomeProps {
  progress: UserProgress;
}

export const Home: React.FC<HomeProps> = ({ progress }) => {
  const navigate = useNavigate();

  // Daily Goals
  const mathGoal = 4;
  const wordGoal = 5;
  const isMathDone = progress.dailyMathCount >= mathGoal;
  const isWordDone = progress.dailyWordCount >= wordGoal;
  const allDone = isMathDone && isWordDone;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">
              加油, 4年级的小学霸! 🚀
            </h2>
            <p className="text-gray-500">
              只要坚持每天进步一点点，就能收获大大的知识！
            </p>
          </div>
          <div className="bg-brand-yellow/20 p-4 rounded-2xl flex items-center gap-4 border-2 border-yellow-200">
             <div className="text-center">
                <div className="text-3xl font-black text-yellow-600">{progress.stars}</div>
                <div className="text-xs font-bold text-yellow-700 uppercase">星星</div>
             </div>
             <div className="w-px h-8 bg-yellow-300"></div>
             <div className="text-center">
                <div className="text-3xl font-black text-brand-purple">{progress.level}</div>
                <div className="text-xs font-bold text-purple-700 uppercase">等级</div>
             </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex flex-col items-center">
           <Calculator className="text-blue-400 w-8 h-8 mb-2" />
           <span className="text-2xl font-black text-blue-600">{progress.mathSolved}</span>
           <span className="text-xs text-blue-400 font-bold">已解数学题</span>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 flex flex-col items-center">
           <BookOpen className="text-purple-400 w-8 h-8 mb-2" />
           <span className="text-2xl font-black text-purple-600">{progress.wordsLearned}</span>
           <span className="text-xs text-purple-400 font-bold">已学单词/句子</span>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span>📅</span> 今日任务
        </h3>
        
        <div className="space-y-4">
          {/* Math Task */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
            <div className="flex items-center gap-3">
              {isMathDone ? <CheckCircle className="text-brand-green" /> : <Circle className="text-gray-300" />}
              <div>
                <p className="font-bold text-gray-700">完成 {mathGoal} 道数学题</p>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-brand-blue transition-all duration-500" 
                    style={{ width: `${Math.min(100, (progress.dailyMathCount / mathGoal) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <span className="text-sm font-bold text-gray-500">{progress.dailyMathCount}/{mathGoal}</span>
          </div>

          {/* Word Task */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
            <div className="flex items-center gap-3">
              {isWordDone ? <CheckCircle className="text-brand-green" /> : <Circle className="text-gray-300" />}
              <div>
                <p className="font-bold text-gray-700">学习 {wordGoal} 个单词或句子</p>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-brand-purple transition-all duration-500" 
                    style={{ width: `${Math.min(100, (progress.dailyWordCount / wordGoal) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <span className="text-sm font-bold text-gray-500">{progress.dailyWordCount}/{wordGoal}</span>
          </div>
        </div>

        {allDone && (
          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center animate-bounce">
            <p className="text-yellow-700 font-bold text-lg">🎉 恭喜！今日任务全部完成！</p>
            <p className="text-sm text-yellow-600">明天继续保持哦！</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button size="lg" onClick={() => navigate('/math')} className="flex items-center justify-center gap-2">
          <Calculator size={20} /> 去做数学题
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate('/english')} className="flex items-center justify-center gap-2">
          <BookOpen size={20} /> 去学英语
        </Button>
      </div>
    </div>
  );
};