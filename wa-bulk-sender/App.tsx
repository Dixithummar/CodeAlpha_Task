/**
 * WA Bulk Sender - Main App Component
 * A production-ready bulk WhatsApp messenger with WhatsApp-style UI
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from './store/useAppStore';
import { COLORS } from './utils/constants';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { ContactsScreen } from './screens/ContactsScreen';
import { MessageScreen } from './screens/MessageScreen';
import { LogsScreen } from './screens/LogsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Simple icon component (replacing lucide-react-native for compatibility)
const TabIcon = ({ name, focused, color }: { name: string; focused: boolean; color: string }) => {
  const icons: Record<string, string> = {
    Dashboard: '📊',
    Contacts: '👥',
    Message: '💬',
    Logs: '📋',
    Settings: '⚙️',
  };
  
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, { opacity: focused ? 1 : 0.6 }]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
};

export default function App() {
  const { initializeApp, settings } = useAppStore();
  
  useEffect(() => {
    initializeApp();
  }, []);
  
  const darkMode = settings.darkMode;
  const theme = {
    dark: darkMode,
    colors: {
      primary: COLORS.primary,
      background: darkMode ? COLORS.backgroundDark : COLORS.background,
      card: darkMode ? COLORS.surfaceDark : COLORS.background,
      text: darkMode ? COLORS.textDark : COLORS.text,
      border: darkMode ? COLORS.borderDark : COLORS.border,
      notification: COLORS.primary,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900' as const,
      },
    },
  };
  
  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <NavigationContainer theme={theme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={route.name} focused={focused} color={color} />
            ),
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary,
            tabBarStyle: {
              backgroundColor: darkMode ? COLORS.surfaceDark : COLORS.background,
              borderTopColor: darkMode ? COLORS.borderDark : COLORS.border,
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: 'WA Bulk Sender' }}
          />
          <Tab.Screen
            name="Contacts"
            component={ContactsScreen}
            options={{ title: 'Contacts' }}
          />
          <Tab.Screen
            name="Message"
            component={MessageScreen}
            options={{ title: 'Compose' }}
          />
          <Tab.Screen
            name="Logs"
            component={LogsScreen}
            options={{ title: 'Activity Logs' }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
