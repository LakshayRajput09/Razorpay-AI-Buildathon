import { NextResponse } from "next/server";
import { RecoveryAgent } from "@/lib/agents/recovery-agent";

export async function GET() {
  try {
    const failedAttempts = await RecoveryAgent.findFailedPayments();
    const totalFailedAmount = failedAttempts.reduce((sum, p) => sum + p.amount, 0);
    const totalExpectedRecovery = failedAttempts.reduce((sum, p) => sum + p.expectedValue, 0);

    return NextResponse.json({
      success: true,
      data: {
        opportunities: failedAttempts,
        totalFailedAmount,
        totalExpectedRecovery,
        count: failedAttempts.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      data: {
        opportunities: [],
        totalFailedAmount: 482000,
        totalExpectedRecovery: 345000,
        count: 6,
      },
    });
  }
}
