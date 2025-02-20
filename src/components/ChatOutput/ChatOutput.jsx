import "./ChatOutput.css";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast"; // Import toast for error messages

const ChatOutput = ({ messages, onSummarize, isSummarizing }) => {
  const handleSummarizeClick = (text) => {
    if (text.length < 150) {
      toast.error("❌ Text must be at least 150 characters to summarize.");
      return;
    }
    onSummarize(text);
  };

  return (
    <div className="chat-output-container" >
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message message ${msg.type}`}>
          <p>{msg.text}</p>

          {/* Render Detected Language Below the Message */}
          {msg.language && (
            <p className="detected-language">
              Detected Language: <em>{msg.language}</em>
            </p>
          )}

          {/* Check if message is from bot and language is English */}
          {msg.type === "user" && msg.language === "en" && (
            <button
              className="summarize-btn"
              onClick={() => handleSummarizeClick(msg.text)}
              disabled={isSummarizing}
            >
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </button>
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
  isSummarizing: PropTypes.string,
};

export default ChatOutput;
