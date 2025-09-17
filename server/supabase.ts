import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase credentials
const supabaseUrl = 'https://qbtwlbdrjfzszkoeirps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidHdsYmRyamZ6c3prb2VpcnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNzk3ODMsImV4cCI6MjA3MzY1NTc4M30.g-Kv-Nlv1moEPNTaipnJ0KkOfxWb2tCN87PfJYKfsSQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin authentication helper
export async function verifyAdmin(token: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Admin verification error:', error);
    return null;
  }
}