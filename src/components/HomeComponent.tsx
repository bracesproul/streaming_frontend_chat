import React from "react";

const exampleMessages = [
  "What's the weather in SF?",
  "What's langchain?",
  "Tell me the revenue of mcdonalds",
  "Tell me a joke",
];

const HomeComponent: React.FC<{
  onMessageSelect: (message: string) => void;
}> = ({ onMessageSelect }) => {
  return (
    <div className="flex flex-col items-center  justify-center h-full">
      <h1 className="text-4xl font-semibold text-white mb-8">StreamChat</h1>
      <div className="grid grid-cols-2 gap-4">
        {exampleMessages.map((message, index) => (
          <div
            key={index}
            className="bg-transparent border-[1px] border-[#ffffff1a] p-4 rounded-lg text-gray-400 cursor-pointer transition-colors duration-500 ease-in-out hover:bg-[#2f2f2f]"
            onClick={() => onMessageSelect(message)}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeComponent;
