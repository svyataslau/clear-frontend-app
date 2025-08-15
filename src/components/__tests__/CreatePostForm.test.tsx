import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreatePostForm } from '../CreatePostForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe('CreatePostForm', () => {
  it('отображает форму с полями', () => {
    renderWithQueryClient(<CreatePostForm />);

    expect(screen.getByText('Create New Post')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Author')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Post' })
    ).toBeInTheDocument();
  });

  it('показывает ошибки валидации для пустых полей', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<CreatePostForm />);

    const submitButton = screen.getByRole('button', { name: 'Create Post' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Content is required')).toBeInTheDocument();
      expect(screen.getByText('Author name is required')).toBeInTheDocument();
    });
  });

  it('показывает ошибку для слишком длинного заголовка', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<CreatePostForm />);

    const titleInput = screen.getByLabelText('Title');
    const longTitle = 'a'.repeat(101);
    await user.type(titleInput, longTitle);

    const submitButton = screen.getByRole('button', { name: 'Create Post' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Title must not exceed 100 characters')
      ).toBeInTheDocument();
    });
  });

  it('показывает ошибку для слишком длинного содержания', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<CreatePostForm />);

    const contentInput = screen.getByLabelText('Content');
    const longContent = 'a'.repeat(1001);
    await user.type(contentInput, longContent);

    const submitButton = screen.getByRole('button', { name: 'Create Post' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Content must not exceed 1000 characters')
      ).toBeInTheDocument();
    });
  });

  it('показывает ошибку для слишком длинного имени автора', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<CreatePostForm />);

    const authorInput = screen.getByLabelText('Author');
    const longAuthor = 'a'.repeat(51);
    await user.type(authorInput, longAuthor);

    const submitButton = screen.getByRole('button', { name: 'Create Post' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Author name must not exceed 50 characters')
      ).toBeInTheDocument();
    });
  });

  it('очищает форму после успешной отправки', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<CreatePostForm />);

    const titleInput = screen.getByLabelText('Title');
    const authorInput = screen.getByLabelText('Author');
    const contentInput = screen.getByLabelText('Content');

    await user.type(titleInput, 'Test Title');
    await user.type(authorInput, 'Test Author');
    await user.type(contentInput, 'Test Content');

    const submitButton = screen.getByRole('button', { name: 'Create Post' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(authorInput).toHaveValue('');
      expect(contentInput).toHaveValue('');
    });
  });
});
