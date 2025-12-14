import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

type ConnectionState = 'online' | 'offline' | 'reconnecting';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionState>('online');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleOnline = () => setStatus('online');
    const handleOffline = () => {
      setStatus('offline');
      // Auto-retry after 3 seconds
      setTimeout(() => {
        if (!navigator.onLine) {
          setStatus('reconnecting');
          // Simulate reconnection attempt
          setTimeout(() => {
            setStatus(navigator.onLine ? 'online' : 'offline');
          }, 2000);
        }
      }, 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setStatus(navigator.onLine ? 'online' : 'offline');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: Wifi,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'Connected'
        };
      case 'reconnecting':
        return {
          icon: RefreshCw,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          label: 'Reconnecting...'
        };
      case 'offline':
        return {
          icon: WifiOff,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'Offline'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`flex items-center space-x-1.5 px-2 py-1 ${config.bg} border ${config.border} rounded-full`}>
        <Icon className={`h-3 w-3 ${config.color} ${status === 'reconnecting' ? 'animate-spin' : ''}`} />
        {status !== 'online' && (
          <span className={`text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
          {config.label}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-gray-900"></div>
        </div>
      )}
    </div>
  );
}
