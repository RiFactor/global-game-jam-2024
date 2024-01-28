interface IProps {
  prompts: string[];
}

const PromptList = ({ prompts }: IProps) => {
  return (
    <div className="absolute top-1/2 h-fit bottom-0 z-10 bg-red-300 mx-20 rounded">
      <div className="flex flex-col gap-4 font-bold text-white">
        {prompts.map(i => {
          return (
            <p
              className="text-center hover:transition-transform hover:duration-500 hover:ease-in-out backdrop-blur-sm rounded p-2"
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
