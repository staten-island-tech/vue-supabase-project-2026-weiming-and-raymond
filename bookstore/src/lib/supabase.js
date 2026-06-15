import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_Supabase_URL ||
  import.meta.env.SUPABASE_URL ||
  import.meta.env.Supabase_URL

const supabaseKey =
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.VITE_Supabase_Key ||
  import.meta.env.SUPABASE_KEY ||
  import.meta.env.Supabase_Key

let supabase = null

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Supabase client not initialized. Missing environment variables.\n' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY (Netlify: Site settings → Build & deploy → Environment).',
  )
} else {
  supabase = createClient(supabaseUrl, supabaseKey)
}

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set and redeploy.',
    )
  }

  return supabase
}

export { supabase, requireSupabase }
