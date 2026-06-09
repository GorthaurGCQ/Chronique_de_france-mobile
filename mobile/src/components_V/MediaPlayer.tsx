/**
 * Lecteur média multi-plateforme pour les ressources bibliothèque.
 * Web : iframe natif | Natif : WebView (embed) ou expo-av (fichiers directs).
 */
// Module : node_modules/react
import { useState, useRef } from 'react';
// Module : node_modules/react-native
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
// Module : node_modules/expo-av
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Service : src/lib/services/media.service.ts
import {
  detectMediaKind,
  getEmbedUrl,
  getMediaKindLabel,
  buildEmbedWebViewDocument,
  getEmbedOrigin,
} from '@/lib/services/media.service';
// Module : src/components_V/icons/index.ts
import { AppIcon } from '@/components_V/icons';

type Props = {
  url: string;
};

/** Lecteur audio/vidéo natif via expo-av (fichiers .mp4, .mp3, etc.). */
function NativeAvPlayer({ uri, type }: { uri: string; type: 'video' | 'audio' }) {
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
              style={[
                styles.progress,
                { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' },
              ]}
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

function WebEmbedFrame({ embedUrl }: { embedUrl: string }) {
  return (
    <View style={styles.videoContainer}>
      {/* iframe natif — react-native-webview ne fonctionne pas sur Expo Web */}
      <iframe
        src={embedUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title="Média associé"
      />
    </View>
  );
}

function NativeEmbedWebView({ embedUrl }: { embedUrl: string }) {
  const [isLoading, setIsLoading] = useState(true);
  // Module : node_modules/react-native-webview (require — chargement conditionnel natif)
  const { WebView } = require('react-native-webview') as typeof import('react-native-webview');
  const { html, baseUrl } = buildEmbedWebViewDocument(embedUrl);
  const referer = getEmbedOrigin();

  return (
    <View style={styles.videoContainer}>
      <WebView
        source={{
          html,
          baseUrl,
          headers: { Referer: referer },
        }}
        style={styles.webview}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        originWhitelist={['*']}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={COLORS.gold} size="large" />
        </View>
      )}
    </View>
  );
}

/** Sélectionne iframe (web) ou WebView (natif) pour YouTube, Vimeo, Drive. */
function EmbedPlayer({ embedUrl }: { embedUrl: string }) {
  if (Platform.OS === 'web') {
    return <WebEmbedFrame embedUrl={embedUrl} />;
  }
  return <NativeEmbedWebView embedUrl={embedUrl} />;
}

export function MediaPlayer({ url }: Props) {
  const kind = detectMediaKind(url);
  const [expanded, setExpanded] = useState(true);

  const openExternal = () => {
    Linking.openURL(url).catch(() => null);
  };

  if (kind === 'external') {
    return (
      <TouchableOpacity style={styles.externalBtn} onPress={openExternal}>
        <Ionicons name="open-outline" size={18} color={COLORS.gold} />
        <Text style={styles.externalBtnText}>Ouvrir le média dans le navigateur</Text>
      </TouchableOpacity>
    );
  }

  const embedKinds = kind === 'youtube' || kind === 'vimeo' || kind === 'iframe';

  const kindIcon = kind === 'youtube' || kind === 'vimeo' || kind === 'video'
    ? 'play'
    : kind === 'audio'
      ? 'music'
      : kind === 'iframe'
        ? 'link'
        : 'document';

  return (
    <View style={styles.mediaBlock}>
      <View style={styles.mediaBar}>
        <View style={styles.mediaBarTitleRow}>
          <AppIcon name={kindIcon} size={16} tone="gold" />
          <Text style={styles.mediaBarTitle}>{getMediaKindLabel(kind)}</Text>
        </View>
        <View style={styles.mediaBarActions}>
          <TouchableOpacity
            style={styles.mediaBarBtn}
            onPress={() => setExpanded((v) => !v)}
          >
            <View style={styles.mediaBarBtnInner}>
              <AppIcon name={expanded ? 'chevronUp' : 'chevronDown'} size={12} tone="inherit" color={COLORS.textLight} />
              <Text style={styles.mediaBarBtnText}>{expanded ? 'Réduire' : 'Afficher'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaBarBtn} onPress={openExternal}>
            <View style={styles.mediaBarBtnInner}>
              <AppIcon name="external" size={12} tone="inherit" color={COLORS.textLight} />
              <Text style={styles.mediaBarBtnText}>Ouvrir</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <View style={styles.mediaContent}>
          {embedKinds && <EmbedPlayer embedUrl={getEmbedUrl(url, kind)} />}
          {kind === 'video' && <NativeAvPlayer uri={url} type="video" />}
          {kind === 'audio' && <NativeAvPlayer uri={url} type="audio" />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mediaBlock: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  mediaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.navyLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  mediaBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  mediaBarTitle: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  mediaBarActions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  mediaBarBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  mediaBarBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mediaBarBtnText: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '600',
  },
  mediaContent: {
    backgroundColor: '#000',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  video: { width: '100%', height: '100%' },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navyLight,
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
  externalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.navyLight,
  },
  externalBtnText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '600',
  },
});
