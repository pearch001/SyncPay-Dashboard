import api from './api';

// ============================================
// TypeScript Interfaces
// ============================================

export interface ChatRequest {
  message: string;
  conversationId?: string;
  includeCharts?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Chart {
  // TODO: Define chart structure based on backend response
  type?: string;
  data?: any;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  timestamp: string;
  processingTimeMs?: number;
  charts?: Chart[];
  sequenceNumber?: number | null;
  tokenCount?: number | null;
}

export interface StreamChatResponse {
  // For SSE streaming (implement later)
  chunk: string;
  done: boolean;
  conversationId?: string;
}

export interface ChatError {
  success: boolean;
  message: string;
  error?: string;
  code?: string;
  details?: string;
}

// ============================================
// API Functions
// ============================================

/**
 * Send a chat message to the AI assistant
 * @param message - User's message
 * @param conversationId - Optional conversation ID for context
 * @param includeCharts - Optional flag to include charts in response (default: true)
 * @returns AI response with conversation ID
 *
 * Endpoint: POST http://localhost:8080/api/v1/admin/insights/chat
 *
 * Request body:
 * {
 *   "message": "hello",
 *   "conversationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   "includeCharts": true
 * }
 *
 * Success response:
 * {
 *   "message": "Hello! How can I assist you today...",
 *   "conversationId": "ec7bb816-2db7-420d-9be2-0d7a431c1beb",
 *   "timestamp": "2025-12-14T14:59:53.007165274",
 *   "processingTimeMs": 4197,
 *   "charts": [],
 *   "sequenceNumber": null,
 *   "tokenCount": null
 * }
 *
 * Error response:
 * {
 *   "success": false,
 *   "message": "Error message here"
 * }
 */
export const sendChatMessage = async (
  message: string,
  conversationId?: string,
  includeCharts: boolean = true
): Promise<ChatResponse> => {
  try {
    // Prepare request body
    const requestBody: ChatRequest = {
      message,
      includeCharts,
    };

    // Add conversationId if provided
    if (conversationId) {
      requestBody.conversationId = conversationId;
    }

    // TODO: Update base URL to use environment variable
    // For now, hardcoding the endpoint based on provided curl command
    const response = await api.post<ChatResponse>(
      '/api/v1/admin/insights/chat',
      requestBody
    );

    // The axios interceptor already returns response.data, so we return it directly
    return response as unknown as ChatResponse;
  } catch (error: any) {
    // Handle error responses
    if (error.message) {
      throw new Error(error.message);
    }

    // Fallback error
    throw new Error('Failed to send message. Please try again.');
  }
};

/**
 * Send a chat message with streaming response (SSE)
 * @param message - User's message
 * @param conversationId - Optional conversation ID for context
 * @param onChunk - Callback function called for each chunk received
 * @param onComplete - Callback function called when streaming completes
 * @param onError - Callback function called on error
 *
 * TODO: Implement streaming version later
 * Expected endpoint: POST /api/v1/chat/stream or SSE endpoint
 *
 * This will use Server-Sent Events (SSE) or WebSocket for real-time streaming
 * of AI responses, providing a better UX with progressive text display.
 *
 * Example usage:
 * await sendChatMessageStream(
 *   "What's our revenue?",
 *   conversationId,
 *   (chunk) => console.log('Received:', chunk),
 *   (response) => console.log('Done:', response),
 *   (error) => console.error('Error:', error)
 * );
 */
export const sendChatMessageStream = async (
  message: string,
  conversationId?: string,
  onChunk?: (chunk: string) => void,
  onComplete?: (response: ChatResponse) => void,
  onError?: (error: ChatError) => void
): Promise<void> => {
  // Will use SSE for streaming responses
  // const eventSource = new EventSource(`/api/v1/chat/stream?message=${encodeURIComponent(message)}`);
  //
  // eventSource.onmessage = (event) => {
  //   const data = JSON.parse(event.data);
  //   if (data.done) {
  //     onComplete?.(data);
  //     eventSource.close();
  //   } else {
  //     onChunk?.(data.chunk);
  //   }
  // };
  //
  // eventSource.onerror = (error) => {
  //   onError?.({ error: 'Stream connection failed' });
  //   eventSource.close();
  // };

  throw new Error('Streaming chat API not implemented yet. Backend SSE endpoint required.');
};

/**
 * Get chat history for a conversation
 * @param conversationId - Conversation ID
 * @returns Array of chat messages
 *
 * TODO: Implement after backend is ready
 * Expected endpoint: GET /api/v1/chat/history/:conversationId
 */
export const getChatHistory = async (
  conversationId: string
): Promise<ChatMessage[]> => {
  // const response = await api.get<{ messages: ChatMessage[] }>(
  //   `/chat/history/${conversationId}`
  // );
  // return response.data.messages;

  throw new Error('Chat history API not implemented yet. Backend endpoint required.');
};

/**
 * Delete a conversation
 * @param conversationId - Conversation ID to delete
 *
 * TODO: Implement after backend is ready
 * Expected endpoint: DELETE /api/v1/chat/:conversationId
 */
export const deleteConversation = async (
  conversationId: string
): Promise<{ success: boolean }> => {
  // const response = await api.delete<{ success: boolean }>(
  //   `/chat/${conversationId}`
  // );
  // return response.data;

  throw new Error('Delete conversation API not implemented yet. Backend endpoint required.');
};
