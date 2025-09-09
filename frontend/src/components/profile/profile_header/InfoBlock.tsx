import SchoolIcon from '@mui/icons-material/School';

type Props = {
  displayName: string;
  username: string;
  educationLevel: string;
};

export default function InfoBlock({ displayName, username, educationLevel }: Props){
  return (
    <div className="flex flex-col gap-2 pt-1 w-[100%]">
      <div className="text-[4rem] font-black leading-none text-neutral-900 tracking-tight">{displayName}</div>
      <div className="text-neutral-700 text-[1.5rem]">@{username}</div>
      <div className="flex items-center gap-2 text-dark-900 text-[1rem]">
        {/* <span className="i-mdi-school text-[18px]"></span> */}
        <SchoolIcon className="text-dark-900" fontSize="small" />
        <span>{educationLevel}</span>
      </div>
    </div>
  );
}