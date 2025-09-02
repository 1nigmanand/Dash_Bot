# 🚀 Dash_Bot - LocalLLM Chat Interface

> **Modern ChatGPT-like interface for DeepSeek-R1:8b LocalLLM API**

## Features

- 🤖 **ChatGPT-like Interface** - Clean, modern chat experience
- 💾 **Auto-save Chats** - Automatic chat persistence with IndexedDB
- 📚 **Chat History** - Time-based organization (Today, Yesterday, etc.)
- 🔐 **API Key Support** - Secure authentication with LocalLLM server
- 📱 **Responsive Design** - Works on all devices
- 🔧 **API Testing Tools** - Built-in testing for all endpoints

## Quick Start

### Prerequisites
- LocalLLM server running at `http://localhost:8000`
- Valid API key from your LocalLLM dashboard

### Installation

```bash
git clone https://github.com/1nigmanand/Dash_Bot.git
cd Dash_Bot
npm install
```

### Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` with your settings:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_KEY=your_api_key_here
```

3. Get your API key from: `http://localhost:8000/dashboard`

### Run the Application

```bash
npm start
```

Visit `http://localhost:3000` to use the chat interface.

## API Integration

### Supported Endpoints

- ✅ `GET /health` - Health check
- ✅ `POST /v1/chat/completions` - Chat completions
- ✅ `POST /v1/completions` - Text completions  
- ✅ `GET /v1/models` - List available models

### Authentication

All API requests include authentication headers:

```javascript
{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
```

## Usage

### Chat Interface
1. Enter your API key in Settings
2. Start typing to begin a new conversation
3. Chats auto-save with intelligent titles
4. Browse history in the sidebar

### API Testing
- Use the built-in API testing tools in the sidebar
- Test health, models, and completions endpoints
- View formatted responses

## Project Structure

```
src/
├── components/
│   ├── MessageBubble.tsx     # Chat message display
│   ├── Sidebar.tsx           # Navigation & settings
│   └── TypingIndicator.tsx   # Loading animation
├── utils/
│   ├── api.ts                # LocalLLM API integration
│   ├── chatStorage.ts        # IndexedDB chat persistence
│   └── messageUtils.ts       # Chat utilities
├── types/
│   └── index.ts              # TypeScript definitions
└── App.tsx                   # Main application
```

## Development

### Environment Variables

- `REACT_APP_API_BASE_URL`: LocalLLM server URL (default: http://localhost:8000)
- `REACT_APP_API_KEY`: Your API key (can be set in UI)

### Building for Production

```bash
npm run build
```

## LocalLLM Server Setup

Make sure your LocalLLM server supports:

1. **Health Check**: `GET /health`
2. **Chat API**: `POST /v1/chat/completions` 
3. **Completions**: `POST /v1/completions`
4. **Models**: `GET /v1/models`

All endpoints require Bearer token authentication.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

---

**🚀 Simple. Fast. Reliable. 🤖**

> Need help? Check the built-in API testing tools or visit your LocalLLM dashboard.
   ```
   
   **Option 2: Node.js HTTP Server**
   ```bash
   npx http-server -p 8080
   ```
   
   **Option 3: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open in browser**:
   ```
   http://localhost:8080
   ```

## 🖥️ Usage

### Chat Interface
1. Wait for the connection status to show "Connected to API"
2. Type your message in the input field
3. Press Enter to send (Shift+Enter for new line)
4. View responses in the chat area
5. Use "Clear" to reset chat or "Export" to save conversation

### API Testing
1. **Health Check**: Click "Test /health" to verify server status
2. **Models**: Click "Test /v1/models" to list available models
3. **Completion**: Enter a prompt and test text completion
4. **Custom**: Test any endpoint with custom methods and payloads

### Configuration
- **Temperature**: Controls randomness (0 = deterministic, 2 = very random)
- **Max Tokens**: Maximum response length
- **Model**: Select the model to use (currently deepseek-r1:8b)

## 🔧 API Endpoints Tested

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Root endpoint |
| `/health` | GET | Health check |
| `/v1/models` | GET | List available models |
| `/v1/chat/completions` | POST | Chat completions (OpenAI compatible) |
| `/v1/completions` | POST | Text completions |

## 📊 API Request Examples

### Chat Completion Request
```json
{
  "model": "deepseek-r1:8b",
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

### Text Completion Request
```json
{
  "model": "deepseek-r1:8b", 
  "prompt": "The future of AI is",
  "max_tokens": 100,
  "temperature": 0.7
}
```

## ⌨️ Keyboard Shortcuts

- **Enter**: Send message in chat
- **Shift + Enter**: New line in chat input
- **Ctrl/Cmd + K**: Clear chat
- **Ctrl/Cmd + E**: Export chat

## 🐛 Troubleshooting

### Connection Issues
- Check if `llm.ndfreetech.me` is accessible
- Verify CORS settings on the API server
- Check browser console for error messages

### API Errors
- Ensure the DeepSeek-R1:8b model is loaded on the server
- Check API endpoint availability
- Verify request format matches API expectations

### Browser Compatibility
- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+)
- Enable JavaScript
- Allow CORS requests if needed

## 🔒 Security Notes

- This interface makes direct API calls from the browser
- No API keys are stored or transmitted
- All communication is through HTTPS
- No data is stored locally (except in memory)

## 🎨 Customization

### Change API URL
Edit the `apiUrl` property in `script.js`:
```javascript
this.apiUrl = 'https://your-api-domain.com';
```

### Modify Styling
Edit `styles.css` to customize:
- Colors and gradients
- Layout and spacing  
- Animations and effects
- Responsive breakpoints

### Add Features
Extend `script.js` to add:
- Message persistence
- Multiple conversation threads
- Advanced API parameters
- File upload capabilities

## 📱 Mobile Support

The interface is fully responsive and works on:
- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (iPhone, Android)
- Different screen orientations

## 🔄 Updates

To update the interface:
1. Pull latest changes
2. Clear browser cache
3. Refresh the page
4. Check console for any errors

## 📄 License

This project is open source and available under the MIT License.

---

**Created for testing DeepSeek-R1:8b API at llm.ndfreetech.me**
# Dash_Bot
