import Message from "./Message";
import ToolCall from "./ToolCall";

export default function MessageList({
  messages,
}: {
  messages: { text: string; sender: string; toolCalls?: any[] }[];
}) {
  return (
    <div className="max-h-screen pb-[100px] w-2/3 mx-auto p-10 overflow-y-scroll">
      {messages.map((message, index) => (
        <div key={index}>
          {/* {message.toolCalls && message.toolCalls.length > 0 && (
            <ToolCall toolCalls={message.toolCalls} />
          )} */}
          <Message text={message.text} sender={message.sender} />
        </div>
      ))}
    </div>
  );
}
