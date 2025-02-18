import { useState } from 'react';
import ChatInput from './components/ChatInput/ChatInput';
import ChatOutput from './components/ChatOutput/ChatOutput';
import './App.css';
import { detectLanguage } from './languagedetection';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [confidence, setConfidence] = useState('');

  const handleSend = async (text) => {
    setMessages([...messages, { text, type: 'user' }]);
    setLoading(true); // Start loading indicator
    const result = await detectLanguage(text);
    setLoading(false); // Stop loading indicator

    if (result) {
      setDetectedLanguage(result.language);
      setConfidence(result.confidence);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-output">
        <ChatOutput messages={messages} detectedLanguage={detectedLanguage} confidence={confidence} loading={loading} />
      </div>
      <div className="chat-input">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
