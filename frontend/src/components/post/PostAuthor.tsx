// Type สำหรับข้อมูลผู้เขียนและสถิติ
type Author = {
  display_name: string;
  profile_picture: string;
};
type Stats = {
  likes: number;
  dislikes: number;
};

interface PostAuthorProps {
  author: Author;
  stats: Stats;
}

const PostAuthor = ({ author, stats }: PostAuthorProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src={author.profile_picture} alt={`${author.display_name}'s avatar`} className="w-10 h-10 rounded-full" />
        <span className="font-semibold text-gray-700">{author.display_name}</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <div className="flex items-center gap-2 text-gray-600">
          <button className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
            <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 1.79 1.11L15 5.88Z" /></svg>
          </button>
          <span className="font-bold">{stats.likes}</span>
        </div>
        {/* Dislike Button */}
        <div className="flex items-center gap-2 text-gray-600">
          <button className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
            <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z" /></svg>
          </button>
          <span className="font-bold">{stats.dislikes}</span>
        </div>
        {/* Comment Button */}
        <button className="bg-[#4B0082] text-white font-semibold px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Comment
        </button>
      </div>
    </div>
  );
};

export default PostAuthor;