import { APIResponse, ChatSettings } from '../types';

const API_BASE_URL = 'https://llm.ndfreetech.me';

export class DeepSeekAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getModels(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v1/models`);
    if (!response.ok) {
      throw new Error(`Failed to get models: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async chatCompletion(
    message: string,
    settings: ChatSettings,
    conversationHistory: Array<{ role: string; content: string }> = [],
    abortSignal?: AbortSignal
  ): Promise<APIResponse> {
    const messages = [
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model,
        messages,
        max_tokens: settings.maxTokens,
        temperature: settings.temperature,
        stream: false,
      }),
      signal: abortSignal // Add abort signal support
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async textCompletion(
    prompt: string,
    settings: ChatSettings
  ): Promise<APIResponse> {
    const response = await fetch(`${this.baseUrl}/v1/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model,
        prompt,
        max_tokens: settings.maxTokens,
        temperature: settings.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const deepSeekAPI = new DeepSeekAPI();
