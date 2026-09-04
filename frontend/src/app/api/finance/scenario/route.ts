import { NextResponse } from "next/server";
import { MLClient } from "@/lib/ml/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = MLClient.simulateCashflow({
      currentCash: body.currentCash ? Number(body.currentCash) : 4250000,
      revenueMultiplier: body.revenueMultiplier !== undefined ? Number(body.revenueMultiplier) : 1.0,
      expenseMultiplier: body.expenseMultiplier !== undefined ? Number(body.expenseMultiplier) : 1.0,
      recoveryUpliftINR: body.recoveryUpliftINR !== undefined ? Number(body.recoveryUpliftINR) : 0,
      safetyBufferINR: body.safetyBufferINR !== undefined ? Number(body.safetyBufferINR) : 1500000,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
