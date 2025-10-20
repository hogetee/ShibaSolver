import DedicatedPostContainer from '@/components/post/dedicatedPost/DedicatedPostContainer'
import CommentContainer from '@/components/comment/CommentContainer'

interface PostPageProps {
  params: {
    postId: string
    slug: string
  }
}

export default async function PostPage({ params }: { params: Promise<{ postId: string; slug: string }> }) {
  const { postId } = await params;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pt-20">
      <DedicatedPostContainer postId={params.postId} />
      <CommentContainer postId={params.postId} />
    </div>
  );
}