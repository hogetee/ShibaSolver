import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FlagIcon from '@mui/icons-material/Flag';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';

interface PostHeaderProps {
  isSolved: boolean;
  tags: string[];
}

const PostHeader = ({ isSolved, tags }: PostHeaderProps) => {

  //Object for storing color pairs of each subject
  const tagColorMap: { [key: string]: string } = {
    "Math": "bg-[#2563EB]",
    "Physics": "bg-[#FF9D00]",
    "Chemistry": "bg-[#9333EA]",
    "Biology": "bg-[#467322]",
    "History": "bg-[#893F07]",
    "Geography": "bg-[#1E6A91]",
    "Economics": "bg-[#FA733E]",
    "Law": "bg-[#000000]",
    "Thai": "bg-[#83110F]",
    "English": "bg-[#BE0EA7]",
    "Chinese": "bg-[#CBC400]",
    "Programming": "bg-[#6366F1]",
    "Others": "bg-[#63647A]",
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {/* Tag สถานะ Solved/Unsolved */}
        <span 
          className={`${isSolved ? 'bg-[#16A34A]' : 'bg-[#DC2626]'} text-white text-b font-bold px-2.5 py-1 rounded-md`}
        >
          {isSolved ? 'Solved' : 'Unsolved'}
        </span>
        
        {/* Tag อื่นๆ (เช่น "Science") */}
        {tags.map((tag) => (
          <span 
            key={tag} 
             className={`${tagColorMap[tag] || 'bg-gray-500'} text-white text-b font-bold px-2.5 py-1 rounded-md`}
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* กลุ่มปุ่ม: Bookmark และ Report (ยังไม่มี state) */}
      <div className="flex items-center gap-2">
        <button 
          className="text-gray-500 hover:text-yellow-400 cursor-pointer transition-colors"
          aria-label="Bookmark post"
        >
          <BookmarkBorderIcon />
        </button>

        <button 
          className="text-gray-500 hover:text-red-600 cursor-pointer transition-colors"
          aria-label="Report post"
        >
          <OutlinedFlagIcon />
        </button>
      </div>
    </div>
  );
};

export default PostHeader;