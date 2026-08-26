import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Variáveis NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas. Configure o arquivo .env.local (veja .env.local.example).'
  );
}

// Usa uma URL placeholder válida quando não configurado, apenas para não quebrar
// a criação do client durante o build. As chamadas reais falharão e o app mostra
// um aviso amigável (ver isSupabaseConfigured em app/page.js).
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
