import { PostsFeed } from '../components/PostsFeed';
import { CreatePostForm } from '../components/CreatePostForm';

export function HomePage() {
  return (
    <div className="main-content">
      <div className="grid-layout">
        <div>
          <PostsFeed />
        </div>

        <div className="sticky-sidebar">
          <CreatePostForm />
        </div>
      </div>
    </div>
  );
}
