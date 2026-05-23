import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import VideoCard from '../components/VideoCard';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { token } = useSelector(state => state.auth);

  const handleSearch = async () => {
    if (!query) return;
    try {
      setLoading(true);
      setSearched(true);
      const response = await fetch(
        `https://streamvibe-server.onrender.com/api/videos/search?q=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log('Search error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a0000', '#0f0f0f']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search videos..."
            placeholderTextColor="#555"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff4444" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <VideoCard
              video={item}
              onPress={() => navigation.navigate('VideoPlayer', { video: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {searched ? (
                <>
                  <Ionicons name="search-outline" size={48} color="#333" />
                  <Text style={styles.emptyText}>No results found</Text>
                  <Text style={styles.emptySubText}>Try a different search term</Text>
                </>
              ) : (
                <>
                  <Ionicons name="videocam-outline" size={48} color="#333" />
                  <Text style={styles.emptyText}>Search for videos</Text>
                  <Text style={styles.emptySubText}>Type something to search</Text>
                </>
              )}
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, color: '#fff', paddingVertical: 12, fontSize: 16 },
  searchBtn: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchBtnText: { color: '#fff', fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888', marginTop: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  emptySubText: { color: '#888', fontSize: 14, marginTop: 8 },
});