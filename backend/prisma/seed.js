"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const merchant_simulator_1 = require("../src/lib/simulator/merchant-simulator");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Clearing existing data...");
    await prisma.agentAction.deleteMany();
    await prisma.aiPrediction.deleteMany();
    await prisma.cashFlow.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.chargeback.deleteMany();
    await prisma.return.deleteMany();
    await prisma.order.deleteMany();
    await prisma.paymentAttempt.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.customer.deleteMany();
    console.log("👥 Seeding customers with behavioral personas...");
    const customerList = (0, merchant_simulator_1.generateSeededCustomers)();
    const createdCustomers = {};
    for (const c of customerList) {
        const cust = await prisma.customer.create({
            data: c,
        });
        createdCustomers[c.externalId] = cust.id;
    }
    console.log("💳 Seeding transactions & high-risk signals...");
    const now = new Date();
    // 1. Critical Fraud Case (Demo Script centerpiece)
    const critCustomer = createdCustomers["CUST-IN-8804"];
    const critTx = await prisma.transaction.create({
        data: {
            transactionId: "TXN-2026-CRIT-9901",
            customerId: critCustomer,
            amount: 68500,
            currency: "INR",
            timestamp: new Date(now.getTime() - 1000 * 60 * 42), // 42 mins ago
            method: "CARD",
            status: "REVIEW",
            riskScore: 91.4,
            riskTier: "CRITICAL",
            deviceFingerprint: "fp_anon_9x92b_chromium_linux",
            ipAddress: "197.210.54.12", // Foreign proxy / anomalous IP
            location: "Ashburn, Virginia (Routing to Hyderabad, India)",
            velocityCount10m: 4,
            isInternational: true,
            createdAt: new Date(now.getTime() - 1000 * 60 * 42),
        },
    });
    // SHAP factors for critical fraud transaction
    await prisma.aiPrediction.create({
        data: {
            entityId: critTx.id,
            entityType: "TRANSACTION",
            model: "FRAUD_XGBOOST",
            prediction: 0.914,
            confidence: 0.94,
            features: JSON.stringify({
                amount: 68500,
                amount_to_avg_ratio: 3.08,
                velocity_10m: 4,
                is_international_card: 1,
                ip_distance_km: 8400,
                device_is_new: 1,
                account_age_days: 90,
            }),
            topFactors: JSON.stringify([
                { factor: "Cardholder vs Delivery Geo Mismatch (Ashburn -> Hyderabad)", weight: "+0.34", direction: "RISK_INCREASE" },
                { factor: "High Velocity Spike (4 transactions in 10 minutes)", weight: "+0.28", direction: "RISK_INCREASE" },
                { factor: "Unusually High Ticket Value (3.08x customer historical avg)", weight: "+0.19", direction: "RISK_INCREASE" },
                { factor: "New Unrecognized Device Fingerprint with WebRTC leak", weight: "+0.15", direction: "RISK_INCREASE" },
                { factor: "Account Age > 60 Days", weight: "-0.05", direction: "RISK_DECREASE" },
            ]),
        },
    });
    // 2. High Risk Suspicious Transactions
    const priyaCustomer = createdCustomers["CUST-IN-8802"];
    await prisma.transaction.create({
        data: {
            transactionId: "TXN-2026-MED-8802",
            customerId: priyaCustomer,
            amount: 14999,
            currency: "INR",
            timestamp: new Date(now.getTime() - 1000 * 60 * 120),
            method: "UPI",
            status: "SUCCESS",
            riskScore: 24.2,
            riskTier: "LOW",
            deviceFingerprint: "fp_priya_iphone15_safari",
            ipAddress: "49.36.120.45",
            location: "Mumbai, Maharashtra",
            velocityCount10m: 1,
            isInternational: false,
        },
    });
    // 3. Normal / Low Risk Transactions
    const aaravCustomer = createdCustomers["CUST-IN-8801"];
    await prisma.transaction.create({
        data: {
            transactionId: "TXN-2026-SUCC-8801",
            customerId: aaravCustomer,
            amount: 7499,
            currency: "INR",
            timestamp: new Date(now.getTime() - 1000 * 60 * 360),
            method: "UPI",
            status: "SUCCESS",
            riskScore: 8.5,
            riskTier: "LOW",
            deviceFingerprint: "fp_aarav_macbook_chrome",
            ipAddress: "106.51.78.10",
            location: "Bengaluru, Karnataka",
            velocityCount10m: 1,
            isInternational: false,
        },
    });
    console.log("⚡ Seeding failed payment attempts & recovery opportunities...");
    // Key demo pipeline: Recoverable payments
    const failedPayments = [
        {
            paymentId: "PAY-FAIL-7701",
            customerId: createdCustomers["CUST-IN-8801"],
            amount: 8499,
            failureReason: "BANK_SERVER_DOWN",
            paymentMethod: "UPI",
            recoveryProb: 0.92,
            recommendedAction: "SMART_RETRY",
            outcome: "FAILED",
            hoursAgo: 2,
        },
        {
            paymentId: "PAY-FAIL-7702",
            customerId: createdCustomers["CUST-IN-8805"],
            amount: 14999,
            failureReason: "AUTH_TIMEOUT",
            paymentMethod: "CARD",
            recoveryProb: 0.88,
            recommendedAction: "PAYMENT_LINK",
            outcome: "FAILED",
            hoursAgo: 4,
        },
        {
            paymentId: "PAY-FAIL-7703",
            customerId: createdCustomers["CUST-IN-8803"],
            amount: 5499,
            failureReason: "INSUFFICIENT_FUNDS",
            paymentMethod: "UPI",
            recoveryProb: 0.65,
            recommendedAction: "WHATSAPP_REMINDER",
            outcome: "FAILED",
            hoursAgo: 8,
        },
        {
            paymentId: "PAY-FAIL-7704",
            customerId: createdCustomers["CUST-IN-8807"],
            amount: 12499,
            failureReason: "NETWORK_ERROR",
            paymentMethod: "NETBANKING",
            recoveryProb: 0.84,
            recommendedAction: "SMART_RETRY",
            outcome: "FAILED",
            hoursAgo: 14,
        },
        {
            paymentId: "PAY-FAIL-7705",
            customerId: createdCustomers["CUST-IN-8809"],
            amount: 3499,
            failureReason: "CARD_EXPIRED",
            paymentMethod: "CARD",
            recoveryProb: 0.52,
            recommendedAction: "INCENTIVE_OFFER",
            outcome: "FAILED",
            hoursAgo: 24,
        },
        {
            paymentId: "PAY-FAIL-7706",
            customerId: createdCustomers["CUST-IN-8810"],
            amount: 18999,
            failureReason: "BANK_SERVER_DOWN",
            paymentMethod: "UPI",
            recoveryProb: 0.91,
            recommendedAction: "SMART_RETRY",
            outcome: "FAILED",
            hoursAgo: 30,
        },
    ];
    for (const fp of failedPayments) {
        await prisma.paymentAttempt.create({
            data: {
                paymentId: fp.paymentId,
                customerId: fp.customerId,
                amount: fp.amount,
                failureReason: fp.failureReason,
                retryCount: 0,
                outcome: fp.outcome,
                paymentMethod: fp.paymentMethod,
                recoveryProb: fp.recoveryProb,
                expectedValue: Math.round(fp.amount * fp.recoveryProb),
                recommendedAction: fp.recommendedAction,
                createdAt: new Date(now.getTime() - 1000 * 60 * 60 * fp.hoursAgo),
            },
        });
    }
    console.log("📦 Seeding orders & RTO/return risks...");
    const order1 = await prisma.order.create({
        data: {
            orderId: "ORD-2026-6601",
            customerId: createdCustomers["CUST-IN-8806"], // high return customer
            productId: merchant_simulator_1.PRODUCTS[1].id, // shoes (38% category return risk)
            productName: merchant_simulator_1.PRODUCTS[1].name,
            productCategory: merchant_simulator_1.PRODUCTS[1].category,
            amount: merchant_simulator_1.PRODUCTS[1].price,
            fulfillmentStatus: "SHIPPED",
            isCod: true, // COD triggers return risk
            deliveryPincode: "302001",
            returnRiskScore: 0.74,
            createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 18),
        },
    });
    await prisma.order.create({
        data: {
            orderId: "ORD-2026-6602",
            customerId: createdCustomers["CUST-IN-8801"],
            productId: merchant_simulator_1.PRODUCTS[0].id,
            productName: merchant_simulator_1.PRODUCTS[0].name,
            productCategory: merchant_simulator_1.PRODUCTS[0].category,
            amount: merchant_simulator_1.PRODUCTS[0].price,
            fulfillmentStatus: "DELIVERED",
            isCod: false,
            deliveryPincode: "560001",
            returnRiskScore: 0.08,
        },
    });
    console.log("⚖️ Seeding chargebacks & dispute representments...");
    await prisma.chargeback.create({
        data: {
            chargebackId: "CB-2026-5501",
            transactionId: critTx.id,
            customerId: critCustomer,
            amount: 68500,
            reason: "FRAUDULENT_TRANSACTION",
            reasonCode: "10.4",
            status: "UNDER_REVIEW",
            evidenceStatus: "DRAFTED",
            evidenceSummary: "Device fingerprint match, 3DS authentication payload, IP geolocation discrepancy report generated by AI Risk Agent.",
            dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7), // 7 days left
        },
    });
    console.log("🔄 Seeding subscriptions & invoices...");
    await prisma.subscription.create({
        data: {
            subscriptionId: "SUB-IND-4401",
            customerId: createdCustomers["CUST-IN-8802"],
            planName: "PRO",
            amount: 4999,
            billingCycle: "MONTHLY",
            renewalDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 5),
            status: "ACTIVE",
            churnRisk: 0.14,
        },
    });
    await prisma.subscription.create({
        data: {
            subscriptionId: "SUB-IND-4402",
            customerId: createdCustomers["CUST-IN-8803"],
            planName: "STARTER",
            amount: 1999,
            billingCycle: "MONTHLY",
            renewalDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
            status: "RETRYING",
            churnRisk: 0.72,
            failedAttempts: 2,
        },
    });
    await prisma.invoice.create({
        data: {
            invoiceId: "INV-2026-3301",
            customerId: createdCustomers["CUST-IN-8805"],
            amount: 85000,
            dueDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12),
            status: "OVERDUE",
            agingDays: 12,
            reminderCount: 2,
        },
    });
    await prisma.invoice.create({
        data: {
            invoiceId: "INV-2026-3302",
            customerId: createdCustomers["CUST-IN-8807"],
            amount: 125000,
            dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10),
            status: "SENT",
            agingDays: 0,
            reminderCount: 0,
        },
    });
    console.log("💼 Seeding business expenses...");
    const expenses = [
        { id: "EXP-2026-01", category: "CLOUD_SERVERS", amount: 145000, vendor: "AWS / Cloudflare", description: "Production cluster compute & CDN", isRecurring: true },
        { id: "EXP-2026-02", category: "PAYROLL", amount: 820000, vendor: "Direct Salary Account", description: "Engineering & Operations Payroll", isRecurring: true },
        { id: "EXP-2026-03", category: "LOGISTICS_SHIPPING", amount: 185000, vendor: "Shiprocket / Delhivery", description: "Express air & surface delivery services", isRecurring: true },
        { id: "EXP-2026-04", category: "MARKETING_ADS", amount: 260000, vendor: "Meta / Google Ads", description: "Performance acquisition campaigns", isRecurring: true },
        { id: "EXP-2026-05", category: "GATEWAY_FEES", amount: 48000, vendor: "Razorpay Standard MDR", description: "Payment processing fees (1.9% average)", isRecurring: true },
    ];
    for (const exp of expenses) {
        await prisma.expense.create({
            data: {
                expenseId: exp.id,
                category: exp.category,
                amount: exp.amount,
                vendor: exp.vendor,
                description: exp.description,
                isRecurring: exp.isRecurring,
                date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3),
            },
        });
    }
    console.log("📈 Seeding 730 days of Cash Flow history + 30-day forecast...");
    let currentBalance = 4250000; // ₹42.5 Lakh starting base
    const cashFlowRecords = [];
    // Generate historical 730 days
    for (let i = 730; i >= 1; i--) {
        const d = new Date(now.getTime() - 1000 * 60 * 60 * 24 * i);
        d.setHours(0, 0, 0, 0);
        // Realistic seasonality: weekends lower, month-ends higher
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const dayOfMonth = d.getDate();
        let dailyInflow = isWeekend ? 65000 + Math.random() * 25000 : 185000 + Math.random() * 80000;
        let dailyOutflow = isWeekend ? 25000 + Math.random() * 15000 : 95000 + Math.random() * 40000;
        // Month-end payroll / server expenses on 1st & 28th
        if (dayOfMonth === 1 || dayOfMonth === 28) {
            dailyOutflow += 450000;
        }
        // Recent week dip (last 7 days drop that triggers demo script!)
        if (i <= 7) {
            dailyInflow *= 0.82; // 18% revenue drop due to gateway timeout and repeat purchase dip
        }
        const netFlow = Math.round(dailyInflow - dailyOutflow);
        currentBalance += netFlow;
        cashFlowRecords.push({
            date: d,
            inflow: Math.round(dailyInflow),
            outflow: Math.round(dailyOutflow),
            netFlow,
            closingBalance: Math.round(currentBalance),
            forecasted: false,
        });
    }
    // Generate 30 days of future forecast
    let forecastedBalance = currentBalance;
    for (let f = 1; f <= 30; f++) {
        const d = new Date(now.getTime() + 1000 * 60 * 60 * 24 * f);
        d.setHours(0, 0, 0, 0);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const dayOfMonth = d.getDate();
        let predInflow = isWeekend ? 70000 : 175000;
        let predOutflow = isWeekend ? 30000 : 105000;
        if (dayOfMonth === 1 || dayOfMonth === 28) {
            predOutflow += 500000;
        }
        const netFlow = Math.round(predInflow - predOutflow);
        forecastedBalance += netFlow;
        cashFlowRecords.push({
            date: d,
            inflow: Math.round(predInflow),
            outflow: Math.round(predOutflow),
            netFlow,
            closingBalance: Math.round(forecastedBalance),
            forecasted: true,
            confidenceLow: Math.round(forecastedBalance * 0.94),
            confidenceHigh: Math.round(forecastedBalance * 1.06),
        });
    }
    // Bulk create in chunks for performance
    const chunkSize = 100;
    for (let c = 0; c < cashFlowRecords.length; c += chunkSize) {
        const chunk = cashFlowRecords.slice(c, c + chunkSize);
        for (const record of chunk) {
            await prisma.cashFlow.create({ data: record });
        }
    }
    console.log("🛡️ Seeding initial Agent Actions & Audit Trail...");
    await prisma.agentAction.create({
        data: {
            agent: "RISK",
            action: "FLAG_REVIEW",
            entityId: critTx.transactionId,
            reason: "High fraud probability (91.4%) with anomalous IP proxy and velocity spike. Guardrail policy prevented auto-block; routed to merchant review.",
            approval: "PENDING_APPROVAL",
            requiresApproval: true,
            status: "PROPOSED",
            riskTier: "CRITICAL",
            financialImpact: 68500,
        },
    });
    await prisma.agentAction.create({
        data: {
            agent: "RECOVERY",
            action: "SMART_RETRY",
            entityId: "PAY-FAIL-7701",
            reason: "HDFC bank gateway recovery window active. Historical recovery rate is 92%. Low risk customer Aarav Sharma.",
            approval: "AUTO_APPROVED",
            requiresApproval: false,
            status: "EXECUTED",
            result: JSON.stringify({ status: "SCHEDULED", nextAttemptInMinutes: 45, expectedYield: 7819 }),
            riskTier: "LOW",
            financialImpact: 8499,
        },
    });
    await prisma.agentAction.create({
        data: {
            agent: "GROWTH",
            action: "DISCOUNT_OFFER",
            entityId: "CUST-IN-8803",
            reason: "Customer Rohan Varma at churn risk (68%). Predicted purchase uplift of +34% with an 8% personalized incentive.",
            approval: "AUTO_APPROVED",
            requiresApproval: false,
            status: "EXECUTED",
            result: JSON.stringify({ code: "WELCOME_BACK_8", discountPct: 8, channel: "EMAIL_WHATSAPP" }),
            riskTier: "LOW",
            financialImpact: 2792,
        },
    });
    console.log("✅ Database seeding completed successfully!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
