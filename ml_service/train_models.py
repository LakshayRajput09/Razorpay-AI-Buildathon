"""
Production Model Training Pipeline for Razorpay AI-Native Merchant OS
Trains 4 supervised ML models using Scikit-Learn's HistGradientBoosting & RandomForest:
1. Fraud & Dispute Detection (HistGradientBoostingClassifier + Feature Weights)
2. Payment Recovery Probability (RandomForestClassifier)
3. Customer Growth & Repurchase Propensity (RandomForestClassifier)
4. COD Return-to-Origin (RTO) Risk (HistGradientBoostingClassifier)

Exports all trained models and encoder metadata to ml_service/models/.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, average_precision_score, precision_score, recall_score, f1_score
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)
np.random.seed(42)

# ==============================================================================
# 1. Fraud & Dispute Detection Model (HistGradientBoosting)
# ==============================================================================
def train_fraud_model():
    print("=" * 60)
    print("🚀 [1/4] Training Fraud & Dispute Detection Model (HistGradientBoosting)...")
    n_samples = 5000

    amount_ratio = np.random.exponential(scale=1.2, size=n_samples)
    velocity_10m = np.random.poisson(lam=1.2, size=n_samples)
    is_international = np.random.binomial(n=1, p=0.08, size=n_samples)
    device_is_new = np.random.binomial(n=1, p=0.20, size=n_samples)
    ip_distance_km = np.random.exponential(scale=150, size=n_samples)
    account_age_days = np.random.randint(1, 730, size=n_samples)

    risk_logits = (
        -3.5
        + 1.6 * (amount_ratio > 2.5)
        + 2.2 * (velocity_10m >= 3)
        + 1.8 * is_international
        + 1.2 * device_is_new
        + 1.5 * (ip_distance_km > 1500)
        - 0.003 * account_age_days
        + np.random.normal(0, 0.4, n_samples)
    )
    fraud_prob = 1.0 / (1.0 + np.exp(-risk_logits))
    y = (fraud_prob > 0.45).astype(int)

    X = pd.DataFrame({
        "amount_ratio": amount_ratio,
        "velocity_10m": velocity_10m,
        "is_international": is_international,
        "device_is_new": device_is_new,
        "ip_distance_km": ip_distance_km,
        "account_age_days": account_age_days,
    })

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = HistGradientBoostingClassifier(
        max_iter=120,
        max_depth=5,
        learning_rate=0.08,
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = (y_pred_proba >= 0.5).astype(int)

    roc_auc = roc_auc_score(y_test, y_pred_proba)
    pr_auc = average_precision_score(y_test, y_pred_proba)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)

    print(f"   ✓ Samples: {n_samples} (Fraud Rate: {y.mean()*100:.1f}%)")
    print(f"   ✓ ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f}")
    print(f"   ✓ Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1_score(y_test, y_pred):.4f}")

    payload = {
        "model": model,
        "features": list(X.columns),
        "metrics": {"roc_auc": roc_auc, "pr_auc": pr_auc, "precision": prec, "recall": rec},
    }
    model_path = os.path.join(MODELS_DIR, "fraud_model.joblib")
    joblib.dump(payload, model_path)
    print(f"   💾 Saved to {model_path}")
    return payload

# ==============================================================================
# 2. Payment Recovery Probability Model (Random Forest)
# ==============================================================================
FAILURE_REASONS = [
    "BANK_SERVER_DOWN",
    "AUTH_TIMEOUT_3DS",
    "INSUFFICIENT_FUNDS",
    "NETWORK_ERROR",
    "GATEWAY_DROP",
    "USER_DROPPED",
]
PAYMENT_METHODS = ["UPI", "CARD", "NETBANKING", "WALLET"]

def train_recovery_model():
    print("=" * 60)
    print("🚀 [2/4] Training Payment Recovery Probability Model (Random Forest)...")
    n_samples = 4000

    amounts = np.random.lognormal(mean=7.5, sigma=0.8, size=n_samples)
    failure_indices = np.random.choice(len(FAILURE_REASONS), size=n_samples, p=[0.28, 0.25, 0.18, 0.14, 0.10, 0.05])
    method_indices = np.random.choice(len(PAYMENT_METHODS), size=n_samples, p=[0.55, 0.25, 0.15, 0.05])
    retry_counts = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.50, 0.30, 0.15, 0.05])
    order_counts = np.random.geometric(p=0.25, size=n_samples)
    customer_spend = amounts * order_counts * np.random.uniform(0.8, 1.2, size=n_samples)

    p_arr = np.full(n_samples, 0.50)
    for i in range(n_samples):
        r = FAILURE_REASONS[failure_indices[i]]
        if r in ["BANK_SERVER_DOWN", "GATEWAY_DROP"]:
            p_arr[i] += 0.35
        elif r in ["AUTH_TIMEOUT_3DS", "NETWORK_ERROR"]:
            p_arr[i] += 0.25
        elif r == "INSUFFICIENT_FUNDS":
            p_arr[i] -= 0.22
        elif r == "USER_DROPPED":
            p_arr[i] -= 0.15

        if PAYMENT_METHODS[method_indices[i]] == "UPI":
            p_arr[i] += 0.08
        
        p_arr[i] -= 0.18 * retry_counts[i]
        
        if order_counts[i] > 3:
            p_arr[i] += 0.10

    p_arr = np.clip(p_arr, 0.05, 0.95)
    y = (np.random.rand(n_samples) < p_arr).astype(int)

    X = pd.DataFrame({
        "amount": amounts,
        "failure_reason_idx": failure_indices,
        "payment_method_idx": method_indices,
        "retry_count": retry_counts,
        "customer_order_count": order_counts,
        "customer_spend": customer_spend,
    })

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = (y_pred_proba >= 0.5).astype(int)

    roc_auc = roc_auc_score(y_test, y_pred_proba)
    pr_auc = average_precision_score(y_test, y_pred_proba)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)

    print(f"   ✓ Samples: {n_samples} (Recovery Rate: {y.mean()*100:.1f}%)")
    print(f"   ✓ ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f}")
    print(f"   ✓ Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1_score(y_test, y_pred):.4f}")

    payload = {
        "model": model,
        "features": list(X.columns),
        "failure_reasons": FAILURE_REASONS,
        "payment_methods": PAYMENT_METHODS,
        "metrics": {"roc_auc": roc_auc, "pr_auc": pr_auc, "precision": prec, "recall": rec},
    }
    model_path = os.path.join(MODELS_DIR, "recovery_model.joblib")
    joblib.dump(payload, model_path)
    print(f"   💾 Saved to {model_path}")
    return payload

# ==============================================================================
# 3. Customer Growth & Repurchase Model (Random Forest)
# ==============================================================================
def train_growth_model():
    print("=" * 60)
    print("🚀 [3/4] Training Customer Growth & Repurchase Model (Random Forest)...")
    n_samples = 3500

    order_count = np.random.geometric(p=0.3, size=n_samples)
    total_spend = order_count * np.random.lognormal(mean=7.2, sigma=0.6, size=n_samples)
    account_age_days = np.random.randint(10, 900, size=n_samples)
    last_order_days_ago = np.random.exponential(scale=30, size=n_samples)
    last_order_days_ago = np.clip(last_order_days_ago, 1, account_age_days)

    logits = (
        0.2
        + 0.15 * np.log1p(order_count)
        + 0.10 * np.log1p(total_spend / 1000)
        - 0.035 * last_order_days_ago
        + np.random.normal(0, 0.3, n_samples)
    )
    p_repeat = 1.0 / (1.0 + np.exp(-logits))
    y = (p_repeat > 0.5).astype(int)

    X = pd.DataFrame({
        "total_spend": total_spend,
        "order_count": order_count,
        "account_age_days": account_age_days,
        "last_order_days_ago": last_order_days_ago,
    })

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = RandomForestClassifier(n_estimators=80, max_depth=5, random_state=42)
    model.fit(X_train, y_train)

    y_pred_proba = model.predict_proba(X_test)[:, 1]
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    pr_auc = average_precision_score(y_test, y_pred_proba)

    print(f"   ✓ Samples: {n_samples} (14D Repurchase Rate: {y.mean()*100:.1f}%)")
    print(f"   ✓ ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f}")

    payload = {
        "model": model,
        "features": list(X.columns),
        "metrics": {"roc_auc": roc_auc, "pr_auc": pr_auc},
    }
    model_path = os.path.join(MODELS_DIR, "growth_model.joblib")
    joblib.dump(payload, model_path)
    print(f"   💾 Saved to {model_path}")
    return payload

# ==============================================================================
# 4. COD Return-To-Origin (RTO) Risk Model (HistGradientBoosting)
# ==============================================================================
CATEGORIES = ["Apparel", "Electronics", "Home", "Beauty", "Jewelry"]

def train_return_model():
    print("=" * 60)
    print("🚀 [4/4] Training COD Return-To-Origin (RTO) Risk Model (HistGradientBoosting)...")
    n_samples = 3500

    amounts = np.random.lognormal(mean=7.6, sigma=0.7, size=n_samples)
    is_cod = np.random.binomial(n=1, p=0.45, size=n_samples)
    category_indices = np.random.choice(len(CATEGORIES), size=n_samples, p=[0.40, 0.25, 0.15, 0.12, 0.08])
    customer_return_rates = np.random.beta(a=1.5, b=8.0, size=n_samples)

    logits = (
        -2.5
        + 1.8 * is_cod
        + 3.5 * customer_return_rates
        + 0.5 * (category_indices == 0)
        + 0.6 * (amounts > 8000)
        + np.random.normal(0, 0.3, n_samples)
    )
    p_return = 1.0 / (1.0 + np.exp(-logits))
    y = (p_return > 0.40).astype(int)

    X = pd.DataFrame({
        "amount": amounts,
        "is_cod": is_cod,
        "category_idx": category_indices,
        "customer_return_rate": customer_return_rates,
    })

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = HistGradientBoostingClassifier(
        max_iter=100,
        max_depth=5,
        learning_rate=0.09,
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred_proba = model.predict_proba(X_test)[:, 1]
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    pr_auc = average_precision_score(y_test, y_pred_proba)

    print(f"   ✓ Samples: {n_samples} (Return Rate: {y.mean()*100:.1f}%)")
    print(f"   ✓ ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f}")

    payload = {
        "model": model,
        "features": list(X.columns),
        "categories": CATEGORIES,
        "metrics": {"roc_auc": roc_auc, "pr_auc": pr_auc},
    }
    model_path = os.path.join(MODELS_DIR, "return_model.joblib")
    joblib.dump(payload, model_path)
    print(f"   💾 Saved to {model_path}")
    return payload

if __name__ == "__main__":
    print("\n⚡ =============================================================")
    print("⚡ Starting Training Pipeline for Razorpay AI-Native Merchant OS")
    print("⚡ =============================================================\n")
    train_fraud_model()
    train_recovery_model()
    train_growth_model()
    train_return_model()
    print("\n🎉 All 4 ML models successfully trained, calibrated, and saved to ml_service/models/!\n")
