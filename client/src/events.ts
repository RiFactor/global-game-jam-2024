import UserData from "./data/UserData";
import KeyBuffer from "./data/keyBuffer";
import KeyPress from "./data/keyPress";
import { permittedKeysOne, permittedKeysTwo } from "./constants/keyboard";
import GameState from "./gamestates/GameState";
import { WaitingForNextRoundProps } from "./gamestates/WaitingForNextRound";
import RoundOver from "./data/roundOver";

export function sendKey(key: string) {
  return `{"eventType":"keyPress", "data":{"value": "${key}"}}`;
}

export function teamAssignment(event: any, setUserData: (data: UserData) => void, setAllowList: (allowList: string[]) => void) {
    const userData = event.data as UserData;
    setUserData(userData);
    const allowed_list = userData.playernum === 1 ? permittedKeysOne : permittedKeysTwo;
    setAllowList(allowed_list);
}

export function submissionState(event: any) {
    let messages = document.getElementById("messages");
    let message = document.createElement("li");
    // print the submission to the screen
    let content_box1 = document.createTextNode(event.data.submission);
    message.appendChild(content_box1);
    messages?.appendChild(message);

    if (event.data.submissionState === "correct") {
      // level passed
    } else {
      // level not finished
    }
}

export function keyPress(event: any) {
    let messages = document.getElementById("messages");
    let message = document.createElement("li");
    console.log(sendKey(event.data.value));
    let content_box = document.createTextNode(event.data.value);
    message.appendChild(content_box);
    messages?.appendChild(message);
}

export function keyBuffer(event: any, myTeamId: number, setOwnAnswers: (keys: KeyPress[]) => void, setEnemyAnswers: (keys: KeyPress[]) => void) {
    const buffer = event.data as KeyBuffer;
    if (buffer.team === myTeamId) {
        setOwnAnswers(buffer.keys)
    } else {
        setEnemyAnswers(buffer.keys)
    }
}

export function setup(event: any, setGameState: (state: GameState) => void, setWordLengths: (wordLengths: number[]) => void, setOwnAnswers: (keys: KeyPress[]) => void, setEnemyAnswers: (keys: KeyPress[]) => void) {
  setWordLengths(event.data.bufferLayout);
  setOwnAnswers([]);
  setEnemyAnswers([]);
  setGameState(GameState.PlayingRound);
}

export function roundOver(event: any, myTeamId: number, setGameState: (state: GameState) => void, setWinState: (state: WaitingForNextRoundProps) => void) {
  const roundOver = event.data as RoundOver;
  setWinState({
    winner: myTeamId === roundOver.winningTeam,
    winningText: roundOver.winningWord
  });
  setGameState(GameState.WaitingForNextRound);
}