/**
 * Zustand global state management store
 */

import { create } from 'zustand';
import { Contact, MessageTemplate, Log, AppSettings, DashboardStats, SendProgress } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';
import * as StorageService from '../services/storage.service';

interface AppState {
  // Data
  contacts: Contact[];
  templates: MessageTemplate[];
  logs: Log[];
  settings: AppSettings;
  currentTemplate: string;
  
  // UI State
  sendProgress: SendProgress | null;
  isLoading: boolean;
  
  // Actions - Contacts
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  clearContacts: () => void;
  loadContacts: () => Promise<void>;
  
  // Actions - Templates
  setTemplates: (templates: MessageTemplate[]) => void;
  addTemplate: (template: MessageTemplate) => void;
  deleteTemplate: (id: string) => void;
  setCurrentTemplate: (content: string) => void;
  loadTemplates: () => Promise<void>;
  
  // Actions - Logs
  setLogs: (logs: Log[]) => void;
  addLog: (log: Log) => void;
  clearLogs: () => void;
  loadLogs: () => Promise<void>;
  
  // Actions - Settings
  setSettings: (settings: AppSettings) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  loadSettings: () => Promise<void>;
  
  // Actions - Send Progress
  setSendProgress: (progress: SendProgress | null) => void;
  
  // Actions - Stats
  getStats: () => DashboardStats;
  
  // Actions - Init
  initializeApp: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  contacts: [],
  templates: [],
  logs: [],
  settings: DEFAULT_SETTINGS,
  currentTemplate: '',
  sendProgress: null,
  isLoading: false,
  
  // Contacts actions
  setContacts: (contacts) => {
    set({ contacts });
    StorageService.saveContacts(contacts);
  },
  
  addContact: (contact) => {
    const contacts = [...get().contacts, contact];
    set({ contacts });
    StorageService.saveContacts(contacts);
  },
  
  updateContact: (id, updates) => {
    const contacts = get().contacts.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    set({ contacts });
    StorageService.saveContacts(contacts);
  },
  
  deleteContact: (id) => {
    const contacts = get().contacts.filter(c => c.id !== id);
    set({ contacts });
    StorageService.saveContacts(contacts);
  },
  
  clearContacts: () => {
    set({ contacts: [] });
    StorageService.clearContacts();
    StorageService.clearSentContacts();
  },
  
  loadContacts: async () => {
    const contacts = await StorageService.getContacts();
    set({ contacts });
  },
  
  // Templates actions
  setTemplates: (templates) => {
    set({ templates });
    StorageService.saveTemplates(templates);
  },
  
  addTemplate: (template) => {
    const templates = [...get().templates, template];
    set({ templates });
    StorageService.saveTemplates(templates);
  },
  
  deleteTemplate: (id) => {
    const templates = get().templates.filter(t => t.id !== id);
    set({ templates });
    StorageService.saveTemplates(templates);
  },
  
  setCurrentTemplate: (content) => {
    set({ currentTemplate: content });
  },
  
  loadTemplates: async () => {
    const templates = await StorageService.getTemplates();
    set({ templates });
  },
  
  // Logs actions
  setLogs: (logs) => {
    set({ logs });
    StorageService.saveLogs(logs);
  },
  
  addLog: (log) => {
    const logs = [log, ...get().logs]; // Add to beginning
    set({ logs });
    StorageService.saveLogs(logs);
  },
  
  clearLogs: () => {
    set({ logs: [] });
    StorageService.clearLogs();
  },
  
  loadLogs: async () => {
    const logs = await StorageService.getLogs();
    set({ logs });
  },
  
  // Settings actions
  setSettings: (settings) => {
    set({ settings });
    StorageService.saveSettings(settings);
  },
  
  updateSettings: (updates) => {
    const settings = { ...get().settings, ...updates };
    set({ settings });
    StorageService.saveSettings(settings);
  },
  
  loadSettings: async () => {
    const settings = await StorageService.getSettings();
    set({ settings });
  },
  
  // Send progress
  setSendProgress: (progress) => {
    set({ sendProgress: progress });
  },
  
  // Stats
  getStats: () => {
    const { contacts, logs } = get();
    const total = contacts.length;
    const sent = contacts.filter(c => c.sent).length;
    const pending = total - sent;
    const errors = logs.filter(l => l.status === 'error').length;
    
    return { total, sent, pending, errors };
  },
  
  // Initialize app
  initializeApp: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        get().loadContacts(),
        get().loadTemplates(),
        get().loadLogs(),
        get().loadSettings(),
      ]);
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
