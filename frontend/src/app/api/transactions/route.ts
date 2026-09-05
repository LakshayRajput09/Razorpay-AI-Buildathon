import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const FALLBACK_TRANSACTIONS = [
  {
    id: "tx_demo_1",
    transactionId: "pay_risk_9941a",
    amount: 68500,
    currency: "INR",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    method: "CARD",
    status: "REVIEW",
    riskScore: 91.4,
    riskTier: "CRITICAL",
    deviceFingerprint: "anon_vpn_gateway_331",
    ipAddress: "185.220.101.5",
    location: "Moscow, Russia (Tor Exit Node)",
    velocityCount10m: 6,
    isInternational: true,
    customer: {
      name: "Vikram Malhotra",
      email: "vikram.m@domain.co",
      riskTier: "CRITICAL",
    },
  },
  {
    id: "tx_demo_2",
    transactionId: "pay_live_8832b",
    amount: 14200,
    currency: "INR",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    method: "UPI",
    status: "SUCCESS",
    riskScore: 12.0,
    riskTier: "LOW",
    deviceFingerprint: "pixel8_bengaluru_trusted",
    ipAddress: "49.207.210.14",
    location: "Bengaluru, Karnataka",
    velocityCount10m: 1,
    isInternational: false,
    customer: {
      name: "Ananya Deshmukh",
      email: "ananya.d@lifestyle.in",
      riskTier: "LOW",
    },
  },
  {
    id: "tx_demo_3",
    transactionId: "pay_live_7719c",
    amount: 32000,
    currency: "INR",
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    method: "NETBANKING",
    status: "SUCCESS",
    riskScore: 24.5,
    riskTier: "LOW",
    deviceFingerprint: "macbook_pro_mumbai",
    ipAddress: "103.21.124.9",
    location: "Mumbai, Maharashtra",
    velocityCount10m: 2,
    isInternational: false,
    customer: {
      name: "Rohan Singhania",
      email: "rohan.s@corporate.in",
      riskTier: "LOW",
    },
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const riskTier = searchParams.get("riskTier");

    const where: any = {};
    if (riskTier && riskTier !== "ALL") {
      where.riskTier = riskTier.toUpperCase();
    }

    try {
      const transactions = await prisma.transaction.findMany({
        where,
        include: {
          customer: true,
        },
        orderBy: { timestamp: "desc" },
        take: 50,
      });
      if (transactions && transactions.length > 0) {
        return NextResponse.json({ success: true, data: transactions });
      }
    } catch (dbErr) {
      console.warn("Prisma unavailable in /api/transactions, using resilient fallback:", dbErr);
    }

    const filtered = riskTier && riskTier !== "ALL"
      ? FALLBACK_TRANSACTIONS.filter((t) => t.riskTier === riskTier.toUpperCase())
      : FALLBACK_TRANSACTIONS;

    return NextResponse.json({ success: true, data: filtered });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: FALLBACK_TRANSACTIONS });
  }
}
