// FIX: Replaced incorrect content and circular dependency with correct type definitions.
export interface Point {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Puzzle {
  id: string;
  nodes: Record<string, Node>;
  order: string[];
}

export interface PuzzleGenerationParams {
  pairsCount: number;
  width: number;
  height: number;
  padding: number;
  minSeparation: number;
  seed: string;
}

export type GameState = 'start' | 'loading' | 'playing' | 'finished' | 'error';

export interface Session {
  puzzleId: string;
  startedAt: number;
  finishedAt: number | null;
  ms: number;
  errors: number;
  hints: number;
  path: string[];
}