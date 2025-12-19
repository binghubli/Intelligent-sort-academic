import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface FractionFactoryProps {
  onComplete: (success: boolean) => void;
}

export const FractionFactory: React.FC<FractionFactoryProps> = ({ onComplete }) => {
  const [denominator, setDenominator] = useState(4);
  const [targetNumerator, setTargetNumerator] = useState(1);
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);
  const [message, setMessage] = useState("点击圆饼，选出正确的部分！");
  const [level, setLevel] = useState(1);

  useEffect(() => {
    generateLevel();
  }, [level]);

  const generateLevel = () => {
    const newDenom = Math.min(4 + level, 12); // Increase complexity
    const newNum = Math.floor(Math.random() * (newDenom - 1)) + 1;
    setDenominator(newDenom);
    setTargetNumerator(newNum);
    setSelectedSegments([]);
    setMessage("点击圆饼，选出正确的部分！");
  };

  const handleSegmentClick = (index: number) => {
    if (selectedSegments.includes(index)) {
      setSelectedSegments(selectedSegments.filter(i => i !== index));
    } else {
      setSelectedSegments([...selectedSegments, index]);
    }
  };

  const checkAnswer = () => {
    if (selectedSegments.length === targetNumerator) {
      setMessage("🎉 太棒了！答对了！");
      onComplete(true);
      setTimeout(() => setLevel(l => l + 1), 1500);
    } else {
      setMessage("🤔 好像不对哦，再试一次！");
      onComplete(false);
    }
  };

  // Prepare data for Recharts Pie
  const data = Array.from({ length: denominator }).map((_, i) => ({
    name: `Part ${i + 1}`,
    value: 1,
    selected: selectedSegments.includes(i)
  }));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full text-center">
        <h3 className="text-xl font-bold text-gray-700 mb-2">关卡 {level}: 分数工厂</h3>
        <p className="text-2xl font-black text-brand-blue mb-4">
          请选出 <span className="text-4xl align-middle px-2">{targetNumerator}/{denominator}</span>
        </p>
        <p className="text-gray-500">{message}</p>
      </div>

      <div className="w-64 h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={100}
              dataKey="value"
              stroke="#fff"
              strokeWidth={3}
              onClick={(_, index) => handleSegmentClick(index)}
              cursor="pointer"
              animationDuration={300}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.selected ? '#60A5FA' : '#E5E7EB'} 
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Helper overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white font-bold drop-shadow-md text-xl">
            {selectedSegments.length}/{denominator}
          </span>
        </div>
      </div>

      <Button onClick={checkAnswer} size="lg" className="w-full md:w-auto">
        提交答案
      </Button>
    </div>
  );
};