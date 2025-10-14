import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostAuthor from './PostAuthor';
import TopComment from './TopComment';
import { slugify } from '@/utils/slugify';
import Link from 'next/link';

export interface PostData {
  post_id: string;
  title: string;
  description: string;
  post_image?: string;
  is_solved: boolean;
  created_at: string;
  tags: string[];
  author: {
    user_id: string;
    display_name: string;
    profile_picture: string;
  };
  topComment?: {
    comment_id: string;
    text: string;
    comment_image?: string;
    created_at: string;
    likes: number;
    dislikes: number;
    author: {
      user_id: string;
      display_name: string;
      profile_picture: string;
    };
  };
  stats: {
    likes: number;
    dislikes: number;
  };
  liked_by_user: boolean;
  disliked_by_user: boolean;
}

interface PostProps {
  postData: PostData;
}

const Post = ({ postData }: PostProps) => {
  const href = `/post/${postData.post_id}/${slugify(postData.title)}`;

  return (
    <div className="w-full min-h-[30vh] bg-white hover:shadow-2xl/15 rounded-2xl shadow-lg p-6 flex flex-col font-display">
      {/* ✅ Only title/description clickable */}
      <Link href={href} className="block cursor-pointer">
        <PostHeader isSolved={postData.is_solved} tags={postData.tags} />
        <PostContent
          title={postData.title}
          description={postData.description}
          postImage={postData.post_image}
        />
      </Link>

      {/* ✅ Like/Dislike outside Link — no unwanted navigation */}
      <PostAuthor
        postId={postData.post_id}
        author={postData.author}
        stats={postData.stats}
        liked_by_user={postData.liked_by_user}
        disliked_by_user={postData.disliked_by_user}
      />

      <hr className="my-4 border-gray-200/80" />

      {postData.topComment ? (
        <TopComment comment={postData.topComment} />
      ) : (
        <p className="text-center text-sm text-gray-400">No comments yet.</p>
      )}
    </div>
  );
};

export default Post;