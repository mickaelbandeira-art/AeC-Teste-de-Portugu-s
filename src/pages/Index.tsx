import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import WhyTest from "@/components/WhyTest";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <WhyTest />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
