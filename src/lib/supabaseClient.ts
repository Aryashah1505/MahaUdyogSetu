import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iiqdnregrpeocsghmrtv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LYopuHWIc3vRNbxzVj82kA_vhEUxYGk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
