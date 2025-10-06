import PostHeader from '../PostHeader';
import PostContent from '../PostContent';
import PostAuthor from './DedicatedPostAuthor';



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

const DedicatedPost = ({ dedicatedPostData }: PostProps) => {
  return (
    <div className="w-full min-h-[30vh] bg-white cursor-pointer hover:shadow-2xl/15 rounded-2xl shadow-lg p-6 flex flex-col font-display">
      <div className="flex-grow">
        <PostHeader isSolved={dedicatedPostData.is_solved} tags={dedicatedPostData.tags} />
        <PostContent 
          title={dedicatedPostData.title} 
          description={dedicatedPostData.description}
          postImage={dedicatedPostData.post_image} 
        />
      <PostAuthor
        author={dedicatedPostData.author}
        stats={dedicatedPostData.stats}
        liked_by_user={dedicatedPostData.liked_by_user}
        disliked_by_user={dedicatedPostData.disliked_by_user}
      />
      </div>
      
      
      
      
    </div>
  );
};

export default DedicatedPost;