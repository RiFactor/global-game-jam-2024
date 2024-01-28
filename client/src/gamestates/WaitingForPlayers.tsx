import { Sprite, useApp } from "@pixi/react";
import WaitingAsset from "../assets/waiting-for-players.png";

function WaitingForPlayers() {
    const app = useApp();
    return <Sprite
        width={app.screen.width * 0.25}
        height={app.screen.width * 0.25}
        x={app.screen.width * 0.375}
        y={app.screen.height*0.5 - app.screen.width*0.125}
        image={WaitingAsset}
    />;
}

export default WaitingForPlayers;