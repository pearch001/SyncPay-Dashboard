import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export default function ErrorAlert({ error, onRetry, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-red-800">{error}</p>
        </div>
        <div className="flex items-center space-x-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-red-700 hover:text-red-900 hover:bg-red-100 rounded transition"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
