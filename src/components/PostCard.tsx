import { useState } from 'react';
import { useToggleLike } from '../hooks/usePosts';
import type { Post } from '../types';
import { Card, Typography, Button } from '@clear/ui';

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
    <Card variant="default" padding="lg" style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Typography variant="h3" weight="bold" style={{ marginBottom: '0.5rem' }}>
          {post.title}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#666' }}>
          <span>Author: {post.author}</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Typography variant="body" style={{ lineHeight: '1.6' }}>
          {post.content}
        </Typography>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant={optimisticIsLiked ? "primary" : "ghost"}
          size="md"
          onClick={handleLikeClick}
          disabled={toggleLikeMutation.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg
            style={{ width: '1.25rem', height: '1.25rem' }}
            viewBox="0 0 24 24"
            strokeWidth="2"
            role="img"
            aria-label="Like icon"
            fill={optimisticIsLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
          >
            <title>Like icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span>{optimisticLikes}</span>
        </Button>

        {toggleLikeMutation.isPending && (
          <Typography variant="caption" color="gray">
            Updating...
          </Typography>
        )}
      </div>
    </Card>
  );
}
