import React, { useState, useEffect } from "react";

const Header = () => {
  const [client_id, setClientId] = useState(Date.now());
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
  }, [ws]);

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = document.getElementById("messageText") as HTMLInputElement;

    if (input && ws) {
      // pass the key to the server in json format
      ws.send(JSON.parse( "{\"event\":\"keyPress\", \"data\":{\"value\": input.value}}"));
      // clear the input value
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
