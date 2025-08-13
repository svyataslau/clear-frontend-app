import { useState } from 'react';
import { useToggleLike } from '../hooks/usePosts';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(post.isLiked);

  const toggleLikeMutation = useToggleLike();

  const handleLikeClick = () => {
    // Оптимистичное обновление
    setOptimisticIsLiked(!optimisticIsLiked);
    setOptimisticLikes(
      optimisticIsLiked ? optimisticLikes - 1 : optimisticLikes + 1
    );

    toggleLikeMutation.mutate(post.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <article
      data-testid="post-card"
      className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow"
    >
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h2>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Author: {post.author}</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>
      </header>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      <footer className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleLikeClick}
          disabled={toggleLikeMutation.isPending}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            optimisticIsLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg
            className={`w-5 h-5 ${optimisticIsLiked ? 'fill-current' : 'stroke-current fill-none'}`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            role="img"
            aria-label="Like icon"
          >
            <title>Like icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span>{optimisticLikes}</span>
        </button>

        {toggleLikeMutation.isPending && (
          <span className="text-sm text-gray-500">Updating...</span>
        )}
      </footer>
    </article>
  );
}
