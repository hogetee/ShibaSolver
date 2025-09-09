type Props = {
  bio?: string;
};

export default function BioCard({ bio }: Props){
  const displayBio = bio ? bio.substring(0, 100) : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu";
  
  return (
    <div className="bg-[#F2D7F7] rounded-xl p-[3%] text-neutral-900 max-w-[560px] min-h-[5rem]">
      <p className="text-[1rem]">
        {displayBio}
      </p>
    </div>
  );
}