import { NextResponse } from "next/server";
import { Client } from "@langchain/langgraph-sdk";

export async function POST() {
  try {
    const client = new Client({
      apiUrl: process.env.LANGGRAPH_API_URL as string,
      apiKey: process.env.LANGGRAPH_API_KEY as string,
    });

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
