import { useState } from 'react';
import { MessageSquare, Clock, TrendingUp } from 'lucide-react';

interface ConversationContextProps {
  messageCount: number;
  sessionDuration: string;
  onClick: () => void;
}

export default function ConversationContext({
  messageCount,
  sessionDuration,
  onClick
}: ConversationContextProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (messageCount === 0) return null;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-full text-xs font-medium text-primary-700 transition cursor-pointer"
      title="View conversation details"
    >
      <MessageSquare className="h-3.5 w-3.5" />
      <span className="flex items-center space-x-1">
        {isHovered ? (
          <>
            <Clock className="h-3 w-3" />
            <span>{sessionDuration}</span>
            <span>·</span>
            <TrendingUp className="h-3 w-3" />
            <span>{messageCount} msgs</span>
          </>
        ) : (
          <>
            <span>Session: {sessionDuration}</span>
          </>
        )}
      </span>
    </button>
  );
}
