export const formatTimeAgo = (dateString: string) => {
    const now: number = Date.now();
    const createdTime: number = new Date(dateString).getTime();
    const timeDifference: number = Math.floor((now - createdTime) / 1000);

    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    }

    for (const unit in intervals) {
        const intervalValue = intervals[unit];
        const count = Math.floor(timeDifference / intervalValue);

        if (count >= 1) {
            const unitName = count === 1 ? unit : unit + 's';
            return `${count} ${unitName} ago`;
        }
    }

    return "just now";
};