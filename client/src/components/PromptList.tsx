import { useEffect, useState } from "react";

// {
//     "eventType": "prompt",
//     "data" : {
//         "continued": 1,
//         "prompt": "This cat's gone wild"
//     }
// }

interface IProps {
  prompts: string[];
}

const data = { continued: 1 };

const PromptList = ({ prompts }: IProps) => {
  // create a state to map and display
  // const [prompts, setPrompts] = useState<string[]>(["prompt 2", "prompt1"]);
  const [newState, setNewState] = useState(false);

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
