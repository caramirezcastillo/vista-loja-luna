import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuração do Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Validação das variáveis de ambiente
if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL não está definida nas variáveis de ambiente');
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY não está definida nas variáveis de ambiente');
}

// Criar cliente Supabase com configurações otimizadas
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'vista-loja-luna@1.0.0'
    }
  }
});

// Log de inicialização (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔌 Cliente Supabase inicializado:', {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_PUBLISHABLE_KEY
  });
}