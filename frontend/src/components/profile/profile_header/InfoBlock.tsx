import SchoolIcon from '@mui/icons-material/School';

type Props = {
  displayName: string;
  username: string;
  educationLevel: string;
  inlineRight?: React.ReactNode; // e.g., Shibameter when stacked layout
};

export default function InfoBlock({ displayName, username, educationLevel, inlineRight }: Props){
  return (
    <div className="flex flex-col gap-2 pt-1 w-[100%]">
      <div className="flex items-center justify-between gap-3">
        <div className="font-black leading-none text-neutral-900 tracking-tight text-[2.25rem] md:text-[3rem] lg:text-[4rem]">{displayName}</div>
        {/* Show inlineRight (e.g., Shibameter) only on small screens */}
        <div className="block md:hidden">
          {inlineRight}
        </div>
      </div>
      <div className="text-neutral-700 text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem]">@{username}</div>
      <div className="flex items-center gap-2 text-dark-900 text-[1rem]">
        {/* <span className="i-mdi-school text-[18px]"></span> */}
        <SchoolIcon className="text-dark-900" fontSize="small" />
        <span>{educationLevel}</span>
      </div>
    </div>
  );
}