// Module : node_modules/react-native-svg
import Svg, { Path } from 'react-native-svg';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';

type Props = {
  size?: number;
  color?: string;
};

/** Ornement fleur de lys (brand) — remplace ⚜ */
export function FleurDeLys({ size = 20, color = COLORS.gold }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2c0 3-1.5 5-3 6.5C7.5 10 6 11 6 13c0 1.5 1 2.5 2.5 2.5.8 0 1.5-.3 2-.8.5.5 1.2.8 2 .8 1.5 0 2.5-1 2.5-2.5 0-2-1.5-3-3-4.5C13.5 7 12 5 12 2z"
        fill={color}
      />
      <Path
        d="M12 16v6M9 20h6"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
