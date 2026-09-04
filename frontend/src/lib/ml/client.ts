import { predictFraudRisk, FraudPredictionInput, FraudPredictionResult } from "./fraud-model";
import { predictPaymentRecovery, RecoveryPredictionInput, RecoveryPredictionResult } from "./recovery-model";
import { predictGrowthAndPurchase, predictOrderReturnRisk, GrowthCustomerInput, GrowthPredictionResult } from "./growth-model";
import { simulateCashFlowScenario, ScenarioSimulationInput, ScenarioSimulationResult } from "./cashflow-model";

const ML_SERVICE_URL = process.env.PYTHON_ML_SERVICE_URL || "http://127.0.0.1:8000";

export class MLClient {
  static async predictFraud(input: FraudPredictionInput): Promise<FraudPredictionResult> {
    try {
      const res = await fetch(`${ML_SERVICE_URL}/predict/fraud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: input.amount,
          customer_historical_avg: input.customerHistoricalAvg || 5000,
          velocity_10m: input.velocityCount10m || 1,
          is_international: input.isInternational || false,
          device_is_new: input.deviceIsNew || false,
          ip_distance_km: input.ipDistanceKm || 10,
          account_age_days: input.accountAgeDays || 180,
        }),
        signal: AbortSignal.timeout(800), // 800ms timeout
      });
      if (res.ok) {
        const data = await res.json();
        return {
          riskScore: data.risk_score,
          riskTier: data.risk_tier,
          confidence: data.confidence,
          probability: data.probability,
          topFactors: data.top_factors,
          recommendedAction: data.recommended_action,
        };
      }
    } catch {
      // Fallback to high-fidelity embedded TypeScript engine
    }
    return predictFraudRisk(input);
  }

  static async predictRecovery(input: RecoveryPredictionInput): Promise<RecoveryPredictionResult> {
    try {
      const res = await fetch(`${ML_SERVICE_URL}/predict/recovery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: input.amount,
          failure_reason: input.failureReason,
          payment_method: input.paymentMethod || "UPI",
          retry_count: input.retryCount || 0,
          customer_order_count: input.customerOrderCount || 1,
          customer_spend: input.customerSpend || 5000,
        }),
        signal: AbortSignal.timeout(800),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          recoveryProbability: data.recovery_probability,
          expectedRecoveryValue: data.expected_recovery_value,
          recommendedStrategy: data.recommended_strategy,
          optimalWindowMinutes: data.optimal_window_minutes,
          confidence: data.confidence,
          topFactors: predictPaymentRecovery(input).topFactors,
        };
      }
    } catch {
      // Fallback
    }
    return predictPaymentRecovery(input);
  }

  static async predictGrowth(input: GrowthCustomerInput): Promise<GrowthPredictionResult> {
    try {
      const res = await fetch(`${ML_SERVICE_URL}/predict/growth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_spend: input.totalSpend,
          order_count: input.orderCount,
          account_age_days: input.accountAgeDays,
          last_order_days_ago: input.lastOrderDaysAgo || 25,
        }),
        signal: AbortSignal.timeout(800),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          segment: data.segment,
          purchaseProbability14d: data.purchase_probability_14d,
          expectedValueNext90d: data.expected_value_next_90d,
          churnRisk: data.churn_risk,
          recommendedOffer: data.recommended_offer,
          topDrivers: data.top_drivers,
        };
      }
    } catch {
      // Fallback
    }
    return predictGrowthAndPurchase(input);
  }

  static async predictReturn(order: {
    amount: number;
    isCod: boolean;
    category: string;
    customerReturnRate?: number;
  }): Promise<{ returnProbability: number; riskTier: "LOW" | "MEDIUM" | "HIGH"; topFactors: string[] }> {
    try {
      const res = await fetch(`${ML_SERVICE_URL}/predict/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: order.amount,
          is_cod: order.isCod,
          category: order.category,
          customer_return_rate: order.customerReturnRate || 0.15,
        }),
        signal: AbortSignal.timeout(800),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          returnProbability: data.probability,
          riskTier: data.risk_level as "LOW" | "MEDIUM" | "HIGH",
          topFactors: [
            `Return risk score: ${data.return_risk_score}/100`,
            `Recommended mitigation: ${data.mitigation_action}`,
          ],
        };
      }
    } catch {
      // Fallback
    }
    return predictOrderReturnRisk(order);
  }

  static simulateCashflow(input: ScenarioSimulationInput): ScenarioSimulationResult {
    return simulateCashFlowScenario(input);
  }
}
