import { APIResponse, ChatSettings } from '../types';

// Get API configuration from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const API_KEY = process.env.REACT_APP_API_KEY || '';

export class DeepSeekAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(apiKey?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const key = apiKey || API_KEY;
    if (key) {
      headers['Authorization'] = `Bearer ${key}`;
    }

    return headers;
  }

  async checkHealth(apiKey?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/health`, {
      headers: this.getHeaders(apiKey)
    });
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getModels(apiKey?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v1/models`, {
      headers: this.getHeaders(apiKey)
    });
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
      headers: this.getHeaders(settings.apiKey),
      body: JSON.stringify({
        model: settings.model || 'deepseek-r1:8b',
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
    settings: ChatSettings,
    abortSignal?: AbortSignal
  ): Promise<APIResponse> {
    const response = await fetch(`${this.baseUrl}/v1/completions`, {
      method: 'POST',
      headers: this.getHeaders(settings.apiKey),
      body: JSON.stringify({
        model: settings.model || 'deepseek-r1:8b',
        prompt,
        max_tokens: settings.maxTokens,
        temperature: settings.temperature,
      }),
      signal: abortSignal
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const deepSeekAPI = new DeepSeekAPI();
