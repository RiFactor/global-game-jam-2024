import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { Stage, Container, Sprite, Text } from '@pixi/react';

const MainPage = () => {
  return (
    <>
      <Header />
      <NavBar />
      <Stage options={{ backgroundColor: 0xeef1f5 }}>
        <Container x={400} y={330}>
          <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} />
        </Container>
      </Stage>
    </>
  );
};

export default MainPage;
