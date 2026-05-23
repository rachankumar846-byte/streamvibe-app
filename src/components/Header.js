 import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#0f0f0f', padding: 16, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
});
