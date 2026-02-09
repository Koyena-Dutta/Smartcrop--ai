# 🌾 Smart Crop Recommendation & Market Demand Prediction System

An AI-powered agricultural decision support system that helps farmers make data-driven decisions about crop selection and market demand forecasting using Machine Learning.
---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Datasets Used](#-datasets-used)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Usage Examples](#-usage-examples)
- [Model Performance](#-model-performance)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This system combines multiple agricultural datasets and machine learning models to provide:

1. **Crop Recommendations** - Suggests the best crops to grow based on soil health, season, and weather conditions
2. **Market Demand Prediction** - Forecasts market demand for specific crops to help farmers make profitable decisions

The system is specifically designed for farmers in **Andhra Pradesh, India**, with a focus on the **East Godavari** region.

---

## ✨ Features

### 🌱 Crop Recommendation System
- **Smart Input Handling** - Accepts both qualitative ("low", "medium", "high") and quantitative values for soil nutrients
- **Seasonal Intelligence** - Automatically applies season-specific weather patterns (Kharif, Rabi, Zaid)
- **Multi-Crop Analysis** - Evaluates suitability scores for all available crops
- **Top Recommendations** - Returns top 6 most suitable crops with confidence scores

### 📊 Market Demand Prediction
- **Ensemble Model** - Combines RandomForest and XGBoost for robust predictions
- **Confidence Scoring** - Provides probability-based confidence metrics
- **Historical Pattern Analysis** - Leverages district-level historical crop data

### 🔧 Additional Features
- **RESTful API** - Easy integration with web/mobile applications
- **CORS Enabled** - Supports cross-origin requests
- **Error Handling** - Comprehensive error messages and validation
- **Scalable Architecture** - Built with FastAPI for high performance

---

## 📊 Datasets Used

### 1. **Soil Health Card Dataset**
- **Source**: Government of India - Soil Health Card Scheme
- **Size**: ~2.5 GB (compressed), ~8 GB (uncompressed)
- **Records**: 10+ million soil test records
- **Features**:
  - Soil pH levels
  - Nitrogen (N), Phosphorus (P), Potassium (K) content
  - Organic Carbon (OC) percentage
  - District and Block-level granularity
- **Coverage**: Pan-India, filtered for Andhra Pradesh
- **Purpose**: Provides soil nutrient profiles for crop suitability analysis

### 2. **ICRISAT District-Level Data**
- **Source**: ICRISAT (International Crops Research Institute for the Semi-Arid Tropics)
- **File**: `ICRISAT-district_level_data.csv`
- **Size**: ~45 MB
- **Records**: 50,000+ district-level agricultural records
- **Features**:
  - Crop production data (Area, Yield, Production)
  - District-wise crop distribution
  - Historical crop performance (2000-2020)
  - Market demand indicators
- **Purpose**: Used for market demand prediction and historical pattern analysis

### 3. **NASA POWER Weather Data (East Godavari)**
- **Source**: NASA POWER (Prediction Of Worldwide Energy Resources)
- **API**: https://power.larc.nasa.gov/
- **Size**: ~12 MB
- **Records**: Daily weather data (2010-2024)
- **Features**:
  - Temperature (°C) - Min, Max, Average
  - Rainfall/Precipitation (mm)
  - Humidity (%)
- **Coverage**: East Godavari district, Andhra Pradesh
- **Purpose**: Provides climate context for crop recommendations

### 4. **Processed Seasonal Weather Data**
- **File**: `weather_seasonal.csv` (derived from NASA POWER)
- **Size**: 2 KB
- **Purpose**: Season-averaged weather parameters

| Season | Temperature (°C) | Rainfall (mm) | Humidity (%) |
|--------|------------------|---------------|--------------|
| Kharif (Monsoon) | 28.57 | 793.87 | 82.73 |
| Rabi (Winter) | 25.68 | 328.83 | 73.77 |
| Zaid (Summer) | 29.52 | 102.67 | 71.91 |

### 5. **Processed Soil Statistics**
- **File**: `processed_soil_data.csv`
- **Size**: ~150 MB
- **Records**: 500,000+ processed soil records
- **Purpose**: Statistical benchmarks for nutrient level mapping

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **Python 3.8+** - Core programming language
- **Pydantic** - Data validation and settings management

### Machine Learning
- **scikit-learn** - RandomForest models
- **XGBoost** - Gradient boosting models
- **pandas** - Data manipulation
- **numpy** - Numerical operations

### Model Persistence
- **pickle** - Model serialization

### Deployment
- **Uvicorn** - ASGI server
- **CORS Middleware** - Cross-origin support

---

## 📁 Project Structure

```
crop-recommendation-system/
│
├── api/
│   └── main.py                 # FastAPI application
│
├── ml/
│   ├── saved_models/
│   │   ├── crop_model.pkl      # Crop recommendation model
│   │   ├── crop_encoders.pkl   # Label encoders for crops
│   │   ├── market_model.pkl    # Market demand model (RF + XGBoost)
│   │   └── market_encoders.pkl # Label encoders for market prediction
│   │
│   ├── training/
│   │   ├── train_crop_model.py
│   │   └── train_market_model.py
│   │
│   └── data/
│       ├── soil_health_cards/
│       ├── ICRISAT-district_level_data.csv
│       ├── nasa_power_weather_eastgodavari.csv
│       ├── weather_seasonal.csv
│       └── processed_soil_data.csv
│
├── notebooks/
│   ├── data_exploration.ipynb
│   ├── model_training.ipynb
│   └── evaluation.ipynb
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Virtual environment (recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/crop-recommendation-system.git
cd crop-recommendation-system
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Download Models
```bash
# Models should be placed in ml/saved_models/

```

### Step 5: Run the API
```bash
cd api
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

---

## 📡 API Endpoints

### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "status": "API is running"
}
```

---

### 2. Get Available Seasons
```http
GET /seasons
```

**Response:**
```json
{
  "seasons": ["kharif", "rabi", "zaid"],
  "details": {
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
}
```

---

### 3. Recommend Crops
```http
POST /recommend-crops
```

**Request Body:**
```json
{
  "district": "visakhapatnam",
  "block": "anakapalle",
  "season": "kharif",
  "ph": "medium",
  "n_value": "high",
  "p_value": 120,
  "k_value": "low",
  "oc_value": 165
}
```

**Input Parameters:**

| Parameter | Type | Options/Range | Description |
|-----------|------|---------------|-------------|
| `district` | string | e.g., "visakhapatnam" | District name |
| `block` | string | e.g., "anakapalle" | Block/Mandal name |
| `season` | string | "kharif", "rabi", "zaid" | Growing season |
| `ph` | string/float | "low", "medium", "high" or 0-14 | Soil pH level |
| `n_value` | string/float | "low", "medium", "high" or numeric | Nitrogen content |
| `p_value` | string/float | "low", "medium", "high" or numeric | Phosphorus content |
| `k_value` | string/float | "low", "medium", "high" or numeric | Potassium content |
| `oc_value` | string/float | "low", "medium", "high" or numeric | Organic Carbon |

**Response:**
```json
{
  "recommended_crops": [
    {"crop": "rice", "score": 0.923},
    {"crop": "maize", "score": 0.876},
    {"crop": "groundnut", "score": 0.754},
    {"crop": "cotton", "score": 0.623},
    {"crop": "sunflower", "score": 0.512},
    {"crop": "wheat", "score": 0.346}
  ],
  "model": "RandomForest Suitability Model",
  "weather_used": {
    "temperature": 28.5675,
    "rainfall": 793.87,
    "humidity": 82.725
  }
}
```

**Score Interpretation:**

| Score Range | Recommendation |
|-------------|----------------|
| 0.9 - 1.0 | 🟢 Highly Recommended |
| 0.7 - 0.9 | 🟡 Recommended |
| 0.5 - 0.7 | 🟠 Moderate Fit |
| 0.3 - 0.5 | 🔴 Not Recommended |
| 0.0 - 0.3 | ⛔ Avoid |

---

### 4. Predict Market Demand
```http
POST /predict-market-demand
```

**Request Body:**
```json
{
  "district": "visakhapatnam",
  "crop": "rice",
  "area": 100,
  "yield_": 2500,
  "year": 2025
}
```

**Input Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `district` | string | District name |
| `crop` | string | Crop name (e.g., "rice", "maize") |
| `area` | float | Cultivated area in hectares |
| `yield_` | float | Expected yield in kg/hectare |
| `year` | int | Year for prediction |

**Response:**
```json
{
  "market_demand": 1,
  "confidence": 0.847,
  "model": "RF + XGBoost Ensemble"
}
```

**Response Fields:**
- `market_demand`: 1 = High Demand, 0 = Low Demand
- `confidence`: Probability score (0-1)
- Higher confidence = More reliable prediction

---

## 📈 Model Performance

### Crop Recommendation Model
- **Algorithm**: RandomForest Classifier
- **Training Samples**: 450,000+
- **Accuracy**: ~87%
- **Precision**: ~85%
- **Recall**: ~88%
- **F1-Score**: ~86%

### Market Demand Prediction Model
- **Algorithm**: Ensemble (RandomForest + XGBoost)
- **Training Samples**: 50,000+
- **Accuracy**: ~82%
- **AUC-ROC**: 0.88
- **Precision**: ~80%
- **Recall**: ~84%

---

## 🌟 Key Features Explained

### Smart Nutrient Mapping
The system accepts flexible input formats:

```python
# These are equivalent:
"n_value": "high"    # → Converts to 123
"n_value": 123       # → Uses directly
```

**Mapping Table:**

| Nutrient | Low | Medium | High |
|----------|-----|--------|------|
| Nitrogen | 100 | 112 | 123 |
| Phosphorus | 109 | 118 | 130 |
| Potassium | 145 | 175 | 200 |
| Organic Carbon | 145 | 170 | 200 |
| pH | 5.5 | 6.8 | 7.8 |

### Automatic Weather Integration
Weather data is automatically selected based on season:
- User selects "kharif" → System uses monsoon weather patterns
- User selects "rabi" → System uses winter weather patterns
- User selects "zaid" → System uses summer weather patterns

---


---

## 👥 Authors

- **Koyena Dutta** - *Initial work* - [YourGitHub](https://github.com/koyena-dutta)

---

## 🙏 Acknowledgments

- **Soil Health Card Scheme** - Government of India
- **ICRISAT** - For district-level agricultural data
- **NASA POWER** - For weather data API
- **Farmers of Andhra Pradesh** - For domain insights

---

---

## 🔮 Future Enhancements

- [ ] Add more districts from other states
- [ ] Real-time weather API integration
- [ ] Pest and disease prediction
- [ ] Irrigation requirement calculator
- [ ] Fertilizer recommendation system
- [ ] Mobile app development
- [ ] Multi-language support (Telugu, Hindi)
- [ ] Integration with government schemes
- [ ] Crop price prediction
- [ ] Soil test report upload and parsing

---

## 📚 References

1. [Soil Health Card Portal](https://www.soilhealth.dac.gov.in/)
2. [ICRISAT Open Data](https://dataverse.harvard.edu/dataverse/icrisat)
3. [NASA POWER API Documentation](https://power.larc.nasa.gov/docs/)
4. [FastAPI Documentation](https://fastapi.tiangolo.com/)
5. [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️ for Indian Farmers 🌾

</div>
