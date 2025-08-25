import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, ExternalLink } from 'lucide-react';
import { apiClient } from '@/services/api';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (imageUrl: string) => void;
  onError?: (error: string) => void;
  className?: string;
  required?: boolean;
}

interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  onError,
  className = '',
  required = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const [urlInput, setUrlInput] = useState<string>(value || '');
  const [useLocalUpload, setUseLocalUpload] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Vui lòng chọn file hình ảnh hợp lệ');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('Kích thước file không được vượt quá 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Get token from localStorage and base URL
      const token = localStorage.getItem('accessToken');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseURL}/admin/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data: UploadResponse = await response.json();
      const imageUrl = data.url;
      setPreviewUrl(imageUrl);
      setUrlInput(imageUrl);
      setUseLocalUpload(true);
      onChange(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Lỗi không xác định khi tải lên hình ảnh');
    } finally {
      setIsUploading(false);
    }
  }, [onChange, onError]);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  // Handle URL input change
  const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setUrlInput(url);
    if (url && url !== value) {
      setPreviewUrl(url);
      setUseLocalUpload(false);
      onChange(url);
    }
  }, [onChange, value]);

  // Handle clear image
  const handleClear = useCallback(() => {
    setPreviewUrl('');
    setUrlInput('');
    setUseLocalUpload(false);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  // Handle drag and drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <Label htmlFor="image-upload">
        {label} {required && '*'}
      </Label>

      {/* Upload Methods Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={!useLocalUpload ? "default" : "outline"}
          size="sm"
          onClick={() => setUseLocalUpload(false)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          URL
        </Button>
        <Button
          type="button"
          variant={useLocalUpload ? "default" : "outline"}
          size="sm"
          onClick={() => setUseLocalUpload(true)}
        >
          <Upload className="w-4 h-4 mr-2" />
          Tải lên
        </Button>
      </div>

      {/* URL Input */}
      {!useLocalUpload && (
        <div className="space-y-2">
          <Input
            id="image-url"
            type="url"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            disabled={isUploading}
          />
        </div>
      )}

      {/* File Upload */}
      {useLocalUpload && (
        <div className="space-y-2">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isUploading ? 'Đang tải lên...' : 'Kéo thả hoặc click để chọn hình ảnh'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa 5MB)
              </p>
            </label>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Preview:</Label>
          <div className="relative border rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
              onLoad={(e) => {
                e.currentTarget.style.display = 'block';
                e.currentTarget.nextElementSibling?.classList.add('hidden');
              }}
            />
            <div className="hidden p-4 text-center text-gray-500 bg-gray-50">
              <p className="text-sm">Không thể tải hình ảnh</p>
              <p className="text-xs">Vui lòng kiểm tra URL hoặc tải lên file khác</p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};