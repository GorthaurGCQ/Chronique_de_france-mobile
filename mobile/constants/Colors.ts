// Palette identique au site web Chroniques de France
export const COLORS = {
  // Primaires
  gold: '#b8933a',
  goldLight: '#c9a84c',
  navy: '#0d1929',
  navyLight: '#1a2a3d',

  // Fond
  bg: '#0a1520',
  bgCard: '#1a2535',
  bgSection: '#0d1929',

  // Texte
  textWhite: '#ffffff',
  textGold: '#b8933a',
  textMuted: '#8896a5',
  textLight: '#c0c8d0',

  // Bordures
  border: 'rgba(184,147,58,0.3)',
  borderLight: 'rgba(255,255,255,0.1)',

  // Status
  success: '#4a7c59',
  error: '#c0392b',
};

const tintColorLight = COLORS.gold;
const tintColorDark = COLORS.gold;

export default {
  light: {
    text: COLORS.textWhite,
    background: COLORS.bg,
    tint: tintColorLight,
    tabIconDefault: COLORS.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: COLORS.textWhite,
    background: COLORS.bg,
    tint: tintColorDark,
    tabIconDefault: COLORS.textMuted,
    tabIconSelected: tintColorDark,
  },
};
