import pandas as pd
import pickle
from pathlib import Path
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

print("🚀 Training script started")

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "saved_models"
MODEL_DIR.mkdir(exist_ok=True)

# =========================
# 1. LOAD DATA
# =========================
soil = pd.read_csv(DATA_DIR / "processed_soil_data.csv")
weather = pd.read_csv(DATA_DIR / "weather_seasonal.csv")
crop = pd.read_csv(DATA_DIR / "crop_production.csv")

print(f"✅ Loaded soil: {soil.shape}, weather: {weather.shape}, crop: {crop.shape}")

# =========================
# 2. NORMALIZE & CLEAN
# =========================
def normalize(df):
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    return df

soil = normalize(soil)
weather = normalize(weather)
crop = normalize(crop)

soil.drop(columns=["state"], inplace=True, errors="ignore")
soil["district"] = soil["district"].astype(str).str.lower().str.strip()
soil["block"] = soil["block"].astype(str).str.lower().str.strip()

weather.loc[:, "district"] = "east godavari"
weather["season"] = weather["season"].astype(str).str.lower().str.strip()

if "district_name" in crop.columns:
    crop.rename(columns={"district_name": "district"}, inplace=True)

crop["district"] = crop["district"].astype(str).str.lower().str.strip()
crop["season"] = crop["season"].astype(str).str.lower().str.strip()
crop["crop"] = crop["crop"].astype(str).str.lower().str.strip()

crop_eg = crop[crop["district"] == "east godavari"]

# =========================
# 3. MERGE & BUILD BINARY DATASET
# =========================
base_df = soil.merge(weather, on="district", how="inner")
unique_crops = crop_eg["crop"].unique()

binary_rows = []
for _, row in base_df.iterrows():
    for crop_name in unique_crops:
        is_suitable = int(((crop_eg["crop"] == crop_name) & 
                          (crop_eg["season"] == row["season"])).any())
        binary_rows.append({**row.to_dict(), "crop": crop_name, "suitable": is_suitable})

binary_df = pd.DataFrame(binary_rows)

# =========================
# 4. FEATURE SELECTION & ENCODING
# =========================
FEATURE_COLUMNS = [
    "district", "block", "season", "ph", "n_value", "p_value", 
    "k_value", "oc_value", "temperature", "rainfall", "humidity", "crop"
]

X = binary_df[FEATURE_COLUMNS].copy()
y = binary_df["suitable"]

encoders = {}
categorical_cols = ["district", "block", "season", "crop"]

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# =========================
# 5. TRAIN & SAVE
# =========================
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42)
model.fit(X_train, y_train)

with open(MODEL_DIR / "crop_model.pkl", "wb") as f:
    pickle.dump(model, f)
with open(MODEL_DIR / "crop_encoders.pkl", "wb") as f:
    pickle.dump(encoders, f)

print(f"✅ Model & Encoders saved to {MODEL_DIR}")

# ==========================================================
# 6. GENERATE TOP 6 RECOMMENDED CROPS (SIMULATION)
# ==========================================================
print(f"\n{'='*80}")
print("🏆 TOP 6 RECOMMENDED CROPS FOR EAST GODAVARI (KHARIF)")
print(f"{'='*80}")

# Mock input data for testing
test_input = {
    "district": "east godavari",
    "block": "anaparthy", # Or any block from your soil data
    "season": "kharif",
    "ph": 6.5,
    "n_value": 90.0,
    "p_value": 100.0,
    "k_value": 150.0,
    "oc_value": 150.0,
    "temperature": 29.0,
    "rainfall": 800.0,
    "humidity": 80.0
}

all_crops = encoders["crop"].classes_
recommendations = []

for crop_name in all_crops:
    # Prepare single row
    row_data = test_input.copy()
    row_data["crop"] = crop_name
    row_df = pd.DataFrame([row_data])[FEATURE_COLUMNS]
    
    # Apply Encoders
    for col, le in encoders.items():
        row_df[col] = le.transform(row_df[col])
    
    # Get Probability
    prob = model.predict_proba(row_df)[0][1]
    recommendations.append((crop_name, prob))

# Sort by probability and pick top 6
recommendations.sort(key=lambda x: x[1], reverse=True)
top_6 = recommendations[:6]

for i, (name, score) in enumerate(top_6, 1):
    print(f"   {i}. {name.upper():15s} | Suitability Score: {score:.4f}")

print(f"{'='*80}")
print("✅ TRAINING AND RECOMMENDATION TEST COMPLETE!")

# =========================
# 6. MODEL EVALUATION
# =========================
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)

print(f"\n{'='*60}")
print("MODEL PERFORMANCE METRICS")
print(f"{'='*60}")
print(f"Accuracy: {accuracy:.4f}")
print(f"ROC-AUC:  {roc_auc:.4f}")
print(f"{'='*60}\n")
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=["Not Suitable", "Suitable"]))