import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from Vite environment variables (prefixed with VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qbtwlbdrjfzszkoeirps.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidHdsYmRyamZ6c3prb2VpcnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNzk3ODMsImV4cCI6MjA3MzY1NTc4M30.g-Kv-Nlv1moEPNTaipnJ0KkOfxWb2tCN87PfJYKfsSQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin authentication helpers
export async function signInAdmin(email: string, password: string) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return await response.json();
}

export async function signOutAdmin() {
  const response = await fetch('/api/admin/logout', {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Logout failed');
  }
  
  return await response.json();
}

// Helper to get auth headers for API requests
export function getAuthHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}