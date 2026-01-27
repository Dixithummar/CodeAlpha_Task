/**
 * Message Screen - Compose and send messages
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { COLORS, SEND_DELAY_MIN, SEND_DELAY_MAX } from '../utils/constants';
import { extractPlaceholders, getPreviewMessage, validateTemplate } from '../utils/messageParser';
import { sendToContact } from '../services/whatsapp.service';
import Slider from '@react-native-community/slider';

export const MessageScreen: React.FC = () => {
  const {
    contacts,
    currentTemplate,
    setCurrentTemplate,
    settings,
    updateSettings,
    addLog,
    updateContact,
    setSendProgress,
  } = useAppStore();
  
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const darkMode = settings.darkMode;
  const bgColor = darkMode ? COLORS.backgroundDark : COLORS.surface;
  const textColor = darkMode ? COLORS.textDark : COLORS.text;
  const secondaryColor = darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  
  const pendingContacts = contacts.filter(c => !c.sent);
  const previewContact = pendingContacts[0];
  const placeholders = extractPlaceholders(currentTemplate);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [countdown]);
  
  const handleSend = async () => {
    const validation = validateTemplate(currentTemplate);
    if (!validation.valid) {
      Alert.alert('Invalid Template', validation.error);
      return;
    }
    
    if (pendingContacts.length === 0) {
      Alert.alert('No Contacts', 'All contacts have been sent messages');
      return;
    }
    
    setSending(true);
    
    for (let i = 0; i < pendingContacts.length; i++) {
      const contact = pendingContacts[i];
      
      setSendProgress({
        current: i + 1,
        total: pendingContacts.length,
        currentContact: contact,
        countdown: settings.autoSend ? settings.sendDelay : 0,
      });
      
      // Send message
      const log = await sendToContact(contact, currentTemplate, settings.countryCode);
      addLog(log);
      
      // Update contact status
      if (log.status === 'success') {
        updateContact(contact.id, { sent: true, sentAt: log.timestamp });
      } else {
        updateContact(contact.id, { error: log.error });
      }
      
      // Wait for delay if auto-send is enabled and not the last contact
      if (settings.autoSend && i < pendingContacts.length - 1) {
        setCountdown(settings.sendDelay);
        await new Promise(resolve => setTimeout(resolve, settings.sendDelay * 1000));
      } else if (!settings.autoSend && i < pendingContacts.length - 1) {
        // Manual mode: wait for user to manually send in WhatsApp
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    setSending(false);
    setSendProgress(null);
    setCountdown(0);
    
    Alert.alert('Complete', 'All messages have been processed');
  };
  
  const handleSendSingle = async () => {
    const validation = validateTemplate(currentTemplate);
    if (!validation.valid) {
      Alert.alert('Invalid Template', validation.error);
      return;
    }
    
    if (!previewContact) {
      Alert.alert('No Contacts', 'No pending contacts available');
      return;
    }
    
    setSending(true);
    
    const log = await sendToContact(previewContact, currentTemplate, settings.countryCode);
    addLog(log);
    
    if (log.status === 'success') {
      updateContact(previewContact.id, { sent: true, sentAt: log.timestamp });
    } else {
      updateContact(previewContact.id, { error: log.error });
    }
    
    setSending(false);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: textColor }]}>Message Composer</Text>
        
        <Card darkMode={darkMode}>
          <Text style={[styles.label, { color: secondaryColor }]}>Message Template</Text>
          <TextInput
            style={[
              styles.textArea,
              { color: textColor, borderColor: COLORS.border },
            ]}
            placeholder="Enter your message here...&#10;&#10;Use {name}, {phone}, or {col1}, {col2} for personalization"
            placeholderTextColor={secondaryColor}
            value={currentTemplate}
            onChangeText={setCurrentTemplate}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          
          {placeholders.length > 0 && (
            <View style={styles.placeholders}>
              <Text style={[styles.placeholderLabel, { color: secondaryColor }]}>
                Placeholders:
              </Text>
              <View style={styles.placeholderList}>
                {placeholders.map((p, i) => (
                  <View key={i} style={styles.placeholderTag}>
                    <Text style={styles.placeholderText}>{`{${p}}`}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Card>
        
        {previewContact && (
          <Card darkMode={darkMode}>
            <Text style={[styles.label, { color: secondaryColor }]}>Preview</Text>
            <Text style={[styles.previewContact, { color: secondaryColor }]}>
              To: {previewContact.name} ({previewContact.phone})
            </Text>
            <View style={styles.previewBubble}>
              <Text style={styles.previewText}>
                {getPreviewMessage(currentTemplate, previewContact)}
              </Text>
            </View>
          </Card>
        )}
        
        <Card darkMode={darkMode}>
          <Text style={[styles.label, { color: secondaryColor }]}>Send Settings</Text>
          
          <View style={styles.setting}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Auto Send</Text>
            <Switch
              value={settings.autoSend}
              onValueChange={(value) => updateSettings({ autoSend: value })}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {settings.autoSend && (
            <View style={styles.setting}>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Delay: {settings.sendDelay}s
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={SEND_DELAY_MIN}
                maximumValue={SEND_DELAY_MAX}
                step={1}
                value={settings.sendDelay}
                onValueChange={(value) => updateSettings({ sendDelay: value })}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.border}
                thumbTintColor={COLORS.primary}
              />
            </View>
          )}
          
          <Text style={[styles.info, { color: secondaryColor }]}>
            {settings.autoSend
              ? `Messages will be sent automatically with ${settings.sendDelay}s delay between each.`
              : 'You will manually press SEND in WhatsApp for each contact.'}
          </Text>
        </Card>
        
        <View style={styles.actions}>
          <Button
            title={`Send to All (${pendingContacts.length})`}
            onPress={handleSend}
            disabled={pendingContacts.length === 0 || sending}
            loading={sending}
          />
          
          {!settings.autoSend && previewContact && (
            <Button
              title="Send to Next Contact"
              onPress={handleSendSingle}
              variant="secondary"
              disabled={sending}
              style={styles.actionButton}
            />
          )}
        </View>
        
        {countdown > 0 && (
          <Card darkMode={darkMode}>
            <Text style={[styles.countdownText, { color: COLORS.primary }]}>
              Next message in {countdown}s...
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 150,
  },
  placeholders: {
    marginTop: 12,
  },
  placeholderLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  placeholderList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  placeholderTag: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  placeholderText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  previewContact: {
    fontSize: 12,
    marginBottom: 8,
  },
  previewBubble: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
  },
  previewText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  slider: {
    flex: 1,
    marginLeft: 16,
  },
  info: {
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    marginTop: 8,
  },
  countdownText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
