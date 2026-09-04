import prisma from "@/lib/prisma";
import { MLClient } from "@/lib/ml/client";

export class GrowthAgent {
  static agentName = "Growth Agent";
  static description = "Increases legitimate revenue, accelerates customer lifetime value, and recovers churn risk.";

  static async getCustomer(customerId: string) {
    return prisma.customer.findFirst({
      where: { OR: [{ id: customerId }, { externalId: customerId }] },
    });
  }

  static async predictPurchase(customerId: string) {
    const customer = await this.getCustomer(customerId);
    if (!customer) throw new Error("Customer not found");

    return MLClient.predictGrowth({
      totalSpend: customer.totalSpend,
      orderCount: customer.orderCount,
      accountAgeDays: customer.accountAgeDays,
      segment: customer.segment,
    });
  }

  static async getGrowthSummary() {
    const customers = await prisma.customer.findMany();
    const champions = customers.filter((c) => c.segment === "CHAMPIONS");
    const atRisk = customers.filter((c) => c.segment === "AT_RISK");
    const loyal = customers.filter((c) => c.segment === "LOYAL");

    return {
      totalCustomers: customers.length,
      championCount: champions.length,
      atRiskCount: atRisk.length,
      loyalCount: loyal.length,
      potentialReactivationGMV: 620000,
      recommendedCampaign: {
        name: "At-Risk Customer Re-engagement Surge",
        targetSegment: "AT_RISK",
        targetCount: atRisk.length,
        recommendedDiscount: 8,
        expectedUpliftPct: 34,
        expectedIncrementalRevenue: 418000,
      },
    };
  }
}
