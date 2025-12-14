import { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, Trash2, Send, Info, Settings, RotateCcw, Menu, Mic, BarChart3 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import ConfirmModal from '../components/ConfirmModal';
import ErrorAlert from '../components/ErrorAlert';
import InfoModal from '../components/InfoModal';
import SettingsModal from '../components/SettingsModal';
import MobileActionsMenu from '../components/MobileActionsMenu';
import ShortcutsHint from '../components/ShortcutsHint';
import ConversationContext from '../components/ConversationContext';
import ConnectionStatus from '../components/ConnectionStatus';
import AIThinkingInsights from '../components/AIThinkingInsights';
import { useChatStore } from '../store/chatStore';
import type { MessageStatus } from '../store/chatStore';
import { sendChatMessage } from '../services/chatApi';

const MIN_INPUT_LENGTH = 2;
const MAX_INPUT_LENGTH = 1000;
const CHAR_WARNING_THRESHOLD = 800;
const MAX_INPUT_HEIGHT = 120;

// Chart detection keywords grouped by category
const CHART_KEYWORDS = {
  explicit: [
    'show chart', 'show graph', 'show plot', 'create chart', 'create graph',
    'visualize', 'visualization', 'draw chart', 'draw graph', 'display chart',
    'as a chart', 'as a graph', 'in a chart', 'in a graph', 'chart this',
    'graph this', 'plot this'
  ],
  trend: [
    'trend', 'over time', 'timeline', 'history', 'historical',
    'progression', 'growth over', 'change over', 'monthly', 'weekly',
    'daily', 'yearly', 'last 6 months', 'last 12 months', 'past year'
  ],
  comparison: [
    'compare', 'comparison', 'versus', 'vs', 'against', 'difference between',
    'how does', 'relative to'
  ],
  distribution: [
    'breakdown', 'distribution', 'split', 'composition', 'proportion',
    'percentage', 'share of', 'by category', 'by type', 'per'
  ],
  metrics: [
    'revenue trend', 'transaction volume', 'user growth', 'success rate',
    'failure rate', 'peak hours', 'top performing'
  ]
};

// Suggested chart types based on detected keywords
const CHART_TYPE_SUGGESTIONS: Record<string, string> = {
  trend: 'line',
  comparison: 'bar',
  distribution: 'pie',
  explicit: 'auto',
  metrics: 'auto'
};

// Detect if message requests chart visualization
const detectChartKeywords = (message: string): { 
  detected: boolean; 
  categories: string[]; 
  suggestedType: string | null;
} => {
  const lowerMessage = message.toLowerCase();
  const detectedCategories: string[] = [];
  
  for (const [category, keywords] of Object.entries(CHART_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        if (!detectedCategories.includes(category)) {
          detectedCategories.push(category);
        }
        break;
      }
    }
  }
  
  const detected = detectedCategories.length > 0;
  
  // Determine suggested chart type based on primary category
  let suggestedType: string | null = null;
  if (detected) {
    // Priority: explicit > trend > distribution > comparison > metrics
    const priority = ['explicit', 'trend', 'distribution', 'comparison', 'metrics'];
    for (const cat of priority) {
      if (detectedCategories.includes(cat)) {
        suggestedType = CHART_TYPE_SUGGESTIONS[cat];
        break;
      }
    }
  }
  
  return { detected, categories: detectedCategories, suggestedType };
};

const suggestedPrompts = [
  "Show me revenue trend for last 6 months",
  "What's our user growth rate?",
  "Analyze transaction success rates",
  "Suggest ways to increase revenue",
  "Show peak transaction hours",
  "What are the common transaction failures?",
];

