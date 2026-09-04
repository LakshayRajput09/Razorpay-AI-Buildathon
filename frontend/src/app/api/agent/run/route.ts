import { NextResponse } from "next/server";
import { MerchantAssistantAI } from "@/lib/ai/merchant-assistant-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query || "Why did my revenue fall and what should I do?";
    const result = await MerchantAssistantAI.answerQuestion(query);

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
