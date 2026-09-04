# Razorpay AI-Native Merchant Operating System

> **Razorpay AI Buildathon 2026**  
> *"Four AI agents. One business brain. Growth finds the money. Risk protects it. Recovery brings it back. Finance tells you what to do next."*

The repository is divided into dedicated folders:

```
razorpay-ai/
├── frontend/             # Next.js App Router (16 UI pages, Components, Recharts, Tailwind)
│   ├── src/app/          # UI routes: command-center, growth, risk, recovery, finance, etc.
│   ├── src/components/   # Reusable components: Sidebar, TopNav, MetricCard, PolicyPill, RiskBadge
│   ├── package.json      # Frontend dependencies & dev scripts (Port 3000)
│   └── tailwind.config.ts
│
├── backend/              # Node.js Express REST API Server + Prisma Database Layer
│   ├── src/server.ts     # Express server exposing all 13 API endpoints (Port 5001)
│   ├── src/lib/agents/   # Multi-Agent Orchestrator, Growth, Risk, Recovery, Finance
│   ├── src/lib/policy/   # Policy & Guardrail Engine
│   ├── src/lib/actions/  # Action Execution Engine (simulated Razorpay API adapter)
│   ├── prisma/           # 12 Relational models (dev.db, seed script)
│   └── package.json      # Backend dependencies & dev scripts
│
└── ml_service/           # Python FastAPI Machine Learning Microservice
    ├── main.py           # FastAPI prediction API with SHAP factors (Port 8000)
    ├── train_models.py   # Benchmark model training script (XGBoost / scikit-learn)
    ├── requirements.txt
    └── venv/
```

---

## Running the Divided Services

You can run each service individually or from the root:

### 1. Start Frontend (Port 3000)
```bash
npm run dev:frontend
# Access UI at http://localhost:3000
```

### 2. Start Backend (Port 5001)
```bash
npm run dev:backend
# Access REST APIs at http://localhost:5001
```

### 3. (Optional) Start Python ML Service (Port 8000)
```bash
npm run dev:ml
# Access Swagger docs at http://localhost:8000/docs
```

---

## Key Design Principle

$$\textbf{ML predicts} \longrightarrow \textbf{AI agent reasons} \longrightarrow \textbf{Policy engine governs} \longrightarrow \textbf{Action engine executes} \longrightarrow \textbf{Outcome is logged as feedback}$$
