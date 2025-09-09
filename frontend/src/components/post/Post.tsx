import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostAuthor from './PostAuthor';
import TopComment from './TopComment';

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
}

interface PostProps {
  postData: PostData;
}

const Post = ({ postData }: PostProps) => {
  return (
    <div className="w-full md:w-1/2 min-h-[30vh] bg-white rounded-2xl shadow-lg p-6 flex flex-col font-sans">
      <div className="flex-grow">
        <PostHeader isSolved={postData.is_solved} tags={postData.tags} />
        <PostContent 
          title={postData.title} 
          description={postData.description}
          postImage={postData.post_image} 
        />
        <PostAuthor author={postData.author} stats={postData.stats} />
      </div>
      
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