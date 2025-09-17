import OCRCameraUpload from '../OCRCameraUpload';
import type { OcrResult } from '@shared/schema';

export default function OCRCameraUploadExample() {
  const handleOCRComplete = (result: OcrResult | null) => {
    console.log('OCR Result:', result);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <OCRCameraUpload onOCRComplete={handleOCRComplete} />
    </div>
  );
}