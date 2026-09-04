import prisma from "@/lib/prisma";
import { PolicyEngine, PolicyEvaluation } from "@/lib/policy/guardrails";

export interface ActionPayload {
  agentName: string; // GROWTH, RISK, RECOVERY, FINANCE, ORCHESTRATOR
  actionType: string; // SMART_RETRY, SEND_PAYMENT_LINK, SEND_REMINDER, DISCOUNT_OFFER, BLOCK_TRANSACTION, FLAG_REVIEW, DRAFT_DISPUTE
  entityId: string;
  reason: string;
  financialImpact?: number;
  discountPercentage?: number;
  riskTier?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  metadata?: Record<string, any>;
}

export class ActionEngine {
  static async preview(payload: ActionPayload): Promise<{
    policy: PolicyEvaluation;
    actionDetails: ActionPayload;
    executionPlan: {
      channel: string;
      simulatedEndpoint: string;
      expectedYield: number;
    };
  }> {
    const policy = PolicyEngine.evaluate(payload);

    let channel = "SYSTEM_INTERNAL";
    let simulatedEndpoint = "razorpay.api.internal";
    let expectedYield = payload.financialImpact || 0;

    if (payload.actionType === "SEND_PAYMENT_LINK") {
      channel = "WHATSAPP_SMS";
      simulatedEndpoint = "https://api.razorpay.com/v1/payment_links";
    } else if (payload.actionType === "SMART_RETRY") {
      channel = "BANK_CLEARING_QUEUE";
      simulatedEndpoint = "https://api.razorpay.com/v1/payments/retry";
    } else if (payload.actionType === "DISCOUNT_OFFER") {
      channel = "CUSTOMER_ENGAGEMENT";
      simulatedEndpoint = "https://api.razorpay.com/v1/promotions/offers";
    } else if (payload.actionType === "BLOCK_TRANSACTION") {
      channel = "RISK_SHIELD_RULESET";
      simulatedEndpoint = "https://api.razorpay.com/v1/risk/blacklist";
    } else if (payload.actionType === "SEND_FRIENDLY_NOTICE") {
      channel = "WHATSAPP_EMAIL_SMS";
      simulatedEndpoint = "https://api.razorpay.com/v1/communications/friendly_notice";
    } else if (payload.actionType === "SEND_LEGAL_NOTICE") {
      channel = "REGISTERED_LEGAL_POST_AND_EMAIL";
      simulatedEndpoint = "https://api.razorpay.com/v1/legal/statutory_demand";
    }

    return {
      policy,
      actionDetails: payload,
      executionPlan: {
        channel,
        simulatedEndpoint,
        expectedYield,
      },
    };
  }

