interface PostContentProps {
  title: string;
  description: string;
  // อาจมีรูปภาพในอนาคต (optional)
  postImage?: string; 
}

const PostContent = ({ title, description, postImage }: PostContentProps) => {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-bold text-gray-800 mb-1">
        {title}
      </h1>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
      {postImage && (
        <img src={postImage} alt="Post content" className="mt-4 rounded-lg w-3/5 object-cover" />
      )}
    </div>
  );
};

export default PostContent;