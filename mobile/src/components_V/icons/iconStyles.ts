// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Module : src/components_V/icons/types.ts
import type { IconTone } from '@/components_V/icons/types';

export const ICON_STROKE_WIDTH = 1.75;

export const ICON_TONE_COLORS: Record<IconTone, string> = {
  gold: COLORS.gold,
  navy: '#1a2744',
  muted: COLORS.textMuted,
  inherit: COLORS.gold,
};

export function strokeProps(color: string) {
  return {
    stroke: color,
    strokeWidth: ICON_STROKE_WIDTH,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };
}
