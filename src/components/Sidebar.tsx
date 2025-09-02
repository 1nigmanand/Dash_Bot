import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  Bot, 
  Wifi, 
  Code, 
  ChevronDown, 
  Activity,
  List,
  Play,
  X,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { ChatSettings, ConnectionStatus } from '../types';
import { ChatSession } from '../utils/chatStorage';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  connectionStatus: ConnectionStatus;
  onTestConnection: () => void;
  onNewChat: () => void;
  onTestHealth: () => void;
  onTestModels: () => void;
  onTestCompletion: (prompt: string) => void;
  chatSessions: ChatSession[];
  currentChatId: string | null;
  onLoadChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onExportChat: (chatId: string) => void;
  onImportChat: (file: File) => void;
  onClearAllChats: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  settings,
  onSettingsChange,
  connectionStatus,
  onTestConnection,
  onNewChat,
  onTestHealth,
  onTestModels,
  onTestCompletion,
  chatSessions,
  currentChatId,
  onLoadChat,
  onDeleteChat,
  onExportChat,
  onImportChat,
  onClearAllChats
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showApiTesting, setShowApiTesting] = useState(false);
  const [completionPrompt, setCompletionPrompt] = useState('Hello, how are you?');

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportChat(file);
      event.target.value = ''; // Reset file input
    }
  };

  // Group chats by time periods (ChatGPT style)
  const groupChatsByTime = (chats: ChatSession[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as ChatSession[],
      yesterday: [] as ChatSession[],
      thisWeek: [] as ChatSession[],
      thisMonth: [] as ChatSession[],
      older: [] as ChatSession[]
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.updatedAt);
      if (chatDate >= today) {
        groups.today.push(chat);
      } else if (chatDate >= yesterday) {
        groups.yesterday.push(chat);
      } else if (chatDate >= weekAgo) {
        groups.thisWeek.push(chat);
      } else if (chatDate >= monthAgo) {
        groups.thisMonth.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  return (
    <>
      {/* Simple Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Clean Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80
        bg-white border-r border-gray-200 flex flex-col shadow-soft
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Simple Header */}
        <div className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">DeepSeek-R1</h2>
                <div className="flex items-center space-x-2 text-sm opacity-90">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus.connected ? 'bg-green-400' : 'bg-yellow-400'
                  } ${!connectionStatus.connected && connectionStatus.error ? 'bg-red-400' : ''}`} />
                  <span className="text-xs">
                    {connectionStatus.connected ? 'Connected' : 
                     connectionStatus.error ? 'Connection Error' : 'Connecting...'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Clean Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Simple Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={onNewChat}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors hover:shadow-soft"
            >
              <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                <Plus size={18} />
              </div>
              <span className="font-medium text-gray-900">New Chat</span>
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all hover:shadow-soft ${
                showSettings 
                  ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                showSettings 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                <Settings size={18} />
              </div>
              <span className="font-medium">Settings</span>
            </button>
          </div>

          {/* Enhanced Chat History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Chat History
              </h3>
              <div className="flex items-center space-x-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="import-chat"
                />
                <label
                  htmlFor="import-chat"
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Import Chat"
                >
                  <Upload size={14} />
                </label>
                {chatSessions.length > 0 && (
                  <button
                    onClick={onClearAllChats}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear All Chats"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {chatSessions.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No saved chats yet
                </div>
              ) : (
                (() => {
                  const groups = groupChatsByTime(chatSessions);
                  return (
                    <>
                      {/* Today */}
                      {groups.today.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-gray-400 mb-2 px-2">Today</h4>
                          {groups.today.map((session) => (
                            <div
                              key={session.id}
                              className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                                currentChatId === session.id
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => onLoadChat(session.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {session.title}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onExportChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Export Chat"
                                >
                                  <Download size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Chat"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Yesterday */}
                      {groups.yesterday.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-gray-400 mb-2 px-2">Yesterday</h4>
                          {groups.yesterday.map((session) => (
                            <div
                              key={session.id}
                              className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                                currentChatId === session.id
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => onLoadChat(session.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {session.title}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onExportChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Export Chat"
                                >
                                  <Download size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Chat"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* This Week */}
                      {groups.thisWeek.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-gray-400 mb-2 px-2">This Week</h4>
                          {groups.thisWeek.map((session) => (
                            <div
                              key={session.id}
                              className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                                currentChatId === session.id
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => onLoadChat(session.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {session.title}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onExportChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Export Chat"
                                >
                                  <Download size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Chat"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* This Month */}
                      {groups.thisMonth.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-gray-400 mb-2 px-2">This Month</h4>
                          {groups.thisMonth.map((session) => (
                            <div
                              key={session.id}
                              className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                                currentChatId === session.id
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => onLoadChat(session.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {session.title}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onExportChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Export Chat"
                                >
                                  <Download size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Chat"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Older */}
                      {groups.older.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-gray-400 mb-2 px-2">Older</h4>
                          {groups.older.map((session) => (
                            <div
                              key={session.id}
                              className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                                currentChatId === session.id
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => onLoadChat(session.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {session.title}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onExportChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Export Chat"
                                >
                                  <Download size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(session.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Chat"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          </div>

          {/* Clean Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slide-up">
              <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <Settings size={18} className="mr-2 text-primary-500" />
                Configuration
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your API key"
                    value={settings.apiKey || ''}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      apiKey: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your key from: <span className="font-mono">http://localhost:8000/dashboard</span>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature: <span className="text-primary-600 font-semibold">{settings.temperature}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      temperature: parseFloat(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="2048"
                    value={settings.maxTokens}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      maxTokens: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <select
                    value={settings.model}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      model: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  >
                    <option value="deepseek-r1:8b">DeepSeek-R1:8b</option>
                  </select>
                </div>

                <button
                  onClick={onTestConnection}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all duration-200 hover:shadow-medium font-medium"
                >
                  <Wifi size={16} />
                  <span>Test Connection</span>
                </button>
              </div>
            </div>
          )}

          {/* Simple API Testing */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowApiTesting(!showApiTesting)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                  <Code size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700">API Testing</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-500 transform transition-transform ${
                  showApiTesting ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {showApiTesting && (
              <div className="mt-3 space-y-3 pl-2 animate-slide-up">
                <button
                  onClick={onTestHealth}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-all hover:shadow-soft"
                >
                  <Activity size={14} />
                  <span>Health Check</span>
                </button>

                <button
                  onClick={onTestModels}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all hover:shadow-soft"
                >
                  <List size={14} />
                  <span>List Models</span>
                </button>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={completionPrompt}
                    onChange={(e) => setCompletionPrompt(e.target.value)}
                    placeholder="Enter test prompt..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <button
                    onClick={() => onTestCompletion(completionPrompt)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-all hover:shadow-soft"
                  >
                    <Play size={14} />
                    <span>Test Completion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
