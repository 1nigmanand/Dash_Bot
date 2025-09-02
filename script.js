class DeepSeekChatbot {
    constructor() {
        this.apiUrl = 'https://llm.ndfreetech.me';
        this.model = 'deepseek-r1:8b';
        this.chatHistory = [];
        this.initializeElements();
        this.bindEvents();
        this.checkConnection();
        this.setupResponsive();
    }

    initializeElements() {
        // Status elements
        this.statusDot = document.getElementById('statusDot');
        this.statusText = document.getElementById('statusText');
        
        // Chat elements
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.charCounter = document.getElementById('charCounter');
        
        // Settings elements
        this.temperatureSlider = document.getElementById('temperature');
        this.temperatureValue = document.getElementById('temperatureValue');
        this.maxTokensInput = document.getElementById('maxTokens');
        this.modelSelect = document.getElementById('modelName');
        
        // Modal elements
        this.modal = document.getElementById('resultsModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalResult = document.getElementById('modalResult');
        this.modalClose = document.getElementById('modalClose');
        
        // Sidebar elements
        this.sidebar = document.getElementById('sidebar');
        this.menuBtn = document.getElementById('menuBtn');
        this.sidebarToggle = document.getElementById('sidebarToggle');
    }

    bindEvents() {
        // Chat functionality
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea and character counter
        this.chatInput.addEventListener('input', (e) => {
            this.autoResizeTextarea();
            this.updateCharCounter();
        });

        // Settings controls
        this.temperatureSlider.addEventListener('input', (e) => {
            this.temperatureValue.textContent = e.target.value;
        });

        // Button events
        document.getElementById('testConnection').addEventListener('click', () => this.checkConnection());
        document.getElementById('newChatBtn').addEventListener('click', () => this.newChat());
        document.getElementById('clearChat').addEventListener('click', () => this.clearChat());
        document.getElementById('exportChat').addEventListener('click', () => this.exportChat());
        
        // Settings toggle
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettings());
        
        // API testing
        document.getElementById('apiToggle').addEventListener('click', () => this.toggleApiTesting());
        document.getElementById('testHealth').addEventListener('click', () => this.testHealth());
        document.getElementById('testModels').addEventListener('click', () => this.testModels());
        document.getElementById('testCompletion').addEventListener('click', () => this.testCompletion());

        // Suggestion buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const message = e.target.getAttribute('data-message');
                this.chatInput.value = message;
                this.sendMessage();
            }
        });

        // Modal events
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Responsive events
        this.menuBtn.addEventListener('click', () => this.toggleSidebar());
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.sidebar.contains(e.target) && 
                !this.menuBtn.contains(e.target) &&
                this.sidebar.classList.contains('open')) {
                this.toggleSidebar();
            }
        });
    }

    setupResponsive() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.sidebar.classList.remove('open');
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }

    toggleSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        const isVisible = settingsPanel.style.display !== 'none';
        settingsPanel.style.display = isVisible ? 'none' : 'block';
        
        document.getElementById('settingsBtn').classList.toggle('active', !isVisible);
    }

    toggleApiTesting() {
        const apiContent = document.querySelector('.api-content');
        const toggleIcon = document.querySelector('.toggle-icon');
        const toggle = document.getElementById('apiToggle');
        
        const isExpanded = apiContent.style.display !== 'none';
        apiContent.style.display = isExpanded ? 'none' : 'block';
        toggle.setAttribute('aria-expanded', !isExpanded);
        toggleIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }

    updateCharCounter() {
        const length = this.chatInput.value.length;
        this.charCounter.textContent = `${length}/2000`;
        this.charCounter.style.color = length > 1800 ? '#ef4444' : 'var(--text-muted)';
    }

    updateStatus(status, message) {
        this.statusDot.className = `status-dot ${status}`;
        this.statusText.textContent = message;
    }

    async checkConnection() {
        this.updateStatus('', 'Connecting...');
        
        try {
            const response = await fetch(`${this.apiUrl}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                this.updateStatus('connected', 'Connected');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('Connection check failed:', error);
            this.updateStatus('error', 'Connection failed');
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Disable input and show loading
        this.setInputState(false);
        
        // Add user message
        this.addMessage('user', message);
        this.chatInput.value = '';
        this.autoResizeTextarea();
        this.updateCharCounter();
        
        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await fetch(`${this.apiUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.modelSelect.value,
                    messages: [
                        { role: 'user', content: message }
                    ],
                    max_tokens: parseInt(this.maxTokensInput.value),
                    temperature: parseFloat(this.temperatureSlider.value)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices.length > 0) {
                const assistantMessage = data.choices[0].message.content;
                this.hideTypingIndicator();
                this.addMessage('assistant', assistantMessage);
                
                // Add to chat history
                this.chatHistory.push({
                    user: message,
                    assistant: assistantMessage,
                    timestamp: new Date()
                });
            } else {
                throw new Error('No response content received');
            }

        } catch (error) {
            console.error('Chat API error:', error);
            this.hideTypingIndicator();
            this.showErrorMessage(`❌ Error: ${error.message}`);
        } finally {
            this.setInputState(true);
            this.chatInput.focus();
        }
    }

    addMessage(role, content, timestamp = new Date()) {
        // Hide welcome message if it exists
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (role === 'user') {
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        } else if (role === 'assistant') {
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = timestamp.toLocaleTimeString();
        
        contentDiv.appendChild(timeDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #fef2f2;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 20%;
            border: 1px solid #fecaca;
            text-align: center;
            font-size: 14px;
        `;
        errorDiv.textContent = message;
        
        this.chatMessages.appendChild(errorDiv);
        this.scrollToBottom();
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    setInputState(enabled) {
        this.chatInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        const sendIcon = this.sendButton.querySelector('.send-icon');
        const loadingIcon = this.sendButton.querySelector('.loading-icon');
        
        if (enabled) {
            sendIcon.style.display = 'inline';
            loadingIcon.style.display = 'none';
        } else {
            sendIcon.style.display = 'none';
            loadingIcon.style.display = 'inline';
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    newChat() {
        this.clearChat();
        // Show welcome message again
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'flex';
        }
    }

    clearChat() {
        this.chatMessages.innerHTML = `
            <div class="welcome-message" style="display: none;">
                <div class="welcome-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="welcome-content">
                    <h3>👋 Hello! I'm DeepSeek-R1</h3>
                    <p>I'm an AI assistant powered by the DeepSeek-R1:8b model. I'm here to help you with questions, creative tasks, coding, and much more!</p>
                    <div class="suggested-questions">
                        <button class="suggestion-btn" data-message="What can you help me with?">
                            What can you help me with?
                        </button>
                        <button class="suggestion-btn" data-message="Write a creative story">
                            Write a creative story
                        </button>
                        <button class="suggestion-btn" data-message="Help me code in Python">
                            Help me code in Python
                        </button>
                        <button class="suggestion-btn" data-message="Explain a complex topic">
                            Explain a complex topic
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Show welcome message
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'flex';
        }
        
        this.chatHistory = [];
    }

    exportChat() {
        if (this.chatHistory.length === 0) {
            alert('No chat history to export');
            return;
        }
        
        const chatText = this.chatHistory.map((item, index) => {
            return `Chat ${index + 1} - ${item.timestamp.toLocaleString()}\n` +
                   `User: ${item.user}\n` +
                   `Assistant: ${item.assistant}\n` +
                   `${'='.repeat(50)}\n`;
        }).join('\n');

        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deepseek-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showModal(title, content) {
        this.modalTitle.textContent = title;
        this.modalResult.textContent = this.formatJSON(content);
        this.modal.style.display = 'flex';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    async testHealth() {
        try {
            const response = await fetch(`${this.apiUrl}/health`);
            const data = await response.json();
            this.showModal('Health Check', data);
        } catch (error) {
            this.showModal('Health Check Error', { error: error.message });
        }
    }

    async testModels() {
        try {
            const response = await fetch(`${this.apiUrl}/v1/models`);
            const data = await response.json();
            this.showModal('Models List', data);
        } catch (error) {
            this.showModal('Models Error', { error: error.message });
        }
    }

    async testCompletion() {
        const prompt = document.getElementById('completionPrompt').value.trim();
        if (!prompt) {
            this.showModal('Completion Error', { error: 'Please enter a prompt' });
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/v1/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.modelSelect.value,
                    prompt: prompt,
                    max_tokens: parseInt(this.maxTokensInput.value),
                    temperature: parseFloat(this.temperatureSlider.value)
                })
            });

            const data = await response.json();
            this.showModal('Completion Response', data);
            
        } catch (error) {
            this.showModal('Completion Error', { error: error.message });
        }
    }

    formatJSON(obj) {
        try {
            return JSON.stringify(obj, null, 2);
        } catch (error) {
            return obj.toString();
        }
    }
}

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new DeepSeekChatbot();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (window.chatbot) {
            window.chatbot.clearChat();
        }
    }
    
    // Ctrl/Cmd + E to export chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (window.chatbot) {
            window.chatbot.exportChat();
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        if (window.chatbot && window.chatbot.modal.style.display === 'flex') {
            window.chatbot.closeModal();
        }
    }
});
