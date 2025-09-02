# DeepSeek-R1:8b API Test Interface

A comprehensive web-based testing interface for the DeepSeek-R1:8b API hosted at `llm.ndfreetech.me`.

## 🚀 Features

### 💬 Interactive Chat Interface
- Real-time chat with the DeepSeek-R1:8b model
- Configurable temperature and token limits
- Message history with export functionality
- Auto-resizing input field
- Responsive design for all devices

### 🧪 API Testing Tools
- **Health Check**: Test `/health` endpoint
- **Models List**: Test `/v1/models` endpoint  
- **Text Completion**: Test `/v1/completions` endpoint
- **Custom Requests**: Send custom GET/POST requests to any endpoint

### ⚙️ Configuration Panel
- Adjustable temperature (0.0 - 2.0)
- Configurable max tokens (1 - 2048)
- Model selection
- Real-time connection status

### 🎨 Modern UI/UX
- Glassmorphism design with blur effects
- Gradient backgrounds and smooth animations
- Mobile-responsive layout
- Dark/light theme compatible

## 📁 Files

- `index.html` - Main HTML structure
- `styles.css` - Complete CSS styling with animations
- `script.js` - JavaScript functionality and API integration

## 🛠️ Setup

1. **Clone or download the files**:
   ```bash
   git clone <repository> # or download files
   cd deepseek-api-tester
   ```

2. **Serve the files**:
   
   **Option 1: Python HTTP Server**
   ```bash
   python3 -m http.server 8080
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
