type Props = {
  bio?: string;
};

export default function BioCard({ bio }: Props){
  const displayBio = bio && bio.trim().length > 0 ? bio : "No bio yet";
  
  return (
    <div className="bg-accent-200 rounded-xl p-[3%] text-dark-900 max-w-[560px] min-h-[5rem] max-h-[12rem] overflow-y-auto break-words pr-2">
      <p className="text-[1rem] break-words whitespace-pre-wrap">
        {displayBio}
      </p>
    </div>
  );
}