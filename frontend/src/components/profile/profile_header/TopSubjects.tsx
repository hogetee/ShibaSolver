type Props = { subjects: string[] };

export default function TopSubject({ subjects }: Props){
  return (
    <div className="flex flex-col items-center m-[0.5rem]">
      <div className="text-[22px] font-semibold text-neutral-900 mb-3">Top Subjects</div>
      <div className="flex flex-col items-center gap-2">
        {/* First row - single subject */}
        <div className="flex justify-center">
          {subjects[0] && (
            <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-[12px]">
              {subjects[0]}
            </span>
          )}
        </div>
        {/* Second row - two subjects */}
        <div className="flex items-center gap-3">
          {subjects[1] && (
            <span className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-[12px]">
              {subjects[1]}
            </span>
          )}
          {subjects[2] && (
            <span className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-[12px]">
              {subjects[2]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}