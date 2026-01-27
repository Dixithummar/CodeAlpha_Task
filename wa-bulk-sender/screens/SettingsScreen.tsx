/**
 * Settings Screen - App configuration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { COLORS } from '../utils/constants';
import { clearAllData } from '../services/storage.service';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, clearContacts, clearLogs } = useAppStore();
  const [countryCode, setCountryCode] = useState(settings.countryCode);
  
  const darkMode = settings.darkMode;
  const bgColor = darkMode ? COLORS.backgroundDark : COLORS.surface;
  const textColor = darkMode ? COLORS.textDark : COLORS.text;
  const secondaryColor = darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  
  const handleSaveCountryCode = () => {
    if (!countryCode.startsWith('+')) {
      Alert.alert('Invalid Format', 'Country code must start with +');
      return;
    }
    updateSettings({ countryCode });
    Alert.alert('Success', 'Country code updated');
  };
  
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all contacts, logs, and templates. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            clearContacts();
            clearLogs();
            Alert.alert('Success', 'All data cleared');
          },
        },
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
        
        <Card darkMode={darkMode}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
          
          <View style={styles.setting}>
            <View>
              <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: secondaryColor }]}>
                Enable dark theme
              </Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSettings({ darkMode: value })}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>
        
        <Card darkMode={darkMode}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Phone Settings</Text>
          
          <View style={styles.setting}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Default Country Code
              </Text>
              <Text style={[styles.settingDescription, { color: secondaryColor }]}>
                Used for phone numbers without country code
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: COLORS.border },
                ]}
                placeholder="+1"
                placeholderTextColor={secondaryColor}
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
              />
              <Button
                title="Save"
                onPress={handleSaveCountryCode}
                style={styles.saveButton}
              />
            </View>
          </View>
        </Card>
        
        <Card darkMode={darkMode}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Auto Send</Text>
          
          <View style={styles.setting}>
            <View>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Enable Auto Send
              </Text>
              <Text style={[styles.settingDescription, { color: secondaryColor }]}>
                Automatically open WhatsApp for each contact
              </Text>
            </View>
            <Switch
              value={settings.autoSend}
              onValueChange={(value) => updateSettings({ autoSend: value })}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.setting}>
            <View>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Send Delay: {settings.sendDelay}s
              </Text>
              <Text style={[styles.settingDescription, { color: secondaryColor }]}>
                Delay between messages (2-10 seconds)
              </Text>
            </View>
          </View>
        </Card>
        
        <Card darkMode={darkMode}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Data Management</Text>
          
          <Button
            title="Clear All Data"
            onPress={handleClearAllData}
            variant="danger"
          />
          
          <Text style={[styles.warning, { color: COLORS.error }]}>
            ⚠️ This will permanently delete all contacts, logs, and templates
          </Text>
        </Card>
        
        <Card darkMode={darkMode}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
          
          <Text style={[styles.aboutText, { color: secondaryColor }]}>
            WA Bulk Sender v1.0.0
          </Text>
          <Text style={[styles.aboutText, { color: secondaryColor }]}>
            A free, open-source bulk WhatsApp messenger
          </Text>
          <Text style={[styles.aboutText, { color: secondaryColor }]}>
            {'\n'}Uses WhatsApp deep links only - no automation
          </Text>
          <Text style={[styles.aboutText, { color: secondaryColor }]}>
            Legally compliant and privacy-focused
          </Text>
        </Card>
        
        <Card darkMode={darkMode}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Legal Notice</Text>
          
          <Text style={[styles.legalText, { color: secondaryColor }]}>
            This app does NOT automate WhatsApp internally. It only uses WhatsApp's
            official deep link feature to pre-fill messages. You must manually press
            SEND in WhatsApp for each message.
            {'\n\n'}
            This ensures compliance with WhatsApp's Terms of Service and prevents
            account bans.
            {'\n\n'}
            Use responsibly and respect privacy laws.
          </Text>
        </Card>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  warning: {
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 14,
    marginBottom: 4,
  },
  legalText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
