import { useState } from 'react'

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

 const AIChat = async (e, message) => {
  e.preventDefault();

  if(!message) return;
  setIsAIProcessing(true);

  let conversation = chats;
  conversation.push({role:  "user", content: message});
  setChats(conversation);
  scrollTo(0, 1e10);

  setMessage("");

  fetch("http://localhost:8080/", {
    method: "post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      chats,
    }),
  }).then((response) => response.json())
  .then((data) => {
    conversation.push(data.agentReply);
    setChats(conversation);
    setIsAIProcessing(false);
    scrollTo(0, 1e10);
  }).catch(error => console.log(error));
 }

  return (
    <main>
      <h1>Nitish Custom AI Chat</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
            <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
              <span>
                <b>{chat.role === "user" ? "You" : "AI Agent"}</b>
              </span>
              <span>: </span>
              <span>{chat.content}</span>
            </p>
          ))
        : ""}
      </section>

      <div className={isAIProcessing ? "" : "hide"}>
            <p>
              <i>{isAIProcessing ? "AI Agent is processing..." : ""}</i>
            </p>
      </div>

      <br></br>
      <form action="" onSubmit={(e) => AIChat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Please type your query here..."
          onChange={(e) => setMessage(e.target.value)}>
        </input>
      </form>
    </main>
  );
}

export default App;
