import { FileText, Keyboard, BarChart3 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: "Escolha seu teste",
      description: "Selecione entre teste de texto ou áudio para avaliar suas habilidades",
      color: "bg-ceu",
    },
    {
      icon: Keyboard,
      title: "Digite com atenção",
      description: "Reproduza o conteúdo com precisão enquanto medimos sua velocidade",
      color: "bg-verde",
    },
    {
      icon: BarChart3,
      title: "Receba seu resultado",
      description: "Obtenha feedback instantâneo e relatório completo das suas habilidades",
      color: "bg-rosa",
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-myriad">
            Nosso teste é simples, rápido e eficiente. Em apenas 3 passos você avalia suas habilidades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group hover-lift bg-card rounded-xl p-8 shadow-md border border-border animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                {index + 1}
              </div>

              {/* Icon */}
              <div className={`${step.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto`}>
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-center text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-center font-myriad">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
