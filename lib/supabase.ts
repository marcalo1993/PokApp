import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Forzamos el tipo con 'as any' o aseguramos la instancia para que TypeScript no lance errores de null
export const supabase = createClient(supabaseUrl, supabaseAnonKey);