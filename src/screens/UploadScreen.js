import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function UploadScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setVideoFile(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not pick video');
    }
  };

  const handleUpload = async () => {
    if (!title || !videoFile) {
      Alert.alert('Error', 'Title and video are required');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('video', {
        uri: videoFile.uri,
        type: videoFile.mimeType || 'video/mp4',
        name: videoFile.name || 'video.mp4',
      });

      const response = await fetch('https://streamvibe-server.onrender.com/api/videos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success! 🎉', 'Video uploaded successfully!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.message || 'Upload failed');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#1a0000', '#0f0f0f']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Video</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.content}>
        {/* Video Picker */}
        <TouchableOpacity style={styles.pickBtn} onPress={pickVideo}>
          {videoFile ? (
            <View style={styles.videoSelected}>
              <Ionicons name="checkmark-circle" size={40} color="#ff4444" />
              <Text style={styles.videoSelectedText}>{videoFile.name}</Text>
              <Text style={styles.videoSelectedSubText}>Tap to change</Text>
            </View>
          ) : (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={48} color="#ff4444" />
              <Text style={styles.pickBtnText}>Select Video</Text>
              <Text style={styles.pickBtnSubText}>MP4, MOV, AVI supported</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.label}>Video Title *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="text-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter video title"
            placeholderTextColor="#555"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your video..."
            placeholderTextColor="#555"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[styles.uploadBtn, loading && styles.uploadBtnDisabled]}
          onPress={handleUpload}
          disabled={loading}>
          {loading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.uploadBtnText}>Uploading...</Text>
            </View>
          ) : (
            <View style={styles.uploadingContainer}>
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.uploadBtnText}>Upload Video</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  content: { padding: 16 },
  pickBtn: {
    borderWidth: 2,
    borderColor: '#ff4444',
    borderStyle: 'dashed',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1a1a1a',
  },
  videoSelected: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1a0000',
  },
  pickBtnText: { color: '#ff4444', fontSize: 18, fontWeight: 'bold', marginTop: 12 },
  pickBtnSubText: { color: '#888', fontSize: 14, marginTop: 4 },
  videoSelectedText: { color: '#fff', fontSize: 14, marginTop: 8, textAlign: 'center' },
  videoSelectedSubText: { color: '#888', fontSize: 12, marginTop: 4 },
  label: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  textAreaContainer: { alignItems: 'flex-start', paddingVertical: 12 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', paddingVertical: 16, fontSize: 16 },
  textArea: { paddingVertical: 0, minHeight: 80, textAlignVertical: 'top' },
  uploadBtn: {
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  uploadBtnDisabled: { backgroundColor: '#882222' },
  uploadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  uploadBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});