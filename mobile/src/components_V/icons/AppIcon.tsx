// Module : node_modules/react-native
import { View, type ViewStyle } from 'react-native';
// Module : src/components_V/icons/IconBase.tsx
import { IconBase } from '@/components_V/icons/IconBase';
// Module : src/components_V/icons/iconStyles.ts
import { ICON_TONE_COLORS } from '@/components_V/icons/iconStyles';
// Module : src/components_V/icons/uiIcons.tsx
import { UI_ICONS } from '@/components_V/icons/uiIcons';
// Module : src/components_V/icons/types.ts
import type { IconName, IconTone } from '@/components_V/icons/types';

type Props = {
  name: IconName;
  size?: number;
  tone?: IconTone;
  color?: string;
  filled?: boolean;
  style?: ViewStyle;
};

export function AppIcon({
  name,
  size = 20,
  tone = 'gold',
  color,
  filled = false,
  style,
}: Props) {
  const IconContent = UI_ICONS[name];
  if (!IconContent) return null;

  const strokeColor = color ?? ICON_TONE_COLORS[tone];

  return (
    <View style={style}>
      <IconBase size={size} color={strokeColor}>
        {IconContent(strokeColor, filled)}
      </IconBase>
    </View>
  );
}

export type { IconName, IconTone };
