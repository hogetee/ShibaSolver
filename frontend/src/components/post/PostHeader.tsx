interface PostHeaderProps {
  isSolved: boolean;
  tags: string[];
}

const PostHeader = ({ isSolved, tags }: PostHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {/* Tag สถานะ Solved/Unsolved */}
        <span 
          className={`${isSolved ? 'bg-[#29c46a]' : 'bg-gray-400'} text-white text-sm font-semibold px-3 py-1.5 rounded-md`}
        >
          {isSolved ? 'Solved' : 'Unsolved'}
        </span>
        
        {/* Tag อื่นๆ (เช่น "Science") */}
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="bg-[#ff8c43] text-white text-sm font-semibold px-3 py-1.5 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* ปุ่มเมนู (SVG Icon) */}
      <button className="text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </button>
    </div>
  );
};

export default PostHeader;