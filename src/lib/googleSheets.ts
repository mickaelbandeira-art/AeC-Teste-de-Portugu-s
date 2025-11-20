import { z } from 'zod';

// URL da API do Google Apps Script
const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbwGg_LBsyqKIE__8k_IS2-jHFytVA7B2BbipV85SAbd/exec';

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

export interface UserCheckResponse {
  exists: boolean;
  message: string;
  lastTestDate?: string;
}

// Schema de validação
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

// Função para sanitizar strings
function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Verifica se o usuário já realizou o teste
 * @param email - Email do usuário
 * @param matricula - Matrícula do usuário
 * @returns Promise com informação se o usuário já fez o teste
 */
export async function checkIfUserTested(
  email: string,
  matricula: string
): Promise<UserCheckResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const url = `${GOOGLE_SHEETS_API_URL}?action=check&email=${encodeURIComponent(email)}&matricula=${encodeURIComponent(matricula)}`;

    const response = await fetch(url, {
      method: 'GET',
      // Não enviar headers personalizados para evitar preflight CORS
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro ao verificar usuário: ${response.status}`);
    }

    const data = await response.json();
    return data as UserCheckResponse;
  } catch (error) {
    console.error('Erro ao verificar se usuário já fez o teste:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Tempo limite excedido ao verificar cadastro. Tente novamente.');
    }
    
    throw new Error('Erro ao verificar cadastro. Verifique sua conexão.');
  }
}

/**
 * Envia os resultados do teste para o Google Sheets
 * @param result - Dados do resultado do teste
 * @returns Promise com status de sucesso
 */
export async function sendResultsToGoogleSheets(
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
      matricula: validatedResult.matricula.replace(/\D/g, ''),
      texto_digitado: sanitizeString(validatedResult.texto_digitado),
      texto_referencia: sanitizeString(validatedResult.texto_referencia),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit',
        data: sanitizedResult,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao enviar para Google Sheets:', errorText);
      return {
        success: false,
        message: 'Erro ao enviar resultados para o Google Sheets',
        error: errorText,
      };
    }

    const responseData = await response.json();
    
    return {
      success: responseData.success !== false,
      message: responseData.message || 'Resultados enviados com sucesso!',
    };
  } catch (error) {
    console.error('Erro na integração com Google Sheets:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Dados inválidos: ' + error.errors.map(e => e.message).join(', '),
        error: 'VALIDATION_ERROR',
      };
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Tempo limite excedido ao enviar resultados. Tente novamente.',
        error: 'TIMEOUT',
      };
    }
    
    return {
      success: false,
      message: 'Erro ao processar resultados',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

// Função auxiliar para validar email
export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

// Função auxiliar para validar nome
export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}
