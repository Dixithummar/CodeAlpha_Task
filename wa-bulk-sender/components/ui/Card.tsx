/**
 * Card component for WhatsApp-style UI
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../utils/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  darkMode?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, darkMode = false }) => {
  return (
    <View style={[
      styles.card,
      darkMode ? styles.cardDark : styles.cardLight,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: COLORS.background,
  },
  cardDark: {
    backgroundColor: COLORS.surfaceDark,
  },
});
