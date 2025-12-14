import { useEffect } from 'react';
import { X, Info, MessageSquare, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import { formatFullTimestamp } from '../utils/timeUtils';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageCount: number;
  firstMessageTime: Date | null;
  conversationId: string | null;
}

export default function InfoModal({
  isOpen,
  onClose,
  messageCount,
  firstMessageTime,
  conversationId
}: InfoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const calculateDuration = () => {
    if (!firstMessageTime) return 'N/A';
    const now = new Date();
    const diffMs = now.getTime() - firstMessageTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Less than a minute';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Conversation Info</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Statistics */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversation Statistics
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Messages:</span>
                <span className="text-sm font-semibold text-gray-900">{messageCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Messages:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.ceil(messageCount / 2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="text-sm font-semibold text-gray-900">{calculateDuration()}</span>
              </div>
              {firstMessageTime && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Started:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatFullTimestamp(firstMessageTime)}
                  </span>
                </div>
              )}
              {conversationId && (
                <div className="flex justify-between items-start pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Session ID:</span>
                  <span className="text-xs font-mono text-gray-500 max-w-[200px] break-all">
                    {conversationId.substring(0, 16)}...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AI Model Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </h3>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Powered by GPT-4</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Advanced AI model optimized for business insights and analytics
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Usage Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 flex-shrink-0">•</span>
                <span>Be specific about time ranges and metrics for better insights</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 flex-shrink-0">•</span>
                <span>Ask follow-up questions to dive deeper into analytics</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 flex-shrink-0">•</span>
                <span>Request comparisons between different time periods</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 flex-shrink-0">•</span>
                <span>Use markdown for code snippets and formatted responses</span>
              </li>
            </ul>
          </div>

          {/* Privacy Notice */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Privacy & Data
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800 leading-relaxed">
                Your conversation is stored locally in your browser and automatically expires after 24 hours.
                No data is shared with third parties. You can disable chat history saving in settings.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
