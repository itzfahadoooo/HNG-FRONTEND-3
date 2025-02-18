import  { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSend }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <div className="chat-input-container">
      <textarea 
        value={inputText} 
        onChange={(e) => setInputText(e.target.value)} 
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
