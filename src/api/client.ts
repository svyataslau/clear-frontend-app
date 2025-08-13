import axios from 'axios';
import type { Post, CreatePostData, PaginatedResponse } from '../types';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API for demonstration
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first post in our feed. Here can be any content.',
    author: 'John Smith',
    createdAt: '2024-01-15T10:00:00Z',
    likes: 42,
    isLiked: false,
  },
  {
    id: 2,
    title: 'Second Post',
    content:
      'Second post with interesting content. Lots of text for demonstration.',
    author: 'Jane Doe',
    createdAt: '2024-01-14T15:30:00Z',
    likes: 28,
    isLiked: true,
  },
  {
    id: 3,
    title: 'Third Post',
    content: 'Another post to demonstrate functionality.',
    author: 'Bob Johnson',
    createdAt: '2024-01-13T09:15:00Z',
    likes: 15,
    isLiked: false,
  },
];

export const postsApi = {
  async getPosts(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = mockPosts.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      total: mockPosts.length,
      page,
      limit,
      hasMore: endIndex < mockPosts.length,
    };
  },

  async createPost(postData: CreatePostData): Promise<Post> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newPost: Post = {
      id: Date.now(),
      ...postData,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    mockPosts.unshift(newPost);
    return newPost;
  },

  async toggleLike(postId: number): Promise<Post> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;

    return { ...post };
  },
};
