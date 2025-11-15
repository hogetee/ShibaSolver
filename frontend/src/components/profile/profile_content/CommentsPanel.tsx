import CommentsList from "./CommentsList";

type CommentsPanelProps = {
  username?: string;
  onTotalCommentsChange?: (count: number) => void;
};

export default function CommentsPanel({
  username,
  onTotalCommentsChange,
}: CommentsPanelProps) {
  return (
    <div className="pt-4">
      <CommentsList
        username={username}
        onTotalCommentsChange={onTotalCommentsChange}
      />
    </div>
  );
}