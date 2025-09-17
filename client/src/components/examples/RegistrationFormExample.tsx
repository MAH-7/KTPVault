import { useState } from 'react';
import RegistrationForm from '../RegistrationForm';

export default function RegistrationFormExample() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: { icNumber: string; fullName: string }) => {
    console.log('Registration submitted:', data);
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    // Simulate API call
    setTimeout(() => {
      if (data.icNumber === '123456789012') {
        setError('IC telah didaftar');
      } else {
        setSuccess('Berjaya didaftar');
      }
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">IC Registration System</h1>
          <p className="text-muted-foreground">Register your Malaysian Identity Card securely</p>
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