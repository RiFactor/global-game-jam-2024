import { Sprite, useApp } from "@pixi/react";
import T1L from "../assets/team1-lhs-ducks.png";
import T1R from "../assets/team1-rhs-ducks.png";
import T2L from "../assets/team2-lhs-ducks.png";
import T2R from "../assets/team2-rhs-ducks.png";

type IProps = {
    teamId: number,
    side: number
}

function TeamAndSideIndicator(props: IProps) {
    const app = useApp();
    const combined = (props.teamId - 1) + (props.side - 1) * 2;
    let image: string | undefined = undefined;
    switch(combined) {
        case 0:
            image = T1L;
            break;
        case 1:
            image = T2L;
            break;
        case 2:
            image = T1R;
            break;
        case 3:
            image = T2R;
            break;
    }
    return image ? <Sprite
        width={app.screen.width * 0.16}
        height={app.screen.width * 0.16}
        x={app.screen.width * 0.42}
        y={app.screen.height * 0.1}
        image={image} /> : undefined;
}