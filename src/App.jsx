import  { useState } from 'react';
import ChatInput from './components/ChatInput/ChatInput';
import ChatOutput from './components/ChatOutput/ChatOutput';
import './App.css';
import { detectLanguage } from './languagedetection';

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSend = async (text) => {
    // Detect the language of the message
    const language = await detectLanguage(text);
    console.log("Detected Language:", language);

    // Add the detected language to the message object
    setMessages([...messages, { text, type: 'user', language }]);
  };

  const handleSummarize = () => {
    alert("Summarize feature coming soon!");
  };

  const handleTranslate = () => {
    alert(`Translate to ${selectedLanguage} feature coming soon!`);
  };

  return (
    <div className="app-container">
      <div className="chat-output">
        <ChatOutput messages={messages} />
      </div>
      <div className="chat-input">
        <ChatInput
          onSend={handleSend}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          onSummarize={handleSummarize}
          onTranslate={handleTranslate}
        />
      </div>
    </div>
  );
}

export default App;
