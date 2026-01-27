/**
 * Logs Screen - View success and error logs
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { LogItem } from '../components/LogItem';
import { Button } from '../components/ui/Button';
import { COLORS } from '../utils/constants';
import { sendToContact } from '../services/whatsapp.service';

type TabType = 'all' | 'success' | 'error';

export const LogsScreen: React.FC = () => {
  const { logs, clearLogs, addLog, updateContact, contacts, currentTemplate, settings } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [retrying, setRetrying] = useState(false);
  
  const darkMode = settings.darkMode;
  const bgColor = darkMode ? COLORS.backgroundDark : COLORS.surface;
  const textColor = darkMode ? COLORS.textDark : COLORS.text;
  const secondaryColor = darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  
  const filteredLogs = logs.filter(log => {
    if (activeTab === 'all') return true;
    return log.status === activeTab;
  });
  
  const errorLogs = logs.filter(l => l.status === 'error');
  
  const handleClearLogs = () => {
    Alert.alert(
      'Clear Logs',
      'Are you sure you want to clear all logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearLogs },
      ]
    );
  };
  
  const handleRetryFailed = async () => {
    if (errorLogs.length === 0) {
      Alert.alert('No Errors', 'There are no failed messages to retry');
      return;
    }
    
    if (!currentTemplate) {
      Alert.alert('No Template', 'Please create a message template first');
      return;
    }
    
    Alert.alert(
      'Retry Failed Messages',
      `Retry sending to ${errorLogs.length} failed contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retry',
          onPress: async () => {
            setRetrying(true);
            
            for (const errorLog of errorLogs) {
              const contact = contacts.find(c => c.id === errorLog.contactId);
              if (!contact) continue;
              
              const log = await sendToContact(contact, currentTemplate, settings.countryCode);
              addLog(log);
              
              if (log.status === 'success') {
                updateContact(contact.id, { sent: true, sentAt: log.timestamp, error: undefined });
              } else {
                updateContact(contact.id, { error: log.error });
              }
              
              // Small delay between retries
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            setRetrying(false);
            Alert.alert('Complete', 'Retry process completed');
          },
        },
      ]
    );
  };
  
  const Tab = ({ type, label }: { type: TabType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === type && styles.activeTab,
      ]}
      onPress={() => setActiveTab(type)}
    >
      <Text
        style={[
          styles.tabText,
          { color: activeTab === type ? COLORS.primary : secondaryColor },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Activity Logs</Text>
        
        <View style={styles.tabs}>
          <Tab type="all" label={`All (${logs.length})`} />
          <Tab type="success" label={`Success (${logs.filter(l => l.status === 'success').length})`} />
          <Tab type="error" label={`Errors (${errorLogs.length})`} />
        </View>
        
        <View style={styles.actions}>
          {errorLogs.length > 0 && (
            <Button
              title="Retry Failed"
              onPress={handleRetryFailed}
              variant="secondary"
              loading={retrying}
              style={styles.actionButton}
            />
          )}
          {logs.length > 0 && (
            <Button
              title="Clear Logs"
              onPress={handleClearLogs}
              variant="danger"
              style={styles.actionButton}
            />
          )}
        </View>
      </View>
      
      {filteredLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: secondaryColor }]}>
            {activeTab === 'all'
              ? 'No logs yet. Send some messages to see activity here.'
              : `No ${activeTab} logs.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LogItem log={item} darkMode={darkMode} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
