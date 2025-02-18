import './ChatOutput.css';
import PropTypes from 'prop-types';

const ChatOutput = ({ messages }) => {
  return (
    <div className="chat-output-container">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`chat-message ${msg.type}`}>
          {msg.text}
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
    })
  ).isRequired,
};
export default ChatOutput;
