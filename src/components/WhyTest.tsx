import { Zap, BookOpen, FileCheck, Database } from "lucide-react";

const WhyTest = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Melhore sua digitação",
      description: "Aumente sua velocidade e precisão na digitação com feedback em tempo real",
      gradient: "from-ceu to-primary",
    },
    {
      icon: BookOpen,
      title: "Aprimore seu português",
      description: "Desenvolva seu domínio da língua portuguesa através de exercícios práticos",
      gradient: "from-verde to-ceu",
    },
    {
      icon: FileCheck,
      title: "Relatórios automáticos",
      description: "Receba análises detalhadas do seu desempenho instantaneamente",
      gradient: "from-rosa to-verde",
    },
    {
      icon: Database,
      title: "Integração SharePoint",
      description: "Seus resultados são salvos automaticamente no Microsoft SharePoint",
      gradient: "from-amarelo to-rosa",
    },
  ];

  return (
    <section id="instrucoes" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Por que fazer o teste?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-myriad">
            Desenvolva habilidades essenciais para o mercado de trabalho moderno
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 hover-lift shadow-md border border-border animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon with gradient background */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 mx-auto`}>
                <benefit.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2 text-center text-foreground">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground text-center font-myriad leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTest;
