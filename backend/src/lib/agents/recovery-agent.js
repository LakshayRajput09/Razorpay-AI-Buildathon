"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryAgent = void 0;
const prisma_1 = __importDefault(require("@/lib/prisma"));
class RecoveryAgent {
    static agentName = "Recovery Agent";
    static description = "Recovers lost revenue from failed payments, invoices, and subscriptions via smart retries and targeted links.";
    static async findFailedPayments() {
        return prisma_1.default.paymentAttempt.findMany({
            where: { outcome: { in: ["FAILED", "RETRY_SCHEDULED"] } },
            orderBy: { expectedValue: "desc" },
        });
    }
    static async getRecoverySummary() {
        const failed = await this.findFailedPayments();
        const totalFailedAmount = failed.reduce((sum, p) => sum + p.amount, 0);
        const totalExpectedRecovery = failed.reduce((sum, p) => sum + p.expectedValue, 0);
        const highConfidenceCases = failed.filter((p) => p.recoveryProb >= 0.8);
        return {
            failedPaymentsCount: failed.length,
            totalFailedAmount,
            totalExpectedRecovery,
            highConfidenceRecoverableINR: highConfidenceCases.reduce((sum, p) => sum + p.expectedValue, 0),
            topOpportunities: failed.slice(0, 3).map((f) => ({
                paymentId: f.paymentId,
                amount: f.amount,
                recoveryProb: f.recoveryProb,
                expectedValue: f.expectedValue,
                strategy: f.recommendedAction,
                reason: f.failureReason,
            })),
            recommendation: `Deploy Smart Retry and instant WhatsApp Payment Links across ${highConfidenceCases.length} high-confidence failed payments to recover ₹${(totalExpectedRecovery / 100000).toFixed(2)} Lakhs.`,
        };
    }
}
exports.RecoveryAgent = RecoveryAgent;
