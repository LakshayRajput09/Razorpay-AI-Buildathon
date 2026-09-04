import { FinanceAgent } from "./finance-agent";
import { RecoveryAgent } from "./recovery-agent";
import { RiskAgent } from "./risk-agent";
import { GrowthAgent } from "./growth-agent";
import { PolicyEngine } from "@/lib/policy/guardrails";

export interface OrchestrationResult {
  query: string;
  executiveSummary: string;
  financialImpactTotal: number;
  agentFindings: {
    finance: any;
    recovery: any;
    risk: any;
    growth: any;
  };
  proposedActions: {
    id: string;
    agent: string;
    actionType: string;
    title: string;
    description: string;
    financialImpact: number;
    policyStatus: "AUTO_APPROVED" | "PENDING_APPROVAL" | "REJECTED";
    requiresApproval: boolean;
    ruleApplied: string;
    executionPayload: Record<string, any>;
  }[];
}

export class MasterOrchestrator {
  static async runTask(userQuery: string): Promise<OrchestrationResult> {
    // 1. Concurrently pull ground truth from all 4 domain agents
    const [financeData, recoveryData, riskData, growthData] = await Promise.all([
      FinanceAgent.getFinanceSummary(),
      RecoveryAgent.getRecoverySummary(),
      RiskAgent.getRiskSummary(),
      GrowthAgent.getGrowthSummary(),
    ]);

    // 2. Multi-Agent Cross-Synthesis
    const dropAmount = financeData.revenueLossDelta;
    const recoverableAmount = recoveryData.totalExpectedRecovery;
    const potentialGrowthGMV = growthData.recommendedCampaign.expectedIncrementalRevenue;

    const summary = `Revenue dropped by ${financeData.inflowDipPercentage}% this week (~₹${(dropAmount / 100000).toFixed(2)} Lakhs) driven by two primary root causes: (1) an elevated batch of failed UPI/Card transactions during bank server downtime (₹${(recoveryData.totalFailedAmount / 100000).toFixed(2)}L uncollected), and (2) a drop in repeat purchases among ${growthData.atRiskCount} at-risk customer accounts. Concurrently, AI Risk Shield blocked ₹${(riskData.preventedFraudLossLast7d / 100000).toFixed(2)}L in fraudulent transactions, but 1 critical high-ticket order requires manual authorization.`;

    // 3. Formulate Action Proposals through the Policy Engine
    const proposedRawActions = [
      {
        id: "act_rec_01",
        agent: "RECOVERY",
        actionType: "SMART_RETRY",
        title: "Execute Smart Retry on High-Confidence Failed UPI Attempts",
        description: `Automate retries across ${recoveryData.topOpportunities.length} failed attempts during current bank clearance window.`,
        financialImpact: recoveryData.topOpportunities[0]?.expectedValue || 7819,
        discountPercentage: 0,
        riskTier: "LOW" as const,
        executionPayload: {
          agentName: "RECOVERY",
          actionType: "SMART_RETRY",
          entityId: recoveryData.topOpportunities[0]?.paymentId || "PAY-FAIL-7701",
          reason: "Automated retry scheduled for transient bank gateway error.",
          financialImpact: recoveryData.topOpportunities[0]?.expectedValue || 7819,
        },
      },
      {
        id: "act_rec_02",
        agent: "RECOVERY",
        actionType: "SEND_PAYMENT_LINK",
        title: "Dispatch WhatsApp Razorpay Payment Link for Auth Timeout",
        description: "Send direct payment links with 15-minute validity to high-intent customer with 3DS timeout.",
        financialImpact: 14999,
        discountPercentage: 0,
        riskTier: "LOW" as const,
        executionPayload: {
          agentName: "RECOVERY",
          actionType: "SEND_PAYMENT_LINK",
          entityId: "PAY-FAIL-7702",
          reason: "Instant WhatsApp link for card auth timeout.",
          financialImpact: 14999,
        },
      },
      {
        id: "act_growth_01",
        agent: "GROWTH",
        actionType: "DISCOUNT_OFFER",
        title: "Launch At-Risk Re-engagement Campaign (8% Incentive)",
        description: `Trigger personalized offer (RECONNECT_8) to ${growthData.atRiskCount} dormant customers to capture ₹${(potentialGrowthGMV / 100000).toFixed(2)}L incremental GMV.`,
        financialImpact: potentialGrowthGMV,
        discountPercentage: 8,
        riskTier: "LOW" as const,
        executionPayload: {
          agentName: "GROWTH",
          actionType: "DISCOUNT_OFFER",
          entityId: "CAMP-AT-RISK-8801",
          reason: "Personalized reactivation campaign within 10% autonomous margin cap.",
          financialImpact: potentialGrowthGMV,
          discountPercentage: 8,
        },
      },
      {
        id: "act_risk_01",
        agent: "RISK",
        actionType: "BLOCK_TRANSACTION",
        title: "Manual Review & Block: High-Risk Transaction (TXN-2026-CRIT-9901)",
        description: "Reject flagged ₹68,500 transaction originating from anomalous international IP proxy to prevent impending dispute chargeback.",
        financialImpact: 68500,
        discountPercentage: 0,
        riskTier: "CRITICAL" as const,
        executionPayload: {
          agentName: "RISK",
          actionType: "BLOCK_TRANSACTION",
          entityId: "TXN-2026-CRIT-9901",
          reason: "High fraud score (91.4%) with geo mismatch and velocity anomaly.",
          financialImpact: 68500,
          riskTier: "CRITICAL",
        },
      },
    ];

    // Evaluate each proposed action through the Policy Engine
    const proposedActions = proposedRawActions.map((raw) => {
      const evaluation = PolicyEngine.evaluate({
        actionType: raw.actionType,
        agentName: raw.agent,
        entityId: raw.executionPayload.entityId,
        financialImpact: raw.financialImpact,
        discountPercentage: raw.discountPercentage,
        riskTier: raw.riskTier,
      });

      return {
        id: raw.id,
        agent: raw.agent,
        actionType: raw.actionType,
        title: raw.title,
        description: raw.description,
        financialImpact: raw.financialImpact,
        policyStatus: evaluation.policyStatus,
        requiresApproval: evaluation.requiresApproval,
        ruleApplied: evaluation.ruleApplied,
        executionPayload: raw.executionPayload,
      };
    });

    return {
      query: userQuery,
      executiveSummary: summary,
      financialImpactTotal: recoverableAmount + potentialGrowthGMV,
      agentFindings: {
        finance: financeData,
        recovery: recoveryData,
        risk: riskData,
        growth: growthData,
      },
      proposedActions,
    };
  }
}
