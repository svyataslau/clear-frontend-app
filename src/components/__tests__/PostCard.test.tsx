import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostCard } from '../PostCard';
import type { Post } from '../../types';

const mockPost: Post = {
  id: 1,
  title: 'Test Post',
  content: 'Test post content',
  author: 'Test Author',
  createdAt: '2024-01-15T10:00:00Z',
  likes: 42,
  isLiked: false,
};

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

describe('PostCard', () => {
  it('отображает информацию о посте', () => {
    renderWithQueryClient(<PostCard post={mockPost} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('Author: Test Author')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('отображает правильную дату', () => {
    renderWithQueryClient(<PostCard post={mockPost} />);

    expect(screen.getByText(/15 января 2024/)).toBeInTheDocument();
  });

  it('показывает неактивное состояние лайка', () => {
    renderWithQueryClient(<PostCard post={mockPost} />);

    const likeButton = screen.getByRole('button');
    expect(likeButton).toHaveClass('bg-gray-100');
    expect(likeButton).not.toHaveClass('bg-red-100');
  });

  it('показывает активное состояние лайка', () => {
    const likedPost = { ...mockPost, isLiked: true };
    renderWithQueryClient(<PostCard post={likedPost} />);

    const likeButton = screen.getByRole('button');
    expect(likeButton).toHaveClass('bg-red-100');
    expect(likeButton).not.toHaveClass('bg-gray-100');
  });

  it('обрабатывает клик по лайку', async () => {
    renderWithQueryClient(<PostCard post={mockPost} />);

    const likeButton = screen.getByRole('button');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(screen.getByText('43')).toBeInTheDocument();
    });
  });
});
