import { useEffect, useState } from 'react';
import { X, Keyboard, Command } from 'lucide-react';

export default function ShortcutsHint() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen shortcuts before
    const hasSeenShortcuts = localStorage.getItem('syncpay_shortcuts_seen');
    if (!hasSeenShortcuts) {
      // Show after 2 seconds delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('syncpay_shortcuts_seen', 'true');
  };

  if (!isVisible) return null;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-sm animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Keyboard className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Focus input</span>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">
              {modKey} K
            </kbd>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Clear chat</span>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">
              {modKey} L
            </kbd>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Clear input</span>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">
              Esc
            </kbd>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Send message</span>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">
              Enter
            </kbd>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">New line</span>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">
              Shift + Enter
            </kbd>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={handleClose}
          className="mt-3 w-full px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded font-medium transition"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
