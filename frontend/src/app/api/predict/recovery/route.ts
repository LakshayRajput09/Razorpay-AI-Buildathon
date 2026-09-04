import { NextResponse } from "next/server";
import { MLClient } from "@/lib/ml/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await MLClient.predictRecovery({
      amount: Number(body.amount || 5000),
      failureReason: String(body.failureReason || "BANK_SERVER_DOWN"),
      paymentMethod: String(body.paymentMethod || "UPI"),
      retryCount: body.retryCount ? Number(body.retryCount) : 0,
      customerOrderCount: body.customerOrderCount ? Number(body.customerOrderCount) : 1,
      customerSpend: body.customerSpend ? Number(body.customerSpend) : 5000,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
