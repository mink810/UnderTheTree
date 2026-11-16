import { supabase } from '@/services/supabase';

export async function testConnection() {
  const { data, error } = await supabase
    .from('test_connection')
    .select('*');

  console.log('DATA:', data);
  console.log('ERROR:', error);
}