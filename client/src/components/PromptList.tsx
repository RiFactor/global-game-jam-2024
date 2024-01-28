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

  useEffect(
    () => {
      // The `continued` flag indicates whether this should be added to the previous prompt.
      // If it is 1, it is continued. If it is 0, it is a new prompt.
      let promptsCopy = data?.continued === 0 ? [""] : [...prompts];
      // from back end push to list so that it appears at the top
      setPrompts(["this", ...promptsCopy]);
    },
    [
      // when the prompts change
    ]
  );

  return (
    <div className="bg-red-400">
      PromptList
      <div className="flex flex-col gap-2 font-bold text-white ">
        {prompts.map(i => {
          return <p key={i}>{i}</p>;
        })}
      </div>
    </div>
  );
};

export default PromptList;
