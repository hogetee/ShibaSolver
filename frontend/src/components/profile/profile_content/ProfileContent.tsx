import PostsPanel from "./PostsPanel";
import CommentsPanel from "./CommentsPanel";

export default function ProfileContent() {
  const postCountLabel = "300";
  const commentCountLabel = "1.2k";

  return (
    <div className="w-full flex justify-center font-display mt-6 mb-10">
      <div className="flex w-4xl gap-6">
        <PostsPanel countLabel={postCountLabel} />
        {/* <CommentsPanel countLabel={commentCountLabel} /> */}
      </div>
    </div>
  );
}