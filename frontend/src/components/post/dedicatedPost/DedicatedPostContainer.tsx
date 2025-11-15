import DedicatedPost, { type DedicatedPostData } from '@/components/post/dedicatedPost/DedicatedPost'


interface Props {
  postId: string;
}
async function getPostWithRatings(postId: string): Promise<DedicatedPostData> {
  const [postRes, ratingRes] = await Promise.all([
    fetch(`http://localhost:5003/api/v1/posts/${postId}`, { cache: 'no-store' }),
    fetch(`http://localhost:5003/api/v1/ratings/summary?target_type=post&ids=${postId}`, {
      cache: 'no-store',
      credentials: 'include',
    }),
  ]);

  if (!postRes.ok) throw new Error('Failed to fetch post');

  const postJson = await postRes.json();
  const postData = postJson.data ?? postJson;

  // --- Default rating object ---
  let rating = { likes: 0, dislikes: 0, my_rating: null };

  // --- Handle rating response gracefully ---
  if (ratingRes.ok) {
    const ratingJson = await ratingRes.json();
    const found = ratingJson.data?.find((r: any) => r.id === Number(postId));
    if (found) rating = found;
  } else if (ratingRes.status === 401) {
    console.warn('User not logged in, skipping rating summary');
  } else {
    throw new Error('Failed to fetch rating summary');
  }

  // --- Map both into DedicatedPostData ---
  return {
    post_id: postData.post_id,
    title: postData.title,
    description: postData.description,
    post_image: postData.post_image,
    is_solved: postData.is_solved,
    created_at: postData.created_at,
    tags: postData.tags,
    author: postData.author,
    stats: {
      likes: postData.likes,
      dislikes: postData.dislikes,
    },
    liked_by_user: rating.my_rating === 'like',
    disliked_by_user: rating.my_rating === 'dislike',
  };
}


// Mock data for development/testing
/*
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
*/

export default async function PostPage({ postId }: Props) {
  const postData = await getPostWithRatings(postId)
  // const postData = mockPostData

  return <DedicatedPost dedicatedPostData={postData} />
}
  
