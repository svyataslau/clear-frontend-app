import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '../hooks/usePosts';
import { createPostSchema, type CreatePostFormData } from '../schemas/post';

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter post title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author
          </label>
          <input
            {...register('author')}
            type="text"
            id="author"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.author ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter author name"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            {...register('content')}
            id="content"
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter post content"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || createPostMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting || createPostMutation.isPending
            ? 'Creating...'
            : 'Create Post'}
        </button>
      </div>

      {createPostMutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          Error creating post. Please try again.
        </p>
      )}

      {createPostMutation.isSuccess && (
        <p className="mt-4 text-sm text-green-600">
          Post created successfully!
        </p>
      )}
    </form>
  );
}
