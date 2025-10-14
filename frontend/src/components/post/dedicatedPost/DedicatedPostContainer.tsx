import DedicatedPost, { DedicatedPostData } from '@/components/post/dedicatedPost/DedicatedPost'

interface Props {
  postId: string;
}

function mapApiToPostData(api: any, rating: any): DedicatedPostData {
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
      likes: rating.likes,
      dislikes: rating.dislikes,
    },
    liked_by_user: rating.my_rating === 'like',
    disliked_by_user: rating.my_rating === 'dislike',
  };
}

async function getPostWithRatings(postId: string): Promise<DedicatedPostData> {
  const [postRes, ratingRes] = await Promise.all([
    fetch(`https://your-api.com/api/posts/${postId}`, { cache: 'no-store' }),
    fetch(`https://your-api.com/api/v1/ratings/summary?target_type=post&ids=${postId}`, {
      cache: 'no-store',
      credentials: 'include', // needed for cookie-based auth
    }),
  ]);

  if (!postRes.ok) {
    throw new Error('Failed to fetch post');
  }
  if (!ratingRes.ok) {
    throw new Error('Failed to fetch rating summary');
  }

  const postData = await postRes.json();
  const ratingData = await ratingRes.json();

  const rating = ratingData.data.find((r: any) => r.id === Number(postId)) || {
    likes: 0,
    dislikes: 0,
    my_rating: null,
  };

  return mapApiToPostData(postData, rating);
}


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
  
