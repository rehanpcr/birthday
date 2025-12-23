import { createClient } from '@supabase/supabase-js';

// Ganti string kosong di bawah dengan API Key & URL dari Dashboard Supabase kamu
const supabaseUrl = 'https://yskpyvdmityljvwktjzm.supabase.co';
const supabaseAnonKey = 'sb_publishable_NH-y7HAS4W_wp74U8idu1A_4XLyD7I_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);