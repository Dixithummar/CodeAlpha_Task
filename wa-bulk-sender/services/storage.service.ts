/**
 * AsyncStorage service for local data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, MessageTemplate, Log, AppSettings } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

/**
 * Generic storage operations
 */
const saveData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    throw error;
  }
};

const getData = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return defaultValue;
  }
};

const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Contacts storage
 */
export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  await saveData(STORAGE_KEYS.CONTACTS, contacts);
};

export const getContacts = async (): Promise<Contact[]> => {
  return await getData<Contact[]>(STORAGE_KEYS.CONTACTS, []);
};

export const clearContacts = async (): Promise<void> => {
  await removeData(STORAGE_KEYS.CONTACTS);
};

/**
 * Templates storage
 */
export const saveTemplates = async (templates: MessageTemplate[]): Promise<void> => {
  await saveData(STORAGE_KEYS.TEMPLATES, templates);
};

export const getTemplates = async (): Promise<MessageTemplate[]> => {
  return await getData<MessageTemplate[]>(STORAGE_KEYS.TEMPLATES, []);
};

/**
 * Logs storage
 */
export const saveLogs = async (logs: Log[]): Promise<void> => {
  await saveData(STORAGE_KEYS.LOGS, logs);
};

export const getLogs = async (): Promise<Log[]> => {
  return await getData<Log[]>(STORAGE_KEYS.LOGS, []);
};

export const clearLogs = async (): Promise<void> => {
  await removeData(STORAGE_KEYS.LOGS);
};

/**
 * Settings storage
 */
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await saveData(STORAGE_KEYS.SETTINGS, settings);
};

export const getSettings = async (): Promise<AppSettings> => {
  return await getData<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
};

/**
 * Sent contacts tracking
 */
export const saveSentContacts = async (sentIds: string[]): Promise<void> => {
  await saveData(STORAGE_KEYS.SENT_CONTACTS, sentIds);
};

export const getSentContacts = async (): Promise<string[]> => {
  return await getData<string[]>(STORAGE_KEYS.SENT_CONTACTS, []);
};

export const clearSentContacts = async (): Promise<void> => {
  await removeData(STORAGE_KEYS.SENT_CONTACTS);
};

/**
 * Clear all app data
 */
export const clearAllData = async (): Promise<void> => {
  await Promise.all([
    clearContacts(),
    clearLogs(),
    clearSentContacts(),
  ]);
};
