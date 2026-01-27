/**
 * Contact card component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Contact } from '../types';
import { Card } from './ui/Card';
import { COLORS } from '../utils/constants';
import { formatPhoneDisplay } from '../utils/phoneValidator';

interface ContactCardProps {
  contact: Contact;
  onPress?: () => void;
  onDelete?: () => void;
  darkMode?: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onPress,
  onDelete,
  darkMode = false,
}) => {
  const textColor = darkMode ? COLORS.textDark : COLORS.text;
  const secondaryColor = darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card darkMode={darkMode} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text style={[styles.name, { color: textColor }]}>{contact.name}</Text>
            <Text style={[styles.phone, { color: secondaryColor }]}>
              {formatPhoneDisplay(contact.phone)}
            </Text>
          </View>
          
          <View style={styles.status}>
            {contact.sent ? (
              <View style={styles.sentBadge}>
                <Text style={styles.sentText}>✓ Sent</Text>
              </View>
            ) : (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            )}
          </View>
        </View>
        
        {contact.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {contact.error}</Text>
          </View>
        )}
        
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
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
  status: {
    marginLeft: 12,
  },
  sentBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: COLORS.error + '20',
    borderRadius: 6,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
});
