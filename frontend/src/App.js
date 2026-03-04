import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: message,
      });

      const aiMessage = { text: res.data.reply, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error connecting to server.", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>AI Chat Assistant</div>

        <div style={styles.chatBox}>
          {messages.length === 0 && (
            <div style={styles.placeholder}>
              Start a conversation with your AI assistant 🚀
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.bubble,
                ...(msg.sender === "user"
                  ? styles.userBubble
                  : styles.aiBubble),
              }}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.bubble, ...styles.aiBubble }}>
              Typing...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    height: "80vh",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "18px",
    fontWeight: "bold",
    fontSize: "18px",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
    backgroundColor: "#f9fafb",
  },
  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#f3f4f6",
  },
  bubble: {
    padding: "12px 16px",
    borderRadius: "18px",
    maxWidth: "75%",
    fontSize: "14px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
    color: "white",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e7eb",
    color: "#111827",
  },
  placeholder: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: "50px",
  },
  inputContainer: {
    display: "flex",
    padding: "15px",
    borderTop: "1px solid #e5e7eb",
    gap: "10px",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },
};

export default App;