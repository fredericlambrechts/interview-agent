import { createClient } from '@supabase/supabase-js';

// Create Supabase client for browser usage
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Database types will be generated from Supabase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any; // TODO: Generate types from Supabase