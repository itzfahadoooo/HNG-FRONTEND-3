import './ChatOutput.css';
import PropTypes from 'prop-types';

const ChatOutput = ({ messages, detectedLanguage, confidence, loading }) => {
  return (
    <div className="chat-output-container">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message message ${msg.type}`}>
          {msg.text}
        </div>
      ))}
      {loading ? (
        <div className="loading-indicator">Detecting language...</div>
      ) : (
        detectedLanguage && (
          <div className="language-info">
            Detected Language: {detectedLanguage} <br />
            Confidence: {(confidence * 100).toFixed(2)}%
          </div>
        )
      )}
    </div>
  );
};

ChatOutput.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  detectedLanguage: PropTypes.string,
  confidence: PropTypes.number,
  loading: PropTypes.bool.isRequired,
};

export default ChatOutput;
