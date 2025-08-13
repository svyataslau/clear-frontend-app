import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(1000, 'Content must not exceed 1000 characters'),
  author: z
    .string()
    .min(1, 'Author name is required')
    .max(50, 'Author name must not exceed 50 characters'),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
