/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const REACT_APP_API_BASE = process.env.REACT_APP_API_BASE || "https://rag-backend-0iqq.onrender.com";

  useEffect(() => {
    let sid = localStorage.getItem("sessionId");
    if (!sid) {
      sid = "session-" + Date.now();
      localStorage.setItem("sessionId", sid);
    }
    setSessionId(sid);

    axios
      .get(`${REACT_APP_API_BASE}/history/${sid}`)
      .then((res) => setChat(res.data))
      .catch((err) => console.log(err));
  }, []);


useEffect(() => {
  if (chatBoxRef.current) {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }
}, [chat, loading]); 


  const sendMessage = async () => {
    if (!message) return;

    const newChat = [...chat, { role: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${REACT_APP_API_BASE}/chat`, {
        sessionId: sessionId,
        question: message,
      });
      setChat([...newChat, { role: "bot", text: res.data.answer }]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = async () => {
    await axios.post(`${REACT_APP_API_BASE}/reset`, {
      sessionId,
    });
    setChat([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">
        RAG Chatbot (Ask Me About UK News)
      </h2>
      <div className="border border-gray-500 p-4 h-[60vh] mb-4 rounded-lg overflow-y-auto" ref={chatBoxRef}>
        {chat.map((c, i) => (
          <div
            key={i}
            className={`my-2 text-black flex ${
              c.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                c.role === "user"
                  ? "bg-blue-200 text-right"
                  : "bg-gray-200 text-left"
              } p-2 rounded-lg max-w-[80%]  whitespace-pre-line`}
            >
              <b>{c.role}</b>
              <ReactMarkdown>{c.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="my-2 text-black flex justify-start">
            <div className="bg-gray-200 p-2 rounded-lg max-w-[80%]">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="flex">

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type query ..."
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
        <button
          onClick={resetSession}
          className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
