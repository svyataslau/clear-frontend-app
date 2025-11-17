import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '../hooks/usePosts';
import { createPostSchema, type CreatePostFormData } from '../schemas/post';
import {Card, Typography, Button, Textarea, Input} from '@clear/ui';

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
            <Input placeholder="Enter title" />
          </div>
          <div>
            <label className="form-field-label">
              Author *
            </label>
            <Input placeholder="Enter author name" />
          </div>

          <div>
            <label className="form-field-label">
              Content *
            </label>
            <Textarea placeholder={"Enter post content"} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || createPostMutation.isPending}
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
