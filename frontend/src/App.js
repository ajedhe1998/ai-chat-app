import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:8000/chat", {
      message: message,
    });
    setReply(res.data.reply);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>AI Chat App</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <p><strong>Response:</strong> {reply}</p>
    </div>
  );
}

export default App;