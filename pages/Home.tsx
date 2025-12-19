import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { UserProgress } from '../types';

interface HomeProps {
  progress: UserProgress;
}

export const Home: React.FC<HomeProps> = ({ progress }) => {
  const navigate = useNavigate();

  const data = [
    { name: '数学', value: progress.mathScore, color: '#60A5FA' },
    { name: '英语', value: progress.englishScore, color: '#A78BFA' },
    { name: '剩余', value: 100 - (progress.mathScore + progress.englishScore) / 2, color: '#E5E7EB' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green"></div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">欢迎回来, 小小探险家! 👋</h2>
        <p className="text-gray-500 mb-6">今天你想挑战什么新知识呢？</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/math')}
            className="cursor-pointer group bg-blue-50 hover:bg-blue-100 rounded-2xl p-6 transition-all border-2 border-blue-100 hover:border-blue-300"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📐</div>
            <h3 className="text-xl font-bold text-blue-700">数学探险</h3>
            <p className="text-blue-500 text-sm">分数、几何与计算</p>
          </div>

          <div 
            onClick={() => navigate('/english')}
            className="cursor-pointer group bg-purple-50 hover:bg-purple-100 rounded-2xl p-6 transition-all border-2 border-purple-100 hover:border-purple-300"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🦁</div>
            <h3 className="text-xl font-bold text-purple-700">英语乐园</h3>
            <p className="text-purple-500 text-sm">单词、对话与故事</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>📊</span> 学习进度
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm font-bold text-gray-500">
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-brand-blue"></div> 数学 Lv.{Math.floor(progress.mathScore/20) + 1}</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-brand-purple"></div> 英语 Lv.{Math.floor(progress.englishScore/20) + 1}</div>
          </div>
        </div>

        <div className="bg-brand-yellow/20 rounded-3xl p-6 shadow-sm border-2 border-yellow-200 flex flex-col items-center justify-center text-center">
           <div className="text-5xl mb-4 animate-pulse">🎁</div>
           <h3 className="text-xl font-bold text-yellow-800 mb-2">每日奖励</h3>
           <p className="text-yellow-700 mb-4">完成今天的3个挑战，领取神秘宝箱！</p>
           <Button variant="secondary" size="sm">查看任务</Button>
        </div>
      </div>
    </div>
  );
};