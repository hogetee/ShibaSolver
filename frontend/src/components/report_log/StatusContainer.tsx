export default function StatusContainer(reviewStatus: string, handleStatusChange: (status: 'unreviewed' | 'reviewed') => void) {
    return (
        <div className="flex space-x-4">
            <button
                onClick={() => handleStatusChange('unreviewed')}
                className={`px-4 py-2 rounded-full font-medium transition-colors cursor-pointer ${
                    reviewStatus === 'unreviewed'
                        ? 'bg-accent-400 text-white'
                        : 'bg-accent-200 text-accent-600 hover:bg-accent-200'
                }`}
            >
                Unreviewed
            </button>
            <button
                onClick={() => handleStatusChange('reviewed')}
                className={`px-4 py-2 rounded-full font-medium transition-colors cursor-pointer ${
                    reviewStatus === 'reviewed'
                        ? 'bg-accent-400 text-white'
                        : 'bg-accent-200 text-accent-600 hover:bg-accent-200'
                }`}
            >
                Reviewed
            </button>
        </div>
    );
}