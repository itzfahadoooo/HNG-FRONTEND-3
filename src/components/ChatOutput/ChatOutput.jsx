import './ChatOutput.css';
import PropTypes from 'prop-types';

const ChatOutput = ({ messages }) => {
  return (
    <div className="chat-output-container">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message message ${msg.type}`}>
          <p>{msg.text}</p>
          {/* Render Detected Language Below the Message */}
          {msg.language && (
            <p className="detected-language">
              Detected Language : <em>{msg.language}</em>
            </p>
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
};

export default ChatOutput;
