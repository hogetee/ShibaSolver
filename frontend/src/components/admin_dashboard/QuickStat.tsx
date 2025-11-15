export default function QuickStat({ stats }: { stats: { title: string; value: number; icon: React.ReactNode }[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
                <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center justify-between h-16">
                        <div>
                            <p className="text-sm font-medium text-gray-600 h-[40%]">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 h-[60%]">{stat.value}</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}