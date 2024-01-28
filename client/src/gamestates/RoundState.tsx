import AnswerLengthIndicator from "../components/AnswerLengthIndicator";
import TeamAndSideIndicator from "../components/TeamAndSideIndicator";
import UserData from "../data/UserData";
import KeyPress from "../data/keyPress";

type RoundStateProps = {
    userData?: UserData | null,
    wordLengths: number[],
    ownAnswers: KeyPress[],
    enemyAnswers: KeyPress[]
}

function RoundState(props: RoundStateProps) {
    return <>
        <AnswerLengthIndicator
            myUserId={props.userData?.userid}
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
        <TeamAndSideIndicator
            teamId={props.userData ? props.userData.team : -1}
            side={props.userData ? props.userData.playernum : -1}
        />
    </>
}

export default RoundState;