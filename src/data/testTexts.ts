export interface TestText {
  id: number;
  category: 'facil' | 'medio' | 'dificil';
  text: string;
  audioUrl?: string;
}

export const testTexts: TestText[] = [
  // Textos Fáceis
  {
    id: 1,
    category: 'facil',
    text: 'O Brasil é um país de dimensões continentais. A tecnologia transformou a forma como trabalhamos. É importante desenvolver habilidades de digitação. A prática constante traz bons resultados.',
    audioUrl: '/audio/facil-1.mp3',
  },
  {
    id: 2,
    category: 'facil',
    text: 'A comunicação é essencial no ambiente de trabalho. Escrever bem demonstra profissionalismo. Cada palavra conta na hora de passar uma mensagem. A clareza é fundamental para o sucesso.',
    audioUrl: '/audio/facil-2.mp3',
  },
  {
    id: 3,
    category: 'facil',
    text: 'O computador facilita muito nosso dia a dia. Saber digitar rápido economiza tempo. Todos podem melhorar com dedicação. A tecnologia está presente em tudo.',
    audioUrl: '/audio/facil-3.mp3',
  },
  
  // Textos Moderados
  {
    id: 4,
    category: 'medio',
    text: 'A transformação digital revolucionou o mercado de trabalho, exigindo profissionais cada vez mais qualificados. As empresas buscam colaboradores com excelente domínio da língua portuguesa e agilidade na digitação. A comunicação escrita precisa ser clara, objetiva e sem erros ortográficos. Investir no desenvolvimento dessas competências é essencial para o sucesso profissional.',
    audioUrl: '/audio/medio-1.mp3',
  },
  {
    id: 5,
    category: 'medio',
    text: 'A gestão eficiente de projetos requer planejamento, organização e comunicação assertiva. Os relatórios devem ser elaborados com precisão, utilizando a norma culta da língua portuguesa. A atenção aos detalhes, como pontuação e acentuação, demonstra profissionalismo. Dominar essas habilidades contribui significativamente para o crescimento na carreira.',
    audioUrl: '/audio/medio-2.mp3',
  },
  {
    id: 6,
    category: 'medio',
    text: 'O ambiente corporativo contemporâneo valoriza profissionais que dominam ferramentas tecnológicas e possuem excelente redação. A capacidade de expressar ideias com clareza e correção gramatical diferencia candidatos em processos seletivos. Desenvolver essas competências requer dedicação, estudo e prática contínua.',
    audioUrl: '/audio/medio-3.mp3',
  },
  
  // Textos Difíceis
  {
    id: 7,
    category: 'dificil',
    text: 'As políticas macroeconômicas influenciam diretamente o desenvolvimento socioeconômico das nações. A implementação de estratégias sustentáveis requer análise criteriosa dos cenários político-administrativos. É imprescindível que os profissionais desenvolvam competências técnicas e comportamentais alinhadas às exigências contemporâneas. A excelência na comunicação escrita diferencia profissionais no mercado globalizado.',
    audioUrl: '/audio/dificil-1.mp3',
  },
  {
    id: 8,
    category: 'dificil',
    text: 'A governança corporativa estabelece diretrizes para a administração transparente e ética das organizações. Os stakeholders demandam relatórios financeiros elaborados com rigor técnico e conformidade regulatória. A redação empresarial deve primar pela objetividade, coesão e correção gramatical. Profissionais que dominam essas competências destacam-se pela capacidade de agregar valor estratégico às corporações multinacionais.',
    audioUrl: '/audio/dificil-2.mp3',
  },
  {
    id: 9,
    category: 'dificil',
    text: 'A conjuntura geopolítica contemporânea demanda profissionais com visão sistêmica e capacidade analítica apurada. As organizações internacionais buscam colaboradores cujas competências linguísticas e técnicas estejam alinhadas aos padrões internacionais de excelência. O domínio da norma culta, aliado à precisão terminológica, constitui diferencial competitivo no mercado de trabalho globalizado e altamente especializado.',
    audioUrl: '/audio/dificil-3.mp3',
  },
];

export function getRandomText(category?: 'facil' | 'medio' | 'dificil'): TestText {
  const filteredTexts = category 
    ? testTexts.filter(t => t.category === category)
    : testTexts;
  
  const randomIndex = Math.floor(Math.random() * filteredTexts.length);
  return filteredTexts[randomIndex];
}

export function getTextById(id: number): TestText | undefined {
  return testTexts.find(t => t.id === id);
}
