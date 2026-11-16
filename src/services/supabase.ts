import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agknoyhnnukkzcslnmou.supabase.co';
const supabaseKey = 'sb_publishable_kSpkZ794RVc6Q_gAroMLsQ_b4PimsrZ';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);