import { AppProvider, Container, Text } from "@pixi/react";
import { Application } from "pixi.js";
import FullScreenStage from "../components/FullScreenStage";
import AnswerLengthIndicator from "../components/AnswerLengthIndicator";
import Header from "../components/Header";
import KeyPress from "../data/keyPress";

// TODO: is there a better way to do this than just declaring here?
const pixiApp = new Application({ resizeTo: window });

// TODO test data, should be deleted
const wordLengths = [2,3,4]
const leftAnswer: KeyPress[] = [
  {key: "i", userid:1},
  {key: "m", userid:1},
  {key: "t", userid:1},
  {key: "h", userid:1},
  {key: "e", userid:1},
  {key: "b", userid:1},
  {key: "s", userid:1},
  {key: "o", userid:1},
  {key: "s", userid:1}
]
const rightAnswer: KeyPress[] = [
  {key: "m", userid:1},
  {key: "i", userid:1},
  {key: "h", userid:1},
  {key: "t", userid:1}
]

const MainPage = () => {
  return (
    <>
      <Header />
      <AppProvider value={pixiApp}>
        <FullScreenStage>
          <AnswerLengthIndicator
            screenFraction={0.3}
            spacing={10}
            wordLengths={wordLengths}
            currentAnswer={leftAnswer}
            screenFractionOffset={0.1} />
          <AnswerLengthIndicator
            screenFraction={0.3}
            spacing={10}
            wordLengths={wordLengths}
            currentAnswer={rightAnswer}
            screenFractionOffset={0.6} />
          <Container x={400} y={330} anchor={0.5}>
            <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} />
          </Container>
        </FullScreenStage>
      </AppProvider>
    </>
  );
};

export default MainPage;
