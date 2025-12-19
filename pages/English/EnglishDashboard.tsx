import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { generateEnglishQuiz } from '../../services/geminiService';
import { WordCard, EnglishQuiz } from '../../types';
import { Volume2 } from 'lucide-react';

interface EnglishDashboardProps {
  addPoints: (points: number) => void;
}

const STATIC_WORDS: WordCard[] = [
  { en: "Elephant", cn: "大象", emoji: "🐘", ipa: "/ˈel.ɪ.fənt/" },
  { en: "Library", cn: "图书馆", emoji: "📚", ipa: "/ˈlaɪ.brər.i/" },
  { en: "Delicious", cn: "美味的", emoji: "😋", ipa: "/dɪˈlɪʃ.əs/" },
  { en: "Computer", cn: "电脑", emoji: "💻", ipa: "/kəmˈpjuː.t̬ɚ/" },
  { en: "Adventure", cn: "探险", emoji: "🗺️", ipa: "/ədˈven.tʃɚ/" },
  { en: "Vacation", cn: "假期", emoji: "🏖️", ipa: "/veɪˈkeɪ.ʃən/" },
  { en: "Dinosaur", cn: "恐龙", emoji: "🦕", ipa: "/ˈdaɪ.nə.sɔːr/" },
  { en: "Astronaut", cn: "宇航员", emoji: "👨‍🚀", ipa: "/ˈæs.trə.nɑːt/" },
];

export const EnglishDashboard: React.FC<EnglishDashboardProps> = ({ addPoints }) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'quiz'>('flashcards');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Button 
          variant={activeTab === 'flashcards' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('flashcards')}
        >
          📇 有声单词卡
        </Button>
        <Button 
          variant={activeTab === 'quiz' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('quiz')}
        >
          🧩 小小翻译官
        </Button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'flashcards' && <AudioFlashcards addPoints={addPoints} />}
        {activeTab === 'quiz' && <SentenceQuiz addPoints={addPoints} />}
      </div>
    </div>
  );
};

// --- Sub Component: Audio Flashcards ---
const AudioFlashcards: React.FC<{ addPoints: (n: number) => void }> = ({ addPoints }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const word = STATIC_WORDS[currentIndex];

  const playAudio = (text: string, lang: 'en-US' | 'zh-CN') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // Slightly slower for kids
    window.speechSynthesis.speak(utterance);
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      playAudio(word.en, 'en-US');
      addPoints(1); // Point for revealing
    } else {
      playAudio(word.en, 'en-US'); // Replay audio
    }
  };

  const nextCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % STATIC_WORDS.length);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center animate-fade-in py-8">
      <div 
        className="relative w-72 h-96 cursor-pointer perspective-1000 group"
        onClick={handleCardClick}
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT (Before Click): Emoji + Chinese + Hint */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-4 border-brand-yellow shadow-xl flex flex-col items-center justify-center p-6 text-center">
            <div className="text-9xl mb-6 transform group-hover:scale-110 transition-transform">{word.emoji}</div>
            <h3 className="text-4xl font-black text-gray-800">{word.cn}</h3>
            <p className="mt-8 text-gray-400 font-bold text-sm bg-gray-100 px-3 py-1 rounded-full">点击看英语</p>
          </div>

          {/* BACK (After Click): English + IPA + Audio Hint */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-brand-purple rounded-3xl border-4 border-purple-400 shadow-xl flex flex-col items-center justify-center p-6 text-center text-white">
            <Volume2 className="w-12 h-12 mb-4 animate-pulse" />
            <h3 className="text-5xl font-black mb-2">{word.en}</h3>
            {/* Added IPA display */}
            <p className="text-xl text-purple-200 font-mono mb-2">{word.ipa}</p>
            <p className="text-lg text-purple-100 opacity-80 font-bold">{word.cn}</p>
            
            <div className="mt-12">
               <Button size="sm" variant="secondary" onClick={nextCard}>下一个 →</Button>
            </div>
          </div>

        </div>
      </div>
      <p className="mt-8 text-gray-500 font-bold">点击卡片翻转并朗读 🔊</p>
    </div>
  );
};

// --- Sub Component: Sentence Quiz (Fill in blanks) ---
const SentenceQuiz: React.FC<{ addPoints: (n: number) => void }> = ({ addPoints }) => {
  const [quizzes, setQuizzes] = useState<EnglishQuiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<'answering' | 'correct' | 'wrong'>('answering');

  const loadQuizzes = async () => {
    setLoading(true);
    setIdx(0);
    setStatus('answering');
    try {
      const json = await generateEnglishQuiz();
      const data = JSON.parse(json);
      setQuizzes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (selected: string) => {
    if (status !== 'answering') return;
    
    if (selected === quizzes[idx].missingWord) {
      setStatus('correct');
      addPoints(5);
      const utterance = new SpeechSynthesisUtterance(quizzes[idx].english);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      setStatus('wrong');
    }
  };

  const next = () => {
    if (idx < quizzes.length - 1) {
      setIdx(prev => prev + 1);
      setStatus('answering');
    } else {
      setQuizzes([]); // Clear to show start screen again
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">AI 正在编写题目...</div>;

  if (quizzes.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-sm border-2 border-brand-purple/20 animate-fade-in">
        <div className="text-6xl mb-4">🧙‍♀️</div>
        <h3 className="text-2xl font-black text-gray-800 mb-4">句子挑战</h3>
        <p className="text-gray-500 mb-8">AI会给你一个句子，请你帮它补全！</p>
        <Button size="lg" onClick={loadQuizzes}>开始挑战</Button>
      </div>
    );
  }

  const q = quizzes[idx];
  // Create sentence with blank
  const parts = q.english.split(q.missingWord);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-brand-purple/20 animate-fade-in-up max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question {idx + 1} / {quizzes.length}</span>
        
        <div className="mt-6 text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
          {parts[0]}
          <span className="inline-block min-w-[80px] border-b-4 border-brand-purple text-brand-purple px-2 text-center mx-1">
            {status !== 'answering' ? q.missingWord : '____'}
          </span>
          {parts[1]}
        </div>
        
        <p className="mt-4 text-gray-500 font-bold text-lg bg-gray-100 inline-block px-4 py-2 rounded-xl">
          {q.chinese}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {q.options.sort().map((opt) => (
          <button
            key={opt}
            onClick={() => checkAnswer(opt)}
            disabled={status !== 'answering'}
            className={`
              p-4 rounded-xl text-xl font-bold border-b-4 transition-all
              ${status === 'answering' 
                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 active:translate-y-1 active:border-b-0' 
                : opt === q.missingWord 
                  ? 'bg-green-500 text-white border-green-700' 
                  : 'bg-gray-100 text-gray-400 border-gray-200 opacity-50'
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>

      {status !== 'answering' && (
        <div className="mt-8 text-center animate-bounce">
          {status === 'correct' ? (
             <div className="text-green-600 font-bold text-xl mb-4">🎉 回答正确！</div>
          ) : (
             <div className="text-red-500 font-bold text-xl mb-4">😅 下次加油！正确答案是 {q.missingWord}</div>
          )}
          <Button onClick={next}>{idx < quizzes.length - 1 ? '下一题' : '完成挑战'}</Button>
        </div>
      )}
    </div>
  );
};