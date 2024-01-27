import { Text } from "@pixi/react";

const TeamDisplay = () => {
  const eventType = "teamAssignment";
  const event = {
    data: {
      team: 1,
      playernum: 1,
      userid: 1231231
    }
  };

  let team: number | undefined = undefined;
  let playernum: number | undefined = undefined;
  if (eventType === "teamAssignment") {
    team = event?.data?.team;
    playernum = event?.data?.playernum;
  }

  const myValue = "hello";

  return (
    // <div className="bg-blue-800 w-40 p-5 m-5 rounded text-center">
    //   <div className="bg-yellow-300 rounded p-5 text-rose-700 font-bold">
    //     <p className="">Team {team}</p>
    //     <p>Player {playernum}</p>
    //   </div>
    // </div>

    <Text text="team" />

    // <Text
    //   text="Hello World"
    //   anchor={0.5}
    //   x={150}
    //   y={150}
    //   style={
    //     new PIXI.TextStyle({
    //       align: "center",
    //       fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
    //       fontSize: 50,
    //       fontWeight: "400",
    //       fill: ["#ffffff", "#00ff99"], // gradient
    //       stroke: "#01d27e",
    //       strokeThickness: 5,
    //       letterSpacing: 20,
    //       dropShadow: true,
    //       dropShadowColor: "#ccced2",
    //       dropShadowBlur: 4,
    //       dropShadowAngle: Math.PI / 6,
    //       dropShadowDistance: 6,
    //       wordWrap: true,
    //       wordWrapWidth: 440
    //     })
    //   }
    // />
  );
};

export default TeamDisplay;
