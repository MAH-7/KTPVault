import { useState } from 'react';
import AdminLogin from '../AdminLogin';

export default function AdminLoginExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt:', email);
    setIsLoading(true);
    setError(null);
    
    // Simulate authentication
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'password') {
        console.log('Login successful');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AdminLogin 
      onLogin={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
}