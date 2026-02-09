import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const CROPS = ["Rice", "Wheat", "Sugarcane", "Cotton", "Soybean", "Maize"];

export const MarketInsights = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const results = [];

      for (const crop of CROPS) {
        const res = await fetch(`${BASE_URL}/predict-market-demand`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop: crop.toLowerCase(),
            district: "east godavari",
            area: 10,
            yield_: 3500,
            year: 2024,
          }),
        });

        const d = await res.json();
        results.push({
          crop,
          demand: d.market_demand === 1 ? "High" : "Low",
          trend: d.confidence > 0.6 ? "up" : d.confidence > 0.4 ? "stable" : "down",
        });
      }

      setData(results);
    };

    load();
  }, []);

  const Icon = (t: string) =>
    t === "up" ? TrendingUp : t === "down" ? TrendingDown : Minus;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {data.map(c => (
        <div key={c.crop} className="border rounded-xl p-5">
          <h3 className="font-semibold">{c.crop}</h3>
          <p className={c.demand === "High" ? "text-green-600" : "text-red-600"}>
  Market Demand: {c.demand}
</p>
<p className="text-xs text-muted-foreground">
  Based on recent market trends
</p>

          const Trend = Icon(c.trend);

        </div>
      ))}
    </div>
  );
};
