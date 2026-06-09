/**
 * Détection et conversion d'URLs média pour le lecteur multi-plateforme.
 * YouTube/Vimeo → embed, fichiers locaux → expo-av, Google Drive → iframe.
 */
export type MediaKind = 'youtube' | 'vimeo' | 'video' | 'audio' | 'iframe' | 'external';

const FALLBACK_EMBED_ORIGIN = 'https://chroniques-de-france.app';

/** Origine HTTP valide pour les embeds WebView (YouTube exige Referer/origin — erreur 153 sinon). */
export function getEmbedOrigin(): string {
  const raw = process.env.EXPO_PUBLIC_API_URL;
  if (!raw) return FALLBACK_EMBED_ORIGIN;
  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_EMBED_ORIGIN;
  }
}

/** Identifie le type de média à partir de l'URL source. */
export function detectMediaKind(url: string): MediaKind {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
  if (/vimeo\.com/i.test(url)) return 'vimeo';
  if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(url)) return 'video';
  if (/\.(mp3|wav|aac|flac|ogg)(\?|$)/i.test(url)) return 'audio';
  if (/drive\.google\.com/i.test(url)) return 'iframe';
  return 'external';
}

export function toYouTubeEmbed(url: string, origin = getEmbedOrigin()): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (!match) return url;
  const videoId = match[1];
  const timeMatch = url.match(/[?&]t=(\d+)/);
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    origin,
  });
  if (timeMatch) params.set('start', timeMatch[1]);
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function toVimeoEmbed(url: string): string {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!match) return url;
  return `https://player.vimeo.com/video/${match[1]}?byline=0&portrait=0&playsinline=1`;
}

export function toDriveEmbed(url: string): string {
  return url.replace(/\/view(\?.*)?$/, '/preview');
}

/** Retourne l'URL d'intégration (iframe) adaptée au type de média détecté. */
export function getEmbedUrl(url: string, kind: MediaKind): string {
  if (kind === 'youtube') return toYouTubeEmbed(url);
  if (kind === 'vimeo') return toVimeoEmbed(url);
  if (kind === 'iframe') return toDriveEmbed(url);
  return url;
}

/**
 * Document HTML pour WebView native — envoie un Referer valide (fix YouTube erreur 153).
 * @see https://github.com/react-native-webview/react-native-webview/issues/3889
 */
export function buildEmbedWebViewDocument(embedUrl: string): { html: string; baseUrl: string } {
  const baseUrl = getEmbedOrigin();
  const safeUrl = embedUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  </style>
</head>
<body>
  <iframe
    src="${safeUrl}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
    allowfullscreen
    referrerpolicy="strict-origin-when-cross-origin"
    title="Média associé"
  ></iframe>
</body>
</html>`;
  return { html, baseUrl };
}

export function getMediaKindLabel(kind: MediaKind): string {
  switch (kind) {
    case 'youtube':
      return 'YouTube';
    case 'vimeo':
      return 'Vimeo';
    case 'video':
      return 'Vidéo';
    case 'audio':
      return 'Audio';
    case 'iframe':
      return 'Document';
    default:
      return 'Média';
  }
}
