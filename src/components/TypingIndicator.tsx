import { Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 animate-fade-in">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="flex items-center bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-typing-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-typing-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-typing-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
}
