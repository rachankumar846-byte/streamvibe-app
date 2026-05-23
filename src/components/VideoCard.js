import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function VideoCard({ video, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail || 'https://via.placeholder.com/400x220/1a1a1a/ff4444?text=StreamVibe' }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={20} color="#fff" />
          </View>
        </View>
        <View style={styles.viewsBadge}>
          <Ionicons name="eye-outline" size={12} color="#fff" />
          <Text style={styles.viewsText}>{video.views || 0}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {video.uploader?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
          <Text style={styles.channel}>{video.uploader?.name || 'Unknown'}</Text>
          <View style={styles.stats}>
            <Ionicons name="heart-outline" size={12} color="#888" />
            <Text style={styles.statsText}>{video.likes?.length || 0} likes</Text>
            <Ionicons name="chatbubble-outline" size={12} color="#888" style={{ marginLeft: 8 }} />
            <Text style={styles.statsText}>{video.comments?.length || 0} comments</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#111',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,68,68,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewsBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  viewsText: { color: '#fff', fontSize: 11 },
  info: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  details: { flex: 1 },
  title: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  channel: { color: '#ff4444', fontSize: 12, marginBottom: 4 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statsText: { color: '#888', fontSize: 11 },
});