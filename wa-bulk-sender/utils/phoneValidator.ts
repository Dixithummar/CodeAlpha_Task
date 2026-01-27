/**
 * Phone number validation and normalization utilities
 */

/**
 * Clean phone number by removing all non-digit characters
 */
export const cleanPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Normalize phone number with country code
 */
export const normalizePhone = (phone: string, countryCode: string = '+1'): string => {
  const cleaned = cleanPhone(phone);
  
  // If already has country code, return as is
  if (cleaned.length > 10) {
    return cleaned;
  }
  
  // Add country code
  const code = cleanPhone(countryCode);
  return `${code}${cleaned}`;
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = cleanPhone(phone);
  // Basic validation: at least 10 digits
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Format phone number for display
 */
export const formatPhoneDisplay = (phone: string): string => {
  const cleaned = cleanPhone(phone);
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};
