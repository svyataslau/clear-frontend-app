import { useEffect, useRef, useCallback } from 'react';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';

export function PostsFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePosts();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Loading Error
        </h3>
        <p className="text-red-600">
          {error?.message || 'An error occurred while loading posts'}
        </p>
      </div>
    );
  }

  if (!data?.pages[0]?.data.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Posts</h3>
        <p className="text-gray-600">No posts to display yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.pages.map((page, pageIndex) =>
        page.data.map((post, postIndex) => {
          const isLastPost =
            pageIndex === data.pages.length - 1 &&
            postIndex === page.data.length - 1;

          return (
            <div key={post.id} ref={isLastPost ? lastPostRef : undefined}>
              <PostCard post={post} />
            </div>
          );
        })
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!hasNextPage && data.pages[0]?.data.length > 0 && (
        <div className="text-center py-4 text-gray-500">All posts loaded</div>
      )}
    </div>
  );
}
