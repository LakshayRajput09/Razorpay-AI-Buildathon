import { NextResponse } from "next/server";
import { MLClient } from "@/lib/ml/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await MLClient.predictGrowth({
      totalSpend: Number(body.totalSpend || 10000),
      orderCount: Number(body.orderCount || 2),
      accountAgeDays: Number(body.accountAgeDays || 60),
      lastOrderDaysAgo: body.lastOrderDaysAgo !== undefined ? Number(body.lastOrderDaysAgo) : 30,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
