/**
 * Utilidades para chamadas à API do backend
 */

import { getToken } from './auth';

/**
 * Obtém a URL base do backend das variáveis de entorno
 */
export function getBackendUrl(): string {
  return import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000';
}

/**
 * Interface para respostas de erro da API
 */
interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

/**
 * Classe de erro customizada para erros da API
 */
export class ApiException extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

/**
 * Wrapper de fetch com funcionalidades adicionais:
 * - Headers automáticos (Content-Type, Authorization)
 * - Manejo de erros HTTP
 * - Injeção automática do token JWT se existir
 */
export async function fetchAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getBackendUrl()}${endpoint}`;

  // Headers padrão
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Adicionar token JWT se existir
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Se não for OK, lançar erro
    if (!response.ok) {
      let errorMessage = 'Erro na requisição';
      let errorDetail = '';

      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetail = errorData.error || '';
      } catch {
        // Se não conseguir parsear JSON, usar mensagem padrão
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiException(response.status, errorMessage, errorDetail);
    }

    // Retornar resposta parseada
    return await response.json();
  } catch (error) {
    // Se for ApiException, repassar
    if (error instanceof ApiException) {
      throw error;
    }

    // Se for erro de rede, criar ApiException
    throw new ApiException(
      0,
      'Erro de conexão. Verifique sua internet e se o backend está rodando.'
    );
  }
}

/**
 * Interface para resposta de login/registro
 */
export interface AuthResponse {
  access_token: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Interface para dados de perfil do usuário
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  provider?: string;
  createdAt: string;
}

/**
 * Login com email e senha
 */
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<AuthResponse> {
  return fetchAPI<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Registrar novo usuário
 */
export async function registerUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<AuthResponse> {
  return fetchAPI<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, firstName, lastName, password }),
  });
}

/**
 * Obter perfil do usuário autenticado
 */
export async function getProfile(): Promise<UserProfile> {
  return fetchAPI<UserProfile>('/auth/profile', {
    method: 'GET',
  });
}

/**
 * Mapear erros da API para mensagens amigáveis em português
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiException) {
    const { statusCode, message, error: errorType } = error;

    // Erros específicos
    if (statusCode === 401) {
      if (message.toLowerCase().includes('credentials')) {
        return 'Email ou senha incorretos';
      }
      if (message.toLowerCase().includes('provider')) {
        return 'Esta conta usa autenticação via Google ou LinkedIn';
      }
      return 'Não autorizado. Faça login novamente.';
    }

    if (statusCode === 400) {
      if (message.toLowerCase().includes('exists') || message.toLowerCase().includes('already')) {
        return 'Este email já está registrado';
      }
      return message;
    }

    if (statusCode === 404) {
      return 'Recurso não encontrado';
    }

    if (statusCode === 500) {
      return 'Erro no servidor. Tente novamente em alguns instantes.';
    }

    if (statusCode === 0) {
      return message; // Já vem com mensagem de erro de rede
    }

    return message;
  }

  // Erro desconhecido
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
