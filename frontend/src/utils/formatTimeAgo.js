export function formatTimeAgo(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdDate; // difference in milliseconds

    const msInMinute = 1000 * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;
    const msInWeek = msInDay * 7;
    const msInMonth = msInDay * 30; // approximate month
    const msInYear = msInDay * 365;
    
    if (diffMs < msInMinute) return "now";
    if (diffMs < msInHour) {
        const minutes = Math.floor(diffMs / msInMinute);
        return minutes <= 1 ? "1 minute" : `${minutes} minutes`;
    } else if (diffMs < msInDay) {
        const hours = Math.floor(diffMs / msInHour);
        return hours === 1 ? "1 hour" : `${hours} hours`;
    } else if (diffMs < msInWeek) {
        const days = Math.floor(diffMs / msInDay);
        return days === 1 ? "1 day" : `${days} days`;
    } else if (diffMs < msInMonth) {
        const weeks = Math.floor(diffMs / msInWeek);
        return weeks === 1 ? "1 week" : `${weeks} weeks`;
    } else if (diffMs < msInYear) {
        const months = Math.floor(diffMs / msInMonth);
        return months === 1 ? "1 month" : `${months} months`;
    } else {
        const years = Math.floor(diffMs / msInYear);
        return years === 1 ? "1 year" : `${years} years`;
    }
}