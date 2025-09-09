import ProfilePic from "./ProfilePic";
import BioCard from "./BioCard";
import InfoBlock from "./InfoBlock";
import Shibameter from "./Shibameter";
import TopSubject from "./TopSubjects";

type UserProfile = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  educationLevel: string;
  shibaMeter: number;
  topSubjects: string[];
  stats: {
    posts: number;
    comments: number;
  };
  posts: unknown;
};

type Props = {
  dummyUser: UserProfile;
};

export default function ProfileHeader({ dummyUser }: Props) {
  return (
    <div className="w-[100%] flex gap-6 px-6 pt-8 justify-center h-[270px] align-center font-display ">
      <div className="flex items-start justify-center gap-6">
        <div className="flex items-center h-full">
          <ProfilePic
            src={dummyUser.avatarUrl}
            alt={dummyUser.displayName}
            size={160}
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-[400px] h-full">
          <InfoBlock
            displayName={dummyUser.displayName}
            username={dummyUser.username}
            educationLevel={dummyUser.educationLevel}
          />
          <div className="w-[100%]">
            <BioCard bio={dummyUser.bio} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 h-full justify-between p-[0.5rem]">
          <div className="flex justify-end w-[100%]">
            <Shibameter value={dummyUser.shibaMeter} />
          </div>
          <div className="flex items-start">
            <TopSubject subjects={dummyUser.topSubjects} />
          </div>
        </div>
      </div>
    </div>
  );
}
