import { useCallback } from "react";
import { Container, Graphics, Text, _ReactPixi } from "@pixi/react";
import { TextStyle } from "pixi.js";

function SingleLetterIndicator(props: {width: number, x: number, y: number, isYou: boolean, character?: string}) {
    const draw = useCallback((g: _ReactPixi.IGraphics) => {
        g.clear!();
        g.beginFill!(0xffffff, 1);
        g.drawRoundedRect!(props.x, props.y, props.width, props.width, 10);
        g.endFill!();
    }, [])

    return <>
        <Graphics draw={draw} />
        {props.character ? <Container
            x={props.x}
            y={props.y}
            height={props.width}
            width={props.width}>
            <Text
                text={props.character}
                anchor={0.5}
                x={props.width / 2}
                y={props.width / 2}
                style={
                    props.isYou ? 
                        new TextStyle({
                        fill: ['#aabbcc', '#7799aa'],
                        stroke: '#336699',
                        strokeThickness: 3
                        }) : 
                        new TextStyle({
                        fill: ['#787878', '#454545'],
                        stroke: '#232323',
                        strokeThickness: 3
                        })} />
        </Container> : undefined}
    </>
}

export default SingleLetterIndicator;
