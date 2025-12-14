import { useState, useEffect } from 'react';
import { Brain, TrendingUp, BarChart3, Users, CreditCard, DollarSign } from 'lucide-react';

const thinkingMessages = [
  { text: 'Analyzing transaction data...', icon: CreditCard },
  { text: 'Calculating revenue trends...', icon: TrendingUp },
  { text: 'Processing user behavior patterns...', icon: Users },
  { text: 'Generating business insights...', icon: Brain },
  { text: 'Evaluating performance metrics...', icon: BarChart3 },
  { text: 'Optimizing recommendations...', icon: DollarSign },
];

interface AIThinkingInsightsProps {
  isVisible: boolean;
}

export default function AIThinkingInsights({ isVisible }: AIThinkingInsightsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentIndex(0);
      return;
    }

    // Rotate messages every 2 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % thinkingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const currentMessage = thinkingMessages[currentIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="flex justify-center my-4 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-primary-500 rounded-full p-2">
              <Icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {currentMessage.text}
            </span>
            <div className="flex items-center space-x-1 mt-1">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">AI is thinking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
