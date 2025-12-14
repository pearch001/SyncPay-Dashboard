import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface Insight {
  id: number;
  text: string;
  icon?: string;
}

const insightsSets = [
  [
    { id: 1, text: 'Revenue increased 21% this month - highest growth in Q4', icon: '📈' },
    { id: 2, text: 'Success rate is 12% above industry average', icon: '✅' },
    { id: 3, text: 'Peak transaction hours: 2PM - 6PM WAT', icon: '⏰' },
    { id: 4, text: 'Recommended: Expand merchant network in Lagos', icon: '💡' },
  ],
  [
    { id: 1, text: 'User retention improved by 18% compared to last quarter', icon: '📊' },
    { id: 2, text: 'Mobile transactions account for 73% of total volume', icon: '📱' },
    { id: 3, text: 'Average transaction value increased to ₦12,500', icon: '💰' },
    { id: 4, text: 'Suggested: Optimize checkout flow for faster processing', icon: '⚡' },
  ],
  [
    { id: 1, text: 'Customer satisfaction scores reached all-time high of 4.8/5', icon: '⭐' },
    { id: 2, text: 'Failed transactions reduced by 34% after recent updates', icon: '🎯' },
    { id: 3, text: 'Weekend transactions show 45% increase in volume', icon: '📅' },
    { id: 4, text: 'Opportunity: Launch loyalty rewards program', icon: '🎁' },
  ],
];

export default function AIInsightCard() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentSetIndex((prev) => (prev + 1) % insightsSets.length);
      setIsRefreshing(false);
    }, 600);
  };

  const currentInsights = insightsSets[currentSetIndex];

  return (
    <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-lg shadow-lg p-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI-Powered Insights</h3>
              <p className="text-primary-100 text-sm">Real-time business intelligence</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-lg transition disabled:opacity-50"
            title="Refresh insights"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Insights List */}
        <div className="space-y-3 mb-4">
          {currentInsights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition"
            >
              <span className="text-xl flex-shrink-0">{insight.icon}</span>
              <p className="text-white text-sm leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI Assistant
          </span>
          <span className="text-primary-100 text-xs">
            Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
