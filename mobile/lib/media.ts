export type MediaKind = 'youtube' | 'vimeo' | 'video' | 'audio' | 'iframe' | 'external';

export function detectMediaKind(url: string): MediaKind {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
  if (/vimeo\.com/i.test(url)) return 'vimeo';
  if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(url)) return 'video';
  if (/\.(mp3|wav|aac|flac|ogg)(\?|$)/i.test(url)) return 'audio';
  if (/drive\.google\.com/i.test(url)) return 'iframe';
  return 'external';
}

export function toYouTubeEmbed(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (!match) return url;
  const videoId = match[1];
  const timeMatch = url.match(/[?&]t=(\d+)/);
  const time = timeMatch ? `&start=${timeMatch[1]}` : '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1${time}`;
}

export function toVimeoEmbed(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (!match) return url;
  return `https://player.vimeo.com/video/${match[1]}?byline=0&portrait=0`;
}

export function toDriveEmbed(url: string): string {
  return url.replace(/\/view(\?.*)?$/, '/preview');
}

export function getEmbedUrl(url: string, kind: MediaKind): string {
  if (kind === 'youtube') return toYouTubeEmbed(url);
  if (kind === 'vimeo') return toVimeoEmbed(url);
  if (kind === 'iframe') return toDriveEmbed(url);
  return url;
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
