import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, FlatList, ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import VideoCard from '../components/VideoCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://streamvibe-server.onrender.com/api/videos/history',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.log('History error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: () => {
          dispatch(logout());
          navigation.replace('Login');
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a0000', '#0f0f0f']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.historyHeader}>
        <Ionicons name="time-outline" size={20} color="#ff4444" />
        <Text style={styles.historyTitle}>Watch History</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff4444" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <VideoCard
              video={item}
              onPress={() => navigation.navigate('VideoPlayer', { video: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={48} color="#333" />
              <Text style={styles.emptyText}>No watch history yet!</Text>
              <Text style={styles.emptySubText}>Videos you watch will appear here</Text>
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
  profileSection: { alignItems: 'center', padding: 24 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#ff6666',
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  email: { color: '#888', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#333', marginHorizontal: 16, marginBottom: 16 },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  historyTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  emptySubText: { color: '#888', fontSize: 14, marginTop: 8 },
});