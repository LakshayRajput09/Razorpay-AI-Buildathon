import { NextResponse } from "next/server";
import { ActionEngine } from "@/lib/actions/action-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const preview = await ActionEngine.preview({
      agentName: body.agentName,
      actionType: body.actionType,
      entityId: body.entityId,
      reason: body.reason,
      financialImpact: body.financialImpact ? Number(body.financialImpact) : 0,
      discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : 0,
      riskTier: body.riskTier || "LOW",
      metadata: body.metadata,
    });

    return NextResponse.json({ success: true, data: preview });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
