import { useState } from 'react'

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

 const chat = async (e, message) => {
  e.preventDefault();

  if(!message) return;
  setIsTyping(true);

  let msgs = chats;
  msgs.push({role:  "user", content: message});
  setChats(msgs);

  setMessage("");

  alert(message);

 }

  return (
    <main>
      <h1>Nitish Custom AI Chat</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
            <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
              <span>
                <b>{chat.role.toUpperCase()}</b>
              </span>
              <span>:</span>
              <span>{chat.content}</span>
            </p>
          ))
        : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
            <p>
              <i>{isTyping ? "Typing" : ""}</i>
            </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here.."
          onChange={(e) => setMessage(e.target.value)}>
        </input>
      </form>
    </main>
  );
}

export default App;
