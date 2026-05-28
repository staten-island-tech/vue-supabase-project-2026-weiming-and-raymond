import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mlitlaovzrkisvnudfgk.supabase.co'
const supabaseKey = 'sb_publishable_pjq3Kym1AleVz8H1GLEBOw_2LAX2VwX'

export const supabase = createClient(
 supabaseUrl,
 supabaseKey
)
