import { useEffect, useState } from 'react';
import { X, Settings, Volume2, VolumeX, Database, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveHistory: boolean;
  onToggleSaveHistory: (enabled: boolean) => void;
  onClearData: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  saveHistory,
  onToggleSaveHistory,
  onClearData
}: SettingsModalProps) {
  const [soundEffects, setSoundEffects] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load sound effects preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('syncpay_sound_effects');
    if (saved !== null) {
      setSoundEffects(saved === 'true');
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !showClearConfirm) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, showClearConfirm]);

  if (!isOpen) return null;

  const handleToggleSoundEffects = (enabled: boolean) => {
    setSoundEffects(enabled);
    localStorage.setItem('syncpay_sound_effects', enabled.toString());
    toast.success(enabled ? 'Sound effects enabled' : 'Sound effects disabled');
  };

  const handleClearData = () => {
    setShowClearConfirm(true);
  };

  const confirmClearData = () => {
    onClearData();
    setShowClearConfirm(false);
    toast.success('All chat data cleared');
  };

  return (
    <>
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearData}
        title="Clear All Data"
        message="This will permanently delete all chat history and settings. This action cannot be undone."
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
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
            {/* Save History Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Save Chat History</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Store conversations locally for 24 hours
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={saveHistory}
                  onChange={(e) => onToggleSaveHistory(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                  {soundEffects ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  <span>Sound Effects</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Play sounds for message notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => handleToggleSoundEffects(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Export Conversation (Future) */}
            <div>
              <button
                disabled
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
              >
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Conversation</span>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Download your conversation as JSON or Markdown
              </p>
            </div>

            {/* Clear Data */}
            <div>
              <button
                onClick={handleClearData}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition border border-red-200"
              >
                <Database className="h-4 w-4" />
                <span>Clear All Data</span>
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Permanently delete all chat history and settings
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
