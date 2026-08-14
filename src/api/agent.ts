import axios from './axios';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: ChatMessage;
}

interface HealthResponse {
  available: boolean;
}

interface ModelsResponse {
  models: string[];
}

/**
 * Non-streaming chat — sends full conversation history, returns assistant reply.
 */
const chat = async (messages: ChatMessage[]): Promise<ChatMessage> => {
  const response = await axios.post<ChatResponse>('/test/agent/chat', { messages });
  return response.data.message;
};

/**
 * Streaming chat via SSE — yields tokens as they arrive.
 * Returns an AbortController so callers can cancel mid-stream.
 */
const streamChat = (
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): AbortController => {
  const controller = new AbortController();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  fetch(`${baseUrl}/test/agent/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal: controller.signal
  })
    .then(async (response) => {
      if (!response.ok) {
        onError(`Server error: ${response.status}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onError('No readable stream');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.error) {
              onError(data.error);
              return;
            }
            if (data.done) {
              onDone();
              return;
            }
            if (data.token) {
              onToken(data.token);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      onDone();
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        onError(err.message ?? 'Unknown error');
      }
    });

  return controller;
};

/**
 * Check if the Ollama server is reachable.
 */
const health = async (): Promise<boolean> => {
  try {
    const response = await axios.get<HealthResponse>('/test/agent/health');
    return response.data.available;
  } catch {
    return false;
  }
};

/**
 * List available models on the Ollama server.
 */
const listModels = async (): Promise<string[]> => {
  try {
    const response = await axios.get<ModelsResponse>('/test/agent/models');
    return response.data.models;
  } catch {
    return [];
  }
};

export const agent = {
  chat,
  streamChat,
  health,
  listModels
};
