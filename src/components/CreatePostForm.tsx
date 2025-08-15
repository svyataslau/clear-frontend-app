import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '../hooks/usePosts';
import { createPostSchema, type CreatePostFormData } from '../schemas/post';
import { Card, Typography, Button } from '@clear/ui';

export function CreatePostForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const createPostMutation = useCreatePost();

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await createPostMutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error('Ошибка при создании поста:', error);
    }
  };

  return (
    <Card variant="default" padding="lg">
      <Typography variant="h2" weight="bold" style={{ marginBottom: '1.5rem' }}>
        Create New Post
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-field-label">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="Enter post title"
              className={`input-base input-size-md ${errors.title ? 'input-shadow-error' : 'input-shadow-default'}`}
            />
            {errors.title && (
              <p className="form-field-error">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="form-field-label">
              Author *
            </label>
            <input
              {...register('author')}
              type="text"
              placeholder="Enter author name"
              className={`input-base input-size-md ${errors.author ? 'input-shadow-error' : 'input-shadow-default'}`}
            />
            {errors.author && (
              <p className="form-field-error">{errors.author.message}</p>
            )}
          </div>

          <div>
            <label className="form-field-label">
              Content *
            </label>
            <textarea
              {...register('content')}
              placeholder="Enter post content"
              rows={4}
              className={`w-full rounded-xl bg-neumorphism-background text-gray-700 placeholder-gray-500 transition-all duration-200 focus:outline-none shadow-neumorphism-input ${errors.content ? 'shadow-[inset_6px_6px_4px_#ffebee,inset_-6px_-6px_4px_#ffffff]' : ''}`}
            />
            {errors.content && (
              <p className="form-field-error">{errors.content.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || createPostMutation.isPending}
            style={{ width: '100%' }}
          >
            {isSubmitting || createPostMutation.isPending
              ? 'Creating...'
              : 'Create Post'}
          </Button>
        </div>

        {createPostMutation.isError && (
          <Typography color="gray" style={{ marginTop: '1rem', color: '#dc2626' }}>
            Error creating post. Please try again.
          </Typography>
        )}

        {createPostMutation.isSuccess && (
          <Typography color="gray" style={{ marginTop: '1rem', color: '#22c55e' }}>
            Post created successfully!
          </Typography>
        )}
      </form>
    </Card>
  );
}
