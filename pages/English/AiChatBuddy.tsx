import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { createEnglishTutorChat } from '../../services/geminiService';
import { Button } from '../../components/Button';
import { Send, Bot, User } from 'lucide-react';
import { Chat } from '@google/genai';

export const AiChatBuddy: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    chatRef.current = createEnglishTutorChat();
    // Initial greeting
    setMessages([
      { role: 'model', text: "Hello! I am Mikey. What is your name? 👋" }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text || "Sorry, I didn't understand that.";
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Oops! My brain is tired. Try again later.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl shadow-sm border-2 border-purple-100 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Mikey 老师</h3>
          <div className="flex items-center gap-1 text-xs text-green-500 font-bold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Online
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-blue text-white' : 'bg-brand-purple text-white'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand-blue text-white rounded-tr-none' 
                : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
            }`}>
              <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center text-white">
              <Bot size={16} />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Say hello..."
          className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple focus:outline-none bg-gray-50"
          disabled={isLoading}
        />
        <Button 
          variant="secondary" 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          className="!px-4"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};