export const FONT_FAMILIES = {
  HANDWRITTEN: '"Comic Neue", "Indie Flower", cursive',
  RETRO: '"VT323", monospace',
  PLAYFUL: '"Bubblegum Sans", cursive',
  CLASSIC: '"Roboto", sans-serif',
};

export const COLOR_PALETTES = {
  RETRO: {
    primary: '#FF6B6B',    // Coral Red
    secondary: '#4ECDC4',  // Turquoise
    accent: '#FFD166',     // Mustard Yellow
    background: '#F7FFF7', // Mint Cream
    text: '#1A535C',       // Dark Teal
  },
  PASTEL: {
    primary: '#FFB6B9',    // Light Pink
    secondary: '#BBDED6',   // Mint Green
    accent: '#FAE3D9',      // Peach
    background: '#FFF8F0',  // Cream
    text: '#61707D',        // Slate Blue
  },
  BOLD: {
    primary: '#E84855',    // Bright Red
    secondary: '#3185FC',   // Bright Blue
    accent: '#FFBC42',      // Bright Yellow
    background: '#FFFFFF',  // White
    text: '#403F4C',        // Dark Gray
  },
  NEON: {
    primary: '#FF00FF',    // Magenta
    secondary: '#00FFFF',   // Cyan
    accent: '#FFFF00',      // Yellow
    background: '#000000',  // Black
    text: '#FFFFFF',        // White
  },
};

export const DEFAULT_THEME = {
  fontFamily: FONT_FAMILIES.HANDWRITTEN,
  colors: COLOR_PALETTES.RETRO,
};