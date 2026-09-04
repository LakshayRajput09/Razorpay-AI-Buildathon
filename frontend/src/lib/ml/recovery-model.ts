export interface RecoveryPredictionInput {
  amount: number;
  failureReason: string;
  paymentMethod: string;
  retryCount?: number;
  customerOrderCount?: number;
  customerSpend?: number;
}

export interface RecoveryPredictionResult {
  recoveryProbability: number; // 0.0 - 1.0
  expectedRecoveryValue: number; // INR
  recommendedStrategy: "SMART_RETRY" | "PAYMENT_LINK" | "WHATSAPP_REMINDER" | "INCENTIVE_OFFER";
  optimalWindowMinutes: number;
  confidence: number;
  topFactors: { factor: string; weight: string; direction: "POSITIVE" | "NEGATIVE" }[];
}

export function predictPaymentRecovery(input: RecoveryPredictionInput): RecoveryPredictionResult {
  const reason = input.failureReason.toUpperCase();
  const retryCount = input.retryCount || 0;
  const orderCount = input.customerOrderCount || 1;
  const spend = input.customerSpend || 5000;

  let baseProb = 0.5;
  const factors: { factor: string; weight: string; direction: "POSITIVE" | "NEGATIVE" }[] = [];

  // 1. Failure reason physics
  if (reason.includes("BANK") || reason.includes("SERVER") || reason.includes("DOWN")) {
    baseProb += 0.38;
    factors.push({
      factor: "Transient Bank Gateway Downtime (High clearance after queue reset)",
      weight: "+0.38",
      direction: "POSITIVE",
    });
  } else if (reason.includes("TIMEOUT") || reason.includes("NETWORK")) {
    baseProb += 0.32;
    factors.push({
      factor: "Network/Session Timeout (High intent customer resumption)",
      weight: "+0.32",
      direction: "POSITIVE",
    });
  } else if (reason.includes("INSUFFICIENT")) {
    baseProb += 0.12;
    factors.push({
      factor: "Temporary Insufficient Funds (Recovers post salary/account top-up)",
      weight: "+0.12",
      direction: "POSITIVE",
    });
  } else if (reason.includes("EXPIRED") || reason.includes("INVALID")) {
    baseProb -= 0.18;
    factors.push({
      factor: "Card Expired / Hard Instrument Decline (Requires new payment method)",
      weight: "-0.18",
      direction: "NEGATIVE",
    });
  }

  // 2. Customer Trust & Prior Spend
  if (orderCount > 5 || spend > 50000) {
    baseProb += 0.15;
    factors.push({
      factor: `High Customer Loyalty (${orderCount} prior successful orders)`,
      weight: "+0.15",
      direction: "POSITIVE",
    });
  }

  // 3. Retry degradation
  if (retryCount >= 2) {
    baseProb -= 0.22;
    factors.push({
      factor: `Multiple Prior Failed Retries (${retryCount} attempts)`,
      weight: "-0.22",
      direction: "NEGATIVE",
    });
  }

  const finalProb = Math.min(0.96, Math.max(0.15, Math.round(baseProb * 100) / 100));
  const expectedVal = Math.round(input.amount * finalProb);

  let strategy: "SMART_RETRY" | "PAYMENT_LINK" | "WHATSAPP_REMINDER" | "INCENTIVE_OFFER" = "SMART_RETRY";
  let optimalWindow = 45;

  if (reason.includes("BANK") || reason.includes("NETWORK")) {
    strategy = "SMART_RETRY";
    optimalWindow = 45; // 45 mins optimal gateway clearance
  } else if (reason.includes("TIMEOUT") || reason.includes("AUTH")) {
    strategy = "PAYMENT_LINK";
    optimalWindow = 15;
  } else if (reason.includes("INSUFFICIENT")) {
    strategy = "WHATSAPP_REMINDER";
    optimalWindow = 240; // 4 hours later
  } else {
    strategy = "INCENTIVE_OFFER";
    optimalWindow = 60;
  }

  return {
    recoveryProbability: finalProb,
    expectedRecoveryValue: expectedVal,
    recommendedStrategy: strategy,
    optimalWindowMinutes: optimalWindow,
    confidence: 0.91,
    topFactors: factors,
  };
}
