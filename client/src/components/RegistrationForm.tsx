import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Edit3 } from 'lucide-react';
import type { OcrResult, ManualInput } from '@shared/schema';
import OCRCameraUpload from './OCRCameraUpload';

interface RegistrationFormProps {
  onSubmit: (data: { icNumber: string; fullName: string }) => void;
  isSubmitting?: boolean;
  error?: string | null;
  success?: string | null;
}

export default function RegistrationForm({ onSubmit, isSubmitting, error, success }: RegistrationFormProps) {
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [manualData, setManualData] = useState({ icNumber: '', fullName: '' });
  const [useManual, setUseManual] = useState(false);
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
    
    const formData = useManual || !ocrResult ? manualData : {
      icNumber: ocrResult.icNumber,
      fullName: ocrResult.fullName
    };
    
    const errors = validateForm(formData);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleOCRComplete = (result: OcrResult | null) => {
    setOcrResult(result);
    if (result) {
      // Pre-populate manual form with OCR results
      setManualData({
        icNumber: result.icNumber,
        fullName: result.fullName
      });
      setValidationErrors({});
    }
  };

  const handleManualInputChange = (field: 'icNumber' | 'fullName', value: string) => {
    setManualData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" data-testid="alert-success">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            ✅ {success}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" data-testid="alert-error">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            ❌ {error}
          </AlertDescription>
        </Alert>
      )}

      {/* OCR Camera Upload */}
      {!useManual && (
        <OCRCameraUpload 
          onOCRComplete={handleOCRComplete} 
          disabled={isSubmitting}
        />
      )}
      
      {/* OCR Results Display */}
      {ocrResult && !useManual && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-green-700 dark:text-green-300" data-testid="text-ocr-results">
                  ✅ OCR Results Detected
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setUseManual(true)}
                  data-testid="button-edit-ocr"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">IC Number</Label>
                  <div className="mt-1 p-2 bg-muted rounded-md font-mono" data-testid="text-ocr-ic">
                    {ocrResult.icNumber}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <div className="mt-1 p-2 bg-muted rounded-md" data-testid="text-ocr-name">
                    {ocrResult.fullName}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Separator />
      
      {/* Manual Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Manual Input
            {!useManual && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setUseManual(true)}
                data-testid="button-use-manual"
              >
                Use Manual Input
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icNumber" className="text-sm font-medium">
                  IC Number
                </Label>
                <Input
                  id="icNumber"
                  type="text"
                  placeholder="123456789012"
                  value={manualData.icNumber}
                  onChange={(e) => handleManualInputChange('icNumber', e.target.value)}
                  className={validationErrors.icNumber ? 'border-red-500' : ''}
                  maxLength={12}
                  data-testid="input-ic-number"
                />
                {validationErrors.icNumber && (
                  <p className="text-sm text-red-500 mt-1" data-testid="error-ic-number">
                    {validationErrors.icNumber}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Enter 12 digits without spaces or dashes
                </p>
              </div>
              
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="AHMAD BIN ALI"
                  value={manualData.fullName}
                  onChange={(e) => handleManualInputChange('fullName', e.target.value.toUpperCase())}
                  className={validationErrors.fullName ? 'border-red-500' : ''}
                  data-testid="input-full-name"
                />
                {validationErrors.fullName && (
                  <p className="text-sm text-red-500 mt-1" data-testid="error-full-name">
                    {validationErrors.fullName}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your full name as shown on IC
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || (!useManual && !ocrResult && !manualData.icNumber)}
              data-testid="button-register"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Security Notice */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 dark:text-blue-400">
              🔒
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Privacy & Security</p>
              <p>
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