import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Shield, User, CreditCard } from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (data: { icNumber: string; fullName: string }) => void;
  isSubmitting?: boolean;
  error?: string | null;
  success?: string | null;
}

export default function RegistrationForm({ onSubmit, isSubmitting, error, success }: RegistrationFormProps) {
  const [formData, setFormData] = useState({ icNumber: '', fullName: '' });
  const [validationErrors, setValidationErrors] = useState<{ icNumber?: string; fullName?: string }>({});

  const validateForm = (data: { icNumber: string; fullName: string }) => {
    const errors: { icNumber?: string; fullName?: string } = {};
    
    if (!data.icNumber || data.icNumber.length !== 12 || !/^\d{12}$/.test(data.icNumber)) {
      errors.icNumber = 'IC Number must be exactly 12 digits';
    }
    
    if (!data.fullName || data.fullName.trim().length === 0) {
      errors.fullName = 'Full name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(data.fullName.trim())) {
      errors.fullName = 'Full name must contain only letters and spaces';
    }
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: 'icNumber' | 'fullName', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Large Success Message */}
      {success && (
        <div className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-800 dark:from-green-950 dark:to-emerald-950 p-8 shadow-xl" data-testid="alert-success">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                Registration Successful!
              </h3>
              <p className="text-lg text-green-700 dark:text-green-300">
                {success}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-emerald-100/20 dark:from-green-900/20 dark:to-emerald-900/20"></div>
        </div>
      )}
      
      {/* Large Error Message */}
      {error && (
        <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-800 dark:from-red-950 dark:to-rose-950 p-8 shadow-xl" data-testid="alert-error">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900 p-4">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
                Registration Failed
              </h3>
              <p className="text-lg text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-100/20 to-rose-100/20 dark:from-red-900/20 dark:to-rose-900/20"></div>
        </div>
      )}

      {/* Modern Registration Form */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-card via-card to-card/95">
        <CardHeader className="pb-6 pt-6">
          <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            IC Registration
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm mt-1">Enter your Malaysian Identity Card details</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="icNumber" className="text-base font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  IC Number
                </Label>
                <Input
                  id="icNumber"
                  type="text"
                  placeholder="123456789012"
                  value={formData.icNumber}
                  onChange={(e) => handleInputChange('icNumber', e.target.value)}
                  className={`h-14 text-lg font-mono ${validationErrors.icNumber ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary'}`}
                  maxLength={12}
                  data-testid="input-ic-number"
                />
                {validationErrors.icNumber && (
                  <p className="text-sm text-red-500 mt-2 font-medium" data-testid="error-ic-number">
                    {validationErrors.icNumber}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Enter 12 digits without spaces or dashes
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="AHMAD BIN ALI"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value.toUpperCase())}
                  className={`h-14 text-lg ${validationErrors.fullName ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary'}`}
                  data-testid="input-full-name"
                />
                {validationErrors.fullName && (
                  <p className="text-sm text-red-500 mt-2 font-medium" data-testid="error-full-name">
                    {validationErrors.fullName}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your full name as shown on IC
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
              disabled={isSubmitting}
              data-testid="button-register"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Registering...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  Register Now
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Enhanced Security Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-blue-800 dark:text-blue-200">
              <p className="font-bold text-lg mb-2">Privacy & Security</p>
              <p className="text-base leading-relaxed">
                Your IC number will be securely hashed before storage. 
                The original IC number is never stored in our database.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}