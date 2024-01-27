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
    <div className="bg-blue-200 max-w-40 m-20 rounded">
      <div className="bg-yellow-200 rounded p-5">
        <p>Team {team}</p>
        <p>Player {playernum}</p>
      </div>
    </div>
  );
};

export default TeamDisplay;
