import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

type Props = {
  uri: string;
  type?: 'video' | 'audio';
};

export function MediaPlayer({ uri, type = 'video' }: Props) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis ?? 0);
    if (status.durationMillis) setDuration(status.durationMillis);
    setIsLoading(false);
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  if (type === 'audio') {
    return (
      <View style={styles.audioContainer}>
        <Video
          ref={videoRef}
          source={{ uri }}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          style={{ width: 0, height: 0 }}
        />
        <TouchableOpacity onPress={togglePlay} style={styles.audioBtn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={COLORS.bg} />
        </TouchableOpacity>
        <View style={styles.audioInfo}>
          <Text style={styles.audioTime}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progress, { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }]}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        useNativeControls
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={COLORS.gold} size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', borderRadius: 8, overflow: 'hidden' },
  video: { width: '100%', height: '100%' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navyLight,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  audioBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioInfo: { flex: 1, gap: 6 },
  audioTime: { color: COLORS.textMuted, fontSize: 12 },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  progress: { height: 4, backgroundColor: COLORS.gold, borderRadius: 2 },
});
