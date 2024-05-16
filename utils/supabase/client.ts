import { createBrowserClient } from '@supabase/ssr';

export const createClient = <Database = any>() =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
