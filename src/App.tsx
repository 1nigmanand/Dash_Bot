import React, { useState, useEffect, useRef } from 'react';
import { Menu, Send, Trash2, Download } from 'lucide-react';
import { MessageBubble } from './components/MessageBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { Sidebar } from './components/Sidebar';
import { Message, ChatSettings, ConnectionStatus } from './types';
import { deepSeekAPI } from './utils/api';
import { generateId, exportChatHistory } from './utils/messageUtils';
import { chatStorage, ChatSession } from './utils/chatStorage';

// Suggested prompts
const suggestedPrompts = [
  "What can you help me with?",
  "Write a creative story",
  "Help me code in Python",
  "Explain a complex topic"
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false
  });
  const [settings, setSettings] = useState<ChatSettings>({
    temperature: 0.7,
    maxTokens: 500,
    model: 'deepseek-r1:8b'
  });
  const [apiResults, setApiResults] = useState<{
    title: string;
    content: any;
  } | null>(null);
  
  // Request cancellation to prevent data leaks
  const [currentAbortController, setCurrentAbortController] = useState<AbortController | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
    loadChatSessions();
  }, []);

  // Cleanup: cancel any ongoing requests when component unmounts
  useEffect(() => {
    return () => {
      if (currentAbortController) {
        currentAbortController.abort();
      }
    };
  }, []);

  // Auto-save current chat when messages change
  useEffect(() => {
    const saveChat = async () => {
      if (messages.length > 0 && !showWelcome) {
        try {
          if (currentChatId) {
            await chatStorage.updateChat(currentChatId, messages);
          } else {
            const chatId = await chatStorage.saveChat(messages);
            setCurrentChatId(chatId);
          }
          await loadChatSessions(); // Refresh the sessions list
        } catch (error) {
          console.error('Failed to auto-save chat:', error);
        }
      }
    };
    
    saveChat();
  }, [messages, showWelcome, currentChatId]);

  // Load all chat sessions from IndexedDB
  const loadChatSessions = async () => {
    try {
      const sessions = await chatStorage.getAllChats();
      setChatSessions(sessions);
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  // Auto-resize textarea
  const autoResizeTextarea = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const checkConnection = async () => {
    setConnectionStatus({ connected: false });
    try {
      await deepSeekAPI.checkHealth();
      setConnectionStatus({ connected: true });
    } catch (error) {
      setConnectionStatus({ 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Cancel any ongoing request from previous chat
    if (currentAbortController) {
      currentAbortController.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    setCurrentAbortController(abortController);

    // Store current chat ID to validate response belongs to this chat
    const requestChatId = currentChatId;

    // Hide welcome message
    setShowWelcome(false);

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content: text,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      // Get conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await deepSeekAPI.chatCompletion(text, settings, conversationHistory, abortController.signal);
      
      // Check if this request was cancelled or chat changed
      if (abortController.signal.aborted) {
        return;
      }

      // Verify we're still on the same chat (prevent data leak)
      if (requestChatId !== currentChatId) {
        console.warn('Chat changed during request, discarding response');
        return;
      }
      
      if (response.choices && response.choices.length > 0) {
        const assistantMessage: Message = {
          id: generateId(),
          content: response.choices[0].message.content,
          role: 'assistant',
          timestamp: new Date()
        };

        // Double check we're still on the same chat before adding response
        if (requestChatId === currentChatId) {
          setMessages(prev => [...prev, assistantMessage]);
        }
      } else {
        throw new Error('No response content received');
      }
    } catch (error) {
      // Only show error if request wasn't cancelled and we're still on same chat
      if (!abortController.signal.aborted && requestChatId === currentChatId) {
        const errorMessage: Message = {
          id: generateId(),
          content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          role: 'system',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      // Only update typing if we're still on the same chat
      if (requestChatId === currentChatId) {
        setIsTyping(false);
      }
      
      // Clear the abort controller if it's still the current one
      if (currentAbortController === abortController) {
        setCurrentAbortController(null);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    autoResizeTextarea();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newChat = () => {
    // Cancel any ongoing request when starting new chat
    if (currentAbortController) {
      currentAbortController.abort();
      setCurrentAbortController(null);
    }

    // Stop typing indicator immediately
    setIsTyping(false);

    setMessages([]);
    setShowWelcome(true);
    setCurrentChatId(null);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setCurrentChatId(null);
  };

  const exportChat = () => {
    if (messages.length === 0) {
      alert('No chat history to export');
      return;
    }
    exportChatHistory(messages);
  };

  // Load a specific chat session
  const loadChat = async (chatId: string) => {
    // Cancel any ongoing request when switching chats
    if (currentAbortController) {
      currentAbortController.abort();
      setCurrentAbortController(null);
    }

    // Stop typing indicator immediately when switching
    setIsTyping(false);

    try {
      const chatSession = await chatStorage.getChat(chatId);
      if (chatSession) {
        setMessages(chatSession.messages);
        setCurrentChatId(chatId);
        setShowWelcome(false);
        setIsSidebarOpen(false); // Close sidebar on mobile after loading
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
      alert('Failed to load chat. Please try again.');
    }
  };

  // Delete a chat session
  const deleteChat = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      await chatStorage.deleteChat(chatId);
      await loadChatSessions();
      
      // If the deleted chat was the current one, start a new chat
      if (currentChatId === chatId) {
        newChat();
      }
      
      alert('Chat deleted successfully!');
    } catch (error) {
      console.error('Failed to delete chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  // Export a specific chat
  const exportChatById = async (chatId: string) => {
    try {
      const exportData = await chatStorage.exportChat(chatId);
      const chatSession = await chatStorage.getChat(chatId);
      const filename = `${chatSession?.title || 'chat'}-${new Date().toISOString().split('T')[0]}.json`;
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export chat:', error);
      alert('Failed to export chat. Please try again.');
    }
  };

  // Import a chat from JSON file
  const importChat = async (file: File) => {
    try {
      const text = await file.text();
      const chatId = await chatStorage.importChat(text);
      await loadChatSessions();
      await loadChat(chatId);
      alert('Chat imported successfully!');
    } catch (error) {
      console.error('Failed to import chat:', error);
      alert('Failed to import chat. Please check the file format.');
    }
  };

  // Clear all chat sessions
  const clearAllChats = async () => {
    if (!window.confirm('Are you sure you want to delete all chats? This action cannot be undone.')) {
      return;
    }

    try {
      await chatStorage.clearAllChats();
      setChatSessions([]);
      newChat();
      alert('All chats deleted successfully!');
    } catch (error) {
      console.error('Failed to clear all chats:', error);
      alert('Failed to clear all chats. Please try again.');
    }
  };

  const showApiResults = (title: string, content: any) => {
    setApiResults({ title, content });
  };

  const closeApiResults = () => {
    setApiResults(null);
  };

  const testHealth = async () => {
    try {
      const result = await deepSeekAPI.checkHealth();
      showApiResults('Health Check', result);
    } catch (error) {
      showApiResults('Health Check Error', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testModels = async () => {
    try {
      const result = await deepSeekAPI.getModels();
      showApiResults('Models List', result);
    } catch (error) {
      showApiResults('Models Error', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testCompletion = async (prompt: string) => {
    if (!prompt.trim()) {
      showApiResults('Completion Error', { error: 'Please enter a prompt' });
      return;
    }

    try {
      const result = await deepSeekAPI.textCompletion(prompt, settings);
      showApiResults('Completion Response', result);
    } catch (error) {
      showApiResults('Completion Error', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        settings={settings}
        onSettingsChange={setSettings}
        connectionStatus={connectionStatus}
        onTestConnection={checkConnection}
        onNewChat={newChat}
        onTestHealth={testHealth}
        onTestModels={testModels}
        onTestCompletion={testCompletion}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onLoadChat={loadChat}
        onDeleteChat={deleteChat}
        onExportChat={exportChatById}
        onImportChat={importChat}
        onClearAllChats={clearAllChats}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">DeepSeek-R1:8b</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus.connected ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span>AI Assistant</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              title="Clear Chat"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={exportChat}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              title="Export Chat"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Simple Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Clean Welcome Message */}
          {showWelcome && (
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="max-w-2xl w-full bg-white rounded-2xl shadow-soft border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">🤖</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Hello! I'm DeepSeek-R1
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  I'm an AI assistant powered by the DeepSeek-R1:8b model. I'm here to help you with 
                  questions, creative tasks, coding, and much more!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(prompt)}
                      className="px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-600 
                               border border-gray-200 hover:border-primary-200 rounded-xl 
                               transition-all duration-200 text-sm font-medium text-left
                               hover:shadow-soft"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="max-w-4xl mx-auto w-full space-y-4">
            {messages.map((message, index) => (
              <div key={message.id} className="animate-fade-in">
                <MessageBubble message={message} />
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="animate-fade-in">
                <TypingIndicator />
              </div>
            )}
          </div>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Clean Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 p-4">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Message DeepSeek-R1..."
                  className="w-full resize-none bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500"
                  style={{ minHeight: '24px', maxHeight: '120px' }}
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-400">
                    {inputValue.length}/2000 characters
                  </div>
                  <div className="text-xs text-gray-400">
                    Press <kbd className="bg-white px-2 py-1 rounded border text-xs">Enter</kbd> to send
                  </div>
                </div>
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-primary-500 to-primary-600 
                         hover:from-primary-600 hover:to-primary-700 disabled:from-gray-300 
                         disabled:to-gray-400 text-white rounded-xl flex items-center 
                         justify-center transition-all duration-200 hover:shadow-medium
                         disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Modal */}
      {apiResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-medium max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{apiResults.title}</h3>
              <button
                onClick={closeApiResults}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-96">
              <pre className="bg-gray-50 p-4 rounded-xl text-sm overflow-auto text-gray-900 whitespace-pre-wrap border">
                {JSON.stringify(apiResults.content, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
