import { useCallback } from "react";
import { Graphics, _ReactPixi } from "@pixi/react";

function SingleLetterIndicator(props: {width: number}) {
    const draw = useCallback((g: _ReactPixi.IGraphics) => {
        g.clear!();
        g.beginFill!(0xffffff, 1);
        g.drawRoundedRect!(0, 0, props.width, props.width, 10);
        g.endFill!();
    }, [])

    return <Graphics draw={draw} />
}

export default SingleLetterIndicator;
