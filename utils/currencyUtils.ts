// Currency utility functions for Receipt Scanner App

/**
 * Comprehensive list of world currencies (ISO 4217)
 * Includes major currencies and popular regional currencies
 */
export const CURRENCIES = {
  // Major currencies
  USD: { symbol: '$', code: 'USD', name: 'US Dollar', country: 'United States' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro', country: 'European Union' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound', country: 'United Kingdom' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen', country: 'Japan' },
  CNY: { symbol: '¥', code: 'CNY', name: 'Chinese Yuan', country: 'China' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee', country: 'India' },
  BRL: { symbol: 'R$', code: 'BRL', name: 'Brazilian Real', country: 'Brazil' },
  RUB: { symbol: '₽', code: 'RUB', name: 'Russian Ruble', country: 'Russia' },
  KRW: { symbol: '₩', code: 'KRW', name: 'South Korean Won', country: 'South Korea' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', country: 'Australia' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', country: 'Canada' },
  CHF: { symbol: 'CHF', code: 'CHF', name: 'Swiss Franc', country: 'Switzerland' },
  MXN: { symbol: 'MX$', code: 'MXN', name: 'Mexican Peso', country: 'Mexico' },
  SEK: { symbol: 'kr', code: 'SEK', name: 'Swedish Krona', country: 'Sweden' },
  NOK: { symbol: 'kr', code: 'NOK', name: 'Norwegian Krone', country: 'Norway' },
  NZD: { symbol: 'NZ$', code: 'NZD', name: 'New Zealand Dollar', country: 'New Zealand' },
  SGD: { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar', country: 'Singapore' },
  HKD: { symbol: 'HK$', code: 'HKD', name: 'Hong Kong Dollar', country: 'Hong Kong' },
  TRY: { symbol: '₺', code: 'TRY', name: 'Turkish Lira', country: 'Turkey' },
  ZAR: { symbol: 'R', code: 'ZAR', name: 'South African Rand', country: 'South Africa' },
  // Additional major currencies
  PLN: { symbol: 'zł', code: 'PLN', name: 'Polish Złoty', country: 'Poland' },
  THB: { symbol: '฿', code: 'THB', name: 'Thai Baht', country: 'Thailand' },
  IDR: { symbol: 'Rp', code: 'IDR', name: 'Indonesian Rupiah', country: 'Indonesia' },
  MYR: { symbol: 'RM', code: 'MYR', name: 'Malaysian Ringgit', country: 'Malaysia' },
  PHP: { symbol: '₱', code: 'PHP', name: 'Philippine Peso', country: 'Philippines' },
  VND: { symbol: '₫', code: 'VND', name: 'Vietnamese Dong', country: 'Vietnam' },
  ILS: { symbol: '₪', code: 'ILS', name: 'Israeli Shekel', country: 'Israel' },
  AED: { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham', country: 'United Arab Emirates' },
  SAR: { symbol: '﷼', code: 'SAR', name: 'Saudi Riyal', country: 'Saudi Arabia' },
  PKR: { symbol: '₨', code: 'PKR', name: 'Pakistani Rupee', country: 'Pakistan' },
  BDT: { symbol: '৳', code: 'BDT', name: 'Bangladeshi Taka', country: 'Bangladesh' },
  EGP: { symbol: '£', code: 'EGP', name: 'Egyptian Pound', country: 'Egypt' },
  NGN: { symbol: '₦', code: 'NGN', name: 'Nigerian Naira', country: 'Nigeria' },
  KES: { symbol: 'KSh', code: 'KES', name: 'Kenyan Shilling', country: 'Kenya' },
  ARS: { symbol: '$', code: 'ARS', name: 'Argentine Peso', country: 'Argentina' },
  CLP: { symbol: '$', code: 'CLP', name: 'Chilean Peso', country: 'Chile' },
  COP: { symbol: '$', code: 'COP', name: 'Colombian Peso', country: 'Colombia' },
  PEN: { symbol: 'S/', code: 'PEN', name: 'Peruvian Sol', country: 'Peru' },
  // European currencies
  DKK: { symbol: 'kr', code: 'DKK', name: 'Danish Krone', country: 'Denmark' },
  CZK: { symbol: 'Kč', code: 'CZK', name: 'Czech Koruna', country: 'Czech Republic' },
  HUF: { symbol: 'Ft', code: 'HUF', name: 'Hungarian Forint', country: 'Hungary' },
  RON: { symbol: 'lei', code: 'RON', name: 'Romanian Leu', country: 'Romania' },
  MDL: { symbol: 'lei', code: 'MDL', name: 'Moldovan Leu', country: 'Moldova' },
  BGN: { symbol: 'лв', code: 'BGN', name: 'Bulgarian Lev', country: 'Bulgaria' },
  HRK: { symbol: 'kn', code: 'HRK', name: 'Croatian Kuna', country: 'Croatia' },
  // Asian currencies
  TWD: { symbol: 'NT$', code: 'TWD', name: 'Taiwan Dollar', country: 'Taiwan' },
  HNL: { symbol: 'L', code: 'HNL', name: 'Honduran Lempira', country: 'Honduras' },
  // Middle East
  IRR: { symbol: '﷼', code: 'IRR', name: 'Iranian Rial', country: 'Iran' },
  IQD: { symbol: 'ع.د', code: 'IQD', name: 'Iraqi Dinar', country: 'Iraq' },
  JOD: { symbol: 'د.ا', code: 'JOD', name: 'Jordanian Dinar', country: 'Jordan' },
  KWD: { symbol: 'د.ك', code: 'KWD', name: 'Kuwaiti Dinar', country: 'Kuwait' },
  LBP: { symbol: '£', code: 'LBP', name: 'Lebanese Pound', country: 'Lebanon' },
  OMR: { symbol: '﷼', code: 'OMR', name: 'Omani Rial', country: 'Oman' },
  QAR: { symbol: '﷼', code: 'QAR', name: 'Qatari Riyal', country: 'Qatar' },
  // African currencies
  ETB: { symbol: 'Br', code: 'ETB', name: 'Ethiopian Birr', country: 'Ethiopia' },
  GHS: { symbol: '₵', code: 'GHS', name: 'Ghanaian Cedi', country: 'Ghana' },
  UGX: { symbol: 'USh', code: 'UGX', name: 'Ugandan Shilling', country: 'Uganda' },
  TZS: { symbol: 'TSh', code: 'TZS', name: 'Tanzanian Shilling', country: 'Tanzania' },
  MAD: { symbol: 'د.م.', code: 'MAD', name: 'Moroccan Dirham', country: 'Morocco' },
  // Other currencies
  UAH: { symbol: '₴', code: 'UAH', name: 'Ukrainian Hryvnia', country: 'Ukraine' },
  KZT: { symbol: '₸', code: 'KZT', name: 'Kazakhstani Tenge', country: 'Kazakhstan' },
  UZS: { symbol: 'so\'m', code: 'UZS', name: 'Uzbekistani Som', country: 'Uzbekistan' },
  BYN: { symbol: 'Br', code: 'BYN', name: 'Belarusian Ruble', country: 'Belarus' },
  GEL: { symbol: '₾', code: 'GEL', name: 'Georgian Lari', country: 'Georgia' },
  AMD: { symbol: '֏', code: 'AMD', name: 'Armenian Dram', country: 'Armenia' },
  AZN: { symbol: '₼', code: 'AZN', name: 'Azerbaijani Manat', country: 'Azerbaijan' },
  KGS: { symbol: 'с', code: 'KGS', name: 'Kyrgyzstani Som', country: 'Kyrgyzstan' },
  TJS: { symbol: 'SM', code: 'TJS', name: 'Tajikistani Somoni', country: 'Tajikistan' },
  TMT: { symbol: 'm', code: 'TMT', name: 'Turkmenistani Manat', country: 'Turkmenistan' },
  ISK: { symbol: 'kr', code: 'ISK', name: 'Icelandic Króna', country: 'Iceland' },
  RSD: { symbol: 'дин', code: 'RSD', name: 'Serbian Dinar', country: 'Serbia' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

/**
 * Default currency settings
 */
export const DEFAULT_CURRENCY = CURRENCIES.USD;

/**
 * Format currency for display
 */
export const formatCurrency = {
  // Basic format: $123.45
  basic: (amount: number, currency: CurrencyCode = 'USD'): string => {
    const currencyInfo = CURRENCIES[currency];
    return `${currencyInfo.symbol}${amount.toFixed(2)}`;
  },

  // With thousands separator: $1,234.56
  withSeparator: (amount: number, currency: CurrencyCode = 'USD'): string => {
    const currencyInfo = CURRENCIES[currency];
    const formatted = amount.toFixed(2);
    // Add thousands separator
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${currencyInfo.symbol}${parts.join('.')}`;
  },

  // Compact format: $1.2K, $1.2M
  compact: (amount: number, currency: CurrencyCode = 'USD'): string => {
    const currencyInfo = CURRENCIES[currency];
    
    if (amount >= 1000000) {
      return `${currencyInfo.symbol}${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${currencyInfo.symbol}${(amount / 1000).toFixed(1)}K`;
    }
    
    return formatCurrency.basic(amount, currency);
  },

  // With sign: +$123.45 or -$123.45
  withSign: (amount: number, currency: CurrencyCode = 'USD'): string => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${formatCurrency.basic(Math.abs(amount), currency)}`;
  },

  // For input fields (no symbol): 123 or 123.45
  // Only shows decimal places if the amount actually has them — no forced .00
  forInput: (amount: number): string => {
    if (Number.isInteger(amount)) return amount.toString();
    return parseFloat(amount.toFixed(2)).toString();
  },

  // Detailed format: $123.45 USD
  detailed: (amount: number, currency: CurrencyCode = 'USD'): string => {
    const currencyInfo = CURRENCIES[currency];
    const formatted = amount.toFixed(2);
    // Add thousands separator
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${currencyInfo.symbol}${parts.join('.')} ${currencyInfo.code}`;
  },
};

/**
 * Parse currency from string
 */
export const parseCurrency = {
  // Parse from formatted string: "$123.45" -> 123.45
  fromString: (value: string): number => {
    // Remove all non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  },

  // Parse from input field: "123.45" -> 123.45
  fromInput: (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  },

  // Parse with validation
  fromStringSafe: (value: string): { amount: number; isValid: boolean } => {
    const amount = parseCurrency.fromString(value);
    return {
      amount,
      isValid: !isNaN(amount) && amount >= 0,
    };
  },
};

/**
 * Currency validation functions
 */
export const validateCurrency = {
  // Check if amount is valid
  isValid: (amount: number): boolean => {
    return !isNaN(amount) && isFinite(amount);
  },

  // Check if amount is positive
  isPositive: (amount: number): boolean => {
    return validateCurrency.isValid(amount) && amount > 0;
  },

  // Check if amount is non-negative
  isNonNegative: (amount: number): boolean => {
    return validateCurrency.isValid(amount) && amount >= 0;
  },

  // Check if amount is within range
  isInRange: (amount: number, min: number, max: number): boolean => {
    return validateCurrency.isValid(amount) && amount >= min && amount <= max;
  },

  // Check if string is valid currency format
  isValidString: (value: string): boolean => {
    const { isValid } = parseCurrency.fromStringSafe(value);
    return isValid;
  },
};

/**
 * Currency calculation functions
 */
export const calculateCurrency = {
  // Add two amounts
  add: (amount1: number, amount2: number): number => {
    return amount1 + amount2;
  },

  // Subtract two amounts
  subtract: (amount1: number, amount2: number): number => {
    return amount1 - amount2;
  },

  // Multiply amount by factor
  multiply: (amount: number, factor: number): number => {
    return amount * factor;
  },

  // Divide amount by divisor
  divide: (amount: number, divisor: number): number => {
    return divisor !== 0 ? amount / divisor : 0;
  },

  // Calculate percentage
  percentage: (amount: number, percent: number): number => {
    return (amount * percent) / 100;
  },

  // Calculate tax
  calculateTax: (amount: number, taxRate: number): number => {
    return calculateCurrency.percentage(amount, taxRate);
  },

  // Calculate total with tax
  totalWithTax: (amount: number, taxRate: number): number => {
    return amount + calculateCurrency.calculateTax(amount, taxRate);
  },

  // Round to nearest cent
  roundToCent: (amount: number): number => {
    return Math.round(amount * 100) / 100;
  },
};

/**
 * Currency formatting for different contexts
 */
export const formatCurrencyForContext = {
  // For receipt cards (compact)
  receiptCard: (amount: number, currency: CurrencyCode = 'USD'): string => {
    return formatCurrency.withSeparator(amount, currency);
  },

  // For receipt details (detailed)
  receiptDetail: (amount: number, currency: CurrencyCode = 'USD'): string => {
    return formatCurrency.detailed(amount, currency);
  },

  // For input fields (basic)
  input: (amount: number): string => {
    return formatCurrency.forInput(amount);
  },

  // For totals (with separator)
  total: (amount: number, currency: CurrencyCode = 'USD'): string => {
    return formatCurrency.withSeparator(amount, currency);
  },

  // For analytics (compact)
  analytics: (amount: number, currency: CurrencyCode = 'USD'): string => {
    return formatCurrency.compact(amount, currency);
  },
};

/**
 * Currency conversion utilities (placeholder for future implementation)
 */
export const convertCurrency = {
  // Convert between currencies (requires exchange rate API)
  convert: (amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode, rate: number): number => {
    return amount * rate;
  },

  // Get exchange rate (placeholder)
  getExchangeRate: async (fromCurrency: CurrencyCode, toCurrency: CurrencyCode): Promise<number> => {
    // This would typically call an external API
    // For now, return 1 for same currency, 0.85 for USD to EUR
    if (fromCurrency === toCurrency) return 1;
    if (fromCurrency === 'USD' && toCurrency === 'EUR') return 0.85;
    if (fromCurrency === 'EUR' && toCurrency === 'USD') return 1.18;
    return 1; // Default fallback
  },
};

/**
 * Currency constants
 */
export const currencyConstants = {
  // Common amounts
  ZERO: 0,
  ONE_DOLLAR: 1,
  TEN_DOLLARS: 10,
  HUNDRED_DOLLARS: 100,
  THOUSAND_DOLLARS: 1000,

  // Tax rates (as percentages)
  TAX_RATES: {
    STANDARD: 8.25, // Common sales tax rate
    HIGH: 10.0,
    LOW: 5.0,
    ZERO: 0.0,
  },

  // Currency precision
  PRECISION: {
    CENTS: 2,
    DECIMAL_PLACES: 2,
  },
};

/**
 * Helper function to format currency based on amount size
 */
export const smartFormatCurrency = (amount: number, currency: CurrencyCode = 'USD'): string => {
  if (amount >= 1000000) {
    return formatCurrency.compact(amount, currency);
  }
  if (amount >= 1000) {
    return formatCurrency.withSeparator(amount, currency);
  }
  return formatCurrency.basic(amount, currency);
};

/**
 * Helper function to get currency symbol
 */
export const getCurrencySymbol = (currency: CurrencyCode = 'USD'): string => {
  return CURRENCIES[currency].symbol;
};

/**
 * Helper function to validate and format currency input
 */
export const validateAndFormatInput = (input: string): { 
  formatted: string; 
  amount: number; 
  isValid: boolean 
} => {
  const { amount, isValid } = parseCurrency.fromStringSafe(input);
  return {
    formatted: isValid ? formatCurrency.forInput(amount) : input,
    amount,
    isValid,
  };
};
