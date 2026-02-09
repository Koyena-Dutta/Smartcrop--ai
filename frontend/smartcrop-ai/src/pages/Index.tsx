import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CropRecommendation } from "@/components/CropRecommendation";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />
        <CropRecommendation />
        <About />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
