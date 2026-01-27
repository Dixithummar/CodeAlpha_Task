/**
 * Dashboard Screen - Shows stats and progress
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { COLORS } from '../utils/constants';

const { width } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const { getStats, sendProgress, settings } = useAppStore();
  const stats = getStats();
  const darkMode = settings.darkMode;
  
  const bgColor = darkMode ? COLORS.backgroundDark : COLORS.surface;
  const textColor = darkMode ? COLORS.textDark : COLORS.text;
  const secondaryColor = darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  
  const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <Card darkMode={darkMode} style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: secondaryColor }]}>{title}</Text>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Dashboard</Text>
          <Text style={[styles.subtitle, { color: secondaryColor }]}>
            WA Bulk Sender
          </Text>
        </View>
        
        <View style={styles.statsGrid}>
          <StatCard title="Total Contacts" value={stats.total} color={COLORS.primary} />
          <StatCard title="Sent" value={stats.sent} color={COLORS.success} />
          <StatCard title="Pending" value={stats.pending} color={COLORS.warning} />
          <StatCard title="Errors" value={stats.errors} color={COLORS.error} />
        </View>
        
        {sendProgress && (
          <Card darkMode={darkMode} style={styles.progressCard}>
            <Text style={[styles.progressTitle, { color: textColor }]}>
              Sending in Progress
            </Text>
            
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, { color: secondaryColor }]}>
                {sendProgress.current} of {sendProgress.total}
              </Text>
              {sendProgress.countdown !== undefined && (
                <Text style={[styles.countdown, { color: COLORS.primary }]}>
                  Next in {sendProgress.countdown}s
                </Text>
              )}
            </View>
            
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${(sendProgress.current / sendProgress.total) * 100}%`,
                  },
                ]}
              />
            </View>
            
            {sendProgress.currentContact && (
              <Text style={[styles.currentContact, { color: secondaryColor }]}>
                Current: {sendProgress.currentContact.name}
              </Text>
            )}
          </Card>
        )}
        
        <Card darkMode={darkMode} style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: textColor }]}>
            How to Use
          </Text>
          <Text style={[styles.infoText, { color: secondaryColor }]}>
            1. Import contacts from CSV/XLSX{'\n'}
            2. Create your message template{'\n'}
            3. Send messages via WhatsApp{'\n'}
            4. Track logs and retry failed sends
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 48) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
  },
  countdown: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  currentContact: {
    fontSize: 12,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
