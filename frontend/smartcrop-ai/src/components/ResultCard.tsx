import { TrendingUp, TrendingDown, Minus, Target, BarChart3 } from "lucide-react";

// This matches what CropRecommendation.tsx is currently passing
interface CropResultCardProps {
  crop: string;
  demand: "High" | "Medium" | "Low";
  trend: "up" | "down" | "stable";
  change: number;  // This is the percentage score
}

const demandColors = {
  High: "bg-lime-light text-primary border-lime/30",
  Medium: "bg-gold/10 text-gold border-gold/30",
  Low: "bg-muted text-muted-foreground border-border",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendStyles = {
  up: "text-accent",
  down: "text-destructive",
  stable: "text-muted-foreground",
};

export const CropResultCard = ({
  crop,
  demand,
  trend,
  change,
}: CropResultCardProps) => {
  const TrendIcon = trendIcons[trend];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-soft card-hover animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{crop}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${demandColors[demand]}`}>
            {demand} Suitability
          </span>
        </div>
        
        <div className="w-10 h-10 rounded-xl bg-lime-light flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {/* Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Suitability Score</span>
            <span className="text-2xl font-bold text-primary">{change}%</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
              style={{ width: `${change}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            How well this crop matches your soil & climate conditions
          </p>
        </div>

        {/* Trend */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <TrendIcon className={`w-4 h-4 ${trendStyles[trend]}`} />
            <span className="text-sm text-muted-foreground">Growth Potential</span>
          </div>
          <span className={`text-sm font-semibold ${trendStyles[trend]}`}>
            {trend === "up" ? "↑ Positive" : trend === "down" ? "↓ Negative" : "→ Stable"}
          </span>
        </div>
      </div>
    </div>
  );
};