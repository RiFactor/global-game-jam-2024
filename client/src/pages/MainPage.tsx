import { AppProvider, Container, Text } from "@pixi/react";
import { Application } from "pixi.js";
import FullScreenStage from "../components/FullScreenStage";
import AnswerLengthIndicator from "../components/AnswerLengthIndicator";
import Header from "../components/Header";

// TODO: is there a better way to do this than just declaring here?
const pixiApp = new Application({ resizeTo: window });

const MainPage = () => {
  return (
    <>
      <Header />
      <AppProvider value={pixiApp}>
        <FullScreenStage>
          <AnswerLengthIndicator screenFraction={0.3} spacing={10} wordLengths={[2,4,8]} screenFractionOffset={0.1} />
          <AnswerLengthIndicator screenFraction={0.3} spacing={10} wordLengths={[2,4,8]} screenFractionOffset={0.6} />
          <Container x={400} y={330} anchor={0.5}>
            <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} />
          </Container>
        </FullScreenStage>
      </AppProvider>
    </>
  );
};

export default MainPage;
