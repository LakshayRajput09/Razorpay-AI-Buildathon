"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionEngine = void 0;
const prisma_1 = __importDefault(require("@/lib/prisma"));
const guardrails_1 = require("@/lib/policy/guardrails");
class ActionEngine {
    static async preview(payload) {
        const policy = guardrails_1.PolicyEngine.evaluate(payload);
        let channel = "SYSTEM_INTERNAL";
        let simulatedEndpoint = "razorpay.api.internal";
        let expectedYield = payload.financialImpact || 0;
        if (payload.actionType === "SEND_PAYMENT_LINK") {
            channel = "WHATSAPP_SMS";
            simulatedEndpoint = "https://api.razorpay.com/v1/payment_links";
        }
        else if (payload.actionType === "SMART_RETRY") {
            channel = "BANK_CLEARING_QUEUE";
            simulatedEndpoint = "https://api.razorpay.com/v1/payments/retry";
        }
        else if (payload.actionType === "DISCOUNT_OFFER") {
            channel = "CUSTOMER_ENGAGEMENT";
            simulatedEndpoint = "https://api.razorpay.com/v1/promotions/offers";
        }
        else if (payload.actionType === "BLOCK_TRANSACTION") {
            channel = "RISK_SHIELD_RULESET";
            simulatedEndpoint = "https://api.razorpay.com/v1/risk/blacklist";
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
    static async execute(payload, merchantDecision = "AUTO") {
        const policy = guardrails_1.PolicyEngine.evaluate(payload);
        // If it strictly requires approval and wasn't manually approved
        if (policy.requiresApproval && merchantDecision !== "APPROVE") {
            // Create pending action record in DB
            const action = await prisma_1.default.agentAction.create({
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
        let executionResult = { timestamp: new Date().toISOString() };
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
            await prisma_1.default.paymentAttempt.updateMany({
                where: { paymentId: payload.entityId },
                data: { outcome: "RETRY_SCHEDULED" },
            });
        }
        else if (payload.actionType === "SMART_RETRY") {
            executionResult = {
                retryJobId: `job_retry_${Math.random().toString(36).substring(2, 8)}`,
                scheduledClearanceWindow: "45 minutes (Optimal HDFC/SBI bank gateway window)",
                status: "QUEUED",
            };
            await prisma_1.default.paymentAttempt.updateMany({
                where: { paymentId: payload.entityId },
                data: { outcome: "RETRY_SCHEDULED" },
            });
        }
        else if (payload.actionType === "BLOCK_TRANSACTION") {
            executionResult = {
                blockedTransactionId: payload.entityId,
                deviceBlacklisted: true,
                ipSubnetBlocked: true,
                status: "TRANSACTION_TERMINATED",
            };
            await prisma_1.default.transaction.updateMany({
                where: { transactionId: payload.entityId },
                data: { status: "BLOCKED" },
            });
        }
        else if (payload.actionType === "DISCOUNT_OFFER") {
            executionResult = {
                couponCode: payload.metadata?.code || "GROWTH_AI_8",
                discountPct: payload.discountPercentage || 8,
                campaignId: `camp_${Math.random().toString(36).substring(2, 7)}`,
                status: "CAMPAIGN_ACTIVATED",
            };
        }
        else if (payload.actionType === "DRAFT_DISPUTE") {
            executionResult = {
                representmentPacketId: `rep_${Math.random().toString(36).substring(2, 8)}`,
                evidenceDoc: "Compiled 3DS logs, IP trace, and Proof of Delivery",
                status: "PACKET_READY_FOR_SUBMISSION",
            };
            await prisma_1.default.chargeback.updateMany({
                where: { chargebackId: payload.entityId },
                data: { evidenceStatus: "DRAFTED" },
            });
        }
        // Persist to agent audit log
        const savedAction = await prisma_1.default.agentAction.create({
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
exports.ActionEngine = ActionEngine;
