/**
 * Message template parsing and placeholder replacement
 */

import { Contact } from '../types';
import { PLACEHOLDER_REGEX } from './constants';

/**
 * Extract placeholders from message template
 */
export const extractPlaceholders = (template: string): string[] => {
  const matches = template.match(PLACEHOLDER_REGEX);
  if (!matches) return [];
  
  return matches.map(match => match.slice(1, -1)); // Remove { }
};

/**
 * Replace placeholders in message with contact data
 */
export const replacePlaceholders = (template: string, contact: Contact): string => {
  let message = template;
  
  // Replace {name}
  message = message.replace(/\{name\}/gi, contact.name || '');
  
  // Replace {phone}
  message = message.replace(/\{phone\}/gi, contact.phone || '');
  
  // Replace custom fields like {col1}, {col2}, etc.
  if (contact.customFields) {
    Object.entries(contact.customFields).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'gi');
      message = message.replace(regex, value || '');
    });
  }
  
  return message;
};

/**
 * Validate message template
 */
export const validateTemplate = (template: string): { valid: boolean; error?: string } => {
  if (!template || template.trim().length === 0) {
    return { valid: false, error: 'Message template cannot be empty' };
  }
  
  if (template.length > 1000) {
    return { valid: false, error: 'Message is too long (max 1000 characters)' };
  }
  
  return { valid: true };
};

/**
 * Get preview message for a contact
 */
export const getPreviewMessage = (template: string, contact?: Contact): string => {
  if (!contact) {
    return template;
  }
  
  return replacePlaceholders(template, contact);
};
