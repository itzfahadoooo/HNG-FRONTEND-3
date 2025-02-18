import  { useState } from 'react';
import ChatInput from './components/ChatInput/ChatInput';
import ChatOutput from './components/ChatOutput/ChatOutput';
import './App.css';
import { detectLanguage } from './languagedetection';


function App() {
  const [messages, setMessages] = useState([]);

  const handleSend = async (text) => {
    setMessages([...messages, { text, type: 'user' }]);
    const language = await detectLanguage(text);
    console.log("Detected Language:", language);
  
    // You can now use the detected language for further processing
    setMessages([...messages, { text, type: 'user', language }]);

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
