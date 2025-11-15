import PostsPanel from "./PostsPanel";
import CommentsPanel from "./CommentsPanel";
import ProfileTabs from "./ProfileTabs";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
  username?: string;
};

export default function ProfileContent({ searchParams, username }: Props) {
  const postCountLabel = "300";
  const commentCountLabel = "1.2k";
  const tab = typeof searchParams?.tab === 'string' ? searchParams.tab : 'posts';
  console.log("ProfileContent received username:", username);
  return (
    <div className="w-full flex flex-col items-center font-display mt-6 mb-10">
      <div className="w-full max-w-4xl pt-4 pl-8 pr-8 pb-8 w-[100%] bg-accent-400 rounded-xl flex flex-col">
        <ProfileTabs postCountLabel={postCountLabel} commentCountLabel={commentCountLabel} />
          {(tab === 'posts' || !tab) && <PostsPanel username={username} />}
          {tab === 'comments' && <CommentsPanel/>}
        </div>
      </div>
  );
}