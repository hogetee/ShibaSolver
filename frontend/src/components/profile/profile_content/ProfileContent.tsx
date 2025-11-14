import { useState, useMemo } from "react";
import PostsPanel from "./PostsPanel";
import CommentsPanel from "./CommentsPanel";
import ProfileTabs from "./ProfileTabs";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
  username?: string;
};

export default function ProfileContent({ searchParams, username }: Props) {
  const [postCount, setPostCount] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  const postCountLabel = useMemo(() => {
    if (postCount && postCount > 0) return postCount.toString();
    return undefined;
  }, [postCount]);

  const commentCountLabel = useMemo(() => {
    if (commentCount && commentCount > 0) return commentCount.toString();
    return undefined;
  }, [commentCount]);

  const tab =
    typeof searchParams?.tab === "string" ? searchParams.tab : "posts";
  // console.log("ProfileContent received username:", username);
  return (
    <div className="w-full flex flex-col items-center font-display mt-6 mb-10">
      <div className="w-full max-w-4xl pt-4 pl-8 pr-8 pb-8 w-[100%] bg-accent-400 rounded-xl flex flex-col">
        <ProfileTabs
          postCountLabel={postCountLabel}
          commentCountLabel={commentCountLabel}
        />
        {(tab === "posts" || !tab) && (
          <PostsPanel
            username={username}
            onTotalPostsChange={(count) => setPostCount(count)}
          />
        )}
        {tab === "comments" && (
          <CommentsPanel
            username={username}
            onTotalCommentsChange={(count) => setCommentCount(count)}
          />
        )}
      </div>
    </div>
  );
}