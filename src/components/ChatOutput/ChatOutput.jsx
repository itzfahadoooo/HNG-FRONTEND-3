import "./ChatOutput.css";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast"; // Import toast for error messages

const ChatOutput = ({ messages, onSummarize, onTranslate }) => {
  const handleSummarizeClick = (text) => {
    if (text.length < 150) {
      toast.error("❌ Text must be at least 150 characters to summarize.");
      return;
    }
    onSummarize(text);
  };

  const handleTranslateClick = (text) => {
    if (!text.trim()) {
      toast.error("❌ No text available to translate.");
      return;
    }
    onTranslate(text);
  };

  return (
    <div className="chat-output-container">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message message ${msg.type}`}>
          <p>{msg.text}</p>

          {/* Render Detected Language Below the Message */}
          {msg.language && (
            <p className="detected-language">
              Detected Language: <em>{msg.language}</em>
            </p>
          )}

          {/* Show buttons only if message is from the user */}
          {msg.type === "user" && (
            <div className="button-group">
              <button className="summarize-btn" onClick={() => handleSummarizeClick(msg.text)}>
                Summarize
              </button>
              <button className="translate-btn" onClick={() => handleTranslateClick(msg.text)}>
                Translate
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

ChatOutput.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      language: PropTypes.string, // Optional
    })
  ).isRequired,
  onSummarize: PropTypes.func.isRequired,
  onTranslate: PropTypes.func.isRequired,
};

export default ChatOutput;
