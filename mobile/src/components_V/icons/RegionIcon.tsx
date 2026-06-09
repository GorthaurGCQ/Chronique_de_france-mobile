// Module : node_modules/react-native
import { View, type ViewStyle } from 'react-native';
// Module : src/components_V/icons/IconBase.tsx
import { IconBase } from '@/components_V/icons/IconBase';
// Module : src/components_V/icons/iconStyles.ts
import { ICON_TONE_COLORS } from '@/components_V/icons/iconStyles';
// Module : src/components_V/icons/regionIcons.tsx
import { REGION_ICONS } from '@/components_V/icons/regionIcons';
// Module : src/components_V/icons/types.ts
import { REGION_NAME_TO_ICON, type RegionIconName, type IconTone } from '@/components_V/icons/types';

type Props = {
  region: string;
  size?: number;
  tone?: IconTone;
  color?: string;
  style?: ViewStyle;
};

export function getRegionIconName(region: string): RegionIconName | undefined {
  return REGION_NAME_TO_ICON[region];
}

export function RegionIcon({
  region,
  size = 32,
  tone = 'gold',
  color,
  style,
}: Props) {
  const iconName = REGION_NAME_TO_ICON[region];
  if (!iconName) return null;

  const IconContent = REGION_ICONS[iconName];
  const strokeColor = color ?? ICON_TONE_COLORS[tone];

  return (
    <View style={style}>
      <IconBase size={size} color={strokeColor}>
        {IconContent(strokeColor)}
      </IconBase>
    </View>
  );
}
