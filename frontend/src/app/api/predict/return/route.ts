import { NextResponse } from "next/server";
import { MLClient } from "@/lib/ml/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await MLClient.predictReturn({
      amount: Number(body.amount || 2500),
      isCod: Boolean(body.isCod),
      category: String(body.category || "Apparel"),
      customerReturnRate: body.customerReturnRate ? Number(body.customerReturnRate) : 0.1,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
