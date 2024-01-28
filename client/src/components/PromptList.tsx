import { useEffect, useState } from "react";

// {
//     "eventType": "prompt",
//     "data" : {
//         "continued": 1,
//         "prompt": "This cat's gone wild"
//     }
// }

const data = { continued: 1 };

const PromptList = () => {
  // create a state to map and display
  const [prompts, setPrompts] = useState<string[]>(["prompt 2", "prompt1"]);
  const [newState, setNewState] = useState(false);

  useEffect(() => {
    // The `continued` flag indicates whether this should be added to the previous prompt.
    // If it is 1, it is continued. If it is 0, it is a new prompt.
    let promptsCopy = data?.continued === 0 ? [""] : [...prompts];
    // from back end push to list so that it appears at the top
    setPrompts(["prompt 3", ...promptsCopy]);
  }, [
    // when the prompts change
    newState
    // prompts
  ]);

  return (
    <div className="-ml-20 my-20 mr-20 absolute z-100 top-0 right-0">
      <div className="flex flex-col gap-4 font-bold text-white">
        {prompts.map(i => {
          return (
            <p
              className="hover:transition-transform hover:duration-500 hover:ease-in-out backdrop-blur-sm rounded p-2"
              key={i}
            >
              {i}
            </p>
          );
        })}
        <button onClick={() => setNewState(!newState)}>test</button>
      </div>
    </div>
  );
};

export default PromptList;
