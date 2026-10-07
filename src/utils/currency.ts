export const CURRENCY_CODE = 'KES';
export const CURRENCY_SYMBOL = 'KSh';

/**
 * Formats a numeric amount into Kenyan Shillings (e.g., KSh 85,000)
 */
export const formatKES = (amount: number): string => {
  return `${CURRENCY_SYMBOL} ${amount.toLocaleString()}`;
};