export default function InsightsChat() {
  const [inputValue, setInputValue] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [lastUserMessageId, setLastUserMessageId] = useState<string | null>(null);
  const [showDelayedMessage, setShowDelayedMessage] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [liveRegionMessage, setLiveRegionMessage] = useState('');
  const [focusedMessageIndex, setFocusedMessageIndex] = useState<number>(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayedMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageRefs = useRef<(HTMLElement | null)[]>([]);

  const { messages, isLoading, error, saveHistory, conversationId, addMessage, clearMessages, setError, setConversationId, setLoading, loadHistory, setSaveHistory, updateMessageStatus } = useChatStore();

  // Detect chart keywords in current input
  const chartDetection = useMemo(() => {
    return detectChartKeywords(inputValue);
  }, [inputValue]);

  // Load chat history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Auto-focus input on desktop only (not mobile to avoid keyboard popup)
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile && inputRef.current) {
      // Delay to ensure component is mounted
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, []);

  // Handle keyboard visibility on mobile
  useEffect(() => {
    const handleResize = () => {
      // Scroll to bottom when keyboard appears/disappears
      if (messages.length > 0) {
        scrollToBottom(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [messages.length]);

  // Announce messages to screen readers
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const role = lastMessage.role === 'user' ? 'You' : 'AI Assistant';
      setLiveRegionMessage(`${role}: ${lastMessage.content}`);

      // Clear after announcement
      const timer = setTimeout(() => setLiveRegionMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // Update message refs array when messages change
  useEffect(() => {
    messageRefs.current = messageRefs.current.slice(0, messages.length);
  }, [messages.length]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + K: Focus input
      if (modKey && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setFocusedMessageIndex(-1);
        setLiveRegionMessage('Input focused');
      }

      // Cmd/Ctrl + L: Clear chat
      if (modKey && e.key === 'l') {
        e.preventDefault();
        handleClearChat();
      }

      // Esc: Clear input (only if input is focused)
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        e.preventDefault();
        setInputValue('');
        adjustTextareaHeight();
        setLiveRegionMessage('Input cleared');
      }

      // Arrow keys for message navigation (when not in input)
      if (document.activeElement !== inputRef.current && messages.length > 0) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const newIndex = focusedMessageIndex < 0 ? messages.length - 1 : Math.max(0, focusedMessageIndex - 1);
          setFocusedMessageIndex(newIndex);
          messageRefs.current[newIndex]?.focus();
          const msg = messages[newIndex];
          setLiveRegionMessage(`${msg.role === 'user' ? 'Your' : 'AI'} message: ${msg.content.substring(0, 100)}`);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (focusedMessageIndex >= 0) {
            const newIndex = Math.min(messages.length - 1, focusedMessageIndex + 1);
            setFocusedMessageIndex(newIndex);
            messageRefs.current[newIndex]?.focus();
            const msg = messages[newIndex];
            setLiveRegionMessage(`${msg.role === 'user' ? 'Your' : 'AI'} message: ${msg.content.substring(0, 100)}`);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedMessageIndex, messages]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, MAX_INPUT_HEIGHT);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const isUserAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  const scrollToBottom = (force = false) => {
    if (force || isUserAtBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading]);

  // Auto-dismiss errors after 10 seconds
  useEffect(() => {
    if (error) {
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      // Set new timeout
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 10000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error, setError]);

  // Show delayed message if loading takes > 3 seconds
  useEffect(() => {
    if (isLoading) {
      // Clear any existing timeout
      if (delayedMessageTimeoutRef.current) {
        clearTimeout(delayedMessageTimeoutRef.current);
      }

      // Set timeout for delayed message
      delayedMessageTimeoutRef.current = setTimeout(() => {
        setShowDelayedMessage(true);
      }, 3000);
    } else {
      // Clear delayed message when loading stops
      setShowDelayedMessage(false);
      if (delayedMessageTimeoutRef.current) {
        clearTimeout(delayedMessageTimeoutRef.current);
      }
    }

    return () => {
      if (delayedMessageTimeoutRef.current) {
        clearTimeout(delayedMessageTimeoutRef.current);
      }
    };
  }, [isLoading]);

  // Calculate session duration
  const getSessionDuration = (): string => {
    if (messages.length === 0) return '0 min';

    const firstMessage = messages[0];
    const now = new Date();
    const diffMs = now.getTime() - new Date(firstMessage.timestamp).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return '< 1 min';
    if (diffMins < 60) return `${diffMins} min`;

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateHeader = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {};

    messages.forEach((message) => {
      const dateKey = formatDateHeader(message.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Enforce max length
    if (newValue.length <= MAX_INPUT_LENGTH) {
      setInputValue(newValue);
    }

    // Clear any previous errors when user starts typing
    setError(null);
  };

  // Get line count for display
  const getLineCount = () => {
    return inputValue.split('\n').length;
  };

  // Check if input is valid for sending
  const isInputValid = () => {
    const trimmed = inputValue.trim();
    return trimmed.length >= MIN_INPUT_LENGTH && trimmed.length <= MAX_INPUT_LENGTH;
  };

  const handleSendMessage = async () => {
    // Validate input before sending
    if (!isInputValid() || isLoading || isSending) return;

    // Prevent multiple submissions
    setIsSending(true);

    // Store reference to current messages length to find user message later
    const messagesLengthBeforeAdd = messages.length;

    // Check if chart mode is detected for this message
    const shouldIncludeCharts = chartDetection.detected;

    try {
      // Trim the input
      const trimmedMessage = inputValue.trim();

      // Store last user message for retry functionality
      setLastUserMessage(trimmedMessage);

      // Add user message to chatStore with 'sending' status
      addMessage('user', trimmedMessage, 'sending');

      // Clear input field
      setInputValue('');

      // Clear any previous errors
      setError(null);

      // Set loading state (shows typing indicator)
      setLoading(true);

      // Scroll to bottom of messages
      scrollToBottom();

      // Focus back on input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Call the backend API with chart flag based on detection
      const response = await sendChatMessage(
        trimmedMessage,
        conversationId || undefined,
        shouldIncludeCharts // Use detected chart mode
      );

      // Update conversation ID if this is a new conversation
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      // Mark user message as sent
      // Get the user message we just added (it's at the messagesLengthBeforeAdd index)
      const currentMessages = useChatStore.getState().messages;
      const userMessage = currentMessages[messagesLengthBeforeAdd];
      if (userMessage && userMessage.role === 'user') {
        updateMessageStatus(userMessage.id, 'sent');
      }

      // Add AI response to chatStore with charts metadata
      addMessage('assistant', response.message, undefined, {
        charts: response.charts as any,
        processingTime: response.processingTimeMs,
      });

      // Log processing time for debugging
      if (response.processingTimeMs) {
        console.log(`AI response took ${response.processingTimeMs}ms`);
      }
      
      // Log charts if present
      if (response.charts && response.charts.length > 0) {
        console.log('Received charts:', response.charts);
      }

    } catch (err: any) {
      // Set error message
      const errorMessage = err?.message || 'Failed to send message. Please try again.';
      setError(errorMessage);

      // Mark user message as error
      const currentMessages = useChatStore.getState().messages;
      const userMessage = currentMessages[messagesLengthBeforeAdd];
      if (userMessage && userMessage.role === 'user') {
        updateMessageStatus(userMessage.id, 'error');
      }

      // Show error toast
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSending(false);
    }
  };

  const handleRetry = async () => {
    if (!lastUserMessage || isLoading || isSending) return;

    setIsSending(true);
    setError(null);
    setLoading(true);

    // Detect if the last message should include charts
    const retryChartDetection = detectChartKeywords(lastUserMessage);
    const shouldIncludeCharts = retryChartDetection.detected;

    try {
      // Call the backend API with the last user message
      const response = await sendChatMessage(
        lastUserMessage,
        conversationId || undefined,
        shouldIncludeCharts
      );

      // Update conversation ID if this is a new conversation
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      // Add AI response to chatStore with charts metadata
      addMessage('assistant', response.message, undefined, {
        charts: response.charts as any,
        processingTime: response.processingTimeMs,
      });

      // Log charts if present
      if (response.charts && response.charts.length > 0) {
        console.log('Received charts:', response.charts);
      }

      toast.success('Message resent successfully');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to retry message. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSending(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    clearMessages();
    setConversationId(null);
    setInputValue('');
    setShowClearConfirm(false);
    toast.success('Chat cleared');
  };

  const handleRefreshConversation = () => {
    setShowRefreshConfirm(true);
  };

  const confirmRefreshConversation = () => {
    clearMessages();
    setConversationId(null);
    setInputValue('');
    setError(null);
    setShowRefreshConfirm(false);
    toast.success('Conversation restarted');
  };

  const handleClearData = () => {
    clearMessages();
    setConversationId(null);
    setInputValue('');
    localStorage.removeItem('syncpay_sound_effects');
    setShowSettingsModal(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter key (without Shift), send message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // If Shift+Enter, allow new line (default behavior)
  };

  const handleSuggestedPromptClick = async (prompt: string) => {
    if (isLoading || isSending) return;

    setIsSending(true);
    setInputValue('');
    setLastUserMessage(prompt);

    // Store reference to current messages length
    const messagesLengthBeforeAdd = messages.length;

    // Detect if this prompt should include charts
    const promptChartDetection = detectChartKeywords(prompt);
    const shouldIncludeCharts = promptChartDetection.detected;

    try {
      // Add user message
      addMessage('user', prompt, 'sending');
      setError(null);
      setLoading(true);
      scrollToBottom();

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Call the backend API with chart detection
      const response = await sendChatMessage(
        prompt,
        conversationId || undefined,
        shouldIncludeCharts
      );

      // Update conversation ID if this is a new conversation
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      // Mark user message as sent
      const currentMessages = useChatStore.getState().messages;
      const userMessage = currentMessages[messagesLengthBeforeAdd];
      if (userMessage && userMessage.role === 'user') {
        updateMessageStatus(userMessage.id, 'sent');
      }

      // Add AI response with charts metadata
      addMessage('assistant', response.message, undefined, {
        charts: response.charts as any,
        processingTime: response.processingTimeMs,
      });

      // Log charts if present
      if (response.charts && response.charts.length > 0) {
        console.log('Received charts:', response.charts);
      }

    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to send message. Please try again.';
      setError(errorMessage);

      // Mark user message as error
      const currentMessages = useChatStore.getState().messages;
      const userMessage = currentMessages[messagesLengthBeforeAdd];
      if (userMessage && userMessage.role === 'user') {
        updateMessageStatus(userMessage.id, 'error');
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSending(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* Screen reader live region for announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveRegionMessage}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearChat}
        title="Clear Conversation"
        message="Are you sure you want to clear this conversation? This action cannot be undone."
      />

      <ConfirmModal
        isOpen={showRefreshConfirm}
        onClose={() => setShowRefreshConfirm(false)}
        onConfirm={confirmRefreshConversation}
        title="Restart Conversation"
        message="This will clear the current conversation and start fresh. Your chat history will be preserved if enabled."
      />

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        messageCount={messages.length}
        firstMessageTime={messages.length > 0 ? messages[0].timestamp : null}
        conversationId={conversationId}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        saveHistory={saveHistory}
        onToggleSaveHistory={setSaveHistory}
        onClearData={handleClearData}
      />

      <MobileActionsMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onOpenInfo={() => setShowInfoModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onRefresh={handleRefreshConversation}
        onClear={handleClearChat}
      />

      <ShortcutsHint />

      <main
        className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto"
        role="main"
        aria-label="Business Insights Chat Interface"
      >
      {/* TOP: Header Section (Fixed) */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Business Insights
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
              Ask me anything about your business metrics
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI Assistant
              </span>

              {/* Connection Status */}
              <ConnectionStatus />

              {/* Conversation Context */}
              <ConversationContext
                messageCount={messages.length}
                sessionDuration={getSessionDuration()}
                onClick={() => setShowInfoModal(true)}
              />

              {/* Privacy Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={saveHistory}
                  onChange={(e) => {
                    setSaveHistory(e.target.checked);
                    toast.success(e.target.checked ? 'Chat history will be saved' : 'Chat history disabled');
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition">
                  Save chat (24h)
                </span>
              </label>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <nav className="hidden sm:flex items-center space-x-2 flex-shrink-0" aria-label="Chat actions">
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Show conversation info"
              title="Conversation info"
            >
              <Info className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleRefreshConversation}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Restart conversation"
              title="Restart conversation"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="w-px h-6 bg-gray-300" role="separator" aria-hidden="true"></div>
            <button
              onClick={handleClearChat}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Clear chat history"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
              <span>Clear</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="sm:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Open mobile menu"
            aria-expanded={showMobileMenu}
            title="Menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Privacy Notice - Show when history is loaded */}
        {messages.length > 0 && saveHistory && (
          <div className="mt-3 text-xs text-gray-500 flex items-center space-x-1" role="note" aria-label="Privacy notice">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Chat history is saved locally and expires after 24 hours</span>
          </div>
        )}
      </header>

      {/* MIDDLE: Messages Container (Scrollable) */}
      <section
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50 px-3 sm:px-6 py-4 sm:py-6 overscroll-behavior-contain"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Show welcome screen if no messages */}
          {messages.length === 0 && !isLoading && (
            <>
              {/* Welcome Message */}
              <div className="text-center space-y-4 pt-8 pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-full p-4">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome to Business Insights
                </h2>
                <p className="text-lg text-gray-600">
                  Get AI-powered analysis of your business data
                </p>

                {/* Capabilities List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6 text-left">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">What I can help you with:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <span className="text-xl flex-shrink-0">📊</span>
                      <span className="text-gray-700">Revenue trends and forecasts</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-xl flex-shrink-0">👥</span>
                      <span className="text-gray-700">User behavior analysis</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-xl flex-shrink-0">💳</span>
                      <span className="text-gray-700">Transaction patterns</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-xl flex-shrink-0">💰</span>
                      <span className="text-gray-700">Fee optimization strategies</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-xl flex-shrink-0">📈</span>
                      <span className="text-gray-700">Growth opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600 text-center">
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedPromptClick(prompt)}
                      className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-full hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label={`Ask: ${prompt}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Render chat messages grouped by date */}
          {messages.length > 0 && (
            <div className="space-y-5">
              {Object.entries(groupMessagesByDate()).map(([dateHeader, dateMessages], groupIndex) => {
                // Calculate the starting index for this date group
                const previousGroups = Object.entries(groupMessagesByDate()).slice(0, groupIndex);
                const startIndex = previousGroups.reduce((sum, [, msgs]) => sum + msgs.length, 0);

                return (
                  <div key={dateHeader} className="space-y-4">
                    {/* Date Header */}
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm border border-gray-200">
                        <span className="text-xs font-medium text-gray-600">{dateHeader}</span>
                      </div>
                    </div>

                    {/* Messages for this date */}
                    <div className="space-y-3">
                      {dateMessages.map((msg, index) => {
                        const prevMsg = dateMessages[index - 1];
                        const isNewSpeaker = !prevMsg || prevMsg.role !== msg.role;
                        const messageIndex = startIndex + index;

                        return (
                          <div
                            key={msg.id}
                            className={isNewSpeaker ? 'mt-5' : 'mt-3'}
                            ref={(el) => (messageRefs.current[messageIndex] = el)}
                            tabIndex={0}
                          >
                            <ChatMessage
                              role={msg.role}
                              content={msg.content}
                              timestamp={msg.timestamp}
                              status={msg.status}
                              metadata={msg.metadata}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show typing indicator when AI is generating response */}
          {isLoading && (
            <>
              <TypingIndicator />

              {/* Show AI thinking insights if loading > 3 seconds */}
              <AIThinkingInsights isVisible={showDelayedMessage} />
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* BOTTOM: Input Section (Fixed - sticky on mobile) */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 safe-area-inset-bottom">
        <div className="max-w-4xl mx-auto">
          {/* Error Alert */}
          {error && (
            <ErrorAlert
              error={error}
              onRetry={lastUserMessage ? handleRetry : undefined}
              onDismiss={handleDismissError}
            />
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2 sm:gap-3"
            role="search"
            aria-label="Chat input form"
          >
            {/* Voice Input Button */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="p-2.5 sm:p-3 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed transition"
                aria-label="Voice input - Coming soon"
                title="Voice input - Coming soon"
              >
                <Mic className="h-5 w-5" aria-hidden="true" />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                Coming soon
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            <div className="flex-1 relative">
              <label htmlFor="chat-input" className="sr-only">
                Ask a question about your business
              </label>
              
              {/* Chart Mode Indicator */}
              {chartDetection.detected && inputValue.trim().length > 0 && (
                <div className="absolute -top-8 left-0 flex items-center gap-2 animate-fade-in">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200">
                    <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                    📊 Chart mode
                  </span>
                  {chartDetection.suggestedType && chartDetection.suggestedType !== 'auto' && (
                    <span className="text-xs text-gray-500">
                      Suggested: {chartDetection.suggestedType} chart
                    </span>
                  )}
                </div>
              )}
              <textarea
                id="chat-input"
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask about revenue, users, transactions..."
                rows={1}
                disabled={isLoading}
                aria-label="Chat message input"
                aria-describedby={inputValue.length > CHAR_WARNING_THRESHOLD ? "char-counter" : undefined}
                aria-invalid={inputValue.length > MAX_INPUT_LENGTH}
                className={`w-full resize-none rounded-lg border ${
                  chartDetection.detected && inputValue.trim().length > 0
                    ? 'border-primary-300 ring-1 ring-primary-200'
                    : inputValue.length > MAX_INPUT_LENGTH 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                } px-3 sm:px-4 py-2.5 sm:py-3 ${chartDetection.detected && inputValue.trim().length > 0 ? 'pr-24 sm:pr-28' : 'pr-16 sm:pr-20'} text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ minHeight: '44px' }}
              />

              {/* Chart icon indicator inside input */}
              {chartDetection.detected && inputValue.trim().length > 0 && (
                <div 
                  className="absolute right-14 sm:right-16 top-1/2 -translate-y-1/2 flex items-center"
                  title="Chart visualization will be generated"
                >
                  <BarChart3 className="w-4 h-4 text-primary-500 animate-pulse" aria-hidden="true" />
                </div>
              )}

              {/* Character counter and line count */}
              <div
                id="char-counter"
                className="absolute bottom-2.5 right-3 flex items-center space-x-2 text-xs"
                role="status"
                aria-live="polite"
              >
                {getLineCount() > 3 && (
                  <span className="text-gray-400" aria-label={`${getLineCount()} lines`}>
                    {getLineCount()} lines
                  </span>
                )}
                {inputValue.length > CHAR_WARNING_THRESHOLD && (
                  <span
                    className={`font-medium ${
                      inputValue.length >= MAX_INPUT_LENGTH ? 'text-red-600' : 'text-yellow-600'
                    }`}
                    aria-label={`${inputValue.length} of ${MAX_INPUT_LENGTH} characters`}
                  >
                    {inputValue.length}/{MAX_INPUT_LENGTH}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={!isInputValid() || isLoading || isSending}
              className="flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] sm:min-w-[120px]"
              aria-label={
                isLoading || isSending
                  ? isSending ? 'Sending message' : 'AI is thinking'
                  : 'Send message'
              }
              title={
                !isInputValid() && inputValue.length > 0
                  ? inputValue.trim().length < MIN_INPUT_LENGTH
                    ? `Minimum ${MIN_INPUT_LENGTH} characters required`
                    : `Maximum ${MAX_INPUT_LENGTH} characters allowed`
                  : undefined
              }
            >
              {isLoading || isSending ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">{isSending ? 'Sending...' : 'Thinking...'}</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" aria-hidden="true" />
                  Send
                </>
              )}
            </button>
          </form>
        </div>
      </footer>
      </main>
    </>
  );
}
