// Module : node_modules/react
import type { ReactNode } from 'react';
// Module : node_modules/react-native-svg
import Svg from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  children: ReactNode;
};

/** Wrapper SVG outline 24×24 — react-native-svg */
export function IconBase({ size = 24, color, children }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" color={color}>
      {children}
    </Svg>
  );
}
