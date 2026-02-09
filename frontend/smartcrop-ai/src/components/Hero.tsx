import { ArrowRight, Leaf, TrendingUp, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const scrollToRecommendation = () => {
    document.getElementById("crop-recommendation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-lime/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-lime-light border border-lime/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Agriculture</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">AI-Powered Crop Recommendations</span>
            <br />
            <span className="text-gradient">Based on Soil Health & Market Demand</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Make smarter farming decisions with our intelligent crop recommendation system. 
            Analyze soil conditions, weather patterns, and real-time market data to maximize your profits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button 
              onClick={scrollToRecommendation}
              className="btn-accent text-lg px-8 py-6 w-full sm:w-auto group"
            >
              Get Crop Recommendation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            {/* <Button 
              variant="outline" 
              className="text-lg px-8 py-6 w-full sm:w-auto border-2 hover:bg-secondary"
            >
              Learn More
            </Button> */}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: Leaf, text: "Soil Analysis" },
              { icon: Cloud, text: "Weather Data" },
              { icon: TrendingUp, text: "Market Trends" },
            ].map((feature, index) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-3 shadow-soft"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
