import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") || 60);

    // Fetch cash flow data sorted chronologically
    const records = await prisma.cashFlow.findMany({
      orderBy: { date: "desc" },
      take: days,
    });

    const sorted = records.reverse();

    // Summary calculations
    const latest = sorted[sorted.length - 1];
    const historicalOnly = sorted.filter((r) => !r.forecasted);
    const recent7Days = historicalOnly.slice(-7);
    const prev7Days = historicalOnly.slice(-14, -7);

    const recentInflow = recent7Days.reduce((acc, r) => acc + r.inflow, 0);
    const prevInflow = prev7Days.reduce((acc, r) => acc + r.inflow, 0);
    const revenueDropPct = prevInflow > 0 ? Math.round(((prevInflow - recentInflow) / prevInflow) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        records: sorted,
        currentBalance: latest?.closingBalance || 4250000,
        recent7DayInflow: recentInflow,
        prev7DayInflow: prevInflow,
        revenueDropPct, // Demonstrates the 18% drop for demo script!
        safetyBuffer: 1500000,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
