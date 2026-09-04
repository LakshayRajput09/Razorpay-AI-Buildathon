export interface GrowthCustomerInput {
  totalSpend: number;
  orderCount: number;
  accountAgeDays: number;
  lastOrderDaysAgo?: number;
  segment?: string;
}

export interface GrowthPredictionResult {
  segment: "CHAMPIONS" | "LOYAL" | "AT_RISK" | "HIBERNATING" | "NEW" | "HIGH_VALUE";
  purchaseProbability14d: number; // 0.0 - 1.0
  expectedValueNext90d: number; // INR
  churnRisk: number; // 0.0 - 1.0
  recommendedOffer: {
    code: string;
    discountPct: number;
    channel: string;
    predictedUpliftPct: number;
  };
  topDrivers: string[];
}

export function predictGrowthAndPurchase(input: GrowthCustomerInput): GrowthPredictionResult {
  const daysAgo = input.lastOrderDaysAgo !== undefined ? input.lastOrderDaysAgo : 25;
  const count = input.orderCount;
  const spend = input.totalSpend;

  // Determine RFM Segment
  let segment: "CHAMPIONS" | "LOYAL" | "AT_RISK" | "HIBERNATING" | "NEW" | "HIGH_VALUE" = "LOYAL";
  let purchaseProb = 0.45;
  let churnRisk = 0.2;

  if (count >= 10 && spend >= 100000 && daysAgo <= 20) {
    segment = "CHAMPIONS";
    purchaseProb = 0.88;
    churnRisk = 0.04;
  } else if (spend >= 75000 && count < 6) {
    segment = "HIGH_VALUE";
    purchaseProb = 0.62;
    churnRisk = 0.25;
  } else if (count >= 5 && daysAgo <= 35) {
    segment = "LOYAL";
    purchaseProb = 0.71;
    churnRisk = 0.15;
  } else if (count >= 3 && daysAgo > 40 && daysAgo <= 90) {
    segment = "AT_RISK";
    purchaseProb = 0.38;
    churnRisk = 0.65;
  } else if (daysAgo > 90) {
    segment = "HIBERNATING";
    purchaseProb = 0.14;
    churnRisk = 0.85;
  } else {
    segment = "NEW";
    purchaseProb = 0.52;
    churnRisk = 0.30;
  }

  const avgOrderVal = count > 0 ? spend / count : 3500;
  const expectedValue = Math.round(avgOrderVal * purchaseProb * 2.2);

  // Personalized incentive recommendation
  let discountPct = 0;
  let code = "WELCOME_BACK";
  let predictedUplift = 0;

  if (segment === "AT_RISK") {
    discountPct = 8;
    code = "RECONNECT_8";
    predictedUplift = 34; // +34% uplift
  } else if (segment === "HIBERNATING") {
    discountPct = 12;
    code = "COMEBACK_12";
    predictedUplift = 45;
  } else if (segment === "CHAMPIONS") {
    discountPct = 5;
    code = "VIP_PRIVILEGE_5";
    predictedUplift = 18;
  } else {
    discountPct = 5;
    code = "LOYALTY_5";
    predictedUplift = 22;
  }

  return {
    segment,
    purchaseProbability14d: purchaseProb,
    expectedValueNext90d: expectedValue,
    churnRisk,
    recommendedOffer: {
      code,
      discountPct,
      channel: "WHATSAPP_EMAIL",
      predictedUpliftPct: predictedUplift,
    },
    topDrivers: [
      `Historical purchase cadence (${count} lifetime orders)`,
      `Recency recency gap (${daysAgo} days since last order)`,
      `High average ticket size (₹${Math.round(avgOrderVal)})`,
    ],
  };
}

export function predictOrderReturnRisk(order: {
  amount: number;
  isCod: boolean;
  category: string;
  customerReturnRate?: number;
}): { returnProbability: number; riskTier: "LOW" | "MEDIUM" | "HIGH"; topFactors: string[] } {
  let logit = -2.2;
  const factors: string[] = [];

  if (order.isCod) {
    logit += 1.4;
    factors.push("Cash on Delivery (COD) order (+35% historical return correlation)");
  }

  if (order.category.toLowerCase().includes("footwear") || order.category.toLowerCase().includes("shoes")) {
    logit += 0.9;
    factors.push("Footwear sizing variance (+24% category return rate)");
  }

  const custRate = order.customerReturnRate || 0.1;
  if (custRate > 0.3) {
    logit += 1.2;
    factors.push(`Customer prior return rate is elevated (${(custRate * 100).toFixed(0)}%)`);
  }

  const prob = 1 / (1 + Math.exp(-logit));
  const rounded = Math.round(prob * 100) / 100;

  return {
    returnProbability: rounded,
    riskTier: rounded >= 0.6 ? "HIGH" : rounded >= 0.3 ? "MEDIUM" : "LOW",
    topFactors: factors,
  };
}
