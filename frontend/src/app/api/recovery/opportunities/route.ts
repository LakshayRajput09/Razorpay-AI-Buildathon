import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const failedAttempts = await prisma.paymentAttempt.findMany({
      where: {
        outcome: { in: ["FAILED", "RETRY_SCHEDULED"] },
      },
      orderBy: { expectedValue: "desc" },
      take: 50,
    });

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
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
