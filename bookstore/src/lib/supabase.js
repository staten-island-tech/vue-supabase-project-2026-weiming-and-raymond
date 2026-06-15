import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_Supabase_URL
const supabaseKey = import.meta.env.VITE_Supabase_Key

export const supabase = createClient(supabaseUrl, supabaseKey)
