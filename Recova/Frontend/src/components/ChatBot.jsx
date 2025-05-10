import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from '../config/axios'

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      const newMessage = {
        text: initialMessage,
        sender: "user",
        timestamp: new Date()
      };
      setMessages([newMessage]);
      setTimeout(() => {
        const botReply = {
          text: reply,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botReply]);
        setIsTyping(false);
      }, 1000);
    }
  }, [initialMessage]);

useEffect(() => {
  if (!initialMessage) {
    navigate("/profile"); // or wherever you want
  }
}, []);


// const handleSend = async () => {
//   try {
//     const res = await axios.post('/ask', { message: inputMessage });

//     // In axios, response data is already parsed as JSON:
//     setReply(res.data.reply);
//     setInputMessage('');
//   } catch (error) {
//     console.error('Error sending message:', error);
//     setReply('Something went wrong.');
//   }
// };

  // const generateBotReply = () => {
  //   const replies = [
  //     "That's interesting! Tell me more.",
  //     "I understand what you mean.",
  //     "Thanks for sharing that!",
  //     "How does that make you feel?",
  //     "Could you elaborate on that?"
  //   ];
  //   return replies[Math.floor(Math.random() * replies.length)];
  // };

  // const handleSendMessage = async () => {
  //   if (!inputMessage.trim()) {
  //     setError("Please enter a message");
  //     return;
  //   }

  //   setError("");
  //   const newMessage = {
  //     text: inputMessage,
  //     sender: "user",
  //     timestamp: new Date()
  //   };

  //   setMessages(prev => [...prev, newMessage]);
  //   // setInputMessage("");
  //   // setIsTyping(true);

  //   setTimeout(() => {
  //     const botReply = {
  //       text: reply,
  //       sender: "bot",
  //       timestamp: new Date()
  //     };
  //     setMessages(prev => [...prev, botReply]);
  //     setIsTyping(false);
  //   }, 1000);
  //        try {
  //           // Make a POST request to the backend API
  //           const res = await axios.post('/api/user/ask', {
  //               message: inputMessage, // Send the message to the backend
  //           });

  //           // Get the response from the backend and set it
  //           setReply(res.data.reply);
  //           setInputMessage('');  // Clear input field
  //       } catch (err) {
  //           console.error("Error:", err);
  //           setError('Failed to generate content. Please try again.');
  //           setInputMessage(''); 
  //       }
  //       //  finally {
  //       //     setLoading(false);  // Stop loading
  //       // }
  // };

  const handleSendMessage = async () => {
    // Check if the input message is empty
    if (!inputMessage.trim()) {
        setError("Please enter a message");
        return;
    }

    setError("");
    
    // Add the user's message to the conversation
    const newMessage = {
        text: inputMessage,
        sender: "user",
        timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Clear the input field and set the bot as "typing"
    setInputMessage('');
    setIsTyping(true);

    try {
        // Make a POST request to the backend API with the user's message
        const res = await axios.post('/api/user/ask', {
            message: inputMessage, // Send the message to the backend
        });

        // Get the response from the backend and set it as the bot's reply
        setReply(res.data.reply);

        // Simulate the bot typing delay (e.g., 1 second)
        setTimeout(() => {
            const botReply = {
                text: res.data.reply,
                sender: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botReply]);
            setIsTyping(false);  // Stop the "typing" indicator
        }, 1000);

    } catch (err) {
        console.error("Error:", err);
        setError('Failed to generate content. Please try again.');
    } finally {
        // Ensure loading state is handled properly (if you have a loading state)
        // setLoading(false);
    }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex  w-full ml-28 mt-60 p-1  items-center justify-center">
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
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2 border-gray-300 border-[1px] rounded-lg pb-5 mb-20 focus:outline-none   resize-none"
              rows="1"
              aria-label="Message input"
            />
            <button
              onClick={handleSendMessage}
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