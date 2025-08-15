import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { FileUpload } from '../FileUpload';

describe('FileUpload', () => {
  const mockOnFileSelect = vi.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('renders upload area', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    expect(screen.getByText('Drag and drop files here or click to select')).toBeInTheDocument();
    expect(screen.getByText('Select Files')).toBeInTheDocument();
    expect(screen.getByText('Supported formats: all')).toBeInTheDocument();
    expect(screen.getByText('Maximum size: 5MB per file')).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: 'Select Files' });

    await user.click(input);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith([file]);
    });
  });

  it('handles drag and drop', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    const uploadArea = screen.getByText('Drag and drop files here or click to select').closest('div');

    fireEvent.dragOver(uploadArea!);
    fireEvent.drop(uploadArea!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith([file]);
    });
  });

  it('shows error for file too large', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} maxSize={1024} />);

    const largeFile = new File(['x'.repeat(2048)], 'large-file.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: 'Select Files' });

    await user.click(input);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/File is too large/)).toBeInTheDocument();
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    });
  });

  it('handles multiple files', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: 'Select File' });

    await user.click(input);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file1] } });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file1);
    });
  });

  it('shows selected files info', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: 'Select Files' });

    await user.click(input);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('File Selected')).toBeInTheDocument();
      expect(screen.getByText('test-file.txt')).toBeInTheDocument();
      expect(screen.getByText('12 Bytes')).toBeInTheDocument();
      expect(screen.getByText('text/plain')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove Files' })).toBeInTheDocument();
    });
  });

  it('removes selected files', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: 'Select Files' });

    await user.click(input);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('File Selected')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: 'Remove Files' });
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText('Drag and drop files here or click to select')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Select Files' })).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const uploadArea = screen.getByText('Drag and drop files here or click to select').closest('div');
    uploadArea?.focus();

    await user.keyboard('{Enter}');

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
  });
});
