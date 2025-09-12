export default function CommentsList() {
  return (
    //must create case for when there are no comments as well as when there are comments
    <div className="p-4 rounded-lg">
      <div className="flex justify-center items-center h-32">
        {/* Comments list content goes here */}
        <p className="text-white text-xl">No comments available.</p>
      </div>
    </div>
  );
}
