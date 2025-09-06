import { useEffect } from 'react';
import { useStore } from '../store/gameStore';

const themes = {
  classic: {
    '--color-background': '#F6F7FB',
    '--color-text-main': '#111827',
    '--color-node-number-fill': '#2563EB',
    '--color-node-number-label': '#FFFFFF',
    '--color-node-number-stroke': '#1E40AF',
    '--color-node-letter-fill': '#10B981',
    '--color-node-letter-label': '#FFFFFF',
    '--color-node-letter-stroke': '#057A4F',
    '--color-path-committed': '#718096',
    '--color-path-active': 'rgba(148, 163, 184, 0.8)',
    '--color-hint-halo': 'rgba(245, 158, 11, 0.4)',
    '--color-node-next-border': '#F59E0B',
  },
  noir: {
    '--color-background': '#0B1220',
    '--color-text-main': '#E5E7EB',
    '--color-node-number-fill': '#60A5FA',
    '--color-node-number-label': '#0B1220',
    '--color-node-number-stroke': '#2563EB',
    '--color-node-letter-fill': '#34D399',
    '--color-node-letter-label': '#0B1220',
    '--color-node-letter-stroke': '#069668',
    '--color-path-committed': '#a0aec0',
    '--color-path-active': 'rgba(255, 255, 255, 0.75)',
    '--color-hint-halo': 'rgba(253, 230, 138, 0.4)',
    '--color-node-next-border': '#FDE68A',
  },
  undersea: {
    '--color-background': '#013A63',
    '--color-text-main': '#CAF0F8',
    '--color-node-number-fill': '#00B4D8',
    '--color-node-number-label': '#002133',
    '--color-node-number-stroke': '#0077B6',
    '--color-node-letter-fill': '#48CAE4',
    '--color-node-letter-label': '#002133',
    '--color-node-letter-stroke': '#0096C7',
    '--color-path-committed': '#5E7B8C',
    '--color-path-active': '#ADE8F4',
    '--color-hint-halo': 'rgba(144, 224, 239, 0.4)',
    '--color-node-next-border': '#90E0EF',
  },
  jungle: {
    '--color-background': '#0B2E13',
    '--color-text-main': '#DCFCE7',
    '--color-node-number-fill': '#22C55E',
    '--color-node-number-label': '#0B2E13',
    '--color-node-number-stroke': '#15803D',
    '--color-node-letter-fill': '#A3E635',
    '--color-node-letter-label': '#0B2E13',
    '--color-node-letter-stroke': '#65A30D',
    '--color-path-committed': '#6EE7B7',
    '--color-path-active': '#BBF7D0',
    '--color-hint-halo': 'rgba(245, 158, 11, 0.4)',
    '--color-node-next-border': '#F59E0B',
  }
};

const highContrastTheme = {
    '--color-background': '#000000',
    '--color-text-main': '#FFFFFF',
    '--color-node-number-fill': '#FFFF00',
    '--color-node-number-label': '#000000',
    '--color-node-number-stroke': '#FFFFFF',
    '--color-node-letter-fill': '#00FFFF',
    '--color-node-letter-label': '#000000',
    '--color-node-letter-stroke': '#FFFFFF',
    '--color-path-committed': '#FFFFFF',
    '--color-path-active': '#FFFF00',
    '--color-hint-halo': 'rgba(255, 0, 255, 0.5)',
    '--color-node-next-border': '#FF00FF',
};

const generateCss = () => `
  .committed-path { stroke: var(--color-path-committed); stroke-width: 3px; fill: none; stroke-linecap: round; stroke-linejoin: round; }
  .active-path { stroke: var(--color-path-active); stroke-width: 4px; fill: none; stroke-linecap: round; stroke-dasharray: 8 6; }
  .node-group { transition: transform 0.1s ease-out, opacity 0.2s ease-in-out; }
  .node-circle-hitbox { fill: transparent; cursor: pointer; }
  .node-circle-main { stroke-width: 2px; transition: all 0.2s ease-in-out; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1)); pointer-events: none; }
  .node-label { font-family: system-ui, sans-serif; font-weight: bold; font-size: calc(18px * var(--font-size-scale)); text-anchor: middle; pointer-events: none; user-select: none; }
  .node-number .node-circle-main { fill: var(--color-node-number-fill); stroke: var(--color-node-number-stroke); }
  .node-number .node-label { fill: var(--color-node-number-label); }
  .node-letter .node-circle-main { fill: var(--color-node-letter-fill); stroke: var(--color-node-letter-stroke); }
  .node-letter .node-label { fill: var(--color-node-letter-label); }
  .is-next .node-circle-main { stroke: var(--color-node-next-border); stroke-width: 4px; transform: scale(1.1); }
  .is-passed { opacity: 0.7; }
  .hint-halo { fill: var(--color-hint-halo); stroke: var(--color-hint-halo); stroke-width: 2; opacity: 0.5; pointer-events: none; animation: pulse 1.5s infinite ease-in-out; }
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.5); opacity: 0.2; }
    100% { transform: scale(1); opacity: 0.5; }
  }
  @media (prefers-reduced-motion: reduce) {
      .hint-halo { animation: none; }
      .node-group { transition: none; }
  }
`;

const ThemeManager = () => {
  const themeId = useStore(state => state.theme.id);
  const highContrast = useStore(state => state.theme.highContrast);
  const fontSizeScale = useStore(state => state.theme.fontSizeScale);
  
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = highContrast 
      ? highContrastTheme 
      : themes[themeId as keyof typeof themes] || themes.classic;

    for (const [key, value] of Object.entries(selectedTheme)) {
        root.style.setProperty(key, value);
    }
    
    root.style.setProperty('--font-size-scale', `${fontSizeScale}`);

    const styleId = 'trail-weave-dynamic-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = generateCss();

  }, [themeId, highContrast, fontSizeScale]);

  return null;
};

export default ThemeManager;