import { NextResponse } from "next/server";
import { MLClient } from "@/lib/ml/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await MLClient.predictFraud({
      amount: Number(body.amount || 1000),
      customerHistoricalAvg: body.customerHistoricalAvg ? Number(body.customerHistoricalAvg) : 5000,
      velocityCount10m: body.velocityCount10m ? Number(body.velocityCount10m) : 1,
      isInternational: Boolean(body.isInternational),
      deviceIsNew: Boolean(body.deviceIsNew),
      ipDistanceKm: body.ipDistanceKm ? Number(body.ipDistanceKm) : 10,
      accountAgeDays: body.accountAgeDays ? Number(body.accountAgeDays) : 180,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
