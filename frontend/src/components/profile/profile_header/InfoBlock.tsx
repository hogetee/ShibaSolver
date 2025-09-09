type Props = {
  displayName: string;
  username: string;
  educationLevel: string;
};

export default function InfoBlock({ displayName, username, educationLevel }: Props){
  return (
    <div className="flex flex-col gap-2 pt-1">
      <div className="text-[4rem] font-semibold leading-none text-neutral-900">{displayName}</div>
      <div className="text-neutral-700 text-[1.5rem]">@{username}</div>
      <div className="flex items-center gap-2 text-neutral-800 text-[1rem]">
        {/* <span className="i-mdi-school text-[18px]"></span> */}
        <span>{educationLevel}</span>
      </div>
    </div>
  );
}