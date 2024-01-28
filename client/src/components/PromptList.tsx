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

const PromptList = ({ prompts }: IProps) => {
  return (
    <div className="absolute grow left-1/4 top-1/2 h-fit bottom-0 z-10 bg-blue-300 mx-20 rounded max-h-[50vh] mb-20 opacity-95">
      <div className="flex flex-col gap-4 font-bold text-white overflow-clip">
        {prompts.map(i => {
          return (
            <p
              className="text-center hover:transition-transform hover:duration-500 hover:ease-in-out backdrop-blur-sm rounded p-2 "
              key={i}
            >
              {i}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default PromptList;
