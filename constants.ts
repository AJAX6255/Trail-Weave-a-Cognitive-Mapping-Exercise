import type { PuzzleGenerationParams } from './types';

export const DEFAULTS: Omit<PuzzleGenerationParams, 'seed'> = {
  pairsCount: 8,
  width: 800,
  height: 600,
  padding: 50,
  minSeparation: 60,
};

export const SVG_VIEWBOX_WIDTH = DEFAULTS.width;
export const SVG_VIEWBOX_HEIGHT = DEFAULTS.height;
export const SNAP_RADIUS = 28;