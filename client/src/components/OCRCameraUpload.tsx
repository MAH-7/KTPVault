import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import type { OcrResult } from '@shared/schema';

interface OCRCameraUploadProps {
  onOCRComplete: (result: OcrResult | null) => void;
  disabled?: boolean;
}

export default function OCRCameraUpload({ onOCRComplete, disabled }: OCRCameraUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text;
      console.log('OCR Text:', text);

      // Extract IC number (12 digits pattern)
      const icMatch = text.match(/\b\d{6}-\d{2}-\d{4}\b|\b\d{12}\b/);
      const icNumber = icMatch ? icMatch[0].replace(/-/g, '') : '';

      // Extract name (look for patterns after common keywords)
      const namePatterns = [
        /(?:NAMA|NAME|NOM)\s*:?\s*([A-Z][A-Z\s]{2,50})/i,
        /^([A-Z][A-Z\s]{2,50})$/m,
      ];
      
      let fullName = '';
      for (const pattern of namePatterns) {
        const nameMatch = text.match(pattern);
        if (nameMatch && nameMatch[1]) {
          fullName = nameMatch[1].trim();
          break;
        }
      }

      if (icNumber.length === 12 && fullName) {
        onOCRComplete({
          icNumber,
          fullName: fullName.toUpperCase(),
        });
      } else {
        setError('Could not extract IC number or name clearly. Please try again or use manual input.');
        onOCRComplete(null);
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to process image. Please try again or use manual input.');
      onOCRComplete(null);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid="text-ocr-title">
          <Camera className="h-5 w-5" />
          Scan IC with Camera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {preview && (
          <div className="relative">
            <img 
              src={preview} 
              alt="IC Preview" 
              className="w-full max-h-64 object-contain rounded-md border"
              data-testid="img-ic-preview"
            />
          </div>
        )}
        
        {isProcessing && (
          <div className="space-y-2" data-testid="div-processing-status">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing image...
            </div>
            <Progress value={progress} className="w-full" data-testid="progress-ocr" />
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" data-testid="alert-ocr-error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={triggerCameraCapture}
            disabled={disabled || isProcessing}
            className="flex-1"
            data-testid="button-capture-camera"
          >
            <Camera className="h-4 w-4 mr-2" />
            Capture with Camera
          </Button>
          
          <Button 
            onClick={triggerFileUpload}
            disabled={disabled || isProcessing}
            variant="outline"
            className="flex-1"
            data-testid="button-upload-file"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <p className="text-xs text-muted-foreground text-center">
          Take a clear photo of your IC. Ensure good lighting and the text is readable.
        </p>
      </CardContent>
    </Card>
  );
}