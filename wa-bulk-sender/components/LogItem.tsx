/**
 * Log item component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Log } from '../types';
import { Card } from './ui/Card';
import { COLORS } from '../utils/constants';
import { formatPhoneDisplay } from '../utils/phoneValidator';

interface LogItemProps {
  log: Log;
  darkMode?: boolean;
}

export const LogItem: React.FC<LogItemProps> = ({ log, darkMode = false }) => {
  const textColor = darkMode ? COLORS.textDark : COLORS.text;
  const secondaryColor = darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <Card darkMode={darkMode} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: textColor }]}>{log.contactName}</Text>
          <Text style={[styles.phone, { color: secondaryColor }]}>
            {formatPhoneDisplay(log.phone)}
          </Text>
        </View>
        
        <View style={styles.status}>
          {log.status === 'success' ? (
            <View style={styles.successBadge}>
              <Text style={styles.successText}>✓</Text>
            </View>
          ) : (
            <View style={styles.errorBadge}>
              <Text style={styles.errorText}>✗</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={[styles.time, { color: secondaryColor }]}>
        {formatTime(log.timestamp)}
      </Text>
      
      {log.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{log.error}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
  status: {
    marginLeft: 12,
  },
  successBadge: {
    backgroundColor: COLORS.success,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorBadge: {
    backgroundColor: COLORS.error,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: COLORS.error + '20',
    borderRadius: 6,
  },
  errorMessage: {
    color: COLORS.error,
    fontSize: 12,
  },
});
