import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [{ id: params.id }, { externalId: params.id }],
      },
      include: {
        transactions: { orderBy: { timestamp: "desc" }, take: 10 },
        orders: { orderBy: { orderDate: "desc" }, take: 10 },
        subscriptions: true,
        invoices: true,
        returns: true,
        chargebacks: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
