import { Brain, Leaf, TrendingUp, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze multiple factors to provide accurate recommendations.",
  },
  {
    icon: Leaf,
    title: "Soil Health Focus",
    description: "Comprehensive analysis of NPK levels, pH, and moisture to match crops with soil conditions.",
  },
  {
    icon: TrendingUp,
    title: "Market Integration",
    description: "Real-time market data integration ensures recommendations consider profitability.",
  },
  {
    icon: Shield,
    title: "Reliable Predictions",
    description: "Trained on extensive agricultural datasets for high accuracy and confidence.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get crop recommendations in seconds with detailed suitability analysis.",
  },
  {
    icon: Globe,
    title: "Regional Adaptation",
    description: "Recommendations tailored to specific Indian regions and local growing conditions.",
  },
];

export const About = () => {
  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-lime-light border border-lime/30 rounded-full px-4 py-2 mb-6">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">About SmartCrop AI</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Empowering Farmers with{" "}
              <span className="text-gradient">Intelligent Agriculture</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              SmartCrop AI is an innovative crop recommendation system designed to help farmers 
              make data-driven decisions. By combining soil analysis, weather patterns, and 
              real-time market data, we provide personalized crop suggestions that maximize 
              both yield and profitability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our AI model is trained on extensive agricultural datasets from across India, 
              taking into account regional variations, seasonal patterns, and market dynamics 
              to deliver accurate and actionable recommendations.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl border border-border p-5 shadow-soft card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
