import PropTypes from "prop-types";
import "./ChatInput.css";

const ChatInput = ({
  onSend,
  inputText,
  setInputText,
  selectedLanguage,
  setSelectedLanguage,
  onSummarize,
  onTranslate,
  isSummarizing,
  isTranslating
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line in input
      if (inputText.trim()) {
        onSend(inputText);
      }
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText);
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-1">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
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
            <option value="ru">Russian</option>
            <option value="tr">Turkish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div className="action-buttons">
          <button  onClick={onSummarize} className="summarize-button action-button"   disabled={isSummarizing}
          >
            {isSummarizing ? "Summarizing..." : "Summarize"}
          </button>
          <button onClick={onTranslate} className="translate-button action-button" disabled={isTranslating}>
            {isTranslating ? "Translating..." : "Translate"}
          </button>
        </div>
      </div>
    </div>
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  inputText: PropTypes.string.isRequired,
  setInputText: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  setSelectedLanguage: PropTypes.func.isRequired,
  onSummarize: PropTypes.func.isRequired,
  onTranslate: PropTypes.func.isRequired,
  isSummarizing: PropTypes.string,
  isTranslating: PropTypes.string,
};

export default ChatInput;
