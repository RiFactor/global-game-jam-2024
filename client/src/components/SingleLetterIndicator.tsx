import { useCallback } from "react";
import { Graphics, _ReactPixi } from "@pixi/react";

function SingleLetterIndicator(props: {width: number, x: number, y: number}) {
    const draw = useCallback((g: _ReactPixi.IGraphics) => {
        g.clear!();
        g.beginFill!(0xffffff, 1);
        g.drawRoundedRect!(props.x, props.y, props.width, props.width, 10);
        g.endFill!();
    }, [])

    return <Graphics draw={draw} />
}

export default SingleLetterIndicator;
