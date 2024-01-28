import { Sprite, Text, useApp } from "@pixi/react";
import Correet from "../assets/correet.jpeg";
import TooSlow from "../assets/too-slow.jpeg";
import { TextStyle } from "pixi.js";

type WaitingForNextRoundProps = {
    winner: boolean,
    winningText: string
}

function WaitingForNextRound(props: WaitingForNextRoundProps) {
    const app = useApp();
    return <>
        <Sprite
            width={app.screen.width * 0.25}
            height={app.screen.width * 0.25}
            x={app.screen.width * 0.375}
            y={app.screen.height*0.5}
            image={props.winner ? Correet : TooSlow}
        />
        <Text
            text="The winning word was:"
            anchor={0.5}
            x={app.screen.width * 0.5}
            y={app.screen.height * 0.1}
            style={
                new TextStyle({
                fill: ['#4545bc', '#232389'],
                stroke: '#9a9aff',
                strokeThickness: 5,
                fontWeight: "500",
                fontSize: 36
                })
            }
        />
        <Text
            text={props.winningText}
            anchor={0.5}
            x={app.screen.width * 0.5}
            y={app.screen.height * 0.3}
            style={
                new TextStyle({
                fill: ['#45bc89', '#238945'],
                stroke: '#9aff9a',
                strokeThickness: 5,
                fontWeight: "700",
                fontSize: 46
                })
            }
        />
    </>;
}

export default WaitingForNextRound;