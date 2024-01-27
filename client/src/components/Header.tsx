import React, { useEffect, useState } from "react";

const permittedKeysOne = ["a", "b", "c"];
const permittedKeysTwo = ["x", "y", "z"];

const Header = () => {
  const [string, setString] = useState("");

  // BED says which user / side of keyboard
  const playerOne = true;
  const [allowList, setAllowList] = useState(playerOne ? permittedKeysOne : permittedKeysTwo);

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

  useEffect(() => {
    document.addEventListener("keydown", (event: any) => {
      allowList.includes(event.key) ? console.log("send to server") : console.log("ignore");
      setString(event.key);
    });
  }, [allowList]);

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
    </div>
  );
};

export default Header;
