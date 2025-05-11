import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from '../config/axios'
import { useThemeContext } from "../context/ThemeContext";


const ChatBot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || "";
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef(null);
  const [hasSentInitial, setHasSentInitial] = useState(false);

  const { darkMode } = useThemeContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const hasSentInitialRef = useRef(false); // Store whether initial message was sent

  // Effect to handle sending initial message once
  useEffect(() => {
    if (initialMessage && !hasSentInitialRef.current) {
      hasSentInitialRef.current = true; // Set ref so it won't be triggered again
      handleSendMessage(initialMessage); // Send initial message
    }
  }, [initialMessage]);


useEffect(() => {
  scrollToBottom();
}, [messages]);


const handleSendMessage = async (message = inputMessage) => {
  if (!message.trim()) {
    setError("Please enter a message");
    return;
  }

  setError(""); // Clear any previous errors
  const newMessage = {
    text: message,
    sender: "user",
    timestamp: new Date()
  };

  setMessages(prev => [...prev, newMessage]); 
  setInputMessage(""); 
  setIsTyping(true); 

  try {
    
    const res = await axios.post('/api/user/ask', { message });

    const replyText = res.data.reply;

  
    setTimeout(() => {
      const botReply = {
        text: replyText,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botReply]); // Add bot's reply
      setIsTyping(false); // Hide typing indicator
    }, 1000);
  } catch (err) {
    console.error("Error:", err);
    setError('Failed to generate content. Please try again.');
  }
};



const handleKeyPress = (e) => {
  // Check if the Enter key is pressed (without Shift key)
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent the default action (new line in textarea)
    // Call handleSendMessage only if there's user input
    if (inputMessage.trim()) {
      handleSendMessage(inputMessage);
    }
  }
};

  return (
    <div className={`flex  w-full ml-28 mt-60 p-1 dark:bg-secondary  items-center justify-center ${darkMode ? "dark" : ""}`}>
      <div className="w-full ml-32  rounded-lg shadow-xl ">
        <div className="flex-1 p-4 pt-32 h-[500px] mt-32   overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 font-poppinsLight  rounded-lg ${message.sender === "user" 
                  ? "bg-primary text-white" 
                  : "border-primary border-2 text-black dark:text-gray-100"} 
                  shadow-sm`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {format(message.timestamp, "HH:mm")}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex font-poppinsLight  justify-start mb-4">
              <div className="bg-gray-200 px-4 py-2 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-1 border-t bg   mt-5">
          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}
          <div className="flex gap-2 mt-4 font-poppinsLight ">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress }
              placeholder="Type your message..."
              className="flex-1 p-2 border-gray-300 border-[1px] rounded-lg pb-5 mb-20 focus:outline-none   resize-none"
              rows="1"
              aria-label="Message input"
            />
            <button
             onClick={() => handleSendMessage(inputMessage)}
              className="px-4 py-2 bg-primary  pb-5 mb-20 text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Send message"
            >
              <FiSend className="w-6 mt-2 h-5 " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;