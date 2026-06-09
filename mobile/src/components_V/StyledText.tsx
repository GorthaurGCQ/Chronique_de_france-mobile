/** Texte monospace SpaceMono — usage template Expo. */
// Composant : src/components_V/Themed.tsx
import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}
