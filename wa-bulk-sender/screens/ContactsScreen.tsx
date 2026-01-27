/**
 * Contacts Screen - Manage and import contacts
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { ContactCard } from '../components/ContactCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { COLORS } from '../utils/constants';
import { Contact } from '../types';
import * as ImportService from '../services/import.service';
import { isValidPhone, normalizePhone } from '../utils/phoneValidator';

export const ContactsScreen: React.FC = () => {
  const { contacts, setContacts, deleteContact, clearContacts, settings } = useAppStore();
  const [importing, setImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<ImportService.ImportedData | null>(null);
  const [nameColumn, setNameColumn] = useState(0);
  const [phoneColumn, setPhoneColumn] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  
  const darkMode = settings.darkMode;
  const bgColor = darkMode ? COLORS.backgroundDark : COLORS.surface;
  const textColor = darkMode ? COLORS.textDark : COLORS.text;
  const secondaryColor = darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  
  const handleImport = async () => {
    try {
      setImporting(true);
      const result = await ImportService.pickDocument();
      
      if (result.canceled) {
        setImporting(false);
        return;
      }
      
      const asset = result.assets[0];
      const data = await ImportService.importFile(asset.uri, asset.mimeType);
      
      setImportData(data);
      setShowImportModal(true);
    } catch (error) {
      Alert.alert('Import Error', error instanceof Error ? error.message : 'Failed to import file');
    } finally {
      setImporting(false);
    }
  };
  
  const handleConfirmImport = () => {
    if (!importData) return;
    
    try {
      const newContacts = ImportService.convertToContacts(importData, nameColumn, phoneColumn);
      const validContacts = newContacts.filter(c => isValidPhone(c.phone));
      const uniqueContacts = ImportService.removeDuplicates([...contacts, ...validContacts]);
      
      setContacts(uniqueContacts);
      setShowImportModal(false);
      setImportData(null);
      
      Alert.alert('Success', `Imported ${validContacts.length} contacts`);
    } catch (error) {
      Alert.alert('Error', 'Failed to process contacts');
    }
  };
  
  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('Error', 'Please enter name and phone number');
      return;
    }
    
    if (!isValidPhone(newPhone)) {
      Alert.alert('Error', 'Invalid phone number');
      return;
    }
    
    const contact: Contact = {
      id: `contact_${Date.now()}`,
      name: newName.trim(),
      phone: normalizePhone(newPhone.trim(), settings.countryCode),
      sent: false,
    };
    
    setContacts([...contacts, contact]);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
  };
  
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteContact(id) },
      ]
    );
  };
  
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Contacts',
      'Are you sure you want to delete all contacts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearContacts },
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Contacts ({contacts.length})</Text>
        <View style={styles.actions}>
          <Button
            title="Import"
            onPress={handleImport}
            loading={importing}
            style={styles.actionButton}
          />
          <Button
            title="Add"
            onPress={() => setShowAddModal(true)}
            variant="secondary"
            style={styles.actionButton}
          />
          {contacts.length > 0 && (
            <Button
              title="Clear"
              onPress={handleClearAll}
              variant="danger"
              style={styles.actionButton}
            />
          )}
        </View>
      </View>
      
      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: secondaryColor }]}>
            No contacts yet. Import or add contacts to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onDelete={() => handleDelete(item.id)}
              darkMode={darkMode}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
      
      {/* Import Modal */}
      <Modal visible={showImportModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Card darkMode={darkMode} style={styles.modal}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Map Columns</Text>
            
            <ScrollView style={styles.modalContent}>
              <Text style={[styles.label, { color: secondaryColor }]}>Name Column:</Text>
              {importData?.headers.map((header, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.columnOption,
                    nameColumn === index && styles.selectedColumn,
                  ]}
                  onPress={() => setNameColumn(index)}
                >
                  <Text style={{ color: textColor }}>{header}</Text>
                </TouchableOpacity>
              ))}
              
              <Text style={[styles.label, { color: secondaryColor, marginTop: 16 }]}>
                Phone Column:
              </Text>
              {importData?.headers.map((header, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.columnOption,
                    phoneColumn === index && styles.selectedColumn,
                  ]}
                  onPress={() => setPhoneColumn(index)}
                >
                  <Text style={{ color: textColor }}>{header}</Text>
                </TouchableOpacity>
              ))}
              
              <Text style={[styles.label, { color: secondaryColor, marginTop: 16 }]}>
                Preview:
              </Text>
              {importData?.preview.map((row, index) => (
                <View key={index} style={styles.previewRow}>
                  <Text style={{ color: textColor }}>
                    {row[nameColumn]} - {row[phoneColumn]}
                  </Text>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setShowImportModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Import"
                onPress={handleConfirmImport}
                style={styles.modalButton}
              />
            </View>
          </Card>
        </View>
      </Modal>
      
      {/* Add Contact Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Card darkMode={darkMode} style={styles.modal}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Add Contact</Text>
            
            <TextInput
              style={[styles.input, { color: textColor, borderColor: COLORS.border }]}
              placeholder="Name"
              placeholderTextColor={secondaryColor}
              value={newName}
              onChangeText={setNewName}
            />
            
            <TextInput
              style={[styles.input, { color: textColor, borderColor: COLORS.border }]}
              placeholder="Phone Number"
              placeholderTextColor={secondaryColor}
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddModal(false);
                  setNewName('');
                  setNewPhone('');
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Add"
                onPress={handleAddContact}
                style={styles.modalButton}
              />
            </View>
          </Card>
        </View>
      </Modal>
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
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalContent: {
    maxHeight: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  columnOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedColumn: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  previewRow: {
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
});
