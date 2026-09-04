import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body.amount || 5000);
    const isFirstTime = Boolean(body.isFirstTime);
    const foreignIp = Boolean(body.foreignIp);

    let prob = 0.05;
    const factors = [];

    if (amount > 50000) {
      prob += 0.25;
      factors.push("High ticket transaction size (> ₹50k)");
    }
    if (foreignIp) {
      prob += 0.35;
      factors.push("Discrepancy in card billing country vs connection IP");
    }
    if (isFirstTime) {
      prob += 0.15;
      factors.push("First-time transaction on merchant platform");
    }

    const rounded = Math.min(0.95, Math.round(prob * 100) / 100);

    return NextResponse.json({
      success: true,
      data: {
        chargebackProbability: rounded,
        riskTier: rounded >= 0.5 ? "HIGH" : rounded >= 0.2 ? "MEDIUM" : "LOW",
        topFactors: factors,
        recommendedAction: rounded >= 0.5 ? "DRAFT_DISPUTE_DEFENSE" : "MONITOR",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
