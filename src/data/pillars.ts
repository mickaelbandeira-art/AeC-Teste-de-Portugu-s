export interface SubPillar {
  id: string;
  label: string;
}

export interface Pillar {
  id: string;
  label: string;
  subPillars: SubPillar[];
}

export const pillars: Pillar[] = [
  {
    id: 'gramatica',
    label: 'Gramática',
    subPillars: [
      { id: 'pontuacao', label: 'Pontuação' },
      { id: 'acentuacao', label: 'Acentuação' },
      { id: 'ortografia', label: 'Ortografia' },
      { id: 'concordancia', label: 'Concordância' },
      { id: 'uso_maiusculas', label: 'Uso de Maiúsculas' },
    ],
  },
  {
    id: 'digitacao',
    label: 'Digitação',
    subPillars: [
      { id: 'velocidade', label: 'Velocidade Baixa' },
      { id: 'precisao', label: 'Precisão Baixa' },
      { id: 'ritmo', label: 'Ritmo Irregular' },
      { id: 'postura', label: 'Postura/Ergonomia' },
    ],
  },
  {
    id: 'conteudo',
    label: 'Conteúdo',
    subPillars: [
      { id: 'clareza', label: 'Falta de Clareza' },
      { id: 'coesao', label: 'Falta de Coesão' },
      { id: 'vocabulario', label: 'Vocabulário Limitado' },
      { id: 'fuga_tema', label: 'Fuga do Tema' },
    ],
  },
  {
    id: 'atencao',
    label: 'Atenção',
    subPillars: [
      { id: 'omissao_palavras', label: 'Omissão de Palavras' },
      { id: 'troca_palavras', label: 'Troca de Palavras' },
      { id: 'repeticao', label: 'Repetição Desnecessária' },
    ],
  },
];
