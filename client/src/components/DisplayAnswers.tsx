interface IProps {
  submissions: string[];
}

const DisplayAnswers = ({ submissions }: IProps) => {
  return (
    <div className="absolute left-0 w-1/3 top-1/2 h-fit bottom-0 z-10 bg-blue-300 mx-20 rounded max-h-[50vh] mb-20 opacity-95">
      <div className="flex flex-col gap-4 font-bold text-white overflow-clip">
        {submissions.map(i => {
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

export default DisplayAnswers;
