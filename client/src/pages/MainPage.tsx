import Header from "../components/Header";
import NavBar from "../components/NavBar";
import FullScreenStage from "../components/FullScreenStage";
import { Container, Text, AppProvider } from '@pixi/react';
import { Application } from 'pixi.js';

// TODO: is there a better way to do this than just declaring here?
const pixiApp = new Application({resizeTo: window})

const MainPage = () => {
  return (
    <>
      <Header />
      <NavBar />
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
