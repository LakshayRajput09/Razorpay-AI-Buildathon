import { NextResponse } from "next/server";
import { MerchantAssistantAI } from "@/lib/ai/merchant-assistant-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body?.query || "Why did revenue drop this week?";
    const result = await MerchantAssistantAI.answerQuestion(query);

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("AI Business Advisor route error:", err);
    try {
      const fallbackResult = await MerchantAssistantAI.answerQuestion(
        "Why did revenue drop this week?"
      );
      return NextResponse.json({ success: true, data: fallbackResult });
    } catch {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to process advisor query" },
        { status: 500 }
      );
    }
  }
}
