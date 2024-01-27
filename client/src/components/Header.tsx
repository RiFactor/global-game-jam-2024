import React, { useEffect, useState } from "react";
import { permittedKeysOne, permittedKeysTwo } from "../constants/keyboard";

class UserData {
    userid: Number;
    constructor(userid: Number) {
        this.userid = userid;
    }
}

const Header = () => {
  const [string, setString] = useState("");

  // BED says which user / side of keyboard
  const playerOne = true;
  const [allowList, setAllowList] = useState(playerOne ? permittedKeysOne : permittedKeysTwo);

  const client_id = Date.now();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [user_data, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const newWs = new WebSocket(`ws://${window.location.host}/ws/${client_id}`);
    setWs(newWs);
    // return () => {
    //   newWs.close();
    // };
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = function (content) {
        let messages = document.getElementById("messages");
        let message = document.createElement("li");

        console.log(content);

        let event = JSON.parse(content.data);
        switch (event.eventType) {
          case "teamAssignment":
            const ud = new UserData(event.data.userid);
            setUserData(ud);
            break;
          case "submissionState":
            // print the submission to the screen
            let content_box1 = document.createTextNode(event.data.submission);
            message.appendChild(content_box1);
            messages?.appendChild(message);

            if (event.data.submissionState == "correct") {
              // level passed
            }  else {
              // level not finished
            }
            break;
          // if keyPress is recieved (we dont want to do anthing here?)
          case "keyPress":
            console.log(sendKey(event.data.value));
            let content_box = document.createTextNode(event.data.value);
            message.appendChild(content_box);
            messages?.appendChild(message);
            break;
        }
      };
    }
  }, [ws, user_data, client_id]);

  useEffect(() => {
    document.addEventListener("keydown", (event: any) => {
      const is_allowed = allowList.includes(event.key);
      is_allowed ? console.log("send to server") : console.log("ignore");
      setString(event.key);
      if (is_allowed && ws) {
          ws.send(sendKey(event.key));
      }
    });
  }, [ws, allowList]);

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = document.getElementById("messageText") as HTMLInputElement;

    if (input && ws) {
      // pass the key to the server in json format
      ws.send(sendKey(input.value));
      // clear the input value
      input.value = "";
    }
  }

  function sendKey(key: string) {
    return `{"eventType":"keyPress", "data":{"value": "${key}"}}`;
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
