// Type สำหรับข้อมูลใน Comment
interface Comment {
  author: {
    display_name: string;
    profile_picture: string;
  };
  text: string;
  created_at: string; // ควรเป็น ISO Date string หรือ formatted string
  likes: number;
}

interface TopCommentProps {
  comment: Comment;
}

const TopComment = ({ comment }: TopCommentProps) => {
  // ฟังก์ชันแปลงเวลาคร่าวๆ (ตัวอย่าง) // ในโปรเจกต์จริงควรใช้ library เช่น date-fns
  const formatTimeAgo = (dateString: string) => {
    return "13 h ago"; 
  };

  return (
    <div>
      <div className="flex items-start gap-3">
        <img src={comment.author.profile_picture} alt={`${comment.author.display_name}'s avatar`} className="w-8 h-8 rounded-full" />
        <div className="flex-grow">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-gray-800">{comment.author.display_name}</span>
            <span className="text-xs text-gray-400">{formatTimeAgo(comment.created_at)}</span>
          </div>
          <p className="text-gray-600 mt-1">{comment.text}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 1.79 1.11L15 5.88Z" /></svg>
          </button>
          <span className="text-sm font-bold">{comment.likes}</span>
        </div>
      </div>
    </div>
  );
};

export default TopComment;