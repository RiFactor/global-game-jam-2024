import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./pages/routes";
import { sound } from "@pixi/sound";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <RouterProvider router={router} />
  </>
);

const loop = sound.add("loop", {
  url: "assets/audio/loop.mp3"
});
sound.add("intro", {
  url: "assets/audio/intro.mp3",
  autoPlay: true,
  complete: () => {
    loop.play();
  }
});


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
