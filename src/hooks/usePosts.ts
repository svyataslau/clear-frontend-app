import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { postsApi } from '../api/client';
import type { CreatePostData } from '../types';

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => postsApi.getPosts(pageParam, 5),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostData) => postsApi.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postsApi.toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Save previous state
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update UI
      queryClient.setQueryData(['posts'], (old: unknown) => {
        if (!old || typeof old !== 'object' || !('pages' in old)) return old;

        const typedOld = old as {
          pages: Array<{
            data: Array<{ id: number; isLiked: boolean; likes: number }>;
          }>;
        };
        return {
          ...typedOld,
          pages: typedOld.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                  }
                : post
            ),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      // Restore previous state on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },
    onSettled: () => {
      // Update data after completion
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
