import { AppProvider } from "@pixi/react";
import { Application } from "pixi.js";
import FullScreenStage from "../components/FullScreenStage";
import AnswerLengthIndicator from "../components/AnswerLengthIndicator";
import KeyPress from "../data/keyPress";
import React, { useEffect, useState } from "react";
import { permittedKeysOne, permittedKeysTwo } from "../constants/keyboard";
import UserData from "../data/UserData";
import * as events from "../events";
import TeamDisplay from "../components/TeamDisplay";

// TODO: is there a better way to do this than just declaring here?
const pixiApp = new Application({ resizeTo: window });

// TODO test data, should be deleted
const wordLengths = [2, 3, 4];
const leftAnswer: KeyPress[] = [
  { key: "i", userid: 1 },
  { key: "m", userid: 1 },
  { key: "t", userid: 2 },
  { key: "h", userid: 1 },
  { key: "e", userid: 2 },
  { key: "b", userid: 1 },
  { key: "s", userid: 2 },
  { key: "o", userid: 1 },
  { key: "s", userid: 2 }
];
const rightAnswer: KeyPress[] = [
  { key: "m", userid: 1 },
  { key: "i", userid: 1 },
  { key: "h", userid: 1 },
  { key: "t", userid: 1 }
];

// TODO this should take state that is currently in header; this needs refactoring in an upcoming PR
const myUserId = 2;

const MainPage = () => {
  // BED says which user / side of keyboard
  const playerOne = true;
  const [allowList, setAllowList] = useState(playerOne ? permittedKeysOne : permittedKeysTwo);

  const client_id = Date.now();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [user_data, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // const newWs = new WebSocket(`ws://${window.location.host}/ws/${client_id}`);
    const newWs = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
    console.log(client_id);
    setWs(newWs);
    // return () => {
    //   newWs.close();
    // };
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = function (content) {
        console.log(content);

        let event = JSON.parse(content.data);
        switch (event.eventType) {
          case "teamAssignment":
            events.teamAssignment(event, setUserData);
            break;
          case "submissionState":
            events.submissionState(event);
            break;
          // if keyPress is recieved (we dont want to do anthing here?)
          case "keyPress":
            events.keyPress(event);
            break;
        }
      };
    }
  }, [ws, user_data, client_id]);

  useEffect(() => {
    const handleKeyUp = (event: any) => {
      const is_allowed = allowList.includes(event.key.toLowerCase());
      is_allowed ? console.log("send to server") : console.log("ignore");
      if (is_allowed && ws) {
        ws.send(events.sendKey(event.key));
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [ws]);

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = document.getElementById("messageText") as HTMLInputElement;

    if (input && ws) {
      // pass the key to the server in json format
      ws.send(events.sendKey(input.value));
      // clear the input value
      input.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center bg-slate-200">
      <TeamDisplay />
      <AppProvider value={pixiApp}>
        <FullScreenStage>
          <AnswerLengthIndicator
            myUserId={myUserId}
            screenFraction={0.3}
            spacing={10}
            wordLengths={wordLengths}
            currentAnswer={leftAnswer}
            screenFractionOffset={0.1}
          />
          <AnswerLengthIndicator
            screenFraction={0.3}
            spacing={10}
            wordLengths={wordLengths}
            currentAnswer={rightAnswer}
            screenFractionOffset={0.6}
          />
        </FullScreenStage>
      </AppProvider>
    </div>
  );
};

export default MainPage;
