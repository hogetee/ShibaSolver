import DedicatedPostContainer from '@/components/post/dedicatedPost/DedicatedPostContainer'
import CommentPostPage from '@/components/comment/CommentContainer'

interface PostPageProps {
  params: {
    postId: string
    slug: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pt-20">
      <DedicatedPostContainer postId={params.postId} />
      <CommentPostPage postId={params.postId} />
    </div>
  )
}