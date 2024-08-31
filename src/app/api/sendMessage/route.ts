import { NextRequest } from "next/server";
import { Client } from "@langchain/langgraph-sdk";

export async function POST(req: NextRequest) {
  const { threadId, message } = await req.json();

  const client = new Client({
    apiUrl: process.env.LANGGRAPH_API_URL as string,
    apiKey: process.env.LANGGRAPH_API_KEY as string,
  });

  const input = {
    messages: [
      {
        role: "human",
        content: message,
      },
    ],
    userId: "dhruv",
  };
  const config = { configurable: { model_name: "openai" } };

  const stream = client.runs.stream(threadId, process.env.LANGGRAPH_ASSISTANT_ID as string, {
    input,
    config,
    streamMode: "messages",
  });

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          );
        }
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}
