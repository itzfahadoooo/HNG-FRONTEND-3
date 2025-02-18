import { useState } from "react";
import PropTypes from "prop-types";
import "./ChatInput.css";

const ChatInput = ({
  onSend,
  selectedLanguage,
  setSelectedLanguage,
  onSummarize,
  onTranslate,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText("");
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-1">
      <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="input-textarea"
      />
        
        <button className="send-icon" onClick={handleSend}>
        <i className="fa-regular fa-paper-plane"></i>
      </button>
      </div>
      
      
      <div className="chat-input-2">
        <div className="input-actions">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
            <option value="es">Spanish</option>
            <option value="ru">Russian </option>
            <option value="tr">Turkish </option>
            <option value="fr">French </option>
          </select>
        </div>
        <div className="action-buttons">
          <button onClick={onSummarize} className="summarize-button">
            Summarize
          </button>
          <button onClick={onTranslate} className="translate-button">
            Translate
          </button>
        </div>
        
        
      </div>
      
    
    </div>
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  setSelectedLanguage: PropTypes.func.isRequired,
  onSummarize: PropTypes.func.isRequired,
  onTranslate: PropTypes.func.isRequired,
};

export default ChatInput;
