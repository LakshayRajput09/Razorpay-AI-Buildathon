import prisma from "@/lib/prisma";

export class RecoveryAgent {
  static agentName = "Recovery Agent";
  static description = "Recovers lost revenue from failed payments, invoices, and subscriptions via smart retries and targeted links.";

  static async findFailedPayments() {
    return prisma.paymentAttempt.findMany({
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
