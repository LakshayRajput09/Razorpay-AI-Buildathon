export interface PolicyCheckRequest {
  actionType: string;
  agentName: string;
  entityId: string;
  financialImpact?: number;
  discountPercentage?: number;
  riskTier?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  metadata?: Record<string, any>;
}

export interface PolicyEvaluation {
  allowed: boolean;
  requiresApproval: boolean;
  policyStatus: "AUTO_APPROVED" | "PENDING_APPROVAL" | "REJECTED";
  ruleApplied: string;
  explanation: string;
  safetyTier: "SAFE_AUTOMATION" | "HUMAN_IN_THE_LOOP" | "RESTRICTED";
}

export class PolicyEngine {
  static evaluate(req: PolicyCheckRequest): PolicyEvaluation {
    const action = req.actionType.toUpperCase();
    const impact = req.financialImpact || 0;
    const discount = req.discountPercentage || 0;
    const riskTier = req.riskTier || "LOW";

    // 1. Transaction Block (High impact fintech safety constraint)
    if (action.includes("BLOCK") || action.includes("REJECT_TRANSACTION")) {
      return {
        allowed: true,
        requiresApproval: true,
        policyStatus: "PENDING_APPROVAL",
        ruleApplied: "RULE_RISK_BLOCK_GUARDRAIL",
        explanation: "Fintech Safety Guardrail: Transaction blocking impacts legitimate conversion. Manual merchant authorization is strictly required.",
        safetyTier: "HUMAN_IN_THE_LOOP",
      };
    }

    // 2. Large Refund (> ₹5,000)
    if (action.includes("REFUND") && impact > 5000) {
      return {
        allowed: true,
        requiresApproval: true,
        policyStatus: "PENDING_APPROVAL",
        ruleApplied: "RULE_HIGH_VALUE_REFUND_LIMIT",
        explanation: `Refund amount (₹${impact.toLocaleString("en-IN")}) exceeds automatic threshold of ₹5,000. Approval required.`,
        safetyTier: "HUMAN_IN_THE_LOOP",
      };
    }

    // 3. Discount Offers (> 10% requires approval)
    if (action.includes("DISCOUNT") || action.includes("OFFER")) {
      if (discount > 10) {
        return {
          allowed: true,
          requiresApproval: true,
          policyStatus: "PENDING_APPROVAL",
          ruleApplied: "RULE_MAX_DISCOUNT_THRESHOLD",
          explanation: `Incentive discount (${discount}%) exceeds margin safety limit of 10%. Requires merchant approval.`,
          safetyTier: "HUMAN_IN_THE_LOOP",
        };
      }
      return {
        allowed: true,
        requiresApproval: false,
        policyStatus: "AUTO_APPROVED",
        ruleApplied: "RULE_SAFE_MARGIN_DISCOUNT",
        explanation: `Incentive discount (${discount}%) is within autonomous margin limits (<= 10%).`,
        safetyTier: "SAFE_AUTOMATION",
      };
    }

    // 4. Chargeback Dispute Submission
    if (action.includes("DISPUTE") || action.includes("EVIDENCE")) {
      return {
        allowed: true,
        requiresApproval: true,
        policyStatus: "PENDING_APPROVAL",
        ruleApplied: "RULE_CHARGEBACK_REPRESENTMENT_LEGAL",
        explanation: "Dispute representment packets generate legal banking submissions. Merchant sign-off required prior to network upload.",
        safetyTier: "HUMAN_IN_THE_LOOP",
      };
    }

    // 5. Payment Retry / Smart Retry
    if (action.includes("RETRY")) {
      return {
        allowed: true,
        requiresApproval: false,
        policyStatus: "AUTO_APPROVED",
        ruleApplied: "RULE_SMART_RETRY_INTERVAL",
        explanation: "Smart Retry scheduled within optimal banking window. Non-intrusive automated recovery permitted.",
        safetyTier: "SAFE_AUTOMATION",
      };
    }

    // 6. Payment Link & Reminders / Friendly Notice
    if (action.includes("FRIENDLY_NOTICE") || action.includes("PAYMENT_LINK") || action.includes("REMINDER")) {
      return {
        allowed: true,
        requiresApproval: false,
        policyStatus: "AUTO_APPROVED",
        ruleApplied: "RULE_FRIENDLY_RECOVERY_COMMUNICATION",
        explanation: "Courtesy payment reminders, friendly recovery links, and customer outreach are whitelisted for safe automated execution.",
        safetyTier: "SAFE_AUTOMATION",
      };
    }

    // 7. Statutory Legal Notice (High Impact Fintech Guarantee)
    if (action.includes("LEGAL_NOTICE")) {
      return {
        allowed: true,
        requiresApproval: true,
        policyStatus: "PENDING_APPROVAL",
        ruleApplied: "RULE_LEGAL_STATUTORY_DEMAND_GUARDRAIL",
        explanation: "Statutory Legal Demand Notice constitutes a formal pre-litigation demand under Indian Contract Act / Sec 138 NI Act. Explicit merchant legal sign-off is strictly mandatory.",
        safetyTier: "HUMAN_IN_THE_LOOP",
      };
    }

    // Default Fallback
    return {
      allowed: true,
      requiresApproval: riskTier === "CRITICAL" || riskTier === "HIGH",
      policyStatus: riskTier === "CRITICAL" || riskTier === "HIGH" ? "PENDING_APPROVAL" : "AUTO_APPROVED",
      ruleApplied: "RULE_DEFAULT_BASELINE",
      explanation: "Evaluated under standard risk tier safety limits.",
      safetyTier: riskTier === "CRITICAL" || riskTier === "HIGH" ? "HUMAN_IN_THE_LOOP" : "SAFE_AUTOMATION",
    };
  }
}
