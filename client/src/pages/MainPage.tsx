import { AppProvider, Container, Text } from "@pixi/react";
import { Application } from "pixi.js";
import FullScreenStage from "../components/FullScreenStage";
import Header from "../components/Header";

// TODO: is there a better way to do this than just declaring here?
const pixiApp = new Application({ resizeTo: window });

const MainPage = () => {
  return (
    <>
      <Header />
      <AppProvider value={pixiApp}>
        <FullScreenStage>
          <Container x={400} y={330}>
            <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} />
          </Container>
        </FullScreenStage>
      </AppProvider>
    </>
  );
};

export default MainPage;
