import { NextResponse } from "next/server";
import { Client } from "@langchain/langgraph-sdk";

export async function POST() {
  try {
    const client = new Client({
      apiUrl: process.env.LANGGRAPH_API_URL as string,
      apiKey: process.env.LANGGRAPH_API_KEY as string,
    });

    // TODO: better way to create and store assistant Ids.
    // for now, uncomment this once, reload the homepage, copy the assistant_id from console and set it in LANGGRAPH_ASSISTANT_ID env var
    // console.log((await client.assistants.create({ graphId: process.env.LANGGRAPH_GRAPH_ID as string })).assistant_id);

    const thread = await client.threads.create();
    return NextResponse.json(thread);
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
