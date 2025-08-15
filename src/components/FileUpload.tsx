import { useState, useRef, useCallback } from 'react';
import { Card, Button, Typography } from '@clear/ui';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSize?: number; // в байтах
}

export function FileUpload({
  onFileSelect,
  accept = '*',
  maxSize = 5 * 1024 * 1024,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File is too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`;
      }
      return null;
    },
    [maxSize]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        role="button"
        tabIndex={0}
        className={`upload-area ${isDragOver ? 'drag-over' : selectedFile ? 'file-selected' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <div>
            <svg
              style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#9ca3af' }}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              role="img"
              aria-label="Upload icon"
            >
              <title>Upload icon</title>
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Typography variant="h4" weight="medium" style={{ marginBottom: '0.5rem' }}>
              Drag and drop a file here or click to select
            </Typography>
            <Typography variant="body" color="gray" style={{ marginBottom: '1rem' }}>
              Supported formats: {accept === '*' ? 'all' : accept}
            </Typography>
            <Typography variant="body" color="gray" style={{ marginBottom: '1rem' }}>
              Maximum size: {Math.round(maxSize / 1024 / 1024)}MB
            </Typography>
            <Button variant="primary" size="md" onClick={handleClick}>
              Select File
            </Button>
          </div>
        ) : (
          <div>
            <svg
              style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#22c55e' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Success icon"
            >
              <title>Success icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <Typography variant="h4" weight="medium" style={{ marginBottom: '0.5rem' }}>
              File Selected
            </Typography>
            <Card variant="default" padding="md" style={{ marginBottom: '1rem' }}>
              <Typography variant="body" color="gray">
                <span style={{ fontWeight: '500' }}>Name:</span> {selectedFile.name}
              </Typography>
              <Typography variant="body" color="gray">
                <span style={{ fontWeight: '500' }}>Size:</span>{' '}
                {formatFileSize(selectedFile.size)}
              </Typography>
              <Typography variant="body" color="gray">
                <span style={{ fontWeight: '500' }}>Type:</span>{' '}
                {selectedFile.type || 'Unknown'}
              </Typography>
            </Card>
            <Button variant="primary" size="md" onClick={removeFile}>
              Remove File
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Card variant="default" padding="md" style={{ marginTop: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <Typography variant="body" style={{ color: '#dc2626' }}>
            {error}
          </Typography>
        </Card>
      )}
    </div>
  );
}
