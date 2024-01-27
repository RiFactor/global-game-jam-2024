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

  return (
    <div className="bg-blue-800 w-40 p-5 m-5 rounded text-center">
      <div className="bg-yellow-300 rounded p-5 text-rose-700 font-bold">
        <p className="">Team {team}</p>
        <p>Player {playernum}</p>
      </div>
    </div>
  );
};

export default TeamDisplay;
