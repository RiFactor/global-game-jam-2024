import { useApp, Container } from "@pixi/react";
import SingleLetterIndicator from "./SingleLetterIndicator";

type pos = {
    x: number,
    y: number
};

function AnswerLengthIndicator(props: {screenFraction: number, spacing: number, wordLengths: number[]}) {
    const app = useApp();
    const maxLength = Math.max(...props.wordLengths);
    const lineLength = Math.max(maxLength, 6);
    const containerWidth = app.screen.width * props.screenFraction;
    const itemWidth = containerWidth - (props.spacing * lineLength - 1); // TODO: What do we do if this is negative?

    const lines: boolean[][] = [];
    var currLine: boolean[] = [];
    var currLen: number = 0;
    var leadingSpace: number = 0;
    props.wordLengths.forEach(length => {
        if (currLen + leadingSpace + length > lineLength) {
            lines.push(currLine);
            currLine = [];
            currLen = 0;
            leadingSpace = 0;
        } else {
            Array(leadingSpace).forEach(element => {
                currLine.push(false);
            });
        }
        Array(length).forEach(() => {
            currLine.push(true);
        });
        currLen += length;
        leadingSpace = 1;
    });

    var y = props.spacing;
    const positions = lines.flatMap((line) => {
        const length = line.length;
        var startX = (containerWidth - itemWidth*length - props.spacing*(length - 1)) / 2;
        const returnVal: pos[] = [];
        line.forEach((visible) => {
            if (visible) {
                returnVal.push({x: startX, y: y})
            }
            startX += containerWidth + props.spacing;
        })
        y += containerWidth + props.spacing;
        return returnVal;
    });

    return <Container width={containerWidth}>
        {
           positions.map((pos) => {
            return <SingleLetterIndicator width={containerWidth} x={pos.x} y={pos.y} />
           })
        }
    </Container>
}

export default AnswerLengthIndicator;