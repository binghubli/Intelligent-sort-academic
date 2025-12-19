import React, { useState } from 'react';
import { AiChatBuddy } from './AiChatBuddy';
import { Button } from '../../components/Button';

interface EnglishDashboardProps {
  addPoints: (points: number) => void;
}

const words = [
  { en: "Elephant", cn: "大象", emoji: "🐘" },
  { en: "Umbrella", cn: "雨伞", emoji: "☂️" },
  { en: "Mountain", cn: "山", emoji: "⛰️" },
  { en: "Library", cn: "图书馆", emoji: "📚" },
];

export const EnglishDashboard: React.FC<EnglishDashboardProps> = ({ addPoints }) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'chat'>('chat');
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev + 1) % words.length);
      addPoints(2);
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Button 
          variant={activeTab === 'chat' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('chat')}
        >
          💬 AI 对话练习
        </Button>
        <Button 
          variant={activeTab === 'flashcards' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('flashcards')}
        >
          📇 单词大冒险
        </Button>
      </div>

      {activeTab === 'chat' && (
        <div className="animate-fade-in">
          <AiChatBuddy />
        </div>
      )}

      {activeTab === 'flashcards' && (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl p-8 border-2 border-purple-100 shadow-sm animate-fade-in">
          <div 
            className="perspective-1000 w-64 h-80 cursor-pointer group"
            onClick={() => setFlipped(!flipped)}
          >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-brand-yellow rounded-3xl flex flex-col items-center justify-center border-4 border-yellow-400 shadow-xl p-4">
                <div className="text-8xl mb-4">{words[currentCard].emoji}</div>
                <h3 className="text-3xl font-black text-white drop-shadow-md">{words[currentCard].en}</h3>
                <p className="mt-4 text-yellow-800 font-bold bg-white/30 px-4 py-1 rounded-full">点击翻转</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-brand-purple rounded-3xl flex flex-col items-center justify-center border-4 border-purple-400 shadow-xl p-4">
                <h3 className="text-4xl font-black text-white">{words[currentCard].cn}</h3>
                <div className="mt-8 text-6xl opacity-50">{words[currentCard].emoji}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <Button onClick={nextCard} size="lg">下一个单词</Button>
          </div>
        </div>
      )}
    </div>
  );
};