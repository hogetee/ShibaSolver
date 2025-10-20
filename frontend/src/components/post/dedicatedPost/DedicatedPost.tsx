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
}

interface PostProps {
  postData: DedicatedPostData;
}

const DedicatedPost = ({ postData }: PostProps) => {
  return (
    <div className="w-full min-h-[30vh] bg-white cursor-pointer hover:shadow-2xl/15 rounded-2xl shadow-lg p-6 flex flex-col font-display">
      <div className="flex-grow">
        <PostHeader isSolved={postData.is_solved} tags={postData.tags} />
        <PostContent 
          title={postData.title} 
          description={postData.description}
          postImage={postData.post_image} 
        />
        <PostAuthor author={postData.author} stats={postData.stats} />
      </div>
      
      
      
      
    </div>
  );
};

export default DedicatedPost;