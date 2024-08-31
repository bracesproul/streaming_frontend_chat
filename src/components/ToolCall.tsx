import React from "react";

const ToolCall = ({
  id,
  name,
  args,
}: {
  id: string;
  name: string;
  args: string;
}) => {
  return (
    <div className="bg-[#3a3a3a] text-white p-3 rounded-lg mb-2 text-sm">
      <p>
        <strong>Tool Call:</strong> {name}
      </p>
      <p>
        <strong>Arguments:</strong> {args}
      </p>
    </div>
  );
};

export default ToolCall;
