import React, { useState } from 'react';
import { FractionFactory } from './FractionFactory';
import { Button } from '../../components/Button';
import { generateMathProblem } from '../../services/geminiService';

interface MathDashboardProps {
  addPoints: (points: number) => void;
}

export const MathDashboard: React.FC<MathDashboardProps> = ({ addPoints }) => {
  const [activeTab, setActiveTab] = useState<'fractions' | 'ai-quiz'>('fractions');
  const [aiQuestion, setAiQuestion] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleFractionComplete = (success: boolean) => {
    if (success) addPoints(10);
  };

  const loadAiQuestion = async () => {
    setAiLoading(true);
    setFeedback('');
    setUserAnswer('');
    try {
      // Rotate topics
      const topics = ['长方形的面积', '两位数乘法', '简单的除法', '三角形的周长'];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      const jsonStr = await generateMathProblem(topic);
      const data = JSON.parse(jsonStr);
      setAiQuestion(data);
    } catch (e) {
      console.error(e);
      setFeedback("加载题目失败，请检查API Key");
    } finally {
      setAiLoading(false);
    }
  };

  const checkAiAnswer = () => {
    if (!aiQuestion) return;
    if (userAnswer.trim() === String(aiQuestion.answer).trim()) {
      setFeedback("🎉 正确！" + aiQuestion.explanation);
      addPoints(20);
    } else {
      setFeedback("❌ 不对哦。答案是 " + aiQuestion.answer + "。 " + aiQuestion.explanation);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Button 
          variant={activeTab === 'fractions' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('fractions')}
        >
          🧩 分数工厂
        </Button>
        <Button 
          variant={activeTab === 'ai-quiz' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('ai-quiz')}
        >
          🤖 AI 挑战赛
        </Button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-brand-blue/20 min-h-[400px]">
        {activeTab === 'fractions' && (
          <FractionFactory onComplete={handleFractionComplete} />
        )}

        {activeTab === 'ai-quiz' && (
          <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
            {!aiQuestion && !aiLoading && (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">🧙‍♂️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">准备好接受AI巫师的挑战了吗？</h3>
                <Button onClick={loadAiQuestion} className="mt-4">开始挑战</Button>
              </div>
            )}

            {aiLoading && (
              <div className="text-center py-20">
                <div className="animate-spin text-4xl mb-2">⏳</div>
                <p className="font-bold text-gray-500">AI正在出题中...</p>
              </div>
            )}

            {aiQuestion && !aiLoading && (
              <div className="w-full space-y-6">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <span className="inline-block px-2 py-1 bg-blue-200 text-blue-700 text-xs font-bold rounded mb-2">
                    {aiQuestion.type === 'geometry' ? '几何' : '计算'}
                  </span>
                  <p className="text-xl font-bold text-gray-800">{aiQuestion.question}</p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="输入你的答案"
                    className="flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-brand-blue focus:outline-none text-lg font-bold"
                  />
                  <Button onClick={checkAiAnswer} disabled={!userAnswer}>提交</Button>
                </div>

                {feedback && (
                  <div className={`p-4 rounded-xl text-center font-bold animate-pulse ${feedback.includes('🎉') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback}
                    {feedback.includes('🎉') && (
                       <div className="mt-4">
                         <Button size="sm" onClick={loadAiQuestion}>下一题</Button>
                       </div>
                    )}
                     {feedback.includes('❌') && (
                       <div className="mt-4">
                         <Button size="sm" onClick={loadAiQuestion} variant="secondary">试下一题</Button>
                       </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};