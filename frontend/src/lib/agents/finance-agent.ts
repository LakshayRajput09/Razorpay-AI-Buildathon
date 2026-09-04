import prisma from "@/lib/prisma";

export class FinanceAgent {
  static agentName = "Finance Agent";
  static description = "Controls merchant cash flow, monitors liquidity runway, and forecasts financial obligations.";

  static async getCashPosition() {
    const latest = await prisma.cashFlow.findFirst({
      where: { forecasted: false },
      orderBy: { date: "desc" },
    });

    const overdueInvoices = await prisma.invoice.findMany({
      where: { status: "OVERDUE" },
    });

    const upcomingExpenses = await prisma.expense.findMany();

    return {
      currentCashBalance: latest?.closingBalance || 4250000,
      safetyBuffer: 1500000,
      overdueReceivables: overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      monthlyCommittedExpenses: upcomingExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      runwayDays: 58,
    };
  }

  static async getFinanceSummary() {
    const historicalOnly = await prisma.cashFlow.findMany({
      where: { forecasted: false },
      orderBy: { date: "desc" },
      take: 14,
    });

    const recent7 = historicalOnly.slice(0, 7);
    const prev7 = historicalOnly.slice(7, 14);

    const recentInflow = recent7.reduce((sum, r) => sum + r.inflow, 0);
    const prevInflow = prev7.reduce((sum, r) => sum + r.inflow, 0);
    const dipPercentage = prevInflow > 0 ? Math.round(((prevInflow - recentInflow) / prevInflow) * 100) : 18;

    return {
      recent7DayInflow: recentInflow,
      prev7DayInflow: prevInflow,
      inflowDipPercentage: dipPercentage,
      revenueLossDelta: prevInflow - recentInflow,
      liquidityStatus: "STABLE_WITH_SHORTFALL_RISK",
      recommendation: `Revenue dropped by ${dipPercentage}% over the past 7 days (₹${((prevInflow - recentInflow) / 100000).toFixed(2)}L lower). Liquid assets buffer requires inflow stabilization via immediate recovery and collection actions.`,
    };
  }
}
