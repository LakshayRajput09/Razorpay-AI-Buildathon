"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const client_1 = require("./lib/ml/client");
const orchestrator_1 = require("./lib/agents/orchestrator");
const action_engine_1 = require("./lib/actions/action-engine");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "Razorpay AI-Native OS — Backend API Server", port: PORT });
});
// 1. Prediction Endpoints
app.post("/api/predict/fraud", async (req, res) => {
    try {
        const result = await client_1.MLClient.predictFraud({
            amount: Number(req.body.amount || 1000),
            customerHistoricalAvg: req.body.customerHistoricalAvg ? Number(req.body.customerHistoricalAvg) : 5000,
            velocityCount10m: req.body.velocityCount10m ? Number(req.body.velocityCount10m) : 1,
            isInternational: Boolean(req.body.isInternational),
            deviceIsNew: Boolean(req.body.deviceIsNew),
            ipDistanceKm: req.body.ipDistanceKm ? Number(req.body.ipDistanceKm) : 10,
            accountAgeDays: req.body.accountAgeDays ? Number(req.body.accountAgeDays) : 180,
        });
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
app.post("/api/predict/recovery", async (req, res) => {
    try {
        const result = await client_1.MLClient.predictRecovery({
            amount: Number(req.body.amount || 5000),
            failureReason: String(req.body.failureReason || "BANK_SERVER_DOWN"),
            paymentMethod: String(req.body.paymentMethod || "UPI"),
            retryCount: req.body.retryCount ? Number(req.body.retryCount) : 0,
            customerOrderCount: req.body.customerOrderCount ? Number(req.body.customerOrderCount) : 1,
            customerSpend: req.body.customerSpend ? Number(req.body.customerSpend) : 5000,
        });
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
app.post("/api/predict/return", async (req, res) => {
    try {
        const result = await client_1.MLClient.predictReturn({
            amount: Number(req.body.amount || 2500),
            isCod: Boolean(req.body.isCod),
            category: String(req.body.category || "Apparel"),
            customerReturnRate: req.body.customerReturnRate ? Number(req.body.customerReturnRate) : 0.1,
        });
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
app.post("/api/predict/purchase", async (req, res) => {
    try {
        const result = await client_1.MLClient.predictGrowth({
            totalSpend: Number(req.body.totalSpend || 10000),
            orderCount: Number(req.body.orderCount || 2),
            accountAgeDays: Number(req.body.accountAgeDays || 60),
            lastOrderDaysAgo: req.body.lastOrderDaysAgo !== undefined ? Number(req.body.lastOrderDaysAgo) : 30,
        });
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
app.post("/api/predict/chargeback", (req, res) => {
    try {
        const amount = Number(req.body.amount || 5000);
        const isFirstTime = Boolean(req.body.isFirstTime);
        const foreignIp = Boolean(req.body.foreignIp);
        let prob = 0.05;
        const factors = [];
        if (amount > 50000) {
            prob += 0.25;
            factors.push("High ticket transaction size (> ₹50k)");
        }
        if (foreignIp) {
            prob += 0.35;
            factors.push("Discrepancy in card billing country vs connection IP");
        }
        if (isFirstTime) {
            prob += 0.15;
            factors.push("First-time transaction on merchant platform");
        }
        const rounded = Math.min(0.95, Math.round(prob * 100) / 100);
        res.json({
            success: true,
            data: {
                chargebackProbability: rounded,
                riskTier: rounded >= 0.5 ? "HIGH" : rounded >= 0.2 ? "MEDIUM" : "LOW",
                topFactors: factors,
                recommendedAction: rounded >= 0.5 ? "DRAFT_DISPUTE_DEFENSE" : "MONITOR",
            },
        });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
// 2. Data Queries
app.get("/api/transactions", async (req, res) => {
    try {
        const riskTier = req.query.riskTier;
        const where = {};
        if (riskTier && riskTier !== "ALL") {
            where.riskTier = riskTier.toUpperCase();
        }
        const transactions = await prisma_1.default.transaction.findMany({
            where,
            include: { customer: true },
            orderBy: { timestamp: "desc" },
            take: 50,
        });
        res.json({ success: true, data: transactions });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.get("/api/customers/:id", async (req, res) => {
    try {
        const customer = await prisma_1.default.customer.findFirst({
            where: {
                OR: [{ id: req.params.id }, { externalId: req.params.id }],
            },
            include: {
                transactions: { orderBy: { timestamp: "desc" }, take: 10 },
                orders: { orderBy: { orderDate: "desc" }, take: 10 },
                subscriptions: true,
                invoices: true,
                returns: true,
                chargebacks: true,
            },
        });
        if (!customer) {
            return res.status(404).json({ success: false, error: "Customer not found" });
        }
        res.json({ success: true, data: customer });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.get("/api/recovery/opportunities", async (req, res) => {
    try {
        const failedAttempts = await prisma_1.default.paymentAttempt.findMany({
            where: { outcome: { in: ["FAILED", "RETRY_SCHEDULED"] } },
            orderBy: { expectedValue: "desc" },
            take: 50,
        });
        const totalFailedAmount = failedAttempts.reduce((sum, p) => sum + p.amount, 0);
        const totalExpectedRecovery = failedAttempts.reduce((sum, p) => sum + p.expectedValue, 0);
        res.json({
            success: true,
            data: {
                opportunities: failedAttempts,
                totalFailedAmount,
                totalExpectedRecovery,
                count: failedAttempts.length,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.get("/api/finance/cashflow", async (req, res) => {
    try {
        const days = Number(req.query.days || 60);
        const records = await prisma_1.default.cashFlow.findMany({
            orderBy: { date: "desc" },
            take: days,
        });
        const sorted = records.reverse();
        const latest = sorted[sorted.length - 1];
        const historicalOnly = sorted.filter((r) => !r.forecasted);
        const recent7Days = historicalOnly.slice(-7);
        const prev7Days = historicalOnly.slice(-14, -7);
        const recentInflow = recent7Days.reduce((acc, r) => acc + r.inflow, 0);
        const prevInflow = prev7Days.reduce((acc, r) => acc + r.inflow, 0);
        const revenueDropPct = prevInflow > 0 ? Math.round(((prevInflow - recentInflow) / prevInflow) * 100) : 0;
        res.json({
            success: true,
            data: {
                records: sorted,
                currentBalance: latest?.closingBalance || 4250000,
                recent7DayInflow: recentInflow,
                prev7DayInflow: prevInflow,
                revenueDropPct,
                safetyBuffer: 1500000,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.post("/api/finance/scenario", (req, res) => {
    try {
        const result = client_1.MLClient.simulateCashflow({
            currentCash: req.body.currentCash ? Number(req.body.currentCash) : 4250000,
            revenueMultiplier: req.body.revenueMultiplier !== undefined ? Number(req.body.revenueMultiplier) : 1.0,
            expenseMultiplier: req.body.expenseMultiplier !== undefined ? Number(req.body.expenseMultiplier) : 1.0,
            recoveryUpliftINR: req.body.recoveryUpliftINR !== undefined ? Number(req.body.recoveryUpliftINR) : 0,
            safetyBufferINR: req.body.safetyBufferINR !== undefined ? Number(req.body.safetyBufferINR) : 1500000,
        });
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
// 3. AI Agent Orchestrator & Action Engine
app.post("/api/agent/run", async (req, res) => {
    try {
        const query = req.body.query || "Why did my revenue fall and what should I do?";
        const result = await orchestrator_1.MasterOrchestrator.runTask(query);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.post("/api/action/preview", async (req, res) => {
    try {
        const preview = await action_engine_1.ActionEngine.preview({
            agentName: req.body.agentName,
            actionType: req.body.actionType,
            entityId: req.body.entityId,
            reason: req.body.reason,
            financialImpact: req.body.financialImpact ? Number(req.body.financialImpact) : 0,
            discountPercentage: req.body.discountPercentage ? Number(req.body.discountPercentage) : 0,
            riskTier: req.body.riskTier || "LOW",
            metadata: req.body.metadata,
        });
        res.json({ success: true, data: preview });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
app.post("/api/action/execute", async (req, res) => {
    try {
        const result = await action_engine_1.ActionEngine.execute({
            agentName: req.body.agentName,
            actionType: req.body.actionType,
            entityId: req.body.entityId,
            reason: req.body.reason,
            financialImpact: req.body.financialImpact ? Number(req.body.financialImpact) : 0,
            discountPercentage: req.body.discountPercentage ? Number(req.body.discountPercentage) : 0,
            riskTier: req.body.riskTier || "LOW",
            metadata: req.body.metadata,
        }, req.body.merchantDecision || "AUTO");
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
app.get("/api/agent/activity", async (req, res) => {
    try {
        const activities = await prisma_1.default.agentAction.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        res.json({ success: true, data: activities });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Razorpay AI-Native OS — Backend API Server listening on http://localhost:${PORT}`);
});