  static async execute(
    payload: ActionPayload,
    merchantDecision: "APPROVE" | "AUTO" = "AUTO"
  ): Promise<{
    success: boolean;
    actionId: string;
    status: string;
    result: any;
    policyStatus: string;
  }> {
    const policy = PolicyEngine.evaluate(payload);

    // If it strictly requires approval and wasn't manually approved
    if (policy.requiresApproval && merchantDecision !== "APPROVE") {
      // Create pending action record in DB
      const action = await prisma.agentAction.create({
        data: {
          agent: payload.agentName,
          action: payload.actionType,
          entityId: payload.entityId,
          reason: payload.reason,
          approval: "PENDING_APPROVAL",
          requiresApproval: true,
          status: "PROPOSED",
          riskTier: payload.riskTier || "MEDIUM",
          financialImpact: payload.financialImpact || 0,
        },
      });

      return {
        success: false,
        actionId: action.id,
        status: "PENDING_APPROVAL",
        result: { message: policy.explanation },
        policyStatus: policy.policyStatus,
      };
    }

    // Execute the action (Simulate Razorpay API integration)
    let executionResult: any = { timestamp: new Date().toISOString() };

    if (payload.actionType === "SEND_PAYMENT_LINK") {
      const linkId = `plink_${Math.random().toString(36).substring(2, 9)}`;
      executionResult = {
        razorpayPaymentLinkId: linkId,
        paymentUrl: `https://rzp.io/i/${linkId}`,
        deliveredVia: "WhatsApp & SMS (+91 verified)",
        amount: payload.financialImpact,
        status: "LINK_DELIVERED",
      };

      // Update payment attempt if exists
      await prisma.paymentAttempt.updateMany({
        where: { paymentId: payload.entityId },
        data: { outcome: "RETRY_SCHEDULED" },
      });
    } else if (payload.actionType === "SMART_RETRY") {
      executionResult = {
        retryJobId: `job_retry_${Math.random().toString(36).substring(2, 8)}`,
        scheduledClearanceWindow: "45 minutes (Optimal HDFC/SBI bank gateway window)",
        status: "QUEUED",
      };
      await prisma.paymentAttempt.updateMany({
        where: { paymentId: payload.entityId },
        data: { outcome: "RETRY_SCHEDULED" },
      });
    } else if (payload.actionType === "BLOCK_TRANSACTION") {
      executionResult = {
        blockedTransactionId: payload.entityId,
        deviceBlacklisted: true,
        ipSubnetBlocked: true,
        status: "TRANSACTION_TERMINATED",
      };
      await prisma.transaction.updateMany({
        where: { transactionId: payload.entityId },
        data: { status: "BLOCKED" },
      });
    } else if (payload.actionType === "DISCOUNT_OFFER") {
      executionResult = {
        couponCode: payload.metadata?.code || "GROWTH_AI_8",
        discountPct: payload.discountPercentage || 8,
        campaignId: `camp_${Math.random().toString(36).substring(2, 7)}`,
        status: "CAMPAIGN_ACTIVATED",
      };
    } else if (payload.actionType === "DRAFT_DISPUTE") {
      executionResult = {
        representmentPacketId: `rep_${Math.random().toString(36).substring(2, 8)}`,
        evidenceDoc: "Compiled 3DS logs, IP trace, and Proof of Delivery",
        status: "PACKET_READY_FOR_SUBMISSION",
      };
      await prisma.chargeback.updateMany({
        where: { chargebackId: payload.entityId },
        data: { evidenceStatus: "DRAFTED" },
      });
    } else if (payload.actionType === "SEND_FRIENDLY_NOTICE") {
      const noticeRef = `FN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const linkId = `plink_${Math.random().toString(36).substring(2, 9)}`;
      executionResult = {
        noticeType: "FRIENDLY_COURTESY_NOTICE",
        noticeRef,
        recipient: payload.metadata?.customerEmail || payload.metadata?.customerPhone || "consumer@example.com",
        customerName: payload.metadata?.customerName || "Valued Customer",
        amountDue: payload.financialImpact || 0,
        gracePeriodDays: 7,
        paymentLink: `https://rzp.io/i/${linkId}`,
        deliveryChannels: ["WhatsApp Verified Business", "Direct SMS", "Email Invoice Update"],
        messageCopy: payload.metadata?.messageCopy || `Hi ${payload.metadata?.customerName || "there"}, your recent payment of ₹${(payload.financialImpact || 0).toLocaleString("en-IN")} didn't go through. We've reserved your order for the next 7 days. Tap here to complete it easily with UPI, Cards, or Netbanking: https://rzp.io/i/${linkId}`,
        status: "DISPATCHED_TO_CONSUMER",
      };
      await prisma.paymentAttempt.updateMany({
        where: { paymentId: payload.entityId },
        data: { outcome: "RETRY_SCHEDULED" },
      });
    } else if (payload.actionType === "SEND_LEGAL_NOTICE") {
      const noticeRef = `LEG-${new Date().getFullYear()}-RZP-${Math.floor(100000 + Math.random() * 900000)}`;
      const linkId = `plink_${Math.random().toString(36).substring(2, 9)}`;
      executionResult = {
        noticeType: "STATUTORY_LEGAL_DEMAND_NOTICE",
        noticeRef,
        governingStatute: "Section 138 Negotiable Instruments Act / Section 73 Indian Contract Act, 1872",
        recipient: payload.metadata?.customerEmail || payload.metadata?.customerPhone || "defaulting_entity@corporate.in",
        customerName: payload.metadata?.customerName || "Debtor Account",
        defaultAmount: payload.financialImpact || 0,
        legalNoticeFee: 1500,
        accruedInterestRate: "18% p.a.",
        statutoryCurePeriodDays: 15,
        finalSettlementLink: `https://rzp.io/legal/${linkId}`,
        legalCounsel: "Adv. Rajesh V. Ramanathan, Senior Fintech Counsel, Bar Council of Maharashtra & Goa",
        deliveryChannels: [
          `Registered Indian Speed Post (Consignment No: EM${Math.floor(100000000 + Math.random() * 900000000)}IN)`,
          "Certified Digital Legal Notice via Email"
        ],
        legalConsequences: [
          "Immediate filing of Summary Suit under Order XXXVII of the Code of Civil Procedure (CPC)",
          "Adverse reporting of payment default to Credit Information Bureaus (CIBIL, Experian, CRIF High Mark)",
          "Initiation of recovery proceedings for principal debt along with 18% p.a. default interest and legal damages"
        ],
        status: "STATUTORY_DEMAND_SERVED",
      };
      await prisma.paymentAttempt.updateMany({
        where: { paymentId: payload.entityId },
        data: { outcome: "RETRY_SCHEDULED" },
      });
    }

    // Persist to agent audit log
    const savedAction = await prisma.agentAction.create({
      data: {
        agent: payload.agentName,
        action: payload.actionType,
        entityId: payload.entityId,
        reason: payload.reason,
        approval: merchantDecision === "APPROVE" ? "APPROVED" : "AUTO_APPROVED",
        requiresApproval: policy.requiresApproval,
        status: "EXECUTED",
        result: JSON.stringify(executionResult),
        riskTier: payload.riskTier || "LOW",
        financialImpact: payload.financialImpact || 0,
      },
    });

    return {
      success: true,
      actionId: savedAction.id,
      status: "EXECUTED",
      result: executionResult,
      policyStatus: policy.policyStatus,
    };
  }
}
