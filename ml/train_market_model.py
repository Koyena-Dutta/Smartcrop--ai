# =========================
# 1. IMPORTS
# =========================
import pandas as pd
import numpy as np
import pickle
from pathlib import Path

from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import roc_auc_score
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier


# =========================
# 2. PATHS
# =========================
BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR / "data"              # CSV location
MODEL_DIR = BASE_DIR / "saved_models"     # PKL location

MODEL_DIR.mkdir(exist_ok=True)


# =========================
# 3. LOAD DATA
# =========================
df = pd.read_csv(DATA_DIR / "ICRISAT-District Level Data (1).csv")
df.columns = df.columns.str.strip()


# =========================
# 4. FILTER REGION & YEARS
# =========================
df = df[
    (df["State Name"].str.lower() == "andhra pradesh") &
    (df["Dist Name"].str.lower() == "east godavari") &
    (df["Year"].between(2000, 2019))
].copy()


# =========================
# 5. DETECT CROPS
# =========================
area_cols = [c for c in df.columns if "AREA" in c and "(1000 ha)" in c]
crops = [c.replace(" AREA (1000 ha)", "") for c in area_cols]


# =========================
# 6. WIDE → LONG
# =========================
rows = []

for _, row in df.iterrows():
    for crop in crops:
        area = row.get(f"{crop} AREA (1000 ha)", 0)
        prod = row.get(f"{crop} PRODUCTION (1000 tons)", 0)
        yld  = row.get(f"{crop} YIELD (Kg per ha)", 0)

        if pd.notna(area) and area > 0:
            rows.append({
                "district": "east godavari",
                "year": row["Year"],
                "crop": crop.lower(),
                "area": area,
                "yield": yld,
                "production": prod
            })

long_df = pd.DataFrame(rows)


# =========================
# 7. MARKET DEMAND LABEL
# =========================
long_df["demand_score"] = long_df["production"] / long_df["area"]

threshold = long_df["demand_score"].quantile(0.60)
long_df["market_demand"] = (long_df["demand_score"] >= threshold).astype(int)


# =========================
# 8. TIME-BASED SPLIT
# =========================
train_df = long_df[long_df["year"] <= 2016]
test_df  = long_df[long_df["year"] > 2016]

X_train = train_df[["district", "crop", "area", "yield", "year"]].copy()
y_train = train_df["market_demand"]

X_test = test_df[["district", "crop", "area", "yield", "year"]].copy()
y_test = test_df["market_demand"]


# =========================
# 9. ENCODING (FIT ONLY ON TRAIN)
# =========================
le_crop = LabelEncoder()
le_dist = LabelEncoder()

X_train["crop"] = le_crop.fit_transform(X_train["crop"])
X_test["crop"]  = le_crop.transform(X_test["crop"])

X_train["district"] = le_dist.fit_transform(X_train["district"])
X_test["district"]  = le_dist.transform(X_test["district"])


# =========================
# 10. MODELS
# =========================
rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    random_state=42
)

xgb = XGBClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric="logloss",
    random_state=42
)


# =========================
# 11. TRAIN
# =========================
rf.fit(X_train, y_train)
xgb.fit(X_train.astype(float), y_train)


# =========================
# 12. ENSEMBLE EVALUATION
# =========================
rf_prob  = rf.predict_proba(X_test)[:, 1]
xgb_prob = xgb.predict_proba(X_test.astype(float))[:, 1]

final_prob = (rf_prob + xgb_prob) / 2
final_pred = (final_prob >= 0.5).astype(int)

roc = roc_auc_score(y_test, final_prob)
print("Final RF + XGB Ensemble ROC-AUC:", round(roc, 4))


# =========================
# 13. SAVE MODEL + ENCODERS
# =========================
model = {
    "rf": rf,
    "xgb": xgb
}

encoders = {
    "crop": le_crop,
    "district": le_dist
}

with open(MODEL_DIR / "market_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open(MODEL_DIR / "market_encoders.pkl", "wb") as f:
    pickle.dump(encoders, f)

print("✅ Model and encoders saved successfully")
print("Saved files:", [p.name for p in MODEL_DIR.iterdir()])
