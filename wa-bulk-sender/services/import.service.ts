/**
 * Contact import service for CSV/XLSX files
 */

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { Contact } from '../types';

export interface ImportedData {
  headers: string[];
  rows: any[][];
  preview: any[][];
}

/**
 * Pick a document (CSV or XLSX)
 */
export const pickDocument = async (): Promise<DocumentPicker.DocumentPickerResult> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      copyToCacheDirectory: true,
    });
    
    return result;
  } catch (error) {
    console.error('Error picking document:', error);
    throw error;
  }
};

/**
 * Read and parse CSV file
 */
const parseCSV = (content: string): ImportedData => {
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('File is empty');
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).map(line => {
    return line.split(',').map(cell => cell.trim().replace(/"/g, ''));
  });
  
  const preview = rows.slice(0, 3);
  
  return { headers, rows, preview };
};

/**
 * Read and parse XLSX file
 */
const parseXLSX = (content: string): ImportedData => {
  const workbook = XLSX.read(content, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  if (jsonData.length === 0) {
    throw new Error('File is empty');
  }
  
  const headers = jsonData[0].map(h => String(h).trim());
  const rows = jsonData.slice(1);
  const preview = rows.slice(0, 3);
  
  return { headers, rows, preview };
};

/**
 * Import and parse file
 */
export const importFile = async (uri: string, mimeType?: string): Promise<ImportedData> => {
  try {
    const content = await FileSystem.readAsStringAsync(uri);
    
    if (mimeType?.includes('csv') || uri.endsWith('.csv')) {
      return parseCSV(content);
    } else {
      return parseXLSX(content);
    }
  } catch (error) {
    console.error('Error importing file:', error);
    throw error;
  }
};

/**
 * Convert imported data to contacts
 */
export const convertToContacts = (
  data: ImportedData,
  nameColumnIndex: number,
  phoneColumnIndex: number
): Contact[] => {
  const contacts: Contact[] = [];
  
  data.rows.forEach((row, index) => {
    const name = row[nameColumnIndex]?.toString().trim();
    const phone = row[phoneColumnIndex]?.toString().trim();
    
    if (!name || !phone) {
      return; // Skip invalid rows
    }
    
    // Create custom fields for all other columns
    const customFields: Record<string, string> = {};
    data.headers.forEach((header, colIndex) => {
      if (colIndex !== nameColumnIndex && colIndex !== phoneColumnIndex) {
        const value = row[colIndex]?.toString().trim() || '';
        customFields[`col${colIndex + 1}`] = value;
        customFields[header.toLowerCase().replace(/\s+/g, '_')] = value;
      }
    });
    
    contacts.push({
      id: `contact_${Date.now()}_${index}`,
      name,
      phone,
      customFields,
      sent: false,
    });
  });
  
  return contacts;
};

/**
 * Remove duplicate contacts by phone number
 */
export const removeDuplicates = (contacts: Contact[]): Contact[] => {
  const seen = new Set<string>();
  return contacts.filter(contact => {
    const phone = contact.phone.replace(/\D/g, '');
    if (seen.has(phone)) {
      return false;
    }
    seen.add(phone);
    return true;
  });
};
