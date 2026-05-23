import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert, Dimensions,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function VideoPlayerScreen({ route, navigation }) {
  const { video } = route.params;
  const { token, user } = useSelector(state => state.auth);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(video.comments || []);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [likes, setLikes] = useState(video.likes?.length || 0);
  const [isOwner] = useState(video.uploader?._id === user?.id);

  const player = useVideoPlayer(video.videoUrl, player => {
    player.loop = false;
  });

  const handleLike = async () => {
    try {
      const response = await fetch(
        `https://streamvibe-server.onrender.com/api/videos/${video._id}/like`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setLiked(data.liked);
      setLikes(data.likes);
    } catch (err) {
      console.log('Like error:', err.message);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(
        `https://streamvibe-server.onrender.com/api/auth/follow/${video.uploader._id}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setFollowing(data.following);
    } catch (err) {
      console.log('Follow error:', err.message);
    }
  };

  const handleComment = async () => {
    if (!comment) return;
    try {
      const response = await fetch(
        `https://streamvibe-server.onrender.com/api/videos/${video._id}/comment`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: comment }),
        }
      );
      if (response.ok) {
        setComments([...comments, { text: comment, user: { name: user.name } }]);
        setComment('');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not post comment');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Delete Video', 'Are you sure you want to delete this video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(
              `https://streamvibe-server.onrender.com/api/videos/${video._id}`,
              {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            if (response.ok) {
              Alert.alert('Deleted!', 'Video deleted successfully');
              navigation.replace('Home');
            }
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Video Player */}
      <VideoView
  player={player}
  style={styles.video}
  fullscreenOptions={{ allowsPictureInPicture: true }}
  nativeControls
/>

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.info}>
        {/* Title */}
        <Text style={styles.title}>{video.title}</Text>

        {/* Uploader Row */}
        <View style={styles.uploaderRow}>
          <View style={styles.uploaderLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {video.uploader?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.channel}>{video.uploader?.name}</Text>
              <Text style={styles.views}>
                <Ionicons name="eye-outline" size={12} color="#888" /> {video.views || 0} views
              </Text>
            </View>
          </View>
          {!isOwner && (
            <TouchableOpacity
              style={[styles.followBtn, following && styles.followingBtn]}
              onPress={handleFollow}>
              <Text style={styles.followBtnText}>
                {following ? '✓ Following' : '+ Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={liked ? "#ff4444" : "#fff"} />
            <Text style={[styles.actionText, liked && { color: '#ff4444' }]}>{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>{comments.length}</Text>
          </TouchableOpacity>

          {isOwner && (
            <TouchableOpacity style={[styles.actionBtn, styles.deleteActionBtn]} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={22} color="#ff4444" />
              <Text style={[styles.actionText, { color: '#ff4444' }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Description */}
        {video.description ? (
          <View style={styles.descriptionBox}>
            <Text style={styles.description}>{video.description}</Text>
          </View>
        ) : null}

        {/* Comments Section */}
        <Text style={styles.commentsTitle}>
          💬 Comments ({comments.length})
        </Text>

        <View style={styles.commentInputRow}>
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#555"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={styles.postBtn} onPress={handleComment}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {comments.map((c, i) => (
          <View key={i} style={styles.comment}>
            <View style={styles.commentHeader}>
              <View style={styles.smallAvatar}>
                <Text style={styles.smallAvatarText}>
                  {c.user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={styles.commentUser}>{c.user?.name || 'User'}</Text>
            </View>
            <Text style={styles.commentText}>{c.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  video: { width: width, height: 220, backgroundColor: '#000' },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  info: { padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  uploaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  uploaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  channel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  views: { color: '#888', fontSize: 12 },
  followBtn: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingBtn: { backgroundColor: '#333', borderWidth: 1, borderColor: '#555' },
  followBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
    paddingVertical: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deleteActionBtn: { borderWidth: 1, borderColor: '#ff4444' },
  actionText: { color: '#fff', fontSize: 14 },
  descriptionBox: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  description: { color: '#aaa', fontSize: 14, lineHeight: 20 },
  commentsTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 20,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  postBtn: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comment: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAvatarText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  commentUser: { color: '#ff4444', fontSize: 13, fontWeight: 'bold' },
  commentText: { color: '#ddd', fontSize: 14, lineHeight: 20 },
});