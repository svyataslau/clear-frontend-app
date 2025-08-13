import { PostsFeed } from '../components/PostsFeed';
import { CreatePostForm } from '../components/CreatePostForm';

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Clear</h1>
        <p className="text-lg text-gray-600">
          Share your thoughts with the world
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PostsFeed />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <CreatePostForm />
          </div>
        </div>
      </div>
    </div>
  );
}
