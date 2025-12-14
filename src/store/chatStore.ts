import { create } from 'zustand';
import type { ChartData } from '../types';

export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessageMetadata {
  charts?: ChartData[];
  insightType?: string;
  processingTime?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: MessageStatus; // Only for user messages
  metadata?: ChatMessageMetadata;
}

interface ChatHistory {
  messages: ChatMessage[];
  conversationId: string | null;
  savedAt: number; // timestamp
}

// Helper function to validate chart data structure
const validateChartData = (chart: unknown): chart is ChartData => {
  if (!chart || typeof chart !== 'object') return false;
  
  const c = chart as Record<string, unknown>;
  
  // Check required fields
  if (!c.type || !c.title || !c.data) return false;
  
  // Validate type
  const validTypes = ['line', 'bar', 'pie', 'donut', 'area'];
  if (!validTypes.includes(c.type as string)) return false;
  
  // Validate data is array
  if (!Array.isArray(c.data)) return false;
  
  return true;
};

// Helper function to sanitize metadata
const sanitizeMetadata = (metadata?: ChatMessageMetadata): ChatMessageMetadata | undefined => {
  if (!metadata) return undefined;
  
  const sanitized: ChatMessageMetadata = {};
  
  // Validate and filter charts
  if (metadata.charts && Array.isArray(metadata.charts)) {
    const validCharts = metadata.charts.filter(validateChartData);
    if (validCharts.length > 0) {
      sanitized.charts = validCharts;
    }
  }
  
  // Copy other metadata fields
  if (metadata.insightType) {
    sanitized.insightType = metadata.insightType;
  }
  
  if (typeof metadata.processingTime === 'number') {
    sanitized.processingTime = metadata.processingTime;
  }
  
  // Return undefined if no valid metadata
  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
};

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  saveHistory: boolean; // Privacy setting
  addMessage: (role: 'user' | 'assistant', content: string, status?: MessageStatus, metadata?: ChatMessageMetadata) => void;
  updateMessageStatus: (messageId: string, status: MessageStatus) => void;
  updateMessageMetadata: (messageId: string, metadata: ChatMessageMetadata) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConversationId: (id: string | null) => void;
  setSaveHistory: (save: boolean) => void;
  loadHistory: () => void;
  restoreMessages: (messages: ChatMessage[], conversationId: string | null) => void;
  // Helper methods for charts
  hasCharts: (messageId: string) => boolean;
  getChartsByMessage: (messageId: string) => ChartData[];
}

const STORAGE_KEY = 'syncpay_chat_history';
const EXPIRY_HOURS = 24;

// Helper functions for localStorage
const saveToLocalStorage = (messages: ChatMessage[], conversationId: string | null) => {
  try {
    const history: ChatHistory = {
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp, // Will be serialized as string
      })),
      conversationId,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

const loadFromLocalStorage = (): ChatHistory | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const history: ChatHistory = JSON.parse(stored);

    // Check if expired (24 hours)
    const hoursSinceLastSave = (Date.now() - history.savedAt) / (1000 * 60 * 60);
    if (hoursSinceLastSave > EXPIRY_HOURS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Convert timestamp strings back to Date objects
    history.messages = history.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));

    return history;
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return null;
  }
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  conversationId: null,
  saveHistory: true, // Default to saving history

  addMessage: (role, content, status, metadata) => {
    // Validate and sanitize metadata
    const sanitizedMetadata = sanitizeMetadata(metadata);
    
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      status,
      metadata: sanitizedMetadata,
    };
    set((state) => {
      const updatedMessages = [...state.messages, newMessage];

      // Save to localStorage if privacy setting allows
      if (state.saveHistory) {
        saveToLocalStorage(updatedMessages, state.conversationId);
      }

      return { messages: updatedMessages };
    });
  },

  updateMessageStatus: (messageId, status) => {
    set((state) => {
      const updatedMessages = state.messages.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      );

      // Save to localStorage if privacy setting allows
      if (state.saveHistory) {
        saveToLocalStorage(updatedMessages, state.conversationId);
      }

      return { messages: updatedMessages };
    });
  },

  updateMessageMetadata: (messageId, metadata) => {
    set((state) => {
      const updatedMessages = state.messages.map(msg => {
        if (msg.id !== messageId) return msg;
        
        const sanitizedMetadata = sanitizeMetadata(metadata);
        return {
          ...msg,
          metadata: {
            ...msg.metadata,
            ...sanitizedMetadata,
          },
        };
      });

      // Save to localStorage if privacy setting allows
      if (state.saveHistory) {
        saveToLocalStorage(updatedMessages, state.conversationId);
      }

      return { messages: updatedMessages };
    });
  },

  clearMessages: () => {
    set({
      messages: [],
      conversationId: null,
      error: null,
    });
    clearLocalStorage();
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  setConversationId: (id) => {
    set((state) => {
      // Save to localStorage if privacy setting allows
      if (state.saveHistory) {
        saveToLocalStorage(state.messages, id);
      }
      return { conversationId: id };
    });
  },

  setSaveHistory: (save) => {
    set({ saveHistory: save });

    // If user disables history saving, clear existing history
    if (!save) {
      clearLocalStorage();
    } else {
      // If enabling, save current state
      const state = get();
      if (state.messages.length > 0) {
        saveToLocalStorage(state.messages, state.conversationId);
      }
    }
  },

  loadHistory: () => {
    const state = get();
    if (!state.saveHistory) return;

    const history = loadFromLocalStorage();
    if (history && history.messages.length > 0) {
      set({
        messages: history.messages,
        conversationId: history.conversationId,
      });
    }
  },

  restoreMessages: (messages, conversationId) => {
    set({ messages, conversationId });
    const state = get();
    if (state.saveHistory) {
      saveToLocalStorage(messages, conversationId);
    }
  },

  // Helper method to check if a message has charts
  hasCharts: (messageId) => {
    const state = get();
    const message = state.messages.find(msg => msg.id === messageId);
    return !!(message?.metadata?.charts && message.metadata.charts.length > 0);
  },

  // Helper method to get charts for a specific message
  getChartsByMessage: (messageId) => {
    const state = get();
    const message = state.messages.find(msg => msg.id === messageId);
    return message?.metadata?.charts || [];
  },
}));
