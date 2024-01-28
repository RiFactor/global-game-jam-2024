import AnswerLengthIndicator from "../components/AnswerLengthIndicator";
import KeyPress from "../data/keyPress";

type RoundStateProps = {
    userId?: number,
    wordLengths: number[],
    ownAnswers: KeyPress[],
    enemyAnswers: KeyPress[]
}

function RoundState(props: RoundStateProps) {
    return <>
        <AnswerLengthIndicator
            myUserId={props.userId}
            screenFraction={0.3}
            spacing={10}
            wordLengths={props.wordLengths}
            currentAnswer={props.ownAnswers}
            screenFractionOffset={0.1}
        />
        <AnswerLengthIndicator
            screenFraction={0.3}
            spacing={10}
            wordLengths={props.wordLengths}
            currentAnswer={props.enemyAnswers}
            screenFractionOffset={0.6}
        />
    </>
}

export default RoundState;