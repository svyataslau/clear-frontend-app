import { useState } from 'react';
import { CreatePostForm } from '../components/CreatePostForm';
import { Typography, Card } from '@clear/ui';

export function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="main-content">
      <header className="page-header">
        <Typography variant="h1" weight="bold" className="page-title">
          Create Post
        </Typography>
        <Typography variant="body" color="gray" className="page-description">
          Upload files and create a new post
        </Typography>
      </header>

      <div className="grid-layout">
        <div>
          <CreatePostForm />
        </div>

        <div className="sticky-sidebar">
          {uploadedFiles.length > 0 && (
            <Card variant="default" padding="lg" style={{ marginTop: '2rem' }}>
              <Typography variant="h2" weight="bold" style={{ marginBottom: '1rem' }}>
                Uploaded Files
              </Typography>
              <div className="file-list">
                {uploadedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="file-item">
                    <div className="file-info">
                      <svg
                        style={{ width: '2rem', height: '2rem', color: '#3b82f6' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-label="File icon"
                      >
                        <title>File icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="file-details">
                        <Typography variant="body" weight="medium" className="file-name">
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="gray" className="file-size">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="delete-button"
                    >
                      <svg
                        style={{ width: '1.25rem', height: '1.25rem' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-label="Delete icon"
                      >
                        <title>Delete icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
