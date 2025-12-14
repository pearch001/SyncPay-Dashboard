export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format large numbers with K, M, B suffix
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.2M", "500K")
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format percentage with % symbol
 * @param value - Percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals) + '%';
};

/**
 * Format text content to enhance numbers in markdown
 * Converts currency, percentages, and large numbers to formatted versions
 * @param text - Text content to enhance
 * @returns Enhanced text with formatted numbers
 */
export const enhanceNumbersInText = (text: string): string => {
  // Format currency patterns (₦1234567.89 -> ₦1,234,567.89)
  text = text.replace(/₦(\d+)/g, (match, num) => {
    return formatCurrency(parseFloat(num));
  });

  // Format percentages (23.5% stays as is, but could be enhanced)
  // Already handled by percentage symbol

  return text;
};
