import { Sprite, useApp } from "@pixi/react";
import MoonStation from "../assets/moon-station.jpeg";

const MainPageBackground = () => {
  const app = useApp();
  return <Sprite width={app.screen.width} image={MoonStation} />;
};

export default MainPageBackground;
