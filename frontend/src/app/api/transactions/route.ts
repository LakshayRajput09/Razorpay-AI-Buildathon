import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const riskTier = searchParams.get("riskTier");

    const where: any = {};
    if (riskTier && riskTier !== "ALL") {
      where.riskTier = riskTier.toUpperCase();
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        customer: true,
      },
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
