import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';
import { formatTime, formatMessage, parseMarkdown } from '../utils/messageUtils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const formatContent = (content: string) => {
    if (isUser) return content;
    
    // Apply formatting for bot messages
    const formatted = formatMessage(content);
    const parsed = parseMarkdown(formatted);
    
    return parsed;
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-200 text-sm font-medium">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse ml-12' : 'mr-12'} animate-fade-in`}>
      {/* Simple Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {isUser ? (
          <User size={16} />
        ) : (
          <Bot size={16} />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl shadow-soft ${
          isUser 
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md' 
            : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
        }`}>
          <div 
            className={`leading-relaxed ${isUser ? 'text-white' : 'text-gray-900'} prose prose-sm max-w-none`}
            dangerouslySetInnerHTML={{ 
              __html: formatContent(message.content)
            }}
          />
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
