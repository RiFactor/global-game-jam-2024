import UserData from "./data/UserData";

export function sendKey(key: string) {
  return `{"eventType":"keyPress", "data":{"value": "${key}"}}`;
}

export function teamAssignment(event: any, setUserData: (data: any) => void) {
    const ud = new UserData(event.data.userid);
    setUserData(ud);
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