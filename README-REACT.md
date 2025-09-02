# DeepSeek-R1:8b React Chatbot

A modern, responsive chatbot interface built with **React**, **TypeScript**, and **Tailwind CSS** for the DeepSeek-R1:8b API.

## 🚀 Features

### 💬 **Modern Chat Interface**
- Clean, WhatsApp/ChatGPT-style design
- Real-time message formatting with regex-based text processing
- Typing indicators and smooth animations
- Message timestamps and avatars
- Auto-scrolling chat history

### 🎨 **Beautiful UI/UX**
- **Tailwind CSS** for responsive design
- Gradient backgrounds and modern styling
- Mobile-first responsive layout
- Collapsible sidebar with settings
- Modal dialogs for API testing results

### 🔧 **Advanced Message Processing**
- **Regex-based formatting** for bot responses
- Markdown-like parsing for:
  - **Bold text** (`**text**`)
  - *Italic text* (`*text*`)
  - `Inline code` (`` `code` ``)
  - Code blocks (``` ````)
  - Numbered and bullet lists
  - Headers (# ## ###)
  - Links
- HTML sanitization for safe rendering
- Smart line break handling

### ⚙️ **Configuration & Testing**
- Adjustable temperature (0.0-2.0)
- Configurable max tokens (1-2048)
- Model selection
- Real-time connection status
- API endpoint testing suite
- Export chat history functionality

### 📱 **Responsive Design**
- Mobile-optimized interface
- Collapsible sidebar for small screens
- Touch-friendly controls
- Adaptive layouts for all screen sizes

## 🛠️ **Technology Stack**

- **React 18** with Hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite/Create React App** for development

## 📁 **Project Structure**

```
src/
├── components/
│   ├── MessageBubble.tsx    # Individual message component
│   ├── TypingIndicator.tsx  # Bot typing animation
│   └── Sidebar.tsx          # Settings & API testing
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   ├── api.ts               # API integration
│   └── messageUtils.ts      # Message formatting & utilities
├── App.tsx                  # Main application component
├── index.tsx               # React entry point
└── index.css               # Tailwind CSS + custom styles
```

## 🚀 **Quick Start**

### 1. **Setup & Installation**
```bash
# Make setup script executable (if not already)
chmod +x setup.sh

# Run the setup script
./setup.sh
```

Or manually:
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 2. **Open in Browser**
The app will automatically open at: `http://localhost:3000`

### 3. **Start Chatting**
- Wait for "Connected" status
- Click suggested prompts or type your own message
- Enjoy the enhanced chat experience!

## 📊 **Message Formatting Features**

The chatbot now includes advanced message processing:

### **Text Formatting**
```
**Bold text** → Bold text
*Italic text* → Italic text
`Code snippet` → Code snippet
```

### **Lists & Structure**
```
**1.** First item → 1. First item
**2.** Second item → 2. Second item
* Bullet point → • Bullet point
```

### **Code Blocks**
````
```
function hello() {
  console.log("Hello World!");
}
```
````

### **Smart Line Breaks**
- Automatic paragraph detection
- Proper line break handling
- Clean formatting for readability

## 🎛️ **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App |

## 🔧 **Configuration**

### **API Settings**
- **Base URL**: `https://llm.ndfreetech.me`
- **Model**: `deepseek-r1:8b`
- **Temperature**: 0.0 - 2.0 (default: 0.7)
- **Max Tokens**: 1 - 2048 (default: 500)

### **Customization**
Edit these files to customize:
- `src/utils/api.ts` - Change API endpoint
- `tailwind.config.js` - Modify colors and styling
- `src/App.tsx` - Add new features
- `src/utils/messageUtils.ts` - Update message formatting

## 🧪 **API Testing Suite**

Built-in testing tools for:
- **Health Check**: `/health` endpoint
- **Models List**: `/v1/models` endpoint
- **Text Completion**: `/v1/completions` endpoint
- **Custom Requests**: Any endpoint with custom payloads

## 📱 **Mobile Features**

- Responsive sidebar that collapses on mobile
- Touch-optimized controls
- Swipe gestures for navigation
- Adaptive text sizing
- Mobile-friendly input handling

## ⌨️ **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Cmd/Ctrl + K` | Clear chat |
| `Cmd/Ctrl + E` | Export chat |
| `Escape` | Close modals |

## 🐛 **Troubleshooting**

### **Installation Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Build Issues**
```bash
# Clear build cache
npm run build -- --reset-cache
```

### **API Connection Issues**
1. Check if `llm.ndfreetech.me` is accessible
2. Verify CORS settings on API server
3. Check browser console for detailed errors
4. Test connection using the built-in health check

### **Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build:css
```

## 🔄 **Development vs Production**

### **Development** (`npm start`)
- Hot reloading
- Source maps
- Development warnings
- Runs on `http://localhost:3000`

### **Production** (`npm run build`)
- Optimized bundle
- Minified code
- Tree shaking
- Ready for deployment

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Deploy Options**
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect GitHub repo for auto-deploy
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload build folder to S3 bucket
- **Any Static Host**: Serve the `build` folder

## 🔒 **Security Features**

- HTML sanitization for message content
- XSS protection for user inputs
- Secure API communication over HTTPS
- No sensitive data stored in localStorage
- Safe regex parsing for message formatting

## 🎨 **Color Scheme**

```css
Primary: #6366f1 (Indigo)
Secondary: #f8fafc (Cool Gray)
Success: #10b981 (Emerald)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
```

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 **Support**

- 🐛 **Bug Reports**: Create an issue on GitHub
- 💡 **Feature Requests**: Discuss in GitHub issues
- 📧 **Questions**: Open a discussion

---

**Built with ❤️ for the DeepSeek-R1:8b API at `llm.ndfreetech.me`**
