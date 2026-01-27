/**
 * WhatsApp deep link integration service
 */

import { Linking, Alert, Platform } from 'react-native';
import { Contact, Log } from '../types';
import { normalizePhone } from '../utils/phoneValidator';
import { replacePlaceholders } from '../utils/messageParser';

/**
 * Check if WhatsApp is installed
 */
export const isWhatsAppInstalled = async (): Promise<boolean> => {
  try {
    const url = Platform.OS === 'ios' ? 'whatsapp://' : 'whatsapp://send';
    const supported = await Linking.canOpenURL(url);
    return supported;
  } catch (error) {
    console.error('Error checking WhatsApp installation:', error);
    return false;
  }
};

/**
 * Open WhatsApp with pre-filled message
 */
export const openWhatsApp = async (
  phone: string,
  message: string,
  countryCode: string = '+1'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if WhatsApp is installed
    const installed = await isWhatsAppInstalled();
    if (!installed) {
      return {
        success: false,
        error: 'WhatsApp is not installed on this device',
      };
    }
    
    // Normalize phone number
    const normalizedPhone = normalizePhone(phone, countryCode);
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp deep link
    const url = `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return {
        success: false,
        error: 'Cannot open WhatsApp URL',
      };
    }
    
    await Linking.openURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Send message to a contact via WhatsApp
 */
export const sendToContact = async (
  contact: Contact,
  messageTemplate: string,
  countryCode: string = '+1'
): Promise<Log> => {
  const timestamp = new Date().toISOString();
  
  try {
    // Replace placeholders in message
    const message = replacePlaceholders(messageTemplate, contact);
    
    // Open WhatsApp
    const result = await openWhatsApp(contact.phone, message, countryCode);
    
    if (result.success) {
      return {
        id: `log_${Date.now()}_${contact.id}`,
        contactId: contact.id,
        contactName: contact.name,
        phone: contact.phone,
        message,
        status: 'success',
        timestamp,
      };
    } else {
      return {
        id: `log_${Date.now()}_${contact.id}`,
        contactId: contact.id,
        contactName: contact.name,
        phone: contact.phone,
        message,
        status: 'error',
        timestamp,
        error: result.error,
      };
    }
  } catch (error) {
    return {
      id: `log_${Date.now()}_${contact.id}`,
      contactId: contact.id,
      contactName: contact.name,
      phone: contact.phone,
      message: messageTemplate,
      status: 'error',
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Show WhatsApp not installed alert
 */
export const showWhatsAppNotInstalledAlert = (): void => {
  Alert.alert(
    'WhatsApp Not Installed',
    'Please install WhatsApp to send messages.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Install',
        onPress: () => {
          const storeUrl = Platform.OS === 'ios'
            ? 'https://apps.apple.com/app/whatsapp-messenger/id310633997'
            : 'https://play.google.com/store/apps/details?id=com.whatsapp';
          Linking.openURL(storeUrl);
        },
      },
    ]
  );
};
