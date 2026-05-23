import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
  StatusBar, TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setVideos, setLoading } from '../redux/slices/videoSlice';
import VideoCard from '../components/VideoCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector(state => state.video);
  const { token, user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('https://streamvibe-server.onrender.com/api/videos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      dispatch(setVideos(data));
    } catch (err) {
      console.log('Fetch videos error:', err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  };

  const handleVideoPress = async (video) => {
    try {
      await fetch(
        `https://streamvibe-server.onrender.com/api/videos/${video._id}/watch`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (err) {
      console.log('Watch history error:', err.message);
    }
    navigation.navigate('VideoPlayer', { video });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a0000" barStyle="light-content" />
      <LinearGradient
        colors={['#1a0000', '#0f0f0f']}
        style={styles.header}>
        <Text style={styles.logo}>StreamVibe 🎬</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Upload')}>
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff4444" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <VideoCard
              video={item}
              onPress={() => handleVideoPress(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ff4444"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="videocam-outline" size={60} color="#333" />
              <Text style={styles.emptyText}>No videos yet</Text>
              <Text style={styles.emptySubText}>Be the first to upload!</Text>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={() => navigation.navigate('Upload')}>
                <Text style={styles.uploadBtnText}>Upload Video</Text>
              </TouchableOpacity>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#ff4444' },
  headerIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 8 },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888', marginTop: 12, fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  emptySubText: { color: '#888', fontSize: 14, marginTop: 8, marginBottom: 24 },
  uploadBtn: { backgroundColor: '#ff4444', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  uploadBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});