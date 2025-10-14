export default function ProfileHeaderSkeleton() {
    return (
        <div className="w-[100%] px-6 pt-8 font-display flex justify-center">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 md:gap-8 items-stretch animate-pulse">
                {/* Avatar */}
                <div className="flex items-center justify-center md:justify-start">
                    <div className="rounded-full bg-neutral-200/40 dark:bg-neutral-700" style={{ width: 144, height: 144 }} />
                </div>

                {/* Info + Bio */}
                <div className="flex-1 min-w-0 flex flex-col gap-3 mr-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="h-10 md:h-12 lg:h-16 bg-neutral-200/40 dark:bg-neutral-700 rounded w-2/3" />
                        <div className="h-6 bg-neutral-200/40 dark:bg-neutral-700 rounded w-24 md:hidden" />
                    </div>
                    <div className="h-5 bg-neutral-200/40 dark:bg-neutral-700 rounded w-40" />
                    <div className="h-5 bg-neutral-200/40 dark:bg-neutral-700 rounded w-40" />
                    <div className="bg-neutral-200/40 rounded-xl p-[3%]">
                        <div className="h-16 dark:bg-neutral-700 rounded w-full" />
                    </div>
                </div>

                {/* Right column (md+) */}
                <div className="hidden md:flex md:flex-col gap-4 p-[0.5rem] w-64">
                    {/* Shibameter bar */}
                    <div className="h-8 bg-neutral-200/40 dark:bg-neutral-700 rounded w-full" />
                    {/* Top Subjects title */}

                    <div className="flex justify-center mt-5">
                        <div className="h-8 bg-neutral-200/40 dark:bg-neutral-700 rounded w-40" />
                    </div>
                    {/* Chips silhouette: first centered, then two under */}
                    <div className="flex justify-center">
                        <div className="h-8 bg-neutral-200/40 dark:bg-neutral-700 rounded-full w-24" />
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                        <div className="h-8 bg-neutral-200/40 dark:bg-neutral-700 rounded-full w-24" />
                        <div className="h-8 bg-neutral-200/40 dark:bg-neutral-700 rounded-full w-28" />
                    </div>
                </div>

                {/* Bottom (sm) top subjects silhouette */}
                <div className="md:hidden flex flex-col items-center gap-3">
                    <div className="h-6 bg-neutral-200/40 dark:bg-neutral-700 rounded w-28" />
                    <div className="flex justify-center">
                        <div className="h-8 bg-neutral-200/40 dark:bg-neutral-700 rounded-full w-24" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 bg-neutral-200/40 dark:bg-neutral-700 rounded-full w-20" />
                        <div className="h-8 bg-neutral-200/40 dark:bg-neutral-700 rounded-full w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
}


