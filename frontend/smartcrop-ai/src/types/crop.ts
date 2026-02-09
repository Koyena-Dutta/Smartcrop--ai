export type SuitabilityLevel = "High" | "Medium" | "Low";
export type Trend = "up" | "down" | "stable";

export interface SoilCropResult {
  crop: string;
  suitability: SuitabilityLevel;
  suitabilityScore: number; // 0–100
  confidence: number;       // 0–100
}

export interface MarketCropResult extends SoilCropResult {
  demand: "High" | "Low";
  marketConfidence: number; // 0–100
  marketTrend: Trend;
}
