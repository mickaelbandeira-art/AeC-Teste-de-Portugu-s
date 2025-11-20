import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Keyboard, TrendingUp, Award } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleStartTest = () => {
    navigate('/teste');
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-gradient-to-r from-cobalto/85 to-noite/75 z-0"></div>
      
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-ceu rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 border-4 border-amarelo transform rotate-45"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-verde rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-rosa rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Teste de Digitação e Português AeC
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 font-myriad">
              Avalie sua velocidade, precisão e domínio da língua portuguesa em minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={handleStartTest}
                className="text-lg px-8 py-6"
              >
                <Keyboard className="mr-2" />
                Começar Teste
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">5min</div>
                <div className="text-sm text-primary-foreground/80">Duração média</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm text-primary-foreground/80">Precisão</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">+1000</div>
                <div className="text-sm text-primary-foreground/80">Testes realizados</div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative animate-fade-in hidden md:block">
            <div className="relative">
              {/* Main Circle */}
              <div className="w-96 h-96 bg-gradient-to-br from-ceu/20 to-verde/20 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm border-2 border-primary-foreground/20">
                <div className="text-center">
                  <TrendingUp className="w-32 h-32 text-amarelo mx-auto mb-4" />
                  <div className="text-primary-foreground/90 font-bold text-xl">Melhore suas habilidades</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-rosa rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Award className="w-10 h-10 text-primary-foreground" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-amarelo rounded-lg flex items-center justify-center shadow-lg transform rotate-12">
                <Keyboard className="w-8 h-8 text-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
