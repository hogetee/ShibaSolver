import PostsList from "./PostsList";

type PostsPanelProps = {
  countLabel?: string;
};

export default function PostsPanel({ countLabel }: PostsPanelProps) {
  return (
    <div className="pt-4 pl-8 pr-8 pb-8 w-[100%] bg-accent-400 rounded-xl flex flex-col">
      <div className="mb-4 flex items-baseline">
        <h2 className="text-3xl font-bold text-white">Posts</h2>
        {countLabel ? (
          <span className="text-2xl text-white ml-2 mr-2">{`(${countLabel})`}</span>
        ) : null}
      </div>
      <PostsList />
    </div>
  );
}