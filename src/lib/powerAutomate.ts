import { z } from 'zod';

export interface TestResult {
  nome: string;
  email: string;
  matricula: string;
  tipo_teste: 'texto' | 'audio';
  velocidade_wpm: number;
  precisao_percentual: number;
  tempo_total_segundos: number;
  erros_total: number;
  erros_detalhados: string;
  texto_referencia: string;
  texto_digitado: string;
  data_teste: string;
}

const testResultSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  matricula: z.string().trim().regex(/^\d{4,10}$/, 'Matrícula deve conter apenas números (4-10 dígitos)'),
  tipo_teste: z.enum(['texto', 'audio']),
  velocidade_wpm: z.number().min(0).max(500),
  precisao_percentual: z.number().min(0).max(100),
  tempo_total_segundos: z.number().min(0),
  erros_total: z.number().min(0),
  erros_detalhados: z.string().max(10000),
  texto_referencia: z.string().max(5000),
  texto_digitado: z.string().max(5000),
  data_teste: z.string(),
});

export async function sendResultsToSharePoint(
  result: TestResult
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // Validar dados antes de enviar
    const validatedResult = testResultSchema.parse(result);
    
    // Sanitizar strings para evitar injeção
    const sanitizedResult = {
      ...validatedResult,
      nome: sanitizeString(validatedResult.nome),
      email: sanitizeString(validatedResult.email),
      matricula: validatedResult.matricula.replace(/\D/g, ''), // Remove não-dígitos
      texto_digitado: sanitizeString(validatedResult.texto_digitado),
      texto_referencia: sanitizeString(validatedResult.texto_referencia),
    };
    
    // URL do Power Automate Flow (deve ser configurada em ambiente)
    const flowUrl = import.meta.env.VITE_POWER_AUTOMATE_FLOW_URL;
    
    if (!flowUrl) {
      console.warn('VITE_POWER_AUTOMATE_FLOW_URL não configurada. Resultados não serão enviados ao SharePoint.');
      return {
        success: false,
        message: 'Configuração do Power Automate não encontrada',
        error: 'FLOW_URL_NOT_CONFIGURED',
      };
    }
    
    // Enviar para Power Automate
    const response = await fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedResult),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao enviar para SharePoint:', errorText);
      return {
        success: false,
        message: 'Erro ao enviar resultados para o SharePoint',
        error: errorText,
      };
    }
    
    return {
      success: true,
      message: 'Resultados enviados com sucesso para o SharePoint!',
    };
  } catch (error) {
    console.error('Erro na integração com SharePoint:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Dados inválidos: ' + error.errors.map(e => e.message).join(', '),
        error: 'VALIDATION_ERROR',
      };
    }
    
    return {
      success: false,
      message: 'Erro ao processar resultados',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

function sanitizeString(str: string): string {
  // Remove caracteres potencialmente perigosos
  return str
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Função auxiliar para validar email antes de enviar
export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

// Função auxiliar para validar nome
export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}
