import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();
  
  const handleStartTest = () => {
    navigate('/teste');
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Geometric Pattern Background */}
      <div className="absolute inset-0 gradient-cta opacity-90"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
      }}></div>

      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white/30 transform rotate-45"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rounded-lg transform -rotate-12"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <div className="mb-6">
            <Rocket className="w-20 h-20 mx-auto text-foreground mb-4" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Pronto para testar suas habilidades?
          </h2>
          
          <p className="text-lg md:text-xl mb-8 text-foreground/90 font-myriad max-w-2xl mx-auto">
            Descubra seu potencial e receba feedback instantâneo sobre suas habilidades de digitação e português.
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              "Teste rápido de 5 minutos",
              "Resultados instantâneos",
              "Certificado digital",
              "Salvamento automático"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-foreground/90">
                <CheckCircle className="w-5 h-5" />
                <span className="font-myriad">{feature}</span>
              </div>
            ))}
          </div>

          <Button 
            variant="default"
            size="lg"
            onClick={handleStartTest}
            className="text-lg px-12 py-7 bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <Rocket className="mr-2" />
            Iniciar Agora
          </Button>

          <p className="mt-6 text-sm text-foreground/70 font-myriad">
            Nenhum cadastro necessário • Totalmente gratuito
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
