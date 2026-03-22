import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AdminHeader({ title, onAdd, onFilter, onSearch }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptySpace} />
      </View>

      <View style={styles.actionRow}>
        {onSearch && (
          <TouchableOpacity style={styles.iconBtn} onPress={onSearch}>
            <MaterialCommunityIcons name="magnify" size={20} color="#ff9e6b" />
          </TouchableOpacity>
        )}
        {onFilter && (
          <TouchableOpacity style={styles.iconBtn} onPress={onFilter}>
            <MaterialCommunityIcons name="filter-outline" size={20} color="#ff9e6b" />
          </TouchableOpacity>
        )}
        {onAdd && (
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  emptySpace: {
    width: 40,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: '#ff9e6b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});
