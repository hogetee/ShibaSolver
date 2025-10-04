import PostPage from '@/pages/PostPage';

// Define the props that Next.js passes to the page
type Props = {
  params: {
    postId: string;
  };
};

// This is a Server Component by default
export default async function Post({ params }: Props) {
  // 1. Extract the postId from the URL parameters
  const { postId } = params;

  // 2. Render your client component and pass the postId to it
  return (
    <div>
      <PostPage postId={postId} />
    </div>
  );
}
