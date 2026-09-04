"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowthAgent = void 0;
const prisma_1 = __importDefault(require("@/lib/prisma"));
const client_1 = require("@/lib/ml/client");
class GrowthAgent {
    static agentName = "Growth Agent";
    static description = "Increases legitimate revenue, accelerates customer lifetime value, and recovers churn risk.";
    static async getCustomer(customerId) {
        return prisma_1.default.customer.findFirst({
            where: { OR: [{ id: customerId }, { externalId: customerId }] },
        });
    }
    static async predictPurchase(customerId) {
        const customer = await this.getCustomer(customerId);
        if (!customer)
            throw new Error("Customer not found");
        return client_1.MLClient.predictGrowth({
            totalSpend: customer.totalSpend,
            orderCount: customer.orderCount,
            accountAgeDays: customer.accountAgeDays,
            segment: customer.segment,
        });
    }
    static async getGrowthSummary() {
        const customers = await prisma_1.default.customer.findMany();
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
exports.GrowthAgent = GrowthAgent;
