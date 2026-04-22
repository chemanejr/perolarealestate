import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ajdczkcgpicbfaarxwvi.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Lu0hjoAaTeNpLg0fN3pFPw_KRAglh-G'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
