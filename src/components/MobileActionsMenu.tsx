import { useEffect } from 'react';
import { X, Info, Settings, RotateCcw, Trash2 } from 'lucide-react';

interface MobileActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInfo: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
  onClear: () => void;
}

export default function MobileActionsMenu({
  isOpen,
  onClose,
  onOpenInfo,
  onOpenSettings,
  onRefresh,
  onClear
}: MobileActionsMenuProps) {
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

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Slide-in Menu */}
      <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <h3 className="text-sm font-semibold text-gray-900">Menu</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <button
            onClick={() => handleAction(onOpenInfo)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition"
          >
            <Info className="h-5 w-5" />
            <span>Conversation Info</span>
          </button>

          <button
            onClick={() => handleAction(onOpenSettings)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => handleAction(onRefresh)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Restart Conversation</span>
          </button>

          <div className="border-t border-gray-200 my-2"></div>

          <button
            onClick={() => handleAction(onClear)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="h-5 w-5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            SyncPay Business Insights
          </p>
        </div>
      </div>
    </div>
  );
}
