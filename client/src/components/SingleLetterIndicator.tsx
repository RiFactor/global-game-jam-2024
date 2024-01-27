import { useCallback } from "react";
import { Container, Graphics, Text, _ReactPixi } from "@pixi/react";

function SingleLetterIndicator(props: {width: number, x: number, y: number, character?: string}) {
    const draw = useCallback((g: _ReactPixi.IGraphics) => {
        g.clear!();
        g.beginFill!(0xffffff, 1);
        g.drawRoundedRect!(props.x, props.y, props.width, props.width, 10);
        g.endFill!();
    }, [])

    return <>
        <Graphics draw={draw} />
        {props.character ? <Container x={props.x} y={props.y} height={props.width} width={props.width}>
            <Text text={props.character} anchor={0.5} x={props.width / 2} y={props.width / 2} />
        </Container> : undefined}
    </>
}

export default SingleLetterIndicator;
