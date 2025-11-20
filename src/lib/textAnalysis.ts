export interface CharacterComparison {
  index: number;
  expected: string;
  typed: string;
  isCorrect: boolean;
}

export interface TextError {
  type: 'ortografia' | 'pontuacao' | 'acentuacao' | 'maiuscula' | 'espacamento';
  position: number;
  error: string;
  suggestion: string;
  context: string;
}

export function calculateWPM(text: string, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(reference: string, typed: string): number {
  if (!typed || typed.length === 0) return 0;
  
  const comparisons = compareTexts(reference, typed);
  const correctChars = comparisons.filter(c => c.isCorrect).length;
  const totalChars = comparisons.length;
  
  return totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
}

export function compareTexts(reference: string, typed: string): CharacterComparison[] {
  const maxLength = Math.max(reference.length, typed.length);
  const comparisons: CharacterComparison[] = [];
  
  for (let i = 0; i < maxLength; i++) {
    const expected = reference[i] || '';
    const typedChar = typed[i] || '';
    
    comparisons.push({
      index: i,
      expected,
      typed: typedChar,
      isCorrect: expected === typedChar,
    });
  }
  
  return comparisons;
}

export function detectErrors(reference: string, typed: string): TextError[] {
  const errors: TextError[] = [];
  const refWords = reference.split(/\s+/);
  const typedWords = typed.split(/\s+/);
  
  let refPos = 0;
  let typedPos = 0;
  
  for (let i = 0; i < Math.max(refWords.length, typedWords.length); i++) {
    const refWord = refWords[i] || '';
    const typedWord = typedWords[i] || '';
    
    // Verificar capitalização no início de frases
    if (i === 0 || (refWords[i - 1] && /[.!?]$/.test(refWords[i - 1]))) {
      if (refWord.length > 0 && typedWord.length > 0) {
        if (refWord[0] === refWord[0].toUpperCase() && typedWord[0] !== typedWord[0].toUpperCase()) {
          errors.push({
            type: 'maiuscula',
            position: typedPos,
            error: typedWord,
            suggestion: typedWord.charAt(0).toUpperCase() + typedWord.slice(1),
            context: `Início de frase deve começar com letra maiúscula`,
          });
        }
      }
    }
    
    // Verificar acentuação
    if (refWord !== typedWord && removeAccents(refWord) === removeAccents(typedWord)) {
      errors.push({
        type: 'acentuacao',
        position: typedPos,
        error: typedWord,
        suggestion: refWord,
        context: `Palavra com acentuação incorreta`,
      });
    }
    
    // Verificar pontuação
    const refPunctuation = refWord.match(/[.,!?;:]$/);
    const typedPunctuation = typedWord.match(/[.,!?;:]$/);
    
    if (refPunctuation && !typedPunctuation) {
      errors.push({
        type: 'pontuacao',
        position: typedPos + typedWord.length,
        error: 'falta pontuação',
        suggestion: refPunctuation[0],
        context: `Falta pontuação: "${refPunctuation[0]}"`,
      });
    } else if (!refPunctuation && typedPunctuation) {
      errors.push({
        type: 'pontuacao',
        position: typedPos + typedWord.length - 1,
        error: typedPunctuation[0],
        suggestion: 'remover pontuação',
        context: `Pontuação desnecessária`,
      });
    } else if (refPunctuation && typedPunctuation && refPunctuation[0] !== typedPunctuation[0]) {
      errors.push({
        type: 'pontuacao',
        position: typedPos + typedWord.length - 1,
        error: typedPunctuation[0],
        suggestion: refPunctuation[0],
        context: `Pontuação incorreta`,
      });
    }
    
    // Verificar ortografia (diferença além de acentuação e pontuação)
    const refWordClean = refWord.replace(/[.,!?;:]$/, '');
    const typedWordClean = typedWord.replace(/[.,!?;:]$/, '');
    
    if (refWordClean !== typedWordClean && 
        removeAccents(refWordClean) !== removeAccents(typedWordClean) &&
        typedWordClean.length > 0) {
      errors.push({
        type: 'ortografia',
        position: typedPos,
        error: typedWordClean,
        suggestion: refWordClean,
        context: `Palavra escrita incorretamente`,
      });
    }
    
    typedPos += typedWord.length + 1; // +1 para o espaço
    refPos += refWord.length + 1;
  }
  
  // Verificar espaçamento duplo ou faltante
  const doubleSpaces = typed.match(/  +/g);
  if (doubleSpaces) {
    doubleSpaces.forEach(() => {
      errors.push({
        type: 'espacamento',
        position: typed.indexOf('  '),
        error: 'espaços duplos',
        suggestion: 'usar apenas um espaço',
        context: `Espaçamento incorreto`,
      });
    });
  }
  
  return errors;
}

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function getErrorSummary(errors: TextError[]): Record<string, number> {
  const summary: Record<string, number> = {
    ortografia: 0,
    pontuacao: 0,
    acentuacao: 0,
    maiuscula: 0,
    espacamento: 0,
  };
  
  errors.forEach(error => {
    summary[error.type]++;
  });
  
  return summary;
}
