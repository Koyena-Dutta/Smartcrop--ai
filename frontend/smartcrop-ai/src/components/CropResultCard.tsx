import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  crop: string;
  suitability: "High" | "Medium" | "Low";

  demand?: "High" | "Low";
  marketTrend?: "up" | "down" | "stable";
  mode: "suitability" | "market";
}

export const CropResultCard = ({
  crop,
  suitability,
  demand,
  marketTrend,
  mode,
}: Props) => {

  const TrendIcon =
    marketTrend === "up"
      ? TrendingUp
      : marketTrend === "down"
      ? TrendingDown
      : Minus;

  const suitabilityColors = {
    High: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-red-100 text-red-700",
  };

  const demandColors = {
    High: "text-green-700",
    Low: "text-red-700",
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-soft space-y-3">
      
      {/* Crop name */}
      <h3 className="text-xl font-semibold">{crop}</h3>

      {/* Suitability badge */}
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${suitabilityColors[suitability]}`}
      >
        Suitability: {suitability}
      </span>

      {/* Market mode */}
      {mode === "market" && demand && marketTrend && (
        <>
          <hr className="my-3" />
          <div className="flex justify-between items-center text-sm">
            <span className={demandColors[demand]}>
              Market Demand: {demand}
            </span>
            <TrendIcon className="w-5 h-5" />
          </div>
        </>
      )}
    </div>
  );
};
