export const formatMessage = (content: string): string => {
  // Clean up common formatting issues
  let formatted = content
    // Fix multiple asterisks for bold formatting
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Fix numbered lists with asterisks
    .replace(/^\*\*(\d+)\.\s*\*\*([^*]+)\*\*/gm, '<strong>$1.</strong> $2')
    // Fix bullet points
    .replace(/^\*\*([^*]+):\*\*/gm, '<strong>$1:</strong>')
    // Fix line breaks and paragraphs
    .replace(/\n\n+/g, '</p><p>')
    // Fix single line breaks
    .replace(/\n/g, '<br>')
    // Wrap in paragraph tags if not already wrapped
    .replace(/^(?!<p>)(.+)(?!<\/p>)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    // Fix nested paragraphs
    .replace(/<p>(<p>.*?<\/p>)<\/p>/g, '$1');

  return formatted;
};

export const parseMarkdown = (content: string): string => {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]*)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Numbered lists
    .replace(/^\d+\.\s(.*)$/gim, '<li>$1</li>')
    // Bullet points
    .replace(/^\*\s(.*)$/gim, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
    // Wrap in paragraphs
    .replace(/^(?!<[h|p|pre|ul|ol|li])(.+)(?![h|p|pre|ul|ol|li]>)$/gim, '<p>$1</p>');
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const exportChatHistory = (messages: Array<{ role: string; content: string; timestamp: Date }>) => {
  const chatText = messages
    .filter(msg => msg.role !== 'system')
    .map((msg, index) => {
      const role = msg.role === 'user' ? 'You' : 'DeepSeek-R1';
      return `[${msg.timestamp.toLocaleString()}] ${role}: ${msg.content}`;
    })
    .join('\n\n');

  const blob = new Blob([chatText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `deepseek-chat-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
