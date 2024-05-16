import { createBrowserClient } from '@supabase/ssr';

export const createClient = <Database = never>() =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
