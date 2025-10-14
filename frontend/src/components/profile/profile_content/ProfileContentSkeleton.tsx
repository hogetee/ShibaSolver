export default function ProfileContentSkeleton() {
  return (
    <div className="w-full flex flex-col items-center font-display mt-6 mb-10 px-8">
      <div className="w-full max-w-4xl pt-4 pl-8 pr-8 pb-8 w-[100%] bg-neutral-200/40 rounded-xl">
        {/* Tabs bar placeholder */}
        <div className="h-10 bg-neutral-200/0 dark:bg-neutral-700 rounded w-64 mb-6 animate-pulse" />
        {/* Big content area placeholder */}
        <div className="h-[820px] md:h-[960px] bg-neutral-200/0 dark:bg-neutral-700 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}


