import React, { useEffect, useState } from "react";

const Header = () => {
  const client_id = Date.now();
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newWs = new WebSocket(`ws://${window.location.host}/ws/${client_id}`);
    setWs(newWs);
    return () => {
      newWs.close();
    };
  }, [client_id]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = function (event) {
        let messages = document.getElementById("messages");
        let message = document.createElement("li");
        let content = document.createTextNode(event.data);
        message.appendChild(content);
        messages?.appendChild(message);
      };
    }
  }, [ws, client_id]);

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = document.getElementById("messageText") as HTMLInputElement;

    if (input && ws) {
      ws.send(input.value);
      input.value = "";
    }
  }

  return (
    <div>
      <div id="ws-id">{client_id}</div>
      <ul id="messages"></ul>
      <form onSubmit={sendMessage}>
        <input type="text" id="messageText" />
        <button type="submit">Send</button>
      </form>
      <button onClick={() => console.log("click")}>click me</button>
    </div>
  );
};

export default Header;
