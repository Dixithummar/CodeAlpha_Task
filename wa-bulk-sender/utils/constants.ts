/**
 * App constants and theme configuration
 */

export const COLORS = {
  // WhatsApp theme
  primary: '#25D366',
  primaryDark: '#128C7E',
  secondary: '#34B7F1',
  
  // Light mode
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  textSecondary: '#667781',
  border: '#E9EDEF',
  
  // Dark mode
  backgroundDark: '#0B141A',
  surfaceDark: '#1F2C34',
  textDark: '#E9EDEF',
  textSecondaryDark: '#8696A0',
  borderDark: '#2A3942',
  
  // Status colors
  success: '#25D366',
  error: '#DC4C3E',
  warning: '#FFA500',
  info: '#34B7F1',
};

export const STORAGE_KEYS = {
  CONTACTS: '@wa_bulk_sender:contacts',
  TEMPLATES: '@wa_bulk_sender:templates',
  LOGS: '@wa_bulk_sender:logs',
  SETTINGS: '@wa_bulk_sender:settings',
  SENT_CONTACTS: '@wa_bulk_sender:sent_contacts',
};

export const DEFAULT_SETTINGS = {
  autoSend: false,
  sendDelay: 5,
  darkMode: false,
  countryCode: '+1',
};

export const SEND_DELAY_MIN = 2;
export const SEND_DELAY_MAX = 10;

export const PLACEHOLDER_REGEX = /\{([^}]+)\}/g;
