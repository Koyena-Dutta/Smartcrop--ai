import { useState } from "react";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CropRecommendationForm } from "./CropRecommendationForm";
import { CropResultCard } from "./CropResultCard";
import { SoilCropResult, MarketCropResult } from "@/types/crop";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

interface FormData {
  district: string;
  block: string;
  season: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  oc: string;
  ph: string;
}

export const CropRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [showSoilResults, setShowSoilResults] = useState(false);
  const [showMarketResults, setShowMarketResults] = useState(false);

  const [soilBasedResults, setSoilBasedResults] = useState<
    SoilCropResult[]
  >([]);
  const [marketBasedResults, setMarketBasedResults] = useState<
    MarketCropResult[]
  >([]);

  const [weatherInfo, setWeatherInfo] = useState<any>(null);

  /* ================= SOIL & CLIMATE SUBMIT ================= */
  const handleSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setShowSoilResults(false);
      setShowMarketResults(false);

      const res = await fetch(`${BASE_URL}/recommend-crops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: data.district.toLowerCase(),
          block: data.block.toLowerCase(),
          season: data.season.toLowerCase(),
          ph: data.ph,
          n_value: data.nitrogen,
          p_value: data.phosphorus,
          k_value: data.potassium,
          oc_value: data.oc,
        }),
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      setWeatherInfo(result.weather_used);

      /* ========= ONLY SUITABILITY (NO % / NO MATCH) ========= */
      const scores = result.recommended_crops.map(
  (c: any) => Number(c.score) || 0
);

const maxScore = Math.max(...scores);
const minScore = Math.min(...scores);

const mapped: SoilCropResult[] = result.recommended_crops.map((item: any) => {
  const score = Number(item.score) || 0;

  let suitability: "High" | "Medium" | "Low";

  if (score >= minScore + 0.66 * (maxScore - minScore)) {
    suitability = "High";
  } else if (score >= minScore + 0.33 * (maxScore - minScore)) {
    suitability = "Medium";
  } else {
    suitability = "Low";
  }

  return {
    crop: item.crop.charAt(0).toUpperCase() + item.crop.slice(1),
    suitability,
  };
});

setSoilBasedResults(mapped.slice(0, 6));
      setShowSoilResults(true);
    } catch (err) {
      alert("Failed to fetch crop recommendations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MARKET DEMAND ================= */
  const handleShowMarketResults = async () => {
    setLoading(true);
    try {
      const results: MarketCropResult[] = [];

      for (const crop of soilBasedResults) {
        const res = await fetch(
          `${BASE_URL}/predict-market-demand`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              crop: crop.crop.toLowerCase(),
              district: "east godavari",
              area: 10,
              yield_: 3500,
              year: 2024,
            }),
          }
        );

        const data = await res.json();

        results.push({
          ...crop,
          demand: data.market_demand === 1 ? "High" : "Low",
          marketConfidence: Math.round(
            (data.confidence || 0) * 100
          ),
          marketTrend:
            data.confidence > 0.6
              ? "up"
              : data.confidence > 0.4
              ? "stable"
              : "down",
        });
      }

      results.sort(
        (a, b) => b.marketConfidence - a.marketConfidence
      );

      setMarketBasedResults(results);
      setShowMarketResults(true);
    } catch (err) {
      alert("Market demand fetch failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto space-y-10">
        {/* ================= HEADER ================= */}
        <div className="text-center">
          <Sprout className="mx-auto mb-2 text-primary" />
          <h2 className="text-3xl font-bold">
            Crop Recommendation
          </h2>
        </div>

        <CropRecommendationForm
          onSubmit={handleSubmit}
          isLoading={loading}
        />

        {/* ================= WEATHER INFO ================= */}
        {weatherInfo && showSoilResults && (
          <p className="text-center text-sm text-muted-foreground">
            Weather used → Temp: {weatherInfo.temperature}°C |
            Rainfall: {weatherInfo.rainfall}mm | Humidity:{" "}
            {weatherInfo.humidity}%
          </p>
        )}

        {/* ================= SOIL RESULTS ================= */}
        {showSoilResults && (
          <>
            <h3 className="text-2xl font-semibold text-center mt-6">
              Top Crop Recommendations (Soil & Climate)
            </h3>

            <div className="grid lg:grid-cols-3 gap-6">
              {soilBasedResults.map((crop) => (
                <CropResultCard
                  key={crop.crop}
                  {...crop}
                  mode="suitability"
                />
              ))}
            </div>

            {!showMarketResults && (
              <div className="text-center mt-6">
                <Button
                  onClick={handleShowMarketResults}
                  disabled={loading}
                >
                  Re-rank by Market Demand
                </Button>
              </div>
            )}
          </>
        )}

        {/* ================= MARKET RESULTS ================= */}
        {showMarketResults && (
          <>
            <h3 className="text-2xl font-semibold text-center mt-10">
              Top Crops Based on Market Demand
            </h3>

            <div className="grid lg:grid-cols-3 gap-6">
              {marketBasedResults.map((crop) => (
                <CropResultCard
                  key={crop.crop}
                  {...crop}
                  mode="market"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
