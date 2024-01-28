import { AppProvider } from "@pixi/react";
import { Application } from "pixi.js";
import { ReactElement, useEffect, useState } from "react";
import FullScreenStage from "../components/FullScreenStage";
import MainPageBackground from "../components/MainPageBackground";
import PromptList from "../components/PromptList";
import UserData from "../data/UserData";
import KeyPress from "../data/keyPress";
import * as events from "../events";
import GameState from "../gamestates/GameState";
import RoundState from "../gamestates/RoundState";
import { WaitingForNextRound, WaitingForNextRoundProps } from "../gamestates/WaitingForNextRound";
import WaitingForPlayers from "../gamestates/WaitingForPlayers";
import DisplayAnswers from "../components/DisplayAnswers";

// TODO: is there a better way to do this than just declaring here?
const pixiApp = new Application({ resizeTo: window });

const MainPage = () => {
  // BED says which user / side of keyboard
  const [allowList, setAllowList] = useState<string[]>([]);

  const client_id = Date.now();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [ownAnswers, setOwnAnswers] = useState<KeyPress[]>([]);
  const [enemyAnswers, setEnemyAnswers] = useState<KeyPress[]>([]);
  const [wordLengths, setWordLengths] = useState<number[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.WaitingForPlayers);
  const [winState, setWinState] = useState<WaitingForNextRoundProps>({ winner: false, winningText: "" });
  const [prompts, setPrompts] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<string[]>([]);

  useEffect(() => {
    const newWs = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_PREFIX}://${window.location.host}/ws/${client_id}`);
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
            events.teamAssignment(event, setUserData, setAllowList);
            break;
          case "submission":
            events.submission(event, submissions, setSubmissions);
            break;
          case "keyBuffer":
            if (userData) {
              events.keyBuffer(event, userData.team, setOwnAnswers, setEnemyAnswers);
            }
            break;
          case "prompt": {
            let promptsCopy = event.data?.continued === 0 ? [] : [...prompts];
            setPrompts([event.data.prompt, ...promptsCopy]);
            break;
          }
          case "setup":
            events.setup(event, setGameState, setWordLengths, setOwnAnswers, setEnemyAnswers);
            break;
          case "roundOver":
            events.roundOver(event, userData ? userData.team : -1, setGameState, setWinState);
            break;
        }
      };
    }
  }, [ws, userData, client_id]);

  useEffect(() => {
    const handleKeyUp = (event: any) => {
      const is_allowed = gameState == GameState.PlayingRound && allowList.includes(event.key.toLowerCase());
      is_allowed ? console.log("send to server") : console.log("ignore");
      if (is_allowed && ws) {
        ws.send(events.sendKey(event.key));
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [ws, allowList, gameState]);

  var gameStateUi: ReactElement;
  switch (gameState) {
    case GameState.WaitingForPlayers:
      gameStateUi = <WaitingForPlayers />;
      break;
    case GameState.PlayingRound:
      gameStateUi = (
        <RoundState
          wordLengths={wordLengths}
          userId={userData?.userid}
          ownAnswers={ownAnswers}
          enemyAnswers={enemyAnswers}
        />
      );
      break;
    case GameState.WaitingForNextRound:
      gameStateUi = <WaitingForNextRound {...winState} />;
      break;
  }

  return (
    <div className="flex flex-col items-center bg-orange-300 w-full h-full">
      <div className="flex w-full h-full flex-col relativ items-center">
        <div>
          <AppProvider value={pixiApp}>
            <FullScreenStage>
              <MainPageBackground />
              {gameStateUi}
            </FullScreenStage>
          </AppProvider>
        </div>
        <div className="flex gap-4 flex-grow">
          <DisplayAnswers submissions={submissions} />
          <PromptList prompts={prompts} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
