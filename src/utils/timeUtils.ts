/**
 * Format timestamp to relative time
 * @param date - Date to format
 * @returns Relative time string (e.g., "Just now", "2 min ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 10) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return diffInMinutes === 1 ? '1 min ago' : `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;

  // For older messages, show the actual date
  return formatFullDate(date);
};

/**
 * Format full timestamp with date and time
 * @param date - Date to format
 * @returns Full timestamp string (e.g., "Dec 14, 2024 3:45 PM")
 */
export const formatFullTimestamp = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date only
 * @param date - Date to format
 * @returns Date string (e.g., "Dec 14, 2024")
 */
export const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Get date label for grouping messages
 * @param date - Date to check
 * @returns "Today", "Yesterday", or formatted date
 */
export const getDateLabel = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(date);
  messageDate.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) return 'Today';
  if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday';

  return formatFullDate(date);
};
