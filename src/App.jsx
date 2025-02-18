import  { useState } from 'react';
import ChatInput from './components/ChatInput/ChatInput';
import ChatOutput from './components/ChatOutput/ChatOutput';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    setMessages([...messages, { text, type: 'user' }]);
    // TODO: Add language detection and processing here
  };

  return (
    <div className="app-container">
      <div className="chat-output">
        <ChatOutput messages={messages} />
      </div>
      <div className="chat-input">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
