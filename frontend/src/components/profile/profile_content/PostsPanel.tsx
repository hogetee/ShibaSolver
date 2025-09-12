import PostsList from "./PostsList";


export default function PostsPanel() {
  return (
    <div className="pt-4">
      {/* <div className="mb-4 flex items-baseline">
        <h2 className="text-3xl font-bold text-white">Posts</h2>
        {countLabel ? (
          <span className="text-2xl text-white ml-2 mr-2">{`(${countLabel})`}</span>
        ) : null}
      </div> */}
      <PostsList />
    </div>
  );
}