import { Message } from '../types';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Generate automatic title from first user message (ChatGPT style)
const generateChatTitle = (messages: Message[]): string => {
  // Find the first user message
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  
  if (!firstUserMessage) {
    return 'New Chat';
  }
  
  // Get first 50 characters and clean it up
  let title = firstUserMessage.content.trim();
  
  // Remove newlines and extra spaces
  title = title.replace(/\s+/g, ' ');
  
  // Truncate to reasonable length
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  return title || 'New Chat';
};

class ChatStorageManager {
  private dbName = 'DeepSeekChatDB';
  private version = 1;
  private storeName = 'chats';
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }

  async saveChat(messages: Message[], title?: string): Promise<string> {
    const db = await this.ensureDB();
    const chatId = Date.now().toString();
    const chatTitle = title || generateChatTitle(messages);
    
    const chatSession: ChatSession = {
      id: chatId,
      title: chatTitle,
      messages: messages,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(chatSession);

      request.onsuccess = () => {
        resolve(chatId);
      };

      request.onerror = () => {
        reject(new Error('Failed to save chat'));
      };
    });
  }

  async updateChat(chatId: string, messages: Message[], title?: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise(async (resolve, reject) => {
      try {
        const existingChat = await this.getChat(chatId);
        if (!existingChat) {
          reject(new Error('Chat not found'));
          return;
        }

        // Auto-generate title if current title is default or not provided
        let finalTitle = title;
        if (!finalTitle && (existingChat.title === 'New Chat' || !existingChat.title)) {
          finalTitle = generateChatTitle(messages);
        } else if (!finalTitle) {
          finalTitle = existingChat.title;
        }

        const updatedChat: ChatSession = {
          ...existingChat,
          messages: messages,
          title: finalTitle,
          updatedAt: new Date()
        };

        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(updatedChat);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error('Failed to update chat'));
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async getChat(chatId: string): Promise<ChatSession | null> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(chatId);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Convert date strings back to Date objects
          result.createdAt = new Date(result.createdAt);
          result.updatedAt = new Date(result.updatedAt);
          result.messages = result.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
        resolve(result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get chat'));
      };
    });
  }

  async getAllChats(): Promise<ChatSession[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('updatedAt');
      const request = index.openCursor(null, 'prev'); // Most recent first
      
      const chats: ChatSession[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const chat = cursor.value;
          // Convert date strings back to Date objects
          chat.createdAt = new Date(chat.createdAt);
          chat.updatedAt = new Date(chat.updatedAt);
          chat.messages = chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          chats.push(chat);
          cursor.continue();
        } else {
          resolve(chats);
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to get all chats'));
      };
    });
  }

  async deleteChat(chatId: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(chatId);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete chat'));
      };
    });
  }

  async clearAllChats(): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear all chats'));
      };
    });
  }

  private generateChatTitle(messages: Message[]): string {
    // Generate title from first user message
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 30);
      return title.length < firstUserMessage.content.length ? title + '...' : title;
    }
    
    // Fallback to timestamp
    return `Chat ${new Date().toLocaleDateString()}`;
  }

  async exportChat(chatId: string): Promise<string> {
    const chat = await this.getChat(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const exportData = {
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importChat(jsonData: string): Promise<string> {
    try {
      const data = JSON.parse(jsonData);
      const messages: Message[] = data.messages.map((msg: any, index: number) => ({
        id: `imported-${Date.now()}-${index}`,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));

      return await this.saveChat(messages, data.title);
    } catch (error) {
      throw new Error('Invalid chat data format');
    }
  }
}

// Create singleton instance
export const chatStorage = new ChatStorageManager();

// Initialize DB when module loads
chatStorage.initDB().catch(console.error);
