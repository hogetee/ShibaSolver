import CommentsList from "./CommentsList";

export default function CommentsPanel() {
  return (
    <div className="pt-4">
      {/* <div className="mb-4 flex items-baseline">
        <h2 className="text-3xl font-bold text-dark-900">Comments</h2>
        {countLabel ? (
          <span className="text-2xl text-dark-900 ml-2 mr-2">{`(${countLabel})`}</span>
        ) : null}
      </div> */}
      <CommentsList />
    </div>
  );
}