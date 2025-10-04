import DedicatedPost, { DedicatedPostData } from '@/components/post/dedicatedPost/DedicatedPost'

interface Props {
  postId: string;
}


function mapApiToPostData(api: any): DedicatedPostData {
  return {
    post_id: api.id,
    title: api.postTitle,
    description: api.body,
    post_image: api.imageUrl,
    is_solved: api.solved,
    created_at: api.createdAt,
    tags: api.tagList,
    author: {
      user_id: api.authorInfo.id,
      display_name: api.authorInfo.name,
      profile_picture: api.authorInfo.avatar,
    },
    stats: {
      likes: api.likesCount,
      dislikes: api.dislikesCount,
    },
  }
}

async function getPost(postId: string): Promise<DedicatedPostData> {
  const res = await fetch(`https://your-api.com/api/posts/${postId}`, {
    cache: 'no-store', 
  })

  if (!res.ok) {
    throw new Error('Failed to fetch post')
  }

  const data = await res.json()
  return mapApiToPostData(data)
}



/*
export default async function PostPage({ params }: PostPageProps) {
  const postData = await getPost(params.postId)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <DedicatedPost postData={postData} />
    </div>
  )
}
  */

// Mock data for development/testing
 const mockPostData: DedicatedPostData = {
  post_id: '123',
  title: 'How to Prove the Riemann Hypothesis',
  description: 'I have been reading about the Riemann Hypothesis and I’m confused about the distribution of non-trivial zeros...',
  post_image: '/image/mock-chemical-equation.png',
  is_solved: false,
  created_at: '2025-10-04T10:30:00Z',
  tags: ['Math', 'number theory'],
  author: {
    user_id: 'u001',
    display_name: 'GaussianDreamer',
    profile_picture: '/image/DefaultAvatar.png',
  },
  stats: {
    likes: 120,
    dislikes: 5,
  },
}

export default async function PostPage({ postId }: Props) {
  // const postData = await getPost(postId)
  const postData = mockPostData

  return <DedicatedPost postData={postData} />
}
  
