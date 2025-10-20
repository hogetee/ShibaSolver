import PostHeader from '../PostHeader';
import PostContent from '../PostContent';
import PostAuthor from './DedicatedPostAuthor';

// --- Interface for post data ---
export interface DedicatedPostData {
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
  stats: {
    likes: number;
    dislikes: number;
  };
  liked_by_user: boolean;
  disliked_by_user: boolean;
}

interface PostProps {
  dedicatedPostData: DedicatedPostData;
}

// --- Main Post Component ---
const DedicatedPost = ({ dedicatedPostData }: PostProps) => {
  const {
    post_id,
    title,
    description,
    post_image,
    is_solved,
    tags,
    author,
    stats,
    liked_by_user,
    disliked_by_user,
  } = dedicatedPostData;

  return (
    <div className="w-full min-h-[30vh] bg-white cursor-pointer hover:shadow-2xl/15 rounded-2xl shadow-lg p-6 flex flex-col font-display">
      <div className="flex-grow">
        {/* --- Header section (tags + solved indicator) --- */}
        <PostHeader isSolved={is_solved} tags={tags} />

        {/* --- Main content (title, body, optional image) --- */}
        <PostContent
          title={title}
          description={description}
          postImage={post_image}
        />

        {/* --- Author + Like/Dislike --- */}
        <PostAuthor
          postId={post_id}                 
          author={author}
          stats={stats}
          liked_by_user={liked_by_user}
          disliked_by_user={disliked_by_user}
        />
      </div>
    </div>
  );
};

export default DedicatedPost;