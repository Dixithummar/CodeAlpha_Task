/**
 * Core TypeScript types for WA Bulk Sender
 */

export interface Contact {
  id: string;
  name: string;
  phone: string;
  customFields?: Record<string, string>;
  sent?: boolean;
  sentAt?: string;
  error?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Log {
  id: string;
  contactId: string;
  contactName: string;
  phone: string;
  message: string;
  status: 'success' | 'error';
  timestamp: string;
  error?: string;
}

export interface AppSettings {
  autoSend: boolean;
  sendDelay: number; // in seconds (2-10)
  darkMode: boolean;
  countryCode: string;
}

export interface ImportMapping {
  nameColumn: string;
  phoneColumn: string;
  customColumns: string[];
}

export interface DashboardStats {
  total: number;
  sent: number;
  pending: number;
  errors: number;
}

export interface SendProgress {
  current: number;
  total: number;
  currentContact?: Contact;
  countdown?: number;
}
