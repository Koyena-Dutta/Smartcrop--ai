import { useState } from "react";
import {
  Beaker,
  Thermometer,
  Droplets,
  MapPin,
  Loader2,
  Sparkles,
  CreditCard,
  Calendar,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LevelSelect } from "@/components/LevelSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ===================== TYPES ===================== */
interface FormData {
  district: string;
  block: string;
  season: string;
  oc: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
}

interface CropRecommendationFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

/* ===================== CONSTANTS ===================== */
const nutrientFields = [
  { name: "nitrogen", label: "Nitrogen (N)", unit: "mg/kg" },
  { name: "phosphorus", label: "Phosphorus (P)", unit: "mg/kg" },
  { name: "potassium", label: "Potassium (K)", unit: "mg/kg" },
  { name: "ph", label: "Soil pH", unit: "pH" },
];

/* ===================== COMPONENT ===================== */
export const CropRecommendationForm = ({
  onSubmit,
  isLoading,
}: CropRecommendationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    district: "",
    block: "",
    season: "",
    oc: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  });

  // Toggle between LEVELS and NUMERIC INPUTS
  const [useSoilCard, setUseSoilCard] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.district.trim()) {
      alert("Please enter district");
      return;
    }
    if (!formData.block.trim()) {
      alert("Please enter block");
      return;
    }
    if (!formData.season) {
      alert("Please select a season");
      return;
    }
    if (!formData.oc) {
      alert("Please select Organic Carbon level");
      return;
    }
    
    onSubmit(formData);
  };

  // Form is valid if location, season, and oc are filled
  const isFormValid = 
    formData.district.trim() !== "" && 
    formData.block.trim() !== "" && 
    formData.season !== "" &&
    formData.oc !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ===================== LOCATION ===================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-lime-light flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold">Location</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">District</Label>
            <Input
              type="text"
              placeholder="e.g., East Godavari"
              value={formData.district}
              onChange={(e) => handleChange("district", e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Block / Mandal</Label>
            <Input
              type="text"
              placeholder="e.g., Anaparthy"
              value={formData.block}
              onChange={(e) => handleChange("block", e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      {/* ===================== SEASON SELECTION ===================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-lime-light flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold">Growing Season</h3>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Season</Label>
          <Select
            value={formData.season}
            onValueChange={(value) => handleChange("season", value)}
            required
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Choose farming season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kharif">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">🌧️ Kharif (Monsoon)</span>
                  <span className="text-xs text-muted-foreground">
                    Jun-Oct • Temp: 28.6°C • Rainfall: 793mm • Humidity: 82.7%
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="rabi">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">❄️ Rabi (Winter)</span>
                  <span className="text-xs text-muted-foreground">
                    Nov-Mar • Temp: 25.7°C • Rainfall: 328mm • Humidity: 73.8%
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="zaid">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">☀️ Zaid (Summer)</span>
                  <span className="text-xs text-muted-foreground">
                    Mar-Jun • Temp: 29.5°C • Rainfall: 102mm • Humidity: 71.9%
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            📊 Temperature, rainfall, and humidity will be auto-filled based on your season
          </p>
        </div>
      </div>

      {/* ===================== SOIL NUTRIENTS ===================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-lime-light flex items-center justify-center">
              <Beaker className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold">Soil Nutrients (N-P-K)</h3>
          </div>

          <Button
            type="button"
            variant={useSoilCard ? "default" : "outline"}
            size="sm"
            onClick={() => setUseSoilCard(!useSoilCard)}
            className="flex gap-2"
          >
            <CreditCard className="w-4 h-4" />
            {useSoilCard ? "Using Card Values" : "Have Soil Health Card?"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nutrientFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label className="text-sm font-medium">{field.label}</Label>

              {useSoilCard ? (
                // NUMERIC INPUT MODE (from Soil Health Card)
                <div className="relative">
                  <Input
                    type="number"
                    step={field.name === "ph" ? "0.1" : "1"}
                    value={formData[field.name as keyof FormData]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="input-field pr-16"
                    placeholder={
                      field.name === "nitrogen" ? "100" :
                      field.name === "phosphorus" ? "117" :
                      field.name === "potassium" ? "160" : "6.8"
                    }
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {field.unit}
                  </span>
                </div>
              ) : (
                // LOW/MEDIUM/HIGH SELECTOR MODE (default)
                <LevelSelect
                  placeholder="Select level"
                  onChange={(value) => handleChange(field.name, value)}
                />
              )}

              {/* Helper text showing ranges */}
              {!useSoilCard && (
                <p className="text-xs text-muted-foreground">
                  {field.name === "nitrogen" && "Low: 100 | Med: 112 | High: 123"}
                  {field.name === "phosphorus" && "Low: 109 | Med: 118 | High: 130"}
                  {field.name === "potassium" && "Low: 145 | Med: 175 | High: 200"}
                  {field.name === "ph" && "Low: 5.5 | Med: 6.8 | High: 7.8"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===================== SOIL PROPERTIES (OC VALUE) ===================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-lime-light flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold">Soil Properties</h3>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Organic Carbon (OC) Level</Label>
          <Select
            value={formData.oc}
            onValueChange={(value) => handleChange("oc", value)}
            required
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select organic carbon level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">🟡 Low Organic Carbon</span>
                  <span className="text-xs text-muted-foreground">
                    OC ≈ 145 • Poor organic matter • Needs compost
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">🟢 Medium Organic Carbon</span>
                  <span className="text-xs text-muted-foreground">
                    OC ≈ 170 • Moderate organic matter • Good condition
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">🟢 High Organic Carbon</span>
                  <span className="text-xs text-muted-foreground">
                    OC ≈ 200 • Rich organic matter • Excellent soil health
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            💡 If unsure, select "Medium" - most soils in East Godavari have moderate OC levels
          </p>
        </div>
      </div>

      {/* ===================== INFO BOX ===================== */}
      <div className="bg-lime-light border border-lime/30 rounded-lg p-4">
        <p className="text-sm text-primary">
          <strong>🌾 Smart Auto-Fill:</strong> When you select a season, temperature,
          rainfall, and humidity values are automatically populated from historical
          weather data for your region. You only need to provide soil nutrient levels!
        </p>
      </div>

      {/* ===================== SUBMIT ===================== */}
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="btn-accent w-full md:w-auto text-lg px-10 py-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
            Analyzing Soil & Weather...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 w-5 h-5" />
            Get Crop Recommendations
          </>
        )}
      </Button>
    </form>
  );
};