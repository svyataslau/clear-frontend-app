import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { FileUpload } from '../FileUpload';

describe('FileUpload', () => {
  const mockOnFileSelect = vi.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('отображает компонент загрузки файлов', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    expect(
      screen.getByText('Drag and drop a file here or click to select')
    ).toBeInTheDocument();
    expect(screen.getByText('Select File')).toBeInTheDocument();
  });

  it('показывает правильные ограничения по размеру', () => {
    render(
      <FileUpload onFileSelect={mockOnFileSelect} maxSize={10 * 1024 * 1024} />
    );

    expect(screen.getByText('Maximum size: 10MB')).toBeInTheDocument();
  });

  it('показывает поддерживаемые форматы', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} accept=".jpg,.png" />);

    expect(
      screen.getByText('Supported formats: .jpg,.png')
    ).toBeInTheDocument();
  });

  it('обрабатывает выбор файла через input', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: 'Select File' });

    await user.click(input);

    // Simulate file selection
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it('показывает ошибку для слишком большого файла', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} maxSize={1024} />);

    const largeFile = new File(['x'.repeat(2048)], 'large.txt', {
      type: 'text/plain',
    });
    const input = screen.getByRole('button', { name: 'Select File' });

    await user.click(input);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(
        screen.getByText('File is too large. Maximum size: 0MB')
      ).toBeInTheDocument();
    });

    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  it('обрабатывает drag and drop', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const dropZone = screen
      .getByText('Drag and drop a file here or click to select')
      .closest('div');

    if (!dropZone) throw new Error('Drop zone not found');
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it('показывает выбранный файл', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: 'Select File' });

    await user.click(input);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('File Selected')).toBeInTheDocument();
      expect(screen.getByText('test.txt')).toBeInTheDocument();
      expect(screen.getByText('Remove File')).toBeInTheDocument();
    });
  });

  it('удаляет выбранный файл', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: 'Select File' });

    await user.click(input);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('File Selected')).toBeInTheDocument();
    });

    const removeButton = screen.getByText('Remove File');
    await user.click(removeButton);

    await waitFor(() => {
      expect(
        screen.getByText('Drag and drop a file here or click to select')
      ).toBeInTheDocument();
    });
  });
});
