"use client";

import { useState, useEffect } from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import HomeComponent from "./HomeComponent";
import { Client } from "@langchain/langgraph-sdk";

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [threadId, setThreadId] = useState<string | null>(null);

  const formatToolCalls = (toolCalls: any) => {
    if (toolCalls && toolCalls.length > 0) {
      const formattedCalls = toolCalls.map((call: any) => {
        return `Tool Call ID: ${call.id}, Function: ${call.name}, Arguments: ${call.args}`;
      });
      return formattedCalls.join("\n");
    }
    return "No tool calls";
  };

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { text: message, sender: "user" }]);

    if (!threadId) {
      console.error("Thread ID is not available");
      return;
    }

    try {
      const response = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId, message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const events = chunk.split("\n\n");

        for (const event of events) {
          if (event.startsWith("data: ")) {
            const jsonData = JSON.parse(event.slice(6));
            handleStreamEvent(jsonData);
          }
        }
      }
    } catch (error) {
      console.error("Error streaming messages:", error);
    }
  };

  const handleStreamEvent = (event: any) => {
    if (event.event === "metadata") {
      console.log(`Metadata: Run ID - ${event.data.run_id}`);
    } else if (event.event === "messages/partial") {
      event.data.forEach((dataItem: any) => {
        if (dataItem.role && dataItem.role === "user") {
          console.log(`Human: ${dataItem.content}`);
        } else {
          const toolCalls = dataItem.tool_calls || [];
          const invalidToolCalls = dataItem.invalid_tool_calls || [];
          const content = dataItem.content || "";
          const responseMetadata = dataItem.response_metadata || {};

          if (content) {
            console.log(`AI: ${content}`);
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              if (lastMessage && lastMessage.sender === "ai") {
                return [
                  ...prevMessages.slice(0, -1),
                  { text: content, sender: "ai" },
                ];
              } else {
                return [...prevMessages, { text: content, sender: "ai" }];
              }
            });
          }

          if (toolCalls.length > 0) {
            console.log("Tool Calls:");
            console.log(formatToolCalls(toolCalls));
          }

          if (invalidToolCalls.length > 0) {
            console.log("Invalid Tool Calls:");
            console.log(formatToolCalls(invalidToolCalls));
          }

          if (responseMetadata) {
            const finishReason = responseMetadata.finish_reason || "N/A";
            console.log(`Response Metadata: Finish Reason - ${finishReason}`);
          }
        }
      });
    }
  };

  const handleMessageSelect = (message: string) => {
    handleSendMessage(message);
  };

  useEffect(() => {
    const createThread = async () => {
      try {
        const response = await fetch("/api/createThread", { method: "POST" });
        const data = await response.json();
        setThreadId(data.thread_id);
      } catch (error) {
        console.error("Error creating thread:", error);
      }
    };

    createThread();
  }, []);

  return (
    <div className="w-full h-screen bg-[#212121] overflow-hidden rounded-lg shadow-md">
      {messages.length === 0 ? (
        <HomeComponent onMessageSelect={handleMessageSelect} />
      ) : (
        <MessageList messages={messages} />
      )}
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
}
