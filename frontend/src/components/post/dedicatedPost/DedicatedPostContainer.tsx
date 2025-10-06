import DedicatedPost, { DedicatedPostData } from '@/components/post/dedicatedPost/DedicatedPost'

interface Props {
  postId: string;
}


function mapApiToPostData(api: any): DedicatedPostData {
  return {
    post_id: api.post_id,
    title: api.title,
    description: api.description,
    post_image: api.post_image,
    is_solved: api.solved,
    created_at: api.created_at,
    tags: api.tagList,
    author: {
      user_id: api.user_id,
      display_name: api.username,
      profile_picture: api.user_profile_picture,
    },
    stats: {
      likes: api.likesCount,
      dislikes: api.dislikesCount,
    },
    liked_by_user: api.liked_by_user,
    disliked_by_user: api.disliked_by_user,
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
  liked_by_user: false,
  disliked_by_user: true,
}

export default async function PostPage({ postId }: Props) {
  // const postData = await getPost(postId)
  const postData = mockPostData

  return <DedicatedPost dedicatedPostData={postData} />
}
  
