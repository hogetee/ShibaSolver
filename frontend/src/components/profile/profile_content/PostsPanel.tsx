import PostsList from "./PostsList";

type PostsPanelProps = {
  username?: string;
  onTotalPostsChange?: (count: number) => void;
};

export default function PostsPanel({
  username,
  onTotalPostsChange,
}: PostsPanelProps) {
  // console.log("PostsPanel received username:", username);
  return (
    <div className="pt-4">
      <PostsList
        username={username}
        onTotalPostsChange={onTotalPostsChange}
      />
    </div>
  );
}