import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { generateMathBatch } from '../../services/geminiService';
import { MathProblem } from '../../types';
import { ChevronRight, Check, X, BookOpen } from 'lucide-react';

interface MathDashboardProps {
  addPoints: (points: number) => void;
}

// Data structure representing the curriculum
const CURRICULUM = [
  {
    semester: '上册 (Vol.1)',
    chapters: [
      { id: 'v1-1', title: '大数的认识', desc: '亿以内数的读写与大小比较', color: 'bg-red-50 border-red-100 text-red-600' },
      { id: 'v1-2', title: '角的度量', desc: '认识射线、直线、角度测量', color: 'bg-orange-50 border-orange-100 text-orange-600' },
      { id: 'v1-3', title: '三位数乘两位数', desc: '笔算乘法与积的变化规律', color: 'bg-yellow-50 border-yellow-100 text-yellow-600' },
      { id: 'v1-4', title: '平行四边形和梯形', desc: '图形特征与高的画法', color: 'bg-green-50 border-green-100 text-green-600' },
      { id: 'v1-5', title: '除数是两位数的除法', desc: '试商技巧与商的变化规律', color: 'bg-teal-50 border-teal-100 text-teal-600' },
      { id: 'v1-6', title: '统计', desc: '复式条形统计图分析', color: 'bg-blue-50 border-blue-100 text-blue-600' },
      { id: 'v1-7', title: '数学广角', desc: '优化策略与田忌赛马问题', color: 'bg-purple-50 border-purple-100 text-purple-600' },
    ]
  },
  {
    semester: '下册 (Vol.2)',
    chapters: [
      { id: 'v2-1', title: '四则运算', desc: '加减乘除混合运算顺序', color: 'bg-pink-50 border-pink-100 text-pink-600' },
      { id: 'v2-2', title: '观察物体', desc: '从不同方向观察立体图形', color: 'bg-rose-50 border-rose-100 text-rose-600' },
      { id: 'v2-3', title: '运算定律', desc: '加法与乘法的交换律、结合律、分配律', color: 'bg-cyan-50 border-cyan-100 text-cyan-600' },
      { id: 'v2-4', title: '三角形', desc: '特性、分类与内角和', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
      { id: 'v2-5', title: '小数的意义和加减法', desc: '小数性质与简单计算', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
      { id: 'v2-6', title: '解决问题的策略', desc: '画图、列表与假设法', color: 'bg-violet-50 border-violet-100 text-violet-600' },
    ]
  },
  {
    semester: '综合挑战',
    chapters: [
      { id: 'review', title: '总复习', desc: '全书知识点大挑战！', color: 'bg-slate-100 border-slate-200 text-slate-700' }
    ]
  }
];

export const MathDashboard: React.FC<MathDashboardProps> = ({ addPoints }) => {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MathProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const loadChapter = async (chapterTitle: string) => {
    setLoading(true);
    setActiveChapter(chapterTitle);
    setQuestions([]);
    setCurrentQIndex(0);
    setFeedback(null);
    setUserAnswer('');

    try {
      const jsonStr = await generateMathBatch(chapterTitle);
      const data = JSON.parse(jsonStr);
      setQuestions(data);
    } catch (e) {
      console.error(e);
      // Fallback is handled in service
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!userAnswer) return;
    const currentQ = questions[currentQIndex];
    
    // Loose validation logic
    const cleanUser = userAnswer.replace(/\s+/g, '').trim();
    const cleanAns = String(currentQ.answer).replace(/\s+/g, '').trim();
    
    // Check for numeric equality if both are numbers
    const isNumeric = !isNaN(parseFloat(cleanUser)) && !isNaN(parseFloat(cleanAns));
    const isCorrect = isNumeric 
      ? Math.abs(parseFloat(cleanUser) - parseFloat(cleanAns)) < 0.01 
      : cleanUser.toLowerCase() === cleanAns.toLowerCase();

    if (isCorrect) {
      setFeedback({ isCorrect: true, msg: "🎉 太棒了！答案正确！" });
      addPoints(10);
    } else {
      setFeedback({ isCorrect: false, msg: `❌ 哎呀，正确答案是: ${currentQ.answer}` });
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setUserAnswer('');
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Finished batch
      setActiveChapter(null);
      setQuestions([]);
    }
  };

  // 1. Chapter Selection View
  if (!activeChapter) {
    return (
      <div className="space-y-8 animate-fade-in pb-10">
        <h2 className="text-2xl font-black text-gray-700 flex items-center gap-2">
           <BookOpen className="text-brand-blue" />
           选择一个章节开始挑战吧！
        </h2>
        
        {CURRICULUM.map((group) => (
          <div key={group.semester}>
            <h3 className="text-lg font-bold text-gray-400 mb-3 ml-1 border-b-2 border-gray-100 pb-1 inline-block">
              {group.semester}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.chapters.map(chap => (
                <div 
                  key={chap.id}
                  onClick={() => loadChapter(chap.title)}
                  className={`${chap.color} p-5 rounded-2xl border-2 cursor-pointer hover:scale-102 hover:shadow-md transition-all flex items-center justify-between group`}
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{chap.title}</h3>
                    <p className="text-sm opacity-80 font-bold">{chap.desc}</p>
                  </div>
                  <div className="bg-white/40 p-2 rounded-full ml-4">
                    <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Loading View
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold text-brand-blue">AI 老师正在出题中...</p>
        <p className="text-gray-400">正在生成 {activeChapter} 的题目</p>
      </div>
    );
  }

  // 3. Quiz View
  const currentQ = questions[currentQIndex];
  if (!currentQ) return <div className="p-4 text-center">生成题目出错，请返回重试。 <Button onClick={() => setActiveChapter(null)}>返回</Button></div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <Button variant="secondary" size="sm" onClick={() => setActiveChapter(null)}>← 返回章节</Button>
        <div className="text-brand-blue font-bold text-lg">
          题目 {currentQIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-brand-blue/20 mb-6">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            {currentQ.type === 'calculation' ? '计算题' : '应用题'}
          </span>
          <span className="text-sm text-gray-400 font-bold">{activeChapter}</span>
        </div>
        
        <h3 className="text-2xl font-black text-gray-800 mb-8 leading-relaxed">
          {currentQ.question}
        </h3>

        {!feedback ? (
          <div className="flex gap-3">
            <input 
              type="text" 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="在这里输入答案..."
              className="flex-1 p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none font-bold"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            <Button size="lg" onClick={handleSubmit}>提交</Button>
          </div>
        ) : (
          <div className={`p-6 rounded-2xl ${feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2 animate-pulse-once`}>
            <div className="flex items-center gap-3 mb-2">
              {feedback.isCorrect ? <Check className="text-green-600 w-8 h-8" /> : <X className="text-red-600 w-8 h-8" />}
              <p className={`text-xl font-black ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {feedback.msg}
              </p>
            </div>
            <p className="text-gray-600 font-bold ml-11 mb-4">{currentQ.explanation}</p>
            
            <div className="flex justify-end">
              {currentQIndex < questions.length - 1 ? (
                <Button onClick={nextQuestion} variant={feedback.isCorrect ? 'success' : 'primary'}>下一题 →</Button>
              ) : (
                <Button onClick={() => setActiveChapter(null)} variant="secondary">完成练习 🏆</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};