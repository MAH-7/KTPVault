import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import type { IcUser } from '@shared/schema';
import { signInAdmin, signOutAdmin, getAuthHeaders } from '@/lib/supabase';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    console.log('Admin login attempt:', email);
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const result = await signInAdmin(email, password);
      
      if (result.access_token) {
        setAuthToken(result.access_token);
        localStorage.setItem('admin_token', result.access_token);
        setIsAuthenticated(true);
        console.log('Admin login successful');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setLoginError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('Admin logout');
    try {
      await signOutAdmin();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      setAuthToken(null);
      setIsAuthenticated(false);
      setLoginError(null);
    }
  };

  const handleExportCSV = async () => {
    console.log('Exporting CSV');
    try {
      const response = await fetch('/api/admin/export-csv', {
        headers: getAuthHeaders(authToken || ''),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ic-registrations.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('CSV export failed');
        alert('Failed to export CSV');
      }
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export CSV');
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onLogin={handleLogin}
        isLoading={isLoading}
        error={loginError}
      />
    );
  }

  return (
    <AdminDashboard 
      authToken={authToken}
      onExportCSV={handleExportCSV}
      onLogout={handleLogout}
    />
  );
}