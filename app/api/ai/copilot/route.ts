import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ai } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const authCheck = await auth.requireAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, contextId, type } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const result = await ai.runCopilot(prompt, contextId, type);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Copilot API error:", error);
    return NextResponse.json({ error: "Copilot execution failed" }, { status: 500 });
  }
}
