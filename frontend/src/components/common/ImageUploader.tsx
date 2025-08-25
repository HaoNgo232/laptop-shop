import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  initialUrl?: string;
}

export const ImageUploader = ({ onFileSelect, initialUrl }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | undefined>(initialUrl);

  useEffect(() => {
    setPreview(initialUrl);
  }, [initialUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Tải ảnh</Label>
      <Input id="image" type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <div className="mt-2 border rounded-md overflow-hidden">
          <img src={preview} alt="Preview" className="h-40 w-full object-cover" />
        </div>
      )}
    </div>
  );
};
