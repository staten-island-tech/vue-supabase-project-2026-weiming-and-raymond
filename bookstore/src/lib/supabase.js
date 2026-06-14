import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_Supabase_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_Supabase_Key

let supabase = null

if (!supabaseUrl) {
  console.warn('Supabase URL not provided. Supabase client not initialized.')
} else {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export { supabase }
