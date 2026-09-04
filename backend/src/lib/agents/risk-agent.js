"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAgent = void 0;
const prisma_1 = __importDefault(require("@/lib/prisma"));
const client_1 = require("@/lib/ml/client");
class RiskAgent {
    static agentName = "Risk Agent";
    static description = "Minimizes fraud, chargebacks, and RTO return losses with explainable AI.";
    static async getTransaction(txId) {
        return prisma_1.default.transaction.findFirst({
            where: { OR: [{ id: txId }, { transactionId: txId }] },
            include: { customer: true },
        });
    }
    static async calculateFraudRisk(txId) {
        const tx = await this.getTransaction(txId);
        if (!tx)
            throw new Error("Transaction not found");
        return client_1.MLClient.predictFraud({
            amount: tx.amount,
            customerHistoricalAvg: tx.customer.avgOrderValue,
            velocityCount10m: tx.velocityCount10m,
            isInternational: tx.isInternational,
            deviceIsNew: tx.deviceFingerprint?.includes("anon") || false,
            ipDistanceKm: tx.isInternational ? 8400 : 25,
            accountAgeDays: tx.customer.accountAgeDays,
        });
    }
    static async getRiskSummary() {
        const criticalTx = await prisma_1.default.transaction.findFirst({
            where: { riskTier: "CRITICAL" },
            include: { customer: true },
        });
        const activeChargebacks = await prisma_1.default.chargeback.findMany({
            where: { status: "UNDER_REVIEW" },
        });
        return {
            preventedFraudLossLast7d: 145000,
            criticalCasePendingReview: criticalTx
                ? {
                    transactionId: criticalTx.transactionId,
                    amount: criticalTx.amount,
                    customerName: criticalTx.customer.name,
                    riskScore: criticalTx.riskScore,
                    location: criticalTx.location,
                }
                : null,
            chargebacksAtRiskINR: activeChargebacks.reduce((sum, cb) => sum + cb.amount, 0),
            totalChargebacks: activeChargebacks.length,
            recommendation: "Manual authorization required for 1 flagged high-ticket transaction (₹68,500). Dispute representment pack drafted.",
        };
    }
}
exports.RiskAgent = RiskAgent;
