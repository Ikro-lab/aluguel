import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Nunca importe este arquivo em um componente 'use client' — a service role
// key ignora todas as regras de RLS. Só use em Route Handlers (app/api/**).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
