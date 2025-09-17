import { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: { icNumber: string; fullName: string }) => {
    console.log('Registration submitted:', data);
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess(result.message || 'Berjaya didaftar');
        console.log('Registration successful:', result);
      } else {
        setError(result.error || 'Registration failed');
        console.error('Registration failed:', result);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error - please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            IC Registration
          </h1>
          <p className="text-muted-foreground">
            Register your Malaysian Identity Card securely
          </p>
        </div>
        
        <RegistrationForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
          success={success}
        />
      </div>
    </div>
  );
}