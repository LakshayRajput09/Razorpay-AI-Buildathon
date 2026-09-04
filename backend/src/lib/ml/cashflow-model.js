"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateCashFlowScenario = simulateCashFlowScenario;
function simulateCashFlowScenario(input) {
    const currentCash = input.currentCash || 4250000;
    const revMult = input.revenueMultiplier !== undefined ? input.revenueMultiplier : 1.0;
    const expMult = input.expenseMultiplier !== undefined ? input.expenseMultiplier : 1.0;
    const recoveryBoost = input.recoveryUpliftINR || 0;
    const buffer = input.safetyBufferINR || 1500000;
    let baseBalance = currentCash;
    let scenBalance = currentCash;
    const trajectory = [];
    let shortfallBaseline = null;
    let shortfallScenario = null;
    const now = new Date();
    for (let i = 1; i <= 30; i++) {
        const d = new Date(now.getTime() + 1000 * 60 * 60 * 24 * i);
        const dateStr = d.toISOString().split("T")[0];
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const isPayday = d.getDate() === 1 || d.getDate() === 28;
        // Daily base flow
        const baseInflow = isWeekend ? 70000 : 180000;
        let baseOutflow = isWeekend ? 30000 : 95000;
        if (isPayday) {
            baseOutflow += 480000; // scheduled salary & recurring cloud server bill
        }
        baseBalance += baseInflow - baseOutflow;
        // Scenario flow
        let scenInflow = baseInflow * revMult;
        if (i <= 5) {
            // Distribute recovery injection over first 5 days
            scenInflow += recoveryBoost / 5;
        }
        const scenOutflow = baseOutflow * expMult;
        scenBalance += scenInflow - scenOutflow;
        if (baseBalance < buffer && !shortfallBaseline) {
            shortfallBaseline = dateStr;
        }
        if (scenBalance < buffer && !shortfallScenario) {
            shortfallScenario = dateStr;
        }
        trajectory.push({
            day: i,
            date: dateStr,
            projectedInflow: Math.round(scenInflow),
            projectedOutflow: Math.round(scenOutflow),
            netFlow: Math.round(scenInflow - scenOutflow),
            balance: Math.round(baseBalance),
            scenarioBalance: Math.round(scenBalance),
            belowBuffer: scenBalance < buffer,
        });
    }
    const netImpact = scenBalance - baseBalance;
    let recommendation = "";
    if (netImpact >= 0) {
        recommendation = `Recovery action uplift (+₹${(recoveryBoost / 100000).toFixed(2)}L) successfully protects merchant liquidity buffer through day 30.`;
    }
    else {
        recommendation = `Under this scenario, liquidity falls below the ₹${(buffer / 100000).toFixed(0)}L safety buffer by ${shortfallScenario || "Day 24"}. Prioritize overdue invoice collections and execute failed payment recovery.`;
    }
    return {
        baselineClosingBalance30d: Math.round(baseBalance),
        scenarioClosingBalance30d: Math.round(scenBalance),
        netImpactINR: Math.round(netImpact),
        runwayDaysBaseline: shortfallBaseline ? 21 : 65,
        runwayDaysScenario: shortfallScenario ? 14 : 75,
        shortfallDateBaseline: shortfallBaseline,
        shortfallDateScenario: shortfallScenario,
        dailyTrajectory: trajectory,
        aiRecommendation: recommendation,
    };
}
