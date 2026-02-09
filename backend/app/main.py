from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np
import pandas as pd
from pathlib import Path


# =========================
# FASTAPI APP
# =========================
app = FastAPI(title="Crop Recommendation & Market Demand API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# PATH SETUP
# =========================
BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "ml" / "saved_models"

print("BASE_DIR:", BASE_DIR)
print("MODEL_DIR:", MODEL_DIR)
print("MODEL_DIR exists:", MODEL_DIR.exists())


# =========================
# LOAD MARKET DEMAND MODEL
# =========================
with open(MODEL_DIR / "market_model.pkl", "rb") as f:
    market_model = pickle.load(f)

with open(MODEL_DIR / "market_encoders.pkl", "rb") as f:
    market_encoders = pickle.load(f)

rf = market_model["rf"]
xgb = market_model["xgb"]

le_crop = market_encoders["crop"]
le_dist = market_encoders["district"]

print("✅ Market demand model loaded")


# =========================
# LOAD CROP RECOMMENDATION MODEL
# =========================
with open(MODEL_DIR / "crop_model.pkl", "rb") as f:
    crop_model = pickle.load(f)

with open(MODEL_DIR / "crop_encoders.pkl", "rb") as f:
    crop_encoders = pickle.load(f)

print("✅ Crop recommendation model loaded")


# =========================
# SEASON-BASED WEATHER DEFAULTS
# =========================
# From weather_seasonal.csv
SEASON_WEATHER = {
    "kharif": {
        "temperature": 28.5675,
        "rainfall": 793.87,
        "humidity": 82.725
    },
    "rabi": {
        "temperature": 25.678,
        "rainfall": 328.83,
        "humidity": 73.766
    },
    "zaid": {
        "temperature": 29.52,
        "rainfall": 102.67,
        "humidity": 71.91333333
    }
}


# =========================
# SMART NUTRIENT MAPPING
# =========================
# Based on processed_soil_data.csv statistics
NUTRIENT_STATS = {
    "nitrogen": {"low": 100, "medium": 112, "high": 123},
    "phosphorus": {"low": 109, "medium": 118, "high": 130},
    "potassium": {"low": 145, "medium": 175, "high": 200},
    "oc_value": {"low": 145, "medium": 170, "high": 200},
    "ph": {"low": 5.5, "medium": 6.8, "high": 7.8}
}

def map_nutrient(value, nutrient_name):
    """
    Converts low/medium/high OR numeric → numeric
    """
    if isinstance(value, (int, float)):
        return float(value)

    value_str = str(value).lower().strip()
    
    if value_str not in ["low", "medium", "high"]:
        # Try to convert to float if it's a numeric string
        try:
            return float(value)
        except:
            raise ValueError(f"Invalid value for {nutrient_name}: {value}. Must be 'low', 'medium', 'high', or a number")

    return NUTRIENT_STATS[nutrient_name][value_str]


# =========================
# INPUT SCHEMAS
# =========================
class MarketDemandInput(BaseModel):
    district: str
    crop: str
    area: float
    yield_: float
    year: int


from typing import Union
from typing import Optional

class CropRecommendInput(BaseModel):
    district: str
    block: str
    season: str
    ph: Union[float, str]
    n_value: Union[float, str]  # Changed from nitrogen
    p_value: Union[float, str]  # Changed from phosphorus
    k_value: Union[float, str]  # Changed from potassium
    oc_value: Union[float, str]  # Added
    temperature: Optional[Union[float, str]] = None  # Added
    rainfall: Optional[Union[float, str]] = None  # Added
    humidity: Optional[Union[float, str]] = None  # Added


# =========================
# HEALTH CHECK
# =========================
@app.get("/")
def root():
    return {"status": "API is running"}


# =========================
# MARKET DEMAND PREDICTION
# =========================
@app.post("/predict-market-demand")
def predict_market_demand(data: MarketDemandInput):
    try:
        crop_encoded = le_crop.transform([data.crop.lower()])[0]
        dist_encoded = le_dist.transform([data.district.lower()])[0]

        X = np.array([[dist_encoded, crop_encoded, data.area, data.yield_, data.year]])

        rf_prob = rf.predict_proba(X)[0][1]
        xgb_prob = xgb.predict_proba(X.astype(float))[0][1]

        final_prob = (rf_prob + xgb_prob) / 2

        return {
            "market_demand": int(final_prob >= 0.5),
            "confidence": round(float(final_prob), 3),
            "model": "RF + XGBoost Ensemble"
        }

    except Exception as e:
        return {"error": str(e)}


# =========================
# CROP RECOMMENDATION
# =========================
@app.post("/recommend-crops")
def recommend_crops_api(data: CropRecommendInput):
    try:
        season_lower = data.season.lower().strip()
        
        # Validate season and get weather data
        if season_lower not in SEASON_WEATHER:
            return {"error": f"Invalid season '{data.season}'. Choose from: kharif, rabi, zaid"}
        
        weather_data = SEASON_WEATHER[season_lower]
        
        # Build the base row with all features
        base_row = {
            "district": data.district.lower().strip(),
            "block": data.block.lower().strip(),
            "season": season_lower,
            "ph": map_nutrient(data.ph, "ph"),
            "n_value": map_nutrient(data.n_value, "nitrogen"),
            "p_value": map_nutrient(data.p_value, "phosphorus"),
            "k_value": map_nutrient(data.k_value, "potassium"),
            "oc_value": map_nutrient(data.oc_value, "oc_value"),
            "temperature": weather_data["temperature"],  # Auto-filled from season
            "rainfall": weather_data["rainfall"],  # Auto-filled from season
            "humidity": weather_data["humidity"],  # Auto-filled from season
        }

        recommendations = []

        # Loop through all possible crops and predict suitability
        for crop_name in crop_encoders["crop"].classes_:
            row = base_row.copy()
            row["crop"] = crop_name
            row_df = pd.DataFrame([row])

            # Ensure correct column order matching training
            expected_cols = ["district", "block", "season", "ph", "n_value", 
                           "p_value", "k_value", "oc_value", "temperature", 
                           "rainfall", "humidity", "crop"]
            
            row_df = row_df[expected_cols]

            # Encode categorical columns
            for col, le in crop_encoders.items():
                try:
                    row_df[col] = le.transform(row_df[col])
                except ValueError as e:
                    return {"error": f"Unknown value for {col}: {row_df[col].iloc[0]}. Error: {str(e)}"}

            # Predict suitability probability
            prob = crop_model.predict_proba(row_df)[0][1]

            recommendations.append({
                "crop": crop_name,
                "score": round(float(prob), 3)
            })

        # Sort by score (highest first)
        recommendations.sort(key=lambda x: x["score"], reverse=True)

        return {
            "recommended_crops": recommendations[:6],  # Top 10
            "model": "RandomForest Suitability Model",
            "weather_used": weather_data  # Show which weather data was used
        }

    except Exception as e:
        import traceback
        return {
            "error": str(e),
            "traceback": traceback.format_exc()
        }


# =========================
# GET AVAILABLE SEASONS (HELPER ENDPOINT)
# =========================
@app.get("/seasons")
def get_seasons():
    """Return available seasons for dropdown"""
    return {
        "seasons": list(SEASON_WEATHER.keys()),
        "details": SEASON_WEATHER
    }